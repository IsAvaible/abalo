<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1"/>
    <meta name="csrf-token" id="csrf-token" content="{{ csrf_token() }}">

    <title>Abalo Vue</title>

    @vite(['resources/css/app.scss'])
    @vite(['resources/js/app.js'])
</head>

<body>
    <div id="spa-app">
        <abalo-header></abalo-header>
        <abalo-content></abalo-content>
        <abalo-footer></abalo-footer>
    </div>
</body>
