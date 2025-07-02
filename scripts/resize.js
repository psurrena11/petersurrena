let lightboxInstance = null; // Declare a variable to hold the lightbox instance

function manageLinksAndLightbox() {
    const mediaQuery = window.matchMedia('(max-width: 768px)');
    const links = document.querySelectorAll('.project_thumbs a');

    // IMPORTANT: Store original href values. Add data-original-href to your HTML links.
    // Example HTML: <a href="img/large-image.jpg" data-original-href="img/large-image.jpg" data-lightbox="gallery">

    function updateLinksAndLightbox() {
        if (mediaQuery.matches) { // If it's a mobile screen (<= 768px)
            // 1. Destroy existing lightbox instance if it exists
            if (lightboxInstance) {
                lightboxInstance.destroy();
                lightboxInstance = null; // Clear the instance
            }

            // 2. Modify links for mobile behavior (e.g., enable anchor links, disable lightbox)
            links.forEach(link => {
                // Restore original href if it was an anchor link, otherwise set to '#' if it was only for lightbox
                const originalHref = link.getAttribute('data-original-href');
                if (originalHref) {
                    link.setAttribute('href', originalHref); // Use the stored original href
                } else {
                    link.setAttribute('href', '#'); // Fallback if no original-href was stored
                }
                link.removeAttribute('data-lightbox'); // Ensure SimpleLightbox ignores it
            });

        } else { // If it's a desktop screen (> 768px)
            // 1. Revert links for desktop behavior (re-enable lightbox, ensure correct href for lightbox)
            links.forEach(link => {
                const originalHref = link.getAttribute('data-original-href');
                if (originalHref) {
                    link.setAttribute('href', originalHref); // Restore original for lightbox/navigation
                }
                link.setAttribute('data-lightbox', 'gallery'); // Re-add data-lightbox
            });

            // 2. Initialize SimpleLightbox if it doesn't already exist
            if (!lightboxInstance) {
                lightboxInstance = new SimpleLightbox('.gallery-item a', {
                    overlayOpacity: 0.9,
                    disableRightClick: true
                });
            } else {
                // If instance exists (e.g., from a resize from mobile to desktop, but then back and forth)
                // We just need to refresh it to pick up any new `data-lightbox` attributes
                lightboxInstance.refresh();
            }
        }
    }

    // Initial call when the script loads or DOM is ready
    updateLinksAndLightbox();

    // Listen for changes in screen size
    mediaQuery.addEventListener('change', updateLinksAndLightbox);
}

// Call the main function when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', manageLinksAndLightbox);