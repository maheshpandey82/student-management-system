# Student Management System (Java + Spring Boot + React + MySQL)

A beginner-friendly full-stack student management project.

## Features
- Dashboard summary
- Add, view, search, edit and delete students
- Course list
- REST API with Spring Boot
- React frontend with responsive CSS
- MySQL database via Spring Data JPA

## Requirements
- Java 17+
- Maven 3.8+
- Node.js 18+
- MySQL 8+

## 1. Create database
Open MySQL and run:
```sql
CREATE DATABASE student_management;
```

## 2. Configure backend
Edit `backend/src/main/resources/application.properties` and set your MySQL username/password.

## 3. Run backend
From the `backend` folder:
```bash
mvn spring-boot:run
```
Backend runs at `http://localhost:8080`.

## 4. Run frontend
In a second terminal, from the `frontend` folder:
```bash
npm install
npm run dev
```
Open the URL Vite prints, usually `http://localhost:5173`.

## API endpoints
- `GET /api/students`
- `GET /api/students/{id}`
- `POST /api/students`
- `PUT /api/students/{id}`
- `DELETE /api/students/{id}`
- `GET /api/courses`
- `GET /api/dashboard/stats`

This is a learning project. Authentication/JWT and production deployment can be added later.
