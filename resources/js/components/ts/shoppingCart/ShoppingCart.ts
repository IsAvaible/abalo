import {formatNumberToEuro} from "../../../util/formatNumberToEuro";
import Article from "../articles/Article";

export default class ShoppingCart {
    private static instance: ShoppingCart;
    private cart: Article[] = [];
    private cartButton: HTMLButtonElement;
    private dialog: HTMLDivElement;
    private table: HTMLDivElement;
    private title: HTMLHeadingElement;
    private noItemWarning: HTMLSpanElement;
    private itemTotalLabel: HTMLSpanElement;
    private checkoutButton: HTMLButtonElement;
    private loadingSpinner: HTMLDivElement;

    private constructor() {
        if (document.getElementById('shopping-cart') === null) {
            console.error('Could not find the shopping cart element.');
            return;
        }
        this.createCartButton();
        this.createDialog();
        this.attachEventListeners();
    }

    public static getInstance(): ShoppingCart {
        if (!ShoppingCart.instance) {
            ShoppingCart.instance = new ShoppingCart();
        }
        return ShoppingCart.instance;
    }

    private createCartButton(): void {
        this.cartButton = document.createElement('button');
        this.cartButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">\n' +
            '<path stroke-linecap="round" stroke-linejoin="round" d="M3 6H22L19 16H6L3 6ZM3 6L2.25 3.5"></path><path stroke-linecap="round" stroke-linejoin="round" d="M11 19.5C11 20.3284 10.3284 21 9.5 21C8.67157 21 8 20.3284 8 19.5"></path><path stroke-linecap="round" stroke-linejoin="round" d="M17 19.5C17 20.3284 16.3284 21 15.5 21C14.6716 21 14 20.3284 14 19.5"></path>'
        '</svg>';
        this.cartButton.className = 'fixed bottom-4 right-4 bg-slate-800 text-white rounded-full p-4 hover:bg-slate-900 transition-colors z-50 hidden max-[1600px]:block';
        this.cartButton.title = 'Open Shopping Cart';
    }

    private createDialog(): void {
        this.dialog = document.createElement('div');
        this.dialog.className ='max-[1600px]:fixed bottom-20 right-4 bg-white rounded-lg max-[1600px]:shadow-lg p-4 max-[1600px]:pointer-events-none max-[1600px]:opacity-0 max-[1600px]:scale-0 origin-[calc(100%_-_2rem)_bottom] duration-300 min-w-68';
        this.dialog.style.transitionProperty = 'opacity, transform';

        this.table = document.createElement('div');
        this.table.className = 'grid gap-x-3 gap-y-2 items-center mt-2';
        this.table.style.gridTemplateColumns = '1fr auto auto';

        this.title = document.createElement('h2');
        this.title.textContent = 'Shopping Cart';
        this.title.className = 'text-lg font-semibold';
        this.dialog.appendChild(this.title);

        this.noItemWarning = document.createElement('span');
        this.noItemWarning.textContent = 'No items in the cart';
        this.noItemWarning.classList.add('text-center', 'text-gray-500');
        this.dialog.appendChild(this.noItemWarning);

        this.itemTotalLabel = document.createElement('span');
        this.itemTotalLabel.classList.add('text-center', 'col-span-2', 'font-semibold');
        this.table.appendChild(this.itemTotalLabel);

        this.checkoutButton = document.createElement('button');
        this.checkoutButton.textContent = 'Go to Checkout';
        this.checkoutButton.className = 'bg-slate-800 hover:bg-slate-900 text-white font-bold py-2 px-4 rounded transition-colors col-span-3 relative';
        this.checkoutButton.title = 'Checkout';
        this.table.appendChild(this.checkoutButton);

        this.loadingSpinner = document.createElement('div');
        this.loadingSpinner.className = 'inset-0 h-64 bg-white bg-opacity-50 flex items-center justify-center max-[1600px]:hidden';
        this.loadingSpinner.innerHTML = '<svg aria-hidden="true" class="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-slate-800" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">\n' +
            '       <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>\n' +
            '       <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>\n' +
            '   </svg>\n' +
            '   <span class="sr-only">Loading Shopping Cart</span>';
        document.getElementById('shopping-cart')!.appendChild(this.loadingSpinner);
    }

    private attachEventListeners(): void {
        this.cartButton.addEventListener('click', () => this.toggleCartDialog());
        document.addEventListener('DOMContentLoaded', async () => {
            console.log('Fetching shopping cart items...');
            const cartID = JSON.parse(document.querySelector('meta[name="shopping-cart-id"]')!.getAttribute('content'));
            console.log('Shopping cart ID:', cartID);
            const shoppingCartElement = document.getElementById('shopping-cart')!;
            if (cartID!== null &&!isNaN(cartID)) {
                const articles = JSON.parse(document.querySelector('meta[name="initial-shopping-cart-articles"]')!.getAttribute('content')!) as Article[];
                console.log('Shopping cart articles:', articles);
                document.getElementById('articles')!.addEventListener('load', () => {
                    for (const article of articles) {
                        this.addToCart(article, true);
                    }
                    shoppingCartElement.replaceChild(this.dialog, shoppingCartElement.firstChild);
                    document.body.appendChild(this.cartButton);
                }, { once: true });
            } else {
                shoppingCartElement.replaceChild(this.dialog, shoppingCartElement.firstChild);
                document.body.appendChild(this.cartButton);
            }
            const footer: HTMLElement = document.querySelector('footer')!;
            window.addEventListener('scroll', () => {
                const visibleFooterHeight = Math.max(window.innerHeight - footer.getBoundingClientRect().top, 0);
                if (visibleFooterHeight > 0) {
                    this.cartButton.style.bottom = `${visibleFooterHeight + 16}px`;
                    this.dialog.style.bottom = `${visibleFooterHeight + 80}px`;
                } else {
                    this.cartButton.style.bottom = '1rem';
                    this.dialog.style.bottom = '5rem';
                }
            });
        });
    }

    private toggleCartDialog(): void {
        this.dialog.classList.toggle('max-[1600px]:pointer-events-none');
        this.dialog.classList.toggle('max-[1600px]:scale-0');
        this.dialog.classList.toggle('max-[1600px]:opacity-0');
    }

    public addToCart(article: Article, fromDB: boolean = false): void {
        const shoppingCartId = JSON.parse(document.querySelector('meta[name="shopping-cart-id"]')!.getAttribute('content')!);
        const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');

        const syncWithRemote = !fromDB && shoppingCartId && csrfToken;

        if (!fromDB && !syncWithRemote) {
            console.log("Adding article with name", article.ab_name, "to the local cart.");
        }

        if (syncWithRemote) console.log('Adding article with name', article.ab_name, 'to the remote cart.');

        // Check if the item is already in the cart
        if (this.cart.find((a) => a.id === article.id)) {
            console.error('Article is already in the cart.');
            return;
        }

        // If the cart is empty, remove the warning message
        if (this.cart.length === 0) {
            this.dialog.removeChild(this.noItemWarning);
            this.dialog.appendChild(this.table);
        }

        // Add the article to the cart
        this.cart.push(article);

        if (syncWithRemote) {
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
        itemRemoveButton.innerHTML = '<svg width="24px" height="24px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="currentColor"  stroke-width="1.5"><path fill-rule="evenodd" clip-rule="evenodd" d="M12 1.25C6.06294 1.25 1.25 6.06294 1.25 12C1.25 17.9371 6.06294 22.75 12 22.75C17.9371 22.75 22.75 17.9371 22.75 12C22.75 6.06294 17.9371 1.25 12 1.25ZM9.70164 8.64124C9.40875 8.34835 8.93388 8.34835 8.64098 8.64124C8.34809 8.93414 8.34809 9.40901 8.64098 9.7019L10.9391 12L8.64098 14.2981C8.34809 14.591 8.34809 15.0659 8.64098 15.3588C8.93388 15.6517 9.40875 15.6517 9.70164 15.3588L11.9997 13.0607L14.2978 15.3588C14.5907 15.6517 15.0656 15.6517 15.3585 15.3588C15.6514 15.0659 15.6514 14.591 15.3585 14.2981L13.0604 12L15.3585 9.7019C15.6514 9.40901 15.6514 8.93414 15.3585 8.64124C15.0656 8.34835 14.5907 8.34835 14.2978 8.64124L11.9997 10.9393L9.70164 8.64124Z"></path></svg>';
        itemRemoveButton.classList.add('text-slate-800', 'hover:scale-105', 'hover:text-black');
        itemRemoveButton.style.transition = 'transform, color';
        itemRemoveButton.title = 'Remove from Cart';
        // Append the elements to the row
        itemRow.append(itemName, itemPrice, itemRemoveButton);

        if (!fromDB && !syncWithRemote) {
            console.log("Successfully added article with name ", article.ab_name, " to the local cart.");
        }

        // Re-disable the button when the articles overview is reloaded
        const articlesReloadListener = () => {
            const addToCartButton = document.querySelector(`button[data-article-id="${article.id}"]`) as HTMLButtonElement;
            if (!addToCartButton) return
            addToCartButton.title = 'In Cart';
            addToCartButton.disabled = true;
        }
        document.getElementById('articles')!.addEventListener('load', articlesReloadListener);

        // Attach the click event listener to the remove button
        itemRemoveButton.addEventListener('click', () => {
            // Animate the row
            itemRow.style.height = `${itemRow.scrollHeight}px`;
            setTimeout(() => {
                itemRow.style.height = '0';
                itemRow.classList.add('opacity-0');
            });

            const shoppingCartId = JSON.parse(document.querySelector('meta[name="shopping-cart-id"]')!.getAttribute('content')!);
            const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');

            if (shoppingCartId && csrfToken) {
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
                    console.log('Successfully removed article with name', article.ab_name, 'from the remote cart.');
                }).catch(error => {
                    console.error('Error removing article from the remote cart:', error);

                    // Re-add the article to the cart
                    this.addToCart(article);
                });
            } else {
                console.log('Removed article with name', article.ab_name, 'from the local cart.');
            }

            // Remove the articles reload listener
            document.getElementById('articles')!.removeEventListener('load', articlesReloadListener);

            // Reset the button in the overview table
            const addToCartButton = document.querySelector(`button[data-article-id="${article.id}"]`) as HTMLButtonElement;
            if (addToCartButton) {
                addToCartButton.title = 'Add to Cart';
                addToCartButton.disabled = false;
            }

            // Update the total price
            const itemTotal = this.cart.reduce((acc, a) => acc + a.ab_price * Number(!(a.id == article.id)), 0);
            this.itemTotalLabel.textContent = 'Total: ' + formatNumberToEuro(itemTotal);

            // Hide the dialog if the cart is empty
            if (this.cart.length === 1 && window.innerWidth <= 1600) {
                this.toggleCartDialog();
            }

            itemRow.addEventListener('transitionend', () =>  {
                this.cart.splice(this.cart.indexOf(article), 1);
                itemRow.remove();

                // If the cart is empty, show the warning message
                if (this.table.children.length === 2) {
                    this.dialog.removeChild(this.table);
                    this.dialog.appendChild(this.noItemWarning);
                }
            }, {once: true});
        }, {once: true});

        // Append the elements to the cart table
        this.table.insertBefore(itemRow, this.itemTotalLabel);
        // Animate the row
        setTimeout(() => {
            itemRow.classList.remove('scale-0', 'opacity-0');
        },);
        // Update the total price
        const itemTotal = this.cart.reduce((acc, a) => acc + a.ab_price, 0);
        this.itemTotalLabel.textContent = 'Total: ' + formatNumberToEuro(itemTotal);

        // Show the dialog if it is hidden and the article was added from the overview
        if (this.dialog.classList.contains('max-[1600px]:scale-0') && !fromDB) {
            this.toggleCartDialog();
        }

        const addToCartButton = document.querySelector(`button[data-article-id="${article.id}"]`) as HTMLButtonElement;
        if (addToCartButton) {
            // Disable the button and change its text
            addToCartButton.title = 'In Cart';
            addToCartButton.disabled = true;
        }
    }
}
