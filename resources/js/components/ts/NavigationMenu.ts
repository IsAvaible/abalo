/**
 * Navigation menu entry interface
 */
interface NavigationMenuEntry           // Interface: defines expected structure of an object that has yet to be implemented
{
    label: string;
    url: string;
    children: NavigationMenuEntry[];
}

/**
 * Creates the navigation menu
 * @returns the navigation menu
 */

class NavigationMenu {
    entries: NavigationMenuEntry[];

    constructor(entries: NavigationMenuEntry[]) {
        this.entries = entries;
    }

    /**
     * Creates a menu entry
     * @param entry the entry to create
     * @param level the nesting level of the entry
     * @returns the created menu entry
     */
    createMenuEntry(entry: NavigationMenuEntry, level: number = 0): HTMLElement {
        const li = document.createElement('li');
        li.classList.add('flex', 'flex-col', 'justify-between'); // Add Tailwind classes
        if (level === 0) {
            li.classList.add('border-b', 'border-gray-200');
        }
        li.style.paddingLeft = `${level * 20}px`; // Add some padding based on the level

        const div = document.createElement('div');
        div.classList.add('flex', 'items-stretch');
        const a = document.createElement('a');
        a.href = entry.url;
        a.classList.add('text-slate-700', 'hover:text-black', 'hover:text-shadow-semibold', 'shadow-black', 'py-2', 'px-4', 'grow', 'transition-[colors,text-shadow]');
        a.textContent = entry.label;
        div.appendChild(a)
        li.appendChild(div);

        if (entry.children.length > 0) {
            // Add an arrow button next to the parent menu item
            const arrowButton = document.createElement('button');
            arrowButton.classList.add('p-2', 'group/arrow', 'flex', 'justify-center', 'focus:outline-none');
            arrowButton.setAttribute('title', 'Toggle sub entries');
            const arrow = document.createElement('p');
            arrowButton.appendChild(arrow);
            arrow.textContent = '﹥'; // Use a simple arrow for demonstration
            arrow.classList.add('scale-150', 'shadow-black', 'transition-[colors,text-shadow,transform]', 'group-hover/arrow:text-shadow-semibold', 'group-hover/arrow:text-black');
            div.appendChild(arrowButton);

            const ul = document.createElement('ul');
            ul.classList.add('overflow-hidden', 'transition-height');
            ul.style.height = '0'; // Initially hide the sub entries
            entry.children.forEach(child => ul.appendChild(this.createMenuEntry(child, level + 1)));
            li.appendChild(ul);

            // Toggle sub entries on arrow click
            arrowButton.addEventListener('click', () => {
                const isHidden = ul.style.height === '0px';
                const ulScrollHeight = ul.scrollHeight;
                ul.style.height = isHidden ? `${ulScrollHeight}px` : '0';
                arrow.classList.toggle('rotate-90');
                // Update the height of the parent ul elements
                let parent = li.parentElement;
                while (parent && parent.tagName === 'UL') {
                    parent.style.height = isHidden ? `${parent.scrollHeight + ulScrollHeight}px` : `${parent.scrollHeight - ulScrollHeight}px`;
                    parent = parent.parentElement?.parentElement ?? null;
                }
            });
        }

        return li;
    }

    createNavigationMenu(): HTMLElement {
        // Create the navigation element
        const nav = document.createElement('nav');
        const ul = document.createElement('ul');
        ul.classList.add('overflow-hidden', 'transition-height');
        nav.appendChild(ul);
        nav.classList.add('bg-white', 'shadow', 'rounded-lg', 'p-4'); // Add Tailwind classes

        // Create and append the menu entries
        entries.forEach(entry => ul.appendChild(this.createMenuEntry(entry)));
        nav.firstElementChild!.lastElementChild!.classList.remove('border-b');
        return nav;
    }
}

// Creating the Nav Menu:

// 1. Declare the menu entries
const entries: NavigationMenuEntry[] =
    [
        {label: "Home", url: "/", children: []},
        //{label: "Kategorien", url: "/categories", children: []},
        {
            label: "Kategorien", url: "/categories", children: [
                {label: "Elektronik", url: "/categories/electronics", children: []},
                {label: "Kleidung", url: "/categories/clothing", children: []},
                {label: "Bücher", url: "/categories/books", children: [
                        {label: "Fiktion", url: "/categories/books/fiction", children: []},
                        {label: "Sachbücher", url: "/categories/books/nonfiction", children: []},
                    ]},
                {label: "Home", url: "/categories/home", children: [
                        {label: "Zimmer", url: "/categories/home/rooms", children: [
                                {label: "Wohnzimmer", url: "/categories/home/rooms/livingroom", children: []},
                                {label: "Schlafzimmer", url: "/categories/", children: []},
                            ]},
                        {label: "Garden", url: "/categories/home/Garden", children: []},
                        {label: "DIY", url: "/categories/home/DIY", children: []},
                    ]},
                {label: "Toys", url: "/categories/toys", children: []},
                {label: "Health", url: "/categories/health", children: [
                        {label: "Beauty", url: "/categories/health/beauty", children: []},
                        {label: "Fitness", url: "/categories/health/fitness", children: []},
                    ]},
                {label: "Sports", url: "/categories/sports", children: []},
                {label: "Outdoors", url: "/categories/outdoors", children: []},
                {label: "Automotive", url: "/categories/automotive", children: []},
                {
                    label: "Media", url: "/categories/media", children: [
                        {label: "Music", url: "/categories/media/music", children: []},
                        {label: "Movies", url: "/categories/media/movies", children: []},
                        {label: "Games", url: "/categories/media/games", children: []},
                    ]
                },
            ]
        },
        {label: "Verkaufen", url: "/sell", children: []},
        {
            label: "Unternehmen", url: "/company", children: [
                {label: "Philosophie", url: "/company/philosophy", children: []},
                {label: "Karriere", url: "/career", children: []},
            ]
        },
    ];

// 2. Create instance of the navigation menu
const navMenu = new NavigationMenu(entries);

// 3. When the script is loaded, insert the navigation menu at the current script tag position
// document.scripts[document.scripts.length - 1].insertAdjacentElement('afterend', navMenu.createNavigationMenu());
// 3. Hardcoded navigation menu position
document.querySelector("div[role='dialog']")!.appendChild(navMenu.createNavigationMenu());

// 4. Add event listener to the hamburger button
const navMenuDialog = document.getElementById('nav-menu-dialog');
const hamburgerButton = document.getElementById('hamburger-button');
const container = hamburgerButton.parentElement;
let isOpen = false;

const toggleDialog = () => {
    container.classList.toggle('group');
    navMenuDialog.classList.toggle('opacity-0');
    navMenuDialog.classList.toggle('pointer-events-none');
    isOpen = !isOpen;
};

hamburgerButton.addEventListener('click', () => {
    toggleDialog()

    const eventListener: EventListener = (event) => {
        if (isOpen && !navMenuDialog.contains(event.target as Node) && !hamburgerButton.contains(event.target as Node)) {
            toggleDialog();
            // Remove the event listener
            document.removeEventListener('click', eventListener);
        }
    }

    document.addEventListener('click', eventListener);
});
