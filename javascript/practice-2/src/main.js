let Controller = require('./controller');
let View = require('./view');

let dataButtons = document.querySelector('#dataButtons'),
    table = document.querySelector('.table'),
    pagination = document.querySelector('nav'),
    searchField = document.querySelector('#searchField'),
    searchButton = document.querySelector('#searchButton'),
    resetButton = document.querySelector('#resetButton');

// добавляем обработчики событий для всех возможных интерактивных элементов
dataButtons.addEventListener('click', Controller.onDataButtonClick.bind(Controller));
searchField.addEventListener('input', View.onShowSearchButton);
searchField.addEventListener('keypress', Controller.onSearchFieldChange);
searchButton.addEventListener('click', Controller.onSearchButtonClick.bind(Controller));
resetButton.addEventListener('click', Controller.onResetButtonClick.bind(Controller));
table.addEventListener('click', Controller.onSortTable.bind(Controller));
table.addEventListener('click', Controller.onShowInfo);
pagination.addEventListener('click', Controller.onPageChange.bind(Controller));
