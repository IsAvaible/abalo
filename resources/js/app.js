import './bootstrap';

import {createApp} from 'vue';
import PrimeVue from 'primevue/config';
import 'primevue/resources/themes/aura-light-noir/theme.css';
import '../css/flags.css';

import SearchBar from "@/components/vue/page/SearchBar.vue";
import ArticleFilterForm from "@/components/vue/articles/ArticleFilterForm.vue";
import SortOptionDropdown from "@/components/vue/articles/SortOptionDropdown.vue";

createApp({})
    .component('SearchBar', SearchBar)
    .component('ArticleFilterForm', ArticleFilterForm)
    .component('SortOptionDropdown', SortOptionDropdown)
    .use(PrimeVue)
    .mount('#app');
