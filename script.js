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
        this.toastNotification = document.getElementById('toast-notification');
        this.cartCountElement = document.querySelector('.cart-count');
        this.wishlistBtn = document.getElementById('wishlist-btn');
        this.wishlistCountElement = document.querySelector('.wishlist-count');

        // State
        this.mobileMenuOpen = false;
        this.mobileSearchOpen = false;
        this.cartCount = 0;
        this.wishlistCount = 0;
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

        // Mobile dropdown toggles
        document.querySelectorAll('.mobile-nav-item').forEach(item => {
            const toggle = item.querySelector('.mobile-dropdown-toggle');
            if (toggle) {
                toggle.addEventListener('click', (e) => {
                    e.preventDefault();
                    item.classList.toggle('active');
                });
            }
        });
        
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
                    window.location.href = `shop.html?search=${encodeURIComponent(searchTerm)}`;
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
        
        // Wishlist button
        if (this.wishlistBtn) {
            this.wishlistBtn.addEventListener('click', () => this.handleWishlistClick());
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
        
        // Close all dropdowns
        document.querySelectorAll('.mobile-nav-item .dropdown-toggle').forEach(toggle => {
            toggle.classList.remove('active');
            const dropdownMenu = toggle.nextElementSibling;
            dropdownMenu.style.maxHeight = null;
        });
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
    
    showToast(message) {
        if (!this.toastNotification) return;
        this.toastNotification.textContent = message;
        this.toastNotification.classList.add('show');
        setTimeout(() => {
            this.toastNotification.classList.remove('show');
        }, 3000);
    }
    
    handleCartClick() {
        window.location.href = 'cart.html';
    }
    
    handleWishlistClick() {
        this.showToast('Wishlist page coming soon!');
    }

    updateCartCount() {
        const cart = JSON.parse(localStorage.getItem('luxtiveCart')) || [];
        this.cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
        if (this.cartCountElement) {
            this.cartCountElement.textContent = this.cartCount;
            this.cartCountElement.style.display = this.cartCount > 0 ? 'flex' : 'none';
        }
    }

    updateWishlistCount() {
        const wishlist = JSON.parse(localStorage.getItem('luxtiveWishlist')) || [];
        this.wishlistCount = wishlist.length;
        if (this.wishlistCountElement) {
            this.wishlistCountElement.textContent = this.wishlistCount;
            this.wishlistCountElement.style.display = this.wishlistCount > 0 ? 'flex' : 'none';
        }
    }
    
    addToCart(product) {
        let cart = JSON.parse(localStorage.getItem('luxtiveCart')) || [];
        const existingItem = cart.find(item => item.id === product.id);

        if (existingItem) {
            existingItem.quantity++;
        } else {
            cart.push({ ...product, quantity: 1 });
        }
        localStorage.setItem('luxtiveCart', JSON.stringify(cart));
        this.updateCartCount();
        this.showToast(`${product.name} has been added to your cart!`);
    }

    toggleWishlist(product, button) {
        let wishlist = JSON.parse(localStorage.getItem('luxtiveWishlist')) || [];
        const existingItemIndex = wishlist.findIndex(item => item.id === product.id);

        if (existingItemIndex > -1) {
            wishlist.splice(existingItemIndex, 1);
            this.showToast(`${product.name} removed from wishlist.`);
            button.innerHTML = '<i class="far fa-heart"></i>';
        } else {
            wishlist.push(product);
            this.showToast(`${product.name} added to wishlist!`);
            button.innerHTML = '<i class="fas fa-heart"></i>';
        }

        localStorage.setItem('luxtiveWishlist', JSON.stringify(wishlist));
        this.updateWishlistCount();
    }
    
    handleResize() {
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
        this.rotationTime = 3000;
        this.isAnimating = false;
        this.products = [
            { id: 'celestial-pendant', name: 'Celestial Pendant', price: '$2,800', image: 'images/others-icon.png' },
            { id: 'bridal-necklace', name: 'Bridal Necklace', price: '$3,200', image: 'images/Necklace-icon.png' },
            { id: 'eternity-bracelet', name: 'Eternity Bracelet', price: '$1,950', image: 'images/rings-icon.png' },
            { id: 'infinity-earrings', name: 'Infinity Earrings', price: '$2,500', image: 'images/Necklace-icon.png' },
            { id: 'gemstone-ring', name: 'Gemstone Ring', price: '$3,100', image: 'images/rings-icon.png' }
        ];
        
        this.centralImage = document.getElementById('central-product-image');
        this.centralImageDesktop = document.getElementById('central-product-image-desktop');
        this.navDots = document.querySelectorAll('.orbit-nav .nav-dot');
        this.orbitingProducts = document.querySelectorAll('.orbiting-product');
        this.orbitalSystem = document.querySelector('.orbital-system');
    }
    
    setActiveProduct(productId) {
        if (this.isAnimating || this.currentProduct === productId) return;
        
        this.isAnimating = true;
        this.currentProduct = productId;
        
        this.updateCentralProduct(productId);
        this.updateNavigationDots(productId);
        this.updateOrbitingItems(productId);
        
        setTimeout(() => {
            this.isAnimating = false;
        }, 800);
    }
    
    updateCentralProduct(productId) {
        const productData = this.products.find(p => p.id === productId);
        if (!productData) return;

        // Update mobile image
        if (this.centralImage) {
            this.centralImage.style.opacity = 0;
            setTimeout(() => {
                this.centralImage.src = productData.image;
                this.centralImage.alt = productData.name;
                this.centralImage.style.opacity = 1;
            }, 400);
        }

        // Update desktop image
        if (this.centralImageDesktop) {
            this.centralImageDesktop.style.opacity = 0;
            setTimeout(() => {
                this.centralImageDesktop.src = productData.image;
                this.centralImageDesktop.alt = productData.name;
                this.centralImageDesktop.style.opacity = 1;
            }, 400);
        }
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
                this.resetRotationTimer();
            });
        });
        
        // Orbiting product click events
        this.orbitingProducts.forEach(product => {
            product.addEventListener('click', (e) => {
                e.preventDefault();
                const productId = product.getAttribute('data-target');
                this.setActiveProduct(productId);
                this.resetRotationTimer();
            });
        });
        
        // CTA button events
        const heroShopBtn = document.getElementById('hero-shop-collection');
        const heroConsultBtn = document.getElementById('hero-book-consultation');
        const heroShopBtnDesktop = document.getElementById('hero-shop-collection-desktop');
        const heroConsultBtnDesktop = document.getElementById('hero-book-consultation-desktop');
        
        if (heroShopBtn) {
            heroShopBtn.addEventListener('click', () => {
                window.location.href = 'shop.html';
            });
        }
        
        if (heroConsultBtn) {
            heroConsultBtn.addEventListener('click', () => {
                this.showConsultationModal();
            });
        }

        if (heroShopBtnDesktop) {
            heroShopBtnDesktop.addEventListener('click', () => {
                window.location.href = 'shop.html';
            });
        }
        
        if (heroConsultBtnDesktop) {
            heroConsultBtnDesktop.addEventListener('click', () => {
                this.showConsultationModal();
            });
        }
        
        // Pause rotation on hover
        if (this.orbitalSystem) {
            this.orbitalSystem.addEventListener('mouseenter', () => this.pauseRotation());
            this.orbitalSystem.addEventListener('mouseleave', () => this.resumeRotation());
        }
    }
    
    showConsultationModal() {
        alert('Consultation booking feature coming soon! We will connect you with our jewelry experts.');
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

        this.promoProducts = [];
        if (!this.container) return;

        this.items = Array.from(this.container.children);
        this.currentIndex = 0;
        this.rotationInterval = null;
        this.rotationTime = 7000;
    }

    init(promoProducts) {
        if (!this.container) return;
        this.promoProducts = promoProducts;
        if (this.promoProducts.length === 0) return;

        this.container.innerHTML = this.promoProducts.map(p => `<div class="carousel-item" data-product-id="${p.id}"><img src="${p.image_url}" alt="${p.name}"></div>`).join('');
        this.items = Array.from(this.container.children);
        this.currentIndex = 0;
        this.updateCarousel(false);
        this.bindEvents();
        this.startAutomaticRotation();
    }

    updateCarousel(animate = true) {
        // Remove active class from all items
        this.items.forEach(item => item.classList.remove('active'));
        
        // Add active class to current item
        if (this.items[this.currentIndex]) {
            this.items[this.currentIndex].classList.add('active');
        }

        // Calculate transform for horizontal scrolling
        const itemWidth = this.items[0] ? this.items[0].offsetWidth + 16 : 116; // 116px (100px + 16px gap)
        const offset = -this.currentIndex * itemWidth;
        
        if (animate) {
            this.container.style.transition = 'transform 0.5s ease';
        } else {
            this.container.style.transition = 'none';
        }
        
        this.container.style.transform = `translateX(${offset}px)`;

        // Update main content
        const activeItem = this.items[this.currentIndex];
        if (!activeItem) return;

        const activeItemImageSrc = activeItem.querySelector('img').src;
        const productId = parseInt(activeItem.dataset.productId);
        const productData = this.promoProducts[productId] || Object.values(this.promoProducts)[0];

        if (!productData) return;

        // Fade out content
        if (this.mainImage) this.mainImage.style.opacity = 0;
        if (this.promoDescriptionCard) this.promoDescriptionCard.style.opacity = 0;
        if (this.promoPriceContainer) this.promoPriceContainer.style.opacity = 0;
        if (this.promoDiscountText) this.promoDiscountText.style.opacity = 0;

        setTimeout(() => {
            // Update image
            if (this.mainImage) {
                this.mainImage.src = activeItemImageSrc;
                this.mainImage.style.opacity = 1;
            }

            // Update text content
            if (productData.price && productData.promo_price) {
                const discountPercentage = Math.round(((productData.price - productData.promo_price) / productData.price) * 100);
                if (this.promoDiscountText) this.promoDiscountText.textContent = `${discountPercentage}% OFF`;
            }
            
            if (this.promoTitle) this.promoTitle.textContent = productData.name;
            if (this.promoDescription) this.promoDescription.textContent = productData.description;
            
            if (this.promoOriginalPrice) {
                this.promoOriginalPrice.textContent = `$${parseFloat(productData.price).toFixed(2)}`;
            }
            
            if (this.promoDiscountedPrice) {
                this.promoDiscountedPrice.textContent = `$${parseFloat(productData.promo_price).toFixed(2)}`;
            }
            
            if (this.promoDescriptionCard) this.promoDescriptionCard.style.opacity = 1;
            if (this.promoPriceContainer) this.promoPriceContainer.style.opacity = 1;
            if (this.promoDiscountText) this.promoDiscountText.style.opacity = 1;
        }, 400);
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
        if (this.rotationInterval) {
            clearInterval(this.rotationInterval);
            this.startAutomaticRotation();
        }
    }

    bindEvents() {
        if (this.prevBtn) {
            this.prevBtn.addEventListener('click', () => this.moveTo((this.currentIndex - 1 + this.items.length) % this.items.length));
        }
        
        if (this.nextBtn) {
            this.nextBtn.addEventListener('click', () => this.moveTo((this.currentIndex + 1) % this.items.length));
        }
        
        this.items.forEach((item, index) => {
            item.addEventListener('click', () => this.moveTo(index));
        });
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
            this.itemsPerPage = Math.floor(gridWidth / (itemWidth + gap));
            this.totalPages = Math.ceil(this.items.length / this.itemsPerPage);
        } else {
            // Fallback for mobile
            this.itemsPerPage = 1;
            this.totalPages = this.items.length;
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

// Testimonial Slider
class TestimonialSlider {
    constructor(gridId, prevId, nextId) {
        this.grid = document.getElementById(gridId);
        this.prevBtn = document.getElementById(prevId);
        this.nextBtn = document.getElementById(nextId);

        if (!this.grid || !this.prevBtn || !this.nextBtn) return;

        this.items = Array.from(this.grid.children);
        this.currentIndex = 0;
        this.rotationInterval = null;
        this.rotationTime = 5000;
    }

    init() {
        if (!this.grid) return;
        this.bindEvents();
        this.update();
        this.startAutomaticRotation();
    }

    update() {
        this.items.forEach((item, index) => {
            item.classList.remove('active');
        });
        
        if (this.items[this.currentIndex]) {
            this.items[this.currentIndex].classList.add('active');
        }
    }

    moveTo(index) {
        this.currentIndex = index;
        if (this.currentIndex < 0) {
            this.currentIndex = this.items.length - 1;
        } else if (this.currentIndex >= this.items.length) {
            this.currentIndex = 0;
        }
        this.update();
        this.resetRotationTimer();
    }

    startAutomaticRotation() {
        this.rotationInterval = setInterval(() => {
            this.moveTo(this.currentIndex + 1);
        }, this.rotationTime);
    }

    resetRotationTimer() {
        if (this.rotationInterval) {
            clearInterval(this.rotationInterval);
            this.startAutomaticRotation();
        }
    }

    bindEvents() {
        this.prevBtn.addEventListener('click', () => this.moveTo(this.currentIndex - 1));
        this.nextBtn.addEventListener('click', () => this.moveTo(this.currentIndex + 1));
    }
}

// Main application entry point
class App {
    constructor() {
        this.navigation = new Navigation();
        this.hero = new HeroOrbital();
        this.promoCarousel = new PromoCarousel();
        this.mostLovedCarousel = new ProductGridCarousel('most-loved-grid', 'loved-grid-prev', 'loved-grid-next');
        this.testimonialSlider = new TestimonialSlider('testimonial-grid', 'testimonial-grid-prev', 'testimonial-grid-next');
        this.newArrivalsCarousel = null;
    }

    init() {
        this.navigation.bindEvents();
        this.navigation.updateCartCount();
        this.navigation.updateWishlistCount();

        this.hero.bindEvents();
        this.hero.setActiveProduct('celestial-pendant');
        this.hero.startAutomaticRotation();
        
        this.testimonialSlider.init();

        this.initializeDynamicSections();
        this.bindGlobalEvents();
        this.bindButtonEvents();
    }

    bindButtonEvents() {
        // Explore Now button
        const exploreBtn = document.getElementById('explore-now-btn');
        if (exploreBtn) {
            exploreBtn.addEventListener('click', () => {
                window.location.href = 'shop.html';
            });
        }

        // View All New button
        const viewAllBtn = document.getElementById('view-all-new-btn');
        if (viewAllBtn) {
            viewAllBtn.addEventListener('click', () => {
                window.location.href = 'shop.html?sort=newest';
            });
        }

        // Newsletter form
        const newsletterForm = document.getElementById('newsletter-form');
        if (newsletterForm) {
            newsletterForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const emailInput = newsletterForm.querySelector('input[type="email"]');
                const email = emailInput.value.trim();
                
                if (email) {
                    this.handleNewsletterSignup(email);
                    emailInput.value = '';
                }
            });
        }
    }

    handleNewsletterSignup(email) {
        // Simulate newsletter signup
        this.navigation.showToast('Thank you for subscribing to our newsletter!');
        
        // In a real application, you would send this to your backend
        console.log('Newsletter signup:', email);
        
        // You could add AJAX call here to submit to your server
        /*
        fetch('/api/newsletter', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email: email })
        })
        .then(response => response.json())
        .then(data => {
            this.navigation.showToast('Thank you for subscribing!');
        })
        .catch(error => {
            console.error('Error:', error);
            this.navigation.showToast('Subscription failed. Please try again.');
        });
        */
    }

    bindGlobalEvents() {
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

        // Add to Cart and Overview listeners using event delegation
        document.body.addEventListener('click', (e) => {
            // Add to Cart
            if (e.target.classList.contains('js-add-to-cart') || e.target.closest('.js-add-to-cart')) {
                const button = e.target.classList.contains('js-add-to-cart') ? e.target : e.target.closest('.js-add-to-cart');
                const card = button.closest('.product-card, .promo-content');
                if (card) {
                    let product;
                    
                    if (card.classList.contains('promo-content')) {
                        // Promo product
                        const currentPromoProduct = this.promoCarousel.promoProducts[this.promoCarousel.currentIndex];
                        if (currentPromoProduct) {
                            product = {
                                id: button.dataset.productId,
                                name: currentPromoProduct.name,
                                price: parseFloat(currentPromoProduct.promo_price),
                                image_url: currentPromoProduct.image_url,
                                metal: 'Mixed'
                            };
                        }
                    } else {
                        // Regular product card
                        product = {
                            id: button.dataset.productId,
                            name: card.dataset.name,
                            price: parseFloat(card.dataset.price),
                            image_url: card.dataset.image,
                            metal: card.dataset.metal || 'Mixed'
                        };
                    }
                    
                    if (product) {
                        this.navigation.addToCart(product);
                    }
                }
            }

            // Overview Modal
            if (e.target.closest('.overview-btn')) {
                const card = e.target.closest('.product-card');
                this.openQuickView(card);
            }

            // Wishlist Toggle
            if (e.target.closest('.wishlist-btn')) {
                const button = e.target.closest('.wishlist-btn');
                const card = button.closest('.product-card');
                if (card) {
                    const product = {
                        id: card.querySelector('.js-add-to-cart').dataset.productId,
                        name: card.dataset.name,
                        price: parseFloat(card.dataset.price),
                        image_url: card.dataset.image,
                        metal: card.dataset.metal
                    };
                    this.navigation.toggleWishlist(product, button);
                }
                e.preventDefault();
            }

            // Close modal
            if (e.target.classList.contains('close-modal') || e.target.closest('.close-modal')) {
                const closeBtn = e.target.classList.contains('close-modal') ? e.target : e.target.closest('.close-modal');
                const modal = closeBtn.closest('.quick-view-modal');
                if (modal) {
                    modal.classList.remove('active');
                }
            }
        });

        // Close modal when clicking outside
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('quick-view-modal')) {
                e.target.classList.remove('active');
            }
        });
    }

    async initializeDynamicSections() {
        try {
            // Show loading states
            this.showLoadingStates();
            
            const response = await fetch('../Admin/get_products.php');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            
            const products = await response.json();

            // 1. Populate New Arrivals
            const newArrivals = products
                .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
                .slice(0, 10);
            const newArrivalsGrid = document.getElementById('new-arrivals-grid');
            if (newArrivalsGrid) {
                newArrivalsGrid.innerHTML = newArrivals.map(p => this.createProductCardHTML(p)).join('');
                this.newArrivalsCarousel = new ProductGridCarousel('new-arrivals-grid', 'new-arrivals-prev', 'new-arrivals-next');
                this.newArrivalsCarousel.init();
            }

            // 2. Populate Most Loved Pieces
            const mostLoved = products
                .filter(p => p.featured || p.bestseller)
                .slice(0, 10);
            const mostLovedGrid = document.getElementById('most-loved-grid');
            if (mostLovedGrid) {
                mostLovedGrid.innerHTML = mostLoved.map(p => this.createProductCardHTML(p)).join('');
                this.mostLovedCarousel.init();
            }

            // 3. Populate Promotional Spotlight
            const promoProducts = products.filter(p => p.promo_price && p.promo_price > 0);
            if (promoProducts.length > 0) {
                this.promoCarousel.init(promoProducts);
            }

        } catch (error) {
            console.error("Could not fetch and render dynamic products:", error);
            this.showErrorState();
        } finally {
            this.hideLoadingStates();
        }
    }

    showLoadingStates() {
        const grids = ['new-arrivals-grid', 'most-loved-grid', 'promo-carousel-container'];
        grids.forEach(gridId => {
            const grid = document.getElementById(gridId);
            if (grid) {
                grid.classList.add('loading');
            }
        });
    }

    hideLoadingStates() {
        const grids = ['new-arrivals-grid', 'most-loved-grid', 'promo-carousel-container'];
        grids.forEach(gridId => {
            const grid = document.getElementById(gridId);
            if (grid) {
                grid.classList.remove('loading');
            }
        });
    }

    showErrorState() {
        const grids = [
            { id: 'new-arrivals-grid', message: 'Unable to load new arrivals.' },
            { id: 'most-loved-grid', message: 'Unable to load most loved products.' },
            { id: 'promo-carousel-container', message: 'Unable to load promotional products.' }
        ];
        
        grids.forEach(({ id, message }) => {
            const grid = document.getElementById(id);
            if (grid) {
                grid.innerHTML = `
                    <div class="error-state" style="text-align: center; padding: 2rem; color: var(--text-light);">
                        <p>${message}</p>
                        <button class="cta-button secondary" onclick="location.reload()" style="margin-top: 1rem;">
                            Try Again
                        </button>
                    </div>
                `;
            }
        });
    }

    openQuickView(productCard) {
        const quickViewModal = document.getElementById('quick-view-modal');
        const quickViewModalBody = document.getElementById('modal-body');
        if (!productCard || !quickViewModal || !quickViewModalBody) return;

        const data = productCard.dataset;
        const priceHTML = productCard.querySelector('.product-price').innerHTML;

        const variations = data.variations ? JSON.parse(data.variations) : [{
            id: data.productId,
            name: 'Default',
            image_url: data.image,
            price: data.price
        }];

        const modalContentHTML = `
            <div class="modal-image-gallery">
                <img src="${variations[0].image_url}" alt="${data.name}" id="modal-main-image">
                ${variations.length > 1 ? `
                    <div class="modal-thumbnails">
                        ${variations.slice(0, 4).map((v, index) => `
                            <img src="${v.image_url}" alt="${v.name}" class="modal-thumbnail ${index === 0 ? 'active' : ''}" data-image="${v.image_url}" data-price="${v.price}">
                        `).join('')}
                    </div>
                ` : ''}
            </div>
            <div class="modal-details">
                <h2>${data.name}</h2>
                <div class="product-meta">
                    <span>Category: ${data.category || 'N/A'}</span>
                    <span>Sub-category: ${data.subcategory || 'N/A'}</span>
                </div>
                <p class="modal-product-price" id="modal-product-price">${priceHTML}</p>
                <p class="product-description">${data.description || 'No description available.'}</p>
                <div class="product-meta">
                    <p><strong>Material:</strong> ${data.metal || 'N/A'}</p>
                </div>

                <div class="modal-actions">
                    <div class="quantity-selector">
                        <button class="quantity-btn minus-btn">-</button>
                        <input type="number" class="quantity-input" value="1" min="1">
                        <button class="quantity-btn plus-btn">+</button>
                    </div>
                    <button class="cta-button primary js-add-to-cart" data-product-id="${productCard.querySelector('.js-add-to-cart').dataset.productId}">Add to Cart</button>
                </div>
            </div>
        `;

        quickViewModalBody.innerHTML = modalContentHTML;
        quickViewModal.classList.add('active');

        this.bindModalEvents(quickViewModalBody);
    }

    bindModalEvents(modalBody) {
        const mainImage = modalBody.querySelector('#modal-main-image');
        const priceDisplay = modalBody.querySelector('#modal-product-price');

        modalBody.querySelectorAll('.modal-thumbnail').forEach(thumb => {
            thumb.addEventListener('click', () => {
                // Update main image
                mainImage.src = thumb.dataset.image;

                // Update price
                priceDisplay.textContent = `$${parseFloat(thumb.dataset.price).toFixed(2)}`;

                // Update active state
                modalBody.querySelectorAll('.modal-thumbnail').forEach(t => t.classList.remove('active'));
                thumb.classList.add('active');
            });
        });

        const quantityInput = modalBody.querySelector('.quantity-input');
        const minusBtn = modalBody.querySelector('.minus-btn');
        const plusBtn = modalBody.querySelector('.plus-btn');

        if (minusBtn && quantityInput) {
            minusBtn.addEventListener('click', () => {
                if (quantityInput.value > 1) quantityInput.value--;
            });
        }

        if (plusBtn && quantityInput) {
            plusBtn.addEventListener('click', () => {
                quantityInput.value++;
            });
        }
    }

    createProductCardHTML(product) {
        const priceHTML = product.promo_price 
            ? `<span class="original-price">$${parseFloat(product.price).toFixed(2)}</span> $${parseFloat(product.promo_price).toFixed(2)}`
            : `$${parseFloat(product.price).toFixed(2)}`;

        return `
            <div class="product-card" data-name="${product.name}" data-price="${product.promo_price || product.price}" data-image="${product.image_url}" data-metal="${product.metal || ''}" data-description="${product.description || ''}" data-category="${product.category || ''}" data-subcategory="${product.sub_category || ''}">
                <div class="product-card-image">
                    <a href="#"><img src="${product.image_url}" alt="${product.name}"></a>
                </div>
                <div class="product-card-details">
                    <h3 class="product-name"><a href="#">${product.name}</a></h3>
                    <p class="product-price">${priceHTML}</p>
                    <div class="product-card-actions">
                        <button class="cta-button tertiary wishlist-btn" aria-label="Add to Wishlist"><i class="far fa-heart"></i></button>
                        <button class="cta-button secondary js-add-to-cart" data-product-id="${product.id}" aria-label="Add to Cart"><i class="fas fa-cart-plus"></i></button>
                        <button class="cta-button tertiary overview-btn" aria-label="Overview"><i class="fas fa-eye"></i></button>
                    </div>
                </div>
            </div>
        `;
    }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    const app = new App();
    app.init();
});
