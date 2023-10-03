import React, { useState } from 'react';
import TodoList from './TodoList';

import {addTodo } from './store';

const Todo: React.FC = () => {
    const [newTodo, setNewTodo] = useState('');

    const handleAddTodo = () => {
      if (newTodo.trim() !== '') {
        addTodo(newTodo);
        setNewTodo('');
      }
    };
   return (
    <div>
      <h1>Моя тудушка</h1>
      <div>
      <input
        type="text"
        placeholder="Создать новую задачу"
        value={newTodo}
        onChange={(e) => setNewTodo(e.target.value)}
      />
      <button onClick={handleAddTodo}>Добавить</button>
    </div>
      <TodoList /> 
    </div>
  );
};
export default Todo;