export function initFiltering(elements) {

    const updateIndexes = (elements, indexes) => {
        Object.keys(indexes).forEach((elementName) => {
            elements[elementName].append(...Object.values(indexes[elementName]).map(name => {
                const el = document.createElement('option');
                el.textContent = name;
                el.value = name;
                return el;
            }))
        })
    }

    const applyFiltering = (query, state, action) => {
        if (action && action.name === 'clear') {
            const button = action.element;
            if (!button) return query;

        const fieldName = button.getAttribute('data-field');
        if (!fieldName) return query;

        const parent = button.closest('.filter-wrapper');
        if (!parent) return query;

        const input = parent.querySelector('input, select');
        if (input) {
            input.value = ''; 
        }

        if (state.filters && state.filters.hasOwnProperty(fieldName)) {
            state.filters[fieldName] = '';
        }
            }  

    const filter = {};
    
        Object.keys(elements).forEach(key => {
            if (elements[key]) {
                if (['INPUT', 'SELECT'].includes(elements[key].tagName) && elements[key].value) { // ищем поля ввода в фильтре с непустыми данными
                    filter[`filter[${elements[key].name}]`] = elements[key].value; // чтобы сформировать в query вложенный объект фильтра
                }
            }
        })

        return Object.keys(filter).length ? Object.assign({}, query, filter) : query; // если в фильтре что-то добавилось, применим к запросу
    }

    return {
        updateIndexes,
        applyFiltering
    }

}


