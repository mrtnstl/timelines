# timelines

Timelines is a full-stack application where users can track any kind of progress in a linear manner. Selected items can be published for visitors - in possession of the public URL - to see.

The app uses a React frontend, a Golang backend API, and a PostgreSQL database.
Public timeline reads are cached in Redis for faster viewer performance.

## Features

- Manage many timelines under a user account
  - Google OAuth login
- Keep private drafts and selectively publish
- Share clean public links without exposing editor access
  - Public publish mode is guarded by high entropy keys for relatively protected access
- Owner-controlled allowlist for who can access the editor

## Build and development

1. clone the repo

   ```bash
   git clone REPO_URL
   ```

2. install dependencies

   ```bash
   cd frontend && npm ci

   cd ..

   cd backend && go mod download
   ```

3. running during development

   ```bash
   # backend
   cd backend
   # to be implemented

   # in a separate terminal
   # frontend
   cd frontend
   npm run dev
   ```

4. building

   ```bash
   # backend
   cd backend
   go build -o ./dist/bin ./...

   # in a separate terminal
   # frontend
   cd frontend
   npm run build
   ```

## Project Structure

```text
/
├── backend
│   ├── cmd
│   └── go.mod
├── docs
│   └── architecture.md
└── frontend
    ├── public
    └── src
        ├── app
        │   ├── layouts
        │   ├── pages
        │   └── router.tsx
        ├── assets
        ├── config
        ├── features
        │   ├── auth
        │   ├── editor
        │   ├── publishing
        │   ├── timelines
        │   └── viewer
        ├── index.css
        ├── main.tsx
        ├── testing
        └── utils
```
