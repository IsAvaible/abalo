/**
 * Navigation menu entry interface
 */
interface NavigationMenuEntry {
    label: string;
    url: string;
    children: NavigationMenuEntry[];
}

/**
 * Creates the navigation menu
 * @returns the navigation menu
 */
export function createNavigationMenu(): HTMLElement {
    console.log("Hello from navigationMenu.ts");
    // Create the navigation element
    const nav = document.createElement('nav');
    nav.appendChild(document.createElement('ul'));
    nav.classList.add('bg-white', 'shadow', 'rounded-lg', 'p-4'); // Add Tailwind classes
    // Declare the menu entries
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
    // Create and append the menu entries
    entries.forEach(entry => nav.firstChild.appendChild(createMenuEntry(entry)));
    nav.firstElementChild.lastElementChild.classList.remove('border-b');
    return nav;
}

/**
 * Creates a menu entry
 * @param entry the entry to create
 * @param level the nesting level of the entry
 * @returns the created menu entry
 */
function createMenuEntry(entry: NavigationMenuEntry, level: number = 0): HTMLElement {
    const li = document.createElement('li');
    li.classList.add('flex', 'flex-col', 'justify-between'); // Add Tailwind classes
    if (level === 0) {
        li.classList.add( 'border-b', 'border-gray-200');
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
        entry.children.forEach(child => ul.appendChild(createMenuEntry(child, level + 1)));
        li.appendChild(ul);

        // Toggle sub entries on arrow click
        arrow.addEventListener('click', () => {
            const isHidden = ul.style.height === '0px';
            ul.style.height = isHidden ? `${ul.scrollHeight}px` : '0';
            arrow.textContent = isHidden ? '⮟':'➤';
        });
    }

    return li;
}

// When the script is loaded, insert the navigation menu at the current script tag position
document.scripts[document.scripts.length - 1].insertAdjacentElement('afterend', createNavigationMenu());
