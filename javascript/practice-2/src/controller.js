let Model = require('./model');
let View = require('./view');

module.exports = {

    maxAmountPerPage: 50, // максимальное количество элементов на страницу

    currentPageNumber: 0, // текущая страница (отсчет идет с 0)

    isFoundData: false, // текущие отображаемые данные полученые путем фильтрации?

    sorting: [], // сохранение сортировки данных до перефильтрации данных

    /**
    * метод определяет какие необходимо загрузить данные и вызывает функцию их загрузки
    * @param object e системный объект события
    **/
    onDataButtonClick(e){
        let target = e.target,
            dataAmount = target.dataset.amount;

        if (dataAmount) {
            let url;
            switch (dataAmount){
                case 'few':
                    url = 'http://www.filltext.com/?rows=32&id={number|1000}&firstName={firstName}&lastName={lastName}&email={email}&phone={phone|(xxx)xxx-xx-xx}&adress={addressObject}&description={lorem|32}';
                    this._onSendRequest(url,target);
                    break;
                case 'loads':
                    url = 'http://www.filltext.com/?rows=1000&id={number|1000}&firstName={firstName}&delay=3&lastName={lastName}&email={email}&phone={phone|(xxx)xxx-xx-xx}&adress={addressObject}&description={lorem|32}';
                    this._onSendRequest(url,target);
                    break;
            }
            this.currentPageNumber = 0;
            //setTimeout(() => {elem.disabled = sibling.disabled = ''}, 5000);
        }
    },

    /**
     * метод определяет какие данные нужно отсортировать,по какому признаку и в каком направлении
     * @param object e системный объект события
     **/
    onSortTable(e){
        let target = (e.target.classList.contains('glyphicon'))? e.target.parentElement : e.target,
            sortBy = target.dataset.sortBy;

        if (sortBy) {
            let order = (target.dataset.order =='down')? 'up' : 'down';

            target.dataset.order = order;
            View.onChangeLogoOrder(target, order);
            if (!this.isFoundData) {
                Model.sortData(sortBy, order);
                this._onShowPageContent();
                this.sorting = [target,order];
            } else {
                Model.shownData = Model.sortData(sortBy, order, Model.shownData);
                View.onShowTableContent(Model.shownData);
            }

        }
    },

    /**
     * метод определяет какие данные нужно отобразить под таблицей и вызывает метод их отображения
     * @param object e системный объект события
     **/
    onShowInfo(e){
        let target = e.target,
            person = target.closest('tr'),
            id = person.dataset.personId,
            phone = person.dataset.personPhone;

        if (id && phone) {
            View.onShowAdditionalInfo(Model.getPersonById(id, phone),person);
        }
    },

    /**
     * метод определяет какую страницу данных необходимо отобразить и вызывает метод ее отображения
     * @param object e системный объект события
     **/
    onPageChange(e){
        let target = e.target,
            pageNumber = target.dataset.pageNumber;

        e.preventDefault();
        if (pageNumber){
            this.currentPageNumber = pageNumber;
            this._onShowPageContent();
            View.onChangeActivePage(target);
        }

    },

    /**
     * метод обрабатывает нажатие кнопки поиска даных, введенных в поле поиска
     * @param object e системный объект события
     **/
    onSearchButtonClick(e){
        let value = searchField.value,
            pagination = document.querySelector('nav'),
            info = document.querySelector('div[data-role="additional-info"]'),
            [target, order] = this.sorting;

        if (value) {

            info.innerHTML = '';
            resetButton.style.display = 'inline-block';
            pagination.style.display = 'none';

            this.isFoundData = true;
            Model.shownData = Model.filterData(value);
            View.onShowTableContent(Model.shownData);
            if (target) {
                target = document.querySelector(`${target.tagName}[data-sort-by="${target.dataset.sortBy}"]`);
                View.onChangeLogoOrder(target, order);
            }
        }
    },

    /**
     * метод обрабатывает нажатие кнопки очистки поиска данных
     * @param object e системный объект события
     **/
    onResetButtonClick(e){
        let pagination = document.querySelector('nav'),
            [target, order] = this.sorting;

        searchField.value = '';
        resetButton.style.display = searchButton.style.display= 'none';
        pagination.style.display = 'block';

        if (target) {
            target = document.querySelector(`${target.tagName}[data-sort-by="${target.dataset.sortBy}"]`);
            View.onChangeLogoOrder(target, order);
        }
        this.isFoundData = false;
        this._onShowPageContent();
    },

    /**
     * метод обрабатывает нажатие кнопки 'Enter' в поле поиска даных
     * @param object e системный объект события
     **/
    onSearchFieldChange(e){
        if (e.code == 'Enter' || e.code == 'NumpadEnter') searchButton.dispatchEvent(new MouseEvent('click'));
    },

    /**
     * метод для использования внутри модуля вызывет методы, отвечающие за:
     * 1) загрузку данных с сервера
     * 2) визуальное представление страницы во время и после загрузки данных
     * @param string url адрес, откуда нужно загрузить данные
     * @param object button элемент (кнопка), на котором сработал обработчик события. Нужна для изменения стиля кнопки
     **/
    _onSendRequest(url,button){
        View.onLoadingData();
        Model.sendRequest(url).then((response) => {
            Model.data = response;
            View.onReceiveData(button);
            // определяем объем полученных данных и способ их вывода
            if (response.length <= this.maxAmountPerPage) {
                Model.shownData = response;
                View.onShowTableContent(Model.shownData);
            } else {
                Model.shownData = response.slice(0,this.maxAmountPerPage);
                View.onShowTableContent(Model.shownData);
                View.onShowPagination(Math.ceil(response.length / this.maxAmountPerPage));
            }
        }).catch((error) => {
            // отлавливаем ошибки, возникающие при загрузке данных
            alert(error);
            console.error(error);
        });
    },

    /**
     * метод для использования внутри модуля определяет какой диапозон данных необходимо отобразить
     * и вызывает метод их отображения
     **/
    _onShowPageContent(){
        let start = this.currentPageNumber * this.maxAmountPerPage,
            end = start + this.maxAmountPerPage;

        Model.shownData = Model.data.slice(start,end);
        View.onShowTableContent(Model.shownData);
    }

};