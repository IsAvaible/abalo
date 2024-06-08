<script setup lang="ts">
import {onMounted, ref, watch} from 'vue';
import {debounce} from 'vue-debounce';
import {update} from "@/components/ts/articles/articlesOverview";

// Props
const props = defineProps({
    search: {
        type: String,
        required: false,
    },
});

const search = ref<string>(props.search ?? '');

// Refs
const input = ref<HTMLInputElement | null>(null);
const form = ref<HTMLFormElement | null>(null);
const searching = ref<boolean>(false);

// Lifecycle Hooks
onMounted(() => {
    if (search.value.length > 11) input.value.setAttribute('data-rtl', '');
    input.value.classList.add('transition-[padding,margin,box-shadow]');
});

// Search Functionality
const doSearch = async (autoSearch: boolean) => {
    if (autoSearch && 0 < search.value.length && search.value.length < 3) return;
    searching.value = true;
    // Build the new URL
    const url = new URL(window.location.href);
    if (search.value !== '') {
        url.searchParams.set('search',  search.value);
    } else {
        url.searchParams.delete('search');
    }

    // Update the history and request the new data
    window.history.pushState({}, '', url.pathname + url.search);
    await update("/api/articles/search" + url.search);
    searching.value = false;
};

// Watchers
watch(search, debounce(() => doSearch(true), 500));

// Handlers
const clearSearch = () => {
    search.value = '';
    input.value.focus();
};

const handleFormFocusIn = () => {
    if (input.value.hasAttribute('data-rtl')) {
        input.value.blur();
        input.value.removeAttribute('data-rtl');
        input.value.focus();
    }
};

const handleFormFocusOut = (event: FocusEvent) => {
    if (!form.value.contains(event.relatedTarget as Node) && !input.value.hasAttribute('data-rtl')) {
        setTimeout(() => {
            input.value.setAttribute('data-rtl', '');
        }, 300 - (search.value.length / 10) * 150);
    }
};
</script>

<template>
    <form
        id="search-form"
        ref="form"
        action="/articles"
        novalidate
        class="group relative flex flex-row -mr-4 gap-x-2 items-center rounded-full py-1 hover:ring-opacity-100 focus-within:ring-opacity-100 has-[input:not(:placeholder-shown)]:ring-opacity-100 hover:px-4 focus-within:px-4 has-[input:not(:placeholder-shown)]:px-4 hover:mr-0 focus-within:mr-0 has-[input:not(:placeholder-shown)]:mr-0 ring-1 ring-slate-800 ring-opacity-0 duration-500"
        @focusin="handleFormFocusIn"
        @focusout="handleFormFocusOut"
        @submit.prevent="() => doSearch(false)"
    >
        <button
            type="submit"
            class="hover:scale-110 transition-transform"
            aria-label="Search"
        >
            <svg
                width="24px"
                height="24px"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                color="currentColor"
            >
                <path
                    d="M17 17L21 21"
                    stroke="currentColor"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                ></path>
                <path
                    d="M3 11C3 15.4183 6.58172 19 11 19C13.213 19 15.2161 18.1015 16.6644 16.6493C18.1077 15.2022 19 13.2053 19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11Z"
                    stroke="currentColor"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                ></path>
            </svg>
        </button>
        <input
            id="search-input"
            ref="input"
            autocomplete="off"
            type="text"
            name="search"
            v-model="search"
            placeholder="Search"
            pattern=".{0,11}"
            class="peer flex bg-[inherit] text-[inherit] [&[data-rtl]:not(:valid)]:[direction:rtl] [&:not(:placeholder-shown)]:truncate w-0 [&:not(:placeholder-shown)]:w-[10ch] group-focus-within:w-40 group-hover:placeholder-shown:w-40 focus:outline-none transition-[width] duration-[inherit]"
        />
        <button
            :tabindex="search.length ? 0 : -1"
            aria-label="Clear Search"
            type="button"
            class="w-0 overflow-hidden aspect-square p-0.5 group-hover:w-6 group-focus-within:w-6 [:merge(.peer):not(:placeholder-shown)~&]:w-6 peer-placeholder-shown:opacity-0 opacity-100 transition-[opacity,width] duration-300"
            @click="clearSearch"
        >
            <svg
                v-if="!searching"
                width="20px"
                height="20px"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                color="currentColor"
                stroke-width="1.5"
            >
                <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M12 1.25C6.06294 1.25 1.25 6.06294 1.25 12C1.25 17.9371 6.06294 22.75 12 22.75C17.9371 22.75 22.75 17.9371 22.75 12C22.75 6.06294 17.9371 1.25 12 1.25ZM9.70164 8.64124C9.40875 8.34835 8.93388 8.34835 8.64098 8.64124C8.34809 8.93414 8.34809 9.40901 8.64098 9.7019L10.9391 12L8.64098 14.2981C8.34809 14.591 8.34809 15.0659 8.64098 15.3588C8.93388 15.6517 9.40875 15.6517 9.70164 15.3588L11.9997 13.0607L14.2978 15.3588C14.5907 15.6517 15.0656 15.6517 15.3585 15.3588C15.6514 15.0659 15.6514 14.591 15.3585 14.2981L13.0604 12L15.3585 9.7019C15.6514 9.40901 15.6514 8.93414 15.3585 8.64124C15.0656 8.34835 14.5907 8.34835 14.2978 8.64124L11.9997 10.9393L9.70164 8.64124Z"
                    fill="currentColor"
                ></path>
            </svg>
            <svg
                v-else
                aria-hidden="true"
                class="w-4 h-4 text-gray-200 animate-spin dark:text-gray-600 fill-slate-800"
                viewBox="0 0 100 101"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"></path>
                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"></path>
            </svg>
        </button>
    </form>
</template>

<style scoped>

</style>
