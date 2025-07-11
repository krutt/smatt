/* ~~/src/workers/mattvm.ts */

// imports
import { loadPyodide } from 'pyodide'

const pyodide = await loadPyodide({
  indexURL: import.meta.env.BASE_URL,
  stderr: () => console.error,
  stdout: () => console.log,
})
await pyodide.loadPackage('/smatt/pymatt-0.0.1-py3-none-any.whl', { checkIntegrity: true })

const decoder: TextDecoder = new TextDecoder()
let inputData = null
let waitFlag = null

onmessage = async (event: MessageEvent) => {
  if (event.data.inputBuffer && event.data.waitBuffer && event.data.interruptBuffer) {
    inputData = new Uint8Array(event.data.inputBuffer)
    waitFlag = new Int32Array(event.data.waitBuffer)
    pyodide.setInterruptBuffer(event.data.interruptBuffer)
    return
  }
  const { id, code } = event.data
  pyodide.setStdout({
    write: buf => {
      postMessage({ id, output: decoder.decode(buf) })
      return buf.length
    },
  })
  pyodide.setStdin({
    stdin: () => {
      postMessage({ id, input: true })
      Atomics.wait(waitFlag, 0, 0)
      const inputArray = new Uint8Array(Number(Atomics.load(inputData, 0)))
      for (let i = 0; i < inputArray.length; i++) inputArray[i] = Number(Atomics.load(inputData, i + 1))
      const inputText = decoder.decode(inputArray)
      postMessage({ id, output: `${inputText}\n` })
      return inputText
    },
  })
  try {
    // https://github.com/pyodide/pyodide/issues/703#issuecomment-1937774811
    const dict = pyodide.globals.get('dict')
    const globals = dict()
    await pyodide.runPythonAsync(code, { filename: '<editor>', globals, locals: globals })
    globals.destroy()
    dict.destroy()
  } catch (error) {
    if (error instanceof Error && error.constructor.name === 'PythonError') {
      let lines = error.message.split('\n')
      let output = lines.slice(lines.findIndex(line => line.includes('File "<editor>"'))).join('\n')
      if (!output.endsWith('KeyboardInterrupt\n')) postMessage({ id, output })
    } else {
      throw error
    }
  } finally {
    postMessage({ id, done: true })
  }
}

postMessage({})
