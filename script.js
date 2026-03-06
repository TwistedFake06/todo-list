// 顯示日期
const dateEl = document.getElementById('date');
dateEl.textContent = new Date().toLocaleDateString('zh-TW', {
  weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
});

// 元素
const taskInput     = document.getElementById('taskInput');
const categorySelect = document.getElementById('categorySelect');
const dueDateInput  = document.getElementById('dueDateInput');
const addBtn        = document.getElementById('addBtn');
const taskList      = document.getElementById('taskList');

// 載入資料
let tasks = JSON.parse(localStorage.getItem('todo-tasks-2025')) || [];

// 渲染任務列表
function renderTasks() {
  taskList.innerHTML = '';

  // 先分組：未完成 → 已完成
  const sortedTasks = [
    ...tasks.filter(t => !t.completed),
    ...tasks.filter(t => t.completed)
  ];

  sortedTasks.forEach((task, index) => {
    // 因為排序後 index 改變，所以用原始 tasks 找真正 index
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

    // 切換完成 → 完成後會自動移底
    li.querySelector('input').addEventListener('change', () => {
      tasks[realIndex].completed = !tasks[realIndex].completed;
      saveAndRender();
    });

    // 刪除
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

// 儲存 + 重新渲染
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

  tasks.push({
    text,
    category,
    dueDate,
    completed: false
  });

  taskInput.value = '';
  dueDateInput.value = '';
  saveAndRender();
}

// ────────────────
// 拖拉排序邏輯
// ────────────────
let draggedItem = null;

function addDragAndDropListeners() {
  const items = taskList.querySelectorAll('li');

  items.forEach(item => {
    // 滑鼠
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

    // 觸控（手機）
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

// 事件
addBtn.addEventListener('click', addTask);
taskInput.addEventListener('keypress', e => {
  if (e.key === 'Enter') addTask();
});

// 初次渲染
renderTasks();
