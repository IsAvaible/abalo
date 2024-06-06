import './bootstrap';
import {createApp} from 'vue';
import HelloVue from "@/components/vue/misc/HelloVue.vue";
import SearchBar from "@/components/vue/page/SearchBar.vue";
import ArticleFilterForm from "@/components/vue/articles/ArticleFilterForm.vue";

createApp(HelloVue).mount('#hello-vue');
createApp(SearchBar).mount('#VUE-search-bar');
createApp(ArticleFilterForm).mount('#VUE-article-filter-form');

