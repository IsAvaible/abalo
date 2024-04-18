<!DOCTYPE html>
<html lang="de">
<head>
    <meta charset="UTF-8">
    <title>$Overview$</title>
</head>
<body>
    <!-- HTML -->
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

            </tr>

        @endforeach
    </table>
    <!-- HTML -->
</body>
</html>
