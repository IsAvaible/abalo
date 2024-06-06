<script setup lang="ts">
import {onBeforeMount, reactive, ref} from "vue";
import {update} from "@/components/ts/articles/articlesOverview";
import axios from "axios";

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
    new: false,
    very_good: false,
    good: true,
    used: true,
};
const checkedConditions = reactive({ ...conditions });

const categories = ref<ArticleCategory[]>([]);
const selectedCategory = ref<ArticleCategory | null>(null);
// Get the categories from the server
onBeforeMount(async () => {
    try {
        // Make the GET request using axios
        const response = await axios.get('/api/articles/categories', {
            headers: {'Content-Type': 'application/json'},
        });

        // Update the showcase with the response data
        categories.value = response.data.categories;
        selectedCategory.value = categories.value.find((category) => category.ab_name === new URLSearchParams(window.location.search).get('category')) ?? null;
    } catch (error) {
        // Handle the error
        console.error(error.response ? error.response.data : error.message, error);
    }
});

const priceRange = reactive({
    min: 200,
    max: 1000,
});

const shippingOptions = {
    free: true,
    express: false,
    standard: true,
};
const checkedShipping = reactive({ ...shippingOptions });

const locations = {
    Germany: true,
    France: false,
    Spain: false,
    Italy: false,
};
const checkedLocations = reactive({ ...locations });

const filterArticles = async (event) => {
    // Build the new URL
    const url = new URL(window.location.href);
    if (selectedCategory.value) {
        url.searchParams.set('category', selectedCategory.value.ab_name);
    } else {
        url.searchParams.delete('category');
    }

    // Update the history and request the new data
    window.history.pushState({}, '', url.pathname + url.search);
    await update("/api/articles/search" + url.search);
};

const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);
</script>

<template>
    <div class="flex-col gap-y-4 w-fit hidden md:flex md:float-right">
        <!-- Condition Section -->
        <div class="flex flex-col gap-y-1">
            <h4 class="text-lg font-semibold text-slate-700">Condition</h4>
            <div v-for="(checked, condition) in conditions" :key="condition">
                <input
                    type="checkbox"
                    :id="'condition_' + condition"
                    :name="'condition_' + condition"
                    :value="condition"
                    v-model="checkedConditions[condition]"
                />
                <label :for="'condition_' + condition">{{ capitalize(condition) }}</label>
            </div>
        </div>

        <!-- Category Section -->
        <div class="flex flex-col gap-y-1">
            <h4 class="text-lg font-semibold text-slate-700">Category</h4>
            <select
                class="bg-white text-slate-800 border border-slate-300 rounded p-2"
                title="Select category"
                v-model="selectedCategory"
                @change="filterArticles"
            >
                <option :value="null">All</option>
                <option
                    v-for="(category) in categories"
                    :key="category.id"
                    :value="category"
                >
                    {{ category.ab_name }}
                </option>
            </select>
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
                />
                <span> - </span>
                <input
                    type="number"
                    id="price_max"
                    name="price_max"
                    class="w-24 p-2 border border-slate-300 rounded"
                    placeholder="To"
                    v-model="priceRange.max"
                />
            </div>
        </div>

        <!-- Shipping Section -->
        <div class="flex flex-col gap-y-1">
            <h4 class="text-lg font-semibold text-slate-700">Shipping</h4>
            <div v-for="(checked, shipping) in shippingOptions" :key="shipping">
                <input
                    type="checkbox"
                    :id="'shipping_' + shipping"
                    :name="'shipping_' + shipping"
                    :value="shipping"
                    v-model="checkedShipping[shipping]"
                />
                <label :for="'shipping_' + shipping">{{ capitalize(shipping) }}</label>
            </div>
        </div>

        <!-- Location Section -->
        <div class="flex flex-col gap-y-1">
            <h4 class="text-lg font-semibold text-slate-700">Location</h4>
            <div v-for="(checked, location) in locations" :key="location">
                <input
                    type="checkbox"
                    :id="'location_' + location"
                    :name="'location_' + location"
                    :value="location"
                    v-model="checkedLocations[location]"
                />
                <label :for="'location_' + location">{{ capitalize(location) }}</label>
            </div>
        </div>
    </div>
</template>

<style scoped>

</style>
