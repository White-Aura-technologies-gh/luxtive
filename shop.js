document.addEventListener('DOMContentLoaded', () => {
    const productGrid = document.getElementById('shop-product-grid');
    const allProductsView = document.getElementById('all-products-view');
    const singleCategoryView = document.getElementById('shop-product-grid');
    const filterToggleBtn = document.getElementById('filter-toggle-btn');
    const filtersPanel = document.getElementById('filters-panel');
    const closeFiltersBtn = document.getElementById('close-filters-btn');
    const applyFiltersBtn = document.querySelector('.apply-filters-btn');
    const navigation = window.navigation;

    // --- Enhanced Filter Elements ---
    const categoryButtons = document.querySelectorAll('.category-filter-btn[data-category]');
    const metalButtons = document.querySelectorAll('.category-filter-btn[data-metal]');
    const featureButtons = document.querySelectorAll('.category-filter-btn[data-feature]');
    const priceRange = document.getElementById('price-range');
    const customJewelryBtn = document.querySelector('[data-action="open-custom-modal"]');
    const customJewelryModal = document.getElementById('custom-jewelry-modal');
    const customJewelryForm = document.getElementById('custom-jewelry-form');
    const closeModalBtns = document.querySelectorAll('.close-modal');
    const subCategoryContainer = document.getElementById('sub-category-filters');
    const subCategoryGroups = document.querySelectorAll('.sub-category-group');
    const compareModal = document.getElementById('compare-modal');
    const compareModalBody = document.getElementById('compare-modal-body');
    const quickViewModal = document.getElementById('quick-view-modal');
    const aboutUsModal = document.getElementById('about-us-modal');
    const aboutUsNavLink = document.getElementById('about-us-nav-link'); 
    const mobileAboutUsNavLink = document.getElementById('mobile-about-us-nav-link'); 
    const closeAboutUsModalBtn = document.getElementById('close-about-us-modal');
    const quickViewModalBody = document.getElementById('modal-body');
    const pagination = document.querySelector('.pagination');
    const globalSearch = document.getElementById('global-search');
    const clearSearch = document.getElementById('clear-search');
    const resetFilters = document.getElementById('reset-filters');
    const sortSelect = document.getElementById('sort-by');
    const loadingState = document.getElementById('loading-state');
    const emptyState = document.getElementById('empty-state');
    const productCount = document.querySelector('.product-count');
    const clearFiltersBtn = document.querySelector('.clear-filters-btn');

    let allProducts = [];
    let compareItems = [];
    let currentFilters = {
        category: 'all',
        price: 2500,
        metals: [],
        features: [],
        search: '',
        sort: 'featured'
    };

    // --- Enhanced Helper Functions ---
    function createProductCardHTML(product) {
        const priceHTML = product.promo_price 
            ? `<span class="original-price">$${parseFloat(product.price).toFixed(2)}</span>$${parseFloat(product.promo_price).toFixed(2)}`
            : `$${parseFloat(product.price).toFixed(2)}`;

        const badges = [];
        if (product.promo_price) badges.push('<span class="product-badge sale">Sale</span>');
        if (product.bestseller) badges.push('<span class="product-badge bestseller">Bestseller</span>');
        if (product.featured) badges.push('<span class="product-badge featured">Featured</span>');
        if (isNewProduct(product)) badges.push('<span class="product-badge new">New</span>');

        return `
            <div class="product-card" data-product-id="${product.id}" 
                 data-name="${product.name}" 
                 data-price="${product.promo_price || product.price}" 
                 data-category="${product.sub_category}" 
                 data-metal="${product.metal}" 
                 data-image="${product.image_url}" 
                 data-description="${product.description}"
                 data-featured="${product.featured}"
                 data-bestseller="${product.bestseller}"
                 data-created="${product.created_at}">
                <div class="product-card-image">
                    <a href="#" class="product-link">
                        <img src="${product.image_url || 'images/placeholder.png'}" 
                             alt="${product.name}" 
                             loading="lazy"
                             onerror="this.src='images/placeholder.png'">
                    </a>
                    ${badges.join('')}
                </div>
                <div class="product-card-details">
                    <h3 class="product-name">
                        <a href="#" class="product-link">${product.name}</a>
                    </h3>
                    <p class="product-price">${priceHTML}</p>
                    <div class="product-card-actions">
                        <button class="cta-button tertiary wishlist-btn" 
                                aria-label="Add ${product.name} to wishlist">
                            <i class="far fa-heart"></i>
                        </button>
                        <button class="cta-button secondary js-add-to-cart" 
                                data-product-id="${product.id}"
                                aria-label="Add ${product.name} to cart">
                            Add to Cart
                        </button>
                        <button class="cta-button tertiary compare-btn" 
                                aria-label="Compare ${product.name}">
                            <i class="fas fa-balance-scale"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    function isNewProduct(product) {
        const created = new Date(product.created_at);
        const now = new Date();
        const diffTime = Math.abs(now - created);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays <= 30; // New if created within last 30 days
    }

    // --- Enhanced Event Listeners ---
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('js-add-to-cart')) {
            const card = e.target.closest('.product-card');
            if (card) {
                const product = getProductFromCard(card);
                addToCart(product);
            }
        }

        if (e.target.classList.contains('compare-btn')) {
            const card = e.target.closest('.product-card'); // Also works for icon inside button
            if (card) {
                e.target.classList.toggle('selected');
                updateCompareView(card);
            }
        }

        if (e.target.classList.contains('product-link')) {
            e.preventDefault(); // Keep this to prevent navigation
            const card = e.target.closest('.product-card');
            if (card) openQuickView(card);
        }
    });

    // Modal event listeners
    document.querySelectorAll('.quick-view-modal').forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
            }
        });
    });

    document.querySelectorAll('.close-modal').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const modal = e.target.closest('.quick-view-modal, .about-us-modal');
            if (modal) {
                modal.classList.remove('active');
            }
        });
    });

    // --- Enhanced Filtering System ---
    function applyFilters() {
        let filteredProducts = allProducts;

        // Category filter
        if (currentFilters.category !== 'all') {
            const mainCategoryToSubCategories = getCategoryMapping();
            const subCategories = mainCategoryToSubCategories[currentFilters.category] || [currentFilters.category];
            filteredProducts = filteredProducts.filter(p => subCategories.includes(p.sub_category));
        }

        // Price filter
        filteredProducts = filteredProducts.filter(p => parseFloat(p.promo_price || p.price) <= currentFilters.price);

        // Metal filter
        if (currentFilters.metals.length > 0) {
            filteredProducts = filteredProducts.filter(p => {
                const productMetals = p.metal ? p.metal.split(',').map(m => m.trim()) : [];
                return currentFilters.metals.some(metal => productMetals.includes(metal));
            });
        }

        // Feature filter
        if (currentFilters.features.length > 0) {
            filteredProducts = filteredProducts.filter(p => {
                return currentFilters.features.some(feature => {
                    switch (feature) {
                        case 'featured': return p.featured;
                        case 'bestseller': return p.bestseller;
                        case 'sale': return p.promo_price && p.promo_price < p.price;
                        default: return true;
                    }
                });
            });
        }

        // Search filter
        if (currentFilters.search) {
            const searchTerm = currentFilters.search.toLowerCase();
            filteredProducts = filteredProducts.filter(p => 
                p.name.toLowerCase().includes(searchTerm) ||
                p.description.toLowerCase().includes(searchTerm) ||
                p.sub_category.toLowerCase().includes(searchTerm) ||
                p.metal.toLowerCase().includes(searchTerm)
            );
        }

        // Sort products
        filteredProducts = sortProducts(filteredProducts, currentFilters.sort);

        return filteredProducts;
    }

    function sortProducts(products, sortType) {
        const sorted = [...products];
        switch (sortType) {
            case 'price-asc':
                return sorted.sort((a, b) => (a.promo_price || a.price) - (b.promo_price || b.price));
            case 'price-desc':
                return sorted.sort((a, b) => (b.promo_price || b.price) - (a.promo_price || a.price));
            case 'newest':
                return sorted.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
            case 'bestseller':
                return sorted.sort((a, b) => (b.bestseller ? 1 : 0) - (a.bestseller ? 1 : 0));
            case 'featured':
            default:
                return sorted.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
        }
    }

    function getCategoryMapping() {
        return {
            'rings': ['male-rings', 'diamond-rings', 'vintage-rings'],
            'necklaces': ['male-necklaces', 'ladies-necklaces'],
            'bracelets': ['male-bracelets', 'ladies-bracelets'],
            'earrings': ['earrings'],
            'jewelry-sets': ['jewelry-sets'],
            'anklets': ['anklets'],
            'brooches': ['brooches'],
            'waist-chains': ['waist-chains']
        };
    }

    // --- Enhanced View Rendering ---
    function renderFilteredProducts() {
        const filteredProducts = applyFilters();
        const isAllView = currentFilters.category === 'all';
        
        if (filteredProducts.length === 0) {
            showEmptyState();
            return;
        }

        hideEmptyState();

        if (isAllView) {
            renderAllProductsView(filteredProducts);
        } else {
            renderSingleCategoryView(filteredProducts);
        }

        updateProductCount(filteredProducts.length);
    }

    function renderAllProductsView(products) {
        allProductsView.innerHTML = '';
        allProductsView.style.display = 'block';
        singleCategoryView.style.display = 'none';
        if (pagination) pagination.style.display = 'none';

        const productsByCategory = products.reduce((acc, product) => {
            const category = product.sub_category || 'uncategorized';
            if (!acc[category]) acc[category] = [];
            acc[category].push(product); 
            return acc;
        }, {});

        const categoryOrder = ['necklaces', 'jewelry-sets', 'earrings', 'rings', 'bracelets', 'anklets', 'brooches', 'waist-chains'];

        categoryOrder.forEach(category => {
            if (productsByCategory[category] && productsByCategory[category].length > 0) {
                const categoryProducts = productsByCategory[category];
                const section = createCategoryCarousel(category, categoryProducts);
                allProductsView.appendChild(section);
            }
        });
        
        setupCarousels();
    }

    function createCategoryCarousel(category, products) {
        const categoryTitle = category.charAt(0).toUpperCase() + category.slice(1).replace(/-/g, ' ');
        
        return document.createRange().createContextualFragment(`
            <section class="category-carousel-section" data-category="${category}">
                <div class="category-carousel-header">
                    <h2 class="category-carousel-title">${categoryTitle}</h2>
                    <div class="carousel-controls">
                        <button class="carousel-arrow-btn prev" aria-label="Previous ${categoryTitle}">&larr;</button>
                        <div class="carousel-progress">
                            <span class="carousel-progress-text">1-${Math.min(5, products.length)} of ${products.length}</span>
                            <div class="carousel-dots"></div>
                        </div>
                        <button class="carousel-arrow-btn next" aria-label="Next ${categoryTitle}">&rarr;</button>
                        <a href="?category=${category}" class="view-all-btn">View All</a>
                    </div>
                </div>
                <div class="carousel-viewport">
                    <div class="carousel-track">
                        ${products.map(p => createProductCardHTML(p)).join('')}
                    </div>
                </div>
            </section>
        `).firstElementChild;
    }

    // --- Enhanced Carousel System ---
    function setupCarousels() {
        const carousels = document.querySelectorAll('.category-carousel-section');
        carousels.forEach(carousel => {
            const track = carousel.querySelector('.carousel-track');
            const prevBtn = carousel.querySelector('.carousel-arrow-btn.prev');
            const nextBtn = carousel.querySelector('.carousel-arrow-btn.next');
            const items = Array.from(track.children);
            if (items.length === 0) return;

            let currentIndex = 0;

            function getItemsPerPage() {
                const viewportWidth = carousel.querySelector('.carousel-viewport').offsetWidth;
                const itemWidth = items[0].offsetWidth;
                const gap = parseFloat(getComputedStyle(track).gap) || 24; // 2rem fallback
                return Math.max(1, Math.floor(viewportWidth / (itemWidth + gap)));
            }

            function updateCarousel() {
                const itemsPerPage = getItemsPerPage();
                const itemWidth = items[0].offsetWidth;
                const gap = parseFloat(getComputedStyle(track).gap) || 24;
                const offset = -currentIndex * (itemWidth + gap);
                
                track.style.transform = `translateX(${offset}px)`;

                prevBtn.disabled = currentIndex === 0;
                nextBtn.disabled = currentIndex >= items.length - itemsPerPage;
            }

            nextBtn.addEventListener('click', () => {
                const itemsPerPage = getItemsPerPage();
                if (currentIndex < items.length - itemsPerPage) {
                    currentIndex = Math.min(currentIndex + 1, items.length - itemsPerPage);
                    updateCarousel();
                }
            });

            prevBtn.addEventListener('click', () => {
                if (currentIndex > 0) {
                    currentIndex = Math.max(0, currentIndex - 1);
                    updateCarousel();
                }
            });

            // Touch support for mobile
            let startX = 0;
            track.addEventListener('touchstart', (e) => { startX = e.touches[0].clientX; }, { passive: true });

            track.addEventListener('touchend', (e) => {
                const endX = e.changedTouches[0].clientX;
                const diff = startX - endX;
                const itemsPerPage = getItemsPerPage();

                if (Math.abs(diff) > 50) { // Minimum swipe distance
                    if (diff > 0 && currentIndex < items.length - itemsPerPage) {
                        nextBtn.click();
                    } else if (diff < 0 && currentIndex > 0) {
                        prevBtn.click();
                    }
                }
            });

            new ResizeObserver(updateCarousel).observe(carousel.querySelector('.carousel-viewport'));
            updateCarousel();
        });
    }

    function renderSingleCategoryView(products) {
        allProductsView.style.display = 'none';
        singleCategoryView.style.display = 'grid';
        if (pagination) pagination.style.display = 'flex';

        singleCategoryView.innerHTML = products.map(p => createProductCardHTML(p)).join('');
        updateSubCategoryFilters();
    }

    // --- Enhanced UI State Management ---
    function showLoadingState() {
        if (loadingState) loadingState.style.display = 'block';
        if (allProductsView) allProductsView.style.display = 'none';
        if (singleCategoryView) singleCategoryView.style.display = 'none';
        if (emptyState) emptyState.style.display = 'none';
    }

    function hideLoadingState() {
        if (loadingState) loadingState.style.display = 'none';
    }

    function showEmptyState() {
        if (emptyState) emptyState.style.display = 'block';
        if (allProductsView) allProductsView.style.display = 'none';
        if (singleCategoryView) singleCategoryView.style.display = 'none';
        if (pagination) pagination.style.display = 'none';
    }

    function hideEmptyState() {
        if (emptyState) emptyState.style.display = 'none';
    }

    function updateProductCount(count) {
        if (productCount) {
            const total = allProducts.length;
            productCount.textContent = `Showing ${count} of ${total} products`;
        }
    }

    // --- Enhanced Event Handlers ---
    categoryButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            if (e.currentTarget.dataset.action === 'open-custom-modal') return;

            categoryButtons.forEach(btn => btn.classList.remove('active'));
            e.currentTarget.classList.add('active');

            currentFilters.category = e.currentTarget.dataset.category;
            renderFilteredProducts();
            updateSubCategoryFilters();
        });
    });

    metalButtons.forEach(button => {
        button.addEventListener('click', () => {
            button.classList.toggle('active');
            const metal = button.dataset.metal;
            if (button.classList.contains('active')) {
                currentFilters.metals.push(metal);
            } else {
                currentFilters.metals = currentFilters.metals.filter(m => m !== metal);
            }
            renderFilteredProducts();
        });
    });

    featureButtons.forEach(button => {
        button.addEventListener('click', () => {
            button.classList.toggle('active');
            const feature = button.dataset.feature;
            if (button.classList.contains('active')) {
                currentFilters.features.push(feature);
            } else {
                currentFilters.features = currentFilters.features.filter(f => f !== feature);
            }
            renderFilteredProducts();
        });
    });

    if (priceRange) {
        priceRange.addEventListener('input', (e) => {
            currentFilters.price = parseInt(e.target.value);
            document.getElementById('price-value').textContent = `$${e.target.value}`;
            renderFilteredProducts();
        });
    }

    if (globalSearch) {
        globalSearch.addEventListener('input', (e) => {
            currentFilters.search = e.target.value;
            renderFilteredProducts();
        });
    }

    if (clearSearch) {
        clearSearch.addEventListener('click', () => {
            globalSearch.value = '';
            currentFilters.search = '';
            renderFilteredProducts();
        });
    }

    if (resetFilters) {
        resetFilters.addEventListener('click', resetAllFilters);
    }

    if (clearFiltersBtn) {
        clearFiltersBtn.addEventListener('click', resetAllFilters);
    }

    if (sortSelect) {
        sortSelect.addEventListener('change', (e) => {
            currentFilters.sort = e.target.value;
            renderFilteredProducts();
        });
    }

    if (filterToggleBtn) {
        filterToggleBtn.addEventListener('click', () => {
            filtersPanel.classList.toggle('active');
            filterToggleBtn.classList.toggle('active');
        });
    }

    if (closeFiltersBtn) {
        closeFiltersBtn.addEventListener('click', () => {
            filtersPanel.classList.remove('active');
            filterToggleBtn.classList.remove('active');
        });
    }

    if (applyFiltersBtn) { // This is the "Show Results" button now
        applyFiltersBtn.addEventListener('click', () => {
            filtersPanel.classList.remove('active');
            filterToggleBtn.classList.remove('active');
            renderFilteredProducts();
        });
    }

    if (customJewelryBtn) {
        customJewelryBtn.addEventListener('click', () => {
            if (customJewelryModal) {
                customJewelryModal.classList.add('active');
            }
        });
    }

    if (customJewelryForm) {
        customJewelryForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const description = document.getElementById('custom-description').value.trim();
            const contactMethod = document.querySelector('input[name="contact-method"]:checked').value;

            if (!description) {
                showToast('Please describe the jewelry you want to create.');
                return;
            }

            if (contactMethod === 'whatsapp') {
                const phoneNumber = '233123456789'; // Your business WhatsApp number without '+' or spaces
                const message = `Hello Luxtive,\n\nI would like to request a custom jewelry piece. Here is my description:\n\n"${description}"`;
                const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
                window.open(whatsappUrl, '_blank');
            } else if (contactMethod === 'gmail') {
                const email = 'support@luxtivejewelry.com';
                const subject = 'Bespoke Jewelry Request';
                const body = `Hello Luxtive Team,\n\nI am interested in creating a bespoke piece of jewelry. Please find the details of my request below:\n\nDescription:\n"${description}"\n\nI look forward to hearing from you.\n\nBest regards,`;
                const mailtoUrl = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
                window.location.href = mailtoUrl;
            }

            // Close the modal and reset the form
            if (customJewelryModal) {
                customJewelryModal.classList.remove('active');
            }
            customJewelryForm.reset();
            showToast('Redirecting you to send your request...');
        });
    }

    function resetAllFilters() {
        // Reset category
        categoryButtons.forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.category === 'all') btn.classList.add('active');
        });

        // Reset metals
        metalButtons.forEach(btn => btn.classList.remove('active'));
        
        // Reset features
        featureButtons.forEach(btn => btn.classList.remove('active'));
        
        // Reset price
        if (priceRange) {
            priceRange.value = 2500;
            document.getElementById('price-value').textContent = '$2500';
        }
        
        // Reset search
        if (globalSearch) globalSearch.value = '';
        
        // Reset sort
        if (sortSelect) sortSelect.value = 'featured';

        // Reset filter state
        currentFilters = {
            category: 'all',
            price: 2500,
            metals: [],
            features: [],
            search: '',
            sort: 'featured'
        };

        renderFilteredProducts();
    }

    // --- Enhanced Product Fetching ---
    async function fetchAndRenderProducts() {
        showLoadingState();
        
        try {
            const response = await fetch('../Admin/get_products.php');
            if (!response.ok) throw new Error(`Network response was not ok. Status: ${response.status}`);

            const text = await response.text();
            if (!text.trim()) throw new Error('Empty response from server');

            allProducts = JSON.parse(text);
            if (!Array.isArray(allProducts)) throw new Error('Invalid data format received from server');

            if (allProducts.length === 0) {
                showEmptyState();
                return;
            }

            renderFilteredProducts();
            handleCategoryFromURL();

        } catch (error) {
            console.error('Failed to fetch products:', error);
            showEmptyState();
        } finally {
            hideLoadingState();
        }
    }

    function handleCategoryFromURL() {
        const params = new URLSearchParams(window.location.search);
        const category = params.get('category');
        const search = params.get('search');
        
        if (category) {
            const targetButton = document.querySelector(`.category-filter-btn[data-category="${category}"]`);
            if (targetButton) targetButton.click();
        }
        
        if (search && globalSearch) {
            globalSearch.value = search;
            currentFilters.search = search;
            renderFilteredProducts();
        }
    }

    function updateSubCategoryFilters() {
        // Implementation for dynamic sub-category filters
        // This can be enhanced based on your specific needs
    }

    function getProductFromCard(card) {
        return {
            id: card.dataset.productId,
            name: card.dataset.name,
            price: parseFloat(card.dataset.price),
            image_url: card.dataset.image,
            metal: card.dataset.metal,
            description: card.dataset.description
        };
    }

    function addToCart(product) {
        if (navigation) navigation.addToCart(product);
    }

    function openQuickView(card) {
        if (!card || !quickViewModal || !quickViewModalBody) return;

        const data = card.dataset;
        const priceHTML = card.querySelector('.product-price').innerHTML;

        // Mock variations if not present
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
                <h2>${data.name || 'Unnamed Product'}</h2>
                <div class="product-meta">
                    <span>Category: ${data.category || 'N/A'}</span>
                    <span>Sub-category: ${data.subcategory || 'N/A'}</span>
                </div>
                <p class="modal-product-price" id="modal-product-price">${priceHTML}</p>
                <p class="product-description">${data.description || 'No description available.'}</p>
                <div class="product-meta">
                    <p><strong>Metal:</strong> ${data.metal || 'N/A'}</p>
                </div>
                <div class="modal-actions">
                    <div class="quantity-selector">
                        <button class="quantity-btn minus-btn">-</button>
                        <input type="number" class="quantity-input" value="1" min="1">
                        <button class="quantity-btn plus-btn">+</button>
                    </div>
                    <button class="cta-button secondary js-add-to-cart" data-product-id="${data.productId}">Add to Cart</button>
                </div>
            </div>
        `;

        quickViewModalBody.innerHTML = modalContentHTML;
        quickViewModal.classList.add('active');
        bindModalEvents(quickViewModalBody);
    }

    function bindModalEvents(modalBody) {
        const mainImage = modalBody.querySelector('#modal-main-image');
        const priceDisplay = modalBody.querySelector('#modal-product-price');

        modalBody.querySelectorAll('.modal-thumbnail').forEach(thumb => {
            thumb.addEventListener('click', () => {
                mainImage.src = thumb.dataset.image;
                priceDisplay.textContent = `$${parseFloat(thumb.dataset.price).toFixed(2)}`;
                modalBody.querySelectorAll('.modal-thumbnail').forEach(t => t.classList.remove('active'));
                thumb.classList.add('active');
            });
        });

        const quantityInput = modalBody.querySelector('.quantity-input');
        if (!quantityInput) return;
        modalBody.querySelector('.minus-btn').addEventListener('click', () => { if (quantityInput.value > 1) quantityInput.value--; });
        modalBody.querySelector('.plus-btn').addEventListener('click', () => { quantityInput.value++; });
    }

    function updateCompareView(productCard) {
        // Enhanced compare functionality
        const productId = productCard.dataset.productId;
        const isSelected = compareItems.some(item => item.id == productId);

        if (isSelected) {
            compareItems = compareItems.filter(item => item.id != productId);
        } else {
            if (compareItems.length < 4) { // Increased compare limit
                const data = productCard.dataset;
                compareItems.push({
                    id: productId,
                    name: data.name,
                    price: productCard.querySelector('.product-price').innerHTML,
                    image: data.image,
                    description: data.description,
                    metal: data.metal
                });
            } else {
                showToast('You can only compare up to 4 items.');
                productCard.querySelector('.compare-btn').classList.remove('selected');
                return;
            }
        }

        if (compareItems.length >= 2) {
            renderCompareModal();
            compareModal.classList.add('active');
        } else {
            compareModal.classList.remove('active');
        }
    }

    function renderCompareModal() {
        compareModalBody.innerHTML = compareItems.map(item => `
            <div class="compare-item-column">
                <div class="modal-image-gallery compare">
                    <img src="${item.image}" alt="${item.name}">
                </div>
                <div class="modal-details">
                    <h3>${item.name}</h3>
                    <p class="modal-product-price">${item.price}</p>
                    <p class="product-meta"><strong>Material:</strong> ${item.metal || 'N/A'}</p>
                    <p class="product-description small">${item.description || 'No description available.'}</p>
                    <div class="modal-actions">
                         <button class="cta-button secondary js-add-to-cart" data-product-id="${item.id}">Add to Cart</button>
                    </div>
                </div>
            </div>
        `).join('');

        const placeholdersNeeded = 4 - compareItems.length;
        for (let i = 0; i < placeholdersNeeded; i++) {
            compareModalBody.innerHTML += '<div class="compare-item-column placeholder"><div class="placeholder-content"><i class="fas fa-plus"></i><p>Select an item to compare</p></div></div>';
        }
    }

    function showToast(message) {
        if (navigation) navigation.showToast(message);
    }

    // --- Final Initialization ---
    fetchAndRenderProducts();

    // Real-time updates
    window.addEventListener('storage', (event) => {
        if (event.key === 'productsUpdated' && event.newValue === 'true') {
            localStorage.removeItem('productsUpdated');
            showToast('New products available! Refreshing list...');
            fetchAndRenderProducts();
        }
    });

});
