// Import main scss
import './scss/app.scss';

// Import SimppleLightbox JS
import SimpleLightbox from 'simplelightbox';

// Import SimppleLightbox CSS
import 'simplelightbox/dist/simple-lightbox.min.css';

let lightbox = new SimpleLightbox('.gallery a', {
  "showCounter": false
});

console.log("App is running!");