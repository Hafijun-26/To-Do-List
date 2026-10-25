const taskInput = document.getElementById("taskInput");
const addButton = document.getElementById("addButton");
const taskList = document.getElementById("taskList");

const totalCount = document.getElementById("totalCount");
const completedCount = document.getElementById("completedCount");
const emptyMessage = document.getElementById("emptyMessage");

const filterButtons = document.querySelectorAll(".filter-btn");

let tasks = JSON.parse(localStorage.getItem("taskflow-tasks")) || [];
let currentFilter = "all";

// Save tasks in the browser
function saveTasks() {
    localStorage.setItem("taskflow-tasks", JSON.stringify(tasks));
}

// Add a new task
function addTask() {
    const text = taskInput.value.trim();

    if (text === "") {
        taskInput.focus();
        return;
    }

    const task = {
        id: Date.now(),
        text: text,
        completed: false
    };

    tasks.push(task);

    saveTasks();
    renderTasks();

    taskInput.value = "";
    taskInput.focus();
}

// Display tasks
function renderTasks() {
    taskList.innerHTML = "";

    const filteredTasks = tasks.filter(function (task) {
        if (currentFilter === "active") {
            return !task.completed;
        }

        if (currentFilter === "completed") {
            return task.completed;
        }

        return true;
    });

    filteredTasks.forEach(function (task) {
        const li = document.createElement("li");

        if (task.completed) {
            li.classList.add("completed");
        }

        // Checkbox
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = task.completed;
        checkbox.setAttribute("aria-label", "Complete task");

        checkbox.addEventListener("change", function () {
            task.completed = checkbox.checked;
            saveTasks();
            renderTasks();
        });

        // Task text
        const taskText = document.createElement("span");
        taskText.className = "task-text";
        taskText.textContent = task.text;

        // Edit button
        const editButton = document.createElement("button");
        editButton.className = "task-action";
        editButton.textContent = "Edit";

        editButton.addEventListener("click", function () {
            const updatedText = prompt("Edit your task:", task.text);

            if (updatedText === null) {
                return;
            }

            if (updatedText.trim() === "") {
                alert("Task cannot be empty.");
                return;
            }

            task.text = updatedText.trim();

            saveTasks();
            renderTasks();
        });

        // Delete button
        const deleteButton = document.createElement("button");
        deleteButton.className = "task-action delete";
        deleteButton.textContent = "Delete";

        deleteButton.addEventListener("click", function () {
            const confirmed = confirm("Do you want to delete this task?");

            if (!confirmed) {
                return;
            }

            tasks = tasks.filter(function (item) {
                return item.id !== task.id;
            });

            saveTasks();
            renderTasks();
        });

        li.appendChild(checkbox);
        li.appendChild(taskText);
        li.appendChild(editButton);
        li.appendChild(deleteButton);

        taskList.appendChild(li);
    });

    // Update task counters
    totalCount.textContent = tasks.length;

    completedCount.textContent = tasks.filter(function (task) {
        return task.completed;
    }).length;

    // Show or hide empty message
    emptyMessage.style.display =
        filteredTasks.length === 0 ? "block" : "none";
}

// Add task on button click
addButton.addEventListener("click", addTask);

// Add task when Enter is pressed
taskInput.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        addTask();
    }
});

// Filter tasks
filterButtons.forEach(function (button) {
    button.addEventListener("click", function () {
        currentFilter = button.dataset.filter;

        filterButtons.forEach(function (filterButton) {
            filterButton.classList.remove("active");
        });

        button.classList.add("active");

        renderTasks();
    });
});

// Load saved tasks when the page opens
renderTasks();