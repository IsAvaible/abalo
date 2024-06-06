import './bootstrap';
import {createApp} from 'vue';
import HelloVue from "@/components/vue/misc/HelloVue.vue";
import SearchBar from "@/components/vue/page/SearchBar.vue";

createApp(HelloVue).mount('#hello-vue');
createApp(SearchBar).mount('#VUE-search-bar');

