<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="UTF-8">
    <title>Articles</title>

    <!-- Styles -->
    @vite(['resources/css/app.css'])
</head>
<body class="[&>*]:mx-auto [&>*]:w-fit [&>*]:block pt-3">
    <h1 class="text-4xl tracking-tight font-extrabold text-gray-900 dark:text-slate-100 sm:text-5xl md:text-6xl">Articles Overview</h1>
    <br>
    <a class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" href="{{ route('articles.add') }}">Add Article</a>
    <br>
    @if (session('success'))
        <div class="alert alert-success">
            {{ session('success') }}
        </div>
    @endif
    <table class="shadow-lg bg-white">
        <thead>
        <tr class="[&>th]:bg-blue-100 [&>th]:border [&>th]:text-left [&>th]:px-8 [&>th]:py-4">
            <th>ID</th>
            <th>Name</th>
            <th>Price</th>
            <th>Description</th>
            <th>Creator ID</th>
            <th>Create Date</th>
            <th>Image</th>
        </tr>
        </thead>
        <tbody>
        @foreach ($data as $article)
            <tr class="[&>td]:border [&>td]:px-8 [&>td]:py-4">
                <td>{{$article['id']}}</td>
                <td>{{$article['ab_name']}}</td>
                <td>{{$article['ab_price']}}</td>
                <td>{{$article['ab_description']}}</td>
                <td>{{$article['ab_creator_id']}}</td>
                <td>{{$article['ab_createdate']}}</td>
                <td>
                    <img src='{{$images[$article['id']]}}' alt='image' class="h-20 mx-auto">
                </td>
            </tr>
        @endforeach
        </tbody>
    </table>
</body>
</html>
