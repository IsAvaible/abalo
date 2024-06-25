<script lang="ts">
import {defineComponent} from 'vue'
import navigate from "@/util/navigate";

export default defineComponent({
    name: "PopupMenuEntry",
    props: {
        entry: {
            type: Object as () => NavigationMenuEntry,
            required: true,
        },
        level: {
            type: Number,
            default: 0,
        },
    },
    data: () => {
        return {
            open: false,
        }
    },
    methods: {
        navigate,
        toggleSubmenu(event: Event) {
            const li = (event.currentTarget as HTMLElement).parentElement.parentElement as HTMLElement;
            const ul = li.lastChild as HTMLElement;
            const isHidden = ul.style.height === '0px';
            const ulScrollHeight = ul.scrollHeight;
            ul.style.height = isHidden ? `${ulScrollHeight}px` : '0';
            (event.currentTarget as HTMLElement).querySelector('p')?.classList.toggle('rotate-90');

            // Update the height of the parent ul elements
            let parent = li.parentElement;
            while (parent && parent.tagName === 'UL') {
                parent.style.height = isHidden ? `${parent.scrollHeight + ulScrollHeight}px` : `${parent.scrollHeight - ulScrollHeight}px`;
                parent = parent.parentElement?.parentElement ?? null;
            }

            this.open = !this.open;
        },
    },

})
</script>

<template>
    <li :class="['flex flex-col justify-between', { 'border-b border-gray-200': level === 0 }]" :style="{ paddingLeft: level * 20 + 'px' }">
        <div class="flex items-stretch">
            <a :href="entry.url" @click.prevent="navigate($event.currentTarget)" class="text-slate-700 hover:text-black hover:text-shadow-semibold shadow-black py-2 px-4 grow transition-[colors,text-shadow]">{{ entry.label }}</a>
            <button v-if="entry.children.length > 0" @click="toggleSubmenu($event)" class="p-2 group/arrow flex justify-center focus:outline-none" title="Toggle sub entries">
                <p class="scale-150 shadow-black transition-[colors,text-shadow,transform] group-hover/arrow:text-shadow-semibold group-hover/arrow:text-black">﹥</p>
            </button>
        </div>
        <ul v-if="entry.children.length > 0" class="overflow-hidden transition-height" style="height: 0;">
            <popup-menu-entry v-for="child in entry.children" :key="child.label" :entry="child" :level="level + 1" />
        </ul>
    </li>
</template>

<style scoped>

</style>
