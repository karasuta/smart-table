import {cloneTemplate} from "../lib/utils.js";

/**
 * Инициализирует таблицу и вызывает коллбэк при любых изменениях и нажатиях на кнопки
 *
 * @param {Object} settings
 * @param {(action: HTMLButtonElement | undefined) => void} onAction
 * @returns {{container: Node, elements: *, render: render}}
 */
export function initTable(settings, onAction) {
    const {tableTemplate, rowTemplate, before, after} = settings;
    const root = cloneTemplate(tableTemplate);

    // @todo: #1.2 —  вывести дополнительные шаблоны до и после таблицы
    //console.log('Шаблоны "до":', before);
    //console.log('Шаблоны "после":', after);

    // Обработка шаблонов "до" (в обратном порядке)
    
        before.reverse().forEach(subName => {            // перебираем нужный массив идентификаторов
            const cloned = cloneTemplate(subName);       // клонируем и получаем объект, сохраняем в таблице
            root[subName] = cloned;
            root.container.prepend(cloned.container);    // добавляем к таблице до (prepend)
        });

    // Обработка шаблонов "после"

        after.forEach(subName => {                        // перебираем нужный массив идентификаторов
            const cloned = cloneTemplate(subName);       // клонируем и получаем объект, сохраняем в таблице
            root[subName] = cloned;
            root.container.append(cloned.container);       // добавляем к таблице после (append) 
        });


    // @todo: #1.3 —  обработать события и вызвать onAction()

    root.container.addEventListener ('change', (e) => {
        onAction();
    })
    root.container.addEventListener ('reset', (e) => {
        setTimeout(() => {
        onAction();
    }, 100);
    })
    root.container.addEventListener ('submit', (e) => {
        e.preventDefault();
        onAction(e.submitter);
    })
    const render = (data) => {
        // @todo: #1.1 — преобразовать данные в массив строк на основе шаблона rowTemplate
        
        const nextRows = data.map(item => {
            const row = cloneTemplate(rowTemplate);
            Object.keys(item).forEach(key => {
                if (key in row.elements) {
                    row.elements[key].textContent = item[key];
                }
            })
        return row.container;
        })
        root.elements.rows.replaceChildren(...nextRows);
    }

    return {...root, render};
}