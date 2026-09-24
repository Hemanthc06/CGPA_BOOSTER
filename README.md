<div align="center">

# 🎓 AcadHub

### Your complete academic companion — track CGPA, attendance, subjects, study plans, and academic goals, all in one place.

[![Java](https://img.shields.io/badge/Java-17-orange?logo=openjdk&logoColor=white)](https://openjdk.org/)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.x-brightgreen?logo=spring&logoColor=white)](https://spring.io/projects/spring-boot)
[![MySQL](https://img.shields.io/badge/MySQL-8.x-blue?logo=mysql&logoColor=white)](https://www.mysql.com/)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6-yellow?logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![License](https://img.shields.io/badge/License-MIT-purple.svg)](#license)

</div>

---

## 📖 Overview

**AcadHub** is a web-based academic companion designed for students who want to take control of their academic performance. It replaces scattered spreadsheets and sticky notes with a single, intelligent dashboard that tracks everything from semester grades to daily attendance.

Built with **Spring Boot** on the backend and a lightweight **vanilla JavaScript** frontend, AcadHub delivers a fast, responsive experience without the overhead of a heavy SPA framework.

> **AcadHub — Everything academic, all in one place.**

---

## ✨ Features

### 🎯 Academic Tracking
- **CGPA Calculator** — weighted average across all semesters
- **SGPA Tracking** — semester-wise performance with visual charts
- **Subject Management** — record subjects, credits, grades, categories
- **Grade Point Mapping** — automatic conversion from points to grades (O, A+, A, B+, ...)

### 📅 Smart Attendance
- **Per-slot attendance** — each class period is tracked independently by `(subject, date, timeSlot)`
- **Auto-detection from timetable** — classes are inferred from your weekly schedule
- **Present / Absent marking** — one-tap buttons after each class
- **75% rule calculator** — "You can skip 3 more classes" suggestions
- **Daily class records** — audit and delete individual attendance rows

### 🎯 CGPA Target & Predictor
- Set your **target CGPA**
- **Predictor engine**: *"You need an average SGPA of 8.92 in your remaining 40 credits to reach 9.00"*
- Warns you when the target is mathematically impossible

### 📝 Study Planner
- Plan study sessions by **day**, **time slot**, **topic**, and **priority**
- Dashboard widget shows today's plan

### 🎓 Academic Goals
- Track short-term and long-term goals with **deadlines** and **priority levels**

### 🎨 UX & Design
- 🌙 **Dark mode** with localStorage persistence
- 🔔 **Toast notifications** instead of intrusive `alert()` popups
- ✨ **Animated number count-up** on the dashboard
- 📊 **Gradient charts** with Chart.js
- 📱 **Fully responsive** — desktop, tablet, mobile with bottom nav
- 🖨️ **Print-friendly** analysis view

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | HTML5, CSS3, Vanilla JavaScript (ES6+), Chart.js |
| **Backend** | Java 17, Spring Boot 3, Spring Data JPA, Spring Web |
| **Database** | MySQL 8 |
| **Tools** | Maven, Lombok, Git |

---

## 🏗️ Architecture

```
┌──────────────────┐         ┌──────────────────────┐         ┌──────────────┐
│                  │  HTTP   │                      │  JPA    │              │
│  Frontend        │ ──────► │  Spring Boot API     │ ──────► │  MySQL 8     │
│  (HTML/CSS/JS)   │  JSON   │  (Controllers,       │         │  cgpa_db     │
│                  │ ◄────── │   Services,          │ ◄────── │              │
│  localhost:5500  │         │   Repositories)      │         │              │
└──────────────────┘         │  localhost:8080      │         └──────────────┘
                             └──────────────────────┘
```

---

## 📁 Project Structure

```
AcadHub/
│
├── backend/                                 # Spring Boot project
│   ├── pom.xml
│   ├── mvnw
│   ├── mvnw.cmd
│   ├── .mvn/wrapper/
│   └── src/
│       └── main/
│           ├── java/com/example/cgpa/
│           │   ├── AcadHubApplication.java
│           │   ├── controller/              # REST endpoints
│           │   │   ├── UserController.java
│           │   │   ├── SemesterController.java
│           │   │   ├── SubjectController.java
│           │   │   ├── AttendanceController.java
│           │   │   ├── StudyPlanController.java
│           │   │   └── GoalController.java
│           │   ├── entity/                  # JPA entities
│           │   │   ├── User.java
│           │   │   ├── Semester.java
│           │   │   ├── Subject.java
│           │   │   ├── Attendance.java
│           │   │   ├── StudyPlan.java
│           │   │   └── Goal.java
│           │   ├── repository/              # Spring Data JPA repos
│           │   └── service/                 # Business logic
│           └── resources/
│               └── application.properties
│
├── frontend/                                # Static HTML/CSS/JS
│   ├── index.html                           # Main dashboard
│   ├── login.html                           # Login / signup
│   ├── script.js                            # Dashboard logic
│   ├── login.js                             # Auth logic
│   ├── style.css                            # Dashboard styles
│   └── login.css                            # Auth page styles
│
├── .gitignore
├── LICENSE
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- **Java JDK 17+** — [Download](https://adoptium.net/)
- **Maven 3.8+** — [Download](https://maven.apache.org/) *(or use the included `mvnw`)*
- **MySQL 8+** — [Download](https://dev.mysql.com/downloads/)
- **A modern browser** — Chrome, Firefox, Edge
- *(Optional)* **VS Code + Live Server extension** — for the frontend

### 1️⃣ Clone the repository

```bash
git clone https://github.com/Hemanthc06/AcadHub.git
cd AcadHub
```

### 2️⃣ Set up MySQL

Start MySQL and create a database (the backend can also auto-create it):

```sql
CREATE DATABASE IF NOT EXISTS cgpa_db;
```

### 3️⃣ Configure the backend

Open `backend/src/main/resources/application.properties`:

```properties
spring.application.name=AcadHub

spring.datasource.url=${DB_URL:jdbc:mysql://localhost:3306/cgpa_db?createDatabaseIfNotExist=true}
spring.datasource.username=${DB_USERNAME:root}
spring.datasource.password=${DB_PASSWORD:}

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=false
spring.jpa.properties.hibernate.format_sql=true

server.port=8080
```

Then set environment variables for your local machine:

**Windows (PowerShell):**
```powershell
$env:DB_USERNAME="root"
$env:DB_PASSWORD="your_mysql_password"
```

**macOS / Linux:**
```bash
export DB_USERNAME=root
export DB_PASSWORD=your_mysql_password
```

### 4️⃣ Start the backend

```bash
cd backend
./mvnw spring-boot:run
```

**Windows:**
```powershell
cd backend
.\mvnw.cmd spring-boot:run
```

Backend will be live at **`http://localhost:8080`**.
You should see `Started AcadHubApplication` in the console.

### 5️⃣ Start the frontend

**Option A — Open directly:**
Just double-click `frontend/login.html`.

**Option B — Serve locally (recommended):**

```bash
cd frontend

# Python
python -m http.server 5500

# or Node.js
npx http-server -p 5500
```

Then open **`http://localhost:5500/login.html`**.

### 6️⃣ Create your account

- Click **"Create Account"**
- Fill in your name, roll number, branch, email, and password
- Log in and start using the dashboard 🎉

---

## 🔌 API Reference

### Base URL
```
http://localhost:8080/api
```

### Users
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/users/register` | Register a new user |
| `POST` | `/users/login` | Login and receive user object |
| `GET` | `/users` | Get all users |
| `GET` | `/users/{id}` | Get user by ID |
| `PUT` | `/users/{id}` | Update profile / target CGPA |
| `DELETE` | `/users/{id}` | Delete user |

### Semesters
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/semesters/user/{userId}` | All semesters for a user |
| `POST` | `/semesters` | Create semester |
| `PUT` | `/semesters/{id}` | Update semester |
| `DELETE` | `/semesters/{id}` | Delete semester |

### Subjects
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/subjects/user/{userId}` | All subjects |
| `POST` | `/subjects` | Create subject |
| `PUT` | `/subjects/{id}` | Update subject |
| `DELETE` | `/subjects/{id}` | Delete subject |

### Attendance
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/attendance/user/{userId}` | All attendance records |
| `GET` | `/attendance/slot` | Find a specific slot by `userId`, `subject`, `classDate`, `timeSlot` |
| `POST` | `/attendance` | Create attendance |
| `PUT` | `/attendance/{id}` | Update attendance |
| `DELETE` | `/attendance/{id}` | Delete attendance |

### Study Plans
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/study-plans/user/{userId}` | All study plans |
| `POST` | `/study-plans` | Create study plan |
| `PUT` | `/study-plans/{id}` | Update study plan |
| `DELETE` | `/study-plans/{id}` | Delete study plan |

### Goals
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/goals/user/{userId}` | All goals |
| `POST` | `/goals` | Create goal |
| `PUT` | `/goals/{id}` | Update goal |
| `DELETE` | `/goals/{id}` | Delete goal |

---

## 🗄️ Database Schema

```
┌──────────────┐       ┌──────────────────┐       ┌──────────────┐
│   user       │       │   semester       │       │   subject    │
├──────────────┤       ├──────────────────┤       ├──────────────┤
│ id (PK)      │───┐   │ id (PK)          │       │ id (PK)      │
│ name         │   │   │ user_id (FK)     │───────│ user_id (FK) │
│ email (uniq) │   ├──►│ semester_number  │       │ name         │
│ password     │   │   │ sgpa             │       │ code         │
│ roll_number  │   │   │ credits          │       │ grade        │
│ branch       │   │   └──────────────────┘       │ grade_point  │
│ target_cgpa  │   │                              │ credits      │
└──────────────┘   │                              │ category     │
                   │                              └──────────────┘
                   │
                   │   ┌──────────────────┐       ┌──────────────┐
                   │   │   attendance     │       │  study_plan  │
                   │   ├──────────────────┤       ├──────────────┤
                   ├──►│ id (PK)          │       │ id (PK)      │
                   │   │ user_id (FK)     │       │ user_id (FK) │
                   │   │ subject          │       │ day          │
                   │   │ classes_present  │       │ subject      │
                   │   │ total_classes    │       │ time_slot    │
                   │   │ class_date       │       │ topic        │
                   │   │ time_slot        │       │ priority     │
                   │   │ status           │       └──────────────┘
                   │   └──────────────────┘
                   │
                   │   ┌──────────────┐
                   │   │    goal      │
                   │   ├──────────────┤
                   └──►│ id (PK)      │
                       │ user_id (FK) │
                       │ title        │
                       │ description  │
                       │ deadline     │
                       │ priority     │
                       └──────────────┘
```

---

## 🖼️ Screenshots

> Replace these with actual screenshots after running the app locally.

| Dashboard | Attendance |
|-----------|------------|
| ![Dashboard](docs/dashboard.png) | ![Attendance](docs/attendance.png) |

| CGPA Target & Predictor | Dark Mode |
|-------------------------|-----------|
| ![Target](docs/target.png) | ![Dark](docs/dark.png) |

---

## 🎨 Brand Colors

| Purpose | Hex |
|---------|-----|
| Primary | `#6c5ce7` |
| Primary Dark | `#5848d6` |
| Secondary | `#4f8cff` |
| Success | `#20bf6b` |
| Warning | `#f7b731` |
| Danger | `#eb3b5a` |
| Background | `#f5f7fb` |
| Text | `#202534` |
| Muted | `#7b8191` |

---

## 🧠 Interesting Implementation Details

### Per-Slot Attendance Tracking
Each attendance record is keyed by the tuple `(userId, subject, classDate, timeSlot)`. This means:

- Monday's 8:00 AM **SDA** class is a **different** record from Monday's 8:55 AM **SDA** class.
- Historical records are preserved — you can look back at any past day.
- Aggregated cards compute percentages **per subject** across all days.

### Case-Insensitive Subject Matching
The frontend normalizes subject names using `subjectKey(name) = name.trim().toLowerCase()` so that `"Stream Data Analytics"` and `"STREAM DATA ANALYTICS"` merge into one card.

### CGPA Predictor Math
Given current CGPA `C`, current credits `C₀`, target `T`, and remaining credits `R`:

```
requiredSGPA = (T × (C₀ + R) − C × C₀) / R
```

- If `requiredSGPA > 10` → target is unreachable
- If `requiredSGPA < 0` → target already exceeded
- Otherwise → show target grade needed

---

## 🧪 Testing the API

Quick smoke test with `curl`:

```bash
# Register
curl -X POST http://localhost:8080/api/users/register \
     -H "Content-Type: application/json" \
     -d '{"name":"Test","email":"t@t.com","password":"123","rollNumber":"1","branch":"CSE"}'

# Login
curl -X POST http://localhost:8080/api/users/login \
     -H "Content-Type: application/json" \
     -d '{"email":"t@t.com","password":"123"}'
```

---

## 🐛 Troubleshooting

| Problem | Solution |
|---------|----------|
| `Communications link failure` | MySQL is not running — start it |
| `Access denied for user 'root'` | Wrong password — check `DB_PASSWORD` env var |
| `Port 8080 already in use` | Change `server.port` in `application.properties` |
| `CORS policy blocked` | Ensure `@CrossOrigin` is on the controller (already done) |
| `White page on frontend` | Open browser console (F12) — check for JS errors |
| `Table doesn't exist` | Set `spring.jpa.hibernate.ddl-auto=update` and restart |
| Duplicate user rows | Add `unique = true` on `User.email` and clean DB |

---

## 🚧 Roadmap

- [ ] JWT-based authentication
- [ ] BCrypt password hashing
- [ ] Weekly email summary
- [ ] Export report as PDF
- [ ] Progressive Web App (PWA) + offline mode
- [ ] AI-powered study suggestions
- [ ] Admin role with class-wide analytics
- [ ] Timetable stored in DB (currently hardcoded in JS)

---

## 🤝 Contributing

Contributions are welcome! If you'd like to improve AcadHub:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Commit your changes: `git commit -m "Add my feature"`
4. Push to the branch: `git push origin feature/my-feature`
5. Open a Pull Request

Please make sure `mvn clean compile` passes before submitting.

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

## 👤 Author

**Hemanth C**
- GitHub: [@Hemanthc06](https://github.com/Hemanthc06)

---

## 🙏 Acknowledgements

- [Spring Boot](https://spring.io/projects/spring-boot) — backend framework
- [Chart.js](https://www.chartjs.org/) — beautiful charts
- [Inter Font](https://fonts.google.com/specimen/Inter) — typography
- [Font Awesome](https://fontawesome.com/) — icons

---

<div align="center">

**⭐ If you found this project helpful, give it a star!**

Made with 💜 by Hemanth C

</div>
