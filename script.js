
const taskForm = document.querySelector("#task-form");
const taskInput = document.querySelector("#task-input");
const taskList = document.querySelector("#task-list");
const emptyMessage = document.querySelector("#empty-message");

const totalCount = document.querySelector("#total-count");
const completedCount = document.querySelector("#completed-count");
const progressNumber = document.querySelector("#progress-number");
const progressBar = document.querySelector("#progress-bar");

const themeToggle = document.querySelector("#theme-toggle");
const clearCompletedButton = document.querySelector("#clear-completed");

const starterTasks = [
  { id: 1, text: "Learn HTML structure", completed: true },
  { id: 2, text: "Practice CSS styling", completed: false },
  { id: 3, text: "Understand JavaScript", completed: false }
];

function loadTasks() {
  try {
    const saved = localStorage.getItem("devlab-tasks");
    return saved === null ? starterTasks : JSON.parse(saved);
  } catch {
    return starterTasks;
  }
}

let tasks = loadTasks();
let nextId = Math.max(0, ...tasks.map(task => task.id)) + 1;

function saveTasks() {
  try {
    localStorage.setItem("devlab-tasks", JSON.stringify(tasks));
  } catch {
    console.warn("Could not save tasks in this browser.");
  }
}

function updateStats() {
  const total = tasks.length;
  const completed = tasks.filter(task => task.completed).length;
  const progress = total === 0 ? 0 : Math.round((completed / total) * 100);

  totalCount.textContent = total;
  completedCount.textContent = completed;
  progressNumber.textContent = `${progress}%`;
  progressBar.style.width = `${progress}%`;

  emptyMessage.hidden = total !== 0;
}

function renderTasks() {
  taskList.replaceChildren();

  tasks.forEach(task => {
    const item = document.createElement("li");
    item.className = `task-item${task.completed ? " done" : ""}`;

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.completed;
    checkbox.setAttribute("aria-label", `Complete ${task.text}`);

    checkbox.addEventListener("change", () => {
      task.completed = checkbox.checked;
      saveTasks();
      renderTasks();
    });

    const text = document.createElement("span");
    text.className = "task-text";
    text.textContent = task.text;

    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.className = "delete-button";
    deleteButton.textContent = "Delete";
    deleteButton.setAttribute("aria-label", `Delete ${task.text}`);

    deleteButton.addEventListener("click", () => {
      tasks = tasks.filter(current => current.id !== task.id);
      saveTasks();
      renderTasks();
    });

    item.append(checkbox, text, deleteButton);
    taskList.append(item);
  });

  updateStats();
}

taskForm.addEventListener("submit", event => {
  event.preventDefault();

  const text = taskInput.value.trim();
  if (!text) return;

  tasks.push({
    id: nextId++,
    text,
    completed: false
  });

  saveTasks();
  renderTasks();

  taskInput.value = "";
  taskInput.focus();
});

clearCompletedButton.addEventListener("click", () => {
  tasks = tasks.filter(task => !task.completed);
  saveTasks();
  renderTasks();
});

function applyTheme(isDark) {
  document.body.classList.toggle("dark", isDark);
  themeToggle.textContent = isDark ? "☀" : "☾";
  themeToggle.setAttribute(
    "aria-label",
    isDark ? "Switch to light theme" : "Switch to dark theme"
  );
}

let isDark = localStorage.getItem("devlab-theme") === "dark";
applyTheme(isDark);

themeToggle.addEventListener("click", () => {
  isDark = !isDark;
  applyTheme(isDark);
  localStorage.setItem("devlab-theme", isDark ? "dark" : "light");
});

const contactForm = document.querySelector("#contact-form");
const formStatus = document.querySelector("#form-status");

contactForm.addEventListener("submit", event => {
  event.preventDefault();

  const name = document.querySelector("#name").value.trim();
  const status = formStatus;

  status.classList.remove("error");

  if (!name) {
    status.textContent = "Please enter your name.";
    status.classList.add("error");
    return;
  }

  status.textContent =
    `Thanks, ${name}! Your demo form works, but no message was sent.`;
  contactForm.reset();
});

document.querySelector("#year").textContent = new Date().getFullYear();

renderTasks();
