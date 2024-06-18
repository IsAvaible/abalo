<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1"/>
    <meta name="csrf-token" id="csrf-token" content="{{ csrf_token() }}">

    <title>Abalo Vue</title>
</head>

<body id="spa-app">
    Hello, World!
</body>
