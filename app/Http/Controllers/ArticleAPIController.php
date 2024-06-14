<?php

namespace App\Http\Controllers;

use App\Models\Article;
use App\Models\ArticleCategory;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\Validator;

class ArticleAPIController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        return $this->searchArticles($request);
    }

    public function searchArticles(Request $request): JsonResponse
    {
        // Validate the request
        $validator = Validator::make($request->all(), [
            'search' => ['string'],
            'categories' => ['string'],
            'price_min' => ['numeric', 'min:0'],
            'price_max' => ['numeric', 'min:0'],
            'limit' => ['numeric', 'min:0'],
            'sort_by' => ['string', 'in:price_asc,price_desc,name_asc,name_desc'],
            'articleIDs' => ['array'],
            'articleIDs.*' => ['numeric', 'exists:ab_article,id'],
        ]);
        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()], 400);
        }

        // Get the query parameters
        $search = $request->input('search'); // Search query
        $categories = $request->input('categories') ? json_decode('['.str_replace('-', ',',$request->input('categories')).']') : null; // Categories filter
        $limit = $request->input('limit'); // Limit of articles
        $sortBy = $request->input('sort_by'); // Sorting option
        $articleIDs = $request->input('articleIDs'); // Array of article IDs
        $priceMin = $request->input('price_min'); // Minimum price
        $priceMax = $request->input('price_max'); // Maximum price

        // Get the matching articles
        $query = Article::
            where('ab_name', 'ilike', '%'.$search.'%')
            ->whereHas('categories', function ($query) use ($categories) {
                $query->whereIn('ab_articlecategory.id', $categories ?? [], 'and', $categories === NULL);
            });
            if ($request->input('price_min')) {
                $query->where('ab_price', '>=', (int) ($priceMin * 100));
            }
            if ($request->input('price_max') || $request->input('price_max') === 0) {
                $query->where('ab_price', '<=', (int) ($priceMax * 100));
            }
            $query->whereIn('id', $articleIDs ?? [], 'and', $articleIDs === NULL)
            ->limit($limit);
            if ($sortBy) {
                if ($sortBy == 'price_asc' || $sortBy == 'price_desc') {
                    $query->orderBy('ab_price', $sortBy == 'price_asc' ? 'asc' : 'desc');
                } else {
                    $query->orderBy('ab_name', $sortBy == 'name_asc' ? 'asc' : 'desc');
                }
            }
        $articles = $query->get();

        // Add the image path to each article
        foreach ($articles as $article) {
            $article['imagePath'] = ArticleAPIController::findImage($article['id']);
        }

        // Respond with the articles
        return response()->json(['articles' => $articles]);
    }

    /**
     * Get a specific article by ID
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function getArticle(Request $request): JsonResponse
    {
        // Merge the article ID into the request
        $request->merge(['articleId' => $request->route('articleId')]);
        // Validate the request
        $validator = Validator::make($request->all(), [
            'articleId' => ['required', 'numeric', 'exists:ab_article,id'],
        ]);
        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()], 400);
        }

        $article = Article::find($request->route('articleId'));

        // Add the image path to the article
        $article['imagePath'] = ArticleAPIController::findImage($article['id']);

        // Respond with the article
        return response()->json(['article' => $article]);
    }

    /**
     * Store a newly created article in storage.
     */
    public function storeArticle(Request $request): JsonResponse
    {
        // Validate the request
        $validator = Validator::make($request->all(), [
            'name' => 'required',
            'description' => 'required',
            'category' => ['required', 'numeric', 'exists:ab_articlecategory,id'],
            'price' => ['required', 'numeric', 'min:0'],
            'image' => ['required', 'image', 'max:2048'],
        ]);
        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()], 400);
        }

        // Create a new article
        $article = new Article();
        $article->ab_name = $request->input('name');
        $article->ab_description = $request->input('description');
        $article->ab_price = $request->input('price');
        $article->ab_creator_id = 1; // $request->session()->get('abalo_user');
        $article->save();

        // Get the corresponding category and attach it
        $category = ArticleCategory::find($request->input('category'));
        $article->categories()->attach($category);

        // Store the image
        $image = $request->file('image');
        $imageName = $article->id . '.' . $image->extension();
        $image->move(public_path('images'), $imageName);

        // Respond with success message
        return response()->json(['message' => 'Article created successfully', 'id' => $article->id], 201);
    }

    /**
     * Get all categories
     */
    public function getArticleCategories(Request $request): JsonResponse
    {
        // Get all categories
        $categories = ArticleCategory::all();

        // Respond with the categories
        return response()->json(['categories' => $categories]);
    }

    /**
     * Find article image by ID
     * @param int $articleID The article ID
     * @return string|null The image path or NULL if not found
     */
    public function findImage(int $articleID): ?string
    {
        // Get the path to the images directory
        $dir = public_path("images");
        // Get all files in the directory
        $files = glob($dir . '/*');

        // Iterate over the files
        foreach ($files as $filePath) {
            $file = basename($filePath);
            // Check if the file name starts with the article ID
            if (explode('.', $file)[0] == $articleID) {
                // Return the image path as asset
                return asset('images/' . $file);
            }
        }
        return NULL;
    }
}
