import { createStore, createEvent, createEffect, sample } from 'effector';
type Todo = {
  id: number;
  text: string;
  completed: boolean;
};

const addTodo = createEvent<string>();
const removeTodo = createEvent<number>();
const toggleTodo = createEvent<number>();

// Эффект для сохранения данных о задачах в LocalStorage
const saveTodosFx = createEffect((todos: Todo[]) => {
    localStorage.setItem('todos', JSON.stringify(todos));
    return todos;
  });

// Хранилище для списка задач
const $todos = createStore<Todo[]>(loadTodosFromLocalStorage());

// Используем генератор уникальных id
let nextTodoId = 1;

$todos
  .on(addTodo, (todos, newText) => [
    ...todos,
    {
      id: nextTodoId++,
      text: newText,
      completed: false,
    },
  ])
  .on(removeTodo, (todos, id) => todos.filter((todo) => todo.id !== id))
  .on(toggleTodo, (todos, id) =>
    todos.map((todo) =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    )
  );


// Создаем событие для обновления состояния хранилища при успешном сохранении данных
const updateTodos = createEvent<Todo[]>();

// Связываем событие обновления с состоянием хранилища
$todos.on(updateTodos, (_, todos) => todos);

// Загрузка задач из LocalStorage
function loadTodosFromLocalStorage(): Todo[] {
  const storedTodos = localStorage.getItem('todos');
  return storedTodos ? JSON.parse(storedTodos) : [];
}

// Связываем событие сохранения с состоянием списка задач и событием обновления
sample({
  source: $todos,
  clock: saveTodosFx.doneData,
  target: updateTodos,
});

// Вызываем эффект сохранения при любых изменениях в $todos
$todos.watch((todos) => {
  saveTodosFx(todos);
});

export const TodoModel = {
  inputs: {
    addTodo,
    removeTodo,
    toggleTodo,
  },
  outputs: {
    $todos,
  },
};