# PostgreSQL Migration Setup

This project has been migrated from MongoDB to PostgreSQL using Sequelize ORM.

## Prerequisites

1. Install PostgreSQL on your system
2. Create a database named `travel_db` (or update the environment variables)

## Environment Variables

Create a `.env` file in the backend directory with the following variables:

```env
# Server Configuration
PORT=8000

# PostgreSQL Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=travel_db
DB_USER=postgres
DB_PASSWORD=your_password

# JWT Configuration
JWT_SECRET_KEY=your_jwt_secret_key_here

# CORS Configuration
CLIENT_URL=http://localhost:3000
```

## Installation

1. Install dependencies:
```bash
npm install
```

2. Make sure PostgreSQL is running and the database exists

3. Start the server:
```bash
npm run start-dev
```

The server will automatically create the database tables when it starts.

## Database Schema

The following tables will be created:
- `users` - User accounts
- `tours` - Tour information
- `reviews` - Tour reviews
- `bookings` - Tour bookings

## Key Changes Made

1. **Models**: Converted from Mongoose schemas to Sequelize models
2. **Controllers**: Updated to use Sequelize methods instead of Mongoose
3. **Database Connection**: Changed from MongoDB to PostgreSQL
4. **Relationships**: Defined using Sequelize associations
5. **Queries**: Updated to use Sequelize query syntax

## API Endpoints

All API endpoints remain the same, but the underlying database operations now use PostgreSQL. 