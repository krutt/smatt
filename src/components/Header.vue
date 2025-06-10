<script setup>
/* imports */
import GitHub from '@/assets/github.svg'
import Hamburger from '@/assets/hamburger.svg'

/* funcs */
let goToGitHub = () => {
  window.open('https://github.com/krutt/smatt', '_blank')
}

/* refs */
let menuOpen = ref(false)
</script>

<template>
  <nav
    class="bg-white mt-0 px-2 sm:px-4 py-2.5 dark:bg-gray-900 fixed w-full z-20 top-0 left-0 border-b border-gray-200 dark:border-gray-600"
  >
    <div class="container flex flex-wrap items-center justify-between mx-auto">
      <a href="/smatt/" class="flex items-center">
        <span class="self-center text-xl font-semibold whitespace-nowrap dark:text-white"
          >sMATT</span
        >
      </a>
      <div class="flex md:order-2">
        <button
          @click.prevent="menuOpen = !menuOpen"
          data-collapse-toggle="navbar-sticky"
          type="button"
          class="inline-flex items-center p-2 text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
          aria-controls="navbar-sticky"
          :aria-expanded="menuOpen"
        >
          <span class="sr-only">Open main menu</span>
          <Hamburger aria-hidden="true" class="w-6 h-6" />
        </button>
      </div>
      <div
        :class="{ hidden: !menuOpen }"
        class="items-center justify-between w-full md:flex md:w-auto md:order-1"
        id="navbar-sticky"
      >
        <ul
          class="flex flex-col p-4 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 md:mt-0 md:text-sm md:font-medium md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700"
        >
          <li>
            <RouterLink
              to="/"
              class="block py-2 pl-3 pr-4 text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 dark:text-white"
              aria-current="page"
            >
              Home
            </RouterLink>
          </li>
          <li>
            <a
              @click.preventDefault="goToGitHub"
              class="block py-2 pl-3 pr-4 text-gray-700 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 md:dark:hover:text-white dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
            >
              View on GitHub
              <GitHub />
            </a>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>
