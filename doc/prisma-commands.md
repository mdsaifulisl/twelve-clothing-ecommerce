# Prisma Essential Commands Cheatsheet

Here is a quick reference guide for all essential Prisma CLI commands used in Node.js and TypeScript projects.

---

## 1. Setup & Initialization
*   **Initialize Prisma in a new project:**
    ```bash
    npx prisma init
    ```
    *(Creates the `prisma/schema.prisma` file and a `.env` file).*

---

## 2. Database Migrations (Development)
*   **Create and apply migrations during development:**
    ```bash
    npx prisma migrate dev --name <migration_name>
    ```
    *(Example: `npx prisma migrate dev --name init`)*

*   **Apply pending migrations to production/staging database:**
    ```bash
    npx prisma migrate deploy
    ```

*   **Reset the database (Drops all data and re-runs all migrations):**
    ```bash
    npx prisma migrate reset
    ```

*   **Check the status of database migrations:**
    ```bash
    npx prisma migrate status
    ```

---

## 3. Prisma Client Generation
*   **Generate Prisma Client (Run this after changing `schema.prisma`):**
    ```bash
    npx prisma generate
    ```

---

## 4. Database Inspection & Management
*   **Open Prisma Studio (A visual GUI in your browser to view/edit database records):**
    ```bash
    npx prisma studio
    ```

*   **Pull schema from an existing database (Introspection):**
    ```bash
    npx prisma db pull
    ```

*   **Push schema changes directly to the database without migration history (Good for prototyping):**
    ```bash
    npx prisma db push
    ```

---

## 5. Troubleshooting & Maintenance
*   **Format your `schema.prisma` file:**
    ```bash
    npx prisma format
    ```

*   **Validate your schema syntax:**
    ```bash
    npx prisma validate
    ```