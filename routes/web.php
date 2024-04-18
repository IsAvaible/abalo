<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

// AuthController
Route::get('/login', [App\Http\Controllers\AuthController::class, 'login'])->name('login');
Route::get('/logout', [App\Http\Controllers\AuthController::class, 'logout'])->name('logout');
Route::get('/isloggedin', [App\Http\Controllers\AuthController::class, 'isloggedin'])->name('haslogin');

// TestDataController
Route::get('/testdata', [App\Http\Controllers\AbTestdataController::class, 'index'])->name('testdata');
// ArticleController
Route::get('/articles/', [App\Http\Controllers\ArticleController::class, 'index'])->name('articles');
