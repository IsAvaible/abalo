<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Illuminate\View\View;

class ArticleController extends Controller
{
    /**
     * Display a listing of the articles filtered by keyword.
     * @param Request $request The request
     * @return View The view
     */
    public function index(Request $request): View
    {
        // Attempt to get the shopping cart
        $apiRequest = Request::create('/api/shoppingcart', 'GET');
        $response = app()->handle($apiRequest);

        $shoppingCartId = null;
        $initialArticles = [];
        // Get the shopping cart ID if the request was successful
        if ($response->isOk()) {
            $shoppingCartId = json_decode($response->getContent())->shoppingCartId;
            // Get the shopping cart items
            $apiRequest = Request::create('/api/shoppingcart/' . $shoppingCartId . '/articles', 'GET');
            $response = app()->handle($apiRequest);

            if ($response->isOk()) {
                $shoppingCartItems = json_decode($response->getContent())->shoppingCartItems;
                $articleIds = array_map(function($item) { return $item->ab_article_id; }, $shoppingCartItems);

                // Get the articles
                $apiRequest = Request::create('/api/articles/search', 'POST', ['articleIds' => $articleIds]);
                $response = app()->handle($apiRequest);

                if ($response->isOk()) {
                    $articles = json_decode($response->getContent())->articles;
                    foreach ($articles as $article) {
                        $initialArticles[$article->id] = $article;
                    }
                }
            }
        }

        // Get the categories
        $apiRequest = Request::create('/api/articles/categories', 'GET');
        $response = app()->handle($apiRequest);

        $categories = null;
        if ($response->isOk()) {
            $categories = json_decode($response->getContent())->categories;
        }

        // Return the view
        return view('articles.overview', [
            'search' => $request->query('search'),
            'shoppingCartId' => $shoppingCartId,
            'shoppingCartArticles' => $initialArticles,
            'categories' => $categories,
            'sortBy' => $request->query('sort_by'),
        ]);
    }

    /**
     * Show the form for creating a new article.
     */
    public function add(): View
    {
        // Get the categories
        $apiRequest = Request::create('/api/articles/categories', 'GET');
        $response = app()->handle($apiRequest);

        $categories = null;
        if ($response->isOk()) {
            $categories = json_decode($response->getContent())->categories;
        }

        return view('articles.add', [
            'categories' => $categories,
        ]);
    }
}
