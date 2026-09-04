import axios from 'axios';

const api = axios.create({
  baseURL: 'https://phimapi.com',
});

// APIs
export const getHomeMovies = () => api.get('/v1/api/home');
export const getNewUpdatedMovies = (page = 1) => api.get(`/danh-sach/phim-moi-cap-nhat?page=${page}`);
export const getSeriesMovies = (page = 1) => api.get(`/v1/api/danh-sach/phim-bo?page=${page}`);
export const getSingleMovies = (page = 1) => api.get(`/v1/api/danh-sach/phim-le?page=${page}`);
export const getAnimeMovies = (page = 1) => api.get(`/v1/api/danh-sach/hoat-hinh?page=${page}`);
export const getTvShows = (page = 1) => api.get(`/v1/api/danh-sach/tv-shows?page=${page}`);
export const getMovieDetails = (slug: string) => api.get(`/phim/${slug}`);
export const searchMovies = (keyword: string, limit = 24, page = 1) => api.get(`/v1/api/tim-kiem?keyword=${keyword}&limit=${limit}&page=${page}`);
export const getCategories = () => api.get('/the-loai');
export const getCountries = () => api.get('/quoc-gia');
export const getMoviesByCategory = (slug: string, page = 1) => api.get(`/v1/api/the-loai/${slug}?page=${page}`);
export const getMoviesByCountry = (slug: string, page = 1) => api.get(`/v1/api/quoc-gia/${slug}?page=${page}`);

export const getImageUrl = (path: string) => `https://phimimg.com/${path}`; // Note: Sometimes phimapi provides image paths that need prefixing, we will check response
