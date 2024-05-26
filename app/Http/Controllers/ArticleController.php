<?php

namespace App\Http\Controllers;

use Illuminate\Http\RedirectResponse;
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

    /**
     * Store a newly created article in storage.
     */
    public function store(Request $request): RedirectResponse
    {
        // Reroute the request to the API
        $request->server->set('REQUEST_URI', '/api/articles');
        $response = app()->handle($request);

        var_dump($response->getStatusCode());
        // Check if the request was successful
        if ($response->getStatusCode() !== 201) {
            $errors = json_decode($response->getContent(), true)['error'];
            // Return back with previous input and an error message
            return redirect()->back()->withInput($request->input())->withErrors($errors);
        }

        // Redirect to the articles overview
        return redirect()->route('articles')->with('success', 'Article created successfully.');
    }
}
