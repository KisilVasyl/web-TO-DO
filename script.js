let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let filter = "all"; // Фільтр: "all", "active", "completed"

const taskInput = document.getElementById("taskInput");
const deadlineInput = document.getElementById("deadlineInput");
const addBtn = document.getElementById("addBtn");
const sortBtn = document.getElementById("sortBtn");
const toggleThemeBtn = document.getElementById("toggleTheme");
const taskList = document.getElementById("taskList");

const allBtn = document.getElementById("allBtn");
const activeBtn = document.getElementById("activeBtn");
const completedBtn = document.getElementById("completedBtn");

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function renderTasks() {
  taskList.innerHTML = "";

  const filteredTasks = tasks.filter(taskObj => {
    if (filter === "all") return true;
    if (filter === "active") return !taskObj.done;
    if (filter === "completed") return taskObj.done;
  });

  filteredTasks.forEach((taskObj, index) => {
    const li = document.createElement("li");
    li.setAttribute("draggable", "true");

    const span = document.createElement("span");
    span.textContent = taskObj.text;
    if (taskObj.done) span.classList.add("done");

    // Перемикання стану "виконано"
    span.onclick = () => {
      taskObj.done = !taskObj.done;
      saveTasks();
      renderTasks();
    };

    // Редагування
    span.ondblclick = () => editTask(index, span);

    const delBtn = document.createElement("button");
    delBtn.textContent = "🗑️";
    delBtn.onclick = () => deleteTask(index);

    const deadlineSpan = document.createElement("span");
    deadlineSpan.textContent = taskObj.deadline ? `Дедлайн: ${taskObj.deadline}` : "";
    deadlineSpan.classList.add("deadline");

    li.appendChild(span);
    li.appendChild(deadlineSpan);
    li.appendChild(delBtn);
    taskList.appendChild(li);

    // Drag & Drop
    li.addEventListener("dragstart", (e) => {
      e.dataTransfer.setData("text/plain", index);
    });

    li.addEventListener("dragover", (e) => e.preventDefault());

    li.addEventListener("drop", (e) => {
      e.preventDefault();
      const fromIndex = e.dataTransfer.getData("text/plain");
      const movedTask = tasks.splice(fromIndex, 1)[0];
      tasks.splice(index, 0, movedTask);
      saveTasks();
      renderTasks();
    });
  });
}

function addTask() {
  const text = taskInput.value.trim();
  const deadline = deadlineInput.value.trim();

  if (text === "") return;

  tasks.push({ text, deadline, done: false });
  taskInput.value = "";
  deadlineInput.value = "";
  saveTasks();
  renderTasks();
}

function deleteTask(index) {
  tasks.splice(index, 1);
  saveTasks();
  renderTasks();
}

function editTask(index, spanElement) {
  const input = document.createElement("input");
  input.type = "text";
  input.value = tasks[index].text;

  input.onblur = () => {
    tasks[index].text = input.value.trim() || tasks[index].text;
    saveTasks();
    renderTasks();
  };

  input.onkeydown = (e) => {
    if (e.key === "Enter") input.blur();
  };

  spanElement.replaceWith(input);
  input.focus();
}

addBtn.onclick = addTask;
taskInput.onkeydown = (e) => {
  if (e.key === "Enter") addTask();
};

sortBtn.onclick = () => {
  tasks.sort((a, b) => a.text.localeCompare(b.text));
  saveTasks();
  renderTasks();
};

// Фільтрація
allBtn.onclick = () => { filter = "all"; renderTasks(); };
activeBtn.onclick = () => { filter = "active"; renderTasks(); };
completedBtn.onclick = () => { filter = "completed"; renderTasks(); };

// Темна тема
toggleThemeBtn.onclick = () => {
  document.body.classList.toggle("dark");
  localStorage.setItem("theme", document.body.classList.contains("dark") ? "dark" : "light");
};

// Завантаження теми
if (localStorage.getItem("theme") === "dark") {
  document.body.classList.add("dark");
}

// Ініціалізація
renderTasks();
