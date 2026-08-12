const API_URL = "http://localhost:5000/api";


// ========================================
// ANIME
// ========================================

export const getAnime = async () => {

    const response = await fetch(
        `${API_URL}/anime`
    );

    if (!response.ok) {
        throw new Error(
            "Failed to fetch anime"
        );
    }

    return response.json();
};


// ========================================
// MANGA
// ========================================

export const getManga = async () => {

    const response = await fetch(
        `${API_URL}/manga`
    );

    if (!response.ok) {
        throw new Error(
            "Failed to fetch manga"
        );
    }

    return response.json();
};


// ========================================
// ANIME SEARCH
// ========================================

export const searchAnime = async (query) => {

    const response = await fetch(
        `${API_URL}/anime/search?q=${encodeURIComponent(query)}`
    );

    if (!response.ok) {
        throw new Error(
            "Failed to search anime"
        );
    }

    return response.json();
};


// ========================================
// MANGA SEARCH
// ========================================

export const searchManga = async (query) => {

    const response = await fetch(
        `${API_URL}/manga/search?q=${encodeURIComponent(query)}`
    );

    if (!response.ok) {
        throw new Error(
            "Failed to search manga"
        );
    }

    return response.json();
};


// ========================================
// ANIME DETAILS
// ========================================

export const getAnimeDetails = async (id) => {

    const response = await fetch(
        `${API_URL}/anime/${id}`
    );

    if (!response.ok) {
        throw new Error(
            "Failed to fetch anime details"
        );
    }

    return response.json();
};


// ========================================
// MANGA DETAILS
// ========================================

export const getMangaDetails = async (id) => {

    const response = await fetch(
        `${API_URL}/manga/${id}`
    );

    if (!response.ok) {
        throw new Error(
            "Failed to fetch manga details"
        );
    }

    return response.json();
};