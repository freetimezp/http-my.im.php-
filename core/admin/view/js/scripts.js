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

                            let rowName = i.replace(/[/[/]]/g, '');

                            fileStore[i].forEach((item, index) => {
                                forData.append(`${rowName}[${index}]`, item);
                            })
                        }
                    }

                    //console.log(forData.get('gallery_img[1]'));

                    forData.append('ajax', 'editData');
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
    }
}




