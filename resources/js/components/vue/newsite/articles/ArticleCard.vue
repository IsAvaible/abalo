<script lang="ts">
import {defineComponent} from 'vue'

import type {Article} from "@/models/Article";
import formatNumberToEuro from "@/util/formatNumberToEuro";

export default defineComponent({
    name: "ArticleCard",
    props: {
        article: {
            type: Object as () => Article,
            required: true
        },
    },
    data: () => ({
        PLACEHOLDER_IMAGE_PATH: "https://via.placeholder.com/300x300"
    }),
    computed: {
        imagePath() {
            return this.article.imagePath || this.PLACEHOLDER_IMAGE_PATH;
        }
    },
    methods: {
        formatNumberToEuro
    }
})
</script>

<template>
    <div class="bg-white shadow-md rounded-lg flex flex-col">
        <div class="relative rounded-t-[inherit]">
            <img :src="imagePath" :alt="'image' + article.id" class="rounded-t-[inherit] aspect-square object-cover w-full" />
            <div class="absolute top-2 right-2 flex gap-x-2 [&>button]:bg-white text-slate-800 [&>button]:hover:text-black [&>button]:opacity-80 [&>button:hover:not(:disabled)]:opacity-100 [&>button:disabled]:opacity-30 [&>button]:p-2 [&>button]:rounded [&>button:disabled]:cursor-not-allowed">
                <slot/>
            </div>
        </div>
        <div class="p-2 flex flex-col gap-y-2 grow">
            <h3 class="text-lg font-semibold text-slate-800">{{ article.ab_name }}</h3>
            <p class="text-slate-600">{{ article.ab_description }}</p>
            <div class="self-end mt-auto flex flex-col">
                <p v-if="article.ab_discount != 0" class="text-red-400 text-sm line-through">{{ formatNumberToEuro(article.ab_price / (1 - article.ab_discount)) }} </p>
                <p class="text-slate-600">{{ formatNumberToEuro(article.ab_price) }}</p>
            </div>
        </div>
    </div>
</template>

<style scoped>

</style>
