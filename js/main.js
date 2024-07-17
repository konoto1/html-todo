//rikiavimas?..
// localStorage

const h1DOM = document.querySelector('h1');
const formDOM = document.forms[0];
const textInputDOM = formDOM.querySelector('input');
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

    todoData.push(
        {
            text: textInputDOM.value.trim(),
            createdAt: Date.now(),
        }
    );

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
         <article class="item">
                 <div class="date">Created at: ${formatTime(todo.createdAt)}<br>Updated at: ${formatTime(todo.updatedAt)}</div>
                 <div class="text">${todo.text}</div>
                 <form class="hidden">
                 <input type="text"/>
                 <button type="submit">Update</button>
                 <button type="button">Cancel</button>
                 </form>
                 <div class="actions">
                     <button>Done</button>
                     <div class="divider"></div>
                     <button>Edit</button>
                     <button>Delete</button>
                 </div>
             </article>`

    }

    listDOM.innerHTML = HTML;

    const articlesDOM = listDOM.querySelectorAll('article');


    for (let i = 0; i < articlesDOM.length; i++) {
        const articleDOM = articlesDOM[i];
        const articleEditFormDOM = articleDOM.querySelector('form');
        const updateInputDOM = articleEditFormDOM.querySelector('input');
        const buttonsDOM = articleDOM.querySelectorAll('button');

        const updateDOM = buttonsDOM[0];
        updateDOM.addEventListener('click', e => {
            e.preventDefault()
            const validationMsg = isValidText(updateInputDOM.value)
            if (validationMsg !== true) {
                showToastError(validationMsg);
                return;
            }

            showToastSuccess('Task successfully updated');

            todoData[i].text = updateInputDOM.value.trim();
            todoData[i]['updatedAt'] = Date.now();

            localStorage.setItem('tasks', JSON.stringify(todoData));
            renderTaskList();

        });

        const cancelDOM = buttonsDOM[1];
        cancelDOM.addEventListener('click', () => {
            articleEditFormDOM.classList.add('hidden');

        });

        const editDOM = buttonsDOM[3];
        editDOM.addEventListener('click', () => {
            articleEditFormDOM.classList.remove('hidden');
        });

        const deleteDOM = buttonsDOM[4];
        deleteDOM.addEventListener('click', () => {
            todoData.splice(i, 1);
            showToastInfo('Your  task was deleted');
            localStorage.setItem('tasks', JSON.stringify(todoData))
            renderList();
        });
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



