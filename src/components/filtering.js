import {createComparison, defaultRules} from "../lib/compare.js";

// @todo: #4.3 — настроить компаратор

const compare = createComparison(defaultRules);

export function initFiltering(elements, indexes) {
    // @todo: #4.1 — заполнить выпадающие списки опциями

    Object.keys(indexes)                                    // Получаем ключи из объекта
      .forEach((elementName) => {                        // Перебираем по именам
        elements[elementName].append(                    // в каждый элемент добавляем опции
            ...Object.values(indexes[elementName])        // формируем массив имён, значений опций
                      .map(name => {                        // используйте name как значение и текстовое содержимое
                    const option = document.createElement("option");
                    option.value = name;                                  // @todo: создать и вернуть тег опции
                    option.textContent = name;
                    return option;
                })
        )
    })

    return (data, state, action) => {
        // @todo: #4.2 — обработать очистку поля
        if (action && action.name === 'clear') {
            const button = action.element;
            if (!button) return data;

        const fieldName = button.getAttribute('data-field');
        if (!fieldName) return data;

        const parent = button.closest('.filter-wrapper');
        if (!parent) return data;

        const input = parent.querySelector('input, select');
        if (input) {
            input.value = ''; 
        }

        if (state.filters && state.filters.hasOwnProperty(fieldName)) {
            state.filters[fieldName] = '';
        }
            }
        // @todo: #4.5 — отфильтровать данные используя компаратор

        return data.filter(row => compare(row, state));
    }
}