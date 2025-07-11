<script setup lang="ts">
import { computed } from 'vue'
import { cn } from '@/lib/utils'

interface Props {
  class?: string
}

const props = withDefaults(defineProps<Props>(), {
  class: '',
})

const cardClass = computed(() => {
  return cn(
    'rounded-lg border bg-card text-card-foreground shadow-sm',
    // Perplexity dark mode specific styling
    'dark:bg-[#1a1a1a] dark:border-[#2a2a2a] dark:text-[#e5e5e5]',
    props.class
  )
})
</script>

<template>
  <div :class="cardClass">
    <slot />
  </div>
</template>
