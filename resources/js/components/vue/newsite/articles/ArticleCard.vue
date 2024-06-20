<script lang="ts">
import {defineComponent} from 'vue'

import type {Article} from "@/models/Article";
import formatNumberToEuro from "@/util/formatNumberToEuro";
import ShoppingCart from "@/components/ts/shoppingCart/ShoppingCart";

export default defineComponent({
    name: "ArticleCard",
    props: {
        article: {
            type: Object as () => Article,
            required: true
        },
        inCart: {
            type: Boolean,
            default: false
        }
    },
    data: () => ({
        PLACEHOLDER_IMAGE_PATH: "https://via.placeholder.com/300x300"
    }),
    computed: {
        imagePath() {
            return this.article.imagePath || this.PLACEHOLDER_IMAGE_PATH;
        },
        formattedPrice() {
            return formatNumberToEuro(this.article.ab_price);
        }
    },
    methods: {
        addToCart() {
            ShoppingCart.getInstance().addToCart(this.article);
        }
    }
})
</script>

<template>
    <div class="bg-white shadow-md rounded-lg flex flex-col">
        <div class="relative rounded-t-[inherit]">
            <img :src="imagePath" :alt="'image' + article.id" class="rounded-t-[inherit] aspect-square object-cover w-full" />
            <button
                class="absolute top-2 right-2 bg-white text-slate-800 hover:text-black opacity-80 [&:hover:not(:disabled)]:opacity-100 disabled:opacity-30 p-2 rounded disabled:cursor-not-allowed"
                title="Add to Cart"
                :data-article-id="article.id"
                @click="addToCart"
                :disabled="inCart"
            >
                <svg width="24px" height="24px" stroke-width="1.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="currentColor">
                    <path d="M3 6H22L19 16H6L3 6ZM3 6L2.25 3.5" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                    <path d="M9.99219 11H11.9922M13.9922 11H11.9922M11.9922 11V9M11.9922 11V13" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                    <path d="M11 19.5C11 20.3284 10.3284 21 9.5 21C8.67157 21 8 20.3284 8 19.5" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                    <path d="M17 19.5C17 20.3284 16.3284 21 15.5 21C14.6716 21 14 20.3284 14 19.5" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                </svg>
            </button>
        </div>
        <div class="p-2 flex flex-col gap-y-2 grow">
            <h3 class="text-lg font-semibold text-slate-800">{{ article.ab_name }}</h3>
            <p class="text-slate-600">{{ article.ab_description }}</p>
            <p class="text-slate-600 self-end mt-auto">{{ formattedPrice }}</p>
        </div>
    </div>
</template>

<style scoped>

</style>
