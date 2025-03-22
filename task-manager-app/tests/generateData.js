/**
 * Usage:
 *   node generateData.js rest 1000
 *     -> Inserts 1000 tasks into the REST API
 *   node generateData.js graphql 500
 *     -> Inserts 500 tasks into the GraphQL API
 */

const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

// Default endpoints (change as needed)
const REST_URL = "http://localhost:5050/api/tasks";
const SUBTASKS_REST_URL = "http://localhost:5050/api/subtasks";
const GRAPHQL_URL = "http://localhost:5050/graphql";

// Default # of tasks and # of subtasks per task
let NUM_TASKS = 1000;
const SUBTASKS_PER_TASK = 3;

// Read args: [node, generateData.js, "rest"|"graphql", optional number]
const args = process.argv.slice(2);
const apiType = args[0]; // "rest" or "graphql"
if (args[1]) {
  NUM_TASKS = parseInt(args[1], 10);
}

// Validate
if (apiType !== "rest" && apiType !== "graphql") {
  console.error("Please specify 'rest' or 'graphql', e.g.:");
  console.error("  node generateData.js rest 1000");
  process.exit(1);
}

console.log(`Preparing to insert ${NUM_TASKS} tasks into the ${apiType.toUpperCase()} API...`);

async function createRestTask(title, content) {
  const response = await fetch(REST_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, content }),
  });
  if (!response.ok) throw new Error("Failed to create REST task");
  const result = await response.json();
  return result.id; // assumed your REST returns {id, ...}
}

async function createGraphQLTask(title, content) {
  const mutation = `
    mutation($title: String!, $content: String!) {
      createTask(title: $title, content: $content) {
        id
      }
    }
  `;
  const response = await fetch(GRAPHQL_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      query: mutation,
      variables: { title, content },
    }),
  });
  if (!response.ok) throw new Error("Failed to create GraphQL task");
  const result = await response.json();
  return result.data.createTask.id;
}

async function createRestSubtask(taskId, title) {
  const response = await fetch(SUBTASKS_REST_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ taskId, title, content: "some content", completed: false }),
  });
  if (!response.ok) throw new Error("Failed to create REST subtask");
}

async function createGraphQLSubtask(taskId, title) {
  const mutation = `
    mutation($taskId: Int!, $title: String!) {
      createSubtask(taskId: $taskId, title: $title, content: "some content", completed: false) {
        id
      }
    }
  `;
  const response = await fetch(GRAPHQL_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      query: mutation,
      variables: { taskId: taskId, title },
    }),
  });
  if (!response.ok) throw new Error("Failed to create GraphQL subtask");
}

async function insertTasks(api, num) {
  for (let i = 1; i <= num; i++) {
    const title = `Task ${i}`;
    const content = `Content for Task ${i}`;
    let newTaskId;

    if (api === "rest") {
      newTaskId = await createRestTask(title, content);
    } else {
      newTaskId = await createGraphQLTask(title, content);
    }

    // Create subtasks for each task
    for (let s = 1; s <= SUBTASKS_PER_TASK; s++) {
      const subTitle = `Subtask ${s} of Task ${i}`;
      if (api === "rest") {
        await createRestSubtask(newTaskId, subTitle);
      } else {
        await createGraphQLSubtask(newTaskId, subTitle);
      }
    }

    if (i % 100 === 0) {
      console.log(`Inserted ${i} tasks so far...`);
    }
  }
}

(async function main() {
  try {
    await insertTasks(apiType, NUM_TASKS);
    console.log(`✅ Successfully inserted ${NUM_TASKS} tasks into ${apiType.toUpperCase()} API`);
  } catch (err) {
    console.error("Error:", err);
  }
})();