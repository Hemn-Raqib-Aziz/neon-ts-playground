# 🚀 Neon + TypeScript Playground

<div align="center">

![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge&logo=express&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![Neon](https://img.shields.io/badge/Neon-00E599?style=for-the-badge&logo=neon&logoColor=white)

**A minimal yet robust starter project built with TypeScript, Express, and PostgreSQL**

[🔗 Repository](https://github.com/Hemn-Raqib-Aziz/neon-ts-playground)

</div>

---

## 🚀 Project Overview

This backend API server is designed for easy extension and scalability. It features a simple **blog post management system** with PostgreSQL as the data store, leveraging Neon as the managed cloud database service.

The project is written in **TypeScript** for type safety and modern JavaScript features and is structured around **Express** middleware for clean request handling, logging, and error management.

---

## 📂 Complete Folder Structure

```
NEON/
├── .env.development.local      # Development environment variables
├── .env.production.local       # Production environment variables
├── .gitignore                  # Git ignore rules for sensitive and build files
├── package.json                # Project dependencies and scripts
├── package-lock.json           # Exact versions for dependencies
├── tsconfig.json               # TypeScript compiler config
└── src/
    ├── config/
    │   └── config.ts           # Environment configuration loader
    ├── controllers/
    │   └── postControllers.ts  # API route handlers (posts)
    ├── database/
    │   ├── db.ts               # PostgreSQL connection pool setup
    │   └── init.ts             # DB table initialization and dummy data insertion
    ├── log/                    # Folder for generated log files (empty initially)
    ├── middleware/
    │   ├── error.ts            # Centralized error handling middleware
    │   └── logger.ts           # Request logger middleware capturing detailed info
    ├── models/
    │   └── post.model.ts       # TypeScript interface for Post entity
    ├── routes/
    │   └── postRoutes.ts       # Express router for post endpoints
    ├── types/
    │   └── custom-error.d.ts   # Custom error interface extending Error
    ├── utils/
    │   ├── loggerHelper.ts     # Helper functions for logging (formatting, indicators)
    │   └── loggerTables.ts     # Template functions to format log entries
    ├── server.ts               # Express app setup and middleware registration
    └── startServer.ts          # Entry point: DB test, initialization, and server start
```

---

## 🛠️ Key Features and Functionality

### 1. **Database Connection and Initialization**
- Uses `pg` with a connection pool to connect to Neon PostgreSQL using connection string in `.env`
- On startup, checks if the `post` table exists and creates it if missing with schema:
  - `id`: SERIAL PRIMARY KEY
  - `title`: VARCHAR NOT NULL
  - `description`: VARCHAR (optional)  
  - `created_at`: TIMESTAMP with default current timestamp
  - `updated_at`: TIMESTAMP with default current timestamp
- Inserts sample dummy posts about famous tourist spots for initial testing

### 2. **Express Server & Routing**
- Centralized API under `/api/v1/posts` route
- **GET** `/api/v1/posts` — Retrieve all posts
- **POST** `/api/v1/posts` — Create a new post with validation (title required)
- Uses `express.json()` for JSON body parsing

### 3. **Middleware**
**Logger Middleware**: Captures detailed request & response info, logs to multiple files (access.log, error.log, performance.log, security.log, debug.log), detects suspicious requests, and logs long-running requests (>1000ms) separately.

**Error Handling Middleware**: Catches all errors, returns JSON error responses, handles PostgreSQL error codes, and supports validation errors with proper HTTP status codes.

### 4. **Utilities**
Logging helpers handle formatting of status icons, HTTP method emojis, data size in bytes, padding, and safe JSON stringification. Logger templates format consistent multi-line, box-style log entries.

### 5. **TypeScript and Configuration**
Strict TypeScript setup with modern module resolution. Environment config loaded dynamically based on NODE_ENV. Uses cross-env and nodemon for development and production startup scripts.

---

## 🔧 Getting Started

| Step | Command | Description |
|------|---------|-------------|
| **1** | `git clone https://github.com/Hemn-Raqib-Aziz/neon-ts-playground.git` | Clone the repo |
| **2** | `cd neon-ts-playground && npm install` | Install dependencies |
| **3** | Create Neon project at [neon.tech](https://neon.tech) | Configure database |
| **4** | Add `DATABASE_URL` to `.env.development.local` | Set environment variables |
| **5** | `npm run start:dev` | Start development server |

### 🌐 API Testing
- **GET** `http://localhost:3000/api/v1/posts` — Retrieve all posts
- **POST** `http://localhost:3000/api/v1/posts` — Create new post 
  ```json
  { "title": "Post Title", "description": "Optional description" }
  ```

### 📜 Available Scripts
| Script | Command | Purpose |
|--------|---------|---------|
| Development | `npm run start:dev` | Start with hot reload |
| Production | `npm run start:prod` | Start in production mode |

---

## 🧑‍💻 Author

**Hemn Raqib Aziz**  
GitHub: [@Hemn-Raqib-Aziz](https://github.com/Hemn-Raqib-Aziz)

---

## ⚠️ Notes

- `.env.*.local` files are excluded from version control by `.gitignore`
- The `log/` directory stores runtime logs generated by the logger middleware
- Database table and dummy data creation runs automatically on server start — no manual setup needed
- Middleware is extensible for future authentication, rate limiting, or other features
- Strict TypeScript typing improves maintainability and developer experience

**Feel free to contribute or customize this starter template for your Node.js + PostgreSQL API needs!**