# Frontend

React + Vite frontend for the coding platform. It provides authentication screens, a problem list, an in-browser code editor, submission history, run results, and an AI assistant panel.

## Features

- Signup and login flows
- Cookie-based session handling with backend auth checks
- Problem listing with difficulty filters
- Monaco-based code editor
- Run code against example cases
- Submit code against hidden test cases
- Submission history per problem
- Admin page for publishing problems as JSON
- AI chat panel with Markdown and KaTeX rendering

## Tech Stack

- React
- Vite
- Redux Toolkit
- React Router
- Tailwind CSS + DaisyUI
- Monaco Editor
- React Hook Form
- Axios
- React Markdown + KaTeX

## Project Structure

```text
src/
  assets/        Static images
  pages/         Route-level UI
  store/         Redux slices and store setup
  utils/         Shared helpers like Axios client
  App.jsx        Main routes
  main.jsx       App bootstrap
```

## Environment Variables

Copy `.env.example` to `.env`:

```env
VITE_API_BASE_URL=http://localhost:3000
```

This should point to the backend server.

## Installation

```bash
npm install
```

## Running Locally

Development:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

Lint the code:

```bash
npm run lint
```

The Vite dev server usually runs on `http://localhost:5173`.

## Main Screens

- `/signup` create a new account
- `/login` sign in
- `/` browse problems after authentication
- `/problems/:id` open the coding workspace
- `/admin` admin-only JSON problem publisher

## How It Connects To The Backend

- All API requests go through `src/utils/axiosClient.js`
- `withCredentials: true` is enabled so auth cookies are sent automatically
- The frontend expects the backend to expose auth, problem, submission, and AI routes

## Editor Experience

- Supports C++, Python, JavaScript, and Java
- Includes starter boilerplate for each language
- Run results are shown against example test cases
- Final submissions are tracked and displayed with status, runtime, and passed test counts

## Admin Workflow

- The admin page publishes a full problem definition as JSON
- The backend validates the payload and checks reference solutions before saving
- Only users with the `admin` role can access the page successfully

## Notes

- The app depends on the backend cookie auth flow, so frontend and backend origin settings must match
- AI responses are rendered as Markdown and can display math using KaTeX
- `dist/` contains the built output and can be regenerated with `npm run build`
