# Aergia Backend

A modern CV/Resume builder backend API built with AdonisJS, providing user authentication and dynamic form management capabilities.

🌐 **Live Demo**: [https://aergia-backend.onrender.com](https://aergia-backend.onrender.com)

💻 **Frontend Demo**: [https://aergia.netlify.app/home](https://aergia.netlify.app/home)

## Project Overview

Aergia Backend is a RESTful API that powers a CV/Resume builder application. It provides:

- **User Authentication** - Registration, login, logout with session management and remember-me tokens
- **CV Management** - Create, read, update, delete CVs with custom ordering
- **Dynamic Form Groups** - Flexible form sections with JSON data storage and styling
- **Template System** - Support for different CV templates
- **User Management** - Profile management and user data handling

## Tech Stack

- **Framework**: AdonisJS v6.18.0
- **Language**: TypeScript
- **Database**: PostgreSQL with Lucid ORM
- **Authentication**: Session-based with remember-me tokens
- **Validation**: VineJS
- **Testing**: Japa
- **Code Quality**: ESLint + Prettier

## Setup Instructions

### Prerequisites

- Node.js (v18 or higher)
- PostgreSQL database
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd aergia-backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment setup**
   ```bash
   cp .env.example .env
   ```

4. **Configure environment variables** (see Environment Variables section)

5. **Generate application key**
   ```bash
   node ace generate:key
   ```

6. **Run database migrations**
   ```bash
   node ace migration:run
   ```

7. **Start development server**
   ```bash
   npm run dev
   ```

The server will start at `http://localhost:3333`

## Environment Variables

Configure the following variables in your `.env` file:

```env
# Application
TZ=UTC
PORT=3333
HOST=localhost
LOG_LEVEL=info
APP_KEY=your-generated-app-key
NODE_ENV=development

# Database
DB_HOST=127.0.0.1
DB_PORT=5432
DB_USER=your-db-user
DB_PASSWORD=your-db-password
DB_DATABASE=your-db-name

# Session
SESSION_DRIVER=cookie
```

## Scripts and Commands

### Development
- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm start` - Start production server

### Code Quality
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier
- `npm run typecheck` - TypeScript type checking

### Testing
- `npm test` - Run test suite

### Database
- `node ace migration:run` - Run pending migrations
- `node ace migration:rollback` - Rollback last migration
- `node ace make:migration <name>` - Create new migration

## Database Schema

### Core Tables

- **users** - User accounts with authentication
- **cvs** - CV documents with templates and ordering
- **form_groups** - Dynamic form sections with JSON data
- **remember_me_tokens** - Persistent login tokens

### Key Features

- UUID primary keys for enhanced security
- Auto-incrementing order columns for custom sorting
- JSONB fields for flexible data storage
- Cascade deletion for data integrity

## API Routes

### Authentication (`/auth`)
- `POST /auth/register` - User registration
- `POST /auth/login` - User login (supports remember-me)
- `POST /auth/logout` - User logout
- `GET /auth/isLoggedIn` - Check authentication status

### CV Management (`/cv`) *[Protected]*
- `GET /cv` - List all user CVs
- `POST /cv` - Create new CV
- `GET /cv/:id` - Get specific CV
- `PUT /cv/:id` - Update CV
- `DELETE /cv/:id` - Delete CV
- `POST /cv/reorder` - Reorder CVs

### Form Groups (`/formGroup`) *[Protected]*
- `GET /formGroup/:cv_id` - List CV form groups
- `POST /formGroup/:cv_id` - Create form group
- `GET /formGroup/:cv_id/:id` - Get specific form group
- `PUT /formGroup/:cv_id/:id` - Update form group
- `DELETE /formGroup/:cv_id/:id` - Delete form group
- `POST /formGroup/:cv_id/reorder` - Reorder form groups

### User Management *[Protected]*
- `GET /getUser` - Get current user profile

## Deployment

### Production Build

```bash
npm run build
npm start
```

### Environment Setup

1. Set `NODE_ENV=production`
2. Configure production database
3. Set secure `APP_KEY`
4. Configure proper `HOST` and `PORT`

### Database Setup

Ensure PostgreSQL is configured with UUID extension:

```sql
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
```

## Project Structure

```
aergia-backend/
├── app/
│   ├── controllers/     # HTTP controllers
│   ├── middleware/      # Custom middleware
│   └── models/         # Database models
├── config/             # Configuration files
├── database/
│   └── migrations/     # Database migrations
├── start/              # Application bootstrap
└── tests/              # Test files
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request


## Credits

Built with [AdonisJS](https://adonisjs.com/) - The Node.js Framework highly focused on developer ergonomics, stability and confidence.