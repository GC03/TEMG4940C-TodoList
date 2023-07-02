import { useState } from "react";

import { Draggable } from "react-beautiful-dnd";

import "./Card.css";

function Card(props) {
  const [editTitle, setEditTitle] = useState(props.title);
  const [editDescription, setEditDescription] = useState(props.description);
  const [isEditing, setIsEditing] = useState(false);

  function handleCancel() {
    setIsEditing(false);
  }

  function handleEdit() {
    setIsEditing(true);
    setEditTitle(props.title);
    setEditDescription(props.description);
  }

  function handleConfirm() {
    props.updateCard(props.id, editTitle, editDescription);
    setIsEditing(false);
    setEditTitle("");
    setEditDescription("");
  }

  function handleDelete() {
    props.deleteCard(props.id);
  }

  return (
    <Draggable key={props.id} draggableId={props.id} index={props.index}>
      {(provided) => (
        <div
          className="card"
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
        >
          {isEditing ? (
            <input
              type="text"
              onChange={(e) => setEditTitle(e.target.value)}
              value={editTitle}
            />
          ) : (
            <h3>{props.title}</h3>
          )}

          {isEditing ? (
            <div>
              <textarea
                type="text"
                onChange={(e) => setEditDescription(e.target.value)}
                value={editDescription}
              />
            </div>
          ) : (
            <p>{props.description}</p>
          )}

          <div className="button-list">
            {isEditing ? (
              <button onClick={handleConfirm}>Confirm</button>
            ) : (
              <button onClick={handleEdit}>Edit</button>
            )}
            {isEditing ? (
              <button onClick={handleCancel}>Cancel</button>
            ) : (
              <button onClick={handleDelete}>Delete</button>
            )}
          </div>
        </div>
      )}
    </Draggable>
  );
}

export default Card;
