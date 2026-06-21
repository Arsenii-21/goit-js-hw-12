import { getImagesByQuery, PER_PAGE } from './js/pixabay-api.js';
import {
  createGallery,
  clearGallery,
  showLoader,
  hideLoader,
  showLoadMoreButton,
  hideLoadMoreButton,
} from './js/render-functions.js';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

let currentQuery = '';
let page = 1;
let totalHits = 0;

const form = document.querySelector('#search-form');
const loadMoreBtn = document.querySelector('#load-more');

if (form) {
  form.addEventListener('submit', onSearch);
}

if (loadMoreBtn) {
  loadMoreBtn.addEventListener('click', onLoadMore);
}

async function onSearch(e) {
  e.preventDefault();
  const input = form.elements.searchQuery;
  const value = input.value.trim();

  if (!value) {
    iziToast.warning({ title: 'Warning', message: 'Please enter a search query.' });
    return;
  }

  currentQuery = value;
  page = 1;
  clearGallery();
  hideLoadMoreButton();

  showLoader();
  try {
    const data = await getImagesByQuery(currentQuery, page);
    totalHits = data.totalHits || 0;

    if (!data.hits || data.hits.length === 0) {
      iziToast.info({ title: 'No results', message: 'No images found. Try another query.' });
      return;
    }

    createGallery(data.hits);
    iziToast.success({ title: 'Success', message: `Found ${totalHits} images.` });

    if (totalHits > 0 && page * PER_PAGE >= totalHits) {
      hideLoadMoreButton();
      iziToast.info({ title: 'End', message: "We're sorry, but you've reached the end of search results." });
    } else if (page * PER_PAGE < totalHits) {
      showLoadMoreButton();
    } else {
      hideLoadMoreButton();
    }
  } catch (err) {
    iziToast.error({ title: 'Error', message: err.message || 'Request failed' });
  } finally {
    hideLoader();
  }
}

async function onLoadMore() {
  // hide the load more button immediately to prevent duplicate clicks
  hideLoadMoreButton();
  page += 1;
  showLoader();
  try {
    const data = await getImagesByQuery(currentQuery, page);
    if (!data.hits || data.hits.length === 0) {
      hideLoadMoreButton();
      iziToast.info({ title: 'End', message: "We're sorry, but you've reached the end of search results." });
      return;
    }

    createGallery(data.hits);

    const totalLoaded = page * PER_PAGE;
    if (totalLoaded >= totalHits) {
      hideLoadMoreButton();
      iziToast.info({ title: 'End', message: "We're sorry, but you've reached the end of search results." });
    } else {
      showLoadMoreButton();
    }

    // Smooth scroll to reveal newly loaded images
    const gallery = document.querySelector('.gallery');
    const { height: cardHeight } = gallery.firstElementChild.getBoundingClientRect();
    window.scrollBy({ top: cardHeight * 2, behavior: 'smooth' });
  } catch (err) {
    iziToast.error({ title: 'Error', message: err.message || 'Request failed' });
  } finally {
    hideLoader();
  }
}
