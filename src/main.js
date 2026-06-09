import './fonts/ys-display/fonts.css'
import './style.css'

import {initData} from "./data.js";
import {processFormData} from "./lib/utils.js";

import {initTable} from "./components/table.js";
// @todo: подключение
import {initPagination} from "./components/pagination.js";
import {initSorting} from "./components/sorting.js";
import {initFiltering} from "./components/filtering.js";
import {initSearching} from "./components/searching.js";

// Исходные данные используемые в render()

const api = initData();

/**
 * Сбор и обработка полей из таблицы
 * @returns {Object}
 */
function collectState() {
    const state = processFormData(new FormData(sampleTable.container));
    const rowsPerPage = parseInt(state.rowsPerPage);    // приведём количество страниц к числу
    const page = parseInt(state.page ?? 1);           // номер страницы по умолчанию 1 и тоже число
    const totalFrom = state.totalFrom ? parseInt(state.totalFrom) : null;
    const totalTo = state.totalTo ? parseInt(state.totalTo) : null;   
    const totalRange = [];
    if (totalFrom !== null && !isNaN(totalFrom)) {
        totalRange[0] = totalFrom;
    } else {
        totalRange[0] = undefined;
    }

    if (totalTo !== null && !isNaN(totalTo)) {
        totalRange[1] = totalTo;
    } else {
        totalRange[1] = undefined;
    }             
    return {
        ...state,
        rowsPerPage,
        page,
        total: totalRange
    };
}

/**
 * Перерисовка состояния таблицы при любых изменениях
 * @param {HTMLButtonElement?} action
 */

async function render(action) {
    let state = collectState(); // состояние полей из таблицы
    let query = {}; // здесь будут формироваться параметры запроса
    query = applySearching(query, state, action); // result заменяем на query
    query = applyFiltering(query, state, action); // result заменяем на query
    query = applySorting(query, state, action); // result заменяем на query
    query = applyPagination(query, state, action); // обновляем query

    const { total, items } = await api.getRecords(query); // запрашиваем данные с собранными параметрами

    updatePagination(total, query); // перерисовываем пагинатор
    sampleTable.render(items);
}

const sampleTable = initTable({
    tableTemplate: 'table',
    rowTemplate: 'row',
    before: ['search', 'header', 'filter'],
    after: ['pagination']
}, render);

// @todo: инициализация
const {applyPagination, updatePagination} = initPagination (
    sampleTable.pagination.elements,             // передаём сюда элементы пагинации, найденные в шаблоне
    (el, page, isCurrent) => {                    // и колбэк, чтобы заполнять кнопки страниц данными
        const input = el.querySelector('input');
        const label = el.querySelector('span');
        input.value = page;
        input.checked = isCurrent;
        label.textContent = page;
        return el;
    }
);

const applySorting = initSorting([        // Нам нужно передать сюда массив элементов, которые вызывают сортировку, чтобы изменять их визуальное представление
    sampleTable.header.elements.sortByDate,
    sampleTable.header.elements.sortByTotal
]);


const {applyFiltering, updateIndexes} = initFiltering(sampleTable.filter.elements);

const applySearching = initSearching('search');

const appRoot = document.querySelector('#app');
appRoot.appendChild(sampleTable.container);

async function init() {
    const indexes = await api.getIndexes();

    updateIndexes(sampleTable.filter.elements, {
        searchBySeller: indexes.sellers
    });
}

init().then(render);
