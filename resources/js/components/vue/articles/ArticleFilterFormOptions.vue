<script lang="ts">
import {defineComponent} from 'vue'
import {debounce} from "vue-debounce";
import {Filter} from "@/components/vue/articles/FilterChips";
import {update} from "@/components/ts/articles/articlesOverview";

import InputNumber from "primevue/inputnumber";
import FloatLabel from "primevue/floatlabel";
import MultiSelect from "primevue/multiselect";
import TreeSelect from "primevue/treeselect";
import {TreeNode} from "primevue/treenode";
import Checkbox from "primevue/checkbox";
import Button from "primevue/button";
import InputGroupAddon from "primevue/inputgroupaddon";
import InputGroup from "primevue/inputgroup";

export default defineComponent({
    name: "ArticleFilterFormOptions",
    components: {InputGroup, InputGroupAddon, Button, Checkbox, TreeSelect, MultiSelect, FloatLabel, InputNumber},
    props: {
        categories: {
            type: String,
            required: true,
        }
    },
    data() {
        return {
            // Your data properties go here
            loading: false,
            error: null,
            conditions: {
                new: 'New',
                very_good: 'Very Good',
                good: 'Good',
                used: 'Used',
            },
            selectedConditions: this.parseStringQueryArray(new URLSearchParams(window.location.search).get('conditions')),
            categories: JSON.parse(this.categories),
            selectedCategories: [],
            categoryNodes: [],
            selectedCategoryNodes: {},
            categorySelect: null,
            priceRange: {
                min: +new URLSearchParams(window.location.search).get('price_min') || null,
                max: +new URLSearchParams(window.location.search).get('price_max') || null,
            },
            shippingOptions: {free: 'Free', express: 'Express', standard: 'Standard'},
            selectedShippingOptions: this.parseStringQueryArray(new URLSearchParams(window.location.search).get('shipping')),
            countries: [
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
            ],
            selectedCountries: [],
            resetDisabled: true
        };
    },
    computed: {
        // Your computed properties go here
    },
    watch: {
        // Your watchers go here
        selectedCategoryNodes: {
            handler() {
                this.selectedCategories = this.categories.filter(category => this.selectedCategoryNodes[category.id]?.checked);
            },
            deep: true
        }
    },
    created() {
        // Your created lifecycle hook logic goes here
        this.selectedCategories = this.categories.filter(category => new URLSearchParams(window.location.search).get('categories') && this.parseNumberQueryArray(new URLSearchParams(window.location.search).get('categories')).includes(category.id));
        const [nodes, map] = this.buildCategoryTree(this.categories);
        this.categoryNodes = nodes;
        this.selectedCategoryNodes = this.selectedCategories.reduce((acc, category) => {
            // @ts-ignore
            const partialChecked = Object.values(map).find(node => parseInt(node.key) === category.id)?.children.some(child => !this.selectedCategories.map(category => category.id).includes(parseInt(child.key)));
            acc[category.id] = {checked: !partialChecked, partialChecked: partialChecked};
            return acc;
        }, {});
        this.selectedCountries = this.countries.filter(country => (this.parseStringQueryArray(new URLSearchParams(window.location.search).get('countries'))).includes(country.code));
        this.$emit('filterChips', {filters: this.buildFilterChips(), clearAll: this.handleReset});
    },
    methods: {
        // Your methods go here
        handleFormFieldChange: debounce(async function() {
            await this.filterArticles();
        }, 100),
        filterArticles: async function() {
            this.loading = true;
            const url = new URL(window.location.href);
            const searchParams = new URLSearchParams();

            if (this.selectedConditions.length > 0) {
                searchParams.set('conditions', this.selectedConditions.join('-'));
            } else {
                searchParams.delete('conditions');
            }

            if (this.selectedCategories.length > 0) {
                searchParams.set('categories', this.selectedCategories.map(category => category.id).join('-'));
            } else {
                searchParams.delete('categories');
            }

            if (this.priceRange.min !== null) {
                searchParams.set('price_min', this.priceRange.min.toString());
            } else {
                searchParams.delete('price_min');
            }

            if (this.priceRange.max !== null) {
                searchParams.set('price_max', this.priceRange.max.toString());
            } else {
                searchParams.delete('price_max');
            }

            if (this.selectedShippingOptions.length > 0) {
                searchParams.set('shipping', this.selectedShippingOptions.join('-'));
            } else {
                searchParams.delete('shipping');
            }

            if (this.selectedCountries.length > 0) {
                searchParams.set('countries', this.selectedCountries.map(country => country.code).join('-'));
            } else {
                searchParams.delete('countries');
            }

            url.search = searchParams.toString();
            window.history.pushState({}, '', url.pathname + url.search);
            await update("/api/articles/search" + url.search);
            this.loading = false;
            this.$emit('filterChips', {filters: this.buildFilterChips(), clearAll: this.handleReset});
        },
        handleReset: async function() {
            this.loading = true;
            const url = new URL(window.location.href);
            url.search = '';
            window.history.pushState({}, '', url.pathname + url.search);
            await update("/api/articles/search" + url.search);
            this.loading = false;
            this.$emit('filterChips', {filters: this.buildFilterChips(), clearAll: this.handleReset});
        },
        buildCategoryTree: function (categories: TreeNode[]): [TreeNode[], {[key: number]: TreeNode}] {
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
        },
        buildFilterChips: function(): Filter[] {
            const filters = [];
            if (this.selectedConditions.length > 0) {
                filters.push(...this.selectedConditions.map(condition => ({type: 'condition', value: condition})));
            }
            if (this.selectedCategories.length > 0) {
                filters.push(...this.selectedCategories.map(category => ({type: 'category', value: category.ab_name})));
            }
            if (this.priceRange.min !== null || this.priceRange.max !== null) {
                filters.push({type: 'price', value: `${this.priceRange.min ?? ''} - ${this.priceRange.max ?? ''}`});
            }
            if (this.selectedShippingOptions.length > 0) {
                filters.push(...this.selectedShippingOptions.map(shipping => ({type: 'shipping', value: shipping})));
            }
            if (this.selectedCountries.length > 0) {
                filters.push(...this.selectedCountries.map(country => ({type: 'country', value: country.name})));
            }
            return filters;
        },
        parseStringQueryArray: function(query) {
            return query ? query.split('-') : [];
        },
        parseNumberQueryArray: function(query) {
            return this.parseStringQueryArray(query).map(value => +value);
        }
    },
})

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
