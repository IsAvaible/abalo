import {createApp} from 'vue'

import PrimeVue from "primevue/config";
import Dialog from "primevue/dialog";
import Tooltip from "primevue/tooltip";

import SearchBar from "@/components/vue/page/SearchBar.vue";
import ArticleFilterForm from "@/components/vue/articles/ArticleFilterForm.vue";
import SortOptionDropdown from "@/components/vue/articles/SortOptionDropdown.vue";
import FilterChips from "@/components/vue/articles/FilterChips.vue";

import {init as initOverview} from "../../ts/articles/articlesOverview";

createApp({
    data() {
        return {filterChips: {}, filterDialogVisible: false, isMobile: window.innerWidth <= 768}
    },
    components: {
        SearchBar,
        ArticleFilterForm,
        SortOptionDropdown,
        FilterChips,
        Dialog
    },
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
    .use(PrimeVue)
    .directive('tooltip', Tooltip)
    .mount('#app');

initOverview();
