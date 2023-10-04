import React from 'react';
import { useStore } from 'effector-react';
import { TodoModel } from './store/index';

const { inputs, outputs } = TodoModel;

const TodoList: React.FC= () => {
  const todos = useStore(outputs.$todos);
  const { removeTodo, toggleTodo } = inputs;

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