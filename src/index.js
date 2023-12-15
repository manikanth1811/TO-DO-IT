import "./style.css";
import task from "./task.js";
import "./asserts/img/tick-mark-green.png";
import taskUtil from "./task-utilities.js";
import storageUtil from "./storage.js";
import taskFunctions from "./taskFunctions.js";
import displayUtils from "./displayUtil.js";

let mobileToggleBtn = document.querySelector(".mobile-toggle");
let navBarDiv = document.querySelector(".nav-bar");

let tasks = [];
let projects = [];

const storageObj = storageUtil();
const taskUtilObj = taskUtil();
const displayObj = displayUtils();
let taskFunctionsObj = taskFunctions();

function startUp() {
  let testme = storageObj.getTasks();
  let tasksFromStorage = taskUtilObj.createTasksFromStorage(testme);
  if (tasksFromStorage.length != 0) {
    tasks = tasks.concat(tasksFromStorage);
  }
  displayObj.startUpDisplay();
  projects = storageObj.getProjects();
  projects.forEach((project) => {
    if (project[0] != "Inbox") {
      displayObj.addProjectToDiv(project);
    }
  });
  addResponsiveness();
  taskFunctionsObj.handleAddTaskForm();
}

function addResponsiveness() {
  mobileToggleBtn.addEventListener("click", () => {
    if (navBarDiv.style.display == "none") {
      navBarDiv.style.display = "flex";
    } else {
      navBarDiv.style.display = "none";
    }
  });

  window.addEventListener("resize", () => {
    if (document.body.clientWidth <= 1200) {
      navBarDiv.style.display = "none";
    } else {
      navBarDiv.style.display = "flex";
    }
  });
}

function changeTasks(newTasks) {
  tasks = newTasks;
}

function changeProjects(newProjects) {
  projects = newProjects;
}

startUp();

window.addEventListener("reload", () => {
  startUp();
});

export { changeProjects, changeTasks, tasks, projects };
