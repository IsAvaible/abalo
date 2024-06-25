<script lang="ts">
import {defineComponent} from 'vue'
import Index from "@/components/vue/newsite/routes/Route.Index.vue";
import Sell from "@/components/vue/newsite/routes/Route.Sell.vue";
import PrivacyPolicy from "@/components/vue/newsite/routes/Route.PrivacyPolicy.vue";
import Imprint from "@/components/vue/newsite/routes/Route.Imprint.vue";
import Licensing from "@/components/vue/newsite/routes/Route.Licensing.vue";
import NotFound from "@/components/vue/newsite/routes/Route.NotFound.vue";

export default defineComponent({
    name: "AbaloBody",
    data() {
        return {
            component: '',
            currentPath: window.location.pathname
        }
    },
    methods: {
        /**
         * Update the content based on the URL
         * @param url The URL to update the content for
         */
        onNavigate(url: URL) {
            switch (url.pathname.replace(/^\/newsite/, "")) {
                case "":
                case "/":
                    document.title = "Abalo - Home";
                    this.component = "Index";
                    break;
                case "/sell":
                    document.title = "Abalo - Sell Article";
                    this.component = "Sell";
                    break;
                case "/privacy":
                    document.title = "Abalo - Privacy Policy";
                    this.component = "PrivacyPolicy";
                    break;
                case "/imprint":
                    document.title = "Abalo - Imprint";
                    this.component = "Imprint";
                    break;
                case "/licensing":
                    document.title = "Abalo - Licensing";
                    this.component = "Licensing";
                    break;
                default:
                    document.title = "Abalo - Not Found";
                    this.component = "NotFound";
                    break;
            }
        }
    },
    mounted() {
        // Load the proper content when the page loads
        this.onNavigate(new URL(window.location.href));
        // Update the content when the URL changes
        window.addEventListener("popstate", () => {
            this.onNavigate(new URL(window.location.href));
        });
        window.addEventListener("navigate", (event: CustomEvent) => {
            const url = new URL(event.detail.url);
            this.onNavigate(url);
        });
    },
    components: {
        Index,
        Sell,
        PrivacyPolicy,
        Imprint,
        Licensing,
        NotFound
    }
})
</script>

<template>
    <div class="min-h-[calc(100svh_-_5rem)] flex flex-col">
        <component :is="component" />
    </div>
</template>

<style scoped>

</style>
