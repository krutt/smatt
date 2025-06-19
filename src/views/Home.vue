<script lang="ts" setup>
import Repl from '@/components/Repl.vue'

let address: Ref<string> = ref('')
let alby = useAlby()
onMounted(async () => {
  await alby.connectWallet()
  address.value = alby.address
})
</script>
<template>
  <main
    class="mt-28 mb-12 relative w-full px-6 py-12 bg-white md:max-w-3xl md:mx-auto lg:max-w-6xl lg:px-16 h-screen"
  >
    <div>
      {{ address }}
    </div>
    <Repl />
  </main>
</template>
