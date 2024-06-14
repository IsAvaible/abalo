import {createApp} from 'vue'

import PrimeVue from "primevue/config";

import SearchBar from "@/components/vue/page/SearchBar.vue";
import AddArticleForm from "@/components/vue/articles/AddArticleForm.vue";


createApp({
    components: {
        SearchBar,
        AddArticleForm
    },
})
    .use(PrimeVue)
    .mount('#app');
