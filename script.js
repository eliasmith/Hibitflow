"use strict";

/**
 * @typedef {Object} Habit
 * @property {string} id
 * @property {string} name
 * @property {string} category
 * @property {boolean} completed
 * @property {string} completedDate
 */

/** @type {Habit[]} */
let habits = [];

const STORAGE_KEY = "habitflow_first_version";

/**
 * Get today's date.
 * @returns {string}
 */
function getToday() {
    const today = new Date();

    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}

/**
 * Save habits to local storage.
 */
function saveHabits() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(habits));
}

/**
 * Load saved habits.
 */
function loadHabits() {
    try {
        const saved = localStorage.getItem(STORAGE_KEY);

        if (saved) {
            const parsed = JSON.parse(saved);

            if (Array.isArray(parsed)) {
                habits = parsed;
            }
        }
    } catch (error) {
        console.error("Could not load habits:", error);
        habits = [];
    }
}

/**
 * Display all habits.
 */
function renderHabits() {
    const habitList = document.getElementById("habitList");

    habitList.innerHTML = "";

    if (habits.length === 0) {
        const message = document.createElement("p");

        message.className = "empty-message";
        message.textContent = "No habits yet. Add your first habit below.";

        habitList.appendChild(message);
    }

    habits.forEach(function (habit) {
        const item = document.createElement("div");

        item.className = "habit-item";

        if (habit.completed) {
            item.classList.add("completed");
        }

        const info = document.createElement("div");
        info.className = "habit-info";

        const name = document.createElement("h3");
        name.textContent = habit.name;

        const category = document.createElement("p");
        category.textContent = habit.category;

        info.append(name, category);

        const button = document.createElement("button");

        button.className = "complete-button";
        button.type = "button";
        button.textContent = habit.completed
            ? "Completed ✓"
            : "Complete";

        button.addEventListener("click", function () {
            toggleHabit(habit.id);
        });

        item.append(info, button);
        habitList.appendChild(item);
    });

    document.getElementById("habitCount").textContent =
        habits.length + (habits.length === 1 ? " habit" : " habits");

    updateProgress();
}

/**
 * Update daily progress.
 */
function updateProgress() {
    const total = habits.length;

    const completed = habits.filter(function (habit) {
        return habit.completed;
    }).length;

    const percentage = total === 0
        ? 0
        : Math.round((completed / total) * 100);

    document.getElementById("progressPercent").textContent =
        percentage + "%";

    document.getElementById("progressBar").style.width =
        percentage + "%";

    document.getElementById("progressText").textContent =
        completed + " of " + total + " habits completed";

    updateStreak();
}

/**
 * Update the streak display.
 */
function updateStreak() {
    const today = getToday();

    const completedToday = habits.some(function (habit) {
        return habit.completed && habit.completedDate === today;
    });

    document.getElementById("streakCount").textContent =
        completedToday ? "1" : "0";
}

/**
 * Complete or undo a habit.
 * @param {string} id
 */
function toggleHabit(id) {
    const habit = habits.find(function (item) {
        return item.id === id;
    });

    if (!habit) {
        return;
    }

    habit.completed = !habit.completed;

    habit.completedDate = habit.completed ? getToday() : "";

    saveHabits();
    renderHabits();
}

/**
 * Add a new habit.
 * @param {SubmitEvent} event
 */
function addHabit(event) {
    event.preventDefault();

    const nameInput = document.getElementById("habitName");
    const categoryInput = document.getElementById("habitCategory");

    const name = nameInput.value.trim();
    const category = categoryInput.value;

    if (!name) {
        alert("Please enter a habit name.");
        return;
    }

    /** @type {Habit} */
    const newHabit = {
        id: String(Date.now()) + Math.random(),
        name: name,
        category: category,
        completed: false,
        completedDate: ""
    };

    habits.push(newHabit);

    saveHabits();
    renderHabits();

    document.getElementById("habitForm").reset();
}

/**
 * Connect the form to the add habit function.
 */
document.getElementById("habitForm").addEventListener(
    "submit",
    addHabit
);

/* Start HabitFlow */
loadHabits();
renderHabits();