<script setup lang="ts">
export interface Filter {
        name: string;
        value: string;
        clear: () => void;
    }

    const props = defineProps<{
        filters: {filters: Filter[], clearAll: () => void};
    }>();

    function clearFilters() {
        props.filters.clearAll();
    }
</script>

<template>
    <button
        v-if="filters.filters?.length > 0"
        @click="clearFilters"
        class="bg-slate-700 text-white font-bold py-2 px-4 rounded" >Clear All</button>
    <button v-for="filter in filters.filters" :key="filter.name" @click="filter.clear" v-tooltip.bottom="{value: 'Clear ' + filter.name + ' Filter', showDelay: 400, pt: {root: 'mt-1', arrow: 'border-b-slate-200', text: 'bg-slate-200 text-black text-center'}}"
            class="bg-slate-100 font-semibold py-2 px-4 rounded group relative hover:bg-slate-200 overflow-hidden">
        <span>{{filter.value}}</span>
        <span class="absolute left-0 top-0 hidden group-hover:flex p-[inherit] bg-inherit w-full h-full">
                                    <span class="truncate">{{filter.value}}</span>
                                    <span class="text-nowrap ml-1">X</span>
                                </span>
    </button>
</template>

<style scoped>
</style>
