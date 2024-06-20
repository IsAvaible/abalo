<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1"/>
    <meta name="csrf-token" id="csrf-token" content="{{ csrf_token() }}">
    @yield('meta')
    <title>@yield('title')</title>

    <!-- Styles -->
    @vite(['resources/css/app.scss'])
    @yield('styles')
    <!-- Scripts -->
    @vite(['resources/js/app.js'])
    @yield('scripts')
</head>

<body>
<div id="hyd-ssr-app">
    @section('page')
    <header class="w-full p-6">
        <nav class="mx-auto grid grid-cols-3 max-w-5xl">
            <div>
                <a href="/articles" class="flex flex-row gap-x-2 items-center text-2xl font-bold text-slate-800">
                    <img src="https://tailwindui.com/img/logos/mark.svg?color=black" alt="Logo" class="h-8">
                    <span class="max-sm:hidden">Abalo</span>
                </a>
            </div>
            <div class="flex flex-row justify-center items-center gap-x-6 max-sm:[&>*:not(:nth-child(2))]:hidden">
                <a href="/articles" class="flex flex-row gap-x-1 bg-slate-900 text-white rounded-full px-4 py-1">
                    <!-- Home Icon -->
                    <svg width="24px" height="24px" viewBox="0 0 24 24" stroke-width="1.5" fill="none" xmlns="http://www.w3.org/2000/svg" color="currentColor"><path d="M2 8L11.7317 3.13416C11.9006 3.04971 12.0994 3.0497 12.2683 3.13416L22 8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M20 11V19C20 20.1046 19.1046 21 18 21H6C4.89543 21 4 20.1046 4 19V11" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path></svg>
                    Home
                </a>

                <search-bar variant="oldsite" @isset($search) search="{{$search}}" @endisset></search-bar>

                <a href="#" class="hover:scale-110 transition-transform">
                    <!-- Heart Icon -->
                    <svg width="24px" height="24px" stroke-width="1.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" color="currentColor"><path d="M22 8.86222C22 10.4087 21.4062 11.8941 20.3458 12.9929C17.9049 15.523 15.5374 18.1613 13.0053 20.5997C12.4249 21.1505 11.5042 21.1304 10.9488 20.5547L3.65376 12.9929C1.44875 10.7072 1.44875 7.01723 3.65376 4.73157C5.88044 2.42345 9.50794 2.42345 11.7346 4.73157L11.9998 5.00642L12.2648 4.73173C13.3324 3.6245 14.7864 3 16.3053 3C17.8242 3 19.2781 3.62444 20.3458 4.73157C21.4063 5.83045 22 7.31577 22 8.86222Z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"></path></svg>
                </a>
                <a href="#" class="hover:scale-110 transition-transform">
                    <!-- Bell Icon -->
                    <svg width="24px" height="24px" stroke-width="1.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" color="currentColor"><path d="M18.1336 11C18.7155 16.3755 21 18 21 18H3C3 18 6 15.8667 6 8.4C6 6.70261 6.63214 5.07475 7.75736 3.87452C8.88258 2.67428 10.4087 2 12 2C12.3373 2 12.6717 2.0303 13 2.08949" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M19 8C20.6569 8 22 6.65685 22 5C22 3.34315 20.6569 2 19 2C17.3431 2 16 3.34315 16 5C16 6.65685 17.3431 8 19 8Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M13.73 21C13.5542 21.3031 13.3019 21.5547 12.9982 21.7295C12.6946 21.9044 12.3504 21.9965 12 21.9965C11.6496 21.9965 11.3054 21.9044 11.0018 21.7295C10.6982 21.5547 10.4458 21.3031 10.27 21" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path></svg>
                </a>
            </div>
            <div class="flex flex-row justify-end items-center gap-x-4">
                <!-- Cart Icon -->
                <a href="#" class="hover:scale-110 transition-transform">
                    <svg width="24px" height="24px" stroke-width="1.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" color="currentColor"><path d="M3 6H22L19 16H6L3 6ZM3 6L2.25 3.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M11 19.5C11 20.3284 10.3284 21 9.5 21C8.67157 21 8 20.3284 8 19.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M17 19.5C17 20.3284 16.3284 21 15.5 21C14.6716 21 14 20.3284 14 19.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path></svg>
                </a>
                <!-- Profile Icon -->
                <a href="#" class="hover:scale-110 transition-transform">
                    <svg width="24px" height="24px" stroke-width="1.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" color="currentColor"><path d="M12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M4.271 18.3457C4.271 18.3457 6.50002 15.5 12 15.5C17.5 15.5 19.7291 18.3457 19.7291 18.3457" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M12 12C13.6569 12 15 10.6569 15 9C15 7.34315 13.6569 6 12 6C10.3431 6 9 7.34315 9 9C9 10.6569 10.3431 12 12 12Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path></svg>
                </a>
                <!-- Hamburger Menu -->
                <div class="w-6 h-6 relative">
                    <button id="hamburger-button" class="transition-transform hover:scale-110">
                        <svg width="24px" height="24px" stroke-width="1.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" color="currentColor">
                            <path class="rounded-full transition group-focus-within:rotate-45 group-focus-within:translate-y-[0.08rem] group-focus-within:translate-x-[0.29rem] group-focus-within:scale-x-75 duration-300" d="M3 5H21" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                            <path class="group-focus-within:scale-x-0 origin-left group-focus-within:opacity-0 transition duration-150" d="M3 12H21" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                            <path class="rounded-full transition group-focus-within:-rotate-45 group-focus-within:translate-y-1 group-focus-within:-translate-x-[0.16rem] group-focus-within:scale-x-75 duration-300" d="M3 19H21" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                        </svg>
                    </button>
                    <div id="nav-menu-dialog" role="dialog" class="flex flex-col absolute right-0 bg-white rounded-lg w-fit z-50 opacity-0 transition-opacity pointer-events-none"></div>
                </div>
            </div>
        </nav>
    </header>

    <div class="[&>*]:mx-auto [&>*]:w-fit min-h-[calc(100svh_-_4rem)] py-3" @hasSection('content-style') style="@yield('content-style')" @endif>
        @yield('content')
    </div>

    @section('footer')
    <footer class="relative bottom-0 w-full bg-slate-800 p-8 text-slate-100 mt-auto">
        <div class="flex flex-row gap-x-4 mx-auto w-fit flex-wrap gap-y-2">
            <button class="bg-slate-700 hover:ring-1 ring-slate-200 text-white font-semibold py-2 px-4 rounded">
                Help
            </button>
            <button class="bg-slate-700 hover:ring-1 ring-slate-200 text-white font-semibold py-2 px-4 rounded">
                Order Status
            </button>
            <button class="bg-slate-700 hover:ring-1 ring-slate-200 text-white font-semibold py-2 px-4 rounded">
                Shipping & Delivery
            </button>
            <button class="bg-slate-700 hover:ring-1 ring-slate-200 text-white font-semibold py-2 px-4 rounded">
                Returns
            </button>
            <a class="bg-blue-600 hover:ring-1 ring-slate-200 text-white font-bold py-2 px-4 rounded" href="/articles/add">Add Article</a>
        </div>
        <br>
        <div class="grid grid-cols-2 md:grid-cols-3 max-w-5xl mx-auto justify-items-center">
            <div>
                <h4 class="font-semibold text-lg mb-1">Legal Information</h4>
                <ul>
                    <li><a href="#">Terms & Conditions</a></li>
                    <li><a href="#">Privacy Policy</a></li>
                    <li><a href="#">Imprint</a></li>
                </ul>
            </div>
            <div>
                <h4 class="font-semibold text-lg mb-1">Company</h4>
                <ul>
                    <li><a href="#">About Us</a></li>
                    <li><a href="#">Careers</a></li>
                    <li><a href="#">Press</a></li>
                </ul>
            </div>
            <div>
                <h4 class="font-semibold text-lg mb-1">Follow Us</h4>
                <ul>
                    <li><a href="#">Facebook</a></li>
                    <li><a href="#">Instagram</a></li>
                    <li><a href="#">Twitter</a></li>
                </ul>
            </div>
        </div>
    </footer>
    @show
</div>

@yield('templates')
@yield('scripts')

</body>
</html>

