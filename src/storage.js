export default function storageUtil(){
    return {
        getTasks(){
            let keys = localStorage.getItem('keys');
            if(keys == null){
                return [];
            }
            let taskinString = [];
            let taskIdList = keys.split(';');
            taskIdList.forEach((taskId)=>{
                let taskString = localStorage.getItem(taskId);
                if(taskString != null) {
                    taskinString.push(taskString);
                }
            });
            return taskinString;
        },
        removeTasks(taskId){
            localStorage.removeItem(taskId.toString());
            let currKeys = localStorage.getItem('keys').split(';');
            let delIdx = currKeys.indexOf(taskId.toString());
            if(delIdx==-1){
                return;
            }
            currKeys.splice(delIdx,1);
            let currKeyStr = "";
            if(currKeys.length!=0) {
                currKeyStr = currKeys[0];
                for(let i = 1;i<currKeys.length;i++){
                    currKeyStr = currKeyStr + ";" + currKeys[i];
                }
            }
            localStorage.setItem('keys','');
            localStorage.setItem('keys',currKeyStr);
            if(currKeyStr==""){
                localStorage.removeItem('keys');
            }
        },
        addTasks(task){
            let keys = localStorage.getItem('keys');
            if(keys == null){
                keys = "";
                keys = task.id;
                localStorage.setItem("keys",keys);
            }
            else{
                let keysSearch = keys.split(';');
                if(keysSearch.indexOf(task.id.toString()) === -1){
                    keys = keys + ";" + task.id;
                    localStorage.setItem("keys",keys);
                }
            }
            let taskString = task.name+";"+task.desc+";"+task.date+";"+task.priority+";"+task.project+";"+task.status+";"+task.id; 
            localStorage.setItem(task.id,taskString);
        },
        addMultipleTasks(taskList){
            taskList.forEach((task)=>{
                this.addTasks(task);
            });
        },
        getProjects(){
            let currProjectsStr = localStorage.getItem('projects');
            if(currProjectsStr==null){
                currProjectsStr = 'Inbox,0';
                localStorage.setItem('projects',currProjectsStr);
            }
            let currProjectsList = currProjectsStr.split(';');
            let currProjects = [];
            currProjectsList.forEach((projectStr)=>{
                let temp = projectStr.split(',');
                currProjects.push([temp[0],temp[1]]);
            });

            return currProjects;
        },
        addProjects(currproject){
            let currProjFromStorage = localStorage.getItem('projects');
            if(currProjFromStorage == null || currProjFromStorage==""){
                currProjFromStorage = "Inbox,0";
            }
            currProjFromStorage = currProjFromStorage +';'+currproject[0]+','+currproject[1];
            localStorage.setItem('projects',currProjFromStorage);
        },
        removeProjectFromStorage(projectId){
            let currentProjects = this.getProjects();
            let tempCurrProjects = [];
            for(let i = 0;i<currentProjects.length;i++){
                if(projectId!=currentProjects[i][1]){
                    tempCurrProjects.push(currentProjects[i]);
                }
            }
            localStorage.setItem('projects','');
            if(currentProjects.length == 0){
                return;
            }
            let currentProjectstr = tempCurrProjects[0][0]+','+tempCurrProjects[0][1];
            for(let i = 1;i<tempCurrProjects.length;i++){
                currentProjectstr = currentProjectstr +';'+tempCurrProjects[i][0]+','+tempCurrProjects[i][1];
            }
            localStorage.setItem('projects',currentProjectstr);
        },
        overRideTask(editTask){
            let taskStr = editTask.name+";"+editTask.desc+";"+editTask.date+";"+editTask.priority+";"+editTask.project+";"+editTask.status+";"+editTask.id; 
            localStorage.setItem(editTask.id,taskStr);
        }
    }
}