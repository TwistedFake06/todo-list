// 顯示日期
const dateEl = document.getElementById('date');
dateEl.textContent = new Date().toLocaleDateString('zh-TW', {
  weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
});

// 元素
const taskInput      = document.getElementById('taskInput');
const categorySelect = document.getElementById('categorySelect');
const dueDateInput   = document.getElementById('dueDateInput');
const addBtn         = document.getElementById('addBtn');
const taskList       = document.getElementById('taskList');
const exportBtn      = document.getElementById('exportBtn');
const importBtn      = document.getElementById('importBtn');
const fileInput      = document.getElementById('fileInput');

// 載入資料
let tasks = JSON.parse(localStorage.getItem('todo-tasks-2025')) || [];

// 渲染任務列表
function renderTasks() {
  taskList.innerHTML = '';

  // 未完成在上，已完成在下
  const sortedTasks = [
    ...tasks.filter(t => !t.completed),
    ...tasks.filter(t => t.completed)
  ];

  sortedTasks.forEach((task) => {
    const realIndex = tasks.indexOf(task);

    const li = document.createElement('li');
    li.draggable = true;
    li.dataset.index = realIndex;
    li.classList.add(task.category.toLowerCase());
    if (task.completed) li.classList.add('completed');

    const dueText = task.dueDate ? `截止：${task.dueDate}` : '';

    li.innerHTML = `
      <input type="checkbox" ${task.completed ? 'checked' : ''}>
      <div class="task-text">${task.text}</div>
      <div class="due-date">${dueText}</div>
      <button class="delete-btn">×</button>
    `;

    li.querySelector('input').addEventListener('change', () => {
      tasks[realIndex].completed = !tasks[realIndex].completed;
      saveAndRender();
    });

    li.querySelector('.delete-btn').addEventListener('click', (e) => {
      e.stopPropagation();
      if (confirm('確定刪除？')) {
        tasks.splice(realIndex, 1);
        saveAndRender();
      }
    });

    taskList.appendChild(li);
  });

  addDragAndDropListeners();
}

// 儲存 + 渲染
function saveAndRender() {
  localStorage.setItem('todo-tasks-2025', JSON.stringify(tasks));
  renderTasks();
}

// 新增任務
function addTask() {
  const text = taskInput.value.trim();
  if (!text) return;

  const category = categorySelect.value;
  const dueDate = dueDateInput.value || null;

  tasks.push({ text, category, dueDate, completed: false });

  taskInput.value = '';
  dueDateInput.value = '';
  saveAndRender();
}

// ────────────────
// 匯出功能
// ────────────────
exportBtn.addEventListener('click', () => {
  if (tasks.length === 0) {
    alert('目前沒有任務可匯出');
    return;
  }

  const dataStr = JSON.stringify(tasks, null, 2);
  const blob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = 'my-todo-backup.json';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
});

// ────────────────
// 匯入功能
// ────────────────
importBtn.addEventListener('click', () => {
  fileInput.click();
});

fileInput.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (event) => {
    try {
      const importedTasks = JSON.parse(event.target.result);
      
      // 簡單驗證：檢查是否為陣列，且每個項目有 text 屬性
      if (!Array.isArray(importedTasks) || importedTasks.some(t => !t || typeof t.text !== 'string')) {
        alert('檔案格式不正確，請選擇有效的備份 JSON 檔案');
        return;
      }

      if (confirm(`即將匯入 ${importedTasks.length} 個任務，會覆蓋目前所有資料，確定繼續？`)) {
        tasks = importedTasks;
        saveAndRender();
        alert('匯入成功！');
      }
    } catch (err) {
      alert('無法解析檔案：' + err.message);
    }
  };
  reader.readAsText(file);

  // 清空 input 以便下次選擇同一檔案
  e.target.value = '';
});

// ────────────────
// 拖拉排序邏輯（保持原有）
// ────────────────
let draggedItem = null;

function addDragAndDropListeners() {
  const items = taskList.querySelectorAll('li');

  items.forEach(item => {
    item.addEventListener('dragstart', () => {
      draggedItem = item;
      setTimeout(() => item.classList.add('dragging'), 0);
    });

    item.addEventListener('dragend', () => {
      setTimeout(() => item.classList.remove('dragging'), 0);
      draggedItem = null;
      items.forEach(i => i.classList.remove('over'));
      saveOrder();
    });

    item.addEventListener('dragover', (e) => {
      e.preventDefault();
      const after = getDragAfterElement(taskList, e.clientY);
      if (after == null) {
        taskList.appendChild(draggedItem);
      } else {
        taskList.insertBefore(draggedItem, after);
      }
      items.forEach(i => i.classList.remove('over'));
      if (after) after.classList.add('over');
    });

    item.addEventListener('touchstart', () => {
      draggedItem = item;
      item.classList.add('dragging');
    }, { passive: true });

    item.addEventListener('touchmove', (e) => {
      e.preventDefault();
      const touch = e.touches[0];
      const after = getDragAfterElement(taskList, touch.clientY);
      if (after == null) {
        taskList.appendChild(draggedItem);
      } else {
        taskList.insertBefore(draggedItem, after);
      }
    }, { passive: false });

    item.addEventListener('touchend', () => {
      item.classList.remove('dragging');
      draggedItem = null;
      items.forEach(i => i.classList.remove('over'));
      saveOrder();
    });
  });
}

function getDragAfterElement(container, y) {
  const draggableElements = [...container.querySelectorAll('li:not(.dragging)')];

  return draggableElements.reduce((closest, child) => {
    const box = child.getBoundingClientRect();
    const offset = y - box.top - box.height / 2;
    if (offset < 0 && offset > closest.offset) {
      return { offset, element: child };
    }
    return closest;
  }, { offset: Number.NEGATIVE_INFINITY }).element;
}

function saveOrder() {
  const newOrder = [];
  taskList.querySelectorAll('li').forEach(li => {
    const idx = parseInt(li.dataset.index);
    newOrder.push(tasks[idx]);
  });
  tasks = newOrder;
  saveAndRender();
}

// 事件綁定
addBtn.addEventListener('click', addTask);
taskInput.addEventListener('keypress', e => {
  if (e.key === 'Enter') addTask();
});

// 初次渲染
renderTasks();
