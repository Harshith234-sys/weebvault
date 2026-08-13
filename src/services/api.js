const API_URL = "http://localhost:5000/api";

// ANIME - TOP


export const getAnime = async () => {
    const response = await fetch(`${API_URL}/anime`);

    if (!response.ok) {
        throw new Error("Failed to fetch anime");
    }

    return response.json();
};



// ANIME - AIRING / CURRENT SEASON


export const getAiringAnime = async () => {
    const response = await fetch(`${API_URL}/anime/airing`);

    if (!response.ok) {
        throw new Error("Failed to fetch airing anime");
    }

    return response.json();
};



// ANIME - SEARCH


export const searchAnime = async (query) => {
    const response = await fetch(
        `${API_URL}/anime/search?q=${encodeURIComponent(query)}`
    );

    if (!response.ok) {
        throw new Error("Failed to search anime");
    }

    return response.json();
};


// ANIME - DETAILS


export const getAnimeDetails = async (id) => {
    const response = await fetch(
        `${API_URL}/anime/${id}`
    );

    if (!response.ok) {
        throw new Error("Failed to fetch anime details");
    }

    return response.json();
};

// MANGA - TOP

export const getManga = async () => {
    const response = await fetch(`${API_URL}/manga`);

    if (!response.ok) {
        throw new Error("Failed to fetch manga");
    }

    return response.json();
};



// MANGA - SEARCH


export const searchManga = async (query) => {
    const response = await fetch(
        `${API_URL}/manga/search?q=${encodeURIComponent(query)}`
    );

    if (!response.ok) {
        throw new Error("Failed to search manga");
    }

    return response.json();
};



// MANGA - DETAILS


export const getMangaDetails = async (id) => {
    const response = await fetch(
        `${API_URL}/manga/${id}`
    );

    if (!response.ok) {
        throw new Error("Failed to fetch manga details");
    }

    return response.json();
};
// LIBRARY

export const getLibrary = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
        throw new Error("Please login first");
    }

    const response = await fetch(
        `${API_URL}/library`,
        {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        }
    );

    if (!response.ok) {
        throw new Error("Failed to fetch library");
    }

    return response.json();
};

const libraryRequest = async (path, options = {}) => {
    const token = localStorage.getItem("token");

    if (!token) {
        throw new Error("Please login first");
    }

    const response = await fetch(`${API_URL}/library${path}`, {
        ...options,
        headers: {
            "Authorization": `Bearer ${token}`,
            ...(options.body ? { "Content-Type": "application/json" } : {}),
            ...options.headers
        }
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Library request failed");
    }

    return data;
};

export const addToLibrary = (entry) =>
    libraryRequest("", {
        method: "POST",
        body: JSON.stringify(entry)
    });

export const updateLibraryEntry = (id, changes) =>
    libraryRequest(`/${id}`, {
        method: "PUT",
        body: JSON.stringify(changes)
    });

export const deleteLibraryEntry = (id) =>
    libraryRequest(`/${id}`, {
        method: "DELETE"
    });
