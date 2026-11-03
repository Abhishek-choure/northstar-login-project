# Northstar Login — Front-end demo

A polished, responsive login interface built with **HTML, CSS and vanilla JavaScript**.

## Features

- Responsive two-panel sign-in design with mobile layout
- Email validation using a regular expression
- Password minimum-length validation and live strength meter
- Show/hide password control with accessible labels
- Inline validation feedback and form-level error messages
- “Keep me signed in” using `localStorage`; regular session uses `sessionStorage`
- Demo dashboard state after successful validation
- Returning session restoration and sign out
- Dialog placeholders for password reset, sign-up, help and legal links
- Accessible labels, focus states, reduced-motion support and semantic form markup

## Run locally

1. Extract the ZIP.
2. Open `index.html` in a modern browser, or serve the folder with a local development server.
3. Enter a valid email (for example `hello@example.com`) and a password of at least 8 characters.
4. Tick **Keep me signed in** to persist the demo session across browser restarts; otherwise the session is tab/session scoped.

No package installation is required.

## Important security note

This is a **front-end authentication interface demo**, not a secure authentication system. The browser accepts any valid email and any password of 8+ characters; it does not verify user identity. Client-side validation is for usability and can be bypassed.

For production, connect a backend authentication provider or API. Verify credentials server-side, hash passwords with a modern password-hashing algorithm (such as Argon2id or bcrypt), use HTTPS, apply rate limiting, and prefer secure `HttpOnly`, `Secure`, `SameSite` cookies for sessions. Never store passwords or session secrets in `localStorage` or `sessionStorage`. Implement CSRF protection where applicable, account recovery, email verification, and server-side authorization for protected routes.

## Project structure

```text
pro-login-project/
├── index.html
├── styles.css
├── app.js
└── README.md
```
