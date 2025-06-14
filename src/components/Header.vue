<script lang="ts" setup>
/* imports */
import Krutt from '@/assets/krutt.svg'
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
      <a href="/" class="flex items-center">
        <Krutt />
        <span class="font-lookTour self-center text-xl whitespace-nowrap dark:text-white"
          >smatt</span
        >
      </a>
      <div class="flex md:order-2">
        <button
          @click.prevent="menuOpen = !menuOpen"
          :aria-expanded="menuOpen"
          aria-controls="navbar-sticky"
          data-collapse-toggle="navbar-sticky"
          class="dark:focus:ring-gray-600 dark:hover:bg-gray-700 dark:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-200 inline-flex items-center hover:bg-gray-100 md:hidden p-2 rounded-lg text-gray-500 text-sm"
          type="button"
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
              aria-current="page"
              class="inline-flex py-2 pl-3 pr-4 text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 dark:text-white"
              to="/smatt/"
            >
              Home
            </RouterLink>
          </li>
          <li>
            <a
              @click.preventDefault="goToGitHub"
              class="inline-flex py-2 pl-3 pr-4 text-gray-700 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 md:dark:hover:text-white dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"
            >
              View on GitHub
              <GitHub class="h-6 ml-2 w-6" />
            </a>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>
