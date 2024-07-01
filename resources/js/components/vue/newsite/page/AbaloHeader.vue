<script lang="ts">
import {defineComponent} from 'vue'
import navigate from "@/util/navigate";

import SearchBar from "@/components/vue/page/SearchBar.vue";

import {
    Bell as IconBell,
    Heart as IconHeart,
    Home as IconHome,
    ProfileCircle as IconUser,
    SimpleCart as IconCart,
} from "@iconoir/vue";
import PopupMenu from "@/components/vue/newsite/page/PopupMenu.vue";


export default defineComponent({
    name: "AbaloHeader",
    components: {
        PopupMenu,
        SearchBar,

        IconHome,
        IconHeart,
        IconBell,
        IconCart,
        IconUser,
    },
    data: () => {
        return {
            menuOpen: false,
        }
    },
    methods: {
        navigate,
        toggleMenu(event) {
            this.$refs.menu.toggle(event);
        },
    }
})
</script>

<template>
    <header class="w-full p-6">
        <nav class="mx-auto grid grid-cols-3 max-w-5xl">
            <div>
                <a href="/newsite" @click.prevent="this.navigate($event.currentTarget)" class="flex flex-row gap-x-2 items-center text-2xl font-bold text-slate-800">
                    <img src="https://tailwindui.com/img/logos/mark.svg?color=black" alt="Logo" class="h-8">
                    <span class="max-sm:hidden">Abalo</span>
                </a>
            </div>
            <div class="flex flex-row justify-center items-center gap-x-6 max-sm:[&>*:not(:nth-child(2))]:hidden">
                <a href="/newsite" @click.prevent="this.navigate($event.currentTarget)" class="flex flex-row gap-x-1 bg-slate-900 text-white rounded-full px-4 py-1">
                    <IconHome class="w-6 h-6" />
                    Home
                </a>

                <search-bar variant="newsite"></search-bar>

                <a href="#" class="hover:scale-110 transition-transform">
                    <IconHeart class="w-6 h-6"/>
                </a>
                <a href="#" class="hover:scale-110 transition-transform">
                    <IconBell class="w-6 h-6" />
                </a>
            </div>
            <div class="flex flex-row justify-end items-center gap-x-4">
                <!-- Cart Button -->
                <a href="#" class="hover:scale-110 transition-transform">
                    <IconCart class="w-6 h-6" />
                </a>
                <!-- Profile Icon -->
                <a href="/newsite/profile" @click.prevent="this.navigate($event.currentTarget)" class="hover:scale-110 transition-transform">
                    <IconUser class="w-6 h-6" />
                </a>
                <!-- Hamburger Menu -->
                <div class="w-6 h-6 relative" :class="{'group': menuOpen}">
                    <button ref="hamburgerButton" @click="toggleMenu" class="transition-transform hover:scale-110" aria-haspopup="true" aria-controls="nav-menu-dialog">
                        <svg width="24px" height="24px" stroke-width="1.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" color="currentColor">
                            <path class="rounded-full transition group-focus-within:rotate-45 group-focus-within:translate-y-[0.08rem] group-focus-within:translate-x-[0.29rem] group-focus-within:scale-x-75 duration-300" d="M3 5H21" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                            <path class="group-focus-within:scale-x-0 origin-left group-focus-within:opacity-0 transition duration-150" d="M3 12H21" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                            <path class="rounded-full transition group-focus-within:-rotate-45 group-focus-within:translate-y-1 group-focus-within:-translate-x-[0.16rem] group-focus-within:scale-x-75 duration-300" d="M3 19H21" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                        </svg>
                    </button>
                    <PopupMenu ref="menu" id="nav-menu-dialog" v-model:open="menuOpen"/>
                </div>
            </div>
        </nav>
    </header>
</template>

<style scoped>

</style>
