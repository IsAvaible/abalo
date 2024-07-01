<script lang="ts">
import {defineComponent} from 'vue'
import PopupMenuEntry from "@/components/vue/newsite/page/PopupMenuEntry.vue";

/**
 * Navigation menu entry interface
 */
interface NavigationMenuEntry {
    label: string;
    url: string;
    children: NavigationMenuEntry[];
}

export default defineComponent({
    name: "PopupMenu",
    props: {
        entries: {
            type: Array as () => NavigationMenuEntry[],
            required: false,
            default: () => [
                {label: "Home", url: "/newsite/", children: []},
                {
                    label: "Categories", url: "/newsite/categories", children: [
                        {label: "Electronics", url: "/newsite/categories/electronics", children: []},
                        {label: "Clothing", url: "/newsite/categories/clothing", children: []},
                        {
                            label: "Books", url: "/newsite/categories/books", children: [
                                {label: "Fiction", url: "/newsite/categories/books/fiction", children: []},
                                {label: "Nonfiction", url: "/newsite/categories/books/nonfiction", children: []},
                            ]
                        },
                        {
                            label: "Home", url: "/newsite/categories/home", children: [
                                {
                                    label: "Rooms", url: "/newsite/categories/home/rooms", children: [
                                        {label: "Living Room", url: "/newsite/categories/home/rooms/livingroom", children: []},
                                        {label: "Bedroom", url: "/newsite/categories/", children: []},
                                    ]
                                },
                                {label: "Garden", url: "/newsite/categories/home/Garden", children: []},
                                {label: "DIY", url: "/newsite/categories/home/DIY", children: []},
                            ]
                        },
                        {label: "Toys", url: "/newsite/categories/toys", children: []},
                        {
                            label: "Health", url: "/newsite/categories/health", children: [
                                {label: "Beauty", url: "/newsite/categories/health/beauty", children: []},
                                {label: "Fitness", url: "/newsite/categories/health/fitness", children: []},
                            ]
                        },
                        {label: "Sports", url: "/newsite/categories/sports", children: []},
                        {label: "Outdoors", url: "/newsite/categories/outdoors", children: []},
                        {label: "Automotive", url: "/newsite/categories/automotive", children: []},
                        {
                            label: "Media", url: "/newsite/categories/media", children: [
                                {label: "Music", url: "/newsite/categories/media/music", children: []},
                                {label: "Movies", url: "/newsite/categories/media/movies", children: []},
                                {label: "Games", url: "/newsite/categories/media/games", children: []},
                            ]
                        },
                    ]
                },
                {label: "Sell", url: "/newsite/sell", children: []},
                {
                    label: "Company", url: "/newsite/company", children: [
                        {label: "Philosophy", url: "/newsite/company/philosophy", children: []},
                        {label: "Career", url: "/newsite/career", children: []},
                    ]
                },
            ]
        },
        open: {
            type: Boolean,
            default: false,
        },
    },
    data: () => {
        return {
            _open: false,
        }
    },
    methods: {
        toggle() {
            this._open = !this._open;
        },
        documentClickListener(event: MouseEvent) {
            if (this._open && !this.$el.parentElement.contains(event.target as Node)) {
                this.toggle();
                document.removeEventListener('click', this.documentClickListener);
            }
        }
    },
    watch: {
        open: {
            immediate: true,
            handler(value) {
                this._open = value;
            }
        },
        _open() {
            this.$emit('update:open', this._open);
            if (this._open) {
                document.addEventListener('click', this.documentClickListener);
            }
        }
    },
    emits: ['update:open'],
    components: {
        PopupMenuEntry
    },
    unmounted() {
        document.removeEventListener('click', this.documentClickListener);
    },
})
</script>

<template>
    <div id="nav-menu-dialog" class="menu" :class="{'menu--_open': _open}" role="dialog">
        <nav class="menu__nav">
            <ul class="menu__list">
                <popup-menu-entry v-for="entry in entries" :key="entry.label" :entry="entry" class="menu__entry"/>
            </ul>
        </nav>
    </div>
</template>

<style scoped lang="scss">
// Feature 1: Importing a module
@use 'sass:math';

// Feature 2: Variables
$shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
$smooth-transition: 0.15s cubic-bezier(0.4, 0, 0.2, 1);

// Feature 3: @at-root directive to apply the classes to the root element
@at-root
.menu {
    // @apply flex flex-col absolute right-0 bg-white rounded-lg w-fit z-50 transition-opacity
    display: flex;
    flex-direction: column;
    position: absolute;
    right: 0;
    background-color: white;
    // Feature 4: Math functions
    border-radius: math.div(1rem, 2);
    // Feature 5: Debugging
    @debug math.div(1rem, 2);
    width: fit-content;
    z-index: 50;
    opacity: 0;
    pointer-events: none;
    transition: opacity $smooth-transition;

    // Feature 3: Nested selectors
    &--_open {
        // @apply opacity-100 pointer-events-auto
        opacity: 1;
        pointer-events: auto;
    }

    &__nav {
        // @apply bg-white shadow rounded-lg p-4
        background-color: white;
        box-shadow: $shadow;
        border-radius: 0.5rem;
        padding: 1rem;
    }

    &__list {
        // @apply overflow-hidden transition-height
        overflow: hidden;
        transition: height $smooth-transition;
    }

    &__entry:last-child {
        // @apply border-b-0
        border-bottom: 0;
    }
}
</style>
