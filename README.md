# RUI
A laptop marketplace focused on helping users discover and purchase laptops efficiently.
Official Website: [rui-jose.me](https://rui-jose.me)

## Overview
Rui is an ecommerce platform build for browsing, comparing and purchasing laptops from different brands and specifications.
The platform is designed to provide:
- Fast laptop discovery
- Advanced filtering and search
- Secure authentication

## Features
### Customer Features
* user registration and authentication
* Secure login/logout
* Advanced search and filtering
* Checkout and payment integration
* Product reviews and ratings

### Admin Features
* Product management
* Brand/category management

## Tech Stack
### Backend
* Node.js
* Express.js
* Mongose
* MongoDB

### Frontend
* Pug Templates
* CSS3
* JavaScript

Infrastructure & DevOps
* Docker
* Azure

## Installation
### Clone Repository
git clone https://github.com/josMuiruri/rui.git
cd rui

### Install Dependencies
npm install

## Running the Application
### Development
npm run dev

### Production
npm start

## Docker Setup
### Build Containers
docker-compose build

### Start Services
docker-compose

## API Example
### Authentication
### Register User
POST /api/v1/signup

### Login User
POST /api/v1/login

### Products
### Get All Laptops
GET /api/v1/products

### Get Single Laptop
GET /api/v1/products/:id

## Security
RUI implements several security best practices
- JWT Authentication
- Password hashing
- Rate limiting
- Content Security Policy (CSP)
- Secure HTTP headers
- XSS protection
- CSRF protection
- Input sanitization

## Deployment
Supported deployment environments:
- Azure

## Future Improvements
- Real-time inventory updates
- Mobile applications
- Multi-vendor marketplace support
- Live customer support chat
- Advanced analytics dashboard
- Personalized recommendations

## Contributing 
Contributions are welcome.

## Workflow
1. Fork repository
2. Create feature branch
3. Commit changes
4. Push branch
5. Open pull request

## License
This project is licensed under the MIT License.

## Author
Developed for [rui-jose.me](https://rui-jose.me)