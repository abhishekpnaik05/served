# FinalMealmate - Food Delivery Web App

A Django-based food delivery application similar to Swiggy/Uber Eats with modern UI, restaurant management, menu management, cart functionality, and Razorpay payment integration.

## 📋 Project Overview

### Apps
- **delivery**: Main app containing all functionality

### Models
- **Customer**: User accounts with username, password, email, mobile, address
- **Restaurant**: Restaurant details with name, picture, cuisine, rating
- **Item**: Menu items linked to restaurants with name, description, price, vegetarian flag, picture
- **Cart**: Shopping cart for customers with many-to-many relationship to items

### Key Features
- User authentication (signup/signin)
- Admin dashboard for restaurant management
- Restaurant and menu CRUD operations
- Customer view to browse restaurants and menus
- Add items to cart
- Checkout with Razorpay payment integration
- Order tracking page
- Modern responsive UI inspired by Swiggy/Uber Eats

## 🚀 Setup Instructions

### Prerequisites
- Python 3.8 or higher
- pip (Python package manager)
- Git (optional)

### Step 1: Navigate to Project Directory
```bash
cd d:\Projects\FinalMealmate-main
```

### Step 2: Create Virtual Environment
```bash
# Windows
python -m venv venv

# Or using virtualenv
virtualenv venv
```

### Step 3: Activate Virtual Environment

**Windows (Command Prompt):**
```bash
venv\Scripts\activate
```

**Windows (PowerShell):**
```bash
venv\Scripts\Activate.ps1
```

**Note:** If you get a PowerShell execution policy error, run:
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Step 4: Install Dependencies
```bash
pip install -r requirements.txt
```

This will install:
- Django==6.0.3
- razorpay==2.0.1

### Step 5: Run Migrations
```bash
python manage.py makemigrations
python manage.py migrate
```

This creates the database tables based on your models.

### Step 6: Create Superuser (for admin access)
```bash
python manage.py createsuperuser
```

Follow the prompts to create an admin account. Use username `admin` to access the admin dashboard.

**Note:** For the app's built-in admin functionality, you can also create a regular user through the signup form with username `admin` to access the admin dashboard.

### Step 7: Start Development Server
```bash
python manage.py runserver
```

The server will start at `http://127.0.0.1:8000/`

### Step 8: Access the Application
Open your browser and navigate to:
- **Home Page**: `http://127.0.0.1:8000/`
- **Sign Up**: `http://127.0.0.1:8000/open_signup`
- **Sign In**: `http://127.0.0.1:8000/open_signin`

## 👤 User Roles

### Customer User
1. Sign up with any username (except `admin`)
2. Sign in to view restaurants
3. Browse restaurants and their menus
4. Add items to cart
5. Checkout with Razorpay payment
6. Track orders

### Admin User
1. Create account with username `admin`
2. Sign in to access admin dashboard
3. Add new restaurants
4. Update restaurant information
5. Delete restaurants
6. Add menu items to restaurants
7. View all restaurants

## 🎨 CSS Integration

All templates have been updated to use the modern CSS file located at:
```
delivery/static/delivery/style.css
```

### CSS Features
- Modern color palette (Swiggy orange, whites, dark grays)
- Responsive navbar with logo, search bar, cart icon
- Hero/banner section
- Food category chips with horizontal scroll
- Restaurant cards with image, rating, delivery time, price range
- Food item cards with add-to-cart buttons
- Cart page with order summary
- Order tracking with timeline
- Login/signup modal styling
- Mobile responsive (320px to 1440px)
- Smooth hover effects and transitions
- Google Fonts (Inter)
- CSS variables for easy theming

### Base Template
All templates extend `delivery/base.html` for consistent layout. The base template includes:
- Responsive navbar (shown when user is logged in)
- Google Fonts integration
- CSS file loading
- Content blocks for customization

## 📁 Project Structure

```
FinalMealmate-main/
├── delivery/
│   ├── __init__.py
│   ├── admin.py
│   ├── apps.py
│   ├── migrations/          # Database migrations
│   ├── models.py            # Customer, Restaurant, Item, Cart models
│   ├── static/
│   │   └── delivery/
│   │       └── style.css    # Modern CSS styling
│   ├── templates/
│   │   └── delivery/
│   │       ├── base.html    # Base template
│   │       ├── index.html   # Landing page
│   │       ├── signin.html  # Sign in form
│   │       ├── signup.html  # Sign up form
│   │       ├── customer_home.html      # Restaurant list
│   │       ├── customer_menu.html      # Menu items
│   │       ├── cart.html               # Shopping cart
│   │       ├── checkout.html           # Payment page
│   │       ├── orders.html             # Order confirmation
│   │       ├── admin_home.html         # Admin dashboard
│   │       ├── add_restaurant.html     # Add restaurant form
│   │       ├── show_restaurants.html   # Restaurant management
│   │       ├── update_restaurant.html  # Update restaurant form
│   │       ├── update_menu.html        # Menu management
│   │       ├── fail.html               # Error page
│   │       └── success.html            # Success page
│   ├── tests.py
│   ├── urls.py              # URL patterns
│   └── views.py             # View functions
├── meal_buddy/
│   ├── __init__.py
│   ├── asgi.py
│   ├── settings.py          # Django settings
│   ├── urls.py              # Project URLs
│   └── wsgi.py
├── db.sqlite3               # SQLite database
├── manage.py                # Django management script
├── requirements.txt         # Python dependencies
└── README.md               # This file
```




## 📱 Responsive Design

The application is fully responsive and works on:
- Desktop (1200px+)
- Tablet (768px - 1199px)
- Mobile (320px - 767px)

## 🐛 Troubleshooting

### Issue: Static files not loading
**Solution:** Ensure `DEBUG = True` in `meal_buddy/settings.py` for development. Run:
```bash
python manage.py collectstatic
```

### Issue: Port 8000 already in use
**Solution:** Run the server on a different port:
```bash
python manage.py runserver 8001
```

### Issue: Database locked
**Solution:** Delete `db.sqlite3` and run migrations again:
```bash
del db.sqlite3
python manage.py migrate
```

### Issue: Razorpay payment not working
**Solution:** Ensure your Razorpay keys are correct and the Razorpay checkout script is loaded (check browser console for errors).

## 📝 Notes

- The app uses SQLite database by default (suitable for development)
- For production, consider using PostgreSQL or MySQL
- The app uses Django's built-in session authentication (not Django Auth system)
- Passwords are stored in plain text (not secure for production - consider hashing)
- The `admin` username is hardcoded to access the admin dashboard

## 🚀 Deployment

For deployment to production:

1. Set `DEBUG = False` in `settings.py`
2. Update `ALLOWED_HOSTS` with your domain
3. Use a production database (PostgreSQL recommended)
4. Configure static files serving
5. Set up a production web server (Gunicorn + Nginx)
6. Use environment variables for sensitive data (Razorpay keys, SECRET_KEY)
7. Implement proper password hashing
8. Add HTTPS/SSL certificate

## 📄 License

This project is for educational purposes.

## 👨‍💻 Development

To add new features:
1. Modify models in `delivery/models.py`
2. Create migrations: `python manage.py makemigrations`
3. Apply migrations: `python manage.py migrate`
4. Add views in `delivery/views.py`
5. Add URL patterns in `delivery/urls.py`
6. Create/update templates in `delivery/templates/delivery/`
7. Add styles in `delivery/static/delivery/style.css`

## 🎯 Future Improvements

- Implement Django's built-in authentication system
- Add password hashing
- Implement proper session management
- Add order history
- Implement user profile management
- Add search functionality
- Implement filtering by cuisine/rating
- Add restaurant reviews
- Implement real-time order tracking
- Add email notifications
- Implement SMS notifications for order updates
- Add admin panel using Django Admin
- Implement API endpoints for mobile app
