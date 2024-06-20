/**
 * Wait for an element to be added to the DOM.
 * @param selector The selector of the element to wait for.
 * @returns A promise that resolves when the element is added to the DOM.
 */
export default function waitForElement(selector): Promise<HTMLElement> {
    return new Promise(resolve => {
        if (document.querySelector(selector)) {
            return resolve(document.querySelector(selector));
        }

        const observer = new MutationObserver(mutations => {
            if (document.querySelector(selector)) {
                observer.disconnect();
                resolve(document.querySelector(selector));
            }
        });

        // If you get "parameter 1 is not of type 'Node'" error, see https://stackoverflow.com/a/77855838/492336
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    });
}
