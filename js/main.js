//rikiavimas?..
// localStorage

const h1DOM = document.querySelector('h1');
const formDOM = document.forms[0];
const textInputDOM = formDOM.querySelector('input[type="text"]');
const colorInputDOM = formDOM.querySelector('input[type="color"]');
const submitButtonDOM = formDOM.querySelector('button');
const listDOM = document.querySelector('.list');
const toastDOM = document.querySelector('.toast');
const titleDOM = toastDOM.querySelector('.title')
const messagesDOM = toastDOM.querySelector('.messages');
const closeDOM = toastDOM.querySelector('.close > svg');


closeDOM.addEventListener('click', () => {
    toastDOM.classList.remove('active');
});

const localData = localStorage.getItem('tasks');
let todoData = [];

if (localData !== null) {
    todoData = JSON.parse(localData);
    renderList();
}

submitButtonDOM.addEventListener('click', e => {
    e.preventDefault();

    const validationMsg = isValidText(textInputDOM.value);
    if (validationMsg !== true) {
        showToastError(validationMsg)
        return;
    }

    todoData.push({
        state: 'todo',
        text: textInputDOM.value.trim(),
        color: colorInputDOM.value,
        createdAt: Date.now(),
        updatedAt: Date.now(),
    });
    localStorage.setItem('tasks', JSON.stringify(todoData));
    renderList();
    showToastSuccess('Task successfully created');
});

function renderList() {
    if (todoData.length === 0) {
        renderEmptyList();
    } else {
        renderTaskList();
    }
}

function renderEmptyList() {
    listDOM.classList.add('empty');
    listDOM.textContent = 'Empty';
}

function renderTaskList() {
    listDOM.classList.remove('empty');
    let HTML = ``;
    for (const todo of todoData) {
        HTML += `
         <article class="item" data-state="${todo.state}" style="border-left-color: ${todo.color};">
                 <div class="date">Created at: ${formatTime(todo.createdAt)}</div>
                 <div class="update-date ${todo.createdAt === todo.updatedAt ? 'hidden' : ''}">Updated at: ${formatTime(todo.updatedAt)}</div>
                 <div class="state">Atlikta</div>
                 <div class="text">${todo.text}</div>
                 <form class="hidden">
                 <input type="text" value="${todo.text}">
                 <button class="update" type="submit">Update</button>
                 <button class="cancel" type="button">Cancel</button>
                 </form>
                 <div class="actions">
                     <button class="done">Done</button>
                     <div class="divider"></div>
                    ${todo.state === 'done' ? '' : '<button class="edit">Edit</button>'}
                     <button class="delete">Delete</button>
                 </div>
             </article>`
    }

    listDOM.innerHTML = HTML;

    const articlesDOM = listDOM.querySelectorAll('article');


    for (let i = 0; i < articlesDOM.length; i++) {
        const articleDOM = articlesDOM[i];
        const articleEditFormDOM = articleDOM.querySelector('form');
        const updateInputDOM = articleEditFormDOM.querySelector('input');


        const updateDOM = articleDOM.querySelector('button.update');

        if (updateDOM !== null) {

            updateDOM.addEventListener('click', e => {
                e.preventDefault()
                const validationMsg = isValidText(updateInputDOM.value)
                if (validationMsg !== true) {
                    showToastError(validationMsg);
                    return;
                }
                console.log(articleDOM.querySelector('.update-date'));
                showToastSuccess('Task successfully updated');
                todoData[i].updatedAt = Date.now();
                todoData[i].text = updateInputDOM.value.trim();
                renderList();
                localStorage.setItem('tasks', JSON.stringify(todoData));
            });
        }

        const cancelDOM = articleDOM.querySelector('button.cancel');
        if (cancelDOM !== null) {
            cancelDOM.addEventListener('click', () => {
                articleEditFormDOM.classList.add('hidden');
            });
        }

        const doneDOM = articleDOM.querySelector('button.done');
        if (doneDOM !== null) {
            doneDOM.addEventListener('click', () => {
                todoData[i].state = 'done';
                localStorage.setItem('tasks', JSON.stringify(todoData));
                renderList();
            });
        }

        const editDOM = articleDOM.querySelector('button.edit');
        if (editDOM !== null) {
            editDOM.addEventListener('click', () => {
                articleEditFormDOM.classList.remove('hidden');
                localStorage.setItem('tasks', JSON.stringify(todoData));
            });
        }

        const deleteDOM = articleDOM.querySelector('button.delete');
        if (deleteDOM !== null) {
            deleteDOM.addEventListener('click', () => {
                todoData.splice(i, 1);
                showToastInfo('Your  task was deleted');
                localStorage.setItem('tasks', JSON.stringify(todoData))
                renderList();
            });
        }
    }
}


function formatTime(timeInMs) {
    if (timeInMs === undefined) {
        return 'No updates yet';
    } else {
        const date = new Date(timeInMs);
        const y = (date.getFullYear());
        const m = (date.getMonth() + 1 < 10 ? '0' : '') + (date.getMonth() + 1);
        // const d = (date.getDay()); //savaites diena
        const d = (date.getDate() < 10 ? '0' : '') + date.getDate(); // menesio diena
        const h = (date.getHours() < 10 ? '0' : '') + date.getHours();
        const mn = (date.getMinutes() < 10 ? '0' : '') + date.getMinutes();
        const s = (date.getSeconds() < 10 ? '0' : '') + date.getSeconds();
        return `${y}-${m}-${d} ${h}:${mn}:${s}`;
    }
}

function isValidText(text) {
    if (typeof text !== 'string') {
        return 'Input must be a string';
    }
    if (text === '') {
        return 'Input can not be empty';
    }

    if (text.trim() === '') {
        return 'Input can not be empty spaces';
    }
    if (text[0].toUpperCase() !== text[0]) {
        return 'Input can not start with lowercase';
    }
    return true;
}

// function formatTime(timeInMs) {
//     const time = (Date(timeInMs)).split(' ');
//     const month = new Date().getMonth() + 1;
//     const month1 = ('' + month).length === 1 ? `0${month}` : `${month}`;
//     return [time[3], month1, time[2], time[4]].join(' ');
// }

// CRUD operations
// create array.push({initial data})
// read   array.map()
// update array[i] = {update data}
// delete array.splice(i, 1)


function showToast(state, title, msg) {
    toastDOM.classList.add('active');
    toastDOM.dataset.state = state;
    titleDOM.innerText = title;
    messagesDOM.innerText = msg;
}

function showToastSuccess(msg) {
    showToast('success', 'SUCCESS', msg);
}

function showToastInfo(msg) {
    showToast('info', 'INFO', msg);
}

function showToastError(msg) {
    showToast('error', 'ERROR', msg);
}

// ######################################

const sortingListDOM = document.querySelector('.list-actions');
const sortingButtonsDOM = sortingListDOM.querySelectorAll('button');

//Sorting: Time 0-9
const btnTime09DOM = sortingButtonsDOM[0];
btnTime09DOM.addEventListener('click', () => {
    sortingListDOM.querySelector('.active').classList.remove('active');
    btnTime09DOM.classList.add('active');
    todoData.sort((a, b) => a.createdAt - b.createdAt);
    renderTaskList();
})

//Sorting: Time 9-0
const btnTime90DOM = sortingButtonsDOM[1];
btnTime90DOM.addEventListener('click', () => {
    sortingListDOM.querySelector('.active').classList.remove('active');
    btnTime90DOM.classList.add('active');
    todoData.sort((a, b) => b.createdAt - a.createdAt);
    renderTaskList();
})

//Sorting: Color A-Z
const btnColorAZDOM = sortingButtonsDOM[2];
btnColorAZDOM.addEventListener('click', () => {
    sortingListDOM.querySelector('.active').classList.remove('active');
    btnColorAZDOM.classList.add('active');
    todoData.sort((a, b) => (a.color < b.color) ? -1 : (a.color === b.color) ? 0 : 1);
    renderTaskList();
});

//Sorting: Color Z-A
const btnColorZADOM = sortingButtonsDOM[3];
btnColorZADOM.addEventListener('click', () => {
    sortingListDOM.querySelector('.active').classList.remove('active');
    btnColorZADOM.classList.add('active');
    todoData.sort((a, b) => (b.color < a.color) ? -1 : (a.color === b.color) ? 0 : 1);
    renderTaskList();
});

//Sorting: Name A-Z
const btnNameAZDOM = sortingButtonsDOM[4];
btnNameAZDOM.addEventListener('click', () => {
    sortingListDOM.querySelector('.active').classList.remove('active');
    btnNameAZDOM.classList.add('active');
    todoData.sort((a, b) => (a.text < b.text) ? -1 : (a.color === b.color) ? 0 : 1);
    renderTaskList();
});

//Sorting: Name Z-A
const btnNameZADOM = sortingButtonsDOM[5];
btnNameZADOM.addEventListener('click', () => {
    sortingListDOM.querySelector('.active').classList.remove('active');
    btnNameZADOM.classList.add('active');
    todoData.sort((a, b) => (b.text < a.text) ? -1 : (a.color === b.color) ? 0 : 1);
    renderTaskList();
});


// ######################################





