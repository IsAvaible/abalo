<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

// M3-A7
Route::get('/articles/', [App\Http\Controllers\ArticleAPIController::class, 'index'])->name('articles');
Route::get('/articles/article/{articleId}', [App\Http\Controllers\ArticleAPIController::class, 'getArticle'])->name('getArticle');
Route::get('/articles/search', [App\Http\Controllers\ArticleAPIController::class, 'searchArticles'])->name('searchArticles');
Route::post('/articles/search', [App\Http\Controllers\ArticleAPIController::class, 'searchArticles'])->name('searchArticles');


// M3-A10
Route::get('/shoppingcart/', [App\Http\Controllers\ShoppingCartAPIController::class, 'index'])->name('shoppingcart');
Route::get('/shoppingcart/{shoppingCartId}/articles', [App\Http\Controllers\ShoppingCartAPIController::class, 'getShoppingCart'])->name('getShoppingCart');
Route::post('/shoppingcart/{shoppingCartId}/articles/{articleId}', [App\Http\Controllers\ShoppingCartAPIController::class, 'addArticleToShoppingCart'])->name('addArticleToShoppingCart');
Route::delete('/shoppingcart/{shoppingCartId}/articles/{articleId}', [App\Http\Controllers\ShoppingCartAPIController::class, 'removeArticleFromShoppingCart'])->name('removeArticleFromShoppingCart');
