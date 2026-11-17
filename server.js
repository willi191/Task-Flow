const express = require('express');
const fs = require('fs/promises');
const path = require('path');
const crypto = require('crypto');

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_DIR = path.join(__dirname, 'data');
const DATA_FILE = path.join(DATA_DIR, 'tasks.json');

app.use(express.json());
app.use(express.static(__dirname));

async function ensureDataFile() {
  await fs.mkdir(DATA_DIR, { recursive: true });
  try {
    await fs.access(DATA_FILE);
  } catch {
    await fs.writeFile(DATA_FILE, '[]\n', 'utf8');
  }
}

async function readTasks() {
  await ensureDataFile();
  const content = await fs.readFile(DATA_FILE, 'utf8');
  return JSON.parse(content || '[]');
}

async function writeTasks(tasks) {
  await fs.writeFile(DATA_FILE, `${JSON.stringify(tasks, null, 2)}\n`, 'utf8');
}

function validateTask(body, partial = false) {
  const allowedPriorities = ['alta', 'media', 'baja'];
  const errors = [];

  if (!partial || body.title !== undefined) {
    if (typeof body.title !== 'string' || !body.title.trim()) {
      errors.push('El título es obligatorio.');
    } else if (body.title.trim().length > 80) {
      errors.push('El título no puede superar los 80 caracteres.');
    }
  }

  if (body.description !== undefined && typeof body.description !== 'string') {
    errors.push('La descripción debe ser texto.');
  }

  if (body.priority !== undefined && !allowedPriorities.includes(body.priority)) {
    errors.push('La prioridad debe ser alta, media o baja.');
  }

  if (body.date !== undefined && body.date !== '' && !/^\d{4}-\d{2}-\d{2}$/.test(body.date)) {
    errors.push('La fecha debe tener el formato YYYY-MM-DD.');
  }

  if (body.completed !== undefined && typeof body.completed !== 'boolean') {
    errors.push('El campo completed debe ser booleano.');
  }

  return errors;
}

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, message: 'TaskFlow API funcionando' });
});

app.get('/api/tasks', async (_req, res, next) => {
  try {
    const tasks = await readTasks();
    res.json(tasks);
  } catch (error) {
    next(error);
  }
});

app.post('/api/tasks', async (req, res, next) => {
  try {
    const errors = validateTask(req.body);
    if (errors.length) return res.status(400).json({ errors });

    const tasks = await readTasks();
    const task = {
      id: crypto.randomUUID(),
      title: req.body.title.trim(),
      description: typeof req.body.description === 'string' ? req.body.description.trim() : '',
      priority: req.body.priority || 'media',
      date: req.body.date || '',
      completed: false,
      createdAt: new Date().toISOString(),
    };

    tasks.unshift(task);
    await writeTasks(tasks);
    res.status(201).json(task);
  } catch (error) {
    next(error);
  }
});

app.put('/api/tasks/:id', async (req, res, next) => {
  try {
    const errors = validateTask(req.body, true);
    if (errors.length) return res.status(400).json({ errors });

    const tasks = await readTasks();
    const index = tasks.findIndex((task) => task.id === req.params.id);
    if (index === -1) return res.status(404).json({ error: 'Tarea no encontrada.' });

    const currentTask = tasks[index];
    const updatedTask = {
      ...currentTask,
      ...(req.body.title !== undefined && { title: req.body.title.trim() }),
      ...(req.body.description !== undefined && { description: req.body.description.trim() }),
      ...(req.body.priority !== undefined && { priority: req.body.priority }),
      ...(req.body.date !== undefined && { date: req.body.date }),
      ...(req.body.completed !== undefined && { completed: req.body.completed }),
      updatedAt: new Date().toISOString(),
    };

    tasks[index] = updatedTask;
    await writeTasks(tasks);
    res.json(updatedTask);
  } catch (error) {
    next(error);
  }
});

app.delete('/api/tasks/:id', async (req, res, next) => {
  try {
    const tasks = await readTasks();
    const taskExists = tasks.some((task) => task.id === req.params.id);
    if (!taskExists) return res.status(404).json({ error: 'Tarea no encontrada.' });

    const remainingTasks = tasks.filter((task) => task.id !== req.params.id);
    await writeTasks(remainingTasks);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

app.use((error, _req, res, _next) => {
  console.error(error);
  res.status(500).json({ error: 'Ocurrió un error interno en el servidor.' });
});

ensureDataFile()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`TaskFlow ejecutándose en http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error('No se pudo preparar el almacenamiento:', error);
    process.exit(1);
  });
