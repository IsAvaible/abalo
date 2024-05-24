<?php

namespace App\Http\Controllers;

use App\Models\Article;
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
    public function store(Request $request): \Illuminate\Http\RedirectResponse
    {
        // Validate the request
        $request->validate([
            'name' => 'required',
            'description' => 'required',
            'price' => ['required', 'numeric', 'min:0'],
            'image' => ['required', 'image', 'max:2048'],
        ]);

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

        // Redirect to the articles overview
        return redirect()->route('articles')->with('success', 'Article created successfully.');
    }
}
