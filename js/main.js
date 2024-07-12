//rikiavimas?..
// localStorage

const h1DOM = document.querySelector('h1');
const formDOM = document.forms[0];
const textInputDOM = formDOM.querySelector('input');
const submitButtonDOM = formDOM.querySelector('button');
const listDOM = document.querySelector('.list');

const todoData = [];

submitButtonDOM.addEventListener('click', e => {
    e.preventDefault();

    if (textInputDOM.value.length === 0) {
        return;
    }

    todoData.push(
        {
            text: textInputDOM.value,
            createdAt: Date.now(),
        }
    );
    renderList();
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
                 <div class="date">${formatTime(todo.createdAt)}</div>
                 <div class="text">${todo.text}</div>
                 <form class="hidden">
                 <input type="text" />
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
            todoData[i].text = updateInputDOM.value;
            console.log(updateInputDOM.value);
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
            renderList();
        });
    }
}

function formatTime(timeInMs) {
    const time = (Date(timeInMs[Symbol.toPrimitive])).split(' ');
    const month = new Date().getMonth();
    const month1 = ('' + month).length === 1 ? `0${month}` : `${month}`;
    return [time[3], month1, time[2], time[4]].join(' ');
}

// CRUD operations
// create array.push({initial data})
// read   array.map()
// update array[i] = {update data}
// delete array.splice(i, 1)


