<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

// M3-A7
Route::get('/articles/', [App\Http\Controllers\ArticleAPIController::class, 'index_api'])->name('api.articles');
Route::post('/articles', [App\Http\Controllers\ArticleAPIController::class, 'store_api'])->name('api.articles.store');
