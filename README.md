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

## Docs

- Data models in [/docs/data-models.md](./docs/data-models.md)

## Build and development

1. clone the repo

   ```bash
   git clone https://github.com/mrtnstl/timelines
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
   make run

   # in a separate terminal

   # frontend
   cd frontend
   npm run dev
   ```

4. building

   by itself

   ```bash
   # backend
   cd backend
   make build

   # in a separate terminal

   # frontend
   cd frontend
   npm run build
   ```

   or containerized

   ```bash
   # backend
   # to be implemented

   # in a separate terminal

   # frontend
   docker build -t tl-frontend:test -f Dockerfile .
   docker run --rm -p 3000:80 tl-frontend:test
   ```

## Project Structure

```text
/
├── .github                   # ci workflows
├── backend
│   ├── cmd
│   └── internal
│       ├── db                # database connection
│       ├── store             # database repositories
│       └── utils
│           └── env
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
