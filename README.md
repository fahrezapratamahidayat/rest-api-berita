# News Management REST API

A comprehensive REST API for news management built with Express.js, TypeScript, and Drizzle ORM. This API provides CRUD operations for news articles with authentication, validation, and rate limiting.

## 🚀 Features

- **Complete CRUD Operations** for news articles
- **JWT Authentication** with secure token handling
- **Input Validation** using express-validator
- **Rate Limiting** (100 requests per IP per hour)
- **CORS Support** for cross-origin requests
- **TypeScript** for type safety
- **Drizzle ORM** for type-safe database operations
- **PostgreSQL** database with proper indexing
- **RESTful API Design** with proper status codes
- **Comprehensive Error Handling**
- **Database Seeding** with sample data

## 📋 Prerequisites

Before running this project, make sure you have:

- Node.js (v18 or higher)
- PostgreSQL database
- npm or yarn package manager

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd news-api
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Fill in your database credentials and other configuration:
   ```env
   DATABASE_URL=postgresql://username:password@localhost:5432/news_api
   JWT_SECRET=your_jwt_secret_key_here
   JWT_EXPIRES_IN=24h
   PORT=3000
   NODE_ENV=development
   ```

4. **Set up the database**
   ```bash
   # Generate migration files
   npm run db:generate
   
   # Run migrations
   npm run db:migrate
   ```

5. **Seed the database (optional)**
   ```bash
   npm run seed
   ```

## 🚦 Running the Application

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm run build
npm start
```

The API will be available at `http://localhost:3000`

## 📚 API Documentation

### Base URL
```
http://localhost:3000/api/v1
```

### Authentication

#### Register User
```http
POST /auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe"
}
```

#### Login User
```http
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

### News Articles

#### Get All Articles (Public)
```http
GET /news?page=1&limit=10&category=Technology
```

#### Get Article by ID (Public)
```http
GET /news/:id
```

#### Get Trending Articles (Public)
```http
GET /news/trending
```

#### Create Article (Protected)
```http
POST /news
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "title": "Article Title",
  "category": "Technology",
  "readTime": "5 menit",
  "imageUrl": "https://example.com/image.jpg",
  "isTrending": false,
  "tags": ["tech", "news"],
  "content": "Article content here...",
  "author": {
    "name": "Author Name",
    "title": "Author Title",
    "avatar": "https://example.com/avatar.jpg"
  }
}
```

#### Update Article (Protected)
```http
PUT /news/:id
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "title": "Updated Title",
  "isTrending": true
}
```

#### Delete Article (Protected)
```http
DELETE /news/:id
Authorization: Bearer <jwt_token>
```

### Health Check
```http
GET /health
```

## 📊 Database Schema

### Articles Table
- `id` (text, primary key)
- `title` (text, required)
- `category` (text, required)
- `published_at` (text)
- `read_time` (text, required)
- `image_url` (text, required)
- `is_trending` (boolean, default: false)
- `tags` (text array)
- `content` (text, required)
- `author` (jsonb, required)
- `created_at` (timestamp)
- `updated_at` (timestamp)

### Users Table
- `id` (uuid, primary key)
- `email` (text, unique, required)
- `password` (text, required)
- `name` (text, required)
- `created_at` (timestamp)

## 🔒 Security Features

- **JWT Authentication** for protected endpoints
- **Rate Limiting** to prevent abuse
- **Input Validation** for all requests
- **CORS Configuration** for secure cross-origin requests
- **Helmet.js** for security headers
- **Password Hashing** with bcrypt
- **Type-safe database operations** with Drizzle ORM

## 🏗️ Project Structure

```
src/
├── db/                  # Database schema and configuration
│   ├── schema.ts        # Drizzle schema definitions
│   ├── index.ts         # Database connection
│   └── migrations/      # Generated migration files
├── config/              # Configuration files
├── controllers/         # Request handlers
├── middleware/          # Custom middleware
├── routes/             # Route definitions
├── services/           # Business logic
├── types/              # TypeScript type definitions
├── scripts/            # Utility scripts
└── index.ts            # Application entry point
```

## 🧪 Testing

Test the API using tools like:
- Postman
- Insomnia
- curl
- HTTP clients

## 📈 Performance

- **Rate Limiting**: 100 requests per IP per hour
- **Database Indexing** for optimized queries
- **Pagination** for large datasets
- **Type-safe queries** with Drizzle ORM
- **Connection pooling** with postgres.js

## 🛠️ Development Tools

- **Drizzle Studio**: Visual database browser
  ```bash
  npm run db:studio
  ```

- **Migration Generation**: Auto-generate migrations from schema changes
  ```bash
  npm run db:generate
  ```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 🆘 Support

If you encounter any issues, please check:
1. Environment variables are properly configured
2. PostgreSQL database is running and accessible
3. Dependencies are installed
4. Migrations have been run

For further assistance, please create an issue in the repository.