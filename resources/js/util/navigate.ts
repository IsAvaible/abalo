/**
 * Navigate to a new URL without reloading the page.
 * @param url The URL to navigate to.
 * @param replace If true, the current URL will be replaced in the history.
 */
export default function navigate(url: string | HTMLAnchorElement, replace: boolean = false) {
    if (url instanceof HTMLAnchorElement) {
        url = url.href;
    }

    if (replace) {
        window.history.replaceState({}, '', url);
    } else {
        window.history.pushState({}, '', url);
    }

    scroll({ top: 0, behavior: 'smooth' });

    window.dispatchEvent(new CustomEvent('navigate', { detail: { url } }));
}
