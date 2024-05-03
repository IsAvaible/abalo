// Create the form element
const form = document.createElement('form');
form.classList.add('grid', 'grid-cols-2', 'items-center', 'gap-x-3', 'gap-y-3', 'my-6', 'dark:bg-slate-800', 'p-6', 'rounded-md', 'shadow-md', 'dark:shadow-none', 'border', 'border-slate-200', 'dark:border-slate-900', 'dark:text-white', 'text-black');
form.style.gridTemplateColumns = 'auto 1fr';
form.method = 'POST';
form.action = '/articles';
form.enctype = 'multipart/form-data';

// Create the input fields
const [nameLabel, nameInput]
    = createInputField('text', 'Name', '', 'name');
const [descriptionLabel, descriptionInput]
    = createInputField('text', 'Description', '', 'description');
const [priceLabel, priceInput]
    = createInputField('number', 'Price', '', 'price');
const [categoryLabel, categoryInput]
    = createInputField('select', 'Category', '', 'category');
const [imageLabel, imageInput]
    = createInputField('file', 'Image', '', 'image');

// Set the step and min attributes for the price input
priceInput.setAttribute('step', '0.01');
priceInput.setAttribute('min', '0');

// Add options to the select element
const categories = ["Electronics", "Clothing", "Books", "Home", "Garden", "Toys", "Beauty", "Health", "Sports", "Outdoors", "Automotive", "Music", "Movies", "Games"];
categories.forEach((category) => {
    const option = document.createElement('option');
    option.value = category;
    option.textContent = category;
    categoryInput.append(option);
});

// Set the accept attribute for the image input
imageInput.setAttribute('accept', 'image/*');

// Repopulate the form fields with the previously entered values
(nameInput as HTMLInputElement).value = document.querySelector('meta[name="old-name"]').getAttribute('content') || '';
(descriptionInput as HTMLInputElement).value = document.querySelector('meta[name="old-description"]').getAttribute('content') || '';
(priceInput as HTMLInputElement).value = document.querySelector('meta[name="old-price"]').getAttribute('content') || '';
(categoryInput as HTMLSelectElement).selectedIndex = categories.indexOf(document.querySelector('meta[name="old-category"]').getAttribute('content')) || 0;

// Add the csrf token
const csrfToken = document.createElement('input');
csrfToken.type = 'hidden';
csrfToken.name = '_token';
csrfToken.value = document.querySelector('meta[name="csrf-token"]').getAttribute('content');

// Create the submit button
const submitButton = document.createElement('button');
submitButton.type = 'submit';
submitButton.textContent = 'Submit';
submitButton.classList.add('col-span-2', 'py-3', 'rounded-md', 'bg-blue-500', 'hover:bg-blue-600', 'text-white', 'font-semibold', 'transition-colors', 'duration-200', 'ease-in-out', 'shadow-md', 'dark:bg-blue-400', 'dark:hover:bg-blue-500', 'dark:shadow-none');

form.append(nameLabel, nameInput, descriptionLabel, descriptionInput, priceLabel, priceInput, categoryLabel, categoryInput, imageLabel, imageInput, csrfToken, submitButton);

// When the script is loaded, insert the form at the current script tag position
document.scripts[document.scripts.length - 1].insertAdjacentElement('afterend', form);

/**
 * Create an input field
 * @param type
 * @param label
 * @param placeholder
 * @param name
 * @returns
 */
function createInputField(type: string, label: string, placeholder: string, name: string) {
    const labelElm = document.createElement('label');
    let input: HTMLInputElement | HTMLSelectElement;
    if (type === 'select') {
        input = document.createElement('select');
    } else {
        input = document.createElement('input');
        input.type = type;
        input.placeholder = placeholder;
    }

    labelElm.textContent = label;

    input.name = name;
    input.required = true;
    input.classList.add('w-full', 'dark:bg-slate-900', 'rounded-md', 'py-3', 'px-[14px]', 'font-normal', 'border', 'border-slate-300', 'dark:border-slate-900', 'outline-none', 'focus-visible:shadow-none', 'focus:border-blue-500', 'grow');

    return [labelElm, input];
}

