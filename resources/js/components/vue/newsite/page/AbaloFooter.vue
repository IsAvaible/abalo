<script lang="ts">
import {defineComponent} from 'vue'
import navigate from "@/util/navigate";

export default defineComponent({
    name: "AbaloFooter",
    data() {
        return {
            copyrightDate: new Date().getFullYear(),
            copyrightLink: "https://abalo.dev",
            copyrightName: "Simon Felix Conrad & Dennis Costa Wolff"
        }
    },
    methods: {
        navigate(target: EventTarget) {
            navigate(target as HTMLAnchorElement);
        },
        scrollToTop() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            })
        },
    },
})
</script>

<template>
    <footer class="w-full mt-auto p-4 bg-white dark:text-slate-400 dark:bg-slate-800 rounded-lg shadow flex flex-col items-center gap-y-2 md:flex-row md:justify-between md:p-6 z-10">
        <span class="text-sm text-gray-500 dark:text-gray-400 lg:flex-1 order-last md:order-first">
            © {{copyrightDate}} <a :href=copyrightLink target="_blank" referrerpolicy="strict-origin-when-cross-origin" class="hover:underline">{{copyrightName}}</a>
        </span>
        <div class="lg:flex-1 text-center hidden lg:inline">
            <button @click="scrollToTop" class="text-sm text-center text-gray-500 dark:text-slate-400 hover:underline cursor-pointer">
                Scroll to Top
            </button>
        </div>
        <ul class="flex flex-wrap justify-center lg:justify-end text-sm text-gray-500 dark:text-gray-400 lg:flex-1 gap-x-4 md:gap-x-6">
            <li>
                <a href="/newsite/privacy" @click.prevent="this.navigate($event.target)" class="hover:underline cursor-pointer">Privacy Policy</a>
            </li>
            <li>
                <a href="/newsite/licensing" @click.prevent="this.navigate($event.target)" class="hover:underline cursor-pointer">Licensing</a>
            </li>
            <li>
                <a href="/newsite/imprint" @click.prevent="this.navigate($event.target)" class="hover:underline cursor-pointer">Imprint</a>
            </li>
        </ul>
    </footer>
</template>

<style scoped>

</style>
