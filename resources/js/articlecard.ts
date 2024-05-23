"use strict";
import './shoppingCart';
// Interface for each article card
interface Article {
    id: number;
    ab_name: string;
    ab_price: number;
    ab_description: string;
    ab_creator_id: number;
    ab_createdate: Date;
}

// Creating an article card
export default class ArticleCard
{
    constructor(article: Article) {

        // @ts-ignore
        this.article = article; // debug
        // @ts-ignore
        this.id = article.id;
        // @ts-ignore
        this.ab_name = article.ab_name;
        // @ts-ignore
        this.ab_price = article.ab_price;
        // @ts-ignore
        this.description = article.ab_description;
        // @ts-ignore
        this.ab_creator_id = article.ab_creator_id;
        // @ts-ignore
        this.ab_createdate = article.ab_createdate;
        // @ts-ignore
        this.element = this.createCardElement();
        // @ts-ignore
        this.addButtonEventListener(); //
    }

    createCard()
    {
        // The div that contains the form
        const cardDiv = document.createElement('div');
        cardDiv.className = "bg-white shadow-md rounded-lg flex flex-col";

        const imageDiv = document.createElement('div');
        imageDiv.className = "relative rounded-t-[inherit]";

        const image = document.createElement('img');
        image.src = "$images[${article.id}]";
        // @ts-ignore
        image.alt = "image" + this.id;
        image.className = "rounded-t-[inherit] aspect-square object-cover w-full";

        const button = document.createElement('button');
        button.className = "absolute top-2 right-2 bg-white text-slate-800 hover:text-black opacity-80 [&:hover:not(:disabled)]:opacity-100 disabled:opacity-30 p-2 rounded disabled:cursor-not-allowed";
        button.title = "Add to Cart";
        button.onclick = function()
        {
            // @ts-ignore
            addToCart(article, this);
        }
        // -------------------------------------------------------------------------------------------------------------
        // What is this?? <svg width="24px" height="24px" stroke-width="1.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" stroke="currentColor"><path d="M3 6H22L19 16H6L3 6ZM3 6L2.25 3.5" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M9.99219 11H11.9922M13.9922 11H11.9922M11.9922 11V9M11.9922 11V13" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M11 19.5C11 20.3284 10.3284 21 9.5 21C8.67157 21 8 20.3284 8 19.5" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M17 19.5C17 20.3284 16.3284 21 15.5 21C14.6716 21 14 20.3284 14 19.5" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path></svg>
        // ChatGPT:
        // Create the SVG element for the button
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('width', '24px');
        svg.setAttribute('height', '24px');
        svg.setAttribute('stroke-width', '1.5');
        svg.setAttribute('viewBox', '0 0 24 24');
        svg.setAttribute('fill', 'none');
        svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
        svg.setAttribute('stroke', 'currentColor');

        // Add path elements to the SVG
        const path1 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path1.setAttribute('d', 'M3 6H22L19 16H6L3 6ZM3 6L2.25 3.5');
        path1.setAttribute('stroke-width', '1.5');
        path1.setAttribute('stroke-linecap', 'round');
        path1.setAttribute('stroke-linejoin', 'round');

        const path2 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path2.setAttribute('d', 'M9.99219 11H11.9922M13.9922 11H11.9922M11.9922 11V9M11.9922 11V13');
        path2.setAttribute('stroke-width', '1.5');
        path2.setAttribute('stroke-linecap', 'round');
        path2.setAttribute('stroke-linejoin', 'round');

        const path3 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path3.setAttribute('d', 'M11 19.5C11 20.3284 10.3284 21 9.5 21C8.67157 21 8 20.3284 8 19.5');
        path3.setAttribute('stroke-width', '1.5');
        path3.setAttribute('stroke-linecap', 'round');
        path3.setAttribute('stroke-linejoin', 'round');

        const path4 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path4.setAttribute('d', 'M17 19.5C17 20.3284 16.3284 21 15.5 21C14.6716 21 14 20.3284 14 19.5');
        path4.setAttribute('stroke-width', '1.5');
        path4.setAttribute('stroke-linecap', 'round');
        path4.setAttribute('stroke-linejoin', 'round');
        // -------------------------------------------------------------------------------------------------------------

        // Append content to imageDiv
        // append paths to SVG
        svg.appendChild(path1);
        svg.appendChild(path2);
        svg.appendChild(path3);
        svg.appendChild(path4);

        // Append SVG to  button
        button.appendChild(svg);

        // Append image and button to imageDiv
        imageDiv.appendChild(image);
        imageDiv.appendChild(button);

        // Second div in the Card
        const infoDiv = document.createElement('div');
        infoDiv.className = "p-2 flex flex-col gap-y-2 grow";

        const header = document.createElement('h3');
        header.className = "text-lg font-semibold text-slate-800";
        // @ts-ignore
        header.textContent = article.ab_name;

        const description = document.createElement('p');
        description.className = "text-slate-600";
        // @ts-ignore
        description.textContent = article.ab_description;

        const price = document.createElement('p');
        price.className = "text-slate-600 self-end mt-auto";
        // @ts-ignore
        price.textContent = article.ab_price + "€"; // WIP

        infoDiv.appendChild(header);
        infoDiv.appendChild(description);
        infoDiv.appendChild(price);

        // Append relative div and inner div to the card div
        cardDiv.appendChild(imageDiv);
        cardDiv.appendChild(infoDiv);

        return cardDiv;
    }

    insertInto(htmlElement)
    {
        let parent = document.getElementById(htmlElement);

        if(parent === null)
        {
            console.log("Parent element not found. ID = " + htmlElement);
            return;
        }
        // @ts-ignore
        parent.appendChild(this.element); // TS2339: Property element does not exist on type Articlecard
    }
}
