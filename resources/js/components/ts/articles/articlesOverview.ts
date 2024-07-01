import ArticleShowcase from './articleShowcase';
import ArticleCard from "./ArticleCard";
import Article from './Article';
import axios from "axios";

const articleShowcase = new ArticleShowcase('articles');

/**
 * Initialize the showcase and add an event listener to the search form
 */
export const init = () => {
    // Initialize the showcase
    update("/api/articles/search" + window.location.search);
}


/**
 * Update the showcase with the articles from the given URL
 * @param url The URL to get the articles from
 */
export const update = async (url: string | URL, forwardError: boolean = false) => {
    try {
        // Make the GET request using axios
        const response = await axios.get(url.toString(), {
            headers: { 'Content-Type': 'application/json' },
        });

        // Update the showcase with the response data
        const articles = response.data.articles;
        articleShowcase.articleCards = articles.map((article: Article) => new ArticleCard(article));
        articleShowcase.render();
    } catch (error) {
        if (forwardError) throw error;
        // Handle the error
        document.getElementById(articleShowcase.htmlElementId)!.innerHTML = '<div class="alert alert-error">An error occurred while loading the articles</div>';
    }
};

