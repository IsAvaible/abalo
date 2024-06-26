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

import AbaloHeader from "@/components/vue/newsite/page/AbaloHeader.vue";
import AbaloContent from "@/components/vue/newsite/page/AbaloBody.vue";
import AbaloFooter from "@/components/vue/newsite/page/AbaloFooter.vue";
import {createPinia} from "pinia";


// SSR
if (document.getElementById('hyd-ssr-app')) {
    import('@/components/ts/NavigationMenu');
    import('@/components/ts/CookieBanner');

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

// SPA
if (document.getElementById('spa-app')) {
    createApp({
        components: {
            AbaloHeader,
            AbaloContent,
            AbaloFooter,
        },
    })
        .use(PrimeVue)
        .use(createPinia())
        .directive('tooltip', Tooltip)
        .mount('#spa-app')

    Echo.channel('maintenance')
        .listen('.message-updated', (e) => {
            console.log(e);
        }
    );
}


