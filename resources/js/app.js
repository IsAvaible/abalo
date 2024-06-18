import './bootstrap';
import 'primevue/resources/themes/aura-light-noir/theme.css';
import '../css/flags.css';

import {createApp} from 'vue'
import PrimeVue from "primevue/config";
import Tooltip from "primevue/tooltip";

import RouteArticles from "@/components/vue/routes/Route.Articles.vue";
import RouteArticlesAddArticle from "@/components/vue/routes/Route.Articles.AddArticle.vue";

import SearchBar from "@/components/vue/page/SearchBar.vue";
import ShoppingCart from "@/components/ts/shoppingCart/ShoppingCart";
import "@/components/ts/NavigationMenu";
import "@/components/ts/CookieBanner";

// SSR
if (document.getElementById('hyd-ssr-app')) {
    createApp({
        components: {
            RouteArticles,
            RouteArticlesAddArticle,

            SearchBar,
        },
    })
        .use(PrimeVue)
        .directive('tooltip', Tooltip)
        .mount('#hyd-ssr-app');

    ShoppingCart.getInstance();
}

if (document.getElementById('spa-app')) {
    createApp({
        components: {
            SearchBar,
        },
    })
        .use(PrimeVue)
        .directive('tooltip', Tooltip)
        .mount('#spa-app');
}

