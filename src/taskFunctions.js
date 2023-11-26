import storageUtil from './storage.js'
import {tasks,projects,changeProjects,changeTasks} from './index.js';
import getUnixTime from 'date-fns/getUnixTime';
import task from './task.js';
import format from 'date-fns/format';
import displayUtils from './displayUtil.js';

export default function taskFunctions(){

    let formDialog = document.querySelector('.addTaskDialog'); 
    let addTaskForm = document.querySelector('.taskForm');
    let cancelTaskFormBtn = document.querySelector('.closeAddTaskForm');
    let addTaskImg = document.querySelector('.addTaskImg');
    let projectInForm = document.querySelector('#projectForm');
    let priorityInForm = document.querySelector('#priorityForm');
    let dateInputForm = document.querySelector('#dueDate');
    let storageObj = storageUtil();
    let addProjectBtn = document.querySelector('.add-project-icon');
    let addProjectDialog = document.querySelector('.addProjectDialog');
    let addProjectForm = document.querySelector('#addProjectForm');
    let projectCancelBtn = document.querySelector('.projectFormCancelBtn');
    let displayObj = displayUtils();
    let currenProjectViewSpan = document.querySelector('.projestNameInTodo');
    let projectDropDown = document.querySelector('#projectForm');

    return {
        handleAddTaskForm(){
            addTaskImg.addEventListener('click',()=>{
                let currentProjects = storageObj.getProjects();
                let currentDate = format(new Date(),'yyyy-MM-dd');
                dateInputForm.value = currentDate;
                projectDropDown.innerHTML = '';
                for(let i = 0;i<currentProjects.length;i++){
                    projectInForm.options[projectInForm.options.length] = new Option(currentProjects[i][0],currentProjects[i][0],false,true);
                }
                formDialog.showModal();
            });
            addTaskForm.addEventListener('submit',(e)=>{
                e.preventDefault();
                this.processAddTask();
                addTaskForm.reset();
                formDialog.close();
            });
            cancelTaskFormBtn.addEventListener('click',(e)=>{
                e.preventDefault();
                addTaskForm.reset();
                formDialog.close();
            });
            addProjectBtn.addEventListener('click',()=>{
                addProjectDialog.showModal();
            });
            addProjectForm.addEventListener('submit',(e)=>{
                e.preventDefault();
                this.processProjectForm();
                addProjectForm.reset();
                addProjectDialog.close();
            });
            projectCancelBtn.addEventListener('click',(e)=>{
                e.preventDefault();
                addProjectForm.reset();
                addProjectDialog.close();
            });
        },
        processAddTask(){
            let addTaskFormData = new FormData(addTaskForm);
            let currentTask = task(addTaskFormData.get('taskName'),addTaskFormData.get('taskDesc'),addTaskFormData.get('dueDate'),getUnixTime(new Date()),priorityInForm.value,projectInForm.value);
            let newTasks = tasks;
            newTasks.push(currentTask);
            changeTasks(newTasks);
            storageObj.addTasks(currentTask);
            // Check if this is the current display if so call the display by project function.
            let currentProject = currenProjectViewSpan.innerText;
            if(currentProject == 'Today'){
                displayObj.displayToday();
            }
            else if(currentProject == 'This Week'){
                displayObj.displayThisWeek();
            }
            else if(currentProject == 'Inbox'){
                displayObj.displayToDoByProject('Inbox');
            }
            else{
                let cp = currentProject.substr(9);
                displayObj.displayToDoByProject(cp);
            }
        },
        processProjectForm(){
            let projectFormData = new FormData(addProjectForm);
            let currentProject = projectFormData.get('projectNameInput');
            let tempMe = false;
            for(let i = 0;i<projects.length;i++){
                if(projects[i][0] == currentProject){
                    tempMe = true;
                    break;
                }
            }
            if(tempMe){
                alert(`Project ${currentProject} already exists!`);
                return;
            }
            let currentProjects = projects;
            let temp1 = [currentProject,getUnixTime(new Date())];
            currentProjects.push(temp1);
            changeProjects(currentProjects);
            storageObj.addProjects(temp1);
            displayObj.addProjectToDiv(temp1);
        }
    }
}