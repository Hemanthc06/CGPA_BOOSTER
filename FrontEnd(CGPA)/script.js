/* =========================================================
   CGPA BOOSTER - script.js (Final)
   ========================================================= */

const API_URL = "http://localhost:8080/api";

let currentUser = null;
let currentUserId = null;

const appData = {
    profile: { name: "Student", email: "", rollNumber: "", branch: "" },
    target: 9.00,
    semesters: [],
    subjects: [],
    attendance: [],
    studyPlans: [],
    goals: []
};

let sgpaChart = null;
let analysisChart = null;

/* =========================================================
   HELPERS
   ========================================================= */

function setText(id, value) {
    const el = document.getElementById(id);
    if (el) el.textContent = value;
}

function setValue(id, value) {
    const el = document.getElementById(id);
    if (el) el.value = value ?? "";
}

function escapeHTML(value) {
    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

function subjectKey(name) {
    return (name || "").trim().toLowerCase();
}

/* =========================================================
   TOAST
   ========================================================= */

function toast(message, type = "success") {
    const el = document.createElement("div");
    el.className = `toast toast-${type}`;
    el.textContent = message;
    document.body.appendChild(el);

    setTimeout(() => el.classList.add("show"), 10);

    setTimeout(() => {
        el.classList.remove("show");
        setTimeout(() => el.remove(), 300);
    }, 3000);
}

/* =========================================================
   THEME TOGGLE
   ========================================================= */

function toggleTheme() {
    document.body.classList.toggle("dark-mode");
    localStorage.setItem(
        "theme",
        document.body.classList.contains("dark-mode") ? "dark" : "light"
    );
}

/* =========================================================
   COUNT-UP ANIMATION
   ========================================================= */

function animateNumber(el, target, duration = 800) {
    if (!el) return;
    const start = 0;
    const startTime = performance.now();

    function tick(now) {
        const progress = Math.min((now - startTime) / duration, 1);
        el.textContent = (start + (target - start) * progress).toFixed(2);
        if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
}

/* =========================================================
   API HELPER
   ========================================================= */

async function apiFetch(path, options = {}) {
    const res = await fetch(`${API_URL}${path}`, {
        headers: { "Content-Type": "application/json", ...(options.headers || {}) },
        ...options
    });
    if (!res.ok) {
        let msg = `Request failed: ${res.status}`;
        try { const j = await res.json(); if (j.message) msg = j.message; } catch (_) {}
        throw new Error(msg);
    }
    if (res.status === 204) return null;
    const text = await res.text();
    return text ? JSON.parse(text) : null;
}

/* =========================================================
   LOAD LOGGED-IN USER
   ========================================================= */

async function loadLoggedInUser() {
    const saved = localStorage.getItem("loggedInUser");
    if (!saved) { window.location.href = "login.html"; return false; }

    try {
        const logged = JSON.parse(saved);
        if (!logged.id) { window.location.href = "login.html"; return false; }

        const user = await apiFetch(`/users/${logged.id}`);
        currentUser = user;
        currentUserId = user.id;
        localStorage.setItem("loggedInUser", JSON.stringify(user));

        appData.profile.name = user.name || "Student";
        appData.profile.email = user.email || "";
        appData.profile.rollNumber = user.rollNumber || "";
        appData.profile.branch = user.branch || "";
        appData.target = user.targetCgpa != null ? Number(user.targetCgpa) : 9.00;

        loadProfile();
        return true;
    } catch (err) {
        console.error("loadLoggedInUser error:", err);
        toast("Unable to connect to backend.", "error");
        return false;
    }
}

/* =========================================================
   LOAD ALL DATA FROM BACKEND
   ========================================================= */

async function loadAllFromBackend() {
    if (!currentUserId) return;

    const [semesters, subjects, attendance, studyPlans, goals] = await Promise.all([
        apiFetch(`/semesters/user/${currentUserId}`).catch(() => []),
        apiFetch(`/subjects/user/${currentUserId}`).catch(() => []),
        apiFetch(`/attendance/user/${currentUserId}`).catch(() => []),
        apiFetch(`/study-plans/user/${currentUserId}`).catch(() => []),
        apiFetch(`/goals/user/${currentUserId}`).catch(() => [])
    ]);

    appData.semesters = (semesters || []).map(s => ({
        id: s.id,
        number: s.semesterNumber,
        sgpa: s.sgpa,
        credits: s.credits
    }));

    appData.subjects = (subjects || []).map(s => ({
        id: s.id,
        semester: s.semester,
        name: s.name,
        code: s.code || "-",
        grade: s.grade,
        gradePoint: s.gradePoint,
        credits: s.credits,
        category: s.category
    }));

    appData.attendance = (attendance || []).map(mapAttendance);

    appData.studyPlans = (studyPlans || []).map(p => ({
        id: p.id,
        day: p.day,
        subject: p.subject,
        time: p.timeSlot,
        topic: p.topic,
        priority: p.priority
    }));

    appData.goals = (goals || []).map(g => ({
        id: g.id,
        title: g.title,
        description: g.description,
        deadline: g.deadline,
        priority: g.priority
    }));
}

/* =========================================================
   NAVIGATION
   ========================================================= */

function showPage(pageId) {
    document.querySelectorAll(".page").forEach(p => p.classList.remove("active-page"));
    const page = document.getElementById(pageId);
    if (!page) return;
    page.classList.add("active-page");

    const info = {
        dashboardPage: ["Dashboard", "Welcome back! Here's your academic overview."],
        profilePage: ["My Profile", "Manage your student information."],
        semesterPage: ["Semesters", "Manage your semester performance."],
        subjectPage: ["Subjects", "Manage your subjects and grades."],
        attendancePage: ["Attendance", "Monitor your subject-wise attendance."],
        plannerPage: ["Study Planner", "Organize your study schedule."],
        goalPage: ["Academic Goals", "Set and track your academic goals."],
        targetPage: ["CGPA Target", "Set your desired CGPA target."],
        analysisPage: ["Academic Analysis", "Understand your academic performance."]
    };

    if (info[pageId]) {
        setText("pageTitle", info[pageId][0]);
        setText("pageSubtitle", info[pageId][1]);
    }

    document.querySelectorAll(".nav-item").forEach(item => {
        item.classList.remove("active");
        const code = item.getAttribute("onclick") || "";
        if (code.includes("'" + pageId + "'")) item.classList.add("active");
    });

    if (pageId === "attendancePage") {
        processCompletedClasses().then(() => {
            renderTodayTimetable();
            renderTodayClassRecords();
            renderAttendance();
        });
    }
    if (pageId === "analysisPage") {
        updateAnalysis();
        renderAnalysisChart();
    }
    if (pageId === "targetPage") {
        setText("targetPageCurrentCGPA", calculateCGPA().toFixed(2));
        renderTargetPredictor();
    }

    if (window.innerWidth <= 768) {
        const sidebar = document.querySelector(".sidebar");
        if (sidebar) sidebar.classList.remove("mobile-open");
    }
}

function toggleSidebar() {
    const s = document.querySelector(".sidebar");
    if (s) s.classList.toggle("mobile-open");
}

/* =========================================================
   CALCULATIONS
   ========================================================= */

function calculateCGPA() {
    if (appData.semesters.length === 0) return 0;
    let weighted = 0, total = 0;
    appData.semesters.forEach(s => {
        const sgpa = Number(s.sgpa) || 0;
        const cr = Number(s.credits) || 0;
        weighted += sgpa * cr;
        total += cr;
    });
    if (total === 0) {
        const avg = appData.semesters.reduce((sum, s) => sum + Number(s.sgpa || 0), 0);
        return avg / appData.semesters.length;
    }
    return weighted / total;
}

function calculateTotalCredits() {
    return appData.semesters.reduce((sum, s) => sum + (Number(s.credits) || 0), 0);
}

function calculateLatestSGPA() {
    if (appData.semesters.length === 0) return 0;
    const sorted = [...appData.semesters].sort((a, b) => Number(b.number) - Number(a.number));
    return Number(sorted[0].sgpa) || 0;
}

function calculateAverageSGPA() {
    if (appData.semesters.length === 0) return 0;
    const total = appData.semesters.reduce((sum, s) => sum + Number(s.sgpa || 0), 0);
    return total / appData.semesters.length;
}

function calculateAttendance() {
    const bySubject = {};

    appData.attendance.forEach(a => {
        if (a.total === 0 && a.status !== "present" && a.status !== "absent") return;

        const key = subjectKey(a.subject);

        if (!bySubject[key]) bySubject[key] = { present: 0, total: 0 };
        const s = bySubject[key];

        if (a.status === "present") {
            s.present += 1;
            s.total += 1;
        } else if (a.status === "absent") {
            s.total += 1;
        } else {
            s.present += a.present;
            s.total += a.total;
        }
    });

    let present = 0, total = 0;
    Object.values(bySubject).forEach(s => {
        present += s.present;
        total += s.total;
    });

    if (total === 0) return 0;
    return (present / total) * 100;
}

/* =========================================================
   CGPA PREDICTOR
   ========================================================= */

function requiredSGPA(currentCGPA, currentCredits, targetCGPA, remainingCredits) {
    if (remainingCredits <= 0) return 0;
    const targetTotal = targetCGPA * (currentCredits + remainingCredits);
    const currentTotal = currentCGPA * currentCredits;
    return (targetTotal - currentTotal) / remainingCredits;
}

function renderTargetPredictor() {
    const container = document.getElementById("targetPredictor");
    if (!container) return;

    const currentCGPA = calculateCGPA();
    const currentCredits = calculateTotalCredits();
    const target = Number(appData.target) || 0;

    const remainingInput = document.getElementById("remainingCredits");
    const remaining = remainingInput && remainingInput.value
        ? Number(remainingInput.value)
        : 40;

    if (currentCredits === 0) {
        container.innerHTML = `<div class="empty-state">Add semester data to see predictions.</div>`;
        return;
    }

    const needed = requiredSGPA(currentCGPA, currentCredits, target, remaining);

    let message, color;
    if (needed > 10) {
        message = `⚠️ You need an average SGPA of <b>${needed.toFixed(2)}</b> in the next ${remaining} credits — that's <b>not achievable</b>. Consider lowering your target.`;
        color = "#eb3b5a";
    } else if (needed < 0) {
        message = `🎉 You've already exceeded your target! Any average SGPA above <b>0</b> keeps you above ${target.toFixed(2)}.`;
        color = "#20bf6b";
    } else {
        message = `🎯 You need an average SGPA of <b>${needed.toFixed(2)}</b> in your remaining <b>${remaining} credits</b> to reach <b>${target.toFixed(2)} CGPA</b>.`;
        color = "#6c5ce7";
    }

    container.innerHTML = `
        <div style="background:${color}15;border:1px solid ${color}40;border-radius:12px;padding:18px;font-size:13px;line-height:1.6;color:#202534;">
            ${message}
        </div>
        <div class="input-group" style="margin-top:14px;">
            <label>Remaining Credits (for prediction)</label>
            <input type="number" id="remainingCredits" min="1" max="200" value="${remaining}"
                   oninput="renderTargetPredictor()">
        </div>
    `;
}

/* =========================================================
   ATTENDANCE PREDICTOR
   ========================================================= */

function canSkip(present, total, requiredPct = 75) {
    if (total === 0) return 0;
    let skips = 0;
    while (((present) / (total + skips + 1)) * 100 >= requiredPct) {
        skips++;
        if (skips > 100) break;
    }
    return skips;
}

/* =========================================================
   EXPORT REPORT
   ========================================================= */

function exportReport() {
    window.print();
}

/* =========================================================
   DASHBOARD
   ========================================================= */

function renderDashboard() {
    const cgpa = calculateCGPA();
    const sgpa = calculateLatestSGPA();
    const att = calculateAttendance();

    animateNumber(document.getElementById("dashboardCGPA"), cgpa);
    setText("dashboardTarget", Number(appData.target).toFixed(2));
    animateNumber(document.getElementById("statCGPA"), cgpa);
    animateNumber(document.getElementById("statSGPA"), sgpa);

    setText("statAttendance", Math.round(att));
    setText("statSubjects", appData.subjects.length);
    setText("targetCGPA", Number(appData.target).toFixed(2));
    setText("currentTargetCGPA", cgpa.toFixed(2));

    const tgt = document.getElementById("targetInput");
    if (tgt && document.activeElement !== tgt) tgt.value = appData.target;

    renderTargetProgress();
    renderSubjectDashboard();
    renderDashboardAttendance();
    renderDashboardStudyPlan();
    renderDashboardGoals();
    renderSGPAChart();
}

function renderTargetProgress() {
    const cgpa = calculateCGPA();
    const target = Number(appData.target) || 0;
    let pct = target > 0 ? (cgpa / target) * 100 : 0;
    pct = Math.max(0, Math.min(100, pct));
    setText("targetPercentage", Math.round(pct) + "%");
}

async function saveTarget() {
    const input = document.getElementById("targetInput");
    const value = Number(input.value);

    if (!value || value < 0 || value > 10) {
        toast("Please enter a CGPA between 0 and 10.", "error");
        return;
    }

    try {
        const updated = await apiFetch(`/users/${currentUserId}`, {
            method: "PUT",
            body: JSON.stringify({
                name: currentUser.name,
                email: currentUser.email,
                rollNumber: currentUser.rollNumber,
                branch: currentUser.branch,
                targetCgpa: value
            })
        });

        currentUser = updated;
        localStorage.setItem("loggedInUser", JSON.stringify(updated));
        appData.target = Number(updated.targetCgpa);

        refreshAll();
        setText("targetPageCurrentCGPA", calculateCGPA().toFixed(2));
        renderTargetPredictor();
        toast("CGPA target saved successfully.");
    } catch (err) {
        toast("Failed to save target: " + err.message, "error");
    }
}

/* =========================================================
   PROFILE
   ========================================================= */

function loadProfile() {
    setValue("profileName", appData.profile.name);
    setValue("profileEmail", appData.profile.email);
    setValue("profileRollNumber", appData.profile.rollNumber);
    setValue("profileBranch", appData.profile.branch);

    setText("topUserName", appData.profile.name || "Student");
    setText("topUserEmail", appData.profile.email || "student@email.com");

    const avatar = document.getElementById("userAvatar");
    if (avatar) {
        avatar.textContent = (appData.profile.name || "Student").charAt(0).toUpperCase();
    }
}

async function updateProfile() {
    const name = document.getElementById("profileName").value.trim() || "Student";
    const roll = document.getElementById("profileRollNumber").value.trim();
    const branch = document.getElementById("profileBranch").value.trim();

    try {
        const updated = await apiFetch(`/users/${currentUserId}`, {
            method: "PUT",
            body: JSON.stringify({
                name,
                email: currentUser.email,
                rollNumber: roll,
                branch,
                targetCgpa: currentUser.targetCgpa
            })
        });

        currentUser = updated;
        localStorage.setItem("loggedInUser", JSON.stringify(updated));

        appData.profile.name = updated.name || "Student";
        appData.profile.rollNumber = updated.rollNumber || "";
        appData.profile.branch = updated.branch || "";

        loadProfile();
        toast("Profile updated successfully.");
    } catch (err) {
        toast("Failed to update profile: " + err.message, "error");
    }
}

/* =========================================================
   SEMESTERS
   ========================================================= */

function openSemesterForm() { openModal("semesterModal"); }

function renderSemesters() {
    const table = document.getElementById("semesterTable");
    if (!table) return;

    if (appData.semesters.length === 0) {
        table.innerHTML = `<tr><td colspan="4">No semester data available.</td></tr>`;
        return;
    }

    const semesters = [...appData.semesters].sort((a, b) => Number(a.number) - Number(b.number));

    table.innerHTML = semesters.map(s => `
        <tr>
            <td>Semester ${s.number}</td>
            <td>${Number(s.sgpa).toFixed(2)}</td>
            <td>${s.credits}</td>
            <td>
                <button type="button" class="delete-btn"
                    onclick="deleteSemester(${s.id})">Delete</button>
            </td>
        </tr>
    `).join("");
}

async function deleteSemester(id) {
    if (!confirm("Delete this semester?")) return;
    try {
        await apiFetch(`/semesters/${id}`, { method: "DELETE" });
        appData.semesters = appData.semesters.filter(s => s.id !== id);
        refreshAll();
        toast("Semester deleted.");
    } catch (err) {
        toast("Failed to delete: " + err.message, "error");
    }
}

/* =========================================================
   SUBJECTS
   ========================================================= */

function openSubjectForm() { openModal("subjectModal"); }

function gradeFromPoint(point) {
    point = Number(point);
    if (point >= 10) return "O";
    if (point >= 9) return "A+";
    if (point >= 8) return "A";
    if (point >= 7) return "B+";
    if (point >= 6) return "B";
    if (point >= 5) return "C";
    if (point >= 4) return "D";
    return "F";
}

function renderSubjects() {
    const table = document.getElementById("subjectTable");
    if (!table) return;

    if (appData.subjects.length === 0) {
        table.innerHTML = `<tr><td colspan="6">No subject data available.</td></tr>`;
        return;
    }

    table.innerHTML = appData.subjects.map(s => `
        <tr>
            <td>${escapeHTML(s.name)}</td>
            <td>${escapeHTML(s.code || "-")}</td>
            <td>${s.credits}</td>
            <td>${escapeHTML(s.grade)}</td>
            <td>${Number(s.gradePoint).toFixed(2)}</td>
            <td>
                <button type="button" class="delete-btn"
                    onclick="deleteSubject(${s.id})">Delete</button>
            </td>
        </tr>
    `).join("");
}

async function deleteSubject(id) {
    if (!confirm("Delete this subject?")) return;
    try {
        await apiFetch(`/subjects/${id}`, { method: "DELETE" });
        appData.subjects = appData.subjects.filter(s => s.id !== id);
        refreshAll();
        toast("Subject deleted.");
    } catch (err) {
        toast("Failed to delete: " + err.message, "error");
    }
}

/* =========================================================
   TIMETABLE
   ========================================================= */

const CLASS_TIMETABLE = {
    1: [
        { id: "mon-sda-1", subject: "Stream Data Analytics", code: "22AI101022", short: "SDA", start: "08:00", end: "08:55" },
        { id: "mon-sda-2", subject: "Stream Data Analytics", code: "22AI101022", short: "SDA", start: "08:55", end: "09:50" }
    ],
    2: [
        { id: "tue-ds", subject: "Data Science", code: "22DS102006", short: "DS", start: "08:00", end: "08:55" },
        { id: "tue-gai", subject: "Generative AI", code: "22AI101021", short: "GAI", start: "08:55", end: "09:50" }
    ],
    3: [
        { id: "wed-ds", subject: "Data Science", code: "22DS102006", short: "DS", start: "08:00", end: "08:55" },
        { id: "wed-sda", subject: "Stream Data Analytics", code: "22AI101022", short: "SDA", start: "08:55", end: "09:50" }
    ],
    4: [
        { id: "thu-gai", subject: "Generative AI", code: "22AI101021", short: "GAI", start: "08:00", end: "08:55" },
        { id: "thu-dslab", subject: "Data Science Lab", code: "22DS102006", short: "DS LAB", start: "08:55", end: "10:45" }
    ],
    5: [
        { id: "fri-gai", subject: "Generative AI", code: "22AI101021", short: "GAI", start: "08:00", end: "08:55" },
        { id: "fri-ds", subject: "Data Science", code: "22DS102006", short: "DS", start: "08:55", end: "09:50" }
    ]
};

/* =========================================================
   TIME HELPERS
   ========================================================= */

function timeToMinutes(t) {
    const p = t.split(":");
    return Number(p[0]) * 60 + Number(p[1]);
}

function getCurrentMinutes() {
    const n = new Date();
    return n.getHours() * 60 + n.getMinutes();
}

function formatTime(t) {
    const p = t.split(":");
    let h = Number(p[0]);
    const m = Number(p[1]);
    const period = h >= 12 ? "PM" : "AM";
    h = h % 12 || 12;
    return h + ":" + String(m).padStart(2, "0") + " " + period;
}

function getTodayKey() {
    const n = new Date();
    return n.getFullYear() + "-" +
        String(n.getMonth() + 1).padStart(2, "0") + "-" +
        String(n.getDate()).padStart(2, "0");
}

function getTodaySchedule() {
    return CLASS_TIMETABLE[new Date().getDay()] || [];
}

/* =========================================================
   SLOT-WISE ATTENDANCE
   ========================================================= */

function mapAttendance(a) {
    return {
        id: a.id,
        subject: a.subject,
        present: a.classesPresent || 0,
        total: a.totalClasses || 0,
        classDate: a.classDate,
        timeSlot: a.timeSlot,
        status: a.status || "pending"
    };
}

function findSlotRecord(classItem) {
    const date = getTodayKey();
    const slot = classItem.start + "-" + classItem.end;
    const key = subjectKey(classItem.subject);

    return appData.attendance.find(a =>
        subjectKey(a.subject) === key &&
        a.classDate === date &&
        a.timeSlot === slot
    );
}

async function ensureSlotRecord(classItem) {
    let rec = findSlotRecord(classItem);
    if (rec) return rec;

    const date = getTodayKey();
    const slot = classItem.start + "-" + classItem.end;

    try {
        const existing = await apiFetch(
            `/attendance/slot?userId=${currentUserId}` +
            `&subject=${encodeURIComponent(classItem.subject)}` +
            `&classDate=${date}` +
            `&timeSlot=${encodeURIComponent(slot)}`
        );
        if (existing) {
            rec = mapAttendance(existing);
            appData.attendance.push(rec);
            return rec;
        }
    } catch (_) {}

    try {
        const saved = await apiFetch(`/attendance`, {
            method: "POST",
            body: JSON.stringify({
                userId: currentUserId,
                subject: classItem.subject,
                classesPresent: 0,
                totalClasses: 0,
                classDate: date,
                timeSlot: slot,
                status: "pending"
            })
        });
        rec = mapAttendance(saved);
        appData.attendance.push(rec);
        return rec;
    } catch (err) {
        console.error("ensureSlotRecord failed:", err);
        return null;
    }
}

async function updateSlotRecord(rec) {
    try {
        await apiFetch(`/attendance/${rec.id}`, {
            method: "PUT",
            body: JSON.stringify({
                userId: currentUserId,
                subject: rec.subject,
                classesPresent: rec.present,
                totalClasses: rec.total,
                classDate: rec.classDate,
                timeSlot: rec.timeSlot,
                status: rec.status
            })
        });
    } catch (err) {
        console.error("updateSlotRecord failed:", err);
    }
}

async function processCompletedClasses() {
    const schedule = getTodaySchedule();
    const now = getCurrentMinutes();

    for (const item of schedule) {
        const end = timeToMinutes(item.end);
        if (now < end) continue;
        if (findSlotRecord(item)) continue;
        await ensureSlotRecord(item);
    }
}

async function markClassAttendance(classId, status) {
    const schedule = getTodaySchedule();
    const item = schedule.find(c => c.id === classId);
    if (!item) return;

    const rec = await ensureSlotRecord(item);
    if (!rec) return;

    if (rec.status === "present" || rec.status === "absent") return;
    if (rec.total === 0) rec.total = 1;

    if (status === "present") {
        rec.present += 1;
        rec.status = "present";
        toast("Marked present: " + item.subject);
    } else {
        rec.status = "absent";
        toast("Marked absent: " + item.subject, "error");
    }

    await updateSlotRecord(rec);
    renderTodayTimetable();
    renderTodayClassRecords();
    renderAttendance();
    renderDashboard();
}

/* =========================================================
   RENDER: TODAY'S TIMETABLE
   ========================================================= */

function renderTodayTimetable() {
    const container = document.getElementById("todayTimetable");
    if (!container) return;

    const dateEl = document.getElementById("timetableDate");
    if (dateEl) {
        dateEl.textContent = new Date().toLocaleDateString("en-IN", {
            day: "2-digit", month: "short", year: "numeric"
        });
    }

    const schedule = getTodaySchedule();
    if (schedule.length === 0) {
        container.innerHTML = `<div class="empty-state">No classes scheduled today.</div>`;
        return;
    }

    const now = getCurrentMinutes();

    container.innerHTML = schedule.map(item => {
        const start = timeToMinutes(item.start);
        const end = timeToMinutes(item.end);
        const isCurrent = now >= start && now < end;
        const rec = findSlotRecord(item);

        let actionHTML = "";

        if (rec && rec.status === "present") {
            actionHTML = `<span class="completed-badge">✓ Present</span>`;
        } else if (rec && rec.status === "absent") {
            actionHTML = `<span class="completed-badge">✕ Absent</span>`;
        } else if (now >= end) {
            actionHTML = `
                <div class="attendance-action">
                    <button type="button" class="present-btn"
                        data-class-id="${item.id}"
                        data-attendance-status="present">✓ Present</button>
                    <button type="button" class="absent-btn"
                        data-class-id="${item.id}"
                        data-attendance-status="absent">✕ Absent</button>
                </div>`;
        } else if (now < start) {
            actionHTML = `<span class="completed-badge">Upcoming</span>`;
        } else {
            actionHTML = `<span class="pending-badge">Class in progress</span>`;
        }

        return `
            <div class="timetable-row ${isCurrent ? "current" : ""}">
                <div class="timetable-time">
                    ${formatTime(item.start)}<br>${formatTime(item.end)}
                </div>
                <div class="timetable-subject">
                    <strong>${escapeHTML(item.subject)}</strong>
                    <small>${escapeHTML(item.code)} · ${escapeHTML(item.short)}</small>
                </div>
                <div>${actionHTML}</div>
            </div>`;
    }).join("");
}

/* =========================================================
   RENDER: TODAY'S CLASS RECORDS
   ========================================================= */

function renderTodayClassRecords() {
    const container = document.getElementById("todayClassRecords");
    if (!container) return;

    const date = getTodayKey();
    const todayRecords = appData.attendance.filter(a => a.classDate === date);

    if (todayRecords.length === 0) {
        container.innerHTML = `<div class="empty-state">No records for today yet.</div>`;
        return;
    }

    container.innerHTML = todayRecords.map(rec => {
        const pct = rec.total > 0 ? (rec.present / rec.total) * 100 : 0;

        let statusLabel = rec.status;
        let statusClass = "completed-badge";
        if (rec.status === "present") { statusLabel = "✓ Present"; }
        else if (rec.status === "absent") { statusLabel = "✕ Absent"; statusClass = "pending-badge"; }
        else { statusLabel = "Pending"; statusClass = "pending-badge"; }

        return `
            <div class="timetable-row">
                <div class="timetable-time">${escapeHTML(rec.timeSlot || "-")}</div>
                <div class="timetable-subject">
                    <strong>${escapeHTML(rec.subject)}</strong>
                    <small>${pct.toFixed(0)}% attendance · ${rec.present}/${rec.total}</small>
                </div>
                <div style="display:flex;gap:6px;align-items:center;">
                    <span class="${statusClass}">${statusLabel}</span>
                    <button type="button" class="delete-btn"
                        onclick="deleteAttendance(${rec.id})">Delete</button>
                </div>
            </div>`;
    }).join("");
}

async function deleteAttendance(id) {
    if (!confirm("Delete this attendance record?")) return;
    try {
        await apiFetch(`/attendance/${id}`, { method: "DELETE" });
        appData.attendance = appData.attendance.filter(a => a.id !== id);
        renderAttendance();
        renderTodayTimetable();
        renderTodayClassRecords();
        renderDashboard();
        toast("Attendance deleted.");
    } catch (err) {
        toast("Failed to delete: " + err.message, "error");
    }
}

/* =========================================================
   RENDER: ATTENDANCE CARDS
   ========================================================= */

function renderAttendance() {
    const container = document.getElementById("attendanceCards");
    if (!container) return;

    const bySubject = {};

    appData.attendance.forEach(a => {
        if (a.total === 0 && a.status !== "present" && a.status !== "absent") return;

        const key = subjectKey(a.subject);

        if (!bySubject[key]) {
            bySubject[key] = { subject: a.subject, present: 0, total: 0 };
        }
        const s = bySubject[key];

        if (a.status === "present") {
            s.present += 1;
            s.total += 1;
        } else if (a.status === "absent") {
            s.total += 1;
        } else {
            s.present += a.present;
            s.total += a.total;
        }
    });

    const list = Object.values(bySubject);

    if (list.length === 0) {
        container.innerHTML = `<div class="empty-state">No attendance data available.</div>`;
        return;
    }

    container.innerHTML = list.map(item => {
        const pct = item.total > 0 ? (item.present / item.total) * 100 : 0;
        const skips = canSkip(item.present, item.total, 75);
        const skipText = skips > 0
            ? `· You can skip ${skips} more class${skips === 1 ? "" : "es"}`
            : `· Below 75% — attend all classes`;

        return `
            <div class="attendance-card">
                <h3>${escapeHTML(item.subject)}</h3>
                <div class="attendance-percentage">${pct.toFixed(1)}%</div>
                <p>Present: ${item.present} / Total: ${item.total}</p>
                <div class="progress-bar">
                    <div class="progress-fill"
                         style="width:${Math.min(100, pct)}%;"></div>
                </div>
                <p style="font-size:11px;color:#7b8191;margin-top:10px;">${skipText}</p>
            </div>`;
    }).join("");
}

/* =========================================================
   STUDY PLANNER
   ========================================================= */

function openStudyPlanForm() { openModal("studyPlanModal"); }

function renderStudyPlans() {
    const table = document.getElementById("studyPlanTable");
    if (!table) return;

    if (appData.studyPlans.length === 0) {
        table.innerHTML = `<tr><td colspan="6">No study plans available.</td></tr>`;
        return;
    }

    table.innerHTML = appData.studyPlans.map(p => `
        <tr>
            <td>${escapeHTML(p.day)}</td>
            <td>${escapeHTML(p.subject)}</td>
            <td>${escapeHTML(p.time)}</td>
            <td>${escapeHTML(p.topic)}</td>
            <td>${escapeHTML(p.priority)}</td>
            <td><button type="button" class="delete-btn"
                onclick="deleteStudyPlan(${p.id})">Delete</button></td>
        </tr>
    `).join("");
}

async function deleteStudyPlan(id) {
    if (!confirm("Delete this study plan?")) return;
    try {
        await apiFetch(`/study-plans/${id}`, { method: "DELETE" });
        appData.studyPlans = appData.studyPlans.filter(p => p.id !== id);
        refreshAll();
        toast("Study plan deleted.");
    } catch (err) {
        toast("Failed to delete: " + err.message, "error");
    }
}

/* =========================================================
   GOALS
   ========================================================= */

function openGoalForm() { openModal("goalModal"); }

function renderGoals() {
    const container = document.getElementById("goalsContainer");
    if (!container) return;

    if (appData.goals.length === 0) {
        container.innerHTML = `<div class="empty-state">No goals available.</div>`;
        return;
    }

    container.innerHTML = appData.goals.map(g => `
        <div class="goal-card">
            <h3>${escapeHTML(g.title)}</h3>
            <p>${escapeHTML(g.description)}</p>
            <div class="goal-meta">Deadline: ${escapeHTML(g.deadline)}</div>
            <button type="button" class="delete-btn"
                onclick="deleteGoal(${g.id})">Delete</button>
        </div>
    `).join("");
}

async function deleteGoal(id) {
    if (!confirm("Delete this goal?")) return;
    try {
        await apiFetch(`/goals/${id}`, { method: "DELETE" });
        appData.goals = appData.goals.filter(g => g.id !== id);
        refreshAll();
        toast("Goal deleted.");
    } catch (err) {
        toast("Failed to delete: " + err.message, "error");
    }
}

/* =========================================================
   DASHBOARD SECTIONS
   ========================================================= */

function renderSubjectDashboard() {
    const table = document.getElementById("dashboardSubjectTable");
    if (!table) return;

    if (appData.subjects.length === 0) {
        table.innerHTML = `<tr><td colspan="5">No subject data available</td></tr>`;
        return;
    }

    table.innerHTML = appData.subjects.slice(-5).reverse().map(s => `
        <tr>
            <td>${escapeHTML(s.name)}</td>
            <td>${escapeHTML(s.code || "-")}</td>
            <td>${s.credits}</td>
            <td>${escapeHTML(s.grade)}</td>
            <td>${Number(s.gradePoint).toFixed(2)}</td>
        </tr>
    `).join("");
}

function renderDashboardAttendance() {
    const container = document.getElementById("dashboardAttendance");
    if (!container) return;

    const bySubject = {};

    appData.attendance.forEach(a => {
        if (a.total === 0 && a.status !== "present" && a.status !== "absent") return;

        const key = subjectKey(a.subject);

        if (!bySubject[key]) {
            bySubject[key] = { subject: a.subject, present: 0, total: 0 };
        }
        const s = bySubject[key];

        if (a.status === "present") {
            s.present += 1;
            s.total += 1;
        } else if (a.status === "absent") {
            s.total += 1;
        } else {
            s.present += a.present;
            s.total += a.total;
        }
    });

    const list = Object.values(bySubject).slice(-4).reverse();

    if (list.length === 0) {
        container.innerHTML = `<div class="empty-state">No attendance data available.</div>`;
        return;
    }

    container.innerHTML = list.map(item => {
        const pct = item.total > 0 ? (item.present / item.total) * 100 : 0;
        return `
            <div style="margin-bottom:14px;">
                <div style="display:flex;justify-content:space-between;font-size:12px;">
                    <strong>${escapeHTML(item.subject)}</strong>
                    <span>${pct.toFixed(1)}%</span>
                </div>
                <div class="progress-bar">
                    <div class="progress-fill" style="width:${Math.min(100, pct)}%;"></div>
                </div>
            </div>`;
    }).join("");
}

function renderDashboardStudyPlan() {
    const container = document.getElementById("dashboardStudyPlan");
    if (!container) return;

    if (appData.studyPlans.length === 0) {
        container.innerHTML = `<div class="empty-state">No study plan available.</div>`;
        return;
    }

    container.innerHTML = appData.studyPlans.slice(0, 3).map(p => `
        <div style="padding:10px 0;border-bottom:1px solid #eef0f4;">
            <strong>${escapeHTML(p.subject)}</strong>
            <span style="float:right;font-size:10px;color:#7b8191;">${escapeHTML(p.time)}</span>
            <p style="font-size:11px;color:#7b8191;margin-top:4px;">${escapeHTML(p.topic)}</p>
        </div>
    `).join("");
}

function renderDashboardGoals() {
    const container = document.getElementById("dashboardGoals");
    if (!container) return;

    if (appData.goals.length === 0) {
        container.innerHTML = `<div class="empty-state">No goals available.</div>`;
        return;
    }

    container.innerHTML = appData.goals.slice(0, 3).map(g => `
        <div class="goal-card">
            <h3>${escapeHTML(g.title)}</h3>
            <p>${escapeHTML(g.description)}</p>
            <div class="goal-meta">Deadline: ${escapeHTML(g.deadline)}</div>
        </div>
    `).join("");
}

/* =========================================================
   CHARTS
   ========================================================= */

function renderSGPAChart() {
    const canvas = document.getElementById("sgpaChart");
    if (!canvas || typeof Chart === "undefined") return;

    const semesters = [...appData.semesters].sort((a, b) => Number(a.number) - Number(b.number));

    if (sgpaChart) { sgpaChart.destroy(); sgpaChart = null; }

    sgpaChart = new Chart(canvas, {
        type: "line",
        data: {
            labels: semesters.length ? semesters.map(s => "Sem " + s.number) : ["No Data"],
            datasets: [{
                label: "SGPA",
                data: semesters.length ? semesters.map(s => Number(s.sgpa)) : [0],
                borderColor: "#6c5ce7",
                borderWidth: 3,
                tension: 0.4,
                fill: true,
                backgroundColor: (ctx) => {
                    const chart = ctx.chart;
                    const { ctx: c, chartArea } = chart;
                    if (!chartArea) return "rgba(108,92,231,0.1)";
                    const gradient = c.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
                    gradient.addColorStop(0, "rgba(108,92,231,0.3)");
                    gradient.addColorStop(1, "rgba(108,92,231,0)");
                    return gradient;
                },
                pointRadius: 5,
                pointBackgroundColor: "#6c5ce7",
                pointBorderColor: "#fff",
                pointBorderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: { y: { min: 0, max: 10 } },
            plugins: { legend: { display: false } }
        }
    });
}

function renderAnalysisChart() {
    const canvas = document.getElementById("analysisChart");
    if (!canvas || typeof Chart === "undefined") return;

    const semesters = [...appData.semesters].sort((a, b) => Number(a.number) - Number(b.number));

    if (analysisChart) { analysisChart.destroy(); analysisChart = null; }

    analysisChart = new Chart(canvas, {
        type: "bar",
        data: {
            labels: semesters.length ? semesters.map(s => "Semester " + s.number) : ["No Data"],
            datasets: [{
                label: "SGPA",
                data: semesters.length ? semesters.map(s => Number(s.sgpa)) : [0],
                backgroundColor: "rgba(108,92,231,0.75)",
                borderRadius: 6,
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: { y: { min: 0, max: 10 } }
        }
    });
}

function updateAnalysis() {
    setText("analysisCGPA", calculateCGPA().toFixed(2));
    setText("analysisSGPA", calculateAverageSGPA().toFixed(2));
    setText("analysisAttendance", Math.round(calculateAttendance()));
}

/* =========================================================
   MODALS
   ========================================================= */

function openModal(id) {
    const m = document.getElementById(id);
    if (m) m.classList.add("show");
}

function closeModal(id) {
    const m = document.getElementById(id);
    if (m) m.classList.remove("show");
}

function openAttendanceForm() { openModal("attendanceModal"); }

/* =========================================================
   LOGOUT
   ========================================================= */

function logoutUser() {
    if (!confirm("Are you sure you want to logout?")) return;
    localStorage.removeItem("loggedInUser");
    window.location.href = "login.html";
}

/* =========================================================
   REFRESH
   ========================================================= */

function refreshAll() {
    renderDashboard();
    renderSemesters();
    renderSubjects();
    renderAttendance();
    renderTodayClassRecords();
    renderStudyPlans();
    renderGoals();
    updateAnalysis();
    loadProfile();
    renderTodayTimetable();
}

/* =========================================================
   FORM HANDLERS
   ========================================================= */

function setupForms() {

    const semesterForm = document.getElementById("semesterForm");
    if (semesterForm) {
        semesterForm.addEventListener("submit", async function (e) {
            e.preventDefault();

            const number = Number(document.getElementById("semesterNumber").value);
            const sgpa = Number(document.getElementById("semesterSGPA").value);
            const credits = Number(document.getElementById("semesterCredits").value);

            if (sgpa < 0 || sgpa > 10) { toast("SGPA must be between 0 and 10.", "error"); return; }

            try {
                const existing = appData.semesters.find(s => Number(s.number) === number);

                if (existing) {
                    const updated = await apiFetch(`/semesters/${existing.id}`, {
                        method: "PUT",
                        body: JSON.stringify({ userId: currentUserId, semesterNumber: number, sgpa, credits })
                    });
                    existing.sgpa = updated.sgpa;
                    existing.credits = updated.credits;
                } else {
                    const saved = await apiFetch(`/semesters`, {
                        method: "POST",
                        body: JSON.stringify({ userId: currentUserId, semesterNumber: number, sgpa, credits })
                    });
                    appData.semesters.push({
                        id: saved.id,
                        number: saved.semesterNumber,
                        sgpa: saved.sgpa,
                        credits: saved.credits
                    });
                }

                semesterForm.reset();
                closeModal("semesterModal");
                refreshAll();
                showPage("semesterPage");
                toast("Semester saved.");
            } catch (err) {
                toast("Failed to save semester: " + err.message, "error");
            }
        });
    }

    const subjectForm = document.getElementById("subjectForm");
    if (subjectForm) {
        subjectForm.addEventListener("submit", async function (e) {
            e.preventDefault();

            const semester = Number(document.getElementById("subjectSemester").value);
            const name = document.getElementById("subjectName").value.trim();
            const gradePoint = Number(document.getElementById("subjectGrade").value);
            const credits = Number(document.getElementById("subjectCredits").value);
            const category = document.getElementById("subjectCategory").value;

            if (gradePoint < 0 || gradePoint > 10) {
                toast("Grade must be between 0 and 10.", "error");
                return;
            }

            const grade = gradeFromPoint(gradePoint);

            try {
                const saved = await apiFetch(`/subjects`, {
                    method: "POST",
                    body: JSON.stringify({
                        userId: currentUserId,
                        semester,
                        name,
                        code: "-",
                        grade,
                        gradePoint,
                        credits,
                        category
                    })
                });

                appData.subjects.push({
                    id: saved.id,
                    semester: saved.semester,
                    name: saved.name,
                    code: saved.code,
                    grade: saved.grade,
                    gradePoint: saved.gradePoint,
                    credits: saved.credits,
                    category: saved.category
                });

                subjectForm.reset();
                closeModal("subjectModal");
                refreshAll();
                showPage("subjectPage");
                toast("Subject saved.");
            } catch (err) {
                toast("Failed to save subject: " + err.message, "error");
            }
        });
    }

    const attendanceForm = document.getElementById("attendanceForm");
    if (attendanceForm) {
        attendanceForm.addEventListener("submit", async function (e) {
            e.preventDefault();

            const subject = document.getElementById("attendanceSubject").value.trim();
            const present = Number(document.getElementById("classesPresent").value);
            const total = Number(document.getElementById("totalClasses").value);

            if (present > total) {
                toast("Present classes cannot be greater than total classes.", "error");
                return;
            }

            try {
                const existing = appData.attendance.find(a =>
                    a.subject === subject && a.timeSlot === "manual"
                );

                if (existing) {
                    const updated = await apiFetch(`/attendance/${existing.id}`, {
                        method: "PUT",
                        body: JSON.stringify({
                            userId: currentUserId,
                            subject,
                            classesPresent: present,
                            totalClasses: total,
                            classDate: existing.classDate || getTodayKey(),
                            timeSlot: existing.timeSlot || "manual",
                            status: existing.status || "manual"
                        })
                    });
                    existing.present = updated.classesPresent;
                    existing.total = updated.totalClasses;
                } else {
                    const saved = await apiFetch(`/attendance`, {
                        method: "POST",
                        body: JSON.stringify({
                            userId: currentUserId,
                            subject,
                            classesPresent: present,
                            totalClasses: total,
                            classDate: getTodayKey(),
                            timeSlot: "manual",
                            status: "manual"
                        })
                    });
                    appData.attendance.push({
                        id: saved.id,
                        subject: saved.subject,
                        present: saved.classesPresent,
                        total: saved.totalClasses,
                        classDate: saved.classDate,
                        timeSlot: saved.timeSlot,
                        status: saved.status
                    });
                }

                attendanceForm.reset();
                closeModal("attendanceModal");
                refreshAll();
                showPage("attendancePage");
                toast("Attendance saved.");
            } catch (err) {
                toast("Failed to save attendance: " + err.message, "error");
            }
        });
    }

    const studyPlanForm = document.getElementById("studyPlanForm");
    if (studyPlanForm) {
        studyPlanForm.addEventListener("submit", async function (e) {
            e.preventDefault();

            const day = document.getElementById("planDay").value;
            const subject = document.getElementById("planSubject").value.trim();
            const timeSlot = document.getElementById("planTimeSlot").value.trim();
            const topic = document.getElementById("planTopic").value.trim();
            const priority = document.getElementById("planPriority").value;

            try {
                const saved = await apiFetch(`/study-plans`, {
                    method: "POST",
                    body: JSON.stringify({
                        userId: currentUserId,
                        day,
                        subject,
                        timeSlot,
                        topic,
                        priority
                    })
                });

                appData.studyPlans.push({
                    id: saved.id,
                    day: saved.day,
                    subject: saved.subject,
                    time: saved.timeSlot,
                    topic: saved.topic,
                    priority: saved.priority
                });

                studyPlanForm.reset();
                closeModal("studyPlanModal");
                refreshAll();
                showPage("plannerPage");
                toast("Study plan saved.");
            } catch (err) {
                toast("Failed to save study plan: " + err.message, "error");
            }
        });
    }

    const goalForm = document.getElementById("goalForm");
    if (goalForm) {
        goalForm.addEventListener("submit", async function (e) {
            e.preventDefault();

            const title = document.getElementById("goalTitle").value.trim();
            const description = document.getElementById("goalDescription").value.trim();
            const deadline = document.getElementById("goalDeadline").value;
            const priority = document.getElementById("goalPriority").value;

            try {
                const saved = await apiFetch(`/goals`, {
                    method: "POST",
                    body: JSON.stringify({
                        userId: currentUserId,
                        title,
                        description,
                        deadline,
                        priority
                    })
                });

                appData.goals.push({
                    id: saved.id,
                    title: saved.title,
                    description: saved.description,
                    deadline: saved.deadline,
                    priority: saved.priority
                });

                goalForm.reset();
                closeModal("goalModal");
                refreshAll();
                showPage("goalPage");
                toast("Goal saved.");
            } catch (err) {
                toast("Failed to save goal: " + err.message, "error");
            }
        });
    }
}

/* =========================================================
   ATTENDANCE BUTTONS
   ========================================================= */

function setupAttendanceButtons() {
    document.addEventListener("click", function (event) {
        const btn = event.target.closest("[data-attendance-status]");
        if (!btn) return;
        markClassAttendance(btn.dataset.classId, btn.dataset.attendanceStatus);
    });
}

/* =========================================================
   INIT
   ========================================================= */

document.addEventListener("DOMContentLoaded", async function () {
    console.log("CGPA Booster JS loaded");

    // Restore theme
    if (localStorage.getItem("theme") === "dark") {
        document.body.classList.add("dark-mode");
    }

    const ok = await loadLoggedInUser();
    if (!ok) return;

    try {
        await loadAllFromBackend();
    } catch (err) {
        console.error("loadAllFromBackend:", err);
    }

    loadProfile();
    await processCompletedClasses();

    setupForms();
    setupAttendanceButtons();

    refreshAll();
    showPage("dashboardPage");

    setInterval(async function () {
        await processCompletedClasses();
        renderTodayTimetable();
        renderTodayClassRecords();
        renderAttendance();
        renderDashboard();
    }, 30000);
});