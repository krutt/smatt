<script setup lang="ts">
import { computed } from 'vue'
import { cn } from '@/lib/utils'

interface Props {
  modelValue?: string
  placeholder?: string
  disabled?: boolean
  class?: string
  rows?: number
  resize?: 'none' | 'both' | 'horizontal' | 'vertical'
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  placeholder: '',
  disabled: false,
  class: '',
  rows: 3,
  resize: 'vertical',
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const textareaClass = computed(() => {
  return cn(
    'flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
    `resize-${props.resize}`,
    // Perplexity dark mode specific styling
    'dark:bg-[#1a1a1a] dark:border-[#2a2a2a] dark:text-[#e5e5e5] dark:placeholder:text-[#8a8a8a]',
    'dark:focus-visible:ring-[#3a3a3a] dark:focus-visible:border-[#4a4a4a]',
    'dark:hover:border-[#3a3a3a] transition-colors duration-200',
    props.class
  )
})

const handleInput = (event: Event) => {
  const target = event.target as HTMLTextAreaElement
  emit('update:modelValue', target.value)
}
</script>

<template>
  <textarea
    :value="modelValue"
    :placeholder="placeholder"
    :disabled="disabled"
    :rows="rows"
    :class="textareaClass"
    @input="handleInput"
  />
</template>
