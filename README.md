## Donzeo

A full-stack task management application with user authentication, collections, labels, and advanced task features. Built with React (Vite) frontend and Node.js/Express backend using Prisma ORM and PostgreSQL.

---

## 🚀 Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/akinloluwami/donezo
cd donezo
```

### 2. Backend Setup

```bash
cd backend
npm install
cp .env.example .env # Edit .env with your Postgres credentials
npx prisma db push # Run migrations
npm run dev # Start backend (uses tsx watch)
```

### 3. Frontend Setup

```bash
cd ../frontend
npm install
npm run dev # Start frontend (Vite)
```

### 4. Environment Variables

- **Backend:** See `backend/.env.example` for required variables -`DATABASE_URL`, `JWT_SECRET`, `CLIENT_URL`.
- **Frontend:** See `frontend/.env.example` for required variable `VITE_API_URL` (for backend base URL).

---

## 🗄️ Database Schema Overview

This project uses **Prisma** with a **PostgreSQL** database. Main models:

- **User**: Authentication, owns tasks, collections, and labels.
- **Task**: Belongs to a user, can be linked to a collection, have labels, and extra metadata.
- **Collection**: Groups tasks for a user, can have a color.
- **Label**: User-defined tags for tasks, can have a color.
- **Extras**: Optional metadata for a task (due date, priority, extra labels).

### Key Relationships

- A **User** has many **Tasks**, **Collections**, and **Labels**.
- A **Task** belongs to one **User**, can belong to one **Collection**, and have many **Labels**.
- **Labels** can be attached to many **Tasks** (many-to-many).
- **Extras** is a one-to-one extension of **Task** for due date, priority, and extra labels.

### Enums

- **Status**: `TODO`, `IN_PROGRESS`, `DONE`
- **PriorityLevel**: `LOW`, `MEDIUM`, `HIGH`, `URGENT`

---

## 📝 What I'd Build Next If I Had More Time

- **Onboarding**: Guided setup for new users.
- **User Profiles**: Customizable user profiles with avatars.
- **Notifications**: Reminders for due dates and overdue tasks.
- **Team/Collaboration**: Shared collections, assign tasks to other users.
- **Recurring Tasks**: Support for tasks that repeat on a schedule.
- **OAuth**: Google/GitHub login.
- **Task History**: Track changes to tasks over time.
- **File Attachments**: Upload files to tasks.
- **Task Comments**: Add comments to tasks for better collaboration.
- **Task Dependencies**: Link tasks to show dependencies.
- **Priority Sorting**: Sort tasks by priority level.
- **Keyboard Shortcuts**: For common actions like adding tasks, navigating collections.
- **Drag and Drop**: Reorder tasks within collections or change their status.
- **Dark Mode**: Theme toggle for better user experience.
- **Search Functionality**: Search tasks by title, label, or collection.
- **Analytics Dashboard**: Visualize task completion rates, overdue tasks, etc.
- **API Documentation**: Hoppscotch or Postman docs for backend API endpoints.

---

## 🌐 Deployed App

[Live Demo](https://donezo.akinkunmi.dev)

---
