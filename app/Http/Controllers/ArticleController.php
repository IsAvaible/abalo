<?php

    namespace App\Http\Controllers;

    use App\Models\Article;
    use Illuminate\Http\Request;

    class ArticleController extends Controller
    {
        public function getImage(int $imageID)
        {
            $exists = false;
            $dir    = public_path("images");
            $files  = glob($dir . '/*');

            foreach ($files as $file)
            {
                if ($file == $imageID)
                {
                    return "<td><img src='$dir/{$file}' alt='" . substr($file, 0, strrpos($file, '.')) . "'></td>";
                }
            }
            return NULL;
        }

        public function getArticle(Request $request)
        {
            $keyword = $request->query('search');
            $data    = Article::where('ab_name', 'like', '%' . $keyword . '%')->get();
            $images = [];
            foreach($data as $article)
            {
                $images[] = ArticleController::getImage($article['id']);
            }
            return view('articles.overview', ['data' => $data, 'images' => $images]);
        }
    }
