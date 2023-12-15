export default function task(
  name,
  desc,
  date,
  id,
  priority = 4,
  project = "inbox",
  status = 0
) {
  return {
    get name() {
      return name;
    },
    get desc() {
      return desc;
    },
    get date() {
      return date;
    },
    get priority() {
      return priority;
    },
    get project() {
      return project;
    },
    get status() {
      return status;
    },
    get id() {
      return id;
    },
    editTask(
      taskName,
      taskDesc,
      taskDate,
      taskId,
      taskPriority = 4,
      taskProject = "Inbox",
      taskStatus = 0
    ) {
      name = taskName;
      desc = taskDesc;
      id = taskId;
      priority = taskPriority;
      project = taskProject;
      date = taskDate;
      status = taskStatus;
    },
    completeTask() {
      status = 1;
    },
    isCompleted() {
      return status === 1;
    },
    printAll() {
      console.log(
        name +
          " " +
          desc +
          " " +
          date +
          " " +
          project +
          " " +
          priority +
          " " +
          id
      );
    },
  };
}
