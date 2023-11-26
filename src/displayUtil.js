import { parseISO,format,addDays,getUnixTime } from "date-fns";
import { projects,changeProjects,tasks,changeTasks } from "./index.js";
import storageUtil from "./storage.js";
import taskUtil from "./task-utilities.js";
import task from "./task.js";

export default function displayUtils(){

    let inboxBtn = document.querySelector('.inbox');
    let todayBtn = document.querySelector('.today');
    let thisWeekBtn = document.querySelector('.this-week');
    let projectsDiv = document.querySelector('.project-top-div');
    let storageObj = storageUtil();
    let projectNameSpan = document.querySelector('.projestNameInTodo');
    let taskUtilObj = taskUtil();
    let toDoTotalListDiv = document.querySelector('.todo-list-cards');
    let spanProjectNumber = document.querySelector('.tasks-number');
    let editTaskDialog = document.querySelector('.editTaskDialog');
    let editTaskNameIp = document.querySelector('#edittaskName');
    let editTaskDescIp = document.querySelector('#edittaskDesc');
    let editselectProjectIp = document.querySelector('#editprojectForm');
    let editprioritySelectIp = document.querySelector('#editpriorityForm');
    let editdueDateIp = document.querySelector('#editdueDate');
    let editTaskForm = document.querySelector('#editTask');
    let editTaskFormCancel = document.querySelector('.closeeditTaskForm');

    return {
        startUpDisplay(){
            projects.forEach((project)=>{
                if(project[0]!='Inbox'){
                    this.addProjectToDiv(project);
                }
            });
            inboxBtn.addEventListener('click',()=>{
                this.displayToDoByProject('Inbox');
            });
            todayBtn.addEventListener('click',()=>{
                this.displayToday();
            });
            thisWeekBtn.addEventListener('click',()=>{
                this.displayThisWeek();
            });
            this.displayToday();
        },
        removeProjectFromDiv(projectId){
            let someProjects = [];
            for(let i = 0;i<projects.length;i++){
                if(projects[i][1] != projectId){
                    someProjects.push(projects[i]);
                }
            }
            storageObj.removeProjectFromStorage(projectId);
            changeProjects(someProjects);
            let projectDiv = document.getElementsByClassName(projectId);
            projectDiv[0].remove();
        },
        getProjectNameById(projectId){
            for(let i = 0; i<projects.length;i++){
                if(projects[i][1]==projectId){
                    return projects[i][0];
                }
            }
            return "Inbox";
        },
        removeToDoByProject(projectName){
            let todoWithProject = taskUtilObj.findWithProject(projectName,tasks);
            console.log(`Todo Project to delete ${todoWithProject}`);
            todoWithProject.forEach((task)=>{
                console.log(task.id);
                storageObj.removeTasks(task.id);
            })
            let currenttaskList = tasks;
            let filteredTasks = taskUtilObj.deleteTasksByProjectName(currenttaskList,projectName);
            changeTasks(filteredTasks);
            this.displayToday();
        },
        addProjectToDiv(projectArr){
            let projectParentDiv = document.createElement('div');
            let projectParentDivClassList = [projectArr[1].toString(),'flex','items-center', 'justify-between', 'rounded'];
            projectParentDivClassList.forEach((pc)=>{
                projectParentDiv.classList.add(pc);
            });
            let projectsFolderImgDiv = document.createElement('div');
            let projectsFolderImgDivClassList = [projectArr[1].toString(),'projects-name-image-div', 'flex', 'items-center', 'hover:bg-green-800', 'hover:font-bold', 'active:bg-green-800', 'rounded','hover:w-[80%]','hover:cursor-pointer'];
            projectsFolderImgDivClassList.forEach((cs)=>{
                projectsFolderImgDiv.classList.add(cs);
            });
            projectsFolderImgDiv.addEventListener('click',(e)=>{
                let projectName = this.getProjectNameById(e.target.classList[0].toString());
                this.displayToDoByProject(projectName);
            })
            let folderImg = document.createElement('img');
            folderImg.setAttribute('width','24');
            folderImg.setAttribute('height','24');
            folderImg.setAttribute('src','https://img.icons8.com/ios-glyphs/24/FFFFFF/folder-invoices--v1.png');
            folderImg.setAttribute('alt-text','folder-invoices--v1');
            let spanProjectName = document.createElement('span');
            let spanProjectNameClassList = [projectArr[1].toString(),'py-2', 'px-1', 'truncate'];
            spanProjectNameClassList.forEach((cs)=>{
                spanProjectName.classList.add(cs);
            });
            spanProjectName.innerText = projectArr[0];
            projectsFolderImgDiv.appendChild(folderImg);
            projectsFolderImgDiv.appendChild(spanProjectName);
            let deleteFolderImg = document.createElement('img');
            deleteFolderImg.setAttribute('width','24');
            deleteFolderImg.setAttribute('height','24');
            deleteFolderImg.setAttribute('title',"Delete Project");
            deleteFolderImg.setAttribute('src','https://img.icons8.com/fluency-systems-filled/24/FFFFFF/filled-trash.png');
            deleteFolderImg.setAttribute('alt-text','filled-trash');
            let deleteFolderImgClassList = [projectArr[1].toString(), 'hover:w-[28px]', 'hover:h-[28px]','deleteProjectImg'];
            deleteFolderImgClassList.forEach((cs)=>{
                deleteFolderImg.classList.add(cs);
            });
            deleteFolderImg.addEventListener('click',(e)=>{
                this.removeProjectFromDiv(e.target.classList[0].toString());
                this.removeToDoByProject(projectArr[0].toString());
            })
            projectParentDiv.appendChild(projectsFolderImgDiv);
            projectParentDiv.appendChild(deleteFolderImg);
            projectsDiv.appendChild(projectParentDiv);
        },
        changeProjectNameOnDiv(projectName){
            projectNameSpan.innerHTML = projectName;
        },
        displayToDoByProject(projectName){
            let currentTodoList = tasks;
            console.log(`Received Current Tasks ${currentTodoList}`);
            if(projectName == 'Inbox'){
                this.changeProjectNameOnDiv(projectName);
            }
            else{
                this.changeProjectNameOnDiv("Project: "+projectName);
            }
            let projectTodoList = taskUtilObj.findWithProject(projectName,currentTodoList);
            let sortedTodoList = taskUtilObj.sortDates(projectTodoList);
            console.log(`Sorted ToDoList ${sortedTodoList}`);
            toDoTotalListDiv.innerHTML = '';
            sortedTodoList.forEach((todolist)=>{
                this.createToDoListDiv(todolist);
            });
            spanProjectNumber.innerText = sortedTodoList.length;
        },
        createToDoListDiv(taskInfo){
            let toDoListDiv = document.createElement('div');
            let toDoListDivClasses = [taskInfo.id.toString(),"overflow-none","card", "w-[360px]", "h-[101px]", 'flex', 'flex-row', 'flex-wrap', 'lg:flex-nowrap', 'lg:h-[75px]', 'lg:flex', 'lg:flex-row', 'lg:w-[840px]', 'lg:min-w-[825px]', 'bg-[#333333]', 'drop-shadow-xl', 'lg:hover:w-[842px]', 'lg:rounded-xl'];
            toDoListDivClasses.forEach((cs)=>{
                toDoListDiv.classList.add(cs);
            });
            let taskPriorityDiv = document.createElement('div');
            let taskPriorityDivClassList = ['priority', 'h-[5%]', 'w-[100%]', 'lg:h-[100%]', 'lg:w-[2%]', 'lg:rounded-xl'];
            taskPriorityDivClassList.forEach((cs)=>{
                taskPriorityDiv.classList.add(cs);
            });
            if(taskInfo.priority == 1){
                taskPriorityDiv.classList.add('bg-red-800');
            }
            else if(taskInfo.priority == 2){
                taskPriorityDiv.classList.add('bg-yellow-600');
            }
            else if(taskInfo.priority == 3){
                taskPriorityDiv.classList.add('bg-sky-600');
            }
            let checkBoxDiv = document.createElement('div');
            let checkBoxDivClassList = ['check-box', 'h-[55%]', 'w-[13%]', 'lg:h-[100%]', 'flex', 'items-center', 'justify-center', 'lg:w-[10%]'];
            checkBoxDivClassList.forEach((cs)=>{
                checkBoxDiv.classList.add(cs);
            });
            let checkBoxInput = document.createElement('input');
            let checkBoxInputClassList = [taskInfo.id.toString(),'lg:w-[25px]', 'lg:h-[25px]', "accent-green-800", "lg:text-[14px]"];
            checkBoxInputClassList.forEach((cs)=>{
                checkBoxInput.classList.add(cs);
            });
            checkBoxInput.setAttribute('type','checkbox');
            checkBoxInput.setAttribute('id','checkbox');
            checkBoxInput.setAttribute('name','completion');
            checkBoxInput.addEventListener('click',(e)=>{
                this.deleteTaskById(e.target.classList[0].toString());
            });
            checkBoxDiv.appendChild(checkBoxInput);
            let titleTaskDiv = document.createElement('div');
            let titleTaskDivClassList = ["title-text", "h-[55%]", "w-[75%]", "lg:h-[100%]", "lg:w-[40%]", "flex", "flex-col", "justify-center", "lg:gap-2"];
            titleTaskDivClassList.forEach((cs)=>{
                titleTaskDiv.classList.add(cs);
            });
            let titleDiv = document.createElement('div');
            let titleDivClassList = ["task-title", "text-sm", "w-[100%]", "lg:w-[70%]", "text-white", "lg:text-lg", "lg:font-medium", "truncate"]
            titleDivClassList.forEach((cs)=>{
                titleDiv.classList.add(cs);
            });
            let titleTextDiv = document.createElement('div');
            let titltTextDivClassList = ["text-sm", "task-desc", "w-[100%]", "text-white", "lg:w-[90%]", "truncate"]
            titltTextDivClassList.forEach((cs)=>{
                titleTextDiv.classList.add(cs);
            });
            titleDiv.innerText = taskInfo.name;
            titleTextDiv.innerText = taskInfo.desc;
            titleTaskDiv.appendChild(titleDiv);
            titleTaskDiv.appendChild(titleTextDiv);
            let projectDueDiv = document.createElement('div');
            let projectDueDivClassList = ["project-due", "h-[40%]", "w-[70%]", "lg:h-[100%]", "lg:w-[30%]", "flex", "flex-row", "justify-center", "items-start", "gap-2", "lg:flex-col", "text-white", "lg:justify-center", "lg:gap-2"];
            projectDueDivClassList.forEach((cs)=>{
                projectDueDiv.classList.add(cs);
            });
            let projectNameDiv = document.createElement('div');
            let projectNameDivClassList = ["project-name", "text-sm", "rounded", "w-[45%]", "lg:w-[80%]" ];
            projectNameDivClassList.forEach((cs)=>{
                projectNameDiv.classList.add(cs);
            });
            let projectNameP = document.createElement('p');
            let projectNamePClassList = ["border-2", "border-green-800", "rounded-lg", "px-1", "bg-green-100", "text-black", "truncate", "max-w-[150px]","w-fit"];
            projectNamePClassList.forEach((cs)=>{
                projectNameP.classList.add(cs);
            });
            projectNameP.innerText = taskInfo.project;
            projectNameDiv.appendChild(projectNameP);
            let dueDateDiv = document.createElement('div');
            let dueDateDivClassList = ["due-date", "text-sm", "lg:text-lg", "lg:font-medium", "flex", "lg:gap-1", "items-center"];
            dueDateDivClassList.forEach((cs)=>{
                dueDateDiv.classList.add(cs);
            });
            let dueDateImg = document.createElement('img');
            let dueDateImgClassList = ["h-[10px]", "w-[10px]", "lg:h-[16px]", "lg:w-[16px]"];
            dueDateImgClassList.forEach((cs)=>{
                dueDateImg.classList.add(cs);
            });
            dueDateImg.setAttribute('height','16');
            dueDateImg.setAttribute('width','16');
            dueDateImg.setAttribute('src','https://img.icons8.com/officexs/16/calendar.png');
            dueDateImg.setAttribute('alt','A calender Icon');
            let dueDateSpan = document.createElement('span');
            let dueDate = taskInfo.date;
            dueDateSpan.innerText = "Due "+ format(parseISO(dueDate),"do MMM");
            dueDateDiv.appendChild(dueDateImg);
            dueDateDiv.appendChild(dueDateSpan);
            projectDueDiv.appendChild(projectNameDiv);
            projectDueDiv.appendChild(dueDateDiv);
            let deleteResetBtnDiv = document.createElement('div');
            let deleteResetBtnDivClassList = ["delete-reset", "w-[18%]", "flex", "gap-2", "lg:items-center", "items-start", "justify-evenly", "lg:justify-evenly", "space-x-2"];
            deleteResetBtnDivClassList.forEach((cs)=>{
                deleteResetBtnDiv.classList.add(cs);
            });
            let editIconDiv = document.createElement('div');
            let editIconDivClassList = [taskInfo.id.toString(),"edit-icon"];
            editIconDivClassList.forEach((cs)=>{
                editIconDiv.classList.add(cs);
            });
            let createImg = document.createElement('img');
            let createImgClassList = ["lg:h-[35px]", "lg:w-[35px]", "lg:hover:h-[40px]", "lg:hover:w-[40px]", "h-[25px]", "w-[25px]", "hover:h-[30px]", "hover:w-[30px]"];
            createImgClassList.forEach((cs)=>{
                createImg.classList.add(cs);
            });
            createImg.setAttribute('width','35');
            createImg.setAttribute('height','35');
            createImg.setAttribute('title','Edit Task');
            createImg.setAttribute('src','https://img.icons8.com/ios-glyphs/35/FFFFFF/edit--v1.png');
            createImg.setAttribute('alt','edit--v1');
            editIconDiv.appendChild(createImg);
            createImg.addEventListener('click',()=>{
                this.editTask(taskInfo.id);
            })
            let deleteIconDiv = document.createElement('div');
            let deleteIconDivClassList = [taskInfo.id.toString(),"delete-icon"];
            deleteIconDivClassList.forEach((cs)=>{
                deleteIconDiv.classList.add(cs);
            });
            let deleteIconImg = document.createElement('img');
            let deleteIconImgClassList = ["lg:h-[35px]", "lg:w-[35px]", "lg:hover:h-[40px]", "lg:hover:w-[40px]", "h-[25px]", "w-[25px]", "hover:h-[30px]", "hover:w-[30px]"];
            deleteIconImgClassList.forEach((cs)=>{
                deleteIconImg.classList.add(cs);
            });
            deleteIconImg.addEventListener('click',()=>{
                this.deleteTaskById(taskInfo.id);
            })
            deleteIconImg.setAttribute('src','https://img.icons8.com/fluency-systems-filled/35/FFFFFF/filled-trash.png');
            deleteIconImg.setAttribute('alt','filled-trash');
            deleteIconImg.setAttribute('width','35');
            deleteIconImg.setAttribute('height','35');
            deleteIconImg.setAttribute('title','Delete Task');
            deleteIconDiv.appendChild(deleteIconImg);
            deleteResetBtnDiv.appendChild(editIconDiv);
            deleteResetBtnDiv.appendChild(deleteIconDiv);
            toDoListDiv.appendChild(taskPriorityDiv);
            toDoListDiv.appendChild(checkBoxDiv);
            toDoListDiv.appendChild(titleTaskDiv);
            toDoListDiv.appendChild(projectDueDiv);
            toDoListDiv.appendChild(deleteResetBtnDiv);
            toDoTotalListDiv.appendChild(toDoListDiv);
        },
        displayToday(){
            let currentTodoList = tasks;
            this.changeProjectNameOnDiv('Today');
            let todaysDate = format(new Date(),'yyyy-MM-dd');
            let projectTodoList = taskUtilObj.tasksWithDate(currentTodoList,todaysDate);
            let sortedTodoList = taskUtilObj.sortPriority(projectTodoList);
            console.log(`Sorted ToDoList for Today ${sortedTodoList}`);
            toDoTotalListDiv.innerHTML = '';
            sortedTodoList.forEach((todolist)=>{
                this.createToDoListDiv(todolist);
            });
            spanProjectNumber.innerText = sortedTodoList.length;
        },
        displayThisWeek(){
            let currentTodoList = tasks;
            this.changeProjectNameOnDiv('This Week');
            let finalToDoList = [];
            for(let i = 0;i<8;i++){
                let tempDate = format(addDays(new Date(),i),'yyyy-MM-dd');
                let tempTask = taskUtilObj.tasksWithDate(currentTodoList,tempDate);
                let tempPTask = taskUtilObj.sortPriority(tempTask);
                finalToDoList = finalToDoList.concat(tempPTask);
            }
            console.log(`Final List of ToDo for Week ${finalToDoList}`);
            toDoTotalListDiv.innerHTML = '';
            finalToDoList.forEach((currtask)=>{
                this.createToDoListDiv(currtask);
            });
            spanProjectNumber.innerText = finalToDoList.length;
        },
        deleteTaskById(taskId){
            storageObj.removeTasks(taskId);
            let currentTasks = tasks;
            let filteredTasks = taskUtilObj.deleteTasksById(currentTasks,taskId);
            changeTasks(filteredTasks);
            let currentDisplayProject = projectNameSpan.innerText;
            if(currentDisplayProject == 'Inbox'){
                this.displayToDoByProject('Inbox');
            }
            else if(currentDisplayProject == "This Week"){
                this.displayThisWeek();
            }
            else if(currentDisplayProject == "Today"){
                this.displayToday();
            }
            else{
                let cp = currentDisplayProject.substr(9);
                this.displayToDoByProject(cp);
            }
        },
        editTask(taskId){
            tasks.forEach((task)=>{
                task.printAll();
            })
            let currentTask = taskUtilObj.findWithId(tasks,taskId);
            console.log(taskId);
            console.log(currentTask.name);
            editTaskDescIp.value = currentTask.desc;
            editTaskNameIp.value = currentTask.name;
            editselectProjectIp.innerHTML = '';
            for(let i = 0;i<projects.length;i++){
                if(currentTask.project == projects[i][0]){
                    editselectProjectIp.options[editselectProjectIp.options.length] = new Option(projects[i][0],projects[i][0],false,true);
                }
                else{
                    editselectProjectIp.options[editselectProjectIp.options.length] = new Option(projects[i][0],projects[i][0],false,false);
                }
            }
            console.log('.editTask-'+currentTask.priority);
            let currentOption = document.querySelector('.editTask-'+currentTask.priority);
            currentOption.setAttribute('selected','');
            editdueDateIp.value = currentTask.date;
            editTaskForm.addEventListener('submit',(e)=>{
                e.preventDefault();
                this.processEditTask(taskId);
                editTaskForm.reset();
                editTaskDialog.close();
            });
            editTaskFormCancel.addEventListener('click',(e)=>{
                e.preventDefault();
                editTaskForm.reset();
                editTaskDialog.close();
            });
            editTaskDialog.showModal();
        },
        processEditTask(taskId){
            let editTaskFromData = new FormData(editTaskForm);
            let newTask = task(editTaskFromData.get('edittaskName'),editTaskFromData.get('edittaskDesc'),editTaskFromData.get('editdueDate'),taskId,editprioritySelectIp.value,editselectProjectIp.value);
            storageObj.overRideTask(newTask);
            taskUtilObj.overRideTaskArray(newTask,tasks);
            let currentDisplayProject = projectNameSpan.innerText;
            if(currentDisplayProject == 'Inbox'){
                this.displayToDoByProject('Inbox');
            }
            else if(currentDisplayProject == "This Week"){
                this.displayThisWeek();
            }
            else if(currentDisplayProject == "Today"){
                this.displayToday();
            }
            else{
                let cp = currentDisplayProject.substr(9);
                this.displayToDoByProject(cp);
            }
        }
    }
}