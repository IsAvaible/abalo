import ArticleShowcase from './articleShowcase';
import ArticleCard from "./ArticleCard";
import Article from './Article';
import axios from "axios";

const articleShowcase = new ArticleShowcase('articles');

/**
 * Initialize the showcase and add an event listener to the search form
 */
const init = () => {
    // Initialize the showcase
    update("/api/articles/search" + window.location.search);
}


/**
 * Update the showcase with the articles from the given URL
 * @param url The URL to get the articles from
 */
export const update = async (url: string | URL) => {
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
        // Handle the error
        document.getElementById(articleShowcase.htmlElementID)!.innerHTML = '<div class="alert alert-danger">An error occurred while loading the articles</div>';
        console.error(error.response ? error.response.data : error.message, error);
    }
};

init();

