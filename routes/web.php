<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});
// Simon's
// Route::get('/testdata', [App\Http\Controllers\AbTestdataController::class, 'index']);

Route::get('/login', [App\Http\Controllers\AuthController::class, 'login'])->name('login');
Route::get('/logout', [App\Http\Controllers\AuthController::class, 'logout'])->name('logout');
Route::get('/isloggedin', [App\Http\Controllers\AuthController::class, 'isloggedin'])->name('haslogin');

// Yours
Route::get('/articles/', [App\Http\Controllers\ArticleController::class, 'getArticle'])->name('articles');

    /*
Route::get('/articles/', [App\Http\Controllers\ArticleController::class, 'get()'])->name('overview');
Route::get('/articles/{article}', [App\Http\Controllers\ArticleController::class, 'get'])->name('articles.get');
*/
