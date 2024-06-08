<script setup lang="ts">
import {ref} from 'vue';
import Dropdown from "primevue/dropdown";
import FloatLabel from "primevue/floatlabel"
import {update} from "@/components/ts/articles/articlesOverview";

const props = defineProps({
    selectedSortingOption: {
        type: String,
        required: false,
        default: null,
    },
});

const sortingOptions = [
    {name: 'Price Ascending', value: 'price_asc'},
    {name: 'Price Descending', value: 'price_desc'},
    {name: 'Name Ascending', value: 'name_asc'},
    {name: 'Name Descending', value: 'name_desc'},
];

const selectedSortingOption = ref(sortingOptions.find(option => option.value === props.selectedSortingOption) ?? null);
const loading = ref(false);
const dropdown = ref(null);

async function handleSelectionChange() {
    loading.value = true;
    const url = new URL(window.location.href);

    if (selectedSortingOption.value !== null) {
        url.searchParams.set('sort_by', selectedSortingOption.value.value);
    } else {
        url.searchParams.delete('sort_by');
    }

    window.history.pushState({}, '', url.pathname + url.search);
    await update("/api/articles/search" + url.search);
    loading.value = false;
}
</script>

<template>
    <FloatLabel class="ml-auto xl:w-64 flex">
        <button class="xl:hidden bg-white text-slate-800 border border-slate-300 rounded p-2 h-full aspect-square" title="Sort articles" @click="dropdown.show">
            <!-- Sort Icon -->
            <svg class="mx-auto" width="24px" height="24px" viewBox="0 0 24 24" stroke-width="1.5" fill="none" xmlns="http://www.w3.org/2000/svg" color="#000000"><path d="M10 14H2" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M8 10H2" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M6 6H2" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M12 18H2" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M19 20V4M19 20L22 17M19 20L16 17M19 4L22 7M19 4L16 7" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path></svg>
        </button>
        <Dropdown ref="dropdown" v-model="selectedSortingOption" id="sorting-option-dropdown" filter show-clear :loading="loading" :options="sortingOptions" optionLabel="name" @change="handleSelectionChange" class="bg-white text-slate-800 border border-slate-300 rounded h-fit w-0 xl:w-64 max-xl:invisible overflow-hidden"/>
        <label class="max-xl:hidden" for="sorting-option-dropdown">Sort By</label>
    </FloatLabel>
</template>

<style scoped>

</style>
