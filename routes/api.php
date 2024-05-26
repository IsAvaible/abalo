<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

/// M3-A7
// Get all articles
Route::get('/articles/', [App\Http\Controllers\ArticleAPIController::class, 'index'])->name('articles');
// Get a specific article
Route::get('/articles/article/{articleId}', [App\Http\Controllers\ArticleAPIController::class, 'getArticle'])->name('getArticle');
// Search articles
Route::get('/articles/search', [App\Http\Controllers\ArticleAPIController::class, 'searchArticles'])->name('searchArticles');
Route::post('/articles/search', [App\Http\Controllers\ArticleAPIController::class, 'searchArticles'])->name('searchArticles');


/// M3-A10
// Get Shopping Cart ID
Route::get('/shoppingcart/', [App\Http\Controllers\ShoppingCartAPIController::class, 'index'])->name('shoppingcart');
// Get Shopping Cart Articles
Route::get('/shoppingcart/{shoppingCartId}/articles', [App\Http\Controllers\ShoppingCartAPIController::class, 'getShoppingCartItems'])->name('getShoppingCart');
// Add Article to Shopping Cart
Route::post('/shoppingcart/{shoppingCartId}/articles/{articleId}', [App\Http\Controllers\ShoppingCartAPIController::class, 'addArticleToShoppingCart'])->name('addArticleToShoppingCart');
// Remove Article from Shopping Cart
Route::delete('/shoppingcart/{shoppingCartId}/articles/{articleId}', [App\Http\Controllers\ShoppingCartAPIController::class, 'removeArticleFromShoppingCart'])->name('removeArticleFromShoppingCart');
