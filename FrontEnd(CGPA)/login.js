const API_URL = "http://localhost:8080/api/users";

/* =========================
   SHOW SIGNUP
========================= */
function showSignup() {
    document.getElementById("loginSection").classList.add("hidden");
    document.getElementById("signupSection").classList.remove("hidden");
}

/* =========================
   SHOW LOGIN
========================= */
function showLogin() {
    document.getElementById("signupSection").classList.add("hidden");
    document.getElementById("loginSection").classList.remove("hidden");
}

/* =========================
   SHOW / HIDE PASSWORD
========================= */
function togglePassword(inputId, button) {
    const input = document.getElementById(inputId);
    const icon = button.querySelector("i");

    if (input.type === "password") {
        input.type = "text";
        icon.classList.remove("fa-eye");
        icon.classList.add("fa-eye-slash");
    } else {
        input.type = "password";
        icon.classList.remove("fa-eye-slash");
        icon.classList.add("fa-eye");
    }
}

/* =========================
   LOGIN
========================= */
document.getElementById("loginForm").addEventListener("submit", async function (event) {
    event.preventDefault();

    const btn = this.querySelector("button[type='submit']");
    if (btn.disabled) return;
    btn.disabled = true;

    try {
        const email = document.getElementById("loginEmail").value.trim();
        const password = document.getElementById("loginPassword").value;

        if (!email || !password) {
            alert("Please enter email and password.");
            return;
        }

        const response = await fetch(`${API_URL}/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (!response.ok) {
            alert(data.message || "Invalid email or password.");
            return;
        }

        localStorage.setItem("loggedInUser", JSON.stringify(data));
        window.location.href = "index.html";

    } catch (error) {
        console.error("Login error:", error);
        alert("Cannot connect to the server. Make sure Spring Boot is running.");
    } finally {
        btn.disabled = false;
    }
});

/* =========================
   REGISTER
========================= */
document.getElementById("signupForm").addEventListener("submit", async function (event) {
    event.preventDefault();

    const btn = this.querySelector("button[type='submit']");
    if (btn.disabled) return;
    btn.disabled = true;

    try {
        const name = document.getElementById("signupName").value.trim();
        const rollNumber = document.getElementById("signupRoll").value.trim();
        const branch = document.getElementById("signupBranch").value.trim();
        const email = document.getElementById("signupEmail").value.trim();
        const password = document.getElementById("signupPassword").value;
        const confirmPassword = document.getElementById("confirmPassword").value;

        if (password !== confirmPassword) {
            alert("Passwords do not match.");
            return;
        }

        const response = await fetch(`${API_URL}/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, email, password, rollNumber, branch })
        });

        const data = await response.json();

        if (!response.ok) {
            alert(data.message || "Registration failed.");
            return;
        }

        alert("Account created successfully!");
        document.getElementById("signupForm").reset();
        showLogin();

    } catch (error) {
        console.error("Register error:", error);
        alert("Unable to connect to the server. Make sure Spring Boot is running.");
    } finally {
        btn.disabled = false;
    }
});