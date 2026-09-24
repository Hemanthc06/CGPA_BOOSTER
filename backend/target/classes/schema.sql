CREATE DATABASE IF NOT EXISTS cgpa_booster;
USE cgpa_booster;

CREATE TABLE IF NOT EXISTS students (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100),
    roll VARCHAR(50),
    dept VARCHAR(150),
    college VARCHAR(200),
    batch_year VARCHAR(50),
    email VARCHAR(150),
    target_cgpa DECIMAL(4,2),
    target_total_semesters INT DEFAULT 8,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS semesters (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    student_id BIGINT NOT NULL,
    semester_number INT NOT NULL,
    sgpa DECIMAL(4,2) NOT NULL,
    credits DECIMAL(6,2) NOT NULL,
    remarks VARCHAR(500),
    UNIQUE KEY uq_student_semester (student_id, semester_number),
    CONSTRAINT fk_sem_student FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS subjects (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    student_id BIGINT NOT NULL,
    semester_number INT NOT NULL,
    subject_name VARCHAR(200) NOT NULL,
    grade DECIMAL(5,2) NOT NULL,
    credits DECIMAL(6,2) NOT NULL,
    category VARCHAR(100),
    CONSTRAINT fk_sub_student FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS study_sessions (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    student_id BIGINT NOT NULL,
    day_name VARCHAR(20) NOT NULL,
    subject_name VARCHAR(200) NOT NULL,
    time_slot VARCHAR(100) NOT NULL,
    topic VARCHAR(300),
    priority VARCHAR(20),
    completed BOOLEAN DEFAULT FALSE,
    CONSTRAINT fk_session_student FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
);

-- NEW: attendance tracker
CREATE TABLE IF NOT EXISTS attendance (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    student_id BIGINT NOT NULL,
    subject_name VARCHAR(200) NOT NULL,
    classes_present INT NOT NULL DEFAULT 0,
    classes_total   INT NOT NULL DEFAULT 0,
    CONSTRAINT fk_att_student FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
);

-- NEW: goals & milestones
CREATE TABLE IF NOT EXISTS goals (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    student_id BIGINT NOT NULL,
    title VARCHAR(250) NOT NULL,
    description VARCHAR(500),
    deadline DATE,
    priority VARCHAR(20),
    completed BOOLEAN DEFAULT FALSE,
    CONSTRAINT fk_goal_student FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
);

INSERT INTO students (id, name, target_total_semesters)
VALUES (1, NULL, 8)
ON DUPLICATE KEY UPDATE id = id;