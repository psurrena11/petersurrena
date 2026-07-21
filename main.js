// Import main scss
import './scss/app.scss';

// Import SimpleLightbox JS
import SimpleLightbox from 'simplelightbox';

// Import SimpleLightbox CSS
import 'simplelightbox/dist/simple-lightbox.min.css';

const lightbox = new SimpleLightbox('.gallery a', {
  "showCounter": false,
  "overlayOpacity": 0.85
});