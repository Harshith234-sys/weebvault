const API_URL = "http://localhost:5000/api";
export const getAnime = async () => {
    const response = await fetch(`${API_URL}/anime`);
    if(!response.ok){
        throw new Error("Failed to fetch anime");
    }
    return response.json();
};
export const getManga = async () => {
    const response = await fetch(`${API_URL}/manga`);
    if(!response.ok){
        throw new Error("Failed to fetch manga");
    }
    return response.json();
};