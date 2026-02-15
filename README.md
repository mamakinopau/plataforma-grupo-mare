# Plataforma Grupo Mare LMS

A comprehensive Learning Management System (LMS) for Grupo Mare, featuring multi-tenancy, gamification, and role-based dashboards.

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm (v9 or higher)

### Installation

1.  **Install dependencies:**
    ```bash
    npm install
    ```

2.  **Run the development server:**
    ```bash
    npm run dev
    ```

3.  **Open the application:**
    Open your browser and navigate to `http://localhost:5173` (or the URL shown in your terminal).

## 🔑 Test Credentials

| Role | Email | Description |
|------|-------|-------------|
| **Super Admin** | `super@admin.com` | Manages tenants (B2B clients) and global settings. |
| **Admin** | `admin@grupomare.com` | Manages users and courses for a specific company. |
| **Manager** | `manager.lisbon@grupomare.com` | Views team reports and assigns training. |
| **Employee** | `john@grupomare.com` | Takes courses, quizzes, and earns certificates. |

## 🛠️ Features

- **Multi-tenancy:** White-label support for multiple companies.
- **Gamification:** Points, badges, levels, and leaderboards.
- **Course Builder:** Admin tool for creating rich content courses.
- **Certificates:** Auto-generated certificates upon course completion.
- **Role-based Dashboards:** Tailored views for Admins, Managers, and Employees.
