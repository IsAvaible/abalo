<?php

namespace App\Http\Controllers;

use App\Events\ArticleDiscounted;
use App\Events\ArticleSold;
use App\Models\Article;
use App\Models\ArticleCategory;
use Exception;
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
            'page' => ['numeric', 'min:0'],
            'sort_by' => ['string', 'in:price_asc,price_desc,name_asc,name_desc'],
            'articleIds' => ['array'],
            'articleIds.*' => ['numeric', 'exists:ab_article,id'],
            'userIds' => ['array'],
            'userIds.*' => ['numeric', 'exists:ab_user,id'],
        ]);
        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()], 400);
        }

        // Get the query parameters
        $search = $request->input('search'); // Search query
        $categories = $request->input('categories') ? json_decode('['.str_replace('-', ',',$request->input('categories')).']') : null; // Categories filter
        $limit = $request->input('limit'); // Limit of articles
        $page = $request->input('page'); // Page number
        $sortBy = $request->input('sort_by'); // Sorting option
        $articleIds = $request->input('articleIds'); // Array of article Ids
        $userIds = $request->input('userIds'); // Array of user Ids
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
            if (is_numeric($request->input('price_max'))) {
                $query->where('ab_price', '<=', (int) ($priceMax * 100));
            }
            $query->whereIn('id', $articleIds ?? [], 'and', $articleIds === NULL);
            $query->whereIn('ab_creator_id', $userIds ?? [], 'and', $userIds === NULL);
            if ($sortBy) {
                if ($sortBy == 'price_asc' || $sortBy == 'price_desc') {
                    $query->orderBy('ab_price', $sortBy == 'price_asc' ? 'asc' : 'desc');
                } else {
                    $query->orderBy('ab_name', $sortBy == 'name_asc' ? 'asc' : 'desc');
                }
            }
        // Apply limit and offset
        $totalRecords = $query->count();
        $articles = $query->limit($limit)->offset($page * $limit)->get();

        // Add the image path to each article
        foreach ($articles as $article) {
            $article['imagePath'] = ArticleAPIController::findImage($article['id']);
        }

        // Respond with the articles
        return response()->json(['articles' => $articles, 'totalRecords' => $totalRecords]);
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
     * Mark an article as sold
     */
    public function markArticleAsSold(Request $request): JsonResponse {
        // Merge the article ID into the request
        $request->merge(['articleId' => $request->route('articleId')]);
        // Validate the request
        $validator = Validator::make($request->all(), [
            'articleId' => ['required', 'numeric', 'exists:ab_article,id'],
        ]);
        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()], 400);
        }

        // Broadcast the event
        try {
            broadcast(new ArticleSold((int) $request->route('articleId')));
        } catch (Exception $e) {
            return response()->json(['error' => 'Article not found'], 404);
        }

        // Find the article and mark it as sold
//        $article = Article::find($request->input('articleId'));
//        $article->ab_sold = true;
//        $article->save();

        // Respond with success message
        return response()->json(['message' => 'Article marked as sold']);
    }

    /**
     * Discount an article
     */
    public function discountArticle(Request $request): JsonResponse {
        // Merge the article ID into the request
        $request->merge(['articleId' => $request->route('articleId')]);
        // Validate the request
        $validator = Validator::make($request->all(), [
            'articleId' => ['required', 'numeric', 'exists:ab_article,id'],
            'discount' => ['required', 'numeric', 'min:0', 'max:1'],
        ]);
        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()], 400);
        }

        // Find the article
        $article = Article::find($request->input('articleId'));
        // Revert any previous discount
        if ($article->ab_discount) {
            $article->ab_price = $article->ab_price / (1 - $article->ab_discount);
        }
        // Apply the new discount
        $article->ab_price = $article->ab_price * (1 - $request->input('discount'));
        $article->ab_discount = $request->input('discount');
        $article->save();

        // Broadcast the event
        try {
            broadcast(new ArticleDiscounted((int) $request->route('articleId')));
        } catch (Exception $e) {
            return response()->json(['error' => $e], 400);
        }

        // Respond with success message
        return response()->json(['message' => 'Article discounted', 'newPrice' => $article->ab_price]);
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
     * @param int $articleId The article Id
     * @return string|null The image path or NULL if not found
     */
    public function findImage(int $articleId): ?string
    {
        // Get the path to the images directory
        $dir = public_path("images");
        // Get all files in the directory
        $files = glob($dir . '/*');

        // Iterate over the files
        foreach ($files as $filePath) {
            $file = basename($filePath);
            // Check if the file name starts with the article Id
            if (explode('.', $file)[0] == $articleId) {
                // Return the image path as asset
                return asset('images/' . $file);
            }
        }
        return NULL;
    }
}
