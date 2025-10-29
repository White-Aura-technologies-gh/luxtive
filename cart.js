document.addEventListener('DOMContentLoaded', () => {
    const momoNumberInput = document.getElementById('momo-number');
    const momoLogo = document.getElementById('momo-provider-logo');

    const aboutUsModal = document.getElementById('about-us-modal');
    const aboutUsNavLink = document.getElementById('about-us-nav-link'); // Desktop link
    const mobileAboutUsNavLink = document.getElementById('mobile-about-us-nav-link'); // Mobile link
    const closeAboutUsModalBtn = document.getElementById('close-about-us-modal');

    if (momoNumberInput) {
        momoNumberInput.addEventListener('input', detectMomoProvider);
    }

    function detectMomoProvider() {
        const number = momoNumberInput.value.replace(/\s+/g, ''); // Remove spaces
        let provider = null;

        if (number.length >= 3) {
            const prefix = number.substring(0, 3);

            // Define prefixes for each provider
            const providers = {
                mtn: ['024', '054', '025', '055', '059', '053'],
                telecel: ['020', '050'],
                airteltigo: ['026', '056', '027', '057']
            };

            if (providers.mtn.includes(prefix)) {
                provider = 'mtn';
            } else if (providers.telecel.includes(prefix)) {
                provider = 'telecel';
            } else if (providers.airteltigo.includes(prefix)) {
                provider = 'airteltigo';
            }
        }

        updateLogo(provider);
    }

    function updateLogo(provider) {
        // Reset styles
        momoLogo.style.backgroundImage = 'none';
        momoLogo.classList.remove('visible');

        if (provider) {
            const logoMap = {
                mtn: 'images/MTN-Momo-Logo.png',
                telecel: 'images/telecel-Momo-logo.png',
                airteltigo: 'images/AT-Momo-Logo.png'
            };

            const logoUrl = logoMap[provider];

            if (logoUrl) {
                momoLogo.style.backgroundImage = `url('${logoUrl}')`;
                momoLogo.classList.add('visible');
            }
        }
    }

    // --- Delivery Information Logic ---
    const deliveryLocationSelect = document.getElementById('delivery-location');
    const deliveryTimeInfo = document.getElementById('delivery-time-info');
    const exchangePolicyNote = document.querySelector('.exchange-policy');
    const ghanaTownField = document.getElementById('ghana-town-field');
    const internationalDeliveryFields = document.getElementById('international-delivery-fields');

    const deliveryMessages = {
        accra: "Delivery within Accra and its environs are made between 24–48 hours.",
        'outside-accra': "Deliveries outside Accra take 48–72 hours.",
        international: "Deliveries outside Ghana take 4–15 days depending on country and exact location."
    };

    function updateDeliveryInfo() {
        if (!deliveryLocationSelect) return;

        const selectedLocation = deliveryLocationSelect.value;

        // Update delivery message
        if (deliveryTimeInfo) {
            deliveryTimeInfo.textContent = deliveryMessages[selectedLocation];
        }

        // Show/hide Ghana-specific fields and notes
        if (selectedLocation === 'international') {
            if (exchangePolicyNote) {
                exchangePolicyNote.style.display = 'none';
            }
            if (ghanaTownField) {
                ghanaTownField.style.display = 'none';
            }
            if (internationalDeliveryFields) {
                internationalDeliveryFields.style.display = 'block';
            }
        } else { // For 'accra' and 'outside-accra'
            if (exchangePolicyNote) {
                exchangePolicyNote.style.display = 'block';
            }
            if (ghanaTownField) {
                ghanaTownField.style.display = 'block';
            }
            if (internationalDeliveryFields) {
                internationalDeliveryFields.style.display = 'none';
            }
        }
    }

    if (deliveryLocationSelect) {
        deliveryLocationSelect.addEventListener('change', updateDeliveryInfo);
        // Run on page load to set the initial state correctly
        updateDeliveryInfo();
    }

    // --- Payment Tab Switching Logic ---
    const paymentTabBtns = document.querySelectorAll('.payment-tab-btn');
    const paymentContents = document.querySelectorAll('.payment-content');

    paymentTabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Deactivate all tabs and content
            paymentTabBtns.forEach(innerBtn => innerBtn.classList.remove('active'));
            paymentContents.forEach(content => content.classList.remove('active'));

            // Activate the clicked tab
            btn.classList.add('active');

            // Activate the corresponding content
            const targetId = btn.dataset.target;
            const targetContent = document.getElementById(targetId);
            if (targetContent) {
                targetContent.classList.add('active');
            }
        });
    });

    // --- Card Payment Logic ---
    const cardNumberInput = document.getElementById('card-number');
    const cardLogo = document.getElementById('card-type-logo');
    const cardErrorMessage = document.getElementById('card-error-message');
    const expiryDateInput = document.getElementById('expiry-date');
    const cvcInput = document.getElementById('cvc');

    let detectedCardType = null;

    const cardLogoMap = {
        visa: 'images/VISA-logo.png',
        mastercard: 'images/MSC-logo.png'
    };

    function detectCardType(number) {
        // Visa starts with 4
        if (number.startsWith('4')) {
            return 'visa';
        }
        // Mastercard starts with 51-55 or 2221-2720
        if (number.startsWith('5')) {
            return 'mastercard';
        }
        return null;
    }

    function updateCardLogo(type) {
        if (type && cardLogoMap[type]) {
            cardLogo.style.backgroundImage = `url('${cardLogoMap[type]}')`;
            cardLogo.classList.add('visible');
        } else {
            cardLogo.classList.remove('visible');
        }
    }

    function validateAndMaskCard() {
        const number = cardNumberInput.value.replace(/\s+/g, '');
        let isValid = false;

        // Validate length based on detected type
        if (detectedCardType === 'visa' && [13, 16, 19].includes(number.length)) {
            isValid = true;
        } else if (detectedCardType === 'mastercard' && number.length === 16) {
            isValid = true;
        }

        // Show/hide error message
        if (number.length > 0 && !isValid) {
            cardErrorMessage.textContent = 'Please enter a valid Visa or Mastercard number.';
            cardErrorMessage.style.display = 'block';
        } else {
            cardErrorMessage.style.display = 'none';
        }

        // Mask the number if valid
        if (isValid) {
            const last4 = number.slice(-4);
            cardNumberInput.value = `•••• •••• •••• ${last4}`;
        }
    }

    if (cardNumberInput) {
        cardNumberInput.addEventListener('input', () => {
            // Clear error on new input
            cardErrorMessage.style.display = 'none';

            // Format input with spaces
            let value = cardNumberInput.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
            let matches = value.match(/\d{4,16}/g);
            let match = matches && matches[0] || '';
            let parts = [];
            for (let i = 0, len = match.length; i < len; i += 4) {
                parts.push(match.substring(i, i + 4));
            }
            if (parts.length) {
                cardNumberInput.value = parts.join(' ');
            }

            // Detect and update logo
            detectedCardType = detectCardType(value);
            updateCardLogo(detectedCardType);
        });

        // Validate and mask on blur
        cardNumberInput.addEventListener('blur', validateAndMaskCard);
    }

    // --- Expiry Date Auto-formatting ---
    if (expiryDateInput) {
        expiryDateInput.addEventListener('input', () => {
            let value = expiryDateInput.value.replace(/\D/g, ''); // Remove non-digits
            if (value.length > 2) {
                value = value.substring(0, 2) + ' / ' + value.substring(2, 4);
            }
            expiryDateInput.value = value;
        });
    }

    // --- CVC Masking Logic ---
    if (cvcInput) {
        let cvcTimeout;
        let actualCvc = '';

        cvcInput.addEventListener('input', () => {
            // Clear any previous timer
            clearTimeout(cvcTimeout);
            
            // Store the real value as the user types
            actualCvc = cvcInput.value;

            // Set a timer to mask the input after 2 seconds of inactivity
            cvcTimeout = setTimeout(() => {
                cvcInput.type = 'password';
            }, 2000);
        });

        // When the user clicks back into the field, show the numbers
        cvcInput.addEventListener('focus', () => {
            clearTimeout(cvcTimeout);
            cvcInput.type = 'tel'; // Change back from 'password'
            cvcInput.value = actualCvc; // Restore the actual value
        });

        // When the user leaves the field, mask it immediately
        cvcInput.addEventListener('blur', () => {
            clearTimeout(cvcTimeout);
            cvcInput.type = 'password';
        });
    }

    // --- About Us Modal Logic ---
    function openAboutUsModal() {
        if (aboutUsModal) {
            aboutUsModal.classList.add('active');
            document.body.style.overflow = 'hidden'; // Prevent scrolling background
        }
    }

    function closeAboutUsModal() {
        if (aboutUsModal) {
            aboutUsModal.classList.remove('active');
            document.body.style.overflow = ''; // Restore scrolling
        }
    }

    // Event listeners for opening
    if (aboutUsNavLink) {
        aboutUsNavLink.addEventListener('click', (e) => {
            e.preventDefault();
            openAboutUsModal();
        });
    }

    if (mobileAboutUsNavLink) {
        mobileAboutUsNavLink.addEventListener('click', (e) => {
            e.preventDefault();
            openAboutUsModal();
            // Also close the mobile menu if it's open
            const mobileMenu = document.getElementById('mobile-nav-menu');
            if (mobileMenu) mobileMenu.classList.remove('active');
            const overlay = document.getElementById('overlay');
            if (overlay) overlay.classList.remove('active');
        });
    }

    // Event listeners for closing
    if (closeAboutUsModalBtn) {
        closeAboutUsModalBtn.addEventListener('click', closeAboutUsModal);
    }

    if (aboutUsModal) {
        aboutUsModal.addEventListener('click', (e) => {
            if (e.target === aboutUsModal) { // Clicked on the overlay itself
                closeAboutUsModal();
            }
        });
    }

    // Handle form submission for contact form within the modal
    const aboutUsContactForm = document.getElementById('about-us-contact-form');
    if (aboutUsContactForm) {
        aboutUsContactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            alert('Thank you for your message! We will get back to you soon.');
            aboutUsContactForm.reset();
            closeAboutUsModal();
        });
    }

    // --- Cart Calculation Logic ---
    const cartItemsList = document.querySelector('.cart-items-list');

    function formatCurrency(amount) {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    }

    function updateCartTotals() {
        const cartItems = document.querySelectorAll('.cart-item');
        let subtotal = 0;

        cartItems.forEach(item => {
            // If the item has been removed, it won't have a parent, so skip
            if (!item.closest('.cart-items-list')) {
                return;
            }

            const price = parseFloat(item.dataset.price);
            const quantity = parseInt(item.querySelector('.quantity-input').value, 10);
            const itemSubtotal = price * quantity;

            // Update the subtotal for the individual item
            item.querySelector('.cart-item-subtotal').textContent = formatCurrency(itemSubtotal);
            
            subtotal += itemSubtotal;
        });

        // Update the order summary
        document.getElementById('summary-subtotal').textContent = formatCurrency(subtotal);
        document.getElementById('summary-total').textContent = formatCurrency(subtotal); // Update this when shipping is added

        // If cart is now empty, display the message
        if (cartItems.length === 0) {
            document.querySelector('.cart-items-list').innerHTML = '<p class="empty-cart-message" style="text-align: center; padding: 2rem 0; color: var(--text-light);">Your shopping bag is empty.</p>';
        }
    }

    function handleQuantityChange(event) {
        const cart = JSON.parse(localStorage.getItem('luxtiveCart')) || [];
        const target = event.target;
        const cartItem = target.closest('.cart-item');
        if (!cartItem) return;

        const itemId = cartItem.dataset.id;

        if (target.classList.contains('quantity-btn') || target.classList.contains('quantity-input')) {
            const input = cartItem.querySelector('.quantity-input');
            let quantity = parseInt(input.value, 10);

            if (target.classList.contains('plus-btn')) {
                quantity++;
            } else if (target.classList.contains('minus-btn') && quantity > 1) {
                quantity--;
            } else if (target.classList.contains('quantity-input')) {
                quantity = quantity < 1 ? 1 : quantity; // Ensure quantity is at least 1
            }

            input.value = quantity;

            // Update localStorage
            const itemInCart = cart.find(item => item.id === itemId);
            if (itemInCart) {
                itemInCart.quantity = quantity;
            }

            updateCartTotals();
        }

        if (target.classList.contains('remove-btn')) {
            cartItem.remove();
            // Filter the item out of the cart array and update localStorage
            const updatedCart = cart.filter(item => item.id !== itemId);
            localStorage.setItem('luxtiveCart', JSON.stringify(updatedCart));

            // Update totals and global cart count
            updateCartTotals();
            // This assumes a global Navigation object exists, which is true from script.js
            if (window.navigation) window.navigation.updateCartCount();
            return; 
        }
        localStorage.setItem('luxtiveCart', JSON.stringify(cart));
    }

    if (cartItemsList) {
        cartItemsList.addEventListener('click', handleQuantityChange);
        cartItemsList.addEventListener('input', handleQuantityChange); // For direct input changes
        // Initial calculation on page load
        updateCartTotals();
    }

    // --- Dynamic Cart Rendering ---
    function renderCartItems() {
        const cart = JSON.parse(localStorage.getItem('luxtiveCart')) || [];
        if (!cartItemsList) return;

        if (cart.length === 0) {
            cartItemsList.innerHTML = '<p class="empty-cart-message" style="text-align: center; padding: 2rem 0; color: var(--text-light);">Your shopping bag is empty.</p>';
        } else {
            cartItemsList.innerHTML = cart.map(item => `
                <div class="cart-item" data-price="${item.price}" data-id="${item.id}">
                    <div class="cart-item-image">
                        <img src="${item.image_url}" alt="${item.name}">
                    </div>
                    <div class="cart-item-details">
                        <h3 class="item-name">${item.name}</h3>
                        <p class="item-metal">Metal: ${item.metal}</p>
                        <p class="item-price-mobile">${formatCurrency(item.price)}</p>
                    </div>
                    <div class="cart-item-quantity">
                        <button class="quantity-btn minus-btn">-</button>
                        <input type="number" class="quantity-input" value="${item.quantity}" min="1">
                        <button class="quantity-btn plus-btn">+</button>
                    </div>
                    <div class="cart-item-price-desktop">${formatCurrency(item.price)}</div>
                    <div class="cart-item-subtotal">${formatCurrency(item.price * item.quantity)}</div>
                    <div class="cart-item-remove">
                        <button class="remove-btn">&times;</button>
                    </div>
                </div>
            `).join('');
        }
        updateCartTotals();
    }

    // Initial Render
    renderCartItems();
});