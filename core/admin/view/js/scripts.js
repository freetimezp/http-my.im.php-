document.querySelector('.sitemap-button').onclick = (e) => {
    e.preventDefault();
    createSitemap();
}

let links_counter = 0;

function createSitemap() {
    links_counter++;

    Ajax({data: {ajax: 'sitemap', links_counter: links_counter}})
        .then((res) => {
            console.log('успех Ajax - ' + res);
        })
        .catch((res) => {
            console.log('ошибка Ajax - ' + res);
            createSitemap();
        });
}

createFile();

function createFile() {
    let files = document.querySelectorAll('input[type=file]');

    let fileStore = [];

    if(files.length) {
        files.forEach(item => {
            item.onchange = function () {
                let multiple = false;
                let parentContainer;
                let container;

                if(item.hasAttribute('multiple')) {
                    multiple = true;

                    parentContainer = this.closest('.gallery_container');

                    if(!parentContainer) {
                        return false;
                    }

                    container = parentContainer.querySelectorAll('.empty_container');

                    if(container.length < this.files.length) {
                        for(let index = 0; index < this.files.length - container.length; index++) {
                            let el = document.createElement('div');
                            el.classList.add('vg-dotted-square', 'vg-center', 'empty_container');
                            parentContainer.append(el);
                        }

                        container = parentContainer.querySelectorAll('.empty_container');
                    }
                }

                let fileName = item.name;
                let attributeName = fileName.replace(/[\[\]]/g, '');

                for(let i in this.files) {
                    if(this.files.hasOwnProperty(i)) {
                        if(multiple) {
                            if(typeof fileStore[fileName] === 'undefined') {
                                fileStore[fileName] = [];
                            }

                            let elId = fileStore[fileName].push(this.files[i]) - 1;
                            container[i].setAttribute(`data-deleteFileId-${attributeName}`, elId);
                            showImage(this.files[i], container[i]);

                            deleteNewFiles(elId, fileName, attributeName, container[i]);
                        }else{
                            container = this.closest('.img_container').querySelector('.img_show');

                            showImage(this.files[i], container);
                        }
                    }
                }

                //console.log(fileStore);
            }

            let area = item.closest('.img_wrapper');

            if(area) {
                dragAndDrop(area, item);
            }
        });

        let form = document.querySelector('#main-form');

        if(form) {
            form.onsubmit = function(e) {
                if(!isEmpty(fileStore)) {
                    e.preventDefault();

                    let forData = new FormData(this);
                    //console.log(forData);

                    for(let i in fileStore) {
                        if(fileStore.hasOwnProperty(i)) {
                            forData.delete(i);

                            let rowName = i.replace(/[\[\]]/g, '');

                            fileStore[i].forEach((item, index) => {
                                forData.append(`${rowName}[${index}]`, item);
                            })
                        }
                    }

                    //console.log(forData.get('gallery_img[1]'));

                    forData.append('ajax', 'editData');

                    Ajax({
                        url: this.getAttribute('action'),
                        type: 'post',
                        data: forData,
                        processData: false,
                        contentType: false
                    }).then(res => {
                        try{
                            res = JSON.parse(res);
                            if(!res.success) {
                                throw new Error();
                            }
                            location.reload();
                        }catch(e) {
                            alert('Произошла внутрення ошибка');
                        }
                    });
                }
            }
        }

        function deleteNewFiles(elId, fileName, attributeName, container) {
            container.addEventListener('click', function() {
                this.remove();
                delete fileStore[fileName][elId];
                //console.log(fileStore);
            })
        }

        function showImage(item, container) {
            let reader = new FileReader();
            container.innerHTML = '';
            reader.readAsDataURL(item);

            reader.onload = e => {
                container.innerHTML = '<img class="img_item" src="">';
                container.querySelector('img').setAttribute('src', e.target.result);
                container.classList.remove('empty_container');
            }
        }

        function dragAndDrop(area, input) {
            ['dragenter', 'dragover', 'dragleave', 'drop'].forEach((eventName, index) => {
                area.addEventListener(eventName, e => {
                    e.preventDefault();
                    e.stopPropagation();

                    if(index < 2) {
                        area.style.background = 'lightblue';
                    }else{
                        area.style.background = 'white';

                        if(index === 3) {
                            input.files = e.dataTransfer.files;
                            input.dispatchEvent(new Event('change'));
                        }
                    }
                });
            });
        }
    }
}

changeMenuPosition();

function changeMenuPosition() {
    let form = document.querySelector('#main-form');

    if(form) {
        let selectParent = form.querySelector('select[name=parent_id]');
        let selectPosition = form.querySelector('select[name=menu_position]');

        if(selectParent && selectPosition) {
            let defaultParent = selectParent.value;
            let defaultPosition = +selectPosition.value;

            selectParent.addEventListener('change', function () {
                let defaultChoose  = false;

                if(this.value === defaultParent) {
                    defaultChoose = true;
                }

                Ajax({
                    data: {
                        table: form.querySelector('input[name=table]').value,
                        'parent_id': this.value,
                        ajax: 'change_parent',
                        iteration: !form.querySelector('#tableId') ? 1 : +!defaultChoose
                    }
                }).then(res => {
                    //console.log(res);

                    res = +res;

                    if(!res) {
                        return errorAlert();
                    }

                    let newSelect = document.createElement('select');
                    newSelect.setAttribute('name', 'menu_position');
                    newSelect.classList.add('vg-input', 'vg-text', 'vg-full', 'vg-firm-color');

                    for(let i = 1; i <= res; i++) {
                        let selected = defaultChoose && i === defaultPosition ? 'selected' : '';

                        newSelect.insertAdjacentHTML('beforeend', `<option ${selected} value="${i}">${i}</option>`);
                    }

                    selectPosition.before(newSelect);
                    selectPosition.remove();
                    selectPosition = newSelect;
                })
            });
        }
    }
}

blockParameters();

function blockParameters() {
    let wraps = document.querySelectorAll('.select_wrap');

    if(wraps.length) {
        let selectAllIndexes = [];

        wraps.forEach(item => {
            let next = item.nextElementSibling;

            if(next && next.classList.contains('option_wrap')) {
                item.addEventListener('click', e => {
                    if(!e.target.classList.contains('select_all')) {
                        //console.dir(next);
                        next.slideToggle();
                    }else{
                        let index = [...document.querySelectorAll('.select_all')].indexOf(e.target);
                        //console.log(index);

                        if(typeof selectAllIndexes[index] === 'undefined') {
                            selectAllIndexes[index] = false;
                        }

                        selectAllIndexes[index] = !selectAllIndexes[index];

                        next.querySelectorAll('input[type=checkbox]').forEach(el => el.checked = selectAllIndexes[index]);
                    }
                })
            }
        })
    }
}

showHideMenuSearch();

function showHideMenuSearch(){
    document.querySelector('#hideButton').addEventListener('click', () => {
        document.querySelector('.vg-carcass').classList.toggle('vg-hide');
    });

    let searchBtn = document.querySelector('#searchButton');
    let searchInput = searchBtn.querySelector('input[type=text]');

    searchBtn.addEventListener('click', () => {
        searchBtn.classList.add('vg-search-reverse');
        searchInput.focus();
    });

    searchInput.addEventListener('blur', () => {
        searchBtn.classList.remove('vg-search-reverse');
    });
}

let searchResultHover = (() => {
    let searchRes = document.querySelector('.search_res');
    let searchInput = document.querySelector('#searchButton input[type=text]');
    let defaultInputValue = null;

    function searchKeyDown(e) {
        if(!(document.querySelector('#searchButton').classList.contains('vg-search-reverse')) ||
            (e.key !== 'ArrowUp' && e.key !== 'ArrowDown')) {
            return;
        }

        let children = [...searchRes.children];

        if(children.length) {
            e.preventDefault();

            let activeItem = searchRes.querySelector('.search_act');
            let activeIndex = activeItem ? children.indexOf(activeItem) : -1;

            if(e.key === 'ArrowUp') {
                activeIndex = activeIndex <= 0 ? children.length - 1 : --activeIndex;
            }else{
                activeIndex = activeIndex === children.length - 1 ? 0 : ++activeIndex;
            }

            children.forEach(item => item.classList.remove('search_act'));
            children[activeIndex].classList.add('search_act');

            searchInput.value = children[activeIndex].innerText;
        }
    }

    function setDefaultValue() {
        searchInput.value = defaultInputValue;
    }

    searchRes.addEventListener('mouseleave', setDefaultValue);
    window.addEventListener('keydown', searchKeyDown);

    return () => {
        defaultInputValue = searchInput.value;

        if(searchRes.children.length) {
            let children = [...searchRes.children];

            children.forEach(item => {
                item.addEventListener('mouseover', () => {
                    children.forEach(el => el.classList.remove('search_act'));
                    item.classList.add('search_act');
                    searchInput.value = item.innerText;
                });
            });
        }
    };
})();

searchResultHover();

function sortable(rootEl, onUpdate){
    var dragEl, nextEl;

    // Делаем всех детей перетаскиваемыми
    [].slice.call(rootEl.children).forEach(function (itemEl){
        itemEl.draggable = true;
    });

    // Фнукция отвечающая за сортировку
    function _onDragOver(evt){
        evt.preventDefault();
        evt.dataTransfer.dropEffect = 'move';

        var target = evt.target;
        if( target && target !== dragEl && target.nodeName == 'LI' ){
            // Сортируем
            var rect = target.getBoundingClientRect();
            var next = (evt.clientY - rect.top)/(rect.bottom - rect.top) > .5;
            rootEl.insertBefore(dragEl, next && target.nextSibling || target);
        }
    }

    // Окончание сортировки
    function _onDragEnd(evt){
        evt.preventDefault();

        dragEl.classList.remove('ghost');
        rootEl.removeEventListener('dragover', _onDragOver, false);
        rootEl.removeEventListener('dragend', _onDragEnd, false);

        if( nextEl !== dragEl.nextSibling ){
            // Сообщаем об окончании сортировки
            onUpdate(dragEl);
        }
    }

    // Начало сортировки
    rootEl.addEventListener('dragstart', function (evt){
        dragEl = evt.target; // Запоминаем элемент который будет перемещать
        nextEl = dragEl.nextSibling;

        // Ограничиваем тип перетаскивания
        evt.dataTransfer.effectAllowed = 'move';
        evt.dataTransfer.setData('Text', dragEl.textContent);

        // Пописываемся на события при dnd
        rootEl.addEventListener('dragover', _onDragOver, false);
        rootEl.addEventListener('dragend', _onDragEnd, false);

        setTimeout(function (){
            // Если выполнить данное действие без setTimeout, то
            // перетаскиваемый объект, будет иметь этот класс.
            dragEl.classList.add('ghost');
        }, 0)
    }, false);
}

// Используем
sortable( document.querySelector('.gallery_container'), function (item){
    console.log(item);
});


