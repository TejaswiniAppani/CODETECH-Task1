document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('task-input');
    const addTaskButton = document.getElementById('add-task-button');
    const taskList = document.getElementById('task-list');

    // Load tasks from local storage
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];

    tasks.forEach(task => addTaskToDOM(task));

    addTaskButton.addEventListener('click', () => {
        const taskText = taskInput.value.trim();
        if (taskText !== '') {
            const task = {
                id: Date.now(),
                text: taskText,
                completed: false
            };
            tasks.push(task);
            addTaskToDOM(task);
            saveTasks();
            taskInput.value = '';
        }
    });

    taskList.addEventListener('click', event => {
        if (event.target.classList.contains('delete-button')) {
            const taskId = event.target.closest('li').dataset.id;
            removeTask(taskId);
        } else if (event.target.classList.contains('edit-button')) {
            const taskElement = event.target.closest('li');
            editTask(taskElement);
        } else if (event.target.classList.contains('task')) {
            const taskId = event.target.closest('li').dataset.id;
            toggleTaskCompletion(taskId);
        }
    });

    function addTaskToDOM(task) {
        const li = document.createElement('li');
        li.classList.add('fade-enter');
        li.dataset.id = task.id;
        li.innerHTML = `
            <span class="task ${task.completed ? 'completed' : ''}">${task.text}</span>
            <input type="text" class="edit-input">
            <div class="buttons">
                <button class="edit-button">Edit</button>
                <button class="delete-button">Delete</button>
            </div>
        `;
        taskList.appendChild(li);

        setTimeout(() => {
            li.classList.remove('fade-enter');
        }, 0);
    }

    function saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    function removeTask(taskId) {
        const taskIndex = tasks.findIndex(task => task.id == taskId);
        if (taskIndex !== -1) {
            tasks.splice(taskIndex, 1);
            const taskElement = document.querySelector(`li[data-id='${taskId}']`);
            taskElement.classList.add('fade-exit');
            taskElement.addEventListener('transitionend', () => {
                taskElement.remove();
                saveTasks();
            });
        }
    }

    function editTask(taskElement) {
        const taskId = taskElement.dataset.id;
        const taskTextElement = taskElement.querySelector('.task');
        const editInputElement = taskElement.querySelector('.edit-input');
        const editButton = taskElement.querySelector('.edit-button');

        if (editButton.textContent === 'Edit') {
            editInputElement.value = taskTextElement.textContent;
            taskTextElement.style.display = 'none';
            editInputElement.style.display = 'block';
            editButton.textContent = 'Save';
        } else {
            const taskIndex = tasks.findIndex(task => task.id == taskId);
            if (taskIndex !== -1) {
                tasks[taskIndex].text = editInputElement.value;
                taskTextElement.textContent = editInputElement.value;
                taskTextElement.style.display = 'block';
                editInputElement.style.display = 'none';
                editButton.textContent = 'Edit';
                saveTasks();
            }
        }
    }

    function toggleTaskCompletion(taskId) {
        const taskIndex = tasks.findIndex(task => task.id == taskId);
        if (taskIndex !== -1) {
            tasks[taskIndex].completed = !tasks[taskIndex].completed;
            const taskElement = document.querySelector(`li[data-id='${taskId}'] .task`);
            taskElement.classList.toggle('completed');
            saveTasks();
        }
    }
});
