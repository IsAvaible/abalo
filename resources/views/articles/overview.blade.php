<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="UTF-8">
    <title>$Overview$</title>
</head>
<body>
    <table>
        @foreach ($data as $article)
            <tr>
                <td>
                    {{$article['id']}}
                </td>
                <td>
                    {{$article['ab_name']}}
                </td>
                <td>
                    {{$article['ab_price']}}
                </td>
                <td>
                    {{$article['ab_description']}}
                </td>
                <td>
                    {{$article['ab_creator_id']}}
                </td>
                <td>
                    {{$article['ab_createdate']}}
                </td>
                <td>
                    <img src='{{$images[$article['id']]}}' alt='image' height='70px'>
                </td>
            </tr>

        @endforeach
    </table>
</body>
</html>
