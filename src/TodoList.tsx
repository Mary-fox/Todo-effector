import React from 'react';
import { useStore } from 'effector-react';
import { $todos, toggleTodo, removeTodo } from './store/index'; 

const TodoList: React.FC= () => {
  const todos = useStore($todos);

  return (
    <ul>
      {todos.map((todo) => (
        <li key={todo.id}>
          <input
            type="checkbox"
            checked={todo.completed}
            onChange={() => toggleTodo(todo.id)}
          />
          {todo.text}
          <button onClick={() => removeTodo(todo.id)}>Удалить</button>
        </li>
      ))}
    </ul>
  );
};

export default TodoList;