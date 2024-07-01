import axios from 'axios';

interface User {
    user: string,
    id: number,
    time: number,
    mail: string,
    auth: string
}

export const getAuthenticatedUser = async (): Promise<User | null> => {
    const response = await axios.get<User>('/isloggedin');
    if (JSON.parse(response.data.auth)) {
        return response.data;
    } else {
        const response = await axios.get<User>('/login');
        if (JSON.parse(response.data.auth)) {
            return response.data;
        }
    }
    return null;

}
