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
        a.classList.add('text-gray-700', 'hover:bg-gray-200', 'py-2', 'px-4', 'grow');
        a.textContent = entry.label;
        div.appendChild(a)
        li.appendChild(div);

        if (entry.children.length > 0) {
            // Add an arrow icon next to the parent menu item
            const arrow = document.createElement('button');
            arrow.textContent = '➤'; // Use a simple arrow for demonstration
            arrow.classList.add('px-2', 'hover:bg-gray-200');
            arrow.setAttribute('title', 'Toggle sub entries');
            div.appendChild(arrow);

            const ul = document.createElement('ul');
            ul.classList.add('overflow-hidden', 'transition-height');
            ul.style.height = '0'; // Initially hide the sub entries
            entry.children.forEach(child => ul.appendChild(this.createMenuEntry(child, level + 1)));
            li.appendChild(ul);

            // Toggle sub entries on arrow click
            arrow.addEventListener('click', () => {
                const isHidden = ul.style.height === '0px';
                ul.style.height = isHidden ? `${ul.scrollHeight}px` : '0';
                arrow.textContent = isHidden ? '⮟' : '➤';
            });
        }

        return li;
    }

    createNavigationMenu(): HTMLElement {
        console.log("Hello from NEW navigationMenu.ts");

        // Create the navigation element
        const nav = document.createElement('nav');
        nav.appendChild(document.createElement('ul'));
        nav.classList.add('bg-white', 'shadow', 'rounded-lg', 'p-4'); // Add Tailwind classes

        /*
        // Declare menu entries (PLACED BELOW CLASS DECL.)
        const entries: NavigationMenuEntry[] =
            [
                {label: "Home", url: "/", children: []},
                {label: "Kategorien", url: "/categories", children: []},
                {label: "Verkaufen", url: "/sell", children: []},
                {
                    label: "Unternehmen", url: "/company", children: [
                        {label: "Philosophie", url: "/company/philosophy", children: []},
                        {label: "Karriere", url: "/career", children: []},
                    ]
                },
            ];

         */

        // Create and append the menu entries
        // @ts-ignore
        entries.forEach(entry => nav.firstChild.appendChild(this.createMenuEntry(entry)));
        // @ts-ignore
        nav.firstElementChild.lastElementChild.classList.remove('border-b');
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
                {label: "Electronik", url: "/categories/electronics", children: []},
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
document.scripts[document.scripts.length - 1].insertAdjacentElement('afterend', navMenu.createNavigationMenu());
