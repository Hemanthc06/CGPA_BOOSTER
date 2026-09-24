# CGPA Booster Backend — Spring Boot + MySQL

## Requirements
- Java 17+
- Maven 3.9+
- MySQL 8+

## 1. Configure MySQL
Open `src/main/resources/application.properties` and replace:

`spring.datasource.password=YOUR_MYSQL_PASSWORD`

with your MySQL root password.

## 2. Start the backend
From this `backend` folder:

```bash
mvn spring-boot:run
```

The API runs at `http://localhost:8080`.

## 3. Open the frontend
From the project root, run a simple local web server instead of opening `index.html` directly. For example, with Python:

```bash
python -m http.server 5500
```

Then open `http://localhost:5500`.

## API
- `GET /api/student-data/1` — loads profile, semesters, subjects, planner and target.
- `PUT /api/student-data/1` — saves the current application state into MySQL.

The frontend keeps a localStorage backup, so the application still works if the backend is temporarily offline.
