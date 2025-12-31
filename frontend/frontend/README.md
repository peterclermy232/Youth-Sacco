# SACCO Contribution Management System

A comprehensive SACCO (Savings and Credit Cooperative) management system built with **Angular 18** and **Django REST Framework**.

## Features

### User Roles
- **Admin (2 users maximum)**
  - View all members and contributions
  - Verify M-Pesa transactions
  - View total SACCO and MMF balances
  - Send SMS notifications to members
  
- **Member (5 users)**
  - Login using phone number + password
  - View personal contribution history
  - Submit M-Pesa transaction codes
  - Manage next of kin details
  - Receive SMS notifications when contributions are verified

### Security
- JWT-based authentication
- Role-based access control enforced at backend level
- Members can only access their own data
- Maximum 2 admin users enforced at database level

### Payment System
- **Phase 1**: Manual M-Pesa transaction code submission (implemented)
- **Phase 2**: Automatic Safaricom Daraja API integration (ready for implementation)

## Tech Stack

### Backend
- Django 5.2.9
- Django REST Framework 3.16.1
- PostgreSQL
- JWT Authentication (djangorestframework-simplejwt)
- Africa's Talking SMS API

### Frontend
- Angular 18
- Angular Material
- TypeScript
- SCSS
- RxJS

## Project Structure

```
sacco-system/
├── backend/
│   ├── accounts/          # User authentication and profiles
│   ├── contributions/     # Contribution management
│   ├── notifications/     # SMS notifications
│   ├── sacco_project/     # Main Django project
│   ├── manage.py
│   ├── requirements.txt
│   └── .env.example
│
└── frontend/
    ├── src/
    │   ├── app/
    │   │   ├── components/    # Angular components
    │   │   ├── services/      # API services
    │   │   ├── models/        # TypeScript interfaces
    │   │   ├── guards/        # Route guards
    │   │   └── interceptors/  # HTTP interceptors
    │   └── environments/      # Environment configs
    ├── angular.json
    └── package.json
```

## Installation & Setup

### Prerequisites
- Python 3.11+
- Node.js 22+
- PostgreSQL 12+
- npm or pnpm

### Backend Setup

1. **Create and activate virtual environment**
   ```bash
   cd backend
   python3.11 -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

2. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your settings
   ```

4. **Setup PostgreSQL database**
   ```sql
   CREATE DATABASE sacco_db;
   CREATE USER sacco_user WITH PASSWORD 'sacco_password';
   GRANT ALL PRIVILEGES ON DATABASE sacco_db TO sacco_user;
   ```

5. **Run migrations**
   ```bash
   python manage.py makemigrations
   python manage.py migrate
   ```

6. **Create superuser (Admin)**
   ```bash
   python manage.py createsuperuser
   # Follow prompts - use phone number format: +254...
   ```

7. **Create initial data (optional)**
   ```bash
   python manage.py shell
   ```
   ```python
   from contributions.models import ContributionType
   ContributionType.objects.create(name='SACCO', description='Main SACCO contributions')
   ContributionType.objects.create(name='MMF', description='Money Market Fund')
   ```

8. **Run development server**
   ```bash
   python manage.py runserver
   ```

   Backend API will be available at: `http://localhost:8000`

### Frontend Setup

1. **Install dependencies**
   ```bash
   cd frontend
   npm install
   ```

2. **Update environment configuration**
   Edit `src/environments/environment.ts` if needed:
   ```typescript
   export const environment = {
     production: false,
     apiUrl: 'http://localhost:8000/api'
   };
   ```

3. **Run development server**
   ```bash
   ng serve
   ```

   Frontend will be available at: `http://localhost:4200`

## API Endpoints

### Authentication
- `POST /api/auth/register/` - Register new user
- `POST /api/auth/login/` - Login user
- `POST /api/auth/token/refresh/` - Refresh JWT token
- `GET /api/auth/profile/` - Get current user profile
- `PATCH /api/auth/profile/` - Update user profile

### Contributions
- `GET /api/contributions/types/` - List contribution types
- `GET /api/contributions/` - List user contributions
- `POST /api/contributions/create/` - Submit new contribution
- `GET /api/contributions/<id>/` - Get contribution details
- `GET /api/contributions/balance/` - Get member balance

### Admin Only
- `GET /api/auth/users/` - List all users
- `GET /api/contributions/pending/` - List pending contributions
- `POST /api/contributions/<id>/verify/` - Verify/reject contribution
- `GET /api/contributions/dashboard/` - Get dashboard statistics
- `GET /api/contributions/balances/` - View all member balances

## SMS Notifications Setup

1. **Sign up for Africa's Talking**
   - Visit: https://africastalking.com
   - Create an account
   - Get your API key

2. **Configure in .env**
   ```
   AT_USERNAME=your_username
   AT_API_KEY=your_api_key
   AT_SENDER_ID=SACCO
   ```

3. **Test SMS (Sandbox mode)**
   - Use sandbox mode for testing
   - Add test phone numbers in AT dashboard

## Database Schema

### Users Table
- phone_number (unique)
- first_name, last_name
- email (optional)
- role (ADMIN/MEMBER)
- password (hashed)

### Contributions Table
- member (FK to User)
- contribution_type (FK)
- amount
- mpesa_transaction_code (unique)
- status (PENDING/VERIFIED/REJECTED)
- verified_by (FK to User)
- timestamps

### Next of Kin Table
- user (OneToOne with User)
- full_name, relationship
- phone_number, email
- address, id_number

## Deployment

### Backend Deployment (Production)

1. **Update settings for production**
   ```python
   DEBUG = False
   ALLOWED_HOSTS = ['your-domain.com']
   ```

2. **Collect static files**
   ```bash
   python manage.py collectstatic
   ```

3. **Use production WSGI server**
   ```bash
   pip install gunicorn
   gunicorn sacco_project.wsgi:application --bind 0.0.0.0:8000
   ```

4. **Setup Nginx as reverse proxy**

### Frontend Deployment

1. **Build for production**
   ```bash
   ng build --configuration production
   ```

2. **Deploy dist folder**
   - Upload `dist/frontend` to your web server
   - Configure web server to serve index.html for all routes

## Testing

### Backend Tests
```bash
cd backend
python manage.py test
```

### Frontend Tests
```bash
cd frontend
ng test
```

## Security Considerations

1. **Environment Variables**: Never commit `.env` file
2. **JWT Tokens**: Tokens expire after 5 hours (configurable)
3. **Password Requirements**: Minimum 8 characters
4. **Role Enforcement**: Backend validates all role-based operations
5. **CORS**: Configure allowed origins in production
6. **HTTPS**: Always use HTTPS in production

## Future Enhancements

- [ ] Safaricom Daraja API integration for automatic M-Pesa verification
- [ ] Email notifications
- [ ] Loan management module
- [ ] Financial reports and analytics
- [ ] Mobile app (React Native)
- [ ] Bulk SMS to all members
- [ ] Document upload for KYC

## Troubleshooting

### Backend Issues
- **Database connection errors**: Check PostgreSQL is running and credentials in `.env`
- **Migration errors**: Delete migrations and recreate: `find . -path "*/migrations/*.py" -not -name "__init__.py" -delete`
- **Import errors**: Ensure virtual environment is activated

### Frontend Issues
- **API connection errors**: Check `environment.ts` has correct backend URL
- **Module not found**: Run `npm install` again
- **Build errors**: Clear cache: `rm -rf node_modules package-lock.json && npm install`

## Support

For issues and questions:
- Backend: Check Django logs
- Frontend: Check browser console
- Database: Check PostgreSQL logs

## License

This project is proprietary software for SACCO management.

## Contributors

- Backend: Django REST Framework
- Frontend: Angular 18
- SMS
