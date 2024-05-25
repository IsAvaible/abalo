import {formatNumberToEuro} from "../../util/formatNumberToEuro";
import Article from "../articles/Article";
import ShoppingCartItem from "./ShoppingCartItem";

// Create the shopping cart button
const cartButton = document.createElement('button');
cartButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">\n' +
    ' <path stroke-linecap="round" stroke-linejoin="round" d="M3 6H22L19 16H6L3 6ZM3 6L2.25 3.5"></path><path stroke-linecap="round" stroke-linejoin="round" d="M11 19.5C11 20.3284 10.3284 21 9.5 21C8.67157 21 8 20.3284 8 19.5"></path><path stroke-linecap="round" stroke-linejoin="round" d="M17 19.5C17 20.3284 16.3284 21 15.5 21C14.6716 21 14 20.3284 14 19.5"></path>'
    '</svg>';
cartButton.className = 'fixed bottom-4 right-4 bg-slate-800 text-white rounded-full p-4 hover:bg-slate-900 transition-colors z-50 hidden max-[1600px]:block';
cartButton.title = 'Open Shopping Cart';

// Create the shopping cart dialog
const dialog = document.createElement('div');
dialog.className = 'max-[1600px]:fixed bottom-20 right-4 bg-white rounded-lg max-[1600px]:shadow-lg p-4 max-[1600px]:pointer-events-none max-[1600px]:opacity-0 max-[1600px]:scale-0 transition-all origin-[calc(100%_-_2rem)_bottom] duration-300 min-w-68';

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

// Create the loading spinner
const loadingSpinner = document.createElement('div');
loadingSpinner.className = 'inset-0 h-64 bg-white bg-opacity-50 flex items-center justify-center max-[1600px]:hidden';
loadingSpinner.innerHTML = '<svg aria-hidden="true" class="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-slate-800" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">\n' +
    '        <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>\n' +
    '        <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>\n' +
    '    </svg>\n' +
    '    <span class="sr-only">Loading Shopping Cart</span>';
document.getElementById('shopping-cart')!.appendChild(loadingSpinner);

// Array to store the articles in the cart
const cart: Article[] = []

// Function to add an article to the cart
export function addToCart(article: Article, fromDB: boolean = false) {
    if (!fromDB) console.log('Adding article with name', article.ab_name, 'to the cart.');

    // Check if the item is already in the cart
    if (cart.find((a) => a.id === article.id)) {
        console.error('Article is already in the cart.');
        return;
    }

    const shoppingCartId = document.querySelector('meta[name="shopping-cart-id"]')?.getAttribute('content');
    const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');

    if (!shoppingCartId || !csrfToken) {
        console.error('Shopping Cart ID or CSRF Token not found. Try refreshing the page.');
        return;
    }

    // If the cart is empty, remove the warning message
    if (cart.length === 0) {
        dialog.removeChild(noItemWarning);
        dialog.appendChild(table);
    }

    // Add the article to the cart
    cart.push(article);

    if (!fromDB) {
        // Add the article to the remote shopping cart
        fetch(`/api/shoppingcart/${shoppingCartId}/articles/${article.id}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': csrfToken
            }
        }).then(response => {
            if (!response || !response.ok) {
                return Promise.reject(response);
            }
            console.log('Successfully added article with name', article.ab_name, 'to the remote cart.');
        }).catch(error => {
            console.error('Error adding article to remote cart:', error);

            // Remove the article from the cart by simulating a click on the remove button
            document.querySelector(`div[data-article-id="${article.id}"]`)?.querySelector('button')?.dispatchEvent(new Event('click'));
        });
    }

    // Create the row for the item
    const itemRow = document.createElement('div');
    itemRow.classList.add('grid', 'grid-cols-subgrid', 'col-span-3', 'transition-all', 'max-[1600px]:origin-right', 'overflow-hidden', 'items-center');
    if (!fromDB) {
        itemRow.classList.add('scale-0', 'opacity-0');
    }
    itemRow.dataset.articleId = article.id.toString();
    // Create the elements for the cart table
    const itemName = document.createElement('span');
    itemName.textContent = article.ab_name;
    const itemPrice = document.createElement('span');
    itemPrice.textContent = formatNumberToEuro(article.ab_price);
    itemPrice.classList.add('text-nowrap');
    const itemRemoveButton = document.createElement('button');
    itemRemoveButton.innerHTML = '<?xml version="1.0" encoding="UTF-8"?><svg width="24px" height="24px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="currentColor"  stroke-width="1.5"><path fill-rule="evenodd" clip-rule="evenodd" d="M12 1.25C6.06294 1.25 1.25 6.06294 1.25 12C1.25 17.9371 6.06294 22.75 12 22.75C17.9371 22.75 22.75 17.9371 22.75 12C22.75 6.06294 17.9371 1.25 12 1.25ZM9.70164 8.64124C9.40875 8.34835 8.93388 8.34835 8.64098 8.64124C8.34809 8.93414 8.34809 9.40901 8.64098 9.7019L10.9391 12L8.64098 14.2981C8.34809 14.591 8.34809 15.0659 8.64098 15.3588C8.93388 15.6517 9.40875 15.6517 9.70164 15.3588L11.9997 13.0607L14.2978 15.3588C14.5907 15.6517 15.0656 15.6517 15.3585 15.3588C15.6514 15.0659 15.6514 14.591 15.3585 14.2981L13.0604 12L15.3585 9.7019C15.6514 9.40901 15.6514 8.93414 15.3585 8.64124C15.0656 8.34835 14.5907 8.34835 14.2978 8.64124L11.9997 10.9393L9.70164 8.64124Z"></path></svg>';
    itemRemoveButton.classList.add('text-black', 'hover:text-red-600', 'transition-colors');
    itemRemoveButton.title = 'Remove from Cart';
    // Append the elements to the row
    itemRow.append(itemName, itemPrice, itemRemoveButton);

    const addToCartButton = document.querySelector(`button[data-article-id="${article.id}"]`) as HTMLButtonElement;

    // Attach the click event listener to the remove button
    itemRemoveButton.addEventListener('click', function removeItemRow() {
        // Animate the row
        itemRow.style.height = `${itemRow.scrollHeight}px`;
        setTimeout(() => {
            itemRow.style.height = '0';
            itemRow.classList.add('opacity-0');
        });

        fetch(`/api/shoppingcart/${shoppingCartId}/articles/${article.id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': csrfToken!
            }
        }).then(response => {
            if (!response || !response.ok) {
                return Promise.reject(response);
            }
        }).catch(error => {
            console.error('Error removing article from shopping cart:', error);

            // Re-add the article to the cart
            addToCart(article);
        });

        // Reset the button in the overview table
        addToCartButton.title = 'Add to Cart';
        addToCartButton.disabled = false;

        // Update the total price
        itemTotal = cart.reduce((acc, a) => acc + a.ab_price * Number(!(a.id == article.id)), 0);
        itemTotalLabel.textContent = 'Total: ' + formatNumberToEuro(itemTotal);

        itemRow.addEventListener('transitionend', () =>  {
            cart.splice(cart.indexOf(article), 1);
            itemRow.remove();

            // If the cart is empty, show the warning message
            if (table.children.length === 2) {
                dialog.removeChild(table);
                dialog.appendChild(noItemWarning);
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
    itemTotal = cart.reduce((acc, a) => acc + a.ab_price, 0);
    itemTotalLabel.textContent = 'Total: ' + formatNumberToEuro(itemTotal);

    // Show the dialog if it is hidden
    if (dialog.classList.contains('scale-0')) {
        toggleCartDialog();
    }

    // Disable the button and change its text
    addToCartButton.title = 'In Cart';
    addToCartButton.disabled = true;
}

// Append the dialog and button to the body
document.addEventListener('DOMContentLoaded', async () => {
    console.log('Fetching shopping cart items...');

    // Get the shopping cart ID
    let cartID = document.querySelector('meta[name="shopping-cart-id"]')?.getAttribute('content');

    // If the shopping cart ID is not set, fetch it from the server (potentially creating a new shopping cart)
    if (!cartID) {
        console.log('Shopping cart ID not found. Fetching from the server...');

        const response = await fetch(`/api/shoppingcart`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (!response || !response.ok) {
            console.error('Failed to fetch the shopping cart ID. Try refreshing the page.');
            return;
        }
        cartID = (await response.json()).shoppingCartId;
        document.querySelector('meta[name="shopping-cart-id"]')!.setAttribute('content', cartID!);
    }

    console.log('Shopping cart ID:', cartID);
    console.log('Fetching remote cart items...');

    // Get the articles from the remote cart
    const response = await fetch(`/api/shoppingcart/${cartID}/articles`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    }).catch(console.error);

    if (!response || !response.ok) {
        console.error('Failed to fetch remote cart items.');
        return;
    }

    const remoteCartItems = (await response.json()).shoppingCartItems as ShoppingCartItem[];

    console.log('Fetched remote cart items:', remoteCartItems);
    console.log('Fetching missing articles...');

    // Get the missing articles
    const missingArticlesResponse = await fetch(`/api/articles/search`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({articleIDs: remoteCartItems.map(item => item.ab_article_id)})
    }).catch(console.error);

    if (!missingArticlesResponse || !missingArticlesResponse.ok) {
        console.error('Failed to fetch missing articles. Try refreshing the page.');
        return;
    }

    console.log('Fetched missing articles:', cart);

    // Add the articles to the cart
    (await missingArticlesResponse.json()).articles.forEach(article => {
        addToCart(article, true);
    });

    document.getElementById('shopping-cart')!.replaceChild(dialog, loadingSpinner);
    document.body.appendChild(cartButton);
});
