// Show current date
const dateEl = document.getElementById('date');
const today = new Date();
dateEl.textContent = today.toLocaleDateString('en-US', {
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: 'numeric'
});

// Elements
const input = document.getElementById('taskInput');
const addBtn = document.getElementById('addBtn');
const taskList = document.getElementById('taskList');

// Load tasks from localStorage
let tasks = JSON.parse(localStorage.getItem('todo-tasks')) || [];

// Render all tasks
function renderTasks() {
  taskList.innerHTML = '';
  
  tasks.forEach((task, index) => {
    const li = document.createElement('li');
    if (task.completed) li.classList.add('completed');
    
    li.innerHTML = `
      <input type="checkbox" ${task.completed ? 'checked' : ''}>
      <span>${task.text}</span>
      <button class="delete-btn">×</button>
    `;
    
    // Toggle complete
    li.querySelector('input').addEventListener('change', () => {
      tasks[index].completed = !tasks[index].completed;
      saveAndRender();
    });
    
    // Delete task
    li.querySelector('.delete-btn').addEventListener('click', () => {
      if (confirm('Delete this task?')) {
        tasks.splice(index, 1);
        saveAndRender();
      }
    });
    
    taskList.appendChild(li);
  });
}

// Save + re-render
function saveAndRender() {
  localStorage.setItem('todo-tasks', JSON.stringify(tasks));
  renderTasks();
}

// Add new task
function addTask() {
  const text = input.value.trim();
  if (!text) return;
  
  tasks.push({ text, completed: false });
  input.value = '';
  saveAndRender();
}

// Event listeners
addBtn.addEventListener('click', addTask);
input.addEventListener('keypress', e => {
  if (e.key === 'Enter') addTask();
});

// Initial render
renderTasks();
