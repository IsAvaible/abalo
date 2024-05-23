import ArticleShowcase from './articleShowcase';

var xhr = new XMLHttpRequest();
xhr.open('GET', "/api/articles");
xhr.setRequestHeader('Content-Type',
    'application/json');
xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
        if (xhr.status === 200) {
            console.log("OUTPUT 1: ");

            console.log(xhr.responseText);
            console.log("OUTPUT 1 DONE");
        } else {
            console.error(xhr.statusText);
        }
    }
};
xhr.send();


