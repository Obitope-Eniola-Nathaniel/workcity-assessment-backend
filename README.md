# Workcity Developer Assessment – Backend

This is the backend API for the Workcity Full-Stack & WordPress Developer Assessment. It is built using **Node.js**, **Express**, and **MongoDB**, and provides authentication and CRUD operations for managing **Clients** and **Projects**.

---

## Features

- JWT-based authentication (Login/Signup)
- User roles: `admin`, `user`
- Create, read, update Clients and Projects
- Relationship between Clients and Projects
- Protected routes with role-based access
- Unit tests for:
  - Creating a client (`POST /clients`)
  - Updating a project (`PUT /projects/:id`)

---

## Tech Stack

- **Node.js + Express** (API)
- **MongoDB + Mongoose** (Database)
- **JWT** (Authentication)
- **Jest + Supertest** (Testing)
- **dotenv** (Environment config)



##  Project Structure

├── controllers/ # Route handlers
├── middleware/ # Auth middleware
├── models/ # Mongoose models
├── routes/ # API endpoints
├── tests/ # Unit tests (Jest + Supertest)
├── app.js # Express app config
├── server.js # Server entry point
├── .env # Environment variables



## Setup Instructions

### 1. Clone the repository

```bash
git clone https://github.com/Obitope-Eniola-Nathaniel/workcity-assessment-backend.git

cd workcity-assessment-backend
```

### 2. Install dependencies

npm install

### 3. Set up your environment variables

```bash
PORT=5000
MONGODB_URL=your_mongodb_connection_string
TOKEN_SECRET=your_jwt_secret_key
```

Replace with your actual MongoDB URI and JWT secret.

### 4. Start the development server

npm run dev

Visit: http://localhost:5000

### API Overview

| Method | Endpoint           | Access        | Description              |
| ------ | ------------------ | ------------- | ------------------------ |
| POST   | `/auth/register`   | Public        | Register a new user      |
| POST   | `/auth/login`      | Public        | Log in and get JWT token |
| POST   | `/clients/create`  | Admin only    | Create a new client      |
| GET    | `/clients`         | Authenticated | List all clients         |
| PUT    | `/clients/:id`     | Admin only    | Edit a client            |
| DELETE | `/clients/:id`     | Admin only    | Delete a client          |
| POST   | `/projects/create` | Admin only    | Create a project         |
| GET    | `/projects`        | Authenticated | List all projects        |
| PUT    | `/projects/:id`    | Admin only    | Update a project         |
| DELETE | `/projects/:id`    | Admin only    | Delete a project         |

### Running Tests

## Unit tests are written using Jest and Supertest.

```bash
npm test
```

## Tests include:

POST /clients – Create a new client

PUT /projects/:id – Update an existing project

### Assumptions

-Only logged-in users can access protected routes.
-Only admin users can create, update, or delete clients/projects.
-A project must be linked to a valid client ID.
-Email verification is not implemented due to time constraints.
-API documentation (Swagger) is not included in this version because of time contriant.

### Contact

For any questions or clarifications, please reach out at obitopeeniola@gmail.com

### Thank you
