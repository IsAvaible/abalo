<?php

namespace App\Http\Controllers;

use App\Models\Article;
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
            'limit' => ['numeric', 'min:0'],
            'articleIDs' => ['array'],
            'articleIDs.*' => ['numeric', 'exists:ab_article,id'],
        ]);
        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors(), 'request' => $request->all()], 400);
        }

        // Get the query parameters
        $search = $request->input('search'); // Search query
        $limit = $request->input('limit'); // Limit of articles
        $articleIDs = $request->input('articleIDs'); // Array of article IDs

        // Get the matching articles
        $articles = Article::where('ab_name', 'ilike', '%'.$search.'%')->whereIn('id', $articleIDs ?? [], 'and', $articleIDs === NULL)->limit($limit)->get();

        // Add the image path to each article
        foreach ($articles as $article) {
            $article['imagePath'] = ArticleAPIController::findImage($article['id']);
        }

        // Respond with the articles
        return response()->json(['request' => $request->all(), 'articles' => $articles]);
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

        // Store the image
        $image = $request->file('image');
        $imageName = $article->id . '.' . $image->extension();
        $image->move(public_path('images'), $imageName);

        // Respond with success message
        return response()->json(['message' => 'Article created successfully', 'id' => $article->id], 201);
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