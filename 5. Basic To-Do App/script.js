// Task data structure
let tasks = [];
let editingTaskId = null;

// DOM Elements
const taskInput = document.getElementById('taskInput');
const addTaskBtn = document.getElementById('addTaskBtn');
const pendingList = document.getElementById('pendingList');
const completedList = document.getElementById('completedList');
const pendingCount = document.getElementById('pendingCount');
const completedCount = document.getElementById('completedCount');
const editModal = document.getElementById('editModal');
const editInput = document.getElementById('editInput');
const saveEditBtn = document.getElementById('saveEditBtn');
const cancelEditBtn = document.getElementById('cancelEditBtn');

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    loadTasks();
    renderTasks();
    attachEventListeners();
});

// Event Listeners
function attachEventListeners() {
    addTaskBtn.addEventListener('click', addTask);
    taskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addTask();
    });
    saveEditBtn.addEventListener('click', saveEdit);
    cancelEditBtn.addEventListener('click', closeEditModal);
    editModal.addEventListener('click', (e) => {
        if (e.target === editModal) closeEditModal();
    });
}

// Add new task
function addTask() {
    const text = taskInput.value.trim();
    
    if (text === '') {
        alert('Please enter a task!');
        return;
    }

    const task = {
        id: Date.now(),
        text: text,
        completed: false,
        createdAt: new Date().toISOString(),
        completedAt: null
    };

    tasks.push(task);
    taskInput.value = '';
    saveTasks();
    renderTasks();
}

// Toggle task completion
function toggleTask(id) {
    const task = tasks.find(t => t.id === id);
    if (task) {
        task.completed = !task.completed;
        task.completedAt = task.completed ? new Date().toISOString() : null;
        saveTasks();
        renderTasks();
    }
}

// Delete task
function deleteTask(id) {
    if (confirm('Are you sure you want to delete this task?')) {
        tasks = tasks.filter(t => t.id !== id);
        saveTasks();
        renderTasks();
    }
}

// Open edit modal
function editTask(id) {
    const task = tasks.find(t => t.id === id);
    if (task) {
        editingTaskId = id;
        editInput.value = task.text;
        editModal.classList.add('active');
        editInput.focus();
    }
}

// Save edited task
function saveEdit() {
    const newText = editInput.value.trim();
    
    if (newText === '') {
        alert('Task cannot be empty!');
        return;
    }

    const task = tasks.find(t => t.id === editingTaskId);
    if (task) {
        task.text = newText;
        saveTasks();
        renderTasks();
        closeEditModal();
    }
}

// Close edit modal
function closeEditModal() {
    editModal.classList.remove('active');
    editingTaskId = null;
    editInput.value = '';
}

// Render tasks
function renderTasks() {
    const pendingTasks = tasks.filter(t => !t.completed);
    const completedTasks = tasks.filter(t => t.completed);

    // Update counts
    pendingCount.textContent = pendingTasks.length;
    completedCount.textContent = completedTasks.length;

    // Render pending tasks
    if (pendingTasks.length === 0) {
        pendingList.innerHTML = '<div class="empty-state">No pending tasks. Add one to get started! 🎉</div>';
    } else {
        pendingList.innerHTML = pendingTasks.map(task => createTaskHTML(task)).join('');
    }

    // Render completed tasks
    if (completedTasks.length === 0) {
        completedList.innerHTML = '<div class="empty-state">No completed tasks yet. Keep going! 💪</div>';
    } else {
        completedList.innerHTML = completedTasks.map(task => createTaskHTML(task)).join('');
    }
}

// Create task HTML
function createTaskHTML(task) {
    const createdDate = formatDate(task.createdAt);
    const completedDate = task.completedAt ? formatDate(task.completedAt) : '';
    
    return `
        <li class="task-item ${task.completed ? 'completed' : ''}">
            <input 
                type="checkbox" 
                class="task-checkbox" 
                ${task.completed ? 'checked' : ''} 
                onchange="toggleTask(${task.id})"
            />
            <div class="task-content">
                <div class="task-text">${escapeHTML(task.text)}</div>
                <div class="task-time">
                    ${task.completed 
                        ? `Completed: ${completedDate}` 
                        : `Created: ${createdDate}`
                    }
                </div>
            </div>
            <div class="task-actions">
                <button class="btn-edit" onclick="editTask(${task.id})">Edit</button>
                <button class="btn-delete" onclick="deleteTask(${task.id})">Delete</button>
            </div>
        </li>
    `;
}

// Format date
function formatDate(isoString) {
    const date = new Date(isoString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    // Relative time for recent tasks
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;

    // Absolute date for older tasks
    const options = { 
        month: 'short', 
        day: 'numeric', 
        year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
        hour: '2-digit', 
        minute: '2-digit' 
    };
    return date.toLocaleDateString('en-US', options);
}

// Escape HTML to prevent XSS
function escapeHTML(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

// Save tasks to localStorage
function saveTasks() {
    localStorage.setItem('dailyTasks', JSON.stringify(tasks));
}

// Load tasks from localStorage
function loadTasks() {
    const saved = localStorage.getItem('dailyTasks');
    if (saved) {
        tasks = JSON.parse(saved);
    }
}
