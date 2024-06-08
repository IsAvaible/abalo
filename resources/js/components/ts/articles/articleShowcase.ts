import ArticleCard from './ArticleCard'; // Assuming ArticleCard is exported as default from ArticleCard.ts

export default class ArticleShowcase
{
    htmlElementID: string;
    articleCards: ArticleCard[] = [];

    constructor(htmlElementID: string)
    {
        this.htmlElementID = htmlElementID;
        if (!document.getElementById(htmlElementID)) {
            throw new Error(`Element with ID ${htmlElementID} not found`);
        }
    }

    // (Re)renders the showcase
    render()
    {
        const htmlElement = document.getElementById(this.htmlElementID)!;
        // Clear the showcase
        htmlElement.innerHTML = '';

        if (this.articleCards.length) {
            // Insert the article cards
            this.articleCards.forEach((article) => {
                article.insertInto(htmlElement);
            });
        } else {
            // No articles found, display a warning and a button to clear the parameters
            const div = document.createElement('div');
            div.className = 'col-span-full flex flex-col items-center w-5xl';
            const warning = document.createElement('div');
            warning.className = 'alert alert-danger mb-3';
            warning.textContent = 'No articles found for the given search query';
            const clearButton = document.createElement('button');
            clearButton.className = 'bg-slate-700 text-white font-bold py-2 px-4 rounded col-span-full';
            clearButton.textContent = 'Clear Parameters';
            clearButton.addEventListener('click', () => {
                window.location.search = '';
            });

            div.appendChild(warning);
            div.appendChild(clearButton);
            htmlElement.appendChild(div);
        }
        // Trigger load event
        htmlElement.dispatchEvent(new Event('load'));
    }
}
