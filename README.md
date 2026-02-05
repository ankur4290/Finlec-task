# Task Management Application

A full-stack task management application built with **Spring Boot**, **MySQL**, **React (Vite)**, and **Tailwind CSS**.

## Tech Stack
- **Backend**: Java 17, Spring Boot 3, Spring Data JPA, Spring Security (JWT)
- **Database**: MySQL
- **Frontend**: React, Vite, Tailwind CSS, Axios, React Router

## Prerequisites
- Java 17+ installed
- Node.js & npm installed
- MySQL Server installed and running

## Setup Instructions

### 1. Database Setup
1. Open your MySQL client (Workbench or CLI).
2. Create a new database:
   ```sql
   CREATE DATABASE taskmanager_db;
   ```
3. Update database credentials if necessary in `backend/src/main/resources/application.properties`:
   ```properties
   spring.datasource.username=root
   spring.datasource.password=root
   ```

### 2. Backend Setup
1. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```
2. Run the application:
   ```bash
   mvn spring-boot:run
   ```
   The backend will start on `http://localhost:8080`.

### 3. Frontend Setup
1. Navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
   The frontend will start on `http://localhost:5173`.

## Features
- **Authentication**: User Signup and Login with JWT.
- **Task Management**: Create, Read, Update, Delete tasks.
- **Status Workflow**: Move tasks between Pending, In Progress, and Done.
- **Responsive UI**: Clean dashboard with Kanban-style columns.

## API Testing (Postman)
You can import the following endpoints into Postman:

- **POST** `/api/auth/signup`: `{ "username": "test", "password": "password" }`
- **POST** `/api/auth/signin`: `{ "username": "test", "password": "password" }` -> Returns Token
- **GET** `/api/tasks`: Headers: `Authorization: Bearer <token>`
- **POST** `/api/tasks`: `{ "title": "New Task", "description": "Desc" }`
- **PUT** `/api/tasks/{id}`
- **DELETE** `/api/tasks/{id}`

## Design Decisions
- **Spring Security**: Stateless JWT authentication for scalability.
- **Tailwind CSS**: Used for rapid, utility-first styling to ensure a cleaner and more consistent UI.
- **React Components**: Modular components (TaskCard, Navbar) for reusability.

## Product Thinking & Future Improvements
1.  **Due Dates & Reminders**: Add deadlines to tasks.
2.  **Collaborative Features**: Allow multiple users to share task boards.
3.  **Dark Mode**: Add a toggle for dark/light theme.
