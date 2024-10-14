"use strict";

const userLists = document.querySelector(".user-lists");
const userInput = document.querySelector(".user-input");
const clearCompleted = document.querySelector(".clear-completed");

const itemsLeft = document.querySelector(".items-left");

let listLength = 0;
const activeBtn = document.querySelectorAll(".active");
const allBtn = document.querySelectorAll(".all");
const completedBtn = document.querySelectorAll(".completed");
/*---------------------------------------------------------------------------------------- */

userInput.addEventListener("keydown", function (event) {
  const clicked = event.key;
  if (clicked === "Enter") {
    const html = `<li class="user-list" draggable="true" ><a href="#"><input type="checkbox" name="done" class="check">${userInput.value}</a></li>`;

    if (userInput.value.trim() !== "")
      userLists.insertAdjacentHTML("beforeend", html);
    else window.alert("please enter something 🤔");

    userInput.value = ""; // Clear input after adding the task
    listLength++;
    updateItemsLeft(); // Update items count after adding a new task
  }
});

// Update the items left count
const updateItemsLeft = () => {
  const remainingTasks = document.querySelectorAll(
    ".user-list:not(.done-task)"
  ).length;
  itemsLeft.innerHTML = `${remainingTasks}`;
};

userLists.addEventListener("click", function (event) {
  const element = event.target;
  if (element !== element.closest(".check")) {
    element.addEventListener("dblclick", () => {
      element.closest(".user-list").remove();
      updateItemsLeft(); // Update items count after removing a task
    });
  }

  if (element.classList.contains("check")) {
    element.closest(".user-list").classList.toggle("done-task");
    updateItemsLeft(); // Update items count when task status changes
  }
});

// Function to filter tasks based on the filter type
const filterTasks = (filterType) => {
  document.querySelectorAll(".user-list").forEach((list) => {
    const isCompleted = list.classList.contains("done-task");

    switch (filterType) {
      case "all":
        list.style.display = "block"; // Show all tasks
        break;
      case "active":
        list.style.display = isCompleted ? "none" : "block"; // Show active tasks
        break;
      case "completed":
        list.style.display = isCompleted ? "block" : "none"; // Show completed tasks
        break;
    }
  });
};

allBtn.forEach((btn) =>
  btn.addEventListener("click", () => filterTasks("all"))
);
activeBtn.forEach((btn) =>
  btn.addEventListener("click", () => filterTasks("active"))
);
completedBtn.forEach((btn) =>
  btn.addEventListener("click", () => filterTasks("completed"))
);

// Clear completed tasks functionality
clearCompleted.addEventListener("click", function (event) {
  document
    .querySelectorAll(".user-list.done-task")
    .forEach((list) => list.remove());
  updateItemsLeft(); // Update items count after clearing completed tasks
});

/*--------------------------------------drag and drop ---------------------------------------------*/
let draggedItem = null;

userLists.addEventListener("dragstart", (event) => {
  draggedItem = event.target.closest(".user-list");
  draggedItem.classList.add("dragging");
});

userLists.addEventListener("dragend", () => {
  draggedItem.classList.remove("dragging");
  draggedItem = null;
});

userLists.addEventListener("dragover", (event) => {
  event.preventDefault();
  const afterElement = getDragAfterElement(userLists, event.clientY);
  if (afterElement == null) {
    userLists.appendChild(draggedItem);
  } else {
    userLists.insertBefore(draggedItem, afterElement);
  }
});

// Helper function to find the element after which to insert the dragged item
function getDragAfterElement(container, y) {
  const draggableElements = [
    ...container.querySelectorAll(".user-list:not(.dragging)"),
  ];

  return draggableElements.reduce(
    (closest, child) => {
      const box = child.getBoundingClientRect();
      const offset = y - box.top - box.height / 2;

      if (offset < 0 && offset > closest.offset) {
        return { offset: offset, element: child };
      } else {
        return closest;
      }
    },
    { offset: Number.NEGATIVE_INFINITY }
  ).element;
}

/*------------------------------------------------------------------------------------*/
// modes
const lightBtn = document.querySelector(".light-mode");
const darkBtn = document.querySelector(".dark-mode");

// Function to switch to light mode
lightBtn.addEventListener("click", () => {
  document.querySelector("body").classList.add("lightMode");
  update();
});

// Function to switch to dark mode
darkBtn.addEventListener("click", () => {
  document.querySelector("body").classList.remove("lightMode");
  update();
});

// Update function to toggle button visibility
const update = function () {
  lightBtn.classList.toggle("hidden");
  darkBtn.classList.toggle("hidden");
};

// Initialize by hiding the dark button
darkBtn.classList.add("hidden");
