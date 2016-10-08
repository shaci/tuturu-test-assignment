let TableComponent = require('./tableCmpt/tableCmpt');

let url = {
    few: 'http://www.filltext.com/?rows=32&id={number|1000}&firstName={firstName}&lastName={lastName}&email={email}&phone={phone|(xxx)xxx-xx-xx}&adress={addressObject}&description={lorem|32}',
    much: 'http://www.filltext.com/?rows=1000&id={number|1000}&firstName={firstName}&delay=3&lastName={lastName}&email={email}&phone={phone|(xxx)xxx-xx-xx}&adress={addressObject}&description={lorem|32}'
};

let dataButtons = document.querySelector('#dataButtons');

/**
 * функция выполняет ajax-запрос к серверу
 * @param string url адрес сервера
 **/
function sendRequest(url){
    return new Promise((resolve, reject) => {
        let xhr = new XMLHttpRequest();
        xhr.open('GET', url);
        xhr.responseType = 'json';
        xhr.send();
        xhr.addEventListener('load', () => {
            if (xhr.status == 200) {
                resolve(xhr.response);
            } else {
                reject('Невозможно получить данные от сервера!');
            }
        });
        xhr.addEventListener('error', (err) => {reject(err)});
    })
}

/**
 * функция отобразжает индикатор загрузки данных на странице во время загрузке данных с сервера
 **/
function showLoader(){
    let background = document.createElement('div'),
        loader = document.createElement('div'),
        docfrag = document.createDocumentFragment();
    background.className = 'loader__background';
    loader.className = 'loader__figure';
    docfrag.appendChild(background);
    docfrag.appendChild(loader);
    document.body.appendChild(docfrag);
}

/**
 * функция удаляет индикатор загрузки данных со страницы после загрузки данных с сервера
 **/
function hideLoader(){
    let background = document.querySelector('.loader__background'),
        loader = document.querySelector('.loader__figure');

    loader.remove();
    background.remove();
}

/**
 * функция обрабатывает клик по кнопкам загрузки даннных,
 * определяет какой объем данных нужно загрузить и вызывает функцию их загрузки
 * @param object e системный объект события
 **/
function buttonClickHandler(e){
    let button = e.target,
        dataAmount = button.dataset.amount;

    if (dataAmount) {
        showLoader();
        sendRequest(url[dataAmount]).then((response) => {
            let otherButton = button.parentElement.querySelector('.btn-success'),
                tableComponent = new TableComponent({data: response, maxDataAmountPerPage: 50});

            hideLoader();
            tableComponent.init();
            if (otherButton) otherButton.classList.remove('btn-success');
            button.classList.add('btn-success');
        }).catch((error) => {
            // отлавливаем ошибки, возникающие при загрузке данных
            alert(error);
            console.error(error);
        });
    }
}

dataButtons.addEventListener('click', buttonClickHandler);