import {formatNumberToEuro} from "../../util/formatNumberToEuro";
import {Article} from "./Article";

// Create the shopping cart button
const cartButton = document.createElement('button');
cartButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">\n' +
    ' <path stroke-linecap="round" stroke-linejoin="round" d="M3 6H22L19 16H6L3 6ZM3 6L2.25 3.5"></path><path stroke-linecap="round" stroke-linejoin="round" d="M11 19.5C11 20.3284 10.3284 21 9.5 21C8.67157 21 8 20.3284 8 19.5"></path><path stroke-linecap="round" stroke-linejoin="round" d="M17 19.5C17 20.3284 16.3284 21 15.5 21C14.6716 21 14 20.3284 14 19.5"></path>'
    '</svg>';
cartButton.className = 'fixed bottom-4 right-4 bg-slate-800 text-white rounded-full p-4 hover:bg-slate-900 transition-colors z-50 hidden max-[1600px]:block';
cartButton.title = 'Open Shopping Cart';

// Create the shopping cart dialog
const dialog = document.createElement('div');
dialog.setAttribute('role', 'dialog');
dialog.className = 'max-[1600px]:fixed bottom-20 right-4 bg-white rounded-lg max-[1600px]:shadow-lg p-4 max-[1600px]:pointer-events-none max-[1600px]:opacity-0 max-[1600px]:scale-0 origin-[calc(100%_-_2rem)_bottom] duration-300 min-w-68';
dialog.style.transitionProperty = 'opacity, transform';

/**
 * Function to toggle the visibility of the cart dialog
 */
function toggleCartDialog() {
    dialog.classList.toggle('max-[1600px]:pointer-events-none');
    dialog.classList.toggle('max-[1600px]:scale-0');
    dialog.classList.toggle('max-[1600px]:opacity-0');
}

// Attach the click event listener to the cart button
cartButton.addEventListener('click', toggleCartDialog);

// Create the dialog title
dialog.appendChild(document.createElement('h2')).textContent = 'Shopping Cart';
dialog.firstElementChild!.className = 'text-lg font-semibold';

// Create the cart table
const table = document.createElement('div');
table.className = 'grid gap-x-3 gap-y-2 items-center mt-2';
table.style.gridTemplateColumns = '1fr auto auto';

// Create the warning message
const noItemWarning = document.createElement('span');
noItemWarning.textContent = 'No items in the cart';
noItemWarning.classList.add('text-center', 'text-gray-500');
dialog.appendChild(noItemWarning);

// Create the total price label
const itemTotalLabel = document.createElement('span');
let itemTotal = 0;
itemTotalLabel.classList.add('text-center', 'col-span-2', 'font-semibold');
table.appendChild(itemTotalLabel);

// Create the checkout button
const checkoutButton = document.createElement('button');
checkoutButton.textContent = 'Go to Checkout';
checkoutButton.className = 'bg-slate-800 hover:bg-slate-900 text-white font-bold py-2 px-4 rounded transition-colors col-span-3 relative';
checkoutButton.title = 'Checkout';
table.appendChild(checkoutButton);

// Get the footer element
let footer: HTMLElement | null = null;
setTimeout(() => {
    footer = document.querySelector('footer');
}, 0);

// Scroll event listener to adjust the position of the cart button and dialog
// so that they always stay atop the footer
window.addEventListener('scroll', () => {
    const visibleFooterHeight = Math.max(window.innerHeight - footer!.getBoundingClientRect().top, 0);
    if (visibleFooterHeight > 0) {
        cartButton.style.bottom = `${visibleFooterHeight + 16}px`;
        dialog.style.bottom = `${visibleFooterHeight + 80}px`;
    } else {
        cartButton.style.bottom = '1rem';
        dialog.style.bottom = '5rem';
    }
});

// Array to store the articles in the cart
const articles: Article[] = []

// Function to add an article to the cart
export function addToCart(article: Article, caller: HTMLButtonElement) {
    // Check if the item is already in the cart
    if (articles.find((a) => a.id === article.id)) {
        return;
    }

    // If the cart is empty, remove the warning message
    if (articles.length === 0) {
        dialog.replaceChild(table, noItemWarning)
    }

    // Add the article to the cart
    articles.push(article);

    // Create the row for the item
    const itemRow = document.createElement('div');
    itemRow.classList.add('grid', 'grid-cols-subgrid', 'col-span-3', 'transition-all', 'scale-0', 'opacity-0', 'max-[1600px]:origin-right', 'overflow-hidden', 'items-center');
    // Create the elements for the cart table
    const itemName = document.createElement('span');
    itemName.textContent = article.ab_name;
    const itemPrice = document.createElement('span');
    itemPrice.textContent = formatNumberToEuro(article.ab_price);
    itemPrice.classList.add('text-nowrap');
    const itemRemoveButton = document.createElement('button');
    itemRemoveButton.innerHTML = '<svg width="24px" height="24px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="currentColor"  stroke-width="1.5"><path fill-rule="evenodd" clip-rule="evenodd" d="M12 1.25C6.06294 1.25 1.25 6.06294 1.25 12C1.25 17.9371 6.06294 22.75 12 22.75C17.9371 22.75 22.75 17.9371 22.75 12C22.75 6.06294 17.9371 1.25 12 1.25ZM9.70164 8.64124C9.40875 8.34835 8.93388 8.34835 8.64098 8.64124C8.34809 8.93414 8.34809 9.40901 8.64098 9.7019L10.9391 12L8.64098 14.2981C8.34809 14.591 8.34809 15.0659 8.64098 15.3588C8.93388 15.6517 9.40875 15.6517 9.70164 15.3588L11.9997 13.0607L14.2978 15.3588C14.5907 15.6517 15.0656 15.6517 15.3585 15.3588C15.6514 15.0659 15.6514 14.591 15.3585 14.2981L13.0604 12L15.3585 9.7019C15.6514 9.40901 15.6514 8.93414 15.3585 8.64124C15.0656 8.34835 14.5907 8.34835 14.2978 8.64124L11.9997 10.9393L9.70164 8.64124Z"></path></svg>';
    itemRemoveButton.classList.add('text-slate-800', 'hover:scale-105', 'hover:text-black');
    itemRemoveButton.style.transition = 'transform, color';
    itemRemoveButton.title = 'Remove from Cart';
    // Append the elements to the row
    itemRow.append(itemName, itemPrice, itemRemoveButton);

    // Attach the click event listener to the remove button
    itemRemoveButton.addEventListener('click', function removeItem() {
        // Animate the row
        itemRow.style.height = `${itemRow.scrollHeight}px`;
        setTimeout(() => {
            itemRow.style.height = '0';
            itemRow.classList.add('opacity-0');
        });

        // Reset the button in the overview table
        caller.title = 'Add to Cart';
        caller.disabled = false;

        // Update the total price
        itemTotal = articles.reduce((acc, a) => acc + a.ab_price * Number(!(a.id == article.id)), 0);
        itemTotalLabel.textContent = 'Total: ' + formatNumberToEuro(itemTotal);

        itemRow.addEventListener('transitionend', () =>  {
            articles.splice(articles.indexOf(article), 1);
            itemRow.remove();

            // If the cart is empty, show the warning message
            if (table.children.length === 2) {
                dialog.replaceChild(noItemWarning, table);
            }
        }, {once: true});
    }, {once: true});

    // Append the elements to the cart table
    table.insertBefore(itemRow, itemTotalLabel);
    // Animate the row
    setTimeout(() => {
        itemRow.classList.remove('scale-0', 'opacity-0');
    },);
    // Update the total price
    itemTotal = articles.reduce((acc, a) => acc + a.ab_price, 0);
    itemTotalLabel.textContent = 'Total: ' + formatNumberToEuro(itemTotal);

    // Show the dialog if it is hidden
    if (dialog.classList.contains('max-[1600px]:scale-0')) {
        toggleCartDialog();
    }

    // Disable the button and change its text
    caller.title = 'In Cart';
    caller.disabled = true;
}

// Append the dialog and button to the body
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('shopping-cart')!.innerHTML = '';
    document.getElementById('shopping-cart')!.appendChild(dialog);
    document.body.appendChild(cartButton);
});
