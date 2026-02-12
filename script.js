// Mobile Navigation Toggle
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');

hamburger.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    hamburger.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        hamburger.classList.remove('active');
    });
});

// Smooth Scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offsetTop = target.offsetTop - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// Navbar scroll effect
let lastScroll = 0;
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        navbar.style.boxShadow = '0 2px 30px rgba(0, 0, 0, 0.15)';
    } else {
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    }
    
    lastScroll = currentScroll;
});

// Scroll animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe service cards
document.querySelectorAll('.service-card').forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = 'all 0.6s ease';
    observer.observe(card);
});

// Tools & Prices section - populate cards from numbered images (1.jpg, 2.png, 30_2.jpeg, etc.)
const toolsGrid = document.getElementById('toolsGrid');

if (toolsGrid) {
    // Base paths to check for numbered images (prioritize most common)
    const TOOL_IMAGE_BASE_PATHS = ['tools', 'images', '', 'img'];
    const MAX_TOOL_IMAGES = 50000; // checks 1..50000
    const EXTENSIONS = ['jpeg', 'jpg', 'png', 'JPEG', 'JPG', 'PNG'];
    // Track prices already shown so each price/image is only plotted once
    const addedPrices = new Set();
    const CONCURRENT_LIMIT = 50; // batch size for faster loading

    // Extract price number from filename (handles "30_2.jpeg" -> "30")
    const extractPrice = (fileName) => {
        const nameWithoutExt = fileName.replace(/\.[^.]+$/, '');
        // Extract number before underscore or use whole name if it's a number
        const match = nameWithoutExt.match(/^(\d+)/);
        return match ? match[1] : nameWithoutExt;
    };

    const createToolCard = (imgPath) => {
        const fileName = imgPath.split('/').pop() || '';
        const priceNumber = extractPrice(fileName);

        // Skip if this price already has a card (avoids duplicates like jpg + jpeg for same number)
        if (addedPrices.has(priceNumber)) return;
        addedPrices.add(priceNumber);

        const card = document.createElement('div');
        card.className = 'tool-card';
        card.innerHTML = `
            <div class="tool-image">
                <img src="${imgPath}" alt="₹${priceNumber}" loading="lazy">
            </div>
            <p class="tool-price">₹${priceNumber}</p>
        `;
        toolsGrid.appendChild(card);

        // Prepare for scroll animation
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'all 0.6s ease';
        observer.observe(card);
    };

    // Optimized batch loading with concurrency limit
    const tryLoadImage = (imgPath) => {
        return new Promise((resolve) => {
            const img = new Image();
            img.onload = () => {
                createToolCard(imgPath);
                resolve(true);
            };
            img.onerror = () => resolve(false);
            img.src = imgPath;
        });
    };

    // Generate all possible image paths for a given number (handles 30.jpeg, 30_1.jpeg, 30_2.jpeg, etc.)
    const generateImagePaths = (index, basePath) => {
        const prefix = basePath ? `${basePath}/` : '';
        const paths = [];
        
        // Try exact match: 30.jpeg
        EXTENSIONS.forEach(ext => {
            paths.push(`${prefix}${index}.${ext}`);
        });
        
        // Try underscore patterns: 30_1.jpeg, 30_2.jpeg, ... 30_99.jpeg
        for (let suffix = 1; suffix <= 99; suffix++) {
            EXTENSIONS.forEach(ext => {
                paths.push(`${prefix}${index}_${suffix}.${ext}`);
            });
        }
        
        return paths;
    };

    // Batch processing for faster loading
    const loadBatch = async (start, end) => {
        const promises = [];
        for (let i = start; i <= end && i <= MAX_TOOL_IMAGES; i++) {
            TOOL_IMAGE_BASE_PATHS.forEach(basePath => {
                const imagePaths = generateImagePaths(i, basePath);
                imagePaths.forEach(imgPath => {
                    promises.push(tryLoadImage(imgPath));
                });
            });
        }
        await Promise.all(promises);
    };

    // Process in batches to avoid overwhelming the browser
    (async () => {
        for (let start = 1; start <= MAX_TOOL_IMAGES; start += CONCURRENT_LIMIT) {
            const end = Math.min(start + CONCURRENT_LIMIT - 1, MAX_TOOL_IMAGES);
            await loadBatch(start, end);
            // Small delay to keep UI responsive
            await new Promise(resolve => setTimeout(resolve, 10));
        }
    })();
}

// Observe gallery items + click-to-view full-image preview
const galleryItems = document.querySelectorAll('.gallery-item');
const galleryPreviewWrapper = document.querySelector('.gallery-preview');
const galleryPreviewImg = galleryPreviewWrapper ? galleryPreviewWrapper.querySelector('img') : null;

galleryItems.forEach(item => {
    item.style.opacity = '0';
    item.style.transform = 'translateY(30px)';
    item.style.transition = 'all 0.6s ease';
    observer.observe(item);

    const img = item.querySelector('img');
    if (img && galleryPreviewWrapper && galleryPreviewImg) {
        // On click, show the clicked image in the large preview
        img.addEventListener('click', () => {
            galleryPreviewImg.src = img.src;
            galleryPreviewImg.alt = img.alt || 'Gallery preview image';
            galleryPreviewWrapper.classList.add('active');
        });
    }
});

// Hide preview when clicking on the preview area itself
if (galleryPreviewWrapper) {
    galleryPreviewWrapper.addEventListener('click', () => {
        galleryPreviewWrapper.classList.remove('active');
    });
}


// Add animation to scroll indicator
const scrollIndicator = document.querySelector('.scroll-indicator');
if (scrollIndicator) {
    scrollIndicator.addEventListener('click', () => {
        document.querySelector('#services').scrollIntoView({
            behavior: 'smooth'
        });
    });
}

// Add fade-in animation on scroll for about section
const aboutSection = document.querySelector('.about');
if (aboutSection) {
    const aboutObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.2 });
    
    aboutSection.style.opacity = '0';
    aboutSection.style.transform = 'translateY(30px)';
    aboutSection.style.transition = 'all 0.8s ease';
    aboutObserver.observe(aboutSection);
}

// Add animation to contact section
const contactSection = document.querySelector('.contact');
if (contactSection) {
    const contactObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.2 });
    
    contactSection.style.opacity = '0';
    contactSection.style.transform = 'translateY(30px)';
    contactSection.style.transition = 'all 0.8s ease';
    contactObserver.observe(contactSection);
}

// Make entire location block clickable to open Google Maps
const locationItem = document.querySelector('.location-item');
if (locationItem) {
    locationItem.addEventListener('click', () => {
        window.open('https://maps.app.goo.gl/T9gaqaSRn9TTaMBS7', '_blank');
    });
}
