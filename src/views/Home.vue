<script setup>
import Repl from '@/components/Repl.vue'
</script>
<template>
  <main
    class="mt-28 mb-12 relative w-full px-6 py-12 bg-white md:max-w-3xl md:mx-auto lg:max-w-6xl lg:px-16 h-screen"
  >
    <div class="prose max-w-prose mx-auto lg:mx-16 md:mx-8 lg:prose-xl md:prose-lg prose-slate">
      <h1>Welcome to sMATT by Krutt</h1>
      <h2>An extension upon Salvatoshi's Merkleize All The Things smart contract framework</h2>
      <Repl />
      <div id="repl-output"></div>
    </div>
  </main>
</template>
