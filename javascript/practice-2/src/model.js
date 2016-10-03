module.exports = {

    /**
     * метод выполняет ajax-запрос к серверу
     * @param string url адрес сервера
     **/
    sendRequest(url){
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
        })
    },

    /**
     * метод выполняет поиск в полученных от сервера данных пользователя по id и номеру телефона
     * @param number id идентификатор пользователя
     * @param string phone номер телефона
     **/
    getPersonById(id, phone){
        let fn = (obj) => {return (obj.id == id && obj.phone == phone)};
        return this.data.filter(fn);
    },

    /**
     * метод выполняет сортировку данных по переданным параметрам.
     * По умолчанию сортируется данные, полученные от сервера, иначе переданные данные
     * @param string by параметр сортировки, может принимать одно из следующих значений: id, firstName, lastName, email, phone
     * @param string order направление сортировки
     * @param array source (необязательный параметр) массив данных, которые необходимо отсортировать
     **/
    sortData(by,order,source = this.data){
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
    },

    /**
     * метод выполняет фильтрацию в массиве данных, полученных от сервера, по данным, введеных пользователем в строку поиска
     * @param array source данные, введеные пользователем в строку поиска
     **/
    filterData(source){
        source = source.toLowerCase();
        let fn = (obj) => {
            for (let param in obj){
                if (param !== 'description' && param !== 'adress'){
                    if (String(obj[param]).toLowerCase().indexOf(source) >= 0) return true
                }
            }
        };
        return this.data.filter(fn);
    },

    shownData: [], // текущие отображаемые данные

    data: [] // данные, полученные от сервера
};