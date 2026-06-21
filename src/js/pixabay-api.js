import axios from 'axios';

const BASE_URL = 'https://pixabay.com/api/';
const PER_PAGE = 15;
const KEY = import.meta.env.VITE_PIXABAY_KEY || '56320794-31c479758a0ddef69c373babb';

export async function getImagesByQuery(query, page = 1) {
  const params = {
    key: KEY,
    q: query,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
    per_page: PER_PAGE,
    page,
  };

  const response = await axios.get(BASE_URL, { params });
  return response.data;
}

export { PER_PAGE };
