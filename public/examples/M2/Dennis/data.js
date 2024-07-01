var data = {
    'produkte': [
        { name: 'Ritterburg', preis: 59.99, kategorie: 1, anzahl: 3 },
        { name: 'Gartenschlau 10m', preis: 6.50, kategorie: 2, anzahl: 5 },
        { name: 'Robomaster' ,preis: 199.99, kategorie: 1, anzahl: 2 },
        { name: 'Pool 250x400', preis: 250, kategorie: 2, anzahl: 8 },
        { name: 'Rasenmähroboter', preis: 380.95, kategorie: 2, anzahl: 4 },
        { name: 'Prinzessinnenschloss', preis: 59.99, kategorie: 1, anzahl: 5 }
    ],
    'kategorien': [
        { id: 1, name: 'Spielzeug' },
        { id: 2, name: 'Garten' }
    ]
};

// Aufgabe a)
function getMaxPreis(data)
{
    "use strict";
    // Variables
    let maxPreis = 0.00; // lowest possible price
    let maxPreisIndex = 0;

    // Find highest price
    data.produkte.forEach(function(produkt, index)
    {
        if (produkt.preis > maxPreis)
        {
            maxPreis = produkt.preis;
            maxPreisIndex = index;
        }
    })

    return data.produkte[maxPreisIndex].name;
}

// Aufgabe b)
function getMinPreisProdukt(data)
{
    "use strict";
    // Variables
    let minPreis = Number.MAX_SAFE_INTEGER;
    let minPreisIndex = Number.MAX_SAFE_INTEGER; // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/MAX_SAFE_INTEGER

    // Find lowest price
    data.produkte.forEach(function(produkt, index)
    {
        if (produkt.preis < minPreis)
        {
            minPreis = produkt.preis;
            minPreisIndex = index;
        }
    })

    // Return corresponding data set
    return data.produkte[minPreisIndex];
}

// Aufgabe c)
function getPreisSum(data)
{
    "use strict";
    // Variables
    let preisSum = 0.00;

    // Iterate and add price to preisSum
    data.produkte.forEach(function(produkt) // :O of course! you don't strictly need two parameters
    {
        preisSum += produkt.preis;
    })

    return preisSum;
}

// Aufgabe d)
function getGesamtWert(data)
{
    "use strict";
    // Variables
    let gesamtWert = 0.00;

    // Iterate and add price * quantity to gesamtWert
    data.produkte.forEach(function(produkt)
    {
        gesamtWert += (produkt.preis * produkt.anzahl);
    })

    return gesamtWert;
}

// Aufgabe e)
function getAnzahlProdukteOfKategorie(data, categoryName)
{
    "use strict";
    // Variables
    let quantity = 0;
    let validCategory = false;
    let categoryId = -1;

    // Check category
    data.kategorien.forEach(function(category)
    {
        if (categoryName === category.name)
        {
            validCategory = true;
            categoryId = category.id;
        }
    })

    // Error if category parameter does not exist in 'data'
    if (validCategory === false) // alternatively: categoryId === -1
    {
        console.log("Provided category does not exist.")
        return;
    }

    // Find quantity of certain category
    data.produkte.forEach(function(produkt)
    {
        if (produkt.kategorie === categoryId)
        {
            quantity += produkt.anzahl;
        }
    })

    return quantity;
}
