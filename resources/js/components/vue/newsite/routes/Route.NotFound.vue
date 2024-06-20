<script lang="ts">
import {defineComponent} from 'vue'

export default defineComponent({
    name: "Route.NotFound.vue"
})
</script>

<template>
    <div class="full-body-route">
        <h1 class="mb-4 text-7xl tracking-tight font-extrabold lg:text-9xl">404</h1>
        <p class="mb-4 text-3xl tracking-tight font-bold text-gray-900 md:text-4xl">Something's missing.</p>
        <p class="mb-4 text-lg font-light text-gray-500">Sorry, we can't find that page. You'll find lots to explore on the home page. </p>
        <a href="/newsite" class="inline-flex text-white bg-slate-800 hover:bg-black focus:ring-4 focus:outline-none focus:ring-slate-500 font-medium rounded-lg text-sm px-5 py-2.5 text-center my-4">Back to Homepage</a>
    </div>
</template>

<style scoped>

</style>
