import { createStore, createEvent, createEffect, sample } from 'effector';

// Создаем события
export const addTodo = createEvent<string>();
export const removeTodo = createEvent<number>();
export const toggleTodo = createEvent<number>();

// Создаем эффект для сохранения данных о задачах в LocalStorage
const saveTodosFx = createEffect((todos: Todo[]) => {
    localStorage.setItem('todos', JSON.stringify(todos));
    return todos;
  });

// Тип данных для задачи
type Todo = {
  id: number;
  text: string;
  completed: boolean;
};

// Создаем хранилище для списка задач
export const $todos = createStore<Todo[]>(loadTodosFromLocalStorage());

// Используем генератор уникальных id
let nextTodoId = 1;

// Определяем логику изменения состояния хранилия при добавлении и удалении задач
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