<script lang="ts">
import {defineComponent} from 'vue'
import SearchBar from "@/components/vue/page/SearchBar.vue";
import AddArticleForm from "@/components/vue/articles/AddArticleForm.vue";

export default defineComponent({
    name: "RouteArticlesAddArticle",
    template: '#route-articles-add-article',
    components: {
        SearchBar,
        AddArticleForm
    },
})
</script>

<style scoped>

</style>
