@extends('layouts.app')

@section('title', 'Articles')

@section('meta')
    <meta name="description" content="Discover our articles below."/>
    <meta name="shopping-cart-id" content="{{ json_encode($shoppingCartId) }}"/>
    <meta name="initial-shopping-cart-articles" content="{{ json_encode(array_values($shoppingCartArticles)) }}"/>
@endsection

@section('content')
    <h1 class="text-4xl tracking-tight font-extrabold text-gray-900 dark:text-slate-100 sm:text-5xl md:text-6xl">Articles Overview</h1>
    <p class="mt-3 max-w-md mx-auto text-base text-gray-500 dark:text-slate-400 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">Discover our articles below.</p>
    <br>
    @if (session('success'))
        <div class="alert alert-success">
            {{ session('success') }}
        </div>
        <br>
    @endif
    <div>
        <div class="grid gap-8 2xl:gap-12 px-8 relative" style="grid-template-columns: 1fr auto minmax(0,1fr)">
            <div class="col-span-full md:col-span-1">
                <article-filter-form categories='@json($categories)' selected-categories="{{$selectedCategories}}" price-min="{{$priceMin}}" price-max="{{$priceMax}}">></article-filter-form>
            </div>
            <div class="col-span-full md:col-span-1 max-w-5xl">
                <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <!-- Filters -->
                    <div class="flex flex-row gap-2 flex-wrap col-span-full">
                        <button class="bg-slate-700 text-white font-bold py-2 px-4 rounded" onclick="filterArticles('')">All</button>
                        @foreach (['Good & Used', 'Cars', '200-1000 €', 'Free & Standard'] as $filter)
                            <button class="bg-slate-100 font-semibold py-2 px-4 rounded group relative hover:bg-slate-200 overflow-hidden" onclick="removeFilter('{{$filter}}')">
                                <span>{{$filter}}</span>
                                <span class="absolute left-0 top-0 hidden group-hover:flex p-[inherit] bg-inherit w-full h-full">
                                    <span class="truncate">{{$filter}}</span>
                                    <span class="text-nowrap ml-1">X</span>
                                </span>
                            </button>
                        @endforeach
                        <!-- Sort -->
                        <sort-option-dropdown selected-sorting-option="{{$sortBy}}"></sort-option-dropdown>
                    </div>
                    <!-- Articles -->
                    <section id="articles" aria-description="List of articles" class="col-span-full grid grid-cols-[inherit] gap-[inherit]">
                        <div role="status" class="col-span-full flex justify-center items-center aspect-square">
                            <svg aria-hidden="true" class="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-slate-800" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                            </svg>
                            <span class="sr-only">Loading...</span>
                        </div>
                    </section>
                </div>
            </div>
            <div id="shopping-cart">
            </div>
        </div>
    </div>
@endsection

@section('scripts')
    @vite('resources/js/components/ts/articles/articlesOverview.ts')
@endsection
