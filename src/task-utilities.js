import { orderBy, filter, remove } from "lodash";
import task from "./task.js";
import { changeTasks } from "./index.js";

export default function taskUtil() {
  return {
    findWithProject(projectName, tasksList) {
      let projectWithTasks = filter(tasksList, ["project", projectName]);
      return projectWithTasks;
    },
    sortPriority(tasksList) {
      let sortedTaskList = orderBy(tasksList, ["priority"], "asc");
      return sortedTaskList;
    },
    sortDates(tasksList) {
      let sortedTaskList = orderBy(
        tasksList,
        ["date", "priority"],
        ["asc", "asc"]
      );
      return sortedTaskList;
    },
    findWithId(tasksList, taskId) {
      for (let i = 0; i < tasksList.length; i++) {
        if (tasksList[i].id == taskId) {
          return tasksList[i];
        }
      }
      return null;
    },
    tasksWithDate(tasksList, targetDate) {
      let taskListWithDate = filter(tasksList, ["date", targetDate]);
      return taskListWithDate;
    },
    createTasksFromStorage(taskStringList) {
      let taskList = [];
      if (taskStringList.length == 0) {
        return taskList;
      }
      taskStringList.forEach((eachTask) => {
        let taskString = eachTask.split(";");
        if (taskString.length != 0) {
          taskList.push(
            task(
              taskString[0],
              taskString[1],
              taskString[2],
              taskString[6],
              taskString[3],
              taskString[4],
              parseInt(taskString[5])
            )
          );
        }
      });
      return taskList;
    },
    deleteTask(tasks, taskId) {
      tasks = remove(tasks, (currentTask) => {
        if (currentTask.id == taskId) {
          return true;
        }
      });
      return tasks;
    },
    deleteTasksById(tasksList, taskId) {
      let filteredTasks = filter(tasksList, (task) => {
        return task.id != taskId;
      });
      return filteredTasks;
    },
    deleteTasksByProjectName(tasksList, projectName) {
      let filteredTasks = filter(tasksList, (o) => {
        return o.project != projectName;
      });
      return filteredTasks;
    },
    overRideTaskArray(newTask, taskList) {
      let newTaskList = taskList;
      for (let i = 0; i < newTaskList.length; i++) {
        if (newTaskList[i].id == newTask.id) {
          [newTaskList[i], newTask] = [newTask, newTaskList[i]];
        }
      }
      changeTasks(newTaskList);
    },
  };
}
