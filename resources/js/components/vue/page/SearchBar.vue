<script setup lang="ts">
import {onMounted, ref, toRefs} from 'vue'

// Props
const props = defineProps<{ search: string }>();
const { search: searchProp } = toRefs(props);
const search = ref<string>(searchProp.value ?? '');

// Refs
const input = ref<HTMLInputElement | null>(null);
const form = ref<HTMLFormElement | null>(null);

// Lifecycle Hooks
onMounted(() => {
    if (search.value.length > 11) input.value.setAttribute('data-rtl', '');
});

// Methods
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
    console.log(event.relatedTarget, form.value.contains(event.relatedTarget as Node));
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
        class="group relative flex flex-row -mr-4 gap-x-2 items-center rounded-full py-1 hover:ring-opacity-100 focus-within:ring-opacity-100 has-[input:not(:placeholder-shown)]:ring-opacity-100 hover:px-4 focus-within:px-4 has-[input:not(:placeholder-shown)]:px-4 hover:mr-0 focus-within:mr-0 has-[input:not(:placeholder-shown)]:mr-0 ring-1 ring-slate-800 ring-opacity-0 transition-[padding,margin,box-shadow] duration-500"
        @focusin="handleFormFocusIn"
        @focusout="handleFormFocusOut"
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
        </button>
    </form>
</template>

<style scoped>

</style>
