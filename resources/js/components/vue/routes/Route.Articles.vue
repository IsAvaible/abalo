<script lang="ts">
import {defineComponent} from 'vue'
import Dialog from "primevue/dialog";

import ArticleFilterForm from "@/components/vue/articles/ArticleFilterForm.vue";
import SortOptionDropdown from "@/components/vue/articles/SortOptionDropdown.vue";
import FilterChips from "@/components/vue/articles/FilterChips.vue";

import {init as initOverview} from "../../ts/articles/articlesOverview";

export default defineComponent({
    name: "RouteArticles",
    template: '#route-articles',
    data() {
        return {filterChips: {}, filterDialogVisible: false, isMobile: window.innerWidth <= 768}
    },
    components: {
        ArticleFilterForm,
        SortOptionDropdown,
        FilterChips,
        Dialog
    },
    mounted() {
        window.addEventListener("resize", this.handleScreenSizeChange);
        initOverview();
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
</script>

<style scoped>

</style>
