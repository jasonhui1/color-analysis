import { getUserId } from "./supabaseClient";

export const getTagsClient = async () => {
    const userId = await getUserId();
    const options = { userId }

    const queryParams = new URLSearchParams(options).toString();
    const url = `/api/tags?${queryParams}`;

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Failed to fetch tags:', error);
    }
}
