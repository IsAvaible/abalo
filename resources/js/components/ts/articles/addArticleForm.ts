// Create the form element
const form = document.createElement('form');
form.classList.add('grid', 'grid-cols-2', 'items-center', 'gap-x-3', 'gap-y-3', 'my-6', 'dark:bg-slate-800', 'p-6', 'rounded-md', 'shadow-md', 'dark:shadow-none', 'border', 'border-slate-200', 'dark:border-slate-900', 'dark:text-white', 'text-black');
form.style.gridTemplateColumns = 'auto 1fr';
form.method = 'POST';
form.action = '/api/articles';
form.enctype = 'multipart/form-data';

// Create the input fields
const [nameLabel, nameInput]
    = createInputField('text', 'Name', '', 'name', 'input_name');
const [descriptionLabel, descriptionInput]
    = createInputField('text', 'Description', '', 'description', 'input_description');
const [priceLabel, priceInput]
    = createInputField('number', 'Price', '', 'price', 'input_price');
const [categoryLabel, categoryInput]
    = createInputField('select', 'Category', '', 'category', 'input_category');
const [imageLabel, imageInput]
    = createInputField('file', 'Image', '', 'image', 'input_image');

// Set the step and min attributes for the price input
priceInput.setAttribute('step', '0.01');    // "Precision" of input
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

// Add the csrf token
const csrfToken = document.createElement('input');
csrfToken.type = 'hidden';
csrfToken.name = '_token';
csrfToken.value = document.querySelector('meta[name="csrf-token"]')!.getAttribute('content')!;

// Create the submit button
const submitButton = document.createElement('button');
submitButton.type = 'submit';
submitButton.textContent = 'Submit';
submitButton.id = 'input_submit';
submitButton.classList.add('col-span-2', 'py-3', 'rounded-md', 'bg-slate-800', 'hover:bg-slate-900', 'text-white', 'font-semibold', 'transition-colors', 'duration-200', 'ease-in-out', 'shadow-md', 'dark:bg-blue-400', 'dark:hover:bg-blue-500', 'dark:shadow-none');
submitButton.classList.add('col-span-2', 'py-3', 'rounded-md', 'bg-slate-800', 'hover:bg-slate-900', 'text-white', 'font-semibold', 'transition-colors', 'duration-200', 'ease-in-out', 'shadow-md', 'dark:bg-blue-400', 'dark:hover:bg-blue-500', 'dark:shadow-none', 'disabled:animate-pulse');

const messageContainer = document.createElement('div');
messageContainer.classList.add('alert', 'alert-info', 'text-center', 'col-span-2');

/// M3-A2
// Register the event listener for the form submission
// When the form is submitted, send a POST request using AJAX to the server
form.addEventListener('submit', async (event) => {
    event.preventDefault(); // Prevent the default form submission

    submitButton.disabled = true; // Disable the submit button to prevent multiple submissions

    // Remove the message and error containers if they exist
    if (form.contains(messageContainer)) form.removeChild(messageContainer);

    // Get the form data
    const formData = new FormData(form);
    formData.set('price', Math.floor((parseFloat(formData.get('price') as string)) * 100) + ''); // Convert the price to cents

    // Prepare the xhr request
    const xhr = new XMLHttpRequest();
    xhr.open('POST', form.action);
    xhr.setRequestHeader('X-CSRF-TOKEN', csrfToken.value);
    xhr.setRequestHeader('accept', 'application/json');

    xhr.onreadystatechange = () => {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            const response = JSON.parse(xhr.responseText);
            submitButton.disabled = false; // Re-enable the submit button
            if (xhr.status === 201) {
                // Display the success message
                messageContainer.classList.replace('alert-error', 'alert-info');
                messageContainer.textContent = response.message;
                messageContainer.title = "";
                form.append(messageContainer);
                form.reset();
            } else {
                // Mark the input fields with errors and display the error message
                ([nameInput, descriptionInput, priceInput, categoryInput, imageInput] as HTMLInputElement[]).forEach((input) => {
                    if (input.name in JSON.parse(xhr.responseText).errors) {
                        input.classList.add('invalid:border-red-500');
                        input.setCustomValidity(response.errors[input.name]);
                        input.addEventListener('input', () => {
                            // When the input field is corrected, remove the error message
                            input.setCustomValidity('');
                        }, { once: true });
                        input.addEventListener('blur', () => {
                            // When the input field is blurred, display the error message on the next invalid input field
                            form.reportValidity();
                        }, { once: true });
                    }
                });
                // Report the validity of the form
                form.reportValidity();
                // Display the error message in the message container
                messageContainer.classList.replace('alert-info', 'alert-error');
                messageContainer.textContent = response.message;
                messageContainer.title = Object.keys(response.errors).map((key: string) => `• ${response.errors[key]}`).join('\n');
                form.append(messageContainer);
            }
        }
    }
    xhr.send(formData);
});

form.append(nameLabel, nameInput, descriptionLabel, descriptionInput, priceLabel, priceInput, categoryLabel, categoryInput, imageLabel, imageInput, csrfToken, submitButton);

// When the script is loaded, replace the placeholder container with the form
document.getElementById('article-form')!.replaceWith(form);


/**
 * Create an input field
 * @param type
 * @param label
 * @param placeholder
 * @param name
 * @param id
 * @returns
 */
function createInputField(type: string, label: string, placeholder: string, name: string, id: string) {
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
    input.id = id;
    input.required = true;
    input.classList.add('w-full', 'dark:bg-slate-900', 'rounded-md', 'py-3', 'px-[14px]', 'font-normal', 'border', 'border-slate-300', 'dark:border-slate-900', 'outline-none', 'focus-visible:shadow-none', 'focus:border-blue-500', 'grow');

    return [labelElm, input];
}
