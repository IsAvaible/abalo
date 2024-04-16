<?php

namespace App\Http\Controllers;

use App\Models\Article;
use Illuminate\Http\Request;

class ArticleController extends Controller
{
    public function getArticle(Request $request)
    {
        $keyword = $request->query('search');
        $artikel = Article::where('ab_name', 'like', '%' . $keyword . '%')->get();
        return redirect()->route('articles')->with('article', $artikel);
    }
}
