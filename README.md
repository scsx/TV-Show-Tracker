# TV Show Tracker


# 🎯 About

## The ask

"To evaluate your skills and coding style, we would like to develop a small RESTful API in .NET _(or tech stack of preference)_

**TV SHOW TRACKER API**

We would like you to build a small API that accomplishes the following:

- Allows user registration
- Allows user authentication & authorization
- Usage of an access token for further operations (with optional TTL - should be pruned when time expires)
- Returns all the tv shows available (in your database - details of a tv show are up to you)
- It should be possible to see the release dates and other details about the episodes
- Returns the tv shows by genre, type
- All information (collections) should be sortable by the available fields
- From each actor be able to see the tv shows that he/she has appeared in
- From a tv show, be able to obtain the featured actors
- It should be possible to add/remove favorite tv shows
- Uses a SQL/NoSQL database to store the information
- Uses pagination when presenting lists
- Background worker that obtains new information from a datasource (of your choice e.g. [https://www.episodate.com/api](https://www.episodate.com/api)) and inserts it in your database
- Unit & Integration Tests

**PROCEDURE**

- Use SOLID design principles
- You may use any source to obtain the information you need
- Write a few sentences (max. 10) about your approach and send it with your solution
- Document the API
- Write a small document explaining how to install and run the API
- You have five days to resolve this challenge

**PLUS**

- Functional Programming
- Entity Framework
- Recommends new tv shows, bases on the user's favorites
- Add/remove favorite tv shows
- Dependency Injection
- Cache for constant information (with TTL - should be pruned when time expires)
- RGPD compliance
- Export information to csv/pdf
- Background worker that sends emails with the tv shows recommendations
- Feel free to add more items as you wish (amaze us)"

## Solution

- For the development plan check “Roadmap” section on this page
- Due to time constraints and the size of the app some compromises were reached:
  - App was conceived as desktop-only
  - Most of the app is accessible after login only
  - Almost all data comes from [themoviedb.org](http://themoviedb.org/) using auth API Key v3. Only TV shows are used, not movies
  - The Mongo DB is being used, as an example, only for the trending shows from [https://developer.themoviedb.org/reference/trending-tv](https://developer.themoviedb.org/reference/trending-tv). Apart from that the DB stores users, favorites, etc, as expected.
  - The **_trending_** data is fetched and saved in DB at the start of the server (if empty) and updated every 2 minutes (cron). Each time data is fetched and saved/updated, the frontend is notified through a web socket (and using custom hook **`useSocketNotifications.ts`**).
  - There’s a search for shows using a combination of [https://api.themoviedb.org/3/search/tv](https://api.themoviedb.org/3/search/tv) and [https://api.themoviedb.org/3/discover/tv](https://api.themoviedb.org/3/discover/tv), which allows **`with_keywords`**, **`with_genres`**, **`sort_by`** and **`page`**. The requirements “_All information (collections) should be sortable by the available fields_“ is partially met using genres but without overcomplicating the layout.
- Test coverage is ~84% for frontend and ~33% for backend
- **`/persons`** shows trending actors from [https://api.themoviedb.org/3/person/popular](https://api.themoviedb.org/3/person/popular)

## Design, UX/UI

- Loosely inspired in Letterboxd and Metacritic
- Components mostly unchanged from the look defined by [shadcn](https://ui.shadcn.com/)
- Fonts (Google)
  - Playfair Display
  - Plus Jakarta Sans
- Icons: [https://react-icons.github.io/react-icons/](https://react-icons.github.io/react-icons/)
- Images: Google and [https://www.instagram.com/us.tvshows.posters/](https://www.instagram.com/us.tvshows.posters/)
- Color scheme:
  - **Dark blue (`#2c3440`)**
    - HSL: `217 19% 21%`
    - `background`
  - **White (`#FFFFFF`)**
    - HSL: `0 0% 100%`
    - `foreground` main text color
  - **Light yellow (`#ffff71`)**
    - HSL: `60 100% 72%`
    - `primary` highlights main color, buttons, etc
  - **Blueish gray (`#99aabb`)**
    - HSL: `217 17% 67%`
    - `secondary` borders, buttons, etc


# 🚀 Installation & Usage

## Prerequisites

- Node.js 22.17.0 _(20.9.0 is known to cause problems during installation)_

## Installation & Start

1. **Clone the Repository**

   ```bash
   git clone [<https://github.com/scsx/tv-show-tracker.git>](<https://github.com/scsx/tv-show-tracker.git>)
   cd tv-show-tracker
   ```

2. **Installation**
   - Install dependencies: **`npm install`** at root level
   - Start the server: **`npm run dev`** (backend and frontend run concurrently)
   - The API will be available at **`http://localhost:5000`** and the frontend at**`http://localhost:5173`**
3. **Backend Setup**
   - Create a `.env` file in the `backend` folder with the variables sent with email
4. **Frontend Setup**
   - Create a `.env` file in the **`frontend`** folder with the variables sent with email
5. **Run**
   - From root run **`npm run dev`**
   - Most of the app is protected by login


# 🏗️ Development / Architecture

## Design Principles

- **SOLID Principles:**
  The project's architecture is designed to be robust and maintainable by adhering to the SOLID principles. The **Single Responsibility Principle (SRP)** is evident in the clear separation of concerns, where each controller, service, and component has a singular purpose. For instance, the `show.routes.ts` file is solely responsible for defining show-related API endpoints, while the `showUpdater.service.ts` handles the business logic of updating show data. This separation ensures that a change to one feature does not impact others. The **Dependency Inversion Principle (DIP)** is applied by injecting dependencies like the Socket.IO instance (`io`) into routes and services, decoupling them from their implementations. This makes the code more modular and testable. The architecture also allows for easy extension without modifying existing code, reflecting the **Open/Closed Principle (OCP)**. For example, adding new API endpoints or a new content type (e.g., movies) can be done by creating new modules and services, without altering the core logic of the show-related components.
- **DRY (Don't Repeat Yourself):**
  The project actively avoids code duplication to enhance maintainability and consistency. This is achieved through several key practices: **reusable components**, such as the `Text` component, which centralizes typography styles and logic, and **utility functions** in the `/lib` directory, like those for date manipulation. The most critical application of DRY is the **centralization of shared logic** in the monorepo. This includes **reusable TypeScript types** (e.g., `TTMDBShow`, `TTMDBShowSummary`) that are shared between the frontend and backend, ensuring data consistency and preventing redundant type declarations. This structure consolidates common utilities and shared logic, making the codebase more cohesive and easier to manage.

## Developement Tools

This project leveraged various tools and practices to enhance development efficiency and code quality:

- **VS Code**
- **Code Quality:** ESLint, Prettier, etc
- **Postman**
- **AI: Gemini, GitHub Copilot**

## Tech Stack

**1. Frontend:**

- **Framework:** React, using Vite
- **TypeScript**
- **Styles**
  - Tailwind CSS (v3)
  - Shadcn/ui (Components based in Radix UI and Tailwind)
- **Real-time communication:** Socket.IO Client
- **Form Validation**: The stack relies on `react-hook-form` with the `zod` library and `@hookform/resolvers` for robust and type-safe form validation.
- **Routing**: `react-router-dom`
- **UI/Icons**: `react-icons`
- **Tests**: `jest`, `supertest`, `ts-jest`

**2. Backend (API):**

- **Runtime:** Node.js and `nodemon`
- **Framework:** Express.js
- **TypeScript**
- **DB (ODM):** Mongoose
- **Tasks:** `node-cron`
- **HTTP:** `axios`
- **Cross-Origin Requests**: `cors`
- **Env vars:** `dotenv`
- **Real-time communicatio:** Socket.IO Server
- **Security**: The stack uses `bcryptjs` for hashing and securing user passwords
- **Tests**: `jest`, `jest-environment-jsdom`, `@testing-library/react`

**3. Databases:**

- **System:** MongoDB

**4. APIs**

- TheMovieDB (TMDb) API

**5. General architecture:**

- Monorepo with separate folders for `frontend`, `backend` and `shared/types`

## File Structure

```jsx
tv-show-tracker/
├── backend/                  # API Node.js/Express
│   ├── src/
│   │   ├── __tests__/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   └── services/
│   │   └── utils/
│   │   └── server.ts         # Entry point
│   ├── .env
├── design/                   # Design (assets, previews, etc.)
│   ├── assets/
│   ├── previews/
│   └── ref/
├── frontend/                 # React
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── hooks/
│   │   ├── lib/
│   │   ├── pages/
│   │   ├── services/
│   │   └── styles/
│   ├── .env
│   ├── .gitignore
│   └── package.json
└── shared/
    └── types/
```

## The Movie Database

- Auth uses v3
- Reference: [https://developer.themoviedb.org/reference/intro/getting-started](https://developer.themoviedb.org/reference/intro/getting-started)

## Typescript

Type names always start with “T”. E.g.:

- **`TUser`** - user
- **`TTMDBShow`** - (TV) show (types from TMDB start with “**`T+TMDB`**”)
- **`TTMDBShowSummaryModel`** - (TV) show (short version) for the response from Mongo DB; models from DB end with “**`Model`**”
- **`ShowCardProps`** - for props (component level only) add the suffix “**`Props`**”

## MongoDB

- Project **TV Show Tracker 2025** at [https://cloud.mongodb.com/](https://cloud.mongodb.com/).


# 🛤️ Roadmap

- **Documentation and Planning**

✅ End of day 0

- **Initial Setup & Base Architecture**
  - Set up the **monorepo** (frontend, backend, shared/types).
  - Configure **TypeScript** (both ends), ESLint, and Prettier.
  - Initialize **Node.js/Express.js** backend and **React** frontend (Vite/CRA).
  - Connect the backend to **MongoDB** using Mongoose.
- **Authentication & Core Models**
  - On the backend, create **`User`** and **`AccessToken`** models (with MongoDB's TTL index for automatic pruning).
  - Implement **user registration (`/register`) and login (`/login`)** routes and logic.
- **Frontend setup**
  - Configure **Tailwind CSS** with design guidelines**,** integrate **Shadcn/ui** components
  - Install font, create basic components like **Text.tsx, Hyperlink.tsx,** and preview them with /kitchen-sink
    ✅ End of day 1
  - Develop frontend pages/components for user authentication.
- **Tests setup**
  - Configure **Husky**, **Jest**, etc
  - Batch of tests

✅ End of day 2

- **External API Integration & Sync Worker**
  - Implement auth flow for **TheMovieDB API**
  - On the backend, create the **`TvShow`** model (and optionally `Actor`, `Episode`, `Season`).
  - Develop the **sync worker** (`node-cron`) to
    - Fetch Top N popular series from **TheMovieDB API** (using Axios).
    - Map and upsert this data into your MongoDB.
    - Run **on server startup** and at scheduled intervals.

✅ End of day 3

- **TV Show Features & Real-time Communication**
  - On the backend, implement routes for listing TV shows (from your DB) and for **favoriting/unfavoriting** by authenticated users.
  - On the frontend, build the UI for **displaying TV show lists**, **details pages**, and the **favorite** functionality.
    ✅ End of day 4
  - Integrate **Socket.IO (server and client)** for real-time notifications about the worker's sync status to the frontend.
- **Final UI/UX & Installation**
  - Perform basic usability refinements and visual error handling for the implemented features.
  - Install the project from scratch to make sure it’ll be correctly done anywhere
    ✅ End of day 5
- **Final tests**
  - Coverage, etc
  - Test installation

✅ End of day 6


# 🧪 Tests

### Backend

- Using **Jest**
- Expected Coverage: 30% / Obtained: ~33%
- From the root of the project run **`npm test --workspace=backend`**
- For individual file from **`/backend`** run **`npm test -- .\src\__tests__\controllers\recommendation.controller.test.ts`**

### Frontend

- Using **Jest** and **React Testing Library**
- Expected Coverage: 70% / Obtained: ~84%
- From the root of the project run **`npm test --workspace=frontend`**
- For coverage at the root of the project run **`npm test --workspace=frontend -- --coverage`**
- For individual file from **`/frontend`** run **`npm test src/tests/context/AuthContext.test.tsx`**


# 📝 Documentation

This is the documentation. It might include personal development notes. Originally it was a Notion page, whose markdown was reused for the GitHub readme.


# ✅ Possible Enhancements

- Error Boundaries
- Follow people
- Watch later (shows)
- Localization
- Trailers
- Social media


# 🧑‍💻 Author & License

- [https://github.com/scsx](https://github.com/scsx) / [https://soucasaux.com](https://soucasaux.com/)
- MIT License
