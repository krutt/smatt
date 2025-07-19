<script lang="ts" setup>
import { RouterView } from 'vue-router'
import Header from '@/components/Header.vue'
</script>
<template>
  <Header />
  <RouterView />
  <Toaster />
</template>
