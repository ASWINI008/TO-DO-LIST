let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let editingId = null;

function toggleForm() {
  document.getElementById('taskForm').classList.toggle('show');
  clearForm();
}

    function addTask() {
      const title = document.getElementById('taskInput').value.trim();
      const note = document.getElementById('taskNote').value.trim();
      const time = document.getElementById('taskTime').value;
      const priority = document.getElementById('taskPriority').value;

      if (!title) return alert("Enter a task title");

      if (editingId) {
        const idx = tasks.findIndex(t => t.id === editingId);
        tasks[idx] = { ...tasks[idx], text: title, note, time, priority };
        editingId = null;
      } else {
        tasks.push({ id: Date.now(), text: title, note, time, priority, completed: false });
      }

      localStorage.setItem('tasks', JSON.stringify(tasks));
      renderTasks();
      toggleForm();
    }

    function renderTasks(filter = 'all') {
      const list = document.getElementById('taskList');
      list.innerHTML = '';
      const filtered = tasks.filter(t =>
        filter === 'all' ? true : filter === 'completed' ? t.completed : !t.completed
      );

      filtered.forEach(task => {
        const div = document.createElement('div');
        div.className = `task ${task.completed ? 'completed' : ''}`;
        div.innerHTML = `
          <strong>${task.text}</strong><br>
          <small>${task.note || ''}</small><br>
          <small>Due: ${task.time || 'No date'}</small><br>
          <span class="priority ${task.priority}">${task.priority}</span>
          <div class="task-actions">
            <button onclick="toggleComplete(${task.id})">✔️</button>
            <button onclick="editTask(${task.id})">✏️</button>
            <button onclick="deleteTask(${task.id})">🗑️</button>
          </div>
        `;
        list.appendChild(div);
      });

      updateProgress();
    }

    function toggleComplete(id) {
      tasks = tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t);
      localStorage.setItem('tasks', JSON.stringify(tasks));
      renderTasks();
    }

    function deleteTask(id) {
      tasks = tasks.filter(t => t.id !== id);
      localStorage.setItem('tasks', JSON.stringify(tasks));
      renderTasks();
    }

    function editTask(id) {
      const task = tasks.find(t => t.id === id);
      editingId = id;
      document.getElementById('taskInput').value = task.text;
      document.getElementById('taskNote').value = task.note || '';
      document.getElementById('taskTime').value = task.time || '';
      document.getElementById('taskPriority').value = task.priority || 'low';
      document.getElementById('taskForm').classList.add('show');
    }

    function updateProgress() {
      const total = tasks.length;
      const done = tasks.filter(t => t.completed).length;
      const percent = total ? Math.round((done / total) * 100) : 0;
      document.getElementById('progressFill').style.width = percent + '%';
    }

    function filterTasks(type) {
      renderTasks(type);
    }

    function clearForm() {
      document.getElementById('taskInput').value = '';
      document.getElementById('taskNote').value = '';
      document.getElementById('taskTime').value = '';
      document.getElementById('taskPriority').value = 'low';
    }

    renderTasks();