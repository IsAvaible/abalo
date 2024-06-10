import './bootstrap';

import {createApp} from 'vue';
import PrimeVue from 'primevue/config';
import 'primevue/resources/themes/aura-light-noir/theme.css';
import '../css/flags.css';

import Tooltip from 'primevue/tooltip';
import Dialog from 'primevue/dialog';

import SearchBar from "@/components/vue/page/SearchBar.vue";
import ArticleFilterForm from "@/components/vue/articles/ArticleFilterForm.vue";
import SortOptionDropdown from "@/components/vue/articles/SortOptionDropdown.vue";
import FilterChips from "@/components/vue/articles/FilterChips.vue";

createApp({
    data() {return {filterChips: {}, filterDialogVisible: false, isMobile: window.innerWidth <= 768}},
    created() {
        window.addEventListener("resize", this.handleScreenSizeChange);
    },
    methods: {
        handleScreenSizeChange() {
            this.isMobile = window.innerWidth <= 768;
            if (!this.isMobile) {
                this.filterDialogVisible = false;
            }
        }
    }
})
    .component('SearchBar', SearchBar)
    .component('ArticleFilterForm', ArticleFilterForm)
    .component('SortOptionDropdown', SortOptionDropdown)
    .component('FilterChips', FilterChips)
    .component('Dialog', Dialog)
    .use(PrimeVue)
    .directive('tooltip', Tooltip)
    .mount('#app');
