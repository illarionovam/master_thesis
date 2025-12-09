# Narrive

A web solution that incorporates integrated AI elements, organized world modeling, and a visual depiction of the relationship graph.

## Live deployments

-   **Backend (API + Swagger UI)**  
    `https://master-thesis-backend.vercel.app/`

-   **Frontend (React SPA)**  
    `https://master-thesis-frontend-eight.vercel.app/`

-   **Database**  
    PostgreSQL hosted on **Render** (connection details are provided via environment variables, see `.env.example`).

## Tech stack

-   **Runtime:** Node.js (Express)
-   **Database:** PostgreSQL (+ extensions: `pgcrypto`, `citext`, JSONB, triggers)
-   **ORM / DB layer:** Sequelize
-   **Auth:** JWT Bearer tokens, scoped tokens for `email_verify` and `password_reset`
-   **Rate limiting:** `express-rate-limit`, `express-slow-down`
-   **Validation:** Joi (`validators/*`)
-   **File uploads:** `multer` → `/tmp` → Cloudinary (via `utilities/cloudinary.js`)
-   **API docs:** Swagger (OpenAPI 3, via `swagger-jsdoc` + `swagger-ui-express`)
-   **Tests:** jest (`tests/*`)

## Build DB

You can find the full schema script in [DATABASE_SETUP.txt](./DATABASE_SETUP.txt).
