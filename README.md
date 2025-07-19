# Trustpilot Playwright API

This server handles Trustpilot automation (login and review submission) using Playwright.

## Deployment (Railway or Docker)

- Make sure to allow ports & persistent storage if needed.
- This uses the official Playwright image.

### Endpoints

- `POST /trigger-login` - Send login request with email
- `POST /submit-otp` - Submit received OTP for login
- `POST /post-review` - Submit a review