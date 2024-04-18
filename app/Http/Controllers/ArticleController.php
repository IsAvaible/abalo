<?php

namespace App\Http\Controllers;

use App\Models\Article;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Illuminate\View\View;

class ArticleController extends Controller
{
    /**
     * Find article image by ID
     * @param int $articleID The article ID
     * @return string|null The image path or NULL if not found
     */
    public function fingImage(int $articleID): ?string
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

    /**
     * Display a listing of the articles filtered by keyword.
     * @param Request $request The request
     * @return View The view
     */
    public function index(Request $request): View
    {
        // Get the search keyword
        $keyword = $request->query('search');
        // Find the articles (case-insensitive)
        $data = Article::whereRaw('LOWER(ab_name) LIKE ?', '%' . $keyword . '%')->get();
        // Find the images
        $images = [];
        foreach ($data as $article) {
            $images[$article['id']] = ArticleController::fingImage($article['id']);
        }
        // Return the view
        return view('articles.overview', ['data' => $data, 'images' => $images]);
    }
}
