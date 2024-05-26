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
        // Return the view
        return view('articles.overview', ['search' => $request->query('search')]);
    }

    /**
     * Show the form for creating a new article.
     */
    public function add(): View
    {
        return view('articles.add');
    }
}
