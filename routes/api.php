<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

// M3-A7
Route::get('/articles/', [App\Http\Controllers\ArticleAPIController::class, 'index_api'])->name('articles_api');
Route::get('/articles', [App\Http\Controllers\ArticleAPIController::class, 'search_api'])->name('articleSearch_api');

