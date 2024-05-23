import ArticleCard from './ArticleCard'; // Assuming ArticleCard is exported as default from ArticleCard.ts

export default class ArticleShowcase
{
    constructor(htmlElementID: string, articles: ArticleCard[])
    {
        // @ts-ignore
        this.htmlElementID = htmlElementID;
        // @ts-ignore
        this.htmlElement = document.getElementById(htmlElementID);
        // @ts-ignore
        this.articles = articles;
    }

    // Method to create and insert ArticleCard instances into the parent HTML element
    insertCards()
    {
        // @ts-ignore
        this.articles.forEach(function(article)
        {
            // @ts-ignore
            article.insertInto(this.htmlElement);
        });

    }
}
