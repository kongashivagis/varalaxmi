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
