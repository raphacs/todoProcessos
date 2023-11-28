import React from 'react'

const Todo = ({todo, removeTodo, completeTodo}) => {
  return (
    <div className="todo" style={{textDecoration: todo.isCompleted ? "line-through" : ""}}>
        <div className="content">
            <p>{todo.processo}</p>
            <p>{todo.contribuidor}</p>
            <p>{todo.data}</p>
        </div>
        <div>
            <button className="complete" onClick={() =>completeTodo(todo.processo)}>Completar</button>
            <button className="remove" onClick={() =>removeTodo(todo.processo)}>Deletar</button>
        </div>
    </div>
  )
}

export default Todo