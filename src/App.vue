<script lang="ts" setup>
import { RouterView } from 'vue-router'
import { onMounted } from 'vue'
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'

// Enable dark mode by default for Perplexity-like appearance
onMounted(() => {
  document.documentElement.classList.add('dark')
})
</script>
<template>
  <div class="min-h-screen bg-background text-foreground">
    <Header />
    <RouterView />
    <Footer />
    <Toaster />
  </div>
</template>
