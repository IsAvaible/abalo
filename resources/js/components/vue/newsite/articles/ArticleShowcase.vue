<script lang="ts">
import {defineComponent} from 'vue';
import axios from "axios";
import ArticleCard from "./ArticleCard.vue";
import Paginator, {PageState} from 'primevue/paginator';
import ShoppingCart from "@/components/ts/shoppingCart/ShoppingCart";
import Article from "@/models/Article";

export default defineComponent({
    name: "ArticleShowcase",
    components: {
        ArticleCard,
        Paginator
    },
    data() {
        const search = new URLSearchParams(window.location.search);
        return {
            loading: true,
            articles: [],
            error: false,
            totalRecords: 0,
            limit: parseInt(search.get('limit') ?? '6'),
            replacingUrl: false,
            currentPage: parseInt(search.get('page') ?? '0'),
        };
    },
    async created() {
        await this.updateArticles();
    },
    async mounted() {
        window.navigation.addEventListener("navigate", (event) => {
            if (event.destination.url === window.location.href) return;
            const destination = new URL(event.destination.url);
            if (destination.pathname.startsWith('/newsite/articles')) return;
            this.onNavigate(destination);
        });
    },
    methods: {
        async onNavigate(url: URL) {
            if (this.replacingUrl) return;
            this.currentPage = 0;
            this.limit = parseInt(url.searchParams.get('limit') ?? '6');
            this.updateURLParams(url);
            await this.updateArticles();
        },
        async updateArticles() {
            this.loading = true;
            this.scrollToTop();
            try {
                const params = {limit: this.limit, page: this.currentPage};
                for(const [key, value] of new URLSearchParams(window.location.search)) {
                    params[key] = value;
                }
                const response = await axios.get('/api/articles/search', {
                    params: params,
                    headers: { "Content-Type": "application/json" }
                });
                this.articles = response.data.articles;
                this.totalRecords = response.data.totalRecords;
                this.error = false;
            } catch (error) {
                this.error = true;
            }
            this.loading = false;
            this.currentPage = parseInt(new URLSearchParams(window.location.search).get('page') ?? '0');
            await new Promise(resolve => setTimeout(resolve, 0));
            this.$el.dispatchEvent(new Event('load'));
        },
        onPageChange(event: PageState) {
            this.currentPage = event.page;
            this.updateURLParams();
            this.updateArticles();
        },
        onRowsUpdate(event: number) {
            this.limit = event;
        },
        scrollToTop() {
            window.scroll({top: 0, behavior: 'smooth'});
        },
        updateURLParams(url: URL = new URL(window.location.href)) {
            if (this.limit === 6) {
                url.searchParams.delete('limit');
            } else {
                url.searchParams.set('limit', this.limit.toString());
            }
            if (this.currentPage === 0) {
                url.searchParams.delete('page');
            } else {
                url.searchParams.set('page', this.currentPage.toString());
            }
            this.replacingUrl = true;
            window.history.replaceState({}, '', url.toString());
            this.replacingUrl = false;
        },
        isInCart(article: Article) {
            return ShoppingCart.getInstance().isInCart(article);
        },
    }
});
</script>

<template>
    <section id="articles" aria-description="List of articles" class="col-span-full grid grid-cols-[inherit] gap-[inherit] 2xl:min-w-[1024px]">
        <div v-if="loading" role="status" class="col-span-full flex justify-center items-center aspect-square">
            <svg aria-hidden="true" class="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-slate-800" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
            </svg>
            <span class="sr-only">Loading...</span>
        </div>
        <ArticleCard
            v-else
            v-for="article in articles"
            :key="article.id"
            :article="article"
            :in-cart="isInCart(article)"
        />
        <div v-if="error" class="alert alert-error">
            An error occurred while loading the articles
        </div>
        <Paginator
            :rows="limit"
            :totalRecords="totalRecords"
            :first="currentPage * limit + 1"
            @page="onPageChange"
            :alwaysShow="true"
            @update:rows="onRowsUpdate"
            :rowsPerPageOptions="[6, 12, 24, 48]"
            class="col-span-full flex justify-center mt-4"
        />
    </section>
</template>

<style scoped>

</style>
