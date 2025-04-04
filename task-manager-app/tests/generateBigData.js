/**
 *   node generateBigData.js 1000 3
 *     -> Inserts 1000 tasks, with 3 subtasks, using long text fields
 */

const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

const REST_TASK_URL = "http://localhost:5050/api/tasks";
const REST_SUBTASK_URL = "http://localhost:5050/api/subtasks";

let NUM_TASKS = 10;
let SUBTASKS_PER_TASK = 3;

const args = process.argv.slice(2);
if (args[0]) NUM_TASKS = parseInt(args[0], 10);
if (args[1]) SUBTASKS_PER_TASK = parseInt(args[1], 10);

console.log(`Inserting ${NUM_TASKS} tasks with ${SUBTASKS_PER_TASK} subtasks each (with large content)...`);

function generateParagraph(sentenceCount = 5) {
  const base = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. ";
  return Array.from({ length: sentenceCount })
    .map(() => base + "Pellentesque habitant morbi tristique senectus et netus.")
    .join(" ");
}

function generateTitle(index) {
  return `Task ${index} - ${Math.random().toString(36).substring(2, 10).toUpperCase()} Lorem ipsum dolor`;
}

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

async function createSubtask(taskId, title, content) {
  const response = await fetch(REST_SUBTASK_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      taskId,
      title,
      content,
      completed: false,
    }),
  });

  if (!response.ok) throw new Error(`Failed to create subtask: ${title}`);
}

async function insertTasks(num, subtasksPerTask) {
  for (let i = 1; i <= num; i++) {
    const title = generateTitle(i);
    const content = generateParagraph(20);
    const taskId = await createTask(title, content);

    for (let s = 1; s <= subtasksPerTask; s++) {
      const subTitle = `Subtask ${s} of Task ${i}`;
      const subContent = generateParagraph(10);
      await createSubtask(taskId, subTitle, subContent);
    }

    if (i % 50 === 0) {
      console.log(`Inserted ${i} tasks...`);
    }
  }
}

(async function main() {
  try {
    await insertTasks(NUM_TASKS, SUBTASKS_PER_TASK);
    console.log(`Done! Inserted ${NUM_TASKS} large tasks and subtasks into the database.`);
  } catch (err) {
    console.error("Error:", err);
  }
})();