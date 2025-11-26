# Playable Factory Case Study

This is a full-stack e-commerce web application built by Zafer Emre for a case study. The application features a modern React/Next.js frontend with a Node.js/Express backend, Firebase authentication, MongoDB database, and Redis caching.

## 🏗️ Architecture

- **Frontend**: Next.js 16 with TypeScript, Tailwind CSS, Redux Toolkit for state management
- **Backend**: Node.js with Express, MongoDB, Redis
- **Authentication**: Firebase Auth with Google Sign-in
- **Database**: MongoDB with Mongoose ODM
- **State Management**: Redux Toolkit with RTK Query for API calls
- **Caching**: Redis for performance optimization
- **Deployment**: Railway (both frontend and backend)

## 🚀 Local Development Setup

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- MongoDB (local or cloud instance)
- Redis (optional, for caching)
- Firebase project with Authentication enabled

### 1. Clone the Repository

```bash
git clone https://github.com/zaferemre/playable-factory-case-study.git
cd playable-factory-case-study
```

### 2. Backend Setup

```bash
cd server
npm install
```

Configure your environment variables for the backend (create `.env` file - see deployment guide for required variables).

Start the backend server:

```bash
npm run dev
```

The backend will be available at `http://localhost:3001`

### 3. Frontend Setup

```bash
cd client
npm install
```

Configure your environment variables for the frontend (create `.env.local` file with Firebase configuration).

Start the frontend development server:

```bash
npm run dev
```

The frontend will be available at `http://localhost:3000`

## 🔧 Available Scripts

### Frontend (client/)

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Backend (server/)

- `npm run dev` - Start development server with nodemon
- `npm run build` - Build TypeScript
- `npm run start` - Start production server

## 🔄 Redux State Management

The frontend uses Redux Toolkit for efficient state management:

- **Store Configuration**: Pre-configured with RTK Query for API calls
- **Cart Management**: Global shopping cart state with persistence
- **User Authentication**: Auth state management with Firebase integration
- **Product Data**: Efficient product catalog state with caching
- **API Layer**: RTK Query for automatic caching and synchronization

The Redux store is automatically set up and doesn't require additional configuration for local development.

## 📊 Database Setup

The application uses MongoDB for data storage. Make sure to:

1. Install MongoDB locally or use MongoDB Atlas
2. Update the `MONGODB_URI` in your backend `.env` file
3. The application will automatically create the necessary collections

## ⚡ Redis Setup (Optional)

For caching functionality:

1. Install Redis locally or use a cloud service
2. Update the `REDIS_URL` in your backend `.env` file
3. The application will work without Redis but with reduced performance

## 🌐 Deployment

The application is deployed on Railway:

- **Frontend**: https://overflowing-magic-production-9725.up.railway.app
- **Backend**: Automatically deployed with the frontend

To deploy your own version:

1. Fork this repository
2. Connect your Railway account
3. Deploy both frontend and backend services
4. Configure environment variables in Railway dashboard

## 🔍 Testing

Visit `/debug/firebase` on the frontend to test Firebase connection and environment variables.

## 📝 Features

- 🛍️ Product catalog with search and filtering
- 🛒 Shopping cart functionality
- 👤 User authentication with Firebase
- 📦 Order management
- 👨‍💼 Admin panel for product/order management
- 📱 Responsive design
- ⚡ Redis caching for improved performance
- 🔒 Secure API with authentication middleware

## 🛠️ Troubleshooting

### Common Issues

1. **Firebase Auth not working**: Check that your domain is added to Firebase authorized domains
2. **API connection errors**: Ensure backend is running on correct port
3. **Build failures**: Check that all environment variables are properly set
4. **Database connection**: Verify MongoDB is running and connection string is correct

### Debug Tools

- Frontend debug page: `/debug/firebase`
- Backend API health check: `GET /api/health`
- Environment variable testing utilities included
