import {defineStore} from 'pinia';
import axios from 'axios';

// Define the Category interface
interface Category {
    id: number;
    name: string;
}

// Define the CategoryState interface
interface CategoryState {
    categories: Category[];
    categoriesLoaded: boolean;
}

// Define the store using pinia
export const useCategoryStore = defineStore('category', {
    // Define the initial state
    state: (): CategoryState => ({
        categories: [],
        categoriesLoaded: false,
    }),
    actions: {
        // Define the action to load categories
        async loadCategories() {
            // Only load categories if they haven't been loaded yet
            if (!this.categoriesLoaded) {
                try {
                    // Make a GET request to the categories API
                    const response = await axios.get('/api/articles/categories');
                    // Update the state with the received categories
                    this.categories = response.data.categories;
                    // Mark categories as loaded
                    this.categoriesLoaded = true;
                } catch (error) {
                    // Log any error that occurs during the request
                    console.error('Error loading categories:', error);
                }
            }
        }
    }
});
