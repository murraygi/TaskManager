# Task Manager – REST & GraphQL Hybrid Single Page Application

This is a task management web app built with a Single Page Application (SPA) mindset. It supports both REST and GraphQL APIs, letting users create, update, and manage tasks and subtasks with a modern frontend powered by React.

## Features

- Toggle between REST and GraphQL modes via URL (`?api=graphql` or `?api=rest`)
- Tasks with optional subtasks
- Infinite scroll with deduplication
- Full CRUD for tasks and subtasks
- Subtask creation inline with task creation (GraphQL only)
- Responsive and accessible UI
- REST API using Sequelize and Express
- GraphQL API using GraphQL Yoga

---

## Folder Structure

```text
task-manager-app/
├── apis/
│   ├── config/
│   │   ├── config.js
│   │   └── database.js
│   ├── controllers/
│   │   ├── SubtaskController.js
│   │   └── TaskController.js
│   ├── graphql/
│   │   ├── resolvers.js
│   │   └── schema.js
│   ├── migrations/
│   └── rest/
│       ├── models/
│       │   ├── Subtask.js
│       │   └── Task.js
│       └── routes/
│           ├── subtasks.js
│           └── tasks.js
├── dist/
├── node_modules/
├── public/
│   └── styles.css
├── src/
│   ├── components/
│   │   ├── Footer.jsx
│   │   ├── Header.jsx
│   │   ├── SubtaskList.jsx
│   │   ├── Task.jsx
│   │   ├── TaskActions.jsx
│   │   ├── TaskCreation.jsx
│   │   ├── TaskEditMode.jsx
│   │   └── TaskList.jsx
│   ├── fonts/
│   │   └── OpenSans-Regular.woff2
│   ├── hooks/
│   │   └── useTasks.js
│   ├── App.jsx
│   └── index.jsx
├── tests/
│   ├── generateBigData.js
│   ├── generateData.js
│   └── Test Plan.jmx
├── .env
├── index.html
├── package.json
├── package-lock.json
├── server.js
├── vite.config.js
├── .gitignore
└── README.md
```


### Explanation

- **client/components**: All UI logic, including create/edit views and the main task list.
- **client/hooks/useTasks.js**: Shared logic for fetching and mutating tasks, abstracted for both API types.
- **server/controllers**: Core logic for creating, updating, and deleting data, shared across both REST and GraphQL.
- **server/graphql**: GraphQL schema and resolvers that mirror the REST logic.
- **server/rest/models**: Sequelize models for tasks and subtasks.

---

## How it Works

### Toggling API Mode

The app checks `window.location.search` for an `api` query param:

- `?api=graphql` → switches all task actions to GraphQL
- `?api=rest` or default → uses the REST API

A toggle button in the UI lets you switch modes dynamically.

### Data Flow

- The custom `useTasks` hook handles all of the data fetching, updating, and infinite scrolling logic.
- Tasks and subtasks are deduplicated client-side using the `Map`object keyed by task ID.
- The REST endpoints return paginated data using Sequelize's `findAndCountAll`.
- The GraphQL queries and mutations match the REST logic but also allow for nested subtask operations.

---

## Testing Methodology

This project systematically evaluates the performance of REST and GraphQL APIs in a Single Page Application context.

### What’s being tested

- Load times for initial page render and interaction - First Contentful Paint (FCP) in ms, Largest Contentful Paint (LCP) in ms, and Total Blocking Time (TBT) in ms.
- Network efficiency - number of requests, payload sizes(KB), load time (ms), finish time (ms).
- CRUD operation times for both flat and nested data - Time To First Byte (TTFB) in ms and total duration in ms.
- Bulk and batch operations (e.g. create/update/delete 1000 tasks).
- Nested mutation capabilities (e.g. creating a task with subtasks in one request).
- Concurrent usage to simulate real-world multi-user scenarios via JMeter - average/min/max response times (ms), throughput (req/sec).
- Selective updates and resource usage in subtask-only changes.
- Scalability under heavy data (e.g. large content, deep nesting).

### Tools

- Chrome DevTools
- Lighthouse
- JMeter

---

## Running Tests

1. Ensure the backend is running `node server.js` (see Setup Instructions).
2. Launch the frontend `npm run build` and then `serve -s dist` (see Setup Instructions).
3. Open Chrome and run mobile Lighthouse audits on both:
   - `http://localhost:3000?api=rest`
   - `http://localhost:3000?api=graphql`
4. Use DevTools' Network tab to compare requests, payloads, and load times.
5. Use JMeter to simulate load on `/api/tasks` and `/graphql`.

---

## Interpreting Results

- Look for differences in **FCP**, **LCP**, and **TBT**.
- Check **network request count**, **load time**, **finish time**, and **total KB** transferred.
- Measure **average response time** and **Throughput (req/sec)** under concurrent load (JMeter).

---

## Setup Instructions

# Install dependencies

- Run `npm install` from the project root to install all necessary packages.
- Install PostgreSQL - https://www.postgresql.org/docs/current/tutorial-install.html
- Install JMeter - https://jmeter.apache.org/usermanual/get-started.html

# Run server and client

Navigate into the project directory `cd /task-manager-app` and then run the following commands in separate vs code terminals:

- `node server.js` to start the back-end Express server and enable both REST and GraphQL API architectures.
- `npm run build` to build the front-end for production and compile the React app in the /dist directory.
- If you haven't already, install serve with `npm install -g serve`.
- Then run `serve -s dist` to serve the production frontend on a local server typically (http://localhost:3000).

## Seeding Test Data

To generate synthetic data for any of the tests you can run following commands in your vs code terminal or browser's console.

# Run `node generateData.js 500 3`

This inserts 500 tasks with 3 subtasks each into the database that will render on the front-end implementation of the SPA.

# Run `node generateBigData.js 1000 5`

This inserts 1000 tasks with 5 subtasks each, the content of these fields can be made larger i.e. have more lines/rows of data by editing the script directly and increasing or decreasing the parameters of the content and subcontent variables on lines 61 and 66.

On line 61, increasing the parameter of the generateParagraph function call in the content variable will increase the number of repeated lines in all of the Tasks that are generated. The same applies to line 66, and increasing the parameter of the generateParagraph function call in the subcontent variable which will increase the number of repeated lines in all of the Subtasks.
