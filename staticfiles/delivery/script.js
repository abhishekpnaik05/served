// Navbar scroll effect
document.addEventListener('DOMContentLoaded', function() {
    const navbar = document.querySelector('.navbar');
    
    if (navbar) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
    }
    
    // Category filter chip interactions
    const categoryChips = document.querySelectorAll('.category-chip');
    
    categoryChips.forEach(chip => {
        chip.addEventListener('click', function() {
            // Remove active class from all chips
            categoryChips.forEach(c => c.classList.remove('active'));
            // Add active class to clicked chip
            this.classList.add('active');
            
            // Get the category text
            const category = this.textContent.trim();
            
            // Filter restaurants based on category
            filterRestaurants(category);
        });
    });
    
    // Function to filter restaurants
    function filterRestaurants(category) {
        const restaurantCards = document.querySelectorAll('.restaurant-card');
        
        restaurantCards.forEach(card => {
            const cuisine = card.querySelector('.restaurant-cuisine').textContent.toLowerCase();
            const restaurantName = card.querySelector('.restaurant-name').textContent.toLowerCase();
            
            if (category === 'All' || 
                cuisine.includes(category.toLowerCase()) || 
                restaurantName.includes(category.toLowerCase())) {
                card.style.display = 'block';
                card.classList.add('fade-up');
            } else {
                card.style.display = 'none';
            }
        });
    }
    
    // Search functionality
    const searchInput = document.querySelector('.navbar-search input');
    
    if (searchInput) {
        searchInput.addEventListener('input', function(e) {
            const searchTerm = e.target.value.toLowerCase();
            const restaurantCards = document.querySelectorAll('.restaurant-card');
            
            restaurantCards.forEach(card => {
                const name = card.querySelector('.restaurant-name').textContent.toLowerCase();
                const cuisine = card.querySelector('.restaurant-cuisine').textContent.toLowerCase();
                
                if (name.includes(searchTerm) || cuisine.includes(searchTerm)) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    }
    
    // Add to cart button with AJAX
    const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');
    
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            const url = this.getAttribute('href');
            const originalText = this.textContent;
            
            // Show loading state
            this.textContent = 'Adding...';
            this.disabled = true;
            
            fetch(url, {
                method: 'POST',
                headers: {
                    'X-CSRFToken': getCookie('csrftoken'),
                    'Content-Type': 'application/json',
                },
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    // Update button
                    this.textContent = 'Added!';
                    this.style.backgroundColor = 'var(--green)';
                    this.style.color = '#fff';
                    
                    // Update cart count in navbar
                    const cartCount = document.querySelector('.cart-count');
                    if (cartCount) {
                        cartCount.textContent = data.cart_count;
                    }
                    
                    // Show toast notification
                    showToast(data.message, 'success');
                    
                    // Reset button after delay
                    setTimeout(() => {
                        this.textContent = originalText;
                        this.style.backgroundColor = '';
                        this.style.color = '';
                        this.disabled = false;
                    }, 2000);
                } else {
                    showToast(data.message, 'error');
                    this.textContent = originalText;
                    this.disabled = false;
                }
            })
            .catch(error => {
                console.error('Error:', error);
                showToast('Failed to add to cart', 'error');
                this.textContent = originalText;
                this.disabled = false;
            });
        });
    });
    
    // Get CSRF token
    function getCookie(name) {
        let cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            const cookies = document.cookie.split(';');
            for (let i = 0; i < cookies.length; i++) {
                const cookie = cookies[i].trim();
                if (cookie.substring(0, name.length + 1) === (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }
    
    // Show toast notification
    function showToast(message, type = 'success') {
        // Remove existing toast if any
        const existingToast = document.querySelector('.toast-notification');
        if (existingToast) {
            existingToast.remove();
        }
        
        // Create toast element
        const toast = document.createElement('div');
        toast.className = `toast-notification toast-${type}`;
        toast.textContent = message;
        
        // Add styles
        toast.style.cssText = `
            position: fixed;
            bottom: 30px;
            right: 30px;
            background-color: ${type === 'success' ? '#1BA672' : '#FF4D4F'};
            color: #fff;
            padding: 16px 24px;
            border-radius: 12px;
            box-shadow: 0 4px 16px rgba(0,0,0,0.2);
            font-weight: 600;
            font-size: 14px;
            z-index: 10000;
            animation: slideIn 0.3s ease;
            font-family: 'Poppins', sans-serif;
        `;
        
        // Add animation keyframes
        if (!document.querySelector('#toast-animations')) {
            const style = document.createElement('style');
            style.id = 'toast-animations';
            style.textContent = `
                @keyframes slideIn {
                    from {
                        transform: translateX(400px);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(0);
                        opacity: 1;
                    }
                }
                @keyframes slideOut {
                    from {
                        transform: translateX(0);
                        opacity: 1;
                    }
                    to {
                        transform: translateX(400px);
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(style);
        }
        
        document.body.appendChild(toast);
        
        // Remove after 3 seconds
        setTimeout(() => {
            toast.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                toast.remove();
            }, 300);
        }, 3000);
    }
});
