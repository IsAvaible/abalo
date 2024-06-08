<script setup lang="ts">
import {ref, watch} from "vue";
import {update} from "@/components/ts/articles/articlesOverview";

import TreeSelect from 'primevue/treeselect';
import MultiSelect from 'primevue/multiselect';
import Checkbox from 'primevue/checkbox';
import InputNumber from 'primevue/inputnumber';
import InputGroup from 'primevue/inputgroup';
import InputGroupAddon from 'primevue/inputgroupaddon';
import FloatLabel from 'primevue/floatlabel';
import Button from 'primevue/button';
import ProgressSpinner from 'primevue/progressspinner';
import {debounce} from "vue-debounce";
import {TreeNode} from "primevue/treenode";

/**
 * Interface for the article object
 */
export interface ArticleCategory {
    id: number;
    ab_name: string;
    ab_description: string;
    ab_parent: ArticleCategory['id'];
}

// Get props
const props = defineProps({
    categories: {
        type: String,
        required: true,
    },
    selectedCategories: {
        type: String,
        required: false,
        default: '',
    },
    priceMin: {
        type: Number,
        required: false,
        default: null,
    },
    priceMax: {
        type: Number,
        required: false,
        default: null,
    },
});

const conditions = {
    new: 'New',
    very_good: 'Very Good',
    good: 'Good',
    used: 'Used',
};
const selectedConditions = ref();

const categories = ref<ArticleCategory[]>(JSON.parse(props.categories))
const selectedCategories = ref<ArticleCategory[]>(categories.value.filter(category => props.selectedCategories && JSON.parse(`[${props.selectedCategories.replace(/-/g,',')}]`).includes(category.id)));
const categoryNodes = ref<TreeNode[]>(buildCategoryTree(categories.value));
const selectedCategoryNodes = ref<{[key: number] : boolean}>(selectedCategories.value.reduce((acc, category) => {
    acc[category.id] = {checked: true, partialChecked: false}
    return acc;
}, {}))

watch(selectedCategoryNodes, () => {
    selectedCategories.value = categories.value.filter(category => selectedCategoryNodes.value[category.id])
    console.log(selectedCategoryNodes.value);
}, {deep: true});

const categorySelect = ref();

const priceRange = ref({
    min: +props.priceMin || null,
    max: +props.priceMax || null,
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

const handleFormFieldChange = debounce(async () => {
    await filterArticles();
}, 100);

const filterArticles = async () => {
    // Build the new URL
    const url = new URL(window.location.href);
    if (selectedCategories.value.length > 0) {
        url.searchParams.set('categories', selectedCategories.value.map(category => category.id).join('-'));
    } else {
        url.searchParams.delete('categories');
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
    await update("/api/articles/search" + url.search)
    resetDisabled.value = false;
};

const resetDisabled = ref(selectedCategories.value.length === 0 && !priceRange.value.min && !priceRange.value.max && selectedShippingOptions.value.length === 0 && selectedCountries.value.length === 0);
const resetLoading = ref(false);
async function handleReset() {
    resetDisabled.value = true;
    resetLoading.value = true;
    selectedConditions.value = [];
    selectedCategoryNodes.value = {};
    priceRange.value = {min: null, max: null};
    selectedShippingOptions.value = [];
    selectedCountries.value = [];
    await filterArticles();
    resetDisabled.value = true;
    resetLoading.value = false;
}

/**
 * Build the category tree from the flat array of categories
 * @param categories The flat array of categories
 *
 * @returns The root categories
 */
function buildCategoryTree(categories: TreeNode[]): TreeNode[] {
    const map = {};
    const roots = [];

    categories.forEach(category => {
        map[category.id] = {
            key: category.id,
            label: category.ab_name,
            data: category,
            children: []
        };
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

    return roots;
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
            <h4 class="text-lg font-semibold text-slate-700">Categories</h4>
            <TreeSelect
                @change="handleFormFieldChange"
                v-model="selectedCategoryNodes"
                :options="categoryNodes"
                selectionMode="checkbox"
                ref="categorySelect"
                placeholder="All Categories"
                aria-label="Categories Dropwdown"
                class="bg-white text-slate-800 border border-slate-300 rounded"
            />
        </div>

        <!-- Price Range Section -->
        <div class="flex flex-col gap-y-1">
            <h4 class="text-lg font-semibold text-slate-700">Price Range</h4>
            <div class="flex flex-row gap-x-2 items-center">
                <InputGroup>
                    <FloatLabel>
                        <InputNumber id="price-min-input" placeholder="" v-model="priceRange.min" @update:model-value="handleFormFieldChange" :max-fraction-digits="2" :min-fraction-digits="2" :min="0"/>
                        <label for="price-min-input">Min</label>
                    </FloatLabel>
                    <InputGroupAddon>€</InputGroupAddon>
                </InputGroup>
                <span> - </span>
                <InputGroup>
                    <FloatLabel>
                        <InputNumber id="price-max-input" placeholder="" v-model="priceRange.max" @update:model-value="handleFormFieldChange" :max-fraction-digits="2" :min-fraction-digits="2" :min="priceRange.min"/>
                        <label for="price-max-input">Max</label>
                    </FloatLabel>
                    <InputGroupAddon>€</InputGroupAddon>
                </InputGroup>
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

        <!-- Reset Button -->
        <Button
            type="button"
            @click="handleReset"
            :disabled="resetDisabled"
            class="bg-slate-800 text-white rounded py-2 px-4 hover:bg-slate-900 transition-colors duration-200 flex justify-between items-center"
        >
            Reset Filters
            <ProgressSpinner v-if="resetLoading" class="m-0 w-6 h-6"></ProgressSpinner>
        </Button>
    </div>
</template>

<style scoped>

</style>
