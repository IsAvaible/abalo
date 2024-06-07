import './bootstrap';

import {createApp} from 'vue';
import PrimeVue from 'primevue/config';
import 'primevue/resources/themes/aura-light-noir/theme.css';
import '../css/flags.css';


import HelloVue from "@/components/vue/misc/HelloVue.vue";
import SearchBar from "@/components/vue/page/SearchBar.vue";
import ArticleFilterForm from "@/components/vue/articles/ArticleFilterForm.vue";

createApp(HelloVue).mount('#hello-vue');
createApp(SearchBar).mount('#VUE-search-bar');
createApp(ArticleFilterForm).use(PrimeVue).mount('#VUE-article-filter-form');

