import ShoppingCart from "../shoppingCart/ShoppingCart";
import Article from "./Article";
import {formatNumberToEuro} from "../../../util/formatNumberToEuro";

const PLACEHOLDER_IMAGE_PATH = "https://via.placeholder.com/300x300";

// Creating an article card
export default class ArticleCard implements Article
{
    id: number;
    ab_name: string;
    ab_price: number;
    ab_description: string;
    ab_creator_id: number;
    ab_createdate: Date;
    imagePath: string | null;
    element: HTMLElement;

    constructor(article: Article) {
        this.id = article.id;
        this.ab_name = article.ab_name;
        this.ab_price = article.ab_price;
        this.ab_description = article.ab_description;
        this.ab_creator_id = article.ab_creator_id;
        this.ab_createdate = article.ab_createdate;
        this.imagePath = article.imagePath;
        this.element = this.createCard();
    }

    createCard()
    {
        // The div that contains the form
        const cardDiv = document.createElement('div');
        cardDiv.className = "bg-white shadow-md rounded-lg flex flex-col";

        const imageDiv = document.createElement('div');
        imageDiv.className = "relative rounded-t-[inherit]";

        const image = document.createElement('img');
        image.src = this.imagePath ?? PLACEHOLDER_IMAGE_PATH;
        image.alt = "image" + this.id;
        image.className = "rounded-t-[inherit] aspect-square object-cover w-full";

        const button = document.createElement('button');
        button.className = "absolute top-2 right-2 bg-white text-slate-800 hover:text-black opacity-80 [&:hover:not(:disabled)]:opacity-100 disabled:opacity-30 p-2 rounded disabled:cursor-not-allowed";
        button.title = "Add to Cart";
        button.dataset.articleId = this.id.toString();
        button.onclick = () => {
            ShoppingCart.getInstance().addToCart(this as Article);
        }

        // Create the SVG element for the button
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');

        // Append SVG to  button
        button.appendChild(svg);
        svg.outerHTML = '<svg width="24px" height="24px" stroke-width="1.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="currentColor"><path d="M3 6H22L19 16H6L3 6ZM3 6L2.25 3.5" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M9.99219 11H11.9922M13.9922 11H11.9922M11.9922 11V9M11.9922 11V13" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M11 19.5C11 20.3284 10.3284 21 9.5 21C8.67157 21 8 20.3284 8 19.5" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M17 19.5C17 20.3284 16.3284 21 15.5 21C14.6716 21 14 20.3284 14 19.5" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path></svg>';

        // Append image and button to imageDiv
        imageDiv.appendChild(image);
        imageDiv.appendChild(button);

        // Second div in the Card
        const infoDiv = document.createElement('div');
        infoDiv.className = "p-2 flex flex-col gap-y-2 grow";

        const header = document.createElement('h3');
        header.className = "text-lg font-semibold text-slate-800";
        header.textContent = this.ab_name;

        const description = document.createElement('p');
        description.className = "text-slate-600";
        description.textContent = this.ab_description;

        const price = document.createElement('p');
        price.className = "text-slate-600 self-end mt-auto";
        price.textContent = formatNumberToEuro(this.ab_price);

        infoDiv.appendChild(header);
        infoDiv.appendChild(description);
        infoDiv.appendChild(price);

        // Append relative div and inner div to the card div
        cardDiv.appendChild(imageDiv);
        cardDiv.appendChild(infoDiv);

        return cardDiv;
    }

    set inCart(value: boolean) {
        this.element.querySelector('button')!.disabled = value;
    }

    insertInto(parent: HTMLElement)
    {
        parent.appendChild(this.element);
    }
}
