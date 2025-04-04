/**
 *   node generateData.js 500 3
 *     -> Inserts 500 tasks with 3 subtasks each
 */

const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

const REST_TASK_URL = "http://localhost:5050/api/tasks";
const REST_SUBTASK_URL = "http://localhost:5050/api/subtasks";

// Defaults
let NUM_TASKS = 1000;
let SUBTASKS_PER_TASK = 3;

// CLI args
const args = process.argv.slice(2);
if (args[0]) NUM_TASKS = parseInt(args[0], 10);
if (args[1]) SUBTASKS_PER_TASK = parseInt(args[1], 10);

console.log(`🚀 Inserting ${NUM_TASKS} tasks with ${SUBTASKS_PER_TASK} subtasks each...`);

async function createTask(title, content) {
  const response = await fetch(REST_TASK_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, content }),
  });

  if (!response.ok) throw new Error(`Failed to create task: ${title}`);
  const result = await response.json();
  return result.id;
}

async function createSubtask(taskId, title) {
  const response = await fetch(REST_SUBTASK_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      taskId,
      title,
      content: "some content",
      completed: false,
    }),
  });

  if (!response.ok) throw new Error(`Failed to create subtask: ${title}`);
}

async function insertTasks(num, subtasksPerTask) {
  for (let i = 1; i <= num; i++) {
    const title = `Task ${i}`;
    const content = `Content for Task ${i}`;
    const taskId = await createTask(title, content);

    for (let s = 1; s <= subtasksPerTask; s++) {
      const subTitle = `Subtask ${s} of Task ${i}`;
      await createSubtask(taskId, subTitle);
    }

    if (i % 100 === 0) {
      console.log(`Inserted ${i} tasks...`);
    }
  }
}

(async function main() {
  try {
    await insertTasks(NUM_TASKS, SUBTASKS_PER_TASK);
    console.log(`Done! Inserted ${NUM_TASKS} tasks with ${SUBTASKS_PER_TASK} subtasks each.`);
  } catch (err) {
    console.error("Error:", err);
  }
})();