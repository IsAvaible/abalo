export default class CookieStore {
    private static readonly COOKIE_NAME = 'cookiesAllowed';

    static set(allowed: boolean): void {
        document.cookie = `${CookieStore.COOKIE_NAME}=${allowed ? 'true' : 'false'}; path=/`;
    }

    static get(): boolean | null {
        const cookies = document.cookie.split('; ');
        const cookie = cookies.find(cookie => cookie.startsWith(CookieStore.COOKIE_NAME + '='));
        if (cookie) {
            const value = cookie.split('=')[1];
            return value === 'true';
        }
        return null;
    }
}
