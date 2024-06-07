<script setup lang="ts">
import {onBeforeMount, ref} from "vue";
import {update} from "@/components/ts/articles/articlesOverview";
import axios from "axios";

import CascadeSelect from 'primevue/cascadeselect';
import MultiSelect from 'primevue/multiselect';
import Checkbox from 'primevue/checkbox';
import {debounce} from "vue-debounce";

/**
 * Interface for the article object
 */
export interface ArticleCategory {
    id: number;
    ab_name: string;
    ab_description: string;
    ab_parent: ArticleCategory['id'];
}

const conditions = {
    new: 'New',
    very_good: 'Very Good',
    good: 'Good',
    used: 'Used',
};
const selectedConditions = ref();

const categories = ref<ArticleCategory[]>([]);
const selectedCategory = ref<ArticleCategory | null>(null);
const categoryPlaceholder = ref<string>(new URLSearchParams(window.location.search).get('category') ?? 'All');
const categoriesLoading = ref<boolean>(true);

const priceRange = ref({
    min: null,
    max: null,
});

const shippingOptions = {free: 'Free', express: 'Express', standard: 'Standard'};
const selectedShippingOptions = ref();

const selectedCountries = ref();
const countries = ref([
    { name: 'Australia', code: 'AU' },
    { name: 'Brazil', code: 'BR' },
    { name: 'China', code: 'CN' },
    { name: 'Egypt', code: 'EG' },
    { name: 'France', code: 'FR' },
    { name: 'Germany', code: 'DE' },
    { name: 'India', code: 'IN' },
    { name: 'Japan', code: 'JP' },
    { name: 'Spain', code: 'ES' },
    { name: 'United States', code: 'US' }
]);

onBeforeMount(async () => {
    const urlSearchParams = new URLSearchParams(window.location.search);
    // Get min and max price from the URL
    priceRange.value.min = parseInt(urlSearchParams.get('price_min') ?? null);
    priceRange.value.max = parseInt(urlSearchParams.get('price_max') ?? null);
    // Get the categories from the server
    try {
        // Make the GET request using axios
        const response = await axios.get('/api/articles/categories', {
            headers: {'Content-Type': 'application/json'},
        });

        // Update the showcase with the response data
        [categories.value, selectedCategory.value] = buildCategoryTree(response.data.categories,  urlSearchParams.get('category'));
    } catch (error) {
        // Handle the error
        console.error(error.response ? error.response.data : error.message, error);
    }
    categoriesLoading.value = false;
    categoryPlaceholder.value = 'All';
});

const handleFormFieldChange = debounce(async () => {
    await filterArticles();
}, 100);


const filterArticles = async () => {
    // Build the new URL
    const url = new URL(window.location.href);
    if (selectedCategory.value) {
        url.searchParams.set('category', selectedCategory.value.ab_name);
    } else {
        url.searchParams.delete('category');
    }
    if (priceRange.value.min) {
        url.searchParams.set('price_min', priceRange.value.min.toString());
    } else {
        url.searchParams.delete('price_min');
    }
    if (priceRange.value.max) {
        url.searchParams.set('price_max', priceRange.value.max.toString());
    } else {
        url.searchParams.delete('price_max');
    }

    // Update the history and request the new data
    window.history.pushState({}, '', url.pathname + url.search);
    await update("/api/articles/search" + url.search);
};

/**
 * Build the category tree from the flat array of categories
 * @param categories The flat array of categories
 * @param search The search string of the category
 *
 * @returns The root categories and the found category
 */
function buildCategoryTree(categories: ArticleCategory[], search: string | null): [ArticleCategory[], ArticleCategory] {
    const map = {};
    const roots = [];
    let searchCategory = null;

    categories.forEach(category => {
        map[category.id] = { ...category, children: [] };
        if (category.ab_name == search) {
            searchCategory = map[category.id];
        }
    });

    categories.forEach(category => {
        if (category.ab_parent === null) {
            roots.push(map[category.id]);
        } else {
            if (map[category.ab_parent]) {
                map[category.ab_parent].children.push(map[category.id]);
            }
        }
    });

    return [roots, searchCategory];
}
</script>

<template>
    <div class="flex-col gap-y-4 hidden md:flex md:float-right w-80 max-w-80">
        <!-- Condition Section -->
        <div class="flex flex-col gap-y-1">
            <h4 class="text-lg font-semibold text-slate-700">Condition</h4>
            <div class="flex gap-2 items-center" v-for="(label, condition) in conditions" :key="condition">
                <Checkbox
                    v-model="selectedConditions"
                    :inputId="'condition_' + condition"
                    :name="'condition_' + condition"
                    :value="condition"
                    class="ring-1 ring-slate-300 rounded"
                />
                <label :for="'condition_' + condition">{{ label }}</label>
            </div>
        </div>

        <!-- Category Section -->
        <div class="flex flex-col gap-y-1">
            <h4 class="text-lg font-semibold text-slate-700">Category</h4>
            <CascadeSelect
                @change="handleFormFieldChange"
                v-model="selectedCategory"
                :options="categories"
                optionLabel="ab_name"
                optionGroupLabel="ab_name"
                :placeholder="categoryPlaceholder"
                :loading="categoriesLoading"
                :optionGroupChildren="['children']"
                filter
                showClear
                checkmark
                :highlightOnSelect="false"
                aria-label="Categories Dropwdown"
                class="bg-white text-slate-800 border border-slate-300 rounded"
            />
        </div>

        <!-- Price Range Section -->
        <div class="flex flex-col gap-y-1">
            <h4 class="text-lg font-semibold text-slate-700">Price Range</h4>
            <div class="flex flex-row gap-x-2 items-center">
                <input
                    type="number"
                    id="price_min"
                    name="price_min"
                    class="w-24 p-2 border border-slate-300 rounded"
                    placeholder="From"
                    v-model="priceRange.min"
                    @change="handleFormFieldChange"
                />
                <span> - </span>
                <input
                    type="number"
                    id="price_max"
                    name="price_max"
                    class="w-24 p-2 border border-slate-300 rounded"
                    placeholder="To"
                    v-model="priceRange.max"
                    @change="handleFormFieldChange"
                />
            </div>
        </div>

        <!-- Shipping Section -->
        <div class="flex flex-col gap-y-1">
            <h4 class="text-lg font-semibold text-slate-700">Shipping</h4>
            <div class="flex gap-2 items-center" v-for="(label, shipping) in shippingOptions" :key="shipping">
                <Checkbox
                    v-model="selectedShippingOptions"
                    :inputId="'shipping_' + shipping"
                    :name="'shipping_' + shipping"
                    :value="shipping"
                    class="ring-1 ring-slate-300 rounded"
                />
                <label :for="'shipping_' + shipping">{{ label }}</label>
            </div>
        </div>

        <!-- Location Section -->
        <div class="flex flex-col gap-y-1">
            <h4 class="text-lg font-semibold text-slate-700">Countries</h4>
            <MultiSelect filter v-model="selectedCountries" :options="countries" showClear optionLabel="name" placeholder="All Countries" display="chip" class="bg-white text-slate-800 border border-slate-300 rounded">
                <template #option="slotProps">
                    <div class="flex align-center w-[18px]">
                        <img :alt="slotProps.option.name" src="https://primefaces.org/cdn/primevue/images/flag/flag_placeholder.png" :class="`flag flag-${slotProps.option.code.toLowerCase()} mr-2`" />
                        <div>{{ slotProps.option.name }}</div>
                    </div>
                </template>
                <template #footer>
                    <div class="py-2 px-3">
                        <b>{{ selectedCountries ? selectedCountries.length : 0 }}</b> item{{ (selectedCountries ? selectedCountries.length : 0) > 1 ? 's' : '' }} selected.
                    </div>
                </template>
            </MultiSelect>
        </div>
    </div>
</template>

<style scoped>

</style>
