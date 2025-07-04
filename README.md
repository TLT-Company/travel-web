# Docker Setup for PostgreSQL Database

This guide will help you set up the PostgreSQL database using Docker Compose.

## Prerequisites

- Docker installed on your system
- Docker Compose installed

## Quick Start

1. **Start the database services:**
   ```bash
   docker-compose up -d
   ```

2. **Check if services are running:**
   ```bash
   docker-compose ps
   ```

3. **View logs:**
   ```bash
   docker-compose logs postgres
   ```

# Database Setup Guide

This guide explains how to set up the database for the WebBookingTour system.

## Database Schema

The system uses PostgreSQL with the following tables:

- **users**: User accounts with authentication
- **customers**: Customer profiles linked to users
- **employers**: Employee profiles linked to users  
- **tours**: Tour information created by admins
- **bookings**: Booking records linking customers and tours
- **task_assignments**: Task assignments for employers

## Prerequisites

1. PostgreSQL installed and running
2. Node.js and npm installed
3. Environment variables configured (see `.env` example below)

## Environment Variables

Create a `.env` file in the backend directory:

```env
DB_NAME=travel_db
DB_USER=postgres
DB_PASSWORD=your_password
DB_HOST=localhost
DB_PORT=5432
```

## Setup Steps

### 1. Install Dependencies

```bash
npm install
```

### 3. Run Migrations

```bash
npm run migrate
```

This will create all tables in the correct order with proper relationships.

### 4. Seed Initial Data (Optional)

```bash
npm run seed
```

This creates sample data for testing:
- Admin user: `admin@example.com` / `admin123`
- Employer user: `employer@example.com` / `employer123`
- Customer user: `customer@example.com` / `customer123`

## Available Scripts

- `npm run migrate`: Run all migrations
- `npm run seed`: Seed initial data
- `npm start`: Start the server
- `npm run start-dev`: Start with nodemon for development


# Complete database reset (recommended for fixing issues)
npm run db:reset

# Just drop all tables
- `npm run cleanup`

# Drop tables and recreate (without seeding)
- `npm run migrate:reset`

# Normal migration (if no conflicts)
- `npm run migrate`

# Just seed data
- `npm run seed`

## Database Relationships

### Users
- One user can have one customer profile
- One user can have one employer profile
- One user (admin) can create many tours

### Customers
- One customer can have many bookings
- Each customer belongs to one user

### Employers
- One employer can be assigned to many bookings
- One employer can have many task assignments
- Each employer belongs to one user

### Tours
- One tour can have many bookings
- Each tour is created by one user (admin)

### Bookings
- Each booking belongs to one customer and one tour
- Each booking can be assigned to one employer
- Each booking can have many task assignments

### Task Assignments
- Each task assignment belongs to one employer and one booking

## Troubleshooting

### Migration Errors
If you encounter migration errors:

1. Check database connection
2. Ensure PostgreSQL is running
3. Verify environment variables
4. Check if tables already exist

### Reset Database
To completely reset the database:

```bash
# Drop and recreate database
psql -U postgres -c "DROP DATABASE IF EXISTS travel_db;"
psql -U postgres -c "CREATE DATABASE travel_db;"

# Run migrations again
npm run migrate
```

## Data Types

- **UUID**: Used for all primary keys and foreign keys
- **VARCHAR**: For short text fields
- **TEXT**: For longer text content
- **DECIMAL(10,2)**: For price fields
- **DATE**: For date-only fields
- **TIMESTAMP**: For date and time fields

## Status Values

- **User roles**: `admin`, `employer`, `customer`
- **Customer verification**: `pending`, `verified`, `rejected`
- **Booking status**: `pending`, `confirmed`, `cancelled`
- **Task status**: `new`, `in_progress`, `completed` 