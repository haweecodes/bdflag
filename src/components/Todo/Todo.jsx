import { useEffect, useState } from "react";
import "./Todo.css";

function Todo() {
  const [modalState, setModalState] = useState(false);
  const [TodoList, setTodoList] = useState(
    JSON.parse(localStorage.getItem("tasklist")) ?? []
  );
  const [ActiveList, setActiveList] = useState([]);
  const [DoneList, setDoneList] = useState([]);
  const [filterStatus, setFilterStatus] = useState("all");
  const [editIndex, setEditIndex] = useState(null);
  const [editTaskValue, setEditTaskValue] = useState("");
  const [editDescription, setEditDescription] = useState("");

  const [totalTask, setTotalTask] = useState(0);
  const [activeTask, setActiveTask] = useState(0);
  const [doneTask, setDoneTask] = useState(0);

  useEffect(() => {
    countStats(TodoList);

    return function cleanup() {
      localStorage.setItem("tasklist", JSON.stringify(TodoList));
    };
  }, [TodoList]);

  function clearList() {
    localStorage.removeItem("tasklist");
    setTodoList([]);
    setActiveList([]);
    setDoneList([]);
    countStats(TodoList);
  }

  function toggleModal(stateValue) {
    setModalState(stateValue);
    cleanEdit();
  }

  function submitTask(taskObject) {
    let tempTodoList = [...TodoList];

    if (editTaskValue !== "") {
      tempTodoList.splice(editIndex, 1, {
        title: taskObject.taskName,
        description: taskObject.description,
        status: "active",
      });
    } else {
      tempTodoList.push({
        title: taskObject.taskName,
        description: taskObject.description,
        status: "active",
      });
    }
    setTodoList(tempTodoList);

    countStats(tempTodoList);
    toggleModal(false);
  }

  function cleanEdit() {
    setEditTaskValue("");
    setEditDescription("");
    setEditIndex(null);
  }

  function changeFilter(e) {
    setFilterStatus(e.target.value);

    filterData(e.target.value);
  }

  function filterData(filterValue) {
    const tempList = TodoList.filter((task) => task.status === filterValue);
    if (filterValue === "active") setActiveList(tempList);
    if (filterValue === "done") setDoneList(tempList);
  }

  function taskToggle(index) {
    let tempList = TodoList;
    let task = tempList[index];
    if (task.status === "done") {
      task.status = "active";
      removeFromList(index, DoneList, setDoneList)
    } else {
      task.status = "done";
      removeFromList(index, ActiveList, setActiveList)
    }
    tempList.splice(index, 0);
    setTodoList(tempList);

    countStats(tempList);
  }
  function removeFromList(index, list, setList) {
    let tempList = list;
    tempList.splice(index, 1);
    setList(tempList);
  }

  function editModal(event, task, index) {
    event.stopPropagation();
    if (task.status === "done") return;
    toggleModal(true);
    setEditTaskValue(task.title);
    setEditDescription(task.description);
    setEditIndex(index);
  }

  function countStats(todolist) {
    let active = 0;
    let done = 0;
    let all = 0;

    todolist.forEach((task) => {
      if (task.status === "active") {
        active += 1;
      }
      if (task.status === "done") {
        done += 1;
      }
      all += 1;
    });

    setActiveTask(active);
    setDoneTask(done);
    setTotalTask(all);
  }

  return (
    <div className="todo-container">
      <div className="todo-details">
        <button id="new-button" onClick={() => toggleModal(true)}>
          CREATE NEW
        </button>
        <button id="clear-button" onClick={clearList}>
          CLEAR LIST
        </button>
        <select name="filter" id="filter" onChange={(e) => changeFilter(e)}>
          <option value="all">All</option>
          <option value="active">Active</option>
          <option value="done">Done</option>
        </select>
      </div>

      <div className="todo-stats">
        <p>Total: {totalTask}</p>
        <p>Active: {activeTask}</p>
        <p> Done: {doneTask}</p>
      </div>

      <ol>
        {filterStatus === "all" && (
          <ListItem
            list={TodoList}
            taskToggle={taskToggle}
            editModal={editModal}
          ></ListItem>
        )}
        {filterStatus === "active" && (
          <ListItem
            list={ActiveList}
            taskToggle={taskToggle}
            editModal={editModal}
          ></ListItem>
        )}
        {filterStatus === "done" && (
          <ListItem
            list={DoneList}
            taskToggle={taskToggle}
            editModal={editModal}
          ></ListItem>
        )}
      </ol>

      {modalState && (
        <Modal
          Task={editTaskValue}
          Description={editDescription}
          toggleModal={toggleModal}
          submitTask={submitTask}
        ></Modal>
      )}
    </div>
  );
}

function ListItem(props) {
  return props.list.map((task, i) => {
    return (
      <li key={i} onClick={() => props.taskToggle(i)}>
        <div className="task-item">
          <div>
            <p className={task.status}>Task: {task.title} </p>
            <p>Description: {task.description} </p>
          </div>
          {task.status !== "done" && (
            <button
              onClick={(event) => {
                props.editModal(event, task, i);
              }}
            >
              Edit
            </button>
          )}
        </div>
      </li>
    );
  });
}

function Modal(props) {
  const [taskName, setTaskName] = useState(props.Task);
  const [description, setDescription] = useState(props.Description);

  useEffect(() => {
    document.getElementById("todotask").value = taskName;
    document.getElementById("tododescription").value = description;
  });
  function addTask(e) {
    setTaskName(e.target.value);
  }
  function addDescription(e) {
    setDescription(e.target.value);
  }
  function submitTask() {
    if (taskName === "" || description === "") return;

    props.submitTask({ taskName, description });
  }
  return (
    <div className="modal-container">
      <div className="modal-content">
        <div className="close" onClick={() => props.toggleModal(false)}>
          &times;
        </div>
        <div className="modal-body">
          <input
            type="text"
            required
            placeholder="Task"
            name="todo-task"
            id="todotask"
            aria-label="Enter task"
            onKeyUp={(event) => addTask(event)}
          />
          <input
            type="text"
            required
            placeholder="Description"
            name="todo-description"
            id="tododescription"
            aria-label="Enter description"
            onKeyUp={(event) => addDescription(event)}
          />
          {props.Task && <button onClick={submitTask}>Edit Task</button>}
          {props.Task === "" && <button onClick={submitTask}>Add Task</button>}
        </div>
      </div>
    </div>
  );
}

export default Todo;
