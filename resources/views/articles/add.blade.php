@extends('layouts.app')

@section('meta')
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <meta name="old-name" content="{{ old('name') }}">
    <meta name="old-description" content="{{ old('description') }}">
    <meta name="old-category" content="{{ old('category') }}">
    <meta name="old-price" content="{{ old('price') }}">
@endsection

@section('title', 'Add Article')

@section('content')
    <h1 class="text-4xl tracking-tight font-extrabold text-gray-900 dark:text-slate-100 sm:text-5xl md:text-6xl focus:outline-none">Add Article</h1>
    <p class="mt-3 max-w-md mx-auto text-base text-gray-500 dark:text-slate-400 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">Fill in the form below to add a new article.</p>
    @vite(['resources/js/components/articles/addArticleForm.ts'])
    @if ($errors->any())
        <div class="alert alert-danger">
            <ul>
                @foreach ($errors->all() as $error)
                    <li>{{ $error }}</li>
                @endforeach
            </ul>
        </div>
    @endif
@endsection
