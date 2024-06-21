<script lang="ts">
import {defineComponent} from 'vue'
import ArticleShowcase from "@/components/vue/newsite/articles/ArticleShowcase.vue";
import Dialog from "primevue/dialog";
import FilterChips from "@/components/vue/articles/FilterChips.vue";
import SortOptionDropdown from "@/components/vue/articles/SortOptionDropdown.vue";
import ArticleFilterForm from "@/components/vue/articles/ArticleFilterForm.vue";
import axios from "axios";
import ShoppingCart from "@/components/ts/shoppingCart/ShoppingCart";

export default defineComponent({
    name: "Route.Index.vue",
    data() {
        return {
            filterChips: {},
            filterDialogVisible: false,
            isMobile: window.innerWidth <= 768,
            categories: [],
            categoriesLoaded: false,
            sortBy: new URLSearchParams(window.location.search).get('sort_by')
        }
    },
    components: {
        ArticleFilterForm,
        SortOptionDropdown,
        FilterChips,
        ArticleShowcase,
        Dialog
    },
    mounted() {
        window.addEventListener("resize", this.handleScreenSizeChange);
        this.loadCategories();
        const cart = ShoppingCart.getInstance();
        cart.setVariant("newsite");
        cart.bind();
    },
    methods: {
        loadCategories() {
            axios.get('/api/articles/categories').then(response => {
                this.categories = response.data.categories;
                this.categoriesLoaded = true;
            });
        },
        handleScreenSizeChange() {
            this.isMobile = window.innerWidth <= 768;
            if (!this.isMobile) {
                this.filterDialogVisible = false;
            }
        }
    }
})
</script>

<template>
    <h1 class="tracking-tight font-extrabold text-gray-900 dark:text-slate-100 text-5xl md:text-6xl text-center">Articles
        Overview</h1>
    <p class="mt-3 max-w-md mx-auto text-base text-gray-500 dark:text-slate-400 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
        Discover our articles below.</p>
    <br>
    <div class="w-full">
        <div class="grid gap-8 2xl:gap-12 px-8 relative w-full" style="grid-template-columns: 1fr auto minmax(0,1fr)">
            <div class="col-span-full md:col-span-1">
                <component :is="isMobile ? 'Dialog' : 'AppLayout'" v-model:visible="filterDialogVisible" modal
                           header="Configure Filters">
                    <article-filter-form
                        v-if="categoriesLoaded"
                        v-on:filter-chips="chips => filterChips = chips"
                        :categories="categories"
                        variant="newsite"
                    ></article-filter-form>
                </component>
            </div>
            <div class="col-span-full md:col-span-1 max-w-5xl">
                <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div class="flex flex-row gap-2 max-w-5xl:flex-wrap col-span-full">
                        <!-- Filter Chips -->
                        <filter-chips :filters="filterChips"></filter-chips>
                        <!-- Filter Button -->
                        <button @click="() => filterDialogVisible = isMobile"
                                class="md:hidden ml-auto bg-white text-slate-800 border border-slate-300 rounded p-2 aspect-square">
                            <svg class="mx-auto" width="24px" height="24px" stroke-width="1.5" viewBox="0 0 24 24"
                                 fill="none" xmlns="http://www.w3.org/2000/svg" color="#000000">
                                <path
                                    d="M3.99961 3H19.9997C20.552 3 20.9997 3.44764 20.9997 3.99987L20.9999 5.58569C21 5.85097 20.8946 6.10538 20.707 6.29295L14.2925 12.7071C14.105 12.8946 13.9996 13.149 13.9996 13.4142L13.9996 19.7192C13.9996 20.3698 13.3882 20.8472 12.7571 20.6894L10.7571 20.1894C10.3119 20.0781 9.99961 19.6781 9.99961 19.2192L9.99961 13.4142C9.99961 13.149 9.89425 12.8946 9.70672 12.7071L3.2925 6.29289C3.10496 6.10536 2.99961 5.851 2.99961 5.58579V4C2.99961 3.44772 3.44732 3 3.99961 3Z"
                                    stroke="#000000" stroke-width="1.5" stroke-linecap="round"
                                    stroke-linejoin="round"></path>
                            </svg>
                        </button>
                        <!-- Sort -->
                        <sort-option-dropdown class="md:ml-auto" :selected-sorting-option="sortBy" variant="newsite"></sort-option-dropdown>
                    </div>
                    <!-- Articles -->
                    <ArticleShowcase/>
                </div>
            </div>
            <div id="shopping-cart">
            </div>
        </div>
    </div>
</template>

<style scoped>

</style>
