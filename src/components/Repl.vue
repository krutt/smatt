<script lang="ts" setup>
import {
  EditorView,
  drawSelection,
  highlightActiveLine,
  highlightSpecialChars,
  keymap,
  lineNumbers,
} from '@codemirror/view'
import Loading from '@/assets/loading.svg'
import Ready from '@/assets/ready.svg'
import Running from '@/assets/running.svg'
import { history, defaultKeymap, historyKeymap, indentWithTab } from '@codemirror/commands'
import { indentUnit } from '@codemirror/language'
import { styling } from '@/components/codemirror-styling'
import Textarea from '@/components/ui/Textarea.vue'
import Button from '@/components/ui/Button.vue'
import Card from '@/components/ui/Card.vue'
import CardHeader from '@/components/ui/CardHeader.vue'
import CardContent from '@/components/ui/CardContent.vue'

let worker
let inputData
let waitFlag
let interruptBuffer

let ready = ref(false)
let encoder = new TextEncoder()

let props = { id: 'temp' } // TODO: defineProps
// let slots = useSlots()
let storageKey = computed(() => `code-editor-${props.id}`)

let mounted = ref(false)
let running = ref(false)
let waitingForInput = ref(false)

let anchor = ref()
let parent = ref()
let input = ref()
let initialCode = ''
let code = ref('')
let editor
let useCodeMirror = ref(true) // Toggle between CodeMirror and Textarea

onMounted(() => {
  // initialize one worker per session shared by all editor instances
  if (!worker) {
    worker = new Worker(new URL('@/workers/mattvm.ts', import.meta.url), { type: 'module' })
    let inputBuffer = new SharedArrayBuffer(1024)
    inputData = new Uint8Array(inputBuffer)
    let waitBuffer = new SharedArrayBuffer(4)
    waitFlag = new Int32Array(waitBuffer)
    interruptBuffer = new Uint8Array(new SharedArrayBuffer(1))

    worker.addEventListener(
      'message',
      () => {
        ready.value = true
        worker.postMessage({ inputBuffer, waitBuffer, interruptBuffer })
      },
      { once: true }
    )
  }
  worker.addEventListener('message', handleMessage)

  let prev = anchor.value?.previousElementSibling
  let codeElement = prev?.classList.contains('language-python') ? prev : null
  initialCode = ''
  codeElement?.setAttribute('hidden', '')

  // Initialize CodeMirror editor
  if (useCodeMirror.value) {
    editor = new EditorView({
      extensions: [
        highlightSpecialChars(),
        history(),
        drawSelection(),
        keymap.of([...defaultKeymap, ...historyKeymap, indentWithTab]),
        lineNumbers(),
        highlightActiveLine(),
        indentUnit.of('    '),
        styling,
      ],
      parent: parent.value,
      doc: localStorage.getItem(storageKey.value) ?? initialCode,
    })
  } else {
    // Load saved code from localStorage for textarea
    code.value = localStorage.getItem(storageKey.value) ?? initialCode
  }

  document.addEventListener('visibilitychange', () => {
    if (useCodeMirror.value && editor) {
      save(editor.state.doc.toString())
    } else {
      save(code.value)
    }
  })

  mounted.value = true
})

onUnmounted(() => {
  if (useCodeMirror.value && editor) {
    save(editor.state.doc.toString())
    editor.destroy()
  } else {
    save(code.value)
  }
  worker.removeEventListener('message', handleMessage)
})

async function handleMessage(e) {
  if (e.data.id !== props.id) return

  if (e.data.input) {
    waitingForInput.value = true
    await nextTick()
    input.value?.focus()
  }
  if (e.data.output) updateOutput(e.data.output)
  if (e.data.done) running.value = false
}

let inputText = ref('')
watchEffect(() => {
  if (input.value) input.value.style.width = `${inputText.value.length + 1}ch`
})

function handleInput() {
  waitingForInput.value = false

  let inputArry = encoder.encode(inputText.value ?? '')
  inputText.value = ''

  Atomics.store(inputData, 0, inputArry.length)
  for (let i = 0; i < inputArry.length; i++) Atomics.store(inputData, i + 1, inputArry[i])

  Atomics.store(waitFlag, 0, 1)
  Atomics.notify(waitFlag, 0)
  Atomics.store(waitFlag, 0, 0)
}

let buttonText = computed(() =>
  ready.value ? (running.value ? 'Running code...' : 'Run code') : 'Loading Pyodide...'
)

let outputLines = computed(() => {
  let lines = output.value.map(l => l.join(''))
  if (lines[lines.length - 1] === '' && !waitingForInput.value) lines.pop()
  return lines.length === 0 ? [''] : lines
})

function run() {
  let codeToRun = useCodeMirror.value && editor ? editor.state.doc.toString() : code.value
  save(codeToRun)
  resetOutput()
  running.value = true
  interruptBuffer[0] = 0
  worker.postMessage({ id: props.id, code: codeToRun })
}

function reset() {
  if (running.value) {
    // workaround needing to input before interrupt
    if (waitingForInput.value) handleInput()

    interruptBuffer[0] = 2 // use SIGINT to stop running
    return
  }
  localStorage.removeItem(storageKey.value)
  if (useCodeMirror.value && editor) {
    editor.dispatch({
      changes: { from: 0, to: editor.state.doc.length, insert: initialCode },
      selection: { anchor: 0 },
      scrollIntoView: true,
    })
    editor.focus()
  } else {
    code.value = initialCode
  }
  resetOutput()
}

function save(codeToSave) {
  if (codeToSave === initialCode) localStorage.removeItem(storageKey.value)
  else localStorage.setItem(storageKey.value, codeToSave)
}

let output = ref([])
let outputWidth = 72
let outputRow = 0
let outputCol = 0

function updateOutput(raw) {
  for (let c of raw) {
    if (c === '\n') {
      outputRow++
      outputCol = 0
      output.value[outputRow] = Array.from({ length: outputWidth })
      continue
    }
    if (c === '\b') {
      outputCol--
      if (outputCol < 0) {
        outputRow--
        outputCol = outputWidth - 1
      }
      if (outputRow < 0) {
        outputRow = 0
        outputCol = 0
      }
      continue
    }
    output.value[outputRow][outputCol] = c
    outputCol++
  }
}

function resetOutput() {
  output.value = [Array.from({ length: outputWidth })]
  outputRow = 0
  outputCol = 0
}

function switchEditor() {
  // Save current code before switching
  let currentCode = useCodeMirror.value && editor ? editor.state.doc.toString() : code.value

  useCodeMirror.value = !useCodeMirror.value

  if (useCodeMirror.value) {
    // Switch to CodeMirror
    nextTick(() => {
      if (parent.value) {
        editor = new EditorView({
          extensions: [
            highlightSpecialChars(),
            history(),
            drawSelection(),
            keymap.of([...defaultKeymap, ...historyKeymap, indentWithTab]),
            lineNumbers(),
            highlightActiveLine(),
            indentUnit.of('    '),
            styling,
          ],
          parent: parent.value,
          doc: currentCode,
        })
      }
    })
  } else {
    // Switch to Textarea
    if (editor) {
      editor.destroy()
      editor = null
    }
    code.value = currentCode
  }
}
</script>

<template>
  <div ref="anchor" class="space-y-4">
    <!-- Editor Toggle -->
    <div class="flex justify-between items-center">
      <h3 class="text-sm font-medium text-muted-foreground">Code Editor</h3>
      <Button variant="outline" size="sm" @click="switchEditor" class="text-xs">
        Switch to {{ useCodeMirror ? 'Textarea' : 'CodeMirror' }}
      </Button>
    </div>

    <!-- CodeMirror Editor -->
    <div v-if="useCodeMirror" class="wrapper">
      <div ref="parent" />
      <Button
        v-if="mounted"
        class="absolute top-3 right-3 w-10 h-10 p-0"
        variant="outline"
        @click="run"
        :disabled="running || !ready"
        :title="buttonText"
      >
        <span class="sr-only">{{ buttonText }}</span>
        <Running v-if="running" class="w-5 h-5" />
        <Ready v-else-if="ready" class="w-5 h-5" />
        <Loading v-else class="w-5 h-5" />
      </Button>
    </div>

    <!-- shadcn/vue Textarea Editor -->
    <Card v-else class="relative">
      <CardContent class="p-0">
        <Textarea
          v-model="code"
          placeholder="Enter your Python code here..."
          :rows="15"
          resize="none"
          class="min-h-[400px] font-mono text-sm border-0 rounded-none focus-visible:ring-0 focus-visible:ring-offset-0 dark:bg-[#1a1a1a] dark:text-[#e5e5e5] dark:placeholder:text-[#8a8a8a]"
        />
        <Button
          v-if="mounted"
          class="absolute top-3 right-3 w-10 h-10 p-0"
          variant="outline"
          @click="run"
          :disabled="running || !ready"
          :title="buttonText"
        >
          <span class="sr-only">{{ buttonText }}</span>
          <Running v-if="running" class="w-5 h-5" />
          <Ready v-else-if="ready" class="w-5 h-5" />
          <Loading v-else class="w-5 h-5" />
        </Button>
      </CardContent>
    </Card>

    <!-- Output Section -->
    <Card>
      <CardHeader class="pb-2">
        <h3 class="text-sm font-medium text-muted-foreground">Output</h3>
      </CardHeader>
      <CardContent class="pt-0">
        <div class="output-container">
          <code v-for="(line, i) in outputLines" :key="i" class="output-line">
            {{ line }}<br v-if="i != outputLines.length - 1" />
          </code>
          <input
            v-if="waitingForInput"
            ref="input"
            v-model="inputText"
            @keydown.enter="handleInput"
            type="text"
            class="input-field"
          />
        </div>
        <Button v-if="mounted" variant="ghost" size="sm" class="mt-2 text-xs" @click="reset">
          {{ running ? 'Stop running' : 'Reset editor' }}
        </Button>
      </CardContent>
    </Card>
  </div>
</template>

<style scoped>
/* CodeMirror Styles */
div.wrapper {
  position: relative;
  margin: 16px -24px;
}

:deep(.cm-editor) {
  font-size: var(--vp-code-font-size);
  background-color: var(--vp-code-block-bg);
}

:deep(.cm-editor.cm-focused) {
  outline: 1px solid var(--vp-c-brand-1);
}

:deep(.cm-scroller) {
  scrollbar-width: thin;
  overflow: auto;
}

:deep(.cm-editor .cm-content) {
  font-family: var(--vp-font-family-mono);
  padding: 20px 0;
}

:deep(.cm-editor .cm-gutters) {
  font-family: var(--vp-font-family-mono);
  color: var(--vp-code-line-number-color);
  background-color: var(--vp-code-block-bg);
  border-right: 1px solid var(--vp-code-block-divider-color);
  width: 32px;
  justify-content: center;
  border-top-left-radius: 8px;
  border-bottom-left-radius: 8px;
}

:deep(.cm-editor .cm-gutterElement) {
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 0;
  padding: 0;
}

:deep(.cm-editor .cm-line) {
  padding: 0 72px 0 24px;
  line-height: var(--vp-code-line-height);
}

:deep(.cm-editor .cm-activeLine) {
  background-color: var(--vp-code-line-highlight-color);
}

/* Button Styles */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}

/* Output Styles */
.output-container {
  background-color: #1a1a1a;
  border-radius: 6px;
  padding: 16px;
  font-family: ui-monospace, 'Menlo', 'Monaco', 'Consolas', 'Liberation Mono', 'Courier New',
    monospace;
  font-size: 14px;
  line-height: 1.5;
  overflow: auto;
  white-space: nowrap;
  min-height: 100px;
  border: 1px solid #2a2a2a;
}

.output-line {
  color: #e5e5e5;
  background: none;
  width: 100%;
  white-space: pre;
  cursor: default;
  display: block;
}

.output-line:last-of-type {
  width: fit-content;
}

.input-field {
  font-family: ui-monospace, 'Menlo', 'Monaco', 'Consolas', 'Liberation Mono', 'Courier New',
    monospace;
  font-size: 14px;
  background: transparent;
  border: none;
  outline: none;
  color: #e5e5e5;
  padding: 0;
  margin: 0;
  width: auto;
  min-width: 1ch;
}

.input-field:focus {
  outline: none;
}

/* Dark mode specific styles */
:deep(.dark) .output-container {
  background-color: #1a1a1a;
  border-color: #2a2a2a;
}

:deep(.dark) .output-line {
  color: #e5e5e5;
}

:deep(.dark) .input-field {
  color: #e5e5e5;
}

/* Perplexity-style scrollbar */
.output-container::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

.output-container::-webkit-scrollbar-track {
  background: #1a1a1a;
}

.output-container::-webkit-scrollbar-thumb {
  background: #3a3a3a;
  border-radius: 4px;
}

.output-container::-webkit-scrollbar-thumb:hover {
  background: #4a4a4a;
}

/* Textarea styling for Perplexity dark mode */
:deep(textarea) {
  background-color: #1a1a1a !important;
  color: #e5e5e5 !important;
  border-color: #2a2a2a !important;
}

:deep(textarea:focus) {
  border-color: #4a4a4a !important;
  box-shadow: 0 0 0 2px rgba(74, 74, 74, 0.2) !important;
}

:deep(textarea::placeholder) {
  color: #8a8a8a !important;
}

/* Responsive styles */
@media (min-width: 640px) {
  div.wrapper {
    margin: 16px 0;
  }

  :deep(.cm-editor),
  div.output {
    border-radius: 8px;
  }
}
</style>
