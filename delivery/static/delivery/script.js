// Mobile drawer functionality
document.addEventListener('DOMContentLoaded', function() {
    const hamburgerBtn = document.getElementById('hamburgerBtn');
    const mobileDrawer = document.getElementById('mobileDrawer');
    const drawerOverlay = document.getElementById('drawerOverlay');
    const drawerClose = document.getElementById('drawerClose');
    const drawerLinks = document.querySelectorAll('.drawer-link');

    function openDrawer() {
        mobileDrawer.classList.add('active');
        drawerOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeDrawer() {
        mobileDrawer.classList.remove('active');
        drawerOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    if (hamburgerBtn) {
        hamburgerBtn.addEventListener('click', openDrawer);
    }

    if (drawerClose) {
        drawerClose.addEventListener('click', closeDrawer);
    }

    if (drawerOverlay) {
        drawerOverlay.addEventListener('click', closeDrawer);
    }

    drawerLinks.forEach(link => {
        link.addEventListener('click', closeDrawer);
    });

    // Close drawer on escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && mobileDrawer.classList.contains('active')) {
            closeDrawer();
        }
    });

    // Navbar scroll effect
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

    // --- NEW SCRIPT FOR SERVD REDESIGN ---
    
    // Food Scroll Buttons
    const foodScroll = document.getElementById('food-scroll');
    if(foodScroll) {
        document.getElementById('food-prev').addEventListener('click', () => {
            foodScroll.scrollBy({ left: -300, behavior: 'smooth' });
        });
        document.getElementById('food-next').addEventListener('click', () => {
            foodScroll.scrollBy({ left: 300, behavior: 'smooth' });
        });
    }

    // Top Restaurants Scroll Buttons
    const topResScroll = document.getElementById('top-res-scroll');
    if(topResScroll) {
        document.getElementById('top-res-prev').addEventListener('click', () => {
            topResScroll.scrollBy({ left: -320, behavior: 'smooth' });
        });
        document.getElementById('top-res-next').addEventListener('click', () => {
            topResScroll.scrollBy({ left: 320, behavior: 'smooth' });
        });
    }

    // Service Card Arrow Buttons - Scroll to food categories
    const serviceCardArrows = document.querySelectorAll('.arrow-btn');
    serviceCardArrows.forEach(arrow => {
        arrow.addEventListener('click', (e) => {
            e.stopPropagation();
            const foodCategoriesSection = document.querySelector('.food-categories-section');
            if(foodCategoriesSection) {
                foodCategoriesSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    // Hero Section Search Functionality
    const heroSearchInput = document.querySelector('.search-input input');
    const heroLocationInput = document.querySelector('.location-input input');
    
    if(heroSearchInput) {
        heroSearchInput.addEventListener('input', function(e) {
            const searchTerm = e.target.value.toLowerCase();
            const restaurantCards = document.querySelectorAll('.restaurant-card');
            
            restaurantCards.forEach(card => {
                const name = card.querySelector('.restaurant-name').textContent.toLowerCase();
                const cuisine = card.querySelector('.restaurant-cuisine').textContent.toLowerCase();
                
                if (name.includes(searchTerm) || cuisine.includes(searchTerm)) {
                    card.style.display = 'flex';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    }

    if(heroLocationInput) {
        heroLocationInput.addEventListener('input', function(e) {
            const location = e.target.value;
            // For now, just show a toast message
            // In a real app, this would filter restaurants by location
            if(location.length > 2) {
                showToast(`Searching for restaurants near "${location}"...`, 'success');
            }
        });
    }

    // Restaurant Grid Navigation Arrows
    const restaurantGrid = document.getElementById('main-restaurant-grid');
    if(restaurantGrid) {
        document.getElementById('res-grid-prev').addEventListener('click', () => {
            restaurantGrid.scrollBy({ left: -400, behavior: 'smooth' });
        });
        document.getElementById('res-grid-next').addEventListener('click', () => {
            restaurantGrid.scrollBy({ left: 400, behavior: 'smooth' });
        });
    }

    // Food Category Filtering
    const foodItems = document.querySelectorAll('.food-item');
    const mainGridCards = document.querySelectorAll('#main-restaurant-grid .restaurant-card');
    const filterTag = document.getElementById('active-filter-tag');
    const filterName = document.getElementById('filter-name');
    const clearFilterBtn = document.getElementById('clear-filter');

    // Mock category mapping for filtering
    const categoryMap = {
        'Biryani': ['biryani', 'indian', 'mughlai', 'andhra', 'hyderabadi', 'north indian'],
        'Pizza': ['pizza', 'italian'],
        'Burger': ['burger', 'american', 'fast food'],
        'Cake': ['desserts', 'bakery', 'cakes'],
        'Coffee': ['beverages', 'cafe', 'coffee'],
        'Dosa': ['south indian', 'dosa'],
        'Idli': ['south indian', 'idli', 'vegetarian'],
        'Vada': ['south indian', 'snacks'],
        'Salad': ['healthy', 'salad', 'sandwiches'],
        'Juice': ['beverages', 'healthy', 'juices'],
        'Poha': ['snacks', 'indian', 'breakfast'],
        'Omelette': ['snacks', 'american', 'breakfast', 'eggs'],
        'Shake': ['beverages', 'desserts', 'shakes'],
        'Pancake': ['american', 'desserts', 'breakfast', 'pancakes'],
        'Chole Bhature': ['north indian', 'punjabi', 'snacks'],
        'Tea': ['beverages', 'cafe', 'tea', 'chai'],
        'Beverages': ['beverages', 'cafe', 'drinks', 'coffee', 'tea']
    };

    // Expanded mock database for 10 restaurants with full menus
    window.restaurantDatabase = {
        101: {
            name: 'Truffles',
            img: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=800&q=80',
            rating: '★ 4.6',
            cuisine: 'American, Burgers, Desserts',
            deliveryTime: '35-45 mins',
            priceForTwo: '₹400',
            category: 'Burger',
            menu: {
                starters: [
                    { name: 'Loaded Nachos', desc: 'Crispy tortilla chips with cheese sauce and jalapeños', price: '₹220', veg: true },
                    { name: 'Chicken Wings', desc: 'Spicy buffalo wings with ranch dip', price: '₹280', veg: false },
                    { name: 'Caesar Salad', desc: 'Fresh romaine with parmesan and croutons', price: '₹180', veg: true }
                ],
                mains: [
                    { name: 'Classic Beef Burger', desc: 'Juicy beef patty with lettuce, tomato, cheese', price: '₹350', veg: false },
                    { name: 'Veggie Supreme Burger', desc: 'Crispy veggie patty with fresh vegetables', price: '₹290', veg: true },
                    { name: 'Chicken BBQ Burger', desc: 'Grilled chicken with BBQ sauce and onions', price: '₹380', veg: false }
                ],
                desserts: [
                    { name: 'Chocolate Brownie', desc: 'Warm fudge brownie with vanilla ice cream', price: '₹150', veg: true },
                    { name: 'Red Velvet Cake', desc: 'Classic red velvet with cream cheese frosting', price: '₹180', veg: true },
                    { name: 'Cheesecake', desc: 'New York style cheesecake with berry compote', price: '₹200', veg: true }
                ],
                beverages: [
                    { name: 'Cold Coffee', desc: 'Blended iced coffee with chocolate syrup', price: '₹120', veg: true },
                    { name: 'Fresh Lime Soda', desc: 'Refreshing sweet and salt lime soda', price: '₹80', veg: true },
                    { name: 'Iced Tea', desc: 'Peach flavored iced tea with mint', price: '₹90', veg: true }
                ]
            }
        },
        102: {
            name: 'Meghana Foods',
            img: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80',
            rating: '★ 4.8',
            cuisine: 'Biryani, Andhra, South Indian',
            deliveryTime: '40-50 mins',
            priceForTwo: '₹600',
            category: 'Biryani',
            menu: {
                starters: [
                    { name: 'Chicken 65', desc: 'Spicy deep fried chicken with curry leaves', price: '₹240', veg: false },
                    { name: 'Gobi Manchurian', desc: 'Crispy cauliflower in Indo-Chinese sauce', price: '₹180', veg: true },
                    { name: 'Paneer Tikka', desc: 'Grilled cottage cheese with spices', price: '₹220', veg: true }
                ],
                mains: [
                    { name: 'Hyderabadi Biryani', desc: 'Aromatic basmati rice with tender chicken', price: '₹380', veg: false },
                    { name: 'Mutton Biryani', desc: 'Rich and flavorful mutton biryani', price: '₹450', veg: false },
                    { name: 'Veg Biryani', desc: 'Mixed vegetables in spiced rice', price: '₹280', veg: true }
                ],
                desserts: [
                    { name: 'Double Ka Meetha', desc: 'Traditional bread pudding with nuts', price: '₹120', veg: true },
                    { name: 'Qubani Ka Meetha', desc: 'Apricot dessert with cream', price: '₹140', veg: true }
                ],
                beverages: [
                    { name: 'Buttermilk', desc: 'Spiced Indian buttermilk', price: '₹50', veg: true },
                    { name: 'Mango Lassi', desc: 'Creamy mango yogurt drink', price: '₹100', veg: true }
                ]
            }
        },
        103: {
            name: 'Empire Restaurant',
            img: 'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?w=800&q=80',
            rating: '★ 4.3',
            cuisine: 'North Indian, Mughlai, Chinese',
            deliveryTime: '30-40 mins',
            priceForTwo: '₹450',
            category: 'Biryani',
            menu: {
                starters: [
                    { name: 'Seekh Kebab', desc: 'Minced lamb kebabs with spices', price: '₹260', veg: false },
                    { name: 'Hara Bhara Kabab', desc: 'Spinach and green pea patties', price: '₹190', veg: true },
                    { name: 'Chicken Reshmi Kebab', desc: 'Creamy chicken kebabs', price: '₹240', veg: false }
                ],
                mains: [
                    { name: 'Butter Chicken', desc: 'Creamy tomato gravy with roasted chicken', price: '₹350', veg: false },
                    { name: 'Paneer Butter Masala', desc: 'Rich and creamy cottage cheese curry', price: '₹290', veg: true },
                    { name: 'Dal Makhani', desc: 'Slow cooked black lentils with cream', price: '₹240', veg: true }
                ],
                desserts: [
                    { name: 'Gulab Jamun', desc: 'Deep fried milk solids in sugar syrup', price: '₹90', veg: true },
                    { name: 'Rasmalai', desc: 'Soft paneer dumplings in saffron milk', price: '₹120', veg: true }
                ],
                beverages: [
                    { name: 'Masala Chai', desc: 'Spiced Indian tea', price: '₹40', veg: true },
                    { name: 'Sweet Lassi', desc: 'Sweet yogurt drink', price: '₹70', veg: true }
                ]
            }
        },
        104: {
            name: 'Rameshwaram Cafe',
            img: 'https://images.unsplash.com/photo-1544148103-0773bf10d330?w=800&q=80',
            rating: '★ 4.7',
            cuisine: 'South Indian, Snacks',
            deliveryTime: '25-35 mins',
            priceForTwo: '₹250',
            category: 'Dosa',
            menu: {
                starters: [
                    { name: 'Masala Vada', desc: 'Crispy lentil fritters', price: '₹60', veg: true },
                    { name: 'Medu Vada', desc: 'Soft and crispy urad dal vadas', price: '₹50', veg: true },
                    { name: 'Onion Pakoda', desc: 'Crispy onion fritters', price: '₹70', veg: true }
                ],
                mains: [
                    { name: 'Masala Dosa', desc: 'Crispy dosa with potato filling', price: '₹120', veg: true },
                    { name: 'Ghee Roast Dosa', desc: 'Dosa roasted in pure ghee', price: '₹140', veg: true },
                    { name: 'Onion Rava Dosa', desc: 'Semolina dosa with onions', price: '₹130', veg: true },
                    { name: 'Idli Sambar', desc: 'Steamed rice cakes with lentil soup', price: '₹80', veg: true }
                ],
                desserts: [
                    { name: 'Kesari Bath', desc: 'Semolina pudding with saffron', price: '₹80', veg: true },
                    { name: 'Mysore Pak', desc: 'Traditional gram flour sweet', price: '₹90', veg: true }
                ],
                beverages: [
                    { name: 'Filter Coffee', desc: 'Traditional South Indian coffee', price: '₹50', veg: true },
                    { name: 'Badam Milk', desc: 'Almond flavored milk', price: '₹80', veg: true }
                ]
            }
        },
        105: {
            name: "Glen's Bakehouse",
            img: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&q=80',
            rating: '★ 4.5',
            cuisine: 'Bakery, Desserts, Italian',
            deliveryTime: '35-45 mins',
            priceForTwo: '₹500',
            category: 'Cake',
            menu: {
                starters: [
                    { name: 'Bruschetta', desc: 'Toasted bread with tomato and basil', price: '₹180', veg: true },
                    { name: 'Garlic Bread', desc: 'Buttery garlic bread with herbs', price: '₹140', veg: true }
                ],
                mains: [
                    { name: 'Margherita Pizza', desc: 'Classic pizza with tomato and mozzarella', price: '₹380', veg: true },
                    { name: 'Pasta Alfredo', desc: 'Creamy white sauce pasta', price: '₹320', veg: true },
                    { name: 'Mushroom Risotto', desc: 'Creamy arborio rice with mushrooms', price: '₹350', veg: true }
                ],
                desserts: [
                    { name: 'Red Velvet Cake', desc: 'Classic red velvet with cream cheese', price: '₹350', veg: true },
                    { name: 'Chocolate Truffle Cake', desc: 'Rich chocolate layered cake', price: '₹380', veg: true },
                    { name: 'New York Cheesecake', desc: 'Creamy cheesecake with berry sauce', price: '₹320', veg: true },
                    { name: 'Tiramisu', desc: 'Italian coffee-flavored dessert', price: '₹300', veg: true }
                ],
                beverages: [
                    { name: 'Cappuccino', desc: 'Espresso with steamed milk foam', price: '₹140', veg: true },
                    { name: 'Hot Chocolate', desc: 'Rich chocolate with whipped cream', price: '₹120', veg: true }
                ]
            }
        },
        106: {
            name: 'KFC',
            img: 'https://images.unsplash.com/photo-1600891964092-4316c288032e?w=800&q=80',
            rating: '★ 4.2',
            cuisine: 'American, Fast Food',
            deliveryTime: '25-35 mins',
            priceForTwo: '₹400',
            category: 'Burger',
            menu: {
                starters: [
                    { name: 'Popcorn Chicken', desc: 'Crispy bite-sized chicken pieces', price: '₹199', veg: false },
                    { name: 'Chicken Wings', desc: 'Spicy chicken wings', price: '₹249', veg: false }
                ],
                mains: [
                    { name: 'Zinger Burger', desc: 'Crispy chicken fillet burger', price: '₹199', veg: false },
                    { name: 'Chicken Bucket', desc: '8 pieces of crispy fried chicken', price: '₹599', veg: false },
                    { name: 'Rice Bowl', desc: 'Chicken with rice and gravy', price: '₹179', veg: false }
                ],
                desserts: [
                    { name: 'Choco Lava Cake', desc: 'Warm chocolate cake with molten center', price: '₹99', veg: true }
                ],
                beverages: [
                    { name: 'Pepsi', desc: 'Chilled Pepsi', price: '₹60', veg: true },
                    { name: 'Pepsi Black', desc: 'Diet Pepsi', price: '₹60', veg: true }
                ]
            }
        },
        107: {
            name: 'Pizza Hut',
            img: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&q=80',
            rating: '★ 4.1',
            cuisine: 'Italian, Pizza, Fast Food',
            deliveryTime: '30-40 mins',
            priceForTwo: '₹450',
            category: 'Pizza',
            menu: {
                starters: [
                    { name: 'Garlic Bread', desc: 'Toasted bread with garlic butter', price: '₹129', veg: true },
                    { name: 'Potato Wedges', desc: 'Crispy seasoned potato wedges', price: '₹149', veg: true }
                ],
                mains: [
                    { name: 'Margherita Pizza', desc: 'Classic cheese and tomato pizza', price: '₹349', veg: true },
                    { name: 'Pepperoni Pizza', desc: 'Loaded with pepperoni slices', price: '₹449', veg: false },
                    { name: 'Veggie Supreme', desc: 'Loaded with fresh vegetables', price: '₹399', veg: true }
                ],
                desserts: [
                    { name: 'Choco Lava Cake', desc: 'Warm chocolate cake', price: '₹99', veg: true },
                    { name: 'Ice Cream Sundae', desc: 'Vanilla ice cream with toppings', price: '₹79', veg: true }
                ],
                beverages: [
                    { name: 'Pepsi', desc: 'Chilled Pepsi', price: '₹60', veg: true },
                    { name: 'Mountain Dew', desc: 'Citrus flavored soda', price: '₹60', veg: true }
                ]
            }
        },
        108: {
            name: 'Chai Point',
            img: 'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?w=800&q=80',
            rating: '★ 4.4',
            cuisine: 'Beverages, Cafe, Snacks',
            deliveryTime: '15-25 mins',
            priceForTwo: '₹150',
            category: 'Coffee',
            menu: {
                starters: [
                    { name: 'Samosa', desc: 'Crispy pastry with spiced potato filling', price: '₹30', veg: true },
                    { name: 'Vada Pav', desc: 'Spiced potato patty in bread bun', price: '₹40', veg: true }
                ],
                mains: [
                    { name: 'Masala Chai', desc: 'Spiced Indian tea with milk', price: '₹40', veg: true },
                    { name: 'Ginger Chai', desc: 'Tea with fresh ginger', price: '₹45', veg: true },
                    { name: 'Cutting Chai', desc: 'Strong tea in small glass', price: '₹30', veg: true }
                ],
                desserts: [
                    { name: 'Rusk', desc: 'Twice-baked bread', price: '₹25', veg: true },
                    { name: 'Biscuit', desc: 'Assorted tea biscuits', price: '₹30', veg: true }
                ],
                beverages: [
                    { name: 'Cold Coffee', desc: 'Iced coffee with chocolate', price: '₹80', veg: true },
                    { name: 'Iced Tea', desc: 'Lemon iced tea', price: '₹70', veg: true },
                    { name: 'Mango Smoothie', desc: 'Fresh mango blended smoothie', price: '₹90', veg: true }
                ]
            }
        },
        109: {
            name: 'Saravana Bhavan',
            img: 'https://images.unsplash.com/photo-1589301760014-d929f39ce9b1?w=800&q=80',
            rating: '★ 4.6',
            cuisine: 'South Indian, Vegetarian',
            deliveryTime: '30-40 mins',
            priceForTwo: '₹300',
            category: 'Idli',
            menu: {
                starters: [
                    { name: 'Medu Vada', desc: 'Crispy urad dal fritters', price: '₹55', veg: true },
                    { name: 'Paniyaram', desc: 'Steamed rice and lentil balls', price: '₹60', veg: true }
                ],
                mains: [
                    { name: 'Ghee Podi Idli', desc: 'Idli with ghee and spice powder', price: '₹90', veg: true },
                    { name: 'Sambar Idli', desc: 'Idli soaked in sambar', price: '₹85', veg: true },
                    { name: 'Masala Dosa', desc: 'Crispy dosa with potato filling', price: '₹130', veg: true },
                    { name: 'Rava Dosa', desc: 'Crispy semolina dosa', price: '₹120', veg: true }
                ],
                desserts: [
                    { name: 'Kesari Bath', desc: 'Saffron semolina pudding', price: '₹75', veg: true },
                    { name: 'Badam Halwa', desc: 'Almond sweet', price: '₹120', veg: true }
                ],
                beverages: [
                    { name: 'Filter Coffee', desc: 'Traditional South Indian coffee', price: '₹45', veg: true },
                    { name: 'Badam Milk', desc: 'Almond milk', price: '₹70', veg: true }
                ]
            }
        },
        110: {
            name: 'Subway',
            img: 'https://images.unsplash.com/photo-1505394033641-40c6ad1178d7?w=800&q=80',
            rating: '★ 4.3',
            cuisine: 'American, Sandwiches, Healthy',
            deliveryTime: '20-30 mins',
            priceForTwo: '₹350',
            category: 'Salad',
            menu: {
                starters: [
                    { name: 'Veggie Patty', desc: 'Crispy vegetable patty', price: '₹150', veg: true },
                    { name: 'Chicken Patty', desc: 'Spiced chicken patty', price: '₹180', veg: false }
                ],
                mains: [
                    { name: 'Veggie Delight Sub', desc: 'Fresh vegetables in Italian bread', price: '₹220', veg: true },
                    { name: 'Chicken Tikka Sub', desc: 'Spiced chicken with vegetables', price: '₹280', veg: false },
                    { name: 'Tuna Sub', desc: 'Tuna with fresh vegetables', price: '₹320', veg: false }
                ],
                desserts: [
                    { name: 'Cookie', desc: 'Chocolate chip cookie', price: '₹50', veg: true },
                    { name: 'Brownie', desc: 'Fudgy chocolate brownie', price: '₹70', veg: true }
                ],
                beverages: [
                    { name: 'Fresh Lime', desc: 'Refreshing lime soda', price: '₹60', veg: true },
                    { name: 'Iced Tea', desc: 'Peach iced tea', price: '₹70', veg: true }
                ]
            }
        }
    };

    function filterByFood(category) {
        const keywords = categoryMap[category] || [category.toLowerCase()];
        
        mainGridCards.forEach(card => {
            const cuisineStr = card.getAttribute('data-cuisine').toLowerCase();
            const nameStr = card.getAttribute('data-name').toLowerCase();
            
            const matches = keywords.some(kw => cuisineStr.includes(kw) || nameStr.includes(kw));
            
            if(matches) {
                card.style.display = 'flex';
                card.classList.add('fade-up');
            } else {
                card.style.display = 'none';
            }
        });

        if (filterName && filterTag) {
            filterName.textContent = category;
            filterTag.style.display = 'inline-flex';
            document.querySelector('.restaurants-section').scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }

    foodItems.forEach(item => {
        item.addEventListener('click', () => {
            const cat = item.getAttribute('data-category');
            filterByFood(cat);
        });
    });

    if(clearFilterBtn) {
        clearFilterBtn.addEventListener('click', () => {
            mainGridCards.forEach(card => {
                card.style.display = 'flex';
            });
            filterTag.style.display = 'none';
        });
    }

    // Modal Logic
    const modalOverlay = document.getElementById('restaurantModalOverlay');
    const closeBtn = document.getElementById('closeRestaurantModal');
    
    if(closeBtn) {
        closeBtn.addEventListener('click', () => {
            modalOverlay.classList.remove('active');
            document.body.style.overflow = 'auto'; // restore scroll
        });
    }

    if(modalOverlay) {
        modalOverlay.addEventListener('click', (e) => {
            if(e.target === modalOverlay) {
                modalOverlay.classList.remove('active');
                document.body.style.overflow = 'auto';
            }
        });
    }

    // Tab Logic inside modal
    const menuTabs = document.querySelectorAll('.menu-tab');
    menuTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            menuTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            // Populate restaurant-specific menu based on tab
            populateRestaurantMenu(tab.getAttribute('data-target'));
        });
    });

});

// Global function to open modal
window.openRestaurantModal = function(id) {
    const modalOverlay = document.getElementById('restaurantModalOverlay');
    const modalRestImg = document.getElementById('modalRestImg');
    const modalRestName = document.getElementById('modalRestName');
    const modalRestRating = document.getElementById('modalRestRating');
    const modalRestCuisine = document.getElementById('modalRestCuisine');
    
    // Store current restaurant ID for menu population
    window.currentRestaurantId = id;

    // If card clicked is from django loop, extract data
    const card = document.querySelector(`.restaurant-card[data-id="${id}"]`);
    if(card) {
        const imgElement = card.querySelector('img');
        const img = imgElement ? imgElement.src : '';
        const name = card.getAttribute('data-name');
        const cuisine = card.getAttribute('data-cuisine');
        const ratingNode = card.querySelector('.rating');
        const rating = ratingNode ? ratingNode.textContent.trim() : '★ 4.0';
        
        modalRestImg.src = img;
        modalRestName.textContent = name;
        modalRestCuisine.textContent = cuisine;
        modalRestRating.textContent = rating;
    } else if (window.restaurantDatabase && window.restaurantDatabase[id]) {
        const data = window.restaurantDatabase[id];
        modalRestImg.src = data.img;
        modalRestName.textContent = data.name;
        modalRestCuisine.textContent = data.cuisine;
        modalRestRating.textContent = data.rating;
    } else {
        modalRestImg.src = 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80';
        modalRestName.textContent = 'Restaurant';
        modalRestCuisine.textContent = 'Various';
        modalRestRating.textContent = '★ 4.0';
    }

    populateRestaurantMenu('starters'); // Default tab
    document.querySelector('.menu-tab[data-target="starters"]').click();

    if (modalOverlay) {
        modalOverlay.classList.add('active');
        document.body.style.overflow = 'hidden'; // prevent bg scroll
    }
};

window.populateRestaurantMenu = function(category) {
    const container = document.getElementById('modalMenuItems');
    if (!container) return;
    
    let html = '';
    
    // Get restaurant-specific menu from database
    const restaurantId = window.currentRestaurantId;
    let menuItems = [];
    
    if (window.restaurantDatabase && window.restaurantDatabase[restaurantId] && window.restaurantDatabase[restaurantId].menu[category]) {
        menuItems = window.restaurantDatabase[restaurantId].menu[category];
    } else {
        // Fallback to default items if restaurant not found
        const defaultItems = {
            'starters': [
                { name: 'Crispy Paneer', desc: 'Deep fried cottage cheese tossed in spicy sauce', price: '₹220', veg: true },
                { name: 'Chicken Tikka', desc: 'Tandoori roasted marinated chicken chunks', price: '₹280', veg: false },
                { name: 'Gobi Manchurian', desc: 'Crispy cauliflower tossed in indo-chinese sauce', price: '₹180', veg: true }
            ],
            'mains': [
                { name: 'Butter Chicken', desc: 'Creamy tomato gravy with roasted chicken', price: '₹350', veg: false },
                { name: 'Paneer Butter Masala', desc: 'Rich and creamy cottage cheese curry', price: '₹290', veg: true },
                { name: 'Dal Makhani', desc: 'Slow cooked black lentils with cream and butter', price: '₹240', veg: true }
            ],
            'desserts': [
                { name: 'Chocolate Brownie', desc: 'Warm fudge brownie with chocolate sauce', price: '₹150', veg: true },
                { name: 'Gulab Jamun', desc: 'Deep fried milk solids soaked in sugar syrup', price: '₹90', veg: true }
            ],
            'beverages': [
                { name: 'Cold Coffee', desc: 'Blended iced coffee with ice cream', price: '₹120', veg: true },
                { name: 'Fresh Lime Soda', desc: 'Refreshing sweet and salt lime soda', price: '₹80', veg: true }
            ]
        };
        menuItems = defaultItems[category] || defaultItems['starters'];
    }

    menuItems.forEach(item => {
        const dotClass = item.veg ? 'veg-dot' : 'nonveg-dot';
        html += `
        <div class="menu-item-row">
            <div class="item-info">
                <div class="item-header">
                    <span class="${dotClass}"></span>
                    <span class="item-name">${item.name}</span>
                </div>
                <div class="item-desc">${item.desc}</div>
                <div class="item-price">${item.price}</div>
            </div>
            <button class="add-btn" onclick="addToCartAnimation(this)">+ ADD</button>
        </div>
        `;
    });

    container.innerHTML = html;
}

// Keep old function name for backward compatibility
window.populateMockMenu = window.populateRestaurantMenu;

window.addToCartAnimation = function(btn) {
    btn.innerHTML = 'ADDED ✓';
    btn.style.background = '#10B981';
    btn.style.borderColor = '#10B981';
    btn.style.color = '#fff';
    
    // Animate cart count if exists
    const cartCount = document.querySelector('.cart-count');
    if(cartCount) {
        let count = parseInt(cartCount.textContent) || 0;
        cartCount.textContent = count + 1;
        cartCount.style.animation = 'none';
        setTimeout(() => cartCount.style.animation = 'badge-pulse 2s ease-in-out infinite', 10);
    }

    setTimeout(() => {
        btn.innerHTML = '+ ADD';
        btn.style.background = 'rgba(59,130,246,0.1)';
        btn.style.borderColor = '#3B82F6';
        btn.style.color = '#3B82F6';
    }, 2000);
};

// --- PAGINATION LOGIC ---
document.addEventListener('DOMContentLoaded', () => {
    function setupGridPagination(gridId, prevBtnId, nextBtnId, dotsContainerId) {
        const grid = document.getElementById(gridId);
        if (!grid) return null;

        let allCards = Array.from(grid.querySelectorAll('.restaurant-card'));
        if (allCards.length === 0) return null;

        const prevBtn = document.getElementById(prevBtnId);
        const nextBtn = document.getElementById(nextBtnId);
        const dotsContainer = document.getElementById(dotsContainerId);

        let currentPage = 0;
        
        function getItemsPerPage() {
            if (window.innerWidth <= 480) return 1;
            if (window.innerWidth <= 768) return 2;
            return 4;
        }

        let itemsPerPage = getItemsPerPage();
        
        window.addEventListener('resize', () => {
            const newIPP = getItemsPerPage();
            if (newIPP !== itemsPerPage) {
                itemsPerPage = newIPP;
                currentPage = 0;
                renderPage();
            }
        });

        function renderPage() {
            allCards.forEach(card => card.style.display = 'none');
            const totalPages = Math.ceil(allCards.length / itemsPerPage);
            
            if (currentPage < 0) currentPage = 0;
            if (currentPage >= totalPages) currentPage = totalPages - 1;
            if (currentPage < 0) currentPage = 0;
            
            const start = currentPage * itemsPerPage;
            const end = start + itemsPerPage;
            const visible = allCards.slice(start, end);
            
            grid.style.opacity = '0';
            setTimeout(() => {
                visible.forEach(card => card.style.display = 'flex');
                grid.style.opacity = '1';
            }, 300);

            if (prevBtn) prevBtn.disabled = (currentPage === 0);
            if (nextBtn) nextBtn.disabled = (currentPage >= totalPages - 1 || totalPages === 0);

            if (dotsContainer) {
                dotsContainer.innerHTML = '';
                for (let i = 0; i < totalPages; i++) {
                    const dot = document.createElement('div');
                    dot.className = 'page-dot' + (i === currentPage ? ' active' : '');
                    dot.addEventListener('click', () => {
                        currentPage = i;
                        renderPage();
                    });
                    dotsContainer.appendChild(dot);
                }
            }
        }

        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                if (currentPage > 0) {
                    currentPage--;
                    renderPage();
                }
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                const totalPages = Math.ceil(allCards.length / itemsPerPage);
                if (currentPage < totalPages - 1) {
                    currentPage++;
                    renderPage();
                }
            });
        }

        renderPage();

        return {
            updateCards: (newCards) => {
                allCards = newCards;
                currentPage = 0;
                renderPage();
            }
        };
    }

    const mainGridPagination = setupGridPagination('main-restaurant-grid', 'res-grid-prev', 'res-grid-next', 'res-pagination-dots');
    setupGridPagination('top-res-grid', 'top-res-prev', 'top-res-next', 'top-res-pagination-dots');

    // Hook into category filtering if it exists
    // Overwrite the filterByFood to reset pagination based on filtered cards
    const originalFilterFn = window.filterByFood;
    if (typeof originalFilterFn === 'undefined') {
        // We can just redefine it or update allCards list in filter
        const categoryMap = {
            'Biryani': ['biryani', 'indian', 'mughlai'],
            'Pizza': ['pizza', 'italian'],
            'Burger': ['burger', 'american', 'fast food'],
            'Cake': ['desserts', 'bakery'],
            'Coffee': ['beverages', 'cafe'],
            'Dosa': ['south indian'],
            'Idli': ['south indian'],
            'Vada': ['south indian'],
            'Salad': ['healthy', 'salad'],
            'Juice': ['beverages', 'healthy'],
            'Poha': ['snacks', 'indian'],
            'Omelette': ['snacks', 'american'],
            'Shake': ['beverages', 'desserts'],
            'Pancake': ['american', 'desserts'],
            'Chole Bhature': ['north indian']
        };
        const filterName = document.getElementById('filter-name');
        const filterTag = document.getElementById('active-filter-tag');
        
        window.filterByFood = function(category) {
            const keywords = categoryMap[category] || [category.toLowerCase()];
            const mainGridCards = document.querySelectorAll('#main-restaurant-grid .restaurant-card');
            
            let matchedCards = [];
            
            mainGridCards.forEach(card => {
                const cuisineStr = card.getAttribute('data-cuisine').toLowerCase();
                const nameStr = card.getAttribute('data-name').toLowerCase();
                
                const matches = keywords.some(kw => cuisineStr.includes(kw) || nameStr.includes(kw));
                
                if(matches) {
                    matchedCards.push(card);
                }
                card.style.display = 'none'; // hide all initially
            });
            
            if (mainGridPagination) {
                mainGridPagination.updateCards(matchedCards);
            }

            if (filterName && filterTag) {
                filterName.textContent = category;
                filterTag.style.display = 'inline-flex';
                document.querySelector('.restaurants-section').scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }
        
        const clearFilterBtn = document.getElementById('clear-filter');
        if(clearFilterBtn) {
            clearFilterBtn.addEventListener('click', () => {
                if (mainGridPagination) {
                    mainGridPagination.updateCards(Array.from(document.querySelectorAll('#main-restaurant-grid .restaurant-card')));
                }
                if(filterTag) filterTag.style.display = 'none';
            });
        }
    }

    // --- LOCATION INPUT ---
    const locationInputContainer = document.getElementById('location-input-container');
    const locationInput = document.getElementById('location-input');
    const locationDropdown = document.getElementById('location-dropdown');
    
    if (locationInputContainer && locationInput && locationDropdown) {
        locationInput.addEventListener('click', () => {
            locationDropdown.classList.toggle('active');
        });
        
        const locRows = locationDropdown.querySelectorAll('.loc-row');
        locRows.forEach(row => {
            row.addEventListener('click', (e) => {
                locationInput.value = e.target.textContent;
                locationDropdown.classList.remove('active');
            });
        });
        
        document.addEventListener('click', (e) => {
            if (!locationInputContainer.contains(e.target)) {
                locationDropdown.classList.remove('active');
            }
        });
    }

    // --- SEARCH BAR ---
    const searchInputContainer = document.getElementById('search-input-container');
    const searchInput = document.getElementById('search-input');
    const searchDropdown = document.getElementById('search-dropdown');
    
    if (searchInputContainer && searchInput && searchDropdown) {
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.trim().toLowerCase();
            if (query === '') {
                searchDropdown.classList.remove('active');
                return;
            }
            
            searchDropdown.classList.add('active');
            searchDropdown.innerHTML = ''; // clear previous
            
            const mainGridCards = Array.from(document.querySelectorAll('#main-restaurant-grid .restaurant-card'));
            let matchedCards = [];
            
            mainGridCards.forEach(card => {
                const name = card.getAttribute('data-name');
                const cuisine = card.getAttribute('data-cuisine');
                if (name && cuisine) {
                    if (name.toLowerCase().includes(query) || cuisine.toLowerCase().includes(query)) {
                        matchedCards.push({ name, cuisine, element: card });
                    }
                }
            });
            
            if (matchedCards.length > 0) {
                matchedCards.forEach(item => {
                    const row = document.createElement('div');
                    row.className = 'search-result-row';
                    row.innerHTML = `
                        <div class="search-result-name">${item.name}</div>
                        <div class="search-result-cuisine">${item.cuisine}</div>
                    `;
                    row.addEventListener('click', () => {
                        searchDropdown.classList.remove('active');
                        searchInput.value = item.name;
                        
                        // Scroll to section and card
                        const rect = item.element.getBoundingClientRect();
                        const scrollTop = window.scrollY || document.documentElement.scrollTop;
                        const top = rect.top + scrollTop - 100; // offset
                        window.scrollTo({ top, behavior: 'smooth' });
                        
                        // Highlight card
                        item.element.classList.add('card-highlight');
                        setTimeout(() => {
                            item.element.classList.remove('card-highlight');
                        }, 2000);
                    });
                    searchDropdown.appendChild(row);
                });
            } else {
                const empty = document.createElement('div');
                empty.className = 'search-empty';
                empty.textContent = 'No restaurants found';
                searchDropdown.appendChild(empty);
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                searchDropdown.classList.remove('active');
            }
        });
        
        document.addEventListener('click', (e) => {
            if (!searchInputContainer.contains(e.target)) {
                searchDropdown.classList.remove('active');
            }
        });
    }

    // --- SERVICE CARDS SMOOTH SCROLL ---
    const cardFoodDelivery = document.getElementById('card-food-delivery');
    const cardGroceries = document.getElementById('card-groceries');
    const cardDineout = document.getElementById('card-dineout');
    
    if (cardFoodDelivery) {
        cardFoodDelivery.addEventListener('click', () => {
            const section = document.querySelector('.restaurants-section');
            if (section) section.scrollIntoView({ behavior: 'smooth' });
        });
    }
    
    if (cardGroceries) {
        cardGroceries.addEventListener('click', () => {
            const section = document.querySelector('.food-categories-section');
            if (section) section.scrollIntoView({ behavior: 'smooth' });
        });
    }
    
    if (cardDineout) {
        cardDineout.addEventListener('click', () => {
            const section = document.querySelector('.top-restaurants-section');
            if (section) section.scrollIntoView({ behavior: 'smooth' });
        });
    }
});
