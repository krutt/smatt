<script setup lang="ts">
import { computed } from 'vue'
import { cn } from '@/lib/utils'

interface Props {
  class?: string
}

const props = withDefaults(defineProps<Props>(), {
  class: '',
})

const headerClass = computed(() => {
  return cn('flex flex-col space-y-1.5 p-6', props.class)
})
</script>

<template>
  <div :class="headerClass">
    <slot />
  </div>
</template>
