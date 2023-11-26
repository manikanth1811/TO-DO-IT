import './style.css';
import task from './task.js';
import './asserts/img/tick-mark-green.png';
import {format,getUnixTime} from 'date-fns';
import taskUtil from './task-utilities.js';
import storageUtil from './storage.js';
import taskFunctions from './taskFunctions.js';
import displayUtils from './displayUtil.js';


let mobileToggleBtn = document.querySelector('.mobile-toggle');
let navBarDiv = document.querySelector('.nav-bar');



let tasks = [];
let projects = [];

const storageObj = storageUtil();
const taskUtilObj = taskUtil();
const displayObj = displayUtils();
let taskFunctionsObj = taskFunctions();


function startUp(){
    let testme = storageObj.getTasks();
    let tasksFromStorage = taskUtilObj.createTasksFromStorage(testme);
    if(tasksFromStorage.length != 0){
        tasks = tasks.concat(tasksFromStorage);
    }
    displayObj.startUpDisplay();
    projects = storageObj.getProjects();
    console.log("Projects at the start up",projects)
    projects.forEach((project)=>{
        if(project[0]!='Inbox'){
            displayObj.addProjectToDiv(project);
        }
    });
    addResponsiveness();
    taskFunctionsObj.handleAddTaskForm();
}

function addResponsiveness(){
    mobileToggleBtn.addEventListener('click',()=>{
        if(navBarDiv.style.display=='none'){
            navBarDiv.style.display = 'flex';
        }
        else{
            navBarDiv.style.display = 'none';
        }
    })
    
    window.addEventListener('resize',()=>{
        if(document.body.clientWidth <= 1200){
            navBarDiv.style.display = 'none';
        }
        else{
            navBarDiv.style.display = 'flex';
        }
    });
}


function changeTasks(newTasks){
    tasks = newTasks;
}

function changeProjects(newProjects){
    projects = newProjects;
}

startUp();

window.addEventListener('reload',()=>{
    startUp();
});

function test1(){
    let task1 = task("test1","test1-project-1","12-11-2222","1",2,"project-1");
    let task2 = task("test2","test1-project-1","12-11-2222","1",2,"project-2");
    let task3 = task("test3","test1-project-1","12-11-2222","1",2,"project-3");
    let task4 = task("test4","test1-project-1","12-11-2222","1",2,"project-1");
    let task5 = task("test5","test1-project-1","12-11-2222","1",2,"project-3");
    let someTasks = [];
    someTasks = someTasks.concat([task1,task2,task3,task4,task5]);
    let filteredProjectList = taskUtilObj.findWithProject('project-3',someTasks);
    console.log(filteredProjectList);
    filteredProjectList.forEach((task1)=>{
        task1.printAll();
    })
}

function test2(){
    let tempTasks = taskUtilObj.deleteTasksByProjectName(tasks,'Inbox');
    tempTasks.forEach((task)=>{
        task.printAll();
    })
}

test2();

export {changeProjects,changeTasks,tasks,projects};

