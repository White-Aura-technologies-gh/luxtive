document.addEventListener('DOMContentLoaded', () => {

    /**
     * =================================================================
     * SHARED NAVIGATION & CART LOGIC (Adapted from script.js)
     * =================================================================
     */
    class Navigation {
        constructor() {
            // Element references
            this.mobileMenuToggle = document.getElementById('mobile-menu-toggle');
            this.closeMenu = document.getElementById('close-menu');
            this.mobileNavMenu = document.getElementById('mobile-nav-menu');
            this.mobileSearchToggle = document.getElementById('mobile-search-toggle');
            this.mobileSearch = document.getElementById('mobile-search');
            this.searchForms = document.querySelectorAll('.search-bar');
            
            // Cart elements
            this.cartBtn = document.getElementById('cart-btn');
            this.cartCountElement = document.querySelector('.cart-count');
            
            // Overlay
            this.overlay = this.createOverlay();
            // State
            this.mobileMenuOpen = false;
            this.mobileSearchOpen = false;
            this.cartCount = 0;
        }

        createOverlay() {
            let overlay = document.getElementById('overlay');
            if (!overlay) {
                overlay = document.createElement('div');
                overlay.className = 'overlay';
                overlay.id = 'overlay';
                document.body.appendChild(overlay);
            }
            return overlay;
        }

        bindEvents() {
            // Mobile menu
            this.mobileMenuToggle?.addEventListener('click', () => this.toggleMobileMenu());
            this.closeMenu?.addEventListener('click', () => this.closeMobileMenu());

            // Mobile search
            this.mobileSearchToggle?.addEventListener('click', () => this.toggleMobileSearch());

            // Cart
            this.cartBtn?.addEventListener('click', () => alert(`You have ${this.cartCount} item(s) in your cart.`));

            // Overlay
            this.overlay.addEventListener('click', () => {
                this.closeMobileMenu();
                this.closeMobileSearch();
                document.dispatchEvent(new CustomEvent('close-modals'));
            });

            // Search forms
            this.searchForms.forEach(form => {
                form.addEventListener('submit', (e) => {
                    e.preventDefault();
                    const searchInput = form.querySelector('.search-input');
                    if (searchInput.value.trim()) {
                        alert(`Searching for: ${searchInput.value.trim()}`);
                        searchInput.value = '';
                        if (this.mobileSearchOpen) this.closeMobileSearch();
                    }
                });
            });

            // Window resize
            window.addEventListener('resize', () => this.handleResize());
        }

        // --- Mobile Menu Methods ---
        toggleMobileMenu() { this.mobileMenuOpen ? this.closeMobileMenu() : this.openMobileMenu(); }
        openMobileMenu() {
            this.mobileNavMenu?.classList.add('active');
            this.mobileMenuToggle?.classList.add('active');
            this.overlay.classList.add('active');
            this.mobileMenuOpen = true;
        }
        closeMobileMenu() {
            this.mobileNavMenu?.classList.remove('active');
            this.mobileMenuToggle?.classList.remove('active');
            this.overlay.classList.remove('active');
            this.mobileMenuOpen = false;
        }

        // --- Mobile Search Methods ---
        toggleMobileSearch() { this.mobileSearchOpen ? this.closeMobileSearch() : this.openMobileSearch(); }
        openMobileSearch() {
            this.mobileSearch?.classList.add('active');
            this.mobileSearchOpen = true;
            this.mobileSearch?.querySelector('.search-input')?.focus();
        }
        closeMobileSearch() {
            this.mobileSearch?.classList.remove('active');
            this.mobileSearchOpen = false;
        }

        updateCartCount(count) {
            this.cartCount = count;
            if (this.cartCountElement) {
                this.cartCountElement.textContent = this.cartCount;
            }
        }

        // --- General Methods ---
        handleResize() {
            if (window.innerWidth > 768) {
                this.closeMobileMenu();
                this.closeMobileSearch();
            }
        }
    }

    /**
     * =================================================================
     * SHOP-SPECIFIC FUNCTIONALITY
     * =================================================================
     */
    class ShopPage {
        constructor(navigation) {
            this.navigation = navigation;
            this.priceRangeSlider = document.getElementById('price-range');
            this.priceValueDisplay = document.getElementById('price-value');
            this.categoryFilterButtons = document.querySelectorAll('.category-filter-btn[data-category]');
            this.metalFilterButtons = document.querySelectorAll('.category-filter-btn[data-metal]');
            this.addToCartButtons = document.querySelectorAll('.js-add-to-cart');
            this.applyFiltersBtn = document.querySelector('.apply-filters-btn');
            this.sortBySelect = document.getElementById('sort-by');
            this.productCards = document.querySelectorAll('#shop-product-grid .product-card');
            this.compareButtons = document.querySelectorAll('.cta-button.tertiary');
            this.overviewButtons = document.querySelectorAll('.overview-btn');

            // Modal elements
            this.modal = document.getElementById('quick-view-modal');
            this.closeModalBtn = document.getElementById('close-modal');
            this.modalBody = document.getElementById('modal-body');
            this.compareModal = document.getElementById('compare-modal');
            this.closeCompareModalBtn = document.getElementById('close-compare-modal');
            this.compareModalBody = document.getElementById('compare-modal-body');

            // State
            this.comparisonItems = [];
        }

        init() {
            this.handlePriceSlider();
            this.handleAddToCart();
            this.handleCategoryFilters();
            this.handleMetalFilters();
            this.handleQuickView();
            this.handleApplyFilters();
            this.handleCompare();
            this.handleSorting();
        }

        handleSorting() {
            this.sortBySelect?.addEventListener('change', (e) => {
                const sortBy = e.target.value;
                const grid = document.getElementById('shop-product-grid');
                const cards = Array.from(grid.children);

                let sortedCards;

                switch (sortBy) {
                    case 'price-asc':
                        sortedCards = cards.sort((a, b) => parseFloat(a.dataset.price) - parseFloat(b.dataset.price));
                        break;
                    case 'price-desc':
                        sortedCards = cards.sort((a, b) => parseFloat(b.dataset.price) - parseFloat(a.dataset.price));
                        break;
                    case 'newest': // Assuming 'newest' is the original order
                    case 'featured':
                    default:
                        sortedCards = cards.sort((a, b) => parseInt(a.dataset.order) - parseInt(b.dataset.order));
                        break;
                }

                // Re-append sorted cards to the grid
                sortedCards.forEach(card => grid.appendChild(card));
            });
        }

        handleCompare() {
            this.compareButtons.forEach(button => {
                button.addEventListener('click', (e) => {
                    const clickedButton = e.currentTarget;
                    const card = clickedButton.closest('.product-card');
                    const productId = card.dataset.order; // Use a unique ID

                    const itemIndex = this.comparisonItems.findIndex(item => item.id === productId);

                    if (itemIndex > -1) {
                        // Item is already selected, so deselect it
                        this.comparisonItems.splice(itemIndex, 1);
                        clickedButton.classList.remove('selected');
                        clickedButton.textContent = 'Compare';
                    } else {
                        // Add item to comparison
                        if (this.comparisonItems.length < 2) {
                            const product = {
                                id: productId,
                                name: card.dataset.name,
                                price: card.dataset.price,
                                image: card.dataset.image,
                                description: card.dataset.description,
                            };
                            this.comparisonItems.push(product);
                            clickedButton.classList.add('selected');
                            clickedButton.textContent = 'Selected';

                            if (this.comparisonItems.length === 2) {
                                this.populateAndShowCompareModal();
                            }
                        } else {
                            alert('You can only compare two products at a time.');
                        }
                    }
                });
            });

            this.closeCompareModalBtn?.addEventListener('click', () => this.closeCompareModal());
        }

        populateAndShowCompareModal() {
            const [item1, item2] = this.comparisonItems;
            this.compareModalBody.innerHTML = `
                <div class="compare-item">
                    <img src="${item1.image}" alt="${item1.name}">
                    <h3>${item1.name}</h3>
                    <p class="product-price">$${item1.price}</p>
                    <p>${item1.description}</p>
                </div>
                <div class="compare-item">
                    <img src="${item2.image}" alt="${item2.name}">
                    <h3>${item2.name}</h3>
                    <p class="product-price">$${item2.price}</p>
                    <p>${item2.description}</p>
                </div>
            `;
            this.compareModal.classList.add('active');
        }

        closeCompareModal() {
            this.compareModal.classList.remove('active');
            // Reset selection after closing
            this.comparisonItems = [];
            this.compareButtons.forEach(btn => {
                btn.classList.remove('selected');
                btn.textContent = 'Compare';
            });
        }

        handleApplyFilters() {
            this.applyFiltersBtn?.addEventListener('click', () => {
                // 1. Get selected filter values
                const selectedCategory = document.querySelector('.category-filter-btn[data-category].active')?.dataset.category;
                const selectedMetals = Array.from(this.metalFilterButtons)
                    .filter(btn => btn.classList.contains('active'))
                    .map(btn => btn.dataset.metal);
                const maxPrice = parseInt(this.priceRangeSlider.value, 10);

                // 2. Loop through each product and check if it matches
                this.productCards.forEach(card => {
                    const productData = card.dataset;
                    const productPrice = parseInt(productData.price, 10);

                    // Check category
                    const categoryMatch = (selectedCategory === 'all' || !selectedCategory) || productData.category === selectedCategory;

                    // Check price
                    const priceMatch = productPrice <= maxPrice;

                    // Check metal
                    const productMetals = productData.metal ? productData.metal.split(',') : [];
                    const metalMatch = selectedMetals.length === 0 || selectedMetals.some(metal => productMetals.includes(metal));

                    // 3. Show or hide the card
                    if (categoryMatch && priceMatch && metalMatch) {
                        card.style.display = 'block';
                    } else {
                        card.style.display = 'none';
                    }
                });

                // Optional: Provide feedback to the user
                const originalText = this.applyFiltersBtn.textContent;
                this.applyFiltersBtn.textContent = 'Filters Applied!';
                setTimeout(() => {
                    this.applyFiltersBtn.textContent = originalText;
                }, 1500);
            });
        }

        handleQuickView() {
            if (!this.modal) return;

            this.overviewButtons.forEach(button => {
                button.addEventListener('click', (e) => {
                    const card = e.target.closest('.product-card');
                    const product = {
                        name: card.dataset.name,
                        price: card.dataset.price,
                        image: card.dataset.image,
                        description: card.dataset.description,
                    };
                    this.populateAndShowModal(product);
                });
            });

            this.closeModalBtn.addEventListener('click', () => this.closeModal());
            document.addEventListener('close-modals', () => this.closeModal());
            this.closeCompareModalBtn?.addEventListener('click', () => this.closeCompareModal());
        }

        populateAndShowModal(product) {
            this.modalBody.innerHTML = `
                <div class="modal-image">
                    <img src="${product.image}" alt="${product.name}">
                </div>
                <div class="modal-details">
                    <h2>${product.name}</h2>
                    <p class="product-price">$${product.price}</p>
                    <p>${product.description}</p>
                </div>
            `;
            this.modal.classList.add('active');
        }

        closeModal() {
            this.modal.classList.remove('active');
        }

        handleMetalFilters() {
            if (!this.metalFilterButtons.length) return;

            this.metalFilterButtons.forEach(button => {
                button.addEventListener('click', (e) => {
                    const clickedButton = e.currentTarget;
                    // Toggle the active class to allow multi-selection
                    clickedButton.classList.toggle('active');
                });
            });
        }

        handleCategoryFilters() {
            if (!this.categoryFilterButtons.length) return;

            // Set the 'All' button as active by default on page load
            const allButton = document.querySelector('.category-filter-btn[data-category="all"]');
            if (allButton) {
                allButton.classList.add('active');
            }

            this.categoryFilterButtons.forEach(button => {
                button.addEventListener('click', (e) => {
                    const clickedButton = e.currentTarget;

                    // Remove 'active' class from all category buttons
                    this.categoryFilterButtons.forEach(btn => btn.classList.remove('active'));

                    // Add 'active' class to the clicked button
                    clickedButton.classList.add('active');
                });
            });
        }

        handlePriceSlider() {
            if (!this.priceRangeSlider || !this.priceValueDisplay) return;

            // Update display on input
            this.priceRangeSlider.addEventListener('input', (e) => {
                const value = e.target.value;
                this.priceValueDisplay.textContent = `$${value}`;
            });
        }

        handleAddToCart() {
            this.addToCartButtons.forEach(button => {
                button.addEventListener('click', (e) => {
                    e.preventDefault();
                    
                    // 1. Update cart count
                    const currentCount = this.navigation.cartCount;
                    this.navigation.updateCartCount(currentCount + 1);

                    // 2. Provide user feedback
                    const originalText = button.textContent;
                    button.textContent = 'Added!';
                    button.disabled = true;

                    setTimeout(() => {
                        button.textContent = originalText;
                        button.disabled = false;
                    }, 1500);

                    // 3. Alert the user
                    alert('Item added to cart!');
                });
            });
        }
    }

    /**
     * =================================================================
     * GLOBAL HELPERS
     * =================================================================
     */
    const handleBackToTop = () => {
        const backToTopBtn = document.getElementById('back-to-top-btn');
        if (!backToTopBtn) return;

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
    };

    /**
     * =================================================================
     * INITIALIZATION
     * =================================================================
     */
    const navigation = new Navigation();
    navigation.bindEvents();

    const shopPage = new ShopPage(navigation);
    shopPage.init();

    handleBackToTop();

});