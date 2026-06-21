import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const gallerySelector = '.gallery';
const loadMoreSelector = '#load-more';
const loaderSelector = '#loader';

let lightbox = null;

function ensureLightbox() {
  if (!lightbox) {
    lightbox = new SimpleLightbox(`${gallerySelector} a`, {
      captionsData: 'alt',
      captionDelay: 250,
    });
  }
}

export function createGallery(images) {
  const container = document.querySelector(gallerySelector);
  if (!container) return;

  const markup = images
    .map(img => {
      return `
      <a class="photo-card" href="${img.largeImageURL}">
        <img src="${img.webformatURL}" alt="${img.tags}" loading="lazy" />
        <div class="info">
          <p class="info-item"><b>Likes</b><span>${img.likes}</span></p>
          <p class="info-item"><b>Views</b><span>${img.views}</span></p>
          <p class="info-item"><b>Comments</b><span>${img.comments}</span></p>
          <p class="info-item"><b>Downloads</b><span>${img.downloads}</span></p>
        </div>
      </a>`;
    })
    .join('');

  container.insertAdjacentHTML('beforeend', markup);
  ensureLightbox();
  lightbox.refresh();
}

export function clearGallery() {
  const container = document.querySelector(gallerySelector);
  if (!container) return;
  container.innerHTML = '';
}

export function showLoader() {
  const loader = document.querySelector(loaderSelector);
  if (!loader) return;
  loader.classList.add('is-visible');
}

export function hideLoader() {
  const loader = document.querySelector(loaderSelector);
  if (!loader) return;
  loader.classList.remove('is-visible');
}

export function showLoadMoreButton() {
  const btn = document.querySelector(loadMoreSelector);
  if (!btn) return;
  btn.classList.add('is-visible');
}

export function hideLoadMoreButton() {
  const btn = document.querySelector(loadMoreSelector);
  if (!btn) return;
  btn.classList.remove('is-visible');
}
