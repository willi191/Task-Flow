const API_URL = '/api/tasks';

const taskForm = document.querySelector('#taskForm');
const taskIdInput = document.querySelector('#taskId');
const taskTitleInput = document.querySelector('#taskTitle');
const taskDescriptionInput = document.querySelector('#taskDescription');
const taskPriorityInput = document.querySelector('#taskPriority');
const taskDateInput = document.querySelector('#taskDate');
const submitButton = document.querySelector('#submitButton');
const cancelEditButton = document.querySelector('#cancelEdit');
const taskList = document.querySelector('#taskList');
const emptyState = document.querySelector('#emptyState');
const listSummary = document.querySelector('#listSummary');
const searchInput = document.querySelector('#searchInput');
const filterButtons = document.querySelectorAll('.filter-button');
const focusAddTaskButton = document.querySelector('#focusAddTask');
const loginScreen = document.querySelector('#loginScreen');
const appContent = document.querySelector('#appContent');
const loginForm = document.querySelector('#loginForm');
const loginUsername = document.querySelector('#loginUsername');
const loginPassword = document.querySelector('#loginPassword');
const loginError = document.querySelector('#loginError');
const logoutButton = document.querySelector('#logoutButton');

let tasks = [];
let currentFilter = 'all';

async function request(url, options = {}) {
  const response = await fetch(url, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    throw new Error(errorBody.errors?.join(' ') || errorBody.error || 'No se pudo completar la solicitud.');
  }

  return response.status === 204 ? null : response.json();
}

async function loadTasks() {
  try {
    tasks = await request(API_URL);
    renderTasks();
  } catch (error) {
    showError(error.message);
  }
}

function showApp() {
  loginScreen.classList.add('hidden');
  appContent.classList.remove('hidden');
  loadTasks();
}

function showLogin() {
  appContent.classList.add('hidden');
  loginScreen.classList.remove('hidden');
  loginUsername.focus();
}

function showError(message) {
  taskList.innerHTML = `<div class="api-error">${escapeHtml(message)}<br><small>Verifica que el servidor esté ejecutándose.</small></div>`;
  taskList.classList.remove('hidden');
  emptyState.classList.add('hidden');
}

function formatDate(dateValue) {
  if (!dateValue) return 'Sin fecha límite';
  const date = new Date(`${dateValue}T00:00:00`);
  return new Intl.DateTimeFormat('es-CO', { day: 'numeric', month: 'short', year: 'numeric' }).format(date);
}

function escapeHtml(text = '') {
  const element = document.createElement('div');
  element.textContent = text;
  return element.innerHTML;
}

function getVisibleTasks() {
  const searchTerm = searchInput.value.trim().toLowerCase();

  return tasks
    .filter((task) => {
      if (currentFilter === 'pending') return !task.completed;
      if (currentFilter === 'completed') return task.completed;
      return true;
    })
    .filter((task) => `${task.title} ${task.description}`.toLowerCase().includes(searchTerm))
    .sort((first, second) => {
      if (first.completed !== second.completed) return first.completed ? 1 : -1;
      return new Date(second.createdAt) - new Date(first.createdAt);
    });
}

function renderTasks() {
  const visibleTasks = getVisibleTasks();
  taskList.innerHTML = '';

  visibleTasks.forEach((task) => {
    const item = document.createElement('article');
    item.className = `task-item ${task.completed ? 'completed' : ''}`;
    item.innerHTML = `
      <input class="task-check" type="checkbox" data-action="toggle" data-id="${task.id}"
        ${task.completed ? 'checked' : ''} aria-label="Marcar ${escapeHtml(task.title)} como completada" />
      <div>
        <h4 class="task-title">${escapeHtml(task.title)}</h4>
        ${task.description ? `<p class="task-description">${escapeHtml(task.description)}</p>` : ''}
        <div class="task-meta">
          <span class="priority priority-${task.priority}">${task.priority}</span>
          <span class="task-date">${formatDate(task.date)}</span>
        </div>
      </div>
      <div class="task-actions">
        <button class="icon-button" type="button" data-action="edit" data-id="${task.id}" aria-label="Editar tarea">Editar</button>
        <button class="icon-button delete" type="button" data-action="delete" data-id="${task.id}" aria-label="Eliminar tarea">Eliminar</button>
      </div>
    `;
    taskList.appendChild(item);
  });

  const hasTasks = visibleTasks.length > 0;
  taskList.classList.toggle('hidden', !hasTasks);
  emptyState.classList.toggle('hidden', hasTasks);
  listSummary.textContent = tasks.length === 0
    ? 'Todavía no tienes actividades registradas.'
    : `${visibleTasks.length} tarea${visibleTasks.length === 1 ? '' : 's'} visible${visibleTasks.length === 1 ? '' : 's'}.`;
  updateStats();
}

function updateStats() {
  const completed = tasks.filter((task) => task.completed).length;
  document.querySelector('#totalTasks').textContent = tasks.length;
  document.querySelector('#pendingTasks').textContent = tasks.length - completed;
  document.querySelector('#completedTasks').textContent = completed;
}

function resetForm() {
  taskForm.reset();
  taskIdInput.value = '';
  taskPriorityInput.value = 'media';
  submitButton.textContent = 'Agregar tarea';
  cancelEditButton.classList.add('hidden');
}

function startEdit(task) {
  taskIdInput.value = task.id;
  taskTitleInput.value = task.title;
  taskDescriptionInput.value = task.description;
  taskPriorityInput.value = task.priority;
  taskDateInput.value = task.date;
  submitButton.textContent = 'Guardar cambios';
  cancelEditButton.classList.remove('hidden');
  taskTitleInput.focus();
}

taskForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const title = taskTitleInput.value.trim();
  if (!title) return;

  const taskData = {
    title,
    description: taskDescriptionInput.value.trim(),
    priority: taskPriorityInput.value,
    date: taskDateInput.value,
  };

  try {
    const id = taskIdInput.value;
    if (id) {
      const updatedTask = await request(`${API_URL}/${id}`, { method: 'PUT', body: JSON.stringify(taskData) });
      tasks = tasks.map((task) => task.id === id ? updatedTask : task);
    } else {
      const newTask = await request(API_URL, { method: 'POST', body: JSON.stringify(taskData) });
      tasks.unshift(newTask);
    }
    resetForm();
    renderTasks();
  } catch (error) {
    showError(error.message);
  }
});

taskList.addEventListener('click', async (event) => {
  const actionButton = event.target.closest('[data-action]');
  if (!actionButton) return;
  const { action, id } = actionButton.dataset;
  const task = tasks.find((item) => item.id === id);
  if (!task) return;

  if (action === 'edit') startEdit(task);

  if (action === 'delete') {
    if (!window.confirm(`¿Deseas eliminar la tarea "${task.title}"?`)) return;
    try {
      await request(`${API_URL}/${id}`, { method: 'DELETE' });
      tasks = tasks.filter((item) => item.id !== id);
      renderTasks();
    } catch (error) {
      showError(error.message);
    }
  }
});

taskList.addEventListener('change', async (event) => {
  if (event.target.dataset.action !== 'toggle') return;
  const id = event.target.dataset.id;
  try {
    const updatedTask = await request(`${API_URL}/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ completed: event.target.checked }),
    });
    tasks = tasks.map((task) => task.id === id ? updatedTask : task);
    renderTasks();
  } catch (error) {
    showError(error.message);
  }
});

filterButtons.forEach((button) => {
  button.addEventListener('click', () => {
    currentFilter = button.dataset.filter;
    filterButtons.forEach((item) => item.classList.toggle('active', item === button));
    renderTasks();
  });
});

searchInput.addEventListener('input', renderTasks);
cancelEditButton.addEventListener('click', resetForm);
focusAddTaskButton.addEventListener('click', () => {
  document.querySelector('#tareas').scrollIntoView({ behavior: 'smooth' });
  setTimeout(() => taskTitleInput.focus(), 350);
});

loginForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  loginError.classList.add('hidden');

  try {
    await request('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        username: loginUsername.value.trim(),
        password: loginPassword.value,
      }),
    });
    loginForm.reset();
    showApp();
  } catch (error) {
    loginError.textContent = error.message;
    loginError.classList.remove('hidden');
  }
});

logoutButton.addEventListener('click', async () => {
  await request('/api/auth/logout', { method: 'POST' });
  tasks = [];
  renderTasks();
  showLogin();
});

request('/api/auth/me')
  .then(() => showApp())
  .catch(() => showLogin());
