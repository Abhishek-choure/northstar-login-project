(() => {
  "use strict";

  const form = document.querySelector("#loginForm");
  const emailInput = document.querySelector("#email");
  const passwordInput = document.querySelector("#password");
  const rememberMe = document.querySelector("#rememberMe");
  const togglePassword = document.querySelector("#togglePassword");
  const emailError = document.querySelector("#emailError");
  const passwordError = document.querySelector("#passwordError");
  const formAlert = document.querySelector("#formAlert");
  const submitButton = document.querySelector("#submitButton");
  const strengthArea = document.querySelector("#strengthArea");
  const strengthLabel = document.querySelector("#strengthLabel");
  const strengthBar = document.querySelector("#strengthBar");
  const strengthHint = document.querySelector("#strengthHint");
  const dialog = document.querySelector("#infoDialog");
  const dialogTitle = document.querySelector("#dialogTitle");
  const dialogMessage = document.querySelector("#dialogMessage");

  // Demo-only keys. Do not store credentials or use this as production authentication.
  const SESSION_KEY = "northstar_demo_session";
  const PERSIST_KEY = "northstar_demo_persist";
  const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[A-Za-z]{2,}$/;

  function showDialog(title, message) {
    dialogTitle.textContent = title;
    dialogMessage.textContent = message;
    if (typeof dialog.showModal === "function") dialog.showModal();
    else window.alert(`${title}\n\n${message}`);
  }

  function setError(input, target, message) {
    target.textContent = message;
    input.setAttribute("aria-invalid", message ? "true" : "false");
    input.classList.toggle("is-valid", !message && input.value.length > 0);
  }

  function validateEmail() {
    const email = emailInput.value.trim();
    let message = "";
    if (!email) message = "Please enter your email address.";
    else if (!EMAIL_PATTERN.test(email)) message = "Enter a valid email, such as name@company.com.";
    setError(emailInput, emailError, message);
    return !message;
  }

  function scorePassword(password) {
    let score = 0;
    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    return Math.min(score, 4);
  }

  function updateStrength() {
    const password = passwordInput.value;
    strengthArea.hidden = password.length === 0;
    if (!password) return;

    const score = scorePassword(password);
    const labels = ["Very weak", "Weak", "Fair", "Good", "Strong"];
    const widths = ["8%", "25%", "50%", "75%", "100%"];
    const colors = ["#d84c62", "#e58b50", "#e5b84f", "#65ad8b", "#1e9c78"];
    strengthLabel.textContent = labels[score];
    strengthLabel.style.color = colors[score];
    strengthBar.style.width = widths[score];
    strengthBar.style.background = colors[score];
    strengthHint.textContent = score >= 3
      ? "Good progress. A longer password is even better."
      : "Try 8+ characters with uppercase, lowercase, a number and a symbol.";
  }

  function validatePassword() {
    const password = passwordInput.value;
    let message = "";
    if (!password) message = "Please enter your password.";
    else if (password.length < 8) message = "Use at least 8 characters for this demo.";
    setError(passwordInput, passwordError, message);
    return !message;
  }

  function showAlert(message, type = "error") {
    formAlert.textContent = message;
    formAlert.classList.toggle("success", type === "success");
    formAlert.hidden = false;
  }

  function clearAlert() {
    formAlert.hidden = true;
    formAlert.textContent = "";
    formAlert.classList.remove("success");
  }

  function getStoredSession() {
    try {
      const raw = sessionStorage.getItem(SESSION_KEY) || localStorage.getItem(PERSIST_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }

  function saveSession(email, persistent) {
    const session = { email, authenticated: true, createdAt: Date.now() };
    // The demo stores only a non-secret email/session flag, never the password.
    try {
      if (persistent) {
        localStorage.setItem(PERSIST_KEY, JSON.stringify(session));
        sessionStorage.removeItem(SESSION_KEY);
      } else {
        sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
        localStorage.removeItem(PERSIST_KEY);
      }
    } catch {
      showAlert("Your browser blocked session storage. You can still continue in this demo.");
    }
  }

  function clearSession() {
    try {
      sessionStorage.removeItem(SESSION_KEY);
      localStorage.removeItem(PERSIST_KEY);
    } catch { /* Storage may be disabled by the browser. */ }
  }

  function renderDashboard(session) {
    const safeEmail = String(session.email || "teammate").replace(/[<>&"']/g, "");
    document.querySelector(".form-wrap").innerHTML = `
      <div class="success-screen">
        <div class="dialog-mark">✓</div>
        <p class="eyebrow">YOU'RE SIGNED IN</p>
        <h2>Welcome to your workspace.</h2>
        <p class="muted">You’re signed in as <strong></strong>. This is a local demo dashboard state.</p>
        <div class="dashboard-card">
          <div class="dashboard-card-icon">✦</div>
          <div><strong>Your workspace is ready</strong><p>Projects, updates and team activity will live here.</p></div>
        </div>
        <button type="button" class="submit-button" id="continueButton">Continue to dashboard <span class="button-arrow">→</span></button>
        <button type="button" class="create-account" id="signOutButton">Sign out</button>
        <p class="demo-note"><span class="info-icon">i</span> Demo authentication only. Connect a secure backend before using real accounts.</p>
      </div>`;
    const style = document.createElement("style");
    style.textContent = `.success-screen .dialog-mark{margin:0 0 25px;background:#e8f8f1;color:#1e9c78}.success-screen h2{margin-bottom:12px}.success-screen .muted{margin-bottom:25px;overflow-wrap:anywhere}.success-screen .muted strong{color:#44485d}.dashboard-card{display:flex;align-items:flex-start;gap:14px;padding:18px;margin-bottom:22px;border:1px solid #e8e8f2;border-radius:12px;background:#fbfaff}.dashboard-card-icon{display:grid;place-items:center;flex:0 0 36px;height:36px;border-radius:11px;background:#efecff;color:#6c5ce7;font-size:20px}.dashboard-card strong{font-size:12px}.dashboard-card p{margin:5px 0 0;color:#8a8ea2;font-size:11px;line-height:1.6}.success-screen .create-account{margin-top:10px}.success-screen .demo-note{margin-top:17px}`;
    document.head.appendChild(style);
    document.querySelector(".success-screen .muted strong").textContent = safeEmail;
    document.querySelector("#continueButton").addEventListener("click", () => {
      showDialog("Dashboard preview", "Authentication succeeded in this front-end demo. A real application would load protected data from your backend here.");
    });
    document.querySelector("#signOutButton").addEventListener("click", () => {
      clearSession();
      window.location.reload();
    });
  }

  togglePassword.addEventListener("click", () => {
    const showing = passwordInput.type === "text";
    passwordInput.type = showing ? "password" : "text";
    togglePassword.setAttribute("aria-label", showing ? "Show password" : "Hide password");
    togglePassword.setAttribute("aria-pressed", String(!showing));
    passwordInput.focus();
  });

  emailInput.addEventListener("input", () => { clearAlert(); if (emailInput.getAttribute("aria-invalid") === "true") validateEmail(); });
  emailInput.addEventListener("blur", validateEmail);
  passwordInput.addEventListener("input", () => {
    clearAlert();
    updateStrength();
    if (passwordInput.getAttribute("aria-invalid") === "true") validatePassword();
  });
  passwordInput.addEventListener("blur", validatePassword);

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    clearAlert();
    const emailValid = validateEmail();
    const passwordValid = validatePassword();
    if (!emailValid || !passwordValid) {
      showAlert("Please fix the highlighted fields and try again.");
      (!emailValid ? emailInput : passwordInput).focus();
      return;
    }

    submitButton.disabled = true;
    submitButton.querySelector(".button-label").textContent = "Signing in…";
    window.setTimeout(() => {
      saveSession(emailInput.value.trim(), rememberMe.checked);
      renderDashboard({ email: emailInput.value.trim(), authenticated: true });
    }, 350);
  });

  document.querySelector("#forgotButton").addEventListener("click", () => showDialog("Reset your password", "Password reset is a placeholder in this demo. In production, send a time-limited reset link from your authentication backend."));
  document.querySelector("#createAccountButton").addEventListener("click", () => showDialog("Create an account", "Sign-up is not connected in this demo. Add a registration screen and backend account-creation endpoint to enable it."));
  document.querySelector("#closeDialog").addEventListener("click", () => dialog.close());
  document.querySelectorAll(".local-link").forEach(link => link.addEventListener("click", event => {
    event.preventDefault();
    showDialog("Northstar information", "This link is a local placeholder. Replace it with your real help, terms or privacy page.");
  }));

  const existingSession = getStoredSession();
  if (existingSession && existingSession.authenticated && existingSession.email) {
    renderDashboard(existingSession);
  }
})();
