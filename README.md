# Sneaker Shoe Store

## Table of Contents

- [Project Overview](#project-overview)
- [Technologies Used](#technologies-used)
- [Features](#features)
- [Frontend](#frontend)
- [Backend](#backend)
- [Database](#database)
- [Setup Instructions](#setup-instructions)
- [Running the Project](#running-the-project)

## Project Overview

Sneaker Shoe Store is a simple e-commerce website designed for purchasing sneakers. The project includes a product listing page, shopping cart, and a checkout process. Additionally, it features user registration and login functionalities along with switching between themes.

## Technologies Used

- **Frontend**: ReactJS, Bootstrap, CSS
- **Backend**: Node.js with Express.js
- **Database**: MongoDB Atlas
- **Authentication**: Custom authentication with encrypted username/password

## Features

1. **Product Listings**: Display sneakers with details like price, description, and images.
2. **Shopping Cart**: Users can add products to their cart, adjust quantities, and remove items.
3. **Checkout Process**: A simple checkout form captures user information, providing an order summary.
4. **User Registration and Login**: Users can register and log in to manage their orders and profile.

## Frontend

- **Product Listings**: Displays all available sneakers using React components.
- **State Management**: Handles user sessions and cart data using React's useState and useContext hooks.
- **Interactivity**: Users can interact with the cart by adding, updating, or removing items.

## Backend

- **Express.js**: Manages routing and middleware for handling product and cart operations.
- **Stripe Integration**: Processes payments via Stripe's API.
- **Error Handling**: Handles errors gracefully with meaningful messages.

## Database

- **MongoDB Atlas**:
  - **Collections: products, users, orders, carts.**
  - **Schemas: Structured for efficient CRUD operations with proper indexing.**
- **Collections**:
  - `products`: Stores product details including name, price, description, image URL, etc.
  - `users`: Contains user information such as username, email, password, and order history.
  - `orders`: Records each order with details like products ordered, user details, total amount, and order status.
  - `carts`: Manages the shopping cart for each user, storing products added to the cart and their quantities.

## Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/ravindra-maram/Sneaker-Shoe-Store.git

cd Sneaker-Shoe-Store
```

### 2. Install Dependencies

**Frontend**

Navigate to the client(root) directory and install the dependencies:

```bash
npm install
```

**Backend**

Navigate to the server directory and install the dependencies:

```bash
cd server

npm install
```

### 3. Set Up Environment Variables

Create a `.env` file in the server directory and add the following:

```bash
PORT=8081
MONGO_URI=<Your MongoDB Atlas connection string>
STRIPE_SECRET_KEY=<Your Stripe Secret Key>
STRIPE_PUBLISHABLE_KEY=<Your Stripe Publishable Key>
```

Create a `.env` file in the client(root) directory and add the following:

```bash
STRIPE_PUBLISHABLE_KEY=<Your Stripe Publishable Key>
```

### 4. Start the Combined Server (client + server)

In the `root(client)` directory, run:

```bash
npm start
```

### 5. Access the Application

Open your browser and go to:

```bash
http://localhost:3000
```
