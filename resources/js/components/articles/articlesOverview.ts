import ArticleShowcase from './articleShowcase';
import ArticleCard from "./ArticleCard";
import Article from './Article';

const articleShowcase = new ArticleShowcase('articles');
const searchForm = document.getElementById('search-form') as HTMLFormElement;
const searchInput = document.getElementById('search-input') as HTMLInputElement;

/**
 * Initialize the showcase and add an event listener to the search form
 */
const init = () => {
    // Initialize the showcase
    update("/api/articles/search" + window.location.search);

    // Add an event listener to the search form
    searchForm.addEventListener('submit', (event) => {
        // Prevent the form from submitting
        event.preventDefault();

        // Get the search value
        const searchValue = searchInput.value;
        // Build the new URL
        const url = new URL(window.location.href + window.location.search);
        if (searchValue !== '') {
            url.searchParams.set('search', searchValue);
        } else {
            url.searchParams.delete('search');
        }

        // Update the history and request the new data
        window.history.pushState({}, '', url.pathname + url.search);
        update("/api/articles/search" + url.search);
    });
}

/**
 * Update the showcase with the articles from the given URL
 * @param url The URL to get the articles from
 */
const update = (url: string | URL) => {
    // Create a XHR request
    const xhr = new XMLHttpRequest();
    xhr.open('GET', url);
    xhr.setRequestHeader('Content-Type', 'application/json');

    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                // Parse the response and update the showcase
                const response = JSON.parse(xhr.responseText);
                articleShowcase.articleCards = response.articles.map((article: Article) => new ArticleCard(article));
                articleShowcase.render();
            } else {
                // Log the error
                articleShowcase.htmlElement.innerHTML = '<div class="alert alert-danger">An error occurred while loading the articles</div>';
                console.error(JSON.parse(xhr.responseText), xhr);
            }
        }
    };

    xhr.send();
}

init();

