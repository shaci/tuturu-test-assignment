### Верстка компонентов

1. Все сверстанные компоненты содержатся в директории `components` в одном файле `index.html`
2. Сверстанная тестовая страница находится в директории `test-page`
3. Эффект blur можно создать при помощи втроенных в браузер фильтров (`filter: blur(параметр)`). Однако IE < 13 такой способ не поддерживает. Хотя у IE начиная с 8 версии есть свой фильтр (`filter: progid:DXImageTransform.Microsoft.Blur(параметры)`), он у меня отказался работать. Второй способ - это использовать фильтры в svg, а потом применить их к нужному элементу. Например:
 ```
 <svg version="1.1" xmlns="http://www.w3.org/2000/svg">
    <filter id="blur">
        <feGaussianBlur stdDeviation="3" />
    </filter>
 </svg>
 ...
 .img{
    filter: url('#blur');
 }
 ```
 Из двух способов я бы использовал первый, так как он поддерживается свеми современными браузерами и очень прост в использовании без применения сторонних стредств.


Тестировал в разных браузерах (Chrome, Firefox, IE11 с эмуляцией вплоть до 9), проверял соответствие внешнего вида заданию, в том чиссле при различном масштабе. Для тестирования мобильный версий использую инструменты Chrome Dev Tools.
 Мое рабочее окружение состоит из следующих составляющих:
 - ОС Windows 10
 - IDE PhpStorm 2016.2
 - браузеры Chrome, Firefox, IE Edge, IE11
