// Navigation Functionality
class Navigation {
    constructor() {
        // Element references
        this.mobileMenuToggle = document.getElementById('mobile-menu-toggle');
        this.closeMenu = document.getElementById('close-menu');
        this.overlay = document.getElementById('overlay');
        this.mobileNavMenu = document.getElementById('mobile-nav-menu');
        this.mobileSearchToggle = document.getElementById('mobile-search-toggle');
        this.mobileSearch = document.getElementById('mobile-search');
        this.searchForms = document.querySelectorAll('.search-bar');
        this.cartBtn = document.getElementById('cart-btn');
        this.cartCountElement = document.querySelector('.cart-count');

        // State
        this.mobileMenuOpen = false;
        this.mobileSearchOpen = false;
        this.cartCount = 0;
    }
    
    bindEvents() {
        // Mobile menu toggle
        if (this.mobileMenuToggle) {
            this.mobileMenuToggle.addEventListener('click', () => this.toggleMobileMenu());
        }
        
        if (this.closeMenu) {
            this.closeMenu.addEventListener('click', () => this.closeMobileMenu());
        }
        
        if (this.overlay) {
            this.overlay.addEventListener('click', () => {
                this.closeMobileMenu();
                this.closeMobileSearch();
            });
        }
        
        // Mobile search toggle
        if (this.mobileSearchToggle) {
            this.mobileSearchToggle.addEventListener('click', () => this.toggleMobileSearch());
        }
        
        // Search functionality
        this.searchForms.forEach(form => {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                const searchInput = form.querySelector('.search-input');
                const searchTerm = searchInput.value.trim();
                
                if (searchTerm) {
                    this.performSearch(searchTerm);
                    searchInput.value = '';
                    if (this.mobileSearchOpen) this.closeMobileSearch();
                }
            });
        });
        
        // Close mobile search when clicking outside on mobile
        document.addEventListener('click', (e) => {
            if (this.mobileSearch && this.mobileSearchToggle &&
                !this.mobileSearch.contains(e.target) &&
                !this.mobileSearchToggle.contains(e.target) &&
                this.mobileSearchOpen) {
                this.closeMobileSearch();
            }
        });
        
        // Handle window resize
        window.addEventListener('resize', () => this.handleResize());

        // Cart button
        if (this.cartBtn) {
            this.cartBtn.addEventListener('click', () => this.handleCartClick());
        }
    }
    
    toggleMobileMenu() {
        this.mobileMenuOpen ? this.closeMobileMenu() : this.openMobileMenu();
    }
    
    openMobileMenu() {
        if (!this.mobileNavMenu || !this.overlay || !this.mobileMenuToggle) return;
        this.mobileNavMenu.classList.add('active');
        this.overlay.classList.add('active');
        this.mobileMenuToggle.classList.add('active');
        this.mobileMenuOpen = true;
        document.body.style.overflow = 'hidden';
    }
    
    closeMobileMenu() {
        if (!this.mobileNavMenu || !this.overlay || !this.mobileMenuToggle) return;
        this.mobileNavMenu.classList.remove('active');
        this.overlay.classList.remove('active');
        this.mobileMenuToggle.classList.remove('active');
        this.mobileMenuOpen = false;
        document.body.style.overflow = '';
    }
    
    toggleMobileSearch() {
        this.mobileSearchOpen ? this.closeMobileSearch() : this.openMobileSearch();
    }
    
    openMobileSearch() {
        if (!this.mobileSearch) return;
        this.mobileSearch.classList.add('active');
        this.mobileSearchOpen = true;
        
        // Focus on search input
        const searchInput = this.mobileSearch.querySelector('.search-input');
        if (searchInput) {
            setTimeout(() => searchInput.focus(), 100);
        }
    }
    
    closeMobileSearch() {
        if (!this.mobileSearch) return;
        this.mobileSearch.classList.remove('active');
        this.mobileSearchOpen = false;
    }
    
    performSearch(searchTerm) {
        console.log(`Performing search for: ${searchTerm}`);
        // In a real implementation, this would redirect to a search results page
        this.showSearchFeedback(searchTerm);
    }
    
    showSearchFeedback(searchTerm) {
        const feedback = document.createElement('div');
        feedback.textContent = `Searching for "${searchTerm}"...`;
        feedback.style.cssText = `
            position: fixed;
            top: 80px;
            left: 50%;
            transform: translateX(-50%);
            background: var(--accent-gold, #c5a774);
            color: white;
            padding: 0.8rem 1.5rem;
            border-radius: 50px;
            font-weight: 500;
            z-index: 1002;
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
            opacity: 1;
            transition: opacity 0.3s ease;
        `;
        
        document.body.appendChild(feedback);
        
        setTimeout(() => {
            feedback.style.opacity = '0';
            feedback.addEventListener('transitionend', () => feedback.remove());
        }, 2000);
    }
    
    handleCartClick() {
        console.log('Cart clicked - items in cart:', this.cartCount);
        // In a real implementation, this would open a cart modal/sidebar.
        if (this.cartCount === 0) {
            alert('Your cart is empty');
        } else {
            alert(`You have ${this.cartCount} item${this.cartCount > 1 ? 's' : ''} in your cart`);
        }
    }
    
    updateCartCount() {
        if (this.cartCountElement) {
            this.cartCountElement.textContent = this.cartCount;
        }
    }
    
    addToCart(product) {
        this.cartCount++;
        this.updateCartCount();
        console.log(`Added to cart: ${product}`);
    }
    
    handleResize() {
        // Close mobile menu and search when resizing to desktop
        if (window.innerWidth > 768) {
            if (this.mobileMenuOpen) {
                this.closeMobileMenu();
            }
            if (this.mobileSearchOpen) {
                this.closeMobileSearch();
            }
        }
    }
}

// Hero Section Orbital System
class HeroOrbital {
    constructor() {
        this.currentProduct = 'celestial-pendant';
        this.rotationInterval = null;
        this.rotationTime = 3000; // 3 seconds
        this.isAnimating = false;
        this.products = [
            { id: 'celestial-pendant', name: 'Celestial Pendant', price: '$2,800', image: 'others-icon.png' },
            { id: 'bridal-necklace', name: 'Bridal Necklace', price: '$3,200', image: 'Necklace-icon.png' },
            { id: 'eternity-bracelet', name: 'Eternity Bracelet', price: '$1,950', image: 'rings-icon.png' },
            { id: 'infinity-earrings', name: 'Infinity Earrings', price: '$2,500', image: 'Necklace-icon.png' },
            { id: 'luxury-watch', name: 'Luxury Watch', price: '$4,500', image: 'watches-icon.png' },
            { id: 'gemstone-ring', name: 'Gemstone Ring', price: '$3,100', image: 'rings-icon.png' }
        ];
        
        // Element references
        this.centralImage = document.getElementById('central-product-image');
        this.navDots = document.querySelectorAll('.orbit-nav .nav-dot');
        this.orbitingProducts = document.querySelectorAll('.orbiting-product');
        this.orbitalSystem = document.querySelector('.orbital-system');
    }
    
    setActiveProduct(productId) {
        if (this.isAnimating || this.currentProduct === productId) return;
        
        this.isAnimating = true;
        this.currentProduct = productId;
        
        // Update central product
        this.updateCentralProduct(productId);
        
        // Update navigation dots
        this.updateNavigationDots(productId);
        
        // Update orbiting items highlight
        this.updateOrbitingItems(productId);
        
        // Reset animation flag after transition
        setTimeout(() => {
            this.isAnimating = false;
        }, 800);
    }
    
    updateCentralProduct(productId) {
        const productData = this.products.find(p => p.id === productId);
        if (!productData || !this.centralImage) return;

        // Fade out current content
        this.centralImage.style.opacity = 0;

        // Wait for fade out, then update and fade in
        setTimeout(() => {
            // Update content
            this.centralImage.src = productData.image;
            this.centralImage.alt = productData.name;

            // Fade in new content
            this.centralImage.style.opacity = 1;
        }, 400); // This should match the transition duration in CSS
    }
    
    updateNavigationDots(productId) {
        const navDots = document.querySelectorAll('.nav-dot');
        
        navDots.forEach(dot => {
            dot.classList.remove('active');
            if (dot.getAttribute('data-target') === productId) {
                dot.classList.add('active');
            }
        });
    }
    
    updateOrbitingItems(productId) {
        this.orbitingProducts.forEach(product => {
            const isActive = product.getAttribute('data-target') === productId;
            product.classList.toggle('active', isActive);
            // Note: The highlight effect (box-shadow, transform) is now handled in CSS
            // via the .orbiting-product.active selector for better separation of concerns.
        });
    }
    
    startAutomaticRotation() {
        this.rotationInterval = setInterval(() => {
            this.rotateToNextProduct();
        }, this.rotationTime);
    }
    
    rotateToNextProduct() {
        const currentIndex = this.products.findIndex(p => p.id === this.currentProduct);
        const nextIndex = (currentIndex + 1) % this.products.length;
        
        this.setActiveProduct(this.products[nextIndex].id);
    }
    
    bindEvents() {
        // Navigation dots click events
        this.navDots.forEach(dot => {
            dot.addEventListener('click', (e) => {
                e.preventDefault();
                const productId = dot.getAttribute('data-target');
                this.setActiveProduct(productId);
                
                // Reset automatic rotation timer
                this.resetRotationTimer();
            });
        });
        
        // Orbiting product click events
        this.orbitingProducts.forEach(product => {
            product.addEventListener('click', (e) => {
                e.preventDefault();
                const productId = product.getAttribute('data-target');
                this.setActiveProduct(productId);
                
                // Reset automatic rotation timer
                this.resetRotationTimer();
            });
        });
        
        // CTA button events
        const heroContent = document.querySelector('.hero-content');
        if (heroContent) {
            heroContent.addEventListener('click', (e) => {
                if (!e.target.matches('.cta-button')) return;
                e.preventDefault();
                this.handleCTAClick(e.target);
            });
        }
        
        // Pause rotation on hover
        if (this.orbitalSystem) {
            this.orbitalSystem.addEventListener('mouseenter', () => this.pauseRotation());
            this.orbitalSystem.addEventListener('mouseleave', () => this.resumeRotation());
        }
        
        // Handle window resize
    }
    
    handleCTAClick(button) {
        if (button.classList.contains('primary')) {
            console.log('Primary CTA clicked - navigating to shop');
            // In real implementation: window.location.href = '/shop';
            alert('Navigating to shop collection...');
        } else if (button.classList.contains('secondary')) {
            console.log('Secondary CTA clicked - booking consultation');
            // In real implementation: open consultation modal
            alert('Opening consultation booking...');
        }
    }
    
    pauseRotation() {
        if (this.rotationInterval) {
            clearInterval(this.rotationInterval);
            this.rotationInterval = null;
        }
    }
    
    resumeRotation() {
        if (!this.rotationInterval) {
            this.startAutomaticRotation();
        }
    }
    
    resetRotationTimer() {
        this.pauseRotation();
        this.resumeRotation();
    }
}

// Promotional Spotlight Carousel
class PromoCarousel {
    constructor() {
        this.container = document.getElementById('promo-carousel-container');
        this.mainImage = document.querySelector('.promo-product-image');
        this.prevBtn = document.getElementById('promo-carousel-prev');
        this.nextBtn = document.getElementById('promo-carousel-next');
        this.promoTitle = document.getElementById('promo-product-title');
        this.promoDescription = document.getElementById('promo-product-description');
        this.promoOriginalPrice = document.getElementById('promo-original-price');
        this.promoDiscountedPrice = document.getElementById('promo-discounted-price');
        this.promoDescriptionCard = document.querySelector('.promo-description-card');
        this.promoPriceContainer = document.querySelector('.promo-price');
        this.promoDiscountText = document.querySelector('.promo-title');

        this.promoProducts = {
            'promo-pendant': { name: 'The Radiance Pendant', description: 'A stunning centerpiece crafted from 18k gold, featuring a brilliant-cut diamond that captures light from every angle.', originalPrice: '$1,200', discountedPrice: '$600', discount: '50% OFF' },
            'promo-ring': { name: 'Eternity Band', description: 'A classic symbol of endless love, this band is lined with meticulously set diamonds for a continuous sparkle.', originalPrice: '$980', discountedPrice: '$490', discount: '50% OFF' },
            'promo-bracelet': { name: 'Diamond Tennis Bracelet', description: 'An iconic piece of luxury, this bracelet features a flexible strand of dazzling diamonds, perfect for any occasion.', originalPrice: '$2,500', discountedPrice: '$1,250', discount: '50% OFF' },
            'promo-watch': { name: 'Rose Gold Timepiece', description: 'A sophisticated watch combining classic design with modern mechanics. Features a rose gold finish and diamond hour markers.', originalPrice: '$3,800', discountedPrice: '$2,280', discount: '40% OFF' },
            'promo-anklet': { name: 'Dainty Diamond Anklet', description: 'Add a touch of sparkle to your step with this delicate 14k gold anklet, adorned with a single brilliant diamond.', originalPrice: '$750', discountedPrice: '$525', discount: '30% OFF' },
            'promo-necklace': { name: 'Celestial Moon Necklace', description: 'Inspired by the night sky, this elegant necklace features a diamond-studded crescent moon and star.', originalPrice: '$1,100', discountedPrice: '$550', discount: '50% OFF' },
            'promo-ring-2': { name: 'Solitaire Ring', description: 'A timeless classic, this solitaire ring showcases a single, magnificent diamond on a polished platinum band.', originalPrice: '$4,200', discountedPrice: '$3,360', discount: '20% OFF' },
            'promo-bracelet-2': { name: 'Cuff Bracelet', description: 'A bold statement piece, this solid gold cuff is both modern and timeless, perfect for a confident look.', originalPrice: '$1,800', discountedPrice: '$1,260', discount: '30% OFF' },
            'promo-watch-2': { name: 'Chronograph Watch', description: 'A high-performance watch with a sleek black dial and stainless steel strap, designed for precision and style.', originalPrice: '$2,900', discountedPrice: '$1,450', discount: '50% OFF' },
            'promo-anklet-2': { name: 'Beaded Chain Anklet', description: 'A playful yet elegant anklet featuring a fine gold chain with delicate beading for a subtle shimmer.', originalPrice: '$600', discountedPrice: '$420', discount: '30% OFF' },
        };
        
        if (!this.container) return;

        this.items = Array.from(this.container.children);
        this.currentIndex = this.items.findIndex(item => item.classList.contains('active'));
        if (this.currentIndex === -1) this.currentIndex = 0;

        this.itemHeight = 110; // As defined in CSS
        this.gap = 16; // 1rem
        this.rotationInterval = null;
        this.rotationTime = 7000; // 7 seconds
    }

    init() {
        if (!this.container) return;
        this.updateCarousel(false); // Initial positioning without animation
        this.bindEvents();
        this.startAutomaticRotation();
    }

    updateCarousel(animate = true) {
        const offset = -this.currentIndex * (this.itemHeight + this.gap);

        this.items.forEach((item, index) => {
            const itemOffset = (index * (this.itemHeight + this.gap)) + offset;
            item.style.transition = animate ? 'transform 0.5s ease' : 'none';
            item.style.transform = `translateY(${itemOffset}px)`;
            item.classList.toggle('active', index === this.currentIndex);
        });

        // Update main image
        const activeItem = this.items[this.currentIndex];
        const activeItemImageSrc = activeItem.querySelector('img').src;
        const productId = activeItem.dataset.productId;
        const productData = this.promoProducts[productId] || Object.values(this.promoProducts)[0]; // Fallback

        // Fade out old content
        this.mainImage.style.opacity = 0;
        this.promoDescriptionCard.style.opacity = 0;
        this.promoPriceContainer.style.opacity = 0;
        this.promoDiscountText.style.opacity = 0;

        setTimeout(() => {
            // Update image
            this.mainImage.src = activeItemImageSrc;
            this.mainImage.style.opacity = 1;

            // Update text, prices, and discount
            this.promoDiscountText.textContent = productData.discount;
            this.promoTitle.textContent = productData.name;
            this.promoDescription.textContent = productData.description;
            this.promoOriginalPrice.textContent = productData.originalPrice;
            this.promoDiscountedPrice.textContent = productData.discountedPrice;
            this.promoDescriptionCard.style.opacity = 1;
            this.promoPriceContainer.style.opacity = 1;
            this.promoDiscountText.style.opacity = 1;
        }, 400); // Should match CSS transition duration
    }

    moveTo(index) {
        if (index < 0 || index >= this.items.length) return;
        this.currentIndex = index;
        this.updateCarousel();
        this.resetRotationTimer();
    }

    startAutomaticRotation() {
        this.rotationInterval = setInterval(() => {
            const nextIndex = (this.currentIndex + 1) % this.items.length;
            this.moveTo(nextIndex);
        }, this.rotationTime);
    }

    resetRotationTimer() {
        clearInterval(this.rotationInterval);
        this.startAutomaticRotation();
    }

    bindEvents() {
        this.prevBtn.addEventListener('click', () => this.moveTo((this.currentIndex - 1 + this.items.length) % this.items.length));
        this.nextBtn.addEventListener('click', () => this.moveTo((this.currentIndex + 1) % this.items.length));
        this.items.forEach((item, index) => item.addEventListener('click', () => this.moveTo(index)));
    }
}

// Product Grid Carousel
class ProductGridCarousel {
    constructor(gridId, prevId, nextId) {
        this.grid = document.getElementById(gridId);
        this.prevBtn = document.getElementById(prevId);
        this.nextBtn = document.getElementById(nextId);

        if (!this.grid || !this.prevBtn || !this.nextBtn) return;

        this.items = Array.from(this.grid.children);
        this.currentPage = 0;
        this.itemsPerPage = 0;
        this.totalPages = 0;

        this.calculateMetrics();
    }

    init() {
        if (!this.grid) return;
        this.bindEvents();
        this.update();
        window.addEventListener('resize', () => {
            this.calculateMetrics();
            this.update();
        });
    }

    calculateMetrics() {
        const gridWidth = this.grid.offsetWidth;
        const itemWidth = this.items[0] ? this.items[0].offsetWidth : 0;
        const gap = parseFloat(getComputedStyle(this.grid).gap);

        if (itemWidth > 0) {
            this.itemsPerPage = Math.round(gridWidth / (itemWidth + gap));
            this.totalPages = Math.ceil(this.items.length / this.itemsPerPage);
        }
    }

    update() {
        const offset = this.currentPage * 100;
        this.grid.style.transform = `translateX(-${offset}%)`;

        this.prevBtn.disabled = this.currentPage === 0;
        this.nextBtn.disabled = this.currentPage >= this.totalPages - 1;
    }

    bindEvents() {
        this.prevBtn.addEventListener('click', () => {
            if (this.currentPage > 0) {
                this.currentPage--;
                this.update();
            }
        });
        this.nextBtn.addEventListener('click', () => {
            if (this.currentPage < this.totalPages - 1) {
                this.currentPage++;
                this.update();
            }
        });
    }
}

// Main application entry point
class App {
    constructor() {
        this.navigation = new Navigation();
        this.hero = new HeroOrbital();
        this.promoCarousel = new PromoCarousel();
        this.mostLovedCarousel = new ProductGridCarousel('most-loved-grid', 'loved-grid-prev', 'loved-grid-next');
        this.testimonialCarousel = new ProductGridCarousel('testimonial-grid', 'testimonial-grid-prev', 'testimonial-grid-next');
    }

    init() {
        this.navigation.bindEvents();
        this.navigation.updateCartCount();

        this.hero.bindEvents();
        this.hero.setActiveProduct('celestial-pendant');
        this.hero.startAutomaticRotation();

        this.promoCarousel.init();

        this.mostLovedCarousel.init();

        this.testimonialCarousel.init();

        this.bindGlobalEvents();
    }

    bindGlobalEvents() {
        // Add scroll behavior for scroll indicator
        const scrollIndicator = document.querySelector('.scroll-indicator');
        if (scrollIndicator) {
            scrollIndicator.addEventListener('click', () => {
                window.scrollTo({
                    top: window.innerHeight,
                    behavior: 'smooth'
                });
            });
        }

        // Back to top button functionality
        const backToTopBtn = document.getElementById('back-to-top-btn');
        if (backToTopBtn) {
            window.addEventListener('scroll', () => {
                if (window.scrollY > 300) {
                    backToTopBtn.classList.add('show');
                } else {
                    backToTopBtn.classList.remove('show');
                }
            });

            backToTopBtn.addEventListener('click', () => {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            });
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const app = new App();
    app.init();

});
