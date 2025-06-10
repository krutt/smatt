<script setup>
import GithubIcon from '@/assets/github.svg'
</script>
<template>
  <footer class="bg-white dark:bg-gray-900">
    <div class="px-4 py-6 bg-gray-100 dark:bg-gray-700 md:flex md:items-center md:justify-between">
      <span class="text-sm text-gray-500 dark:text-gray-300 sm:text-center"
        >Created by <a href="https://krutt.fi">Sitt Guruvanich</a>.
      </span>
      <div class="flex mt-4 space-x-6 sm:justify-center md:mt-0">
        <a
          href="https://github.com/aekasitt"
          class="text-gray-400 hover:text-gray-900 dark:hover:text-white"
        >
          <GithubIcon class="w-5 h-5" />
          <span class="sr-only">GitHub account</span>
        </a>
      </div>
    </div>
  </footer>
</template>
