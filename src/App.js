import { useState, useEffect } from "react";
import { DragDropContext } from "react-beautiful-dnd";

import CardList from "./components/CardList";

import "./App.css";

function App() {
  const [data, setData] = useState({
    tasks: {},

    lists: {
      todo: { id: "todo", title: "To do", taskIds: [] },
      inprogress: { id: "inprogress", title: "In progress", taskIds: [] },
      archived: { id: "archived", title: "Archived", taskIds: [] },
    },
  });

  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const d = localStorage.getItem("data");
    if (d) {
      setData(JSON.parse(d));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("data", JSON.stringify(data));
  }, [data]);

  function onDragEnd(result) {
    console.log(result);
    const { destination, source, draggableId } = result;
    if (!destination) return;
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    if (destination.droppableId === source.droppableId) {
      const newTasksIds = data.lists[source.droppableId].taskIds;
      newTasksIds.splice(source.index, 1);
      newTasksIds.splice(destination.index, 0, draggableId);

      const newData = { ...data };
      newData.lists[source.droppableId].taskIds = newTasksIds;
      setData(newData);
    }

    if (destination.droppableId !== source.droppableId) {
      const sourceTaskIds = data.lists[source.droppableId].taskIds;
      sourceTaskIds.splice(source.index, 1);

      const destinationTaskIds = data.lists[destination.droppableId].taskIds;
      destinationTaskIds.splice(destination.index, 0, draggableId);

      const newData = { ...data };
      newData.lists[source.droppableId].taskIds = sourceTaskIds;
      newData.lists[destination.droppableId].taskIds = destinationTaskIds;
      setData(newData);
    }
  }

  function addCard(listId, title, description) {
    const newTask = {
      id: new Date().getTime().toString(),
      title: title,
      description: description,
    };

    const newData = { ...data };
    newData.tasks[newTask.id] = newTask;
    newData.lists[listId].taskIds.push(newTask.id);
    setData(newData);
  }

  function updateCard(id, title, description) {
    const newData = { ...data };
    newData.tasks[id].title = title;
    newData.tasks[id].description = description;
    setData(newData);
  }

  function deleteCard(id, listId) {
    const taskIds = data.lists[listId].taskIds.filter(
      (taskId) => taskId !== id
    );

    const newData = { ...data };
    newData.lists[listId].taskIds = taskIds;
    delete newData.tasks[id];
    setData(newData);
  }

  return (
    <div className="App">
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search..."
      />
      <div className="board">
        <DragDropContext onDragEnd={onDragEnd}>
          {Object.keys(data.lists).map((listId) => (
            <CardList
              key={listId}
              id={listId}
              title={data.lists[listId].title}
              className={listId}
              tasks={data.lists[listId].taskIds
                .map((id) => data.tasks[id])
                .filter(
                  (task) =>
                    task.title
                      .toLowerCase()
                      .includes(searchQuery.toLowerCase()) ||
                    task.description
                      .toLowerCase()
                      .includes(searchQuery.toLowerCase())
                )}
              addCard={addCard}
              updateCard={updateCard}
              deleteCard={deleteCard}
            />
          ))}
        </DragDropContext>
      </div>
    </div>
  );
}

export default App;
