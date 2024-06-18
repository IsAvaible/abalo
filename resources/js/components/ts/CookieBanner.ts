import CookieStore from '../../stores/CookieStore';

// DOM manipulation and event handling
const dialog = document.createElement('dialog');
dialog.setAttribute('open', '');
dialog.classList.add('max-w-screen-xl', 'fixed', 'bottom-10', 'z-10', 'mx-auto', 'bg-white', 'dark:bg-slate-800', 'inset-x-5', 'p-5', 'rounded-lg', 'drop-shadow-2xl', 'max-h-[80%]', 'overflow-y-auto', 'transition-opacity', 'duration-300');

const dialogContainer = document.createElement('div');
dialogContainer.classList.add('flex', 'gap-4', 'flex-wrap', 'md:flex-nowrap', 'text-center', 'md:text-left', 'items-center', 'justify-center', 'md:justify-between');

const description = document.createElement('h3');
description.setAttribute('tabindex', '-1');
description.classList.add('w-full', 'dark:text-slate-100', 'focus:outline-none');
description.textContent = "Diese Website nutzt externe Inhalte wie Karten und Videos, welche eventuell Cookies setzen und/oder Daten an Dritte weitergeben. ";

const link = document.createElement('a');
link.href = "/datenschutz";
link.classList.add('text-blue-700', 'whitespace-nowrap', 'hover:underline');
link.textContent = "Mehr Erfahren";
description.appendChild(link);

const buttonsContainer = document.createElement('div');
buttonsContainer.classList.add('flex', 'gap-4', 'items-center', 'flex-shrink-0');

const declineButton = document.createElement('button');
declineButton.classList.add('text-slate-900', 'hover:underline');
declineButton.textContent = "Ablehnen";
declineButton.addEventListener('click', () => {
    CookieStore.set(false);
    dialog.classList.add('opacity-0');
    dialog.addEventListener('transitionend', () => {
        document.body.removeChild(dialog);
    }, {once: true});
});

const acceptButton = document.createElement('button');
acceptButton.classList.add('bg-slate-800', 'px-5', 'py-2', 'text-white', 'rounded-md', 'hover:bg-black', 'transition-colors', 'focus:ring-1', 'focus:ring-inset', 'focus:ring-white');
acceptButton.textContent = "Akzeptieren";
acceptButton.addEventListener('click', () => {
    CookieStore.set(true);
    dialog.classList.add('opacity-0');
    dialog.addEventListener('transitionend', () => {
        document.body.removeChild(dialog);
    }, {once: true});
});

buttonsContainer.appendChild(declineButton);
buttonsContainer.appendChild(acceptButton);

dialogContainer.appendChild(description);
dialogContainer.appendChild(buttonsContainer);

dialog.appendChild(dialogContainer);

// Show the dialog if the cookie is not set
if (CookieStore.get() === null) {
    document.body.appendChild(dialog);

    // Focus handling
    window.addEventListener('DOMContentLoaded', () => {
        setTimeout(() => {
            description.focus();
        }, 1); // Simulating delay
    });
}
