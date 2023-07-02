import { useState } from "react";
import { Droppable } from "react-beautiful-dnd";

import Card from "./Card";

import "./CardList.css";

function CardList(props) {
  const [isAdding, setIsAdding] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");

  function handleAdd() {
    setIsAdding(true);
  }

  function handleSubmit(e) {
    e.preventDefault();
    props.addCard(props.id, newTitle, newDescription);
    setIsAdding(false);
    setNewTitle("");
    setNewDescription("");
  }

  function handleCancel() {
    setIsAdding(false);
    setNewTitle("");
    setNewDescription("");
  }

  function deleteCard(id) {
    props.deleteCard(id, props.id);
  }

  return (
    <div className="card-list">
      <h2 className="title-label">{props.title}</h2>
      <Droppable droppableId={props.id}>
        {(provided) => (
          <div
            className="card-area"
            {...provided.droppableProps}
            ref={provided.innerRef}
          >
            {isAdding && (
              <form onSubmit={handleSubmit}>
                <div>
                  <input
                    type="text"
                    onChange={(e) => setNewTitle(e.target.value)}
                    value={newTitle}
                  />
                </div>
                <div>
                  <textarea
                    type="text"
                    onChange={(e) => setNewDescription(e.target.value)}
                    value={newDescription}
                  />
                </div>
                <div className="button-list">
                  <button type="submit">Confirm</button>
                  <button type="button" onClick={handleCancel}>
                    Cancel
                  </button>
                </div>
              </form>
            )}
            {props.tasks.map((task, index) => (
              <Card
                key={task.id}
                id={task.id}
                index={index}
                title={task.title}
                description={task.description}
                updateCard={props.updateCard}
                deleteCard={deleteCard}
              />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
      <div className="add-button">
        <button onClick={handleAdd}>Add</button>
      </div>
    </div>
  );
}
export default CardList;
