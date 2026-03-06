// 日期顯示
const dateEl = document.getElementById('date');
const today = new Date();
dateEl.textContent = today.toLocaleDateString('zh-TW', {
  weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
});

// 元素
const input = document.getElementById('taskInput');
const addBtn = document.getElementById('addBtn');
const taskList = document.getElementById('taskList');

// 從 localStorage 讀取
let tasks = JSON.parse(localStorage.getItem('ro-todo-tasks')) || [];

// 渲染所有任務
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
    
    // 點擊 checkbox 切換完成狀態
    li.querySelector('input').addEventListener('change', () => {
      tasks[index].completed = !tasks[index].completed;
      saveAndRender();
    });
    
    // 刪除
    li.querySelector('.delete-btn').addEventListener('click', () => {
      if (confirm('確定要刪除嗎？')) {
        tasks.splice(index, 1);
        saveAndRender();
      }
    });
    
    taskList.appendChild(li);
  });
}

// 儲存 + 重新渲染
function saveAndRender() {
  localStorage.setItem('ro-todo-tasks', JSON.stringify(tasks));
  renderTasks();
}

// 新增任務
function addTask() {
  const text = input.value.trim();
  if (!text) return;
  
  tasks.push({ text, completed: false });
  input.value = '';
  saveAndRender();
}

// 事件綁定
addBtn.addEventListener('click', addTask);
input.addEventListener('keypress', e => {
  if (e.key === 'Enter') addTask();
});

// 第一次載入
renderTasks();
