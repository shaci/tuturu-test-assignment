let Handlebars = require('handlebars');

class TableComponent{

    constructor(options){
        this.data = options.data; // данные, полученные от сервера
        this.maxDataAmountPerPage = options.maxDataAmountPerPage; // максимальное количество элементов на страницу
    }

    /**
     * метод инициализации компонента:
     * - определяет шаблон компонента
     * - устанавливает начальные значения свойств компонента
     * - строит DOM компонента с полученными от сервера данными
     * - устанавливает обработчики событий на компоненте
     **/
    init(){
        this._layout = {
            tableComponentLayout:
                `<div class="tableCmpt__data-table row" data-role="data-table">
                    <div class="tableCmpt__search-form form-inline">
                        <input type="text" id="tableCmpt__searchField" class="form-control">
                        <button id="tableCmpt__searchButton" class="btn btn-primary">
                            <span class="glyphicon glyphicon-search"></span>
                            Найти
                        </button>
                        <button id="tableCmpt__resetButton" class="btn btn-danger">
                            <span class="glyphicon glyphicon-remove-circle"></span>
                            Очистить поиск
                        </button>
                    </div>
                    <table class="tableCmpt__table table table-hover">
                        <thead>
                        <tr>
                            <th><span data-order="up" data-sort-by="id">ID<span></span></span></th>
                            <th><span data-order="up" data-sort-by="firstName">First Name<span></span></span></th>
                            <th><span data-order="up" data-sort-by="lastName">Last Name<span></span></span></th>
                            <th><span data-order="up" data-sort-by="email">E-mail<span></span></span></th>
                            <th><span data-order="up" data-sort-by="phone">Phone<span></span></span></th>
                        </tr>
                        </thead>
                    </table>
                </div>
                <div class="tableCmpt__pagination row text-center" data-role="pagination">
                    <nav aria-label="page navigation">
                        <ul class="pagination"></ul>
                    </nav>
                </div>
                <div class="tableCmpt__additional-info row" data-role="additional-info"></div>`,

            tableTemplate:
                `<tbody>
                {{#each list}}
                    <tr data-person-id="{{id}}" data-person-phone="{{phone}}">
                        <td>{{id}}</td>
                        <td>{{firstName}}</td>
                        <td>{{lastName}}</td>
                        <td>{{email}}</td>
                        <td>{{phone}}</td>
                    </tr>
                {{/each}}
                </tbody>`,

            infoBlockTemplate:
                `<div class="col-md-6">
                    <div class="well">
                    {{#each list}}
                        Выбран пользователь <b>{{firstName}} {{lastName}}</b><br>
                        Описание:<br>
                        <textarea cols="55" rows="5" disabled>{{description}}</textarea><br>
                        {{#with adress}}
                            Адрес проживания:
                            <address>
                                <b>{{streetAddress}}</b><br>
                                Город: <b>{{city}}</b><br>
                                Провинция/штат: <b>{{state}}</b><br>
                                Индекс: <b>{{zip}}</b><br>
                            </address>
                        {{/with}}
                    {{/each}}
                    </div>
                </div>`
        };

        this._shownData = []; // текущие отображаемые данные
        this._currentPageNumber = 0; // текущая страница (отсчет идет с 0)
        this._isFoundData = false; // текущие отображаемые данные полученые путем фильтрации?
        this._sorting = []; // сохранение типа и направления сортировки данных до перефильтрации данных

        this._rendertableComponentLayout();
        // определяем объем полученных данных и способ их вывода
        if (this.data.length <= this.maxDataAmountPerPage) {
            this._shownData = this.data;
            this._renderTableContent(this._shownData);
        } else {
            this._shownData = this.data.slice(0,this.maxDataAmountPerPage);
            this._renderTableContent(this._shownData);
            this._renderPagination(Math.ceil(this.data.length / this.maxDataAmountPerPage));
        }
        this._addEventListeners();
    }

    /**
     * метод инициализации компонента строит DOM компонента по указанному шаблону
     **/
    _rendertableComponentLayout(){
        let tableComponent = document.getElementById('tableComponent');

        tableComponent.innerHTML = this._layout.tableComponentLayout;
    }

    /**
     * метод отвечает за вывод данных в таблице
     * @param array data массив данных, которые необходимо отобразить в таблице
     **/
    _renderTableContent(data){
        let table = document.querySelector('.tableCmpt__table'),
            tbody = table.children[1];

        if (tbody) tbody.remove();
        table.innerHTML += this._render('table',{list: data});
    }

    /**
     * метод отвечает за вывод пользовательской навигации для перехода по страницам
     * @param number pageNumber количество страниц
     **/
    _renderPagination(pageNumber){
        let paginationList = document.querySelector('.tableCmpt__pagination ul'),
            docFrag = document.createDocumentFragment();

        for (let i = 0; i < pageNumber; i++){
            let li = document.createElement('li');

            li.innerHTML = `<a href="#" data-page-number="${i}">${i + 1}</a>`;
            docFrag.appendChild(li);
        }
        docFrag.firstElementChild.className = 'active';
        paginationList.appendChild(docFrag);
    }

    /**
     * метод отвечает за вывод дополнительных данных под таблицей
     * @param array data данных, которые необходимо отобразить под таблицей
     * @param object newSelectedPerson элемент таблицы, который нужно выделить ("чьи" дополнительные данные будут выведены)
     **/
    _renderAdditionalInfo(data,newSelectedPerson){
        let infoBlock = document.querySelector('.tableCmpt__additional-info'),
            selectedPerson = document.querySelector('tr.tableCmpt__selected');

        infoBlock.innerHTML = this._render('infoBlock', {list: data});
        document.body.scrollTop = document.body.scrollHeight;

        newSelectedPerson.classList.add('tableCmpt__selected');
        if (selectedPerson) selectedPerson.classList.remove('tableCmpt__selected');
        //this._addEventListeners();
    }

    /**
     * метод для использования внутри модуля - выполняет рендер данных по шаблону
     * @param string template название шаблона
     * @param array data массив данных, которые необходимо отобразить на странице
     **/
    _render(template,data) {
        let templateSource = this._layout[`${template}Template`],
            renderFn = Handlebars.compile(templateSource);

        return renderFn(data);
    }

    /**
     * метод отвечает за визуальное представление направления сортировки по определенному параметру
     * @param object element элемент таблицы (параметр сортировки), по которому кликнул пользователь
     * @param string order направление сортировки
     **/
    _onChangeLogoOrder(element, order){
        let span = element.children[0];
        this._onRemoveLogoOrder();
        span.className = `glyphicon glyphicon-arrow-${order}`;
    }

    /**
     * метод удаляет графическое отображение направления сортировки
     **/
    _onRemoveLogoOrder(){
        let arrows = document.querySelectorAll('.tableCmpt__table .glyphicon');
        for (let arr of arrows){
            arr.className='';
        }
    }

    /**
     * метод отвечает за "подсветку" активной страницы в пользовательской навигации
     * @param object pageButton элемент номера активной страницы
     **/
    _onChangeActivePage(pageButton){
        let li = pageButton.parentElement,
            ul = li.parentElement,
            activeLi = ul.querySelector('.active');

        li.classList.add('active');
        activeLi.classList.remove('active');
    }

    /**
     * метод отвечает за отображение кнопки поиска в зависимости от заполнения текстового поля поиска
     * @param object e системный объект события
     **/
    _onShowSearchButton(e){
        let searchButton = document.getElementById('tableCmpt__searchButton');
        (e.target.value)? searchButton.style.display = 'inline-block' : searchButton.style.display = 'none';
    }

    /**
     * метод "вешает" обработчики событий на компоненте
     **/
    _addEventListeners(){
        let table = document.querySelector('#tableComponent .tableCmpt__table'),
            searchField = document.querySelector('#tableComponent #tableCmpt__searchField'),
            searchButton = document.querySelector('#tableComponent #tableCmpt__searchButton'),
            resetButton = document.querySelector('#tableComponent #tableCmpt__resetButton'),
            pagination = document.querySelector('#tableComponent .tableCmpt__pagination nav');

        // добавляем обработчики событий для всех возможных интерактивных элементов
        searchField.addEventListener('input', this._onShowSearchButton);
        searchField.addEventListener('keypress', this._onSearchFieldChange);
        searchButton.addEventListener('click', this._onSearchButtonClick.bind(this));
        resetButton.addEventListener('click', this._onResetButtonClick.bind(this));
        table.addEventListener('click', this._onSortTable.bind(this));
        table.addEventListener('click', this._onShowInfo.bind(this));
        if (pagination) pagination.addEventListener('click', this._onPageChange.bind(this));
    }

    /**
     * метод определяет какие данные нужно отсортировать,по какому признаку и в каком направлении
     * @param object e системный объект события
     **/
    _onSortTable(e){
        let target = (e.target.classList.contains('glyphicon'))? e.target.parentElement : e.target,
            sortBy = target.dataset.sortBy;

        if (sortBy) {
            let order = (target.dataset.order =='down')? 'up' : 'down';

            target.dataset.order = order;
            this._onChangeLogoOrder(target, order);
            if (!this._isFoundData) {
                this._sortData(sortBy, order);
                this._changePageContent();
                this._sorting = [target,order];
            } else {
                this._shownData = this._sortData(sortBy, order, this._shownData);
                this._renderTableContent(this._shownData);
            }

        }
    }

    /**
     * метод определяет какие данные нужно отобразить под таблицей и вызывает метод их отображения
     * @param object e системный объект события
     **/
    _onShowInfo(e){
        let target = e.target,
            person = target.closest('tr'),
            id = person.dataset.personId,
            phone = person.dataset.personPhone;

        e.preventDefault();
        if (id && phone) {
            this._renderAdditionalInfo(this._getPersonById(id, phone),person);
        }
    }

    /**
     * метод определяет какую страницу данных необходимо отобразить и вызывает метод ее отображения
     * @param object e системный объект события
     **/
    _onPageChange(e){
        let target = e.target,
            pageNumber = target.dataset.pageNumber;

        e.preventDefault();
        if (pageNumber){
            this._currentPageNumber = pageNumber;
            this._changePageContent();
            this._onChangeActivePage(target);
        }
    }

    /**
     * метод обрабатывает нажатие кнопки поиска даных, введенных в поле поиска
     * @param object e системный объект события
     **/
    _onSearchButtonClick(e){
        let searchField = document.getElementById('tableCmpt__searchField'),
            resetButton = document.getElementById('tableCmpt__resetButton'),
            info = document.querySelector('.tableCmpt__additional-info'),
            value = searchField.value,
            [target, order] = this._sorting;

        if (value) {
            resetButton.style.display = 'inline-block';
            if (info) info.innerHTML = '';
            this._changePaginationVisibility('none');

            this._isFoundData = true;
            this._shownData = this._filterData(value);
            this._renderTableContent(this._shownData);
            if (target) {
                target = document.querySelector(`${target.tagName}[data-sort-by="${target.dataset.sortBy}"]`);
                this._onChangeLogoOrder(target, order);
            } else {
                this._onRemoveLogoOrder();
            }
        }
    }

    /**
     * метод обрабатывает нажатие кнопки очистки поиска данных
     * @param object e системный объект события
     **/
    _onResetButtonClick(e){
        let searchField = document.getElementById('tableCmpt__searchField'),
            searchButton = document.getElementById('tableCmpt__searchButton'),
            resetButton = document.getElementById('tableCmpt__resetButton'),
            [target, order] = this._sorting;

        searchField.value = '';
        resetButton.style.display = searchButton.style.display= 'none';
        this._changePaginationVisibility('block');

        if (target) {
            target = document.querySelector(`${target.tagName}[data-sort-by="${target.dataset.sortBy}"]`);
            this._onChangeLogoOrder(target, order);
        } else {
            this._onRemoveLogoOrder();
        }
        this._isFoundData = false;
        this._changePageContent();
    }

    /**
     * метод обрабатывает нажатие кнопки 'Enter' в поле поиска даных
     * @param object e системный объект события
     **/
    _onSearchFieldChange(e){
        let searchButton = document.getElementById('tableCmpt__searchButton');
        if (e.code == 'Enter' || e.code == 'NumpadEnter') searchButton.dispatchEvent(new MouseEvent('click'));
    }

    /**
     * метод определяет какой диапозон данных необходимо отобразить
     * и вызывает метод их отображения
     **/
    _changePageContent(){
        let start = this._currentPageNumber * this.maxDataAmountPerPage,
            end = start + this.maxDataAmountPerPage;

        this._shownData = this.data.slice(start,end);
        this._renderTableContent(this._shownData);
    }

    /**
     * метод выполняет поиск в полученных от сервера данных пользователя по id и номеру телефона
     * @param number id идентификатор пользователя
     * @param string phone номер телефона
     **/
    _getPersonById(id, phone){
        let fn = (obj) => {return (obj.id == id && obj.phone == phone)};
        return this.data.filter(fn);
    }

    /**
     * метод выполняет сортировку данных по переданным параметрам.
     * По умолчанию сортируется данные, полученные от сервера, иначе переданные данные
     * @param string by параметр сортировки, может принимать одно из следующих значений: id, firstName, lastName, email, phone
     * @param string order направление сортировки
     * @param array source (необязательный параметр) массив данных, которые необходимо отсортировать
     **/
    _sortData(by,order,source = this.data){
        let fn = (obj1,obj2) => {
            if (order === 'down') {
                if (obj1[by] < obj2[by]) return -1
                else return 1;
            }
            else if (order === 'up') {
                if (obj1[by] > obj2[by]) return -1
                else return 1;
            }
        };
        return source.sort(fn);
    }

    /**
     * метод выполняет фильтрацию в массиве данных, полученных от сервера, по данным, введеных пользователем в строку поиска
     * @param array source данные, введеные пользователем в строку поиска
     **/
    _filterData(source){
        source = source.toLowerCase();
        let fn = (obj) => {
            for (let param in obj){
                if (param !== 'description' && param !== 'adress'){
                    if (String(obj[param]).toLowerCase().indexOf(source) >= 0) return true
                }
            }
        };
        return this.data.filter(fn);
    }

    /**
     * метод изменяет свойство "style.display" у пагинации на переданный параметр
     * @param string state свойство style.display
     **/
    _changePaginationVisibility(state){
        let pagination = document.querySelector('.tableCmpt__pagination');
        if (pagination){
            pagination.style.display = state;
        }
    }
}

module.exports = TableComponent;