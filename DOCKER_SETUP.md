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

## Services Included

### PostgreSQL Database
- **Container**: `travel_postgres`
- **Port**: `5432`
- **Database**: `travel_db`
- **Username**: `postgres`
- **Password**: `postgres123`

### pgAdmin (Database Management Tool)
- **Container**: `travel_pgadmin`
- **Port**: `5050`
- **URL**: `http://localhost:5050`
- **Email**: `admin@travel.com`
- **Password**: `admin123`

## Environment Variables

Create a `.env` file in the backend directory with these settings:

```env
# Server Configuration
PORT=8000

# PostgreSQL Database Configuration (Docker)
DB_HOST=localhost
DB_PORT=5432
DB_NAME=travel_db
DB_USER=postgres
DB_PASSWORD=postgres123

# JWT Configuration
JWT_SECRET_KEY=your_super_secret_jwt_key_here_change_this_in_production

# CORS Configuration
CLIENT_URL=http://localhost:3000
```

## Connecting to Database

### From Backend Application
The backend will automatically connect to the PostgreSQL database using the environment variables.

### From pgAdmin
1. Open `http://localhost:5050` in your browser
2. Login with:
   - Email: `admin@travel.com`
   - Password: `admin123`
3. Add a new server connection:
   - Host: `postgres` (container name)
   - Port: `5432`
   - Database: `travel_db`
   - Username: `postgres`
   - Password: `postgres123`

### From Command Line
```bash
docker exec -it travel_postgres psql -U postgres -d travel_db
```

## Database Initialization

The database will be automatically initialized with:
- Sample tour data (9 tours)
- All necessary tables (created by Sequelize)

## Useful Commands

### Start services
```bash
docker-compose up -d
```

### Stop services
```bash
docker-compose down
```

### Stop and remove volumes (WARNING: This will delete all data)
```bash
docker-compose down -v
```

### View logs
```bash
docker-compose logs -f postgres
```

### Restart services
```bash
docker-compose restart
```

### Backup database
```bash
docker exec travel_postgres pg_dump -U postgres travel_db > backup.sql
```

### Restore database
```bash
docker exec -i travel_postgres psql -U postgres travel_db < backup.sql
```

## Troubleshooting

### Port already in use
If port 5432 is already in use, change the port mapping in `docker-compose.yml`:
```yaml
ports:
  - "5433:5432"  # Use 5433 instead of 5432
```

### Permission issues
If you encounter permission issues, run:
```bash
sudo chown -R $USER:$USER .
```

### Database connection issues
Make sure the containers are running:
```bash
docker-compose ps
```

Check the logs for any errors:
```bash
docker-compose logs postgres
```

## Production Considerations

For production deployment:
1. Change default passwords
2. Use environment variables for sensitive data
3. Enable SSL connections
4. Set up proper backup strategies
5. Configure connection pooling
6. Use a managed database service if possible 