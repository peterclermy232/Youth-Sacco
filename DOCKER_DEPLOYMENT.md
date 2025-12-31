# Docker Deployment Guide

This guide explains how to deploy the SACCO system using Docker and Docker Compose.

## Prerequisites

- Docker Engine 20.10+
- Docker Compose 2.0+
- At least 2GB RAM
- 10GB free disk space

## Quick Start

### 1. Clone or Upload Project

```bash
cd /path/to/sacco-system
```

### 2. Configure Environment

```bash
cd backend
cp .env.example .env
nano .env  # Edit with your settings
```

Required environment variables:
```env
SECRET_KEY=your-secret-key-here
DEBUG=False
ALLOWED_HOSTS=yourdomain.com,localhost

DB_NAME=sacco_db
DB_USER=sacco_user
DB_PASSWORD=strong_password_here
DB_HOST=db
DB_PORT=5432

AT_USERNAME=your_africastalking_username
AT_API_KEY=your_api_key
AT_SENDER_ID=SACCO

CORS_ALLOWED_ORIGINS=http://localhost:4200,https://yourdomain.com
```

### 3. Build and Start Services

```bash
cd ..  # Back to project root
docker-compose up -d --build
```

This will:
- Build the backend Django container
- Build the frontend Angular container
- Start PostgreSQL database
- Start Nginx reverse proxy

### 4. Run Initial Setup

```bash
# Run migrations
docker-compose exec backend python manage.py migrate

# Create superuser
docker-compose exec backend python manage.py createsuperuser

# Create contribution types
docker-compose exec backend python manage.py shell
```

In the Django shell:
```python
from contributions.models import ContributionType
ContributionType.objects.create(name='SACCO', description='Main SACCO contributions')
ContributionType.objects.create(name='MMF', description='Money Market Fund')
exit()
```

### 5. Access the Application

- **Frontend**: http://localhost (or http://localhost:4200)
- **Backend API**: http://localhost:8000/api
- **Django Admin**: http://localhost:8000/admin

## Docker Commands

### View Running Containers
```bash
docker-compose ps
```

### View Logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f db
```

### Stop Services
```bash
docker-compose stop
```

### Start Services
```bash
docker-compose start
```

### Restart Services
```bash
docker-compose restart
```

### Stop and Remove Containers
```bash
docker-compose down
```

### Stop and Remove Containers + Volumes
```bash
docker-compose down -v
```

## Database Management

### Backup Database
```bash
docker-compose exec db pg_dump -U sacco_user sacco_db > backup_$(date +%Y%m%d).sql
```

### Restore Database
```bash
cat backup_20250101.sql | docker-compose exec -T db psql -U sacco_user sacco_db
```

### Access Database Shell
```bash
docker-compose exec db psql -U sacco_user -d sacco_db
```

## Application Updates

### Update Backend Code
```bash
# Pull latest code
git pull  # or upload new files

# Rebuild and restart
docker-compose up -d --build backend

# Run migrations
docker-compose exec backend python manage.py migrate

# Collect static files
docker-compose exec backend python manage.py collectstatic --noinput
```

### Update Frontend Code
```bash
# Pull latest code
git pull  # or upload new files

# Rebuild and restart
docker-compose up -d --build frontend
```

## Production Deployment

### 1. Update docker-compose.prod.yml

Create `docker-compose.prod.yml`:

```yaml
version: '3.8'

services:
  db:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: ${DB_NAME}
      POSTGRES_USER: ${DB_USER}
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    restart: unless-stopped

  backend:
    build:
      context: ./backend
    command: gunicorn sacco_project.wsgi:application --bind 0.0.0.0:8000 --workers 4
    volumes:
      - static_volume:/app/staticfiles
      - media_volume:/app/media
    env_file:
      - ./backend/.env
    depends_on:
      - db
    restart: unless-stopped

  frontend:
    build:
      context: ./frontend
    restart: unless-stopped

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf
      - ./nginx/conf.d:/etc/nginx/conf.d
      - ./certbot/conf:/etc/letsencrypt
      - ./certbot/www:/var/www/certbot
      - static_volume:/var/www/static
      - media_volume:/var/www/media
    depends_on:
      - backend
      - frontend
    restart: unless-stopped

  certbot:
    image: certbot/certbot
    volumes:
      - ./certbot/conf:/etc/letsencrypt
      - ./certbot/www:/var/www/certbot
    entrypoint: "/bin/sh -c 'trap exit TERM; while :; do certbot renew; sleep 12h & wait $${!}; done;'"

volumes:
  postgres_data:
  static_volume:
  media_volume:
```

### 2. Deploy to Production

```bash
docker-compose -f docker-compose.prod.yml up -d --build
```

### 3. Setup SSL with Let's Encrypt

```bash
# Initial certificate
docker-compose -f docker-compose.prod.yml run --rm certbot certonly \
  --webroot \
  --webroot-path=/var/www/certbot \
  -d yourdomain.com \
  -d www.yourdomain.com \
  --email your-email@example.com \
  --agree-tos \
  --no-eff-email

# Reload Nginx
docker-compose -f docker-compose.prod.yml exec nginx nginx -s reload
```

## Monitoring

### Check Container Health
```bash
docker-compose ps
docker stats
```

### Check Disk Usage
```bash
docker system df
```

### Clean Up Unused Resources
```bash
docker system prune -a
```

## Troubleshooting

### Backend Container Won't Start

Check logs:
```bash
docker-compose logs backend
```

Common issues:
- Database connection error: Check DB_HOST in .env (should be "db")
- Migration errors: Run migrations manually
- Port already in use: Change port in docker-compose.yml

### Database Connection Issues

```bash
# Check if database is running
docker-compose ps db

# Check database logs
docker-compose logs db

# Test connection
docker-compose exec backend python manage.py dbshell
```

### Frontend Build Fails

```bash
# Check logs
docker-compose logs frontend

# Rebuild with no cache
docker-compose build --no-cache frontend
```

### Permission Issues

```bash
# Fix permissions
sudo chown -R $USER:$USER .
```

## Performance Optimization

### Increase Gunicorn Workers

Edit `docker-compose.yml`:
```yaml
backend:
  command: gunicorn sacco_project.wsgi:application --bind 0.0.0.0:8000 --workers 8
```

Formula: (2 × CPU cores) + 1

### Enable Database Connection Pooling

Add to backend `.env`:
```env
DB_CONN_MAX_AGE=600
```

### Configure Nginx Caching

Update nginx configuration to cache static files.

## Backup Strategy

### Automated Backups

Create `backup.sh`:
```bash
#!/bin/bash
BACKUP_DIR="/backups"
DATE=$(date +%Y%m%d_%H%M%S)

# Backup database
docker-compose exec -T db pg_dump -U sacco_user sacco_db > $BACKUP_DIR/db_$DATE.sql

# Backup media files
docker cp sacco-system_backend_1:/app/media $BACKUP_DIR/media_$DATE

# Keep only last 7 days
find $BACKUP_DIR -name "db_*.sql" -mtime +7 -delete
find $BACKUP_DIR -name "media_*" -mtime +7 -delete
```

Add to crontab:
```bash
0 2 * * * /path/to/backup.sh
```

## Security Checklist

- [ ] Change default passwords in `.env`
- [ ] Set `DEBUG=False` in production
- [ ] Configure firewall (allow only 80, 443, 22)
- [ ] Enable SSL/HTTPS
- [ ] Regular backups
- [ ] Update Docker images regularly
- [ ] Monitor logs for suspicious activity

## Resource Requirements

### Minimum
- 2 CPU cores
- 4GB RAM
- 20GB disk space

### Recommended
- 4 CPU cores
- 8GB RAM
- 50GB disk space

## Cost Estimation

**DigitalOcean Droplet:**
- Basic: $12/month (2GB RAM, 1 CPU)
- Standard: $24/month (4GB RAM, 2 CPUs)
- Performance: $48/month (8GB RAM, 4 CPUs)

**AWS EC2:**
- t3.small: ~$15/month (2GB RAM, 2 vCPUs)
- t3.medium: ~$30/month (4GB RAM, 2 vCPUs)

## Support

For Docker-specific issues:
- Docker Documentation: https://docs.docker.com/
- Docker Compose Documentation: https://docs.docker.com/compose/

For application issues:
- Check application logs
- Review README.md
- Check API_DOCUMENTATION.md