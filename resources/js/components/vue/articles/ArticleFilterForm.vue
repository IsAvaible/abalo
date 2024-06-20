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
import {debounce} from "vue-debounce";
import {TreeNode} from "primevue/treenode";
import {Filter} from "@/components/vue/articles/FilterChips";

// Get props
const props = defineProps({
    categories: {
        required: true,
    }
});

// Define Emits
const emit = defineEmits({
    filterChips: (_: {filters: Filter[], clearAll: () => void}) => true
});

// Get search URL params
const urlParams = new URLSearchParams(window.location.search);

/**
 * Interface for the article object
 */
export interface ArticleCategory {
    id: number;
    ab_name: string;
    ab_description: string;
    ab_parent: ArticleCategory['id'];
}

// Define reactive variables
const loading = ref(false);
const error = ref<string | null>();

const conditions = {
    new: 'New',
    very_good: 'Very Good',
    good: 'Good',
    used: 'Used',
};
const selectedConditions = ref(parseStringQueryArray(urlParams.get('conditions')));

const categories = ref<ArticleCategory[]>(typeof props.categories === 'string' ? JSON.parse(props.categories) : props.categories);
const selectedCategories = ref<ArticleCategory[]>(categories.value.filter(category => urlParams.get('categories') && parseNumberQueryArray(urlParams.get('categories')).includes(category.id)));
const [nodes, map] = buildCategoryTree(categories.value);
const categoryNodes = ref<TreeNode[]>(nodes);
// Create a map of the selected categories
const selectedCategoryNodes = ref(selectedCategories.value.reduce((acc, category) => {
    // Check if the category is partially checked
    const partialChecked = Object.values(map).find(node => parseInt(node.key) === category.id)?.children.some(child => !selectedCategories.value.map(category => category.id).includes(parseInt(child.key)));
    // Add the category to the selectedCategoryNodes object
    acc[category.id] = {checked: !partialChecked, partialChecked: partialChecked};
    return acc;
}, {}))

watch(selectedCategoryNodes, () => {
    selectedCategories.value = categories.value.filter(category => selectedCategoryNodes.value[category.id]?.checked)
}, {deep: true});

const categorySelect = ref();

const priceRange = ref({
    min: +urlParams.get('price_min') || null,
    max: urlParams.has('price_max') ? +urlParams.get('price_max') : null
});

const shippingOptions = {free: 'Free', express: 'Express', standard: 'Standard'};
const selectedShippingOptions = ref(parseStringQueryArray(urlParams.get('shipping')));

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
const selectedCountries = ref(countries.value.filter(country => (parseStringQueryArray(urlParams.get('countries'))).includes(country.code)));


emit('filterChips', {filters: buildFilterChips(), clearAll: handleReset});

const handleFormFieldChange = debounce(async () => {
    await filterArticles();
}, 100);

const filterArticles = async () => {
    loading.value = true;
    error.value = null;
    // Build the new URL
    const url = new URL(window.location.href);
    if (selectedConditions.value.length > 0) {
        url.searchParams.set('conditions', selectedConditions.value.join('-'));
    } else {
        url.searchParams.delete('conditions');
    }
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
    if (priceRange.value.max != null) {
        url.searchParams.set('price_max', priceRange.value.max.toString());
    } else {
        url.searchParams.delete('price_max');
    }
    if (selectedShippingOptions.value?.length > 0) {
        url.searchParams.set('shipping', selectedShippingOptions.value.join('-'));
    } else {
        url.searchParams.delete('shipping');
    }
    if (selectedCountries.value?.length > 0) {
        url.searchParams.set('countries', selectedCountries.value.map(country => country.code).join('-'));
    } else {
        url.searchParams.delete('countries');
    }

    // Update the history and request the new data
    window.history.pushState({}, '', url.pathname + url.search);
    emit('filterChips', {filters: buildFilterChips(), clearAll: handleReset});
    try {
        await update("/api/articles/search" + url.search, true)
    } catch (error) {
        error.value = error.response?.data.error ? Object.entries(error.response.data.error).map(([key, value]) => `${key}: ${value}`).join('\n') : error.message;
    }
    resetDisabled.value = !selectedConditions.value.length && !selectedCategories.value.length && !priceRange.value.min && priceRange.value.max == null && !selectedShippingOptions.value.length && !selectedCountries.value.length;
    loading.value = false;
};

const resetDisabled = ref<boolean>(!selectedConditions.value.length && !selectedCategories.value.length && !priceRange.value.min && priceRange.value.max == null && !selectedShippingOptions.value.length && !selectedCountries.value.length);
async function handleReset() {
    resetDisabled.value = true;
    selectedConditions.value = [];
    selectedCategories.value = [];
    selectedCategoryNodes.value = {};
    priceRange.value = {min: null, max: null};
    selectedShippingOptions.value = [];
    selectedCountries.value = [];
    await filterArticles();
}

/**
 * Build the category tree from the flat array of categories
 * @param categories The flat array of categories
 *
 * @returns The root categories
 */
function buildCategoryTree(categories: TreeNode[]): [TreeNode[], {[key: number]: TreeNode}] {
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

    return [roots, map];
}

function buildFilterChips(): Filter[] {
    const chips = [];
    if (selectedConditions.value?.length) {
        const value = selectedConditions.value.length <= 2 ? selectedConditions.value.map(condition => conditions[condition]).join(' & ') : `${selectedConditions.value.length} Conditions`;
        chips.push({name: 'Condition', value: value, clear: () => {selectedConditions.value = []; filterArticles()}});
    }
    if (selectedCategories.value.length) {
        const value = selectedCategories.value.length <= 2 ? selectedCategories.value.map(category => category.ab_name).join(' & ') : `${selectedCategories.value.length} Categories`;
        chips.push({name: 'Categories', value: value, clear: () => {selectedCategoryNodes.value = []; filterArticles()}});
    }
    if (priceRange.value.min || priceRange.value.max != null) {
        let value;
        if (priceRange.value.min && priceRange.value.max) {
            value = `${priceRange.value.min} - ${priceRange.value.max} €`;
        } else if (priceRange.value.min) {
            value = `Min ${priceRange.value.min} €`;
        } else {
            value = `Max ${priceRange.value.max } €`;
        }

        chips.push({name: 'Price Range', value: value, clear: () => {priceRange.value = {min: null, max: null}; filterArticles()}});
    }
    if (selectedShippingOptions.value?.length) {
        const value = selectedShippingOptions.value.length <= 2 ? selectedShippingOptions.value.map(shipping => shippingOptions[shipping]).join(' & ') : `${selectedShippingOptions.value.length} Shipping Options`;
        chips.push({name: 'Shipping', value: value, clear: () => {selectedShippingOptions.value = []; filterArticles()}});
    }
    if (selectedCountries.value?.length) {
        const value = selectedCountries.value.length <= 3 ? selectedCountries.value.map(country => country.name).join(', ') : `${selectedCountries.value.length} Countries`;
        chips.push({name: 'Countries', value: value, clear: () => {selectedCountries.value = []; filterArticles()}});
    }
    return chips;
}

function parseStringQueryArray(query: string | null): string[] {
    return query ? query.split('-') : [];
}

function parseNumberQueryArray(query: string | null): number[] {
    return parseStringQueryArray(query).map(value => +value);
}
</script>

<template>
    <div class="flex-col gap-y-4 flex float-right w-80 max-w-80">
        <div class="flex flex-row justify-between items-center">
            <!-- Condition Section -->
            <div class="flex flex-col gap-y-1">
                <h4 class="text-lg font-semibold text-slate-700">Condition</h4>
                <div class="flex gap-2 items-center" v-for="(label, condition) in conditions" :key="condition">
                    <Checkbox
                        v-model="selectedConditions"
                        :inputId="'condition_' + condition"
                        :name="'condition_' + condition"
                        :value="condition"
                        @change="handleFormFieldChange"
                        class="ring-1 ring-slate-300 rounded"
                    />
                    <label :for="'condition_' + condition">{{ label }}</label>
                </div>
            </div>

            <!-- Mobile Loading Spinner -->
            <Transition name="fade" class="md:hidden">
                <svg
                    v-show="loading"
                    aria-hidden="true"
                    class="w-16 h-16 text-gray-200 animate-spin dark:text-gray-600 fill-slate-800 mx-auto mt-4"
                    viewBox="0 0 100 101"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"></path>
                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"></path>
                </svg>
            </Transition>
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
                    <InputNumber id="price-min-input" placeholder="Min" v-model="priceRange.min" @update:model-value="handleFormFieldChange" :max-fraction-digits="2" :min-fraction-digits="2" :min="0"/>
                    <InputGroupAddon>€</InputGroupAddon>
                </InputGroup>
                <span> - </span>
                <InputGroup>
                    <FloatLabel>
                        <InputNumber input-class="!rounded-r-none !border-r-0" id="price-max-input" placeholder="" v-model="priceRange.max" @update:model-value="handleFormFieldChange" :max-fraction-digits="2" :min-fraction-digits="2" :min="priceRange.min"/>
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
                    @change="handleFormFieldChange"
                    class="ring-1 ring-slate-300 rounded"
                />
                <label :for="'shipping_' + shipping">{{ label }}</label>
            </div>
        </div>

        <!-- Location Section -->
        <div class="flex flex-col gap-y-1">
            <h4 class="text-lg font-semibold text-slate-700">Countries</h4>
            <MultiSelect filter v-model="selectedCountries" :options="countries" @change="handleFormFieldChange" showClear optionLabel="name" placeholder="All Countries" display="chip" class="bg-white text-slate-800 border border-slate-300 rounded">
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
            class="bg-slate-800 text-white rounded py-2 px-4 hover:bg-slate-900 transition-colors duration-200 flex justify-center items-center"
        >
            Reset Filters
        </Button>

        <Transition name="fade">
            <div v-if="error" class="alert alert-error">
                An error occurred while applying your filters. <br><br>
                {{ error }}
            </div>
        </Transition>

        <!-- Desktop Loading Spinner -->
        <Transition name="fade" class="max-md:hidden">
            <svg
                v-show="loading"
                aria-hidden="true"
                class="w-16 h-16 text-gray-200 animate-spin dark:text-gray-600 fill-slate-800 mx-auto mt-4"
                viewBox="0 0 100 101"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"></path>
                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"></path>
            </svg>
        </Transition>
    </div>
</template>

<style scoped>
    .fade-enter-active,
    .fade-leave-active {
        transition: opacity 0.2s ease;
    }

    .fade-enter-from,
    .fade-leave-to {
        opacity: 0;
    }
</style>
