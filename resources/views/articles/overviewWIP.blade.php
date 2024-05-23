@extends('layouts.appWIP')
@section('title', 'Articles')

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
        <div class="grid gap-8 2xl:gap-12 px-8" style="grid-template-columns: 1fr auto minmax(0,1fr)">
            <div class="col-span-full md:col-span-1">
                <div class="flex-col gap-y-4 w-fit hidden md:flex md:float-right">
                    <div class="flex flex-col gap-y-1">
                        <h4 class="text-lg font-semibold text-slate-700">Condition</h4>
                        @foreach(['new' => false, 'very_good' => false, 'good' => true, 'used' => true] as $condition => $checked)
                            <div>
                                <input type="checkbox" id="condition_{{$condition}}" name="condition_{{$condition}}" value="{{$condition}}" {{$checked ? 'checked' : ''}}>
                                <label for="condition_{{$condition}}">{{ucfirst($condition)}}</label>
                            </div>
                        @endforeach
                    </div>
                    <div class="flex flex-col gap-y-1">
                        <h4 class="text-lg font-semibold text-slate-700">Category</h4>
                        <select class="bg-white text-slate-800 border border-slate-300 rounded p-2" title="Select category" onchange="filterArticles(this.value)">
                            <option value="">All</option>
                            @foreach(['Cars' => true, 'Clothing' => false, 'Books' => false, 'Furniture' => false] as $category => $selected)
                                <option value="{{$category}}" {{$selected ? 'selected' : ''}}>{{$category}}</option>
                            @endforeach
                        </select>
                    </div>
                    <div class="flex flex-col gap-y-1">
                        <h4 class="text-lg font-semibold text-slate-700">Price Range</h4>
                        <div class="flex flex-row gap-x-2 items-center">
                            <input type="number" id="price_min" name="price_min" class="w-24 p-2 border border-slate-300 rounded" placeholder="From" value="200">
                            <span> - </span>
                            <input type="number" id="price_max" name="price_max" class="w-24 p-2 border border-slate-300 rounded" placeholder="To" value="1000">
                        </div>
                    </div>
                    <div class="flex flex-col gap-y-1">
                        <h4 class="text-lg font-semibold text-slate-700">Shipping</h4>
                        @foreach(['free' => true, 'express' => false, 'standard' => true] as $shipping => $checked)
                            <div>
                                <input type="checkbox" id="shipping_{{$shipping}}" name="shipping_{{$shipping}}" value="{{$shipping}}" {{$checked ? 'checked' : ''}}>
                                <label for="shipping_{{$shipping}}">{{ucfirst($shipping)}}</label>
                            </div>
                        @endforeach
                    </div>
                    <div class="flex flex-col gap-y-1">
                        <h4 class="text-lg font-semibold text-slate-700">Location</h4>
                        @foreach(['Germany' => true, 'France' => false, 'Spain' => false, 'Italy' => false] as $location => $checked)
                            <div>
                                <input type="checkbox" id="location_{{$location}}" name="location_{{$location}}" value="{{$location}}" {{$checked ? 'checked' : ''}}>
                                <label for="location_{{$location}}">{{ucfirst($location)}}</label>
                            </div>
                        @endforeach
                    </div>
                </div>
            </div>
            <div class="col-span-full md:col-span-1 max-w-5xl">
                <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <!-- Filters -->
                    <div class="flex flex-row gap-2 flex-wrap col-span-full">
                        <button class="bg-slate-700 text-white font-bold py-2 px-4 rounded" onclick="filterArticles('')">All</button>
                        @foreach (['Good & Used', 'Cars', '200-1000 €', 'Free & Standard', 'Germany'] as $filter)
                            <button class="bg-slate-100 font-semibold py-2 px-4 rounded group relative hover:bg-slate-200 overflow-hidden" onclick="removeFilter('{{$filter}}')">
                                <span>{{$filter}}</span>
                                <span class="absolute left-0 top-0 hidden group-hover:flex p-[inherit] bg-inherit w-full h-full">
                                    <span class="truncate">{{$filter}}</span>
                                    <span class="text-nowrap ml-1">X</span>
                                </span>
                            </button>
                        @endforeach
                        <!-- Sort -->
                        <select class="max-lg:hidden bg-white text-slate-800 border border-slate-300 rounded p-2 h-fit ml-auto" title="Sort articles" onchange="sortArticles(this)">
                            <option value="price_asc">Price Ascending</option>
                            <option value="price_desc" selected>Price Descending</option>
                            <option value="name_asc">Name Ascending</option>
                            <option value="name_desc">Name Descending</option>
                        </select>
                        <button class="lg:hidden bg-white text-slate-800 border border-slate-300 rounded p-2 h-fit" title="Sort articles" onclick="displaySortDialog()">
                            <!-- Sort Icon -->
                            <svg width="24px" height="24px" viewBox="0 0 24 24" stroke-width="1.5" fill="none" xmlns="http://www.w3.org/2000/svg" color="#000000"><path d="M10 14H2" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M8 10H2" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M6 6H2" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M12 18H2" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M19 20V4M19 20L22 17M19 20L16 17M19 4L22 7M19 4L16 7" stroke="#000000" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path></svg>
                        </button>
                    </div>
                    <div id="showcase">
                        <!-- UNDER CONSTRUCTION -->
                        @vite(['resources/js/dynOverview.ts'])
                        <!-- UNDER CONSTRUCTION -->
                    </div>
                </div>
            </div>
            <div>
                @vite('resources/js/shoppingCart.ts')
            </div>
        </div>
    </div>
@endsection
