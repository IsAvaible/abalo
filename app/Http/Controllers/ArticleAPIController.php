<?php

    namespace App\Http\Controllers;

    use App\Models\Article;
    use Illuminate\Http\Request;
    use Illuminate\Routing\Controller;
    use Illuminate\View\View;

    class ArticleAPIController extends Controller
    {
        /**
         * Display a listing of the articles filtered by keyword.
         * @param Request $request The request
         * @return View The view
         */
        /*
         * Repurposing the index_api
         public function index_api(Request $request): View
        {
            // Get the search keyword
            $keyword = $request->query('search');
            // Find the articles (case-insensitive)
            $data = Article::whereRaw('LOWER(ab_name) LIKE ?', '%' . strtolower($keyword) . '%')->get();
            // Find the images
            $images = [];
            foreach ($data as $article) {
                $images[$article['id']] = ArticleAPIController::findImage_api($article['id']);
            }
            // Return the view
            // TODO: only first nine until image compression is implemented
            return view('articles.overviewWIP', ['data' => $data->take(9), 'images' => $images, 'search' => $keyword]);
        }
        */
        public function index_api(): View
        {
            return view('articles.overviewWIP');
        }

        public function search_api(Request $request)
        {
            // Get the search keyword
            $keyword = $request->query('search');
            // Find the articles (case-insensitive)
            $data = Article::whereRaw('LOWER(ab_name) LIKE ?', '%' . strtolower($keyword) . '%')->get();
            // Find the images
            $images = [];
            foreach ($data as $article) {
                $images[$article['id']] = ArticleAPIController::findImage_api($article['id']);
            }

            return response()->json(['data' => $data->take(9), 'images' => $images, 'search' => $keyword]);

            /*
            return response()->json(
                array(1,2,3));
            */
        }

        /**
         * Show the form for creating a new article.
         */
        public function add_api(): View
        {
            return view('articles.add');
        }

        /**
         * Store a newly created article in storage.
         */
        public function store_api(Request $request): \Illuminate\Http\RedirectResponse
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

        /**
         * Find article image by ID
         * @param int $articleID The article ID
         * @return string|null The image path or NULL if not found
         */
        public function findImage_api(int $articleID): ?string
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
