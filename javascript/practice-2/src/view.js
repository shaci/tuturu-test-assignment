let Handlebars = require('handlebars');

module.exports = {

    /**
     * метод отвечает за визуальное представление страницы при загрузке данных с сервера
     **/
    onLoadingData(){
        let background = document.createElement('div'),
            loader = document.createElement('div'),
            docfrag = document.createDocumentFragment(),
            pagination = document.querySelector('div[data-role="pagination"] ul'),
            info = document.querySelector('div[data-role="additional-info"]');
        background.className = 'loader__background';
        loader.className = 'loader__figure';
        docfrag.appendChild(background);
        docfrag.appendChild(loader);
        document.body.appendChild(docfrag);
        pagination.innerHTML = info.innerHTML = '';
    },

    /**
     * метод отвечает за визуальное представление страницы после успешной загрузки данных с сервера
     * @param object button элемент (кнопка), которая была нажата
     **/
    onReceiveData(button){
        let background = document.querySelector('.loader__background'),
            loader = document.querySelector('.loader__figure'),
            otherButton = button.parentElement.querySelector('.btn-success'),
            searchForm = document.querySelector('.form-inline');

        loader.remove();
        background.remove();
        if (otherButton) otherButton.classList.remove('btn-success');
        button.classList.add('btn-success');
        searchForm.style.display = 'block';
        searchForm.firstElementChild.value = '';
        this.onRemoveLogoOrder();
    },

    /**
     * метод отвечает за визуальное представление направления сортировки по определенному параметру
     * @param object element элемент таблицы (параметр сортировки), по которому кликнул пользователь
     * @param string order направление сортировки
     **/
    onChangeLogoOrder(element, order){
        let span = element.children[0];
        this.onRemoveLogoOrder();
        span.className = `glyphicon glyphicon-arrow-${order}`;
    },

    /**
     * метод удаляет графическое отображение направления сортировки
     **/
    onRemoveLogoOrder(){
        let arrows = document.querySelectorAll('.glyphicon');
        for (let arr of arrows){
            arr.className='';
        }
    },

    /**
     * метод отвечает за вывод данных в таблице
     * @param array data массив данных, которые необходимо отобразить в таблице
     **/
    onShowTableContent(data){
        let table = document.querySelector('.table'),
            tbody = table.children[1];

        if (tbody) tbody.remove();
        table.innerHTML += this._render('table',{list: data});
        table.style.display = 'table';
    },

    /**
     * метод отвечает за вывод дополнительных данных под таблицей
     * @param array data данных, которые необходимо отобразить под таблицей
     * @param object newSelectedPerson элемент таблицы, который нужно выделить ("чьи" дополнительные данные будут выведены)
     **/
    onShowAdditionalInfo(data,newSelectedPerson){
        let div = document.querySelector('div[data-role="additional-info"]'),
            selectedPerson = document.querySelector('tr.selected');

        div.innerHTML = this._render('info', {list: data});
        document.body.scrollTop = document.body.scrollHeight;

        newSelectedPerson.classList.add('selected');
        if (selectedPerson) selectedPerson.classList.remove('selected');
    },

    /**
     * метод отвечает за вывод пользовательской навигации для перехода по страницам
     * @param number pageNumber количество страниц
     **/
    onShowPagination(pageNumber){
        let ul = document.querySelector('div[data-role="pagination"] ul'),
            docFrag = document.createDocumentFragment();

        for (let i = 0; i < pageNumber; i++){
            let li = document.createElement('li');

            li.innerHTML = `<a href="#" data-page-number="${i}">${i + 1}</a>`;
            docFrag.appendChild(li);
        }
        docFrag.firstElementChild.className = 'active';
        ul.appendChild(docFrag);
    },

    /**
     * метод отвечает за "подсветку" активной страницы в пользовательской навигации
     * @param object pageButton элемент номера активной страницы
     **/
    onChangeActivePage(pageButton){
        let li = pageButton.parentElement,
            ul = li.parentElement,
            activeLi = ul.querySelector('.active');

        li.classList.add('active');
        activeLi.classList.remove('active');
    },

    /**
     * метод отвечает за отображение кнопки поиска в зависимости от заполнения текстового поля поиска
     * @param object e системный объект события
     **/
    onShowSearchButton(e){
        (e.target.value)? searchButton.style.display = 'inline-block' : searchButton.style.display = 'none';
    },

    /**
     * метод для использования внутри модуля - выполняет рендер данных по шаблону
     * @param string template название шаблона
     * @param array data массив данных, которые необходимо отобразить на странице
     **/
    _render(template,data) {
        let templateElement = document.getElementById(`${template}Template`),
            templateSource = templateElement.innerHTML,
            renderFn = Handlebars.compile(templateSource);

        return renderFn(data);
    }
};