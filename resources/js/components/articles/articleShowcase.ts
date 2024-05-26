import ArticleCard from './ArticleCard'; // Assuming ArticleCard is exported as default from ArticleCard.ts

export default class ArticleShowcase
{
    htmlElementID: string;
    htmlElement: HTMLElement;
    articleCards: ArticleCard[] = [];

    constructor(htmlElementID: string)
    {
        this.htmlElementID = htmlElementID;
        if (!document.getElementById(htmlElementID)) {
            throw new Error(`Element with ID ${htmlElementID} not found`);
        }
        this.htmlElement = document.getElementById(htmlElementID)!;
    }

    // (Re)renders the showcase
    render()
    {
        // Clear the showcase
        this.htmlElement.innerHTML = '';

        if (this.articleCards.length) {
            // Insert the article cards
            this.articleCards.forEach((article) => {
                article.insertInto(this.htmlElement);
            });
        } else {
            // No articles found, display a warning and a button to clear the parameters
            const div = document.createElement('div');
            div.className = 'col-span-full flex flex-col items-center';
            const warning = document.createElement('div');
            warning.className = 'alert alert-danger';
            warning.textContent = 'No articles found for the given search query';
            const clearButton = document.createElement('button');
            clearButton.className = 'bg-slate-700 text-white font-bold py-2 px-4 rounded col-span-full';
            clearButton.textContent = 'Clear Parameters';
            clearButton.addEventListener('click', () => {
                window.location.search = '';
            });

            div.appendChild(warning);
            div.appendChild(clearButton);
            this.htmlElement.appendChild(div);
        }
        // Trigger load event
        this.htmlElement.dispatchEvent(new Event('load'));
    }
}
