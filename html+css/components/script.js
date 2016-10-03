/** Рейтинг **/
var rating = document.getElementById('rating-2');

rating.addEventListener('click', function(e){
    var span = e.target,
        star = span.getAttribute('data-star-number');

    if (star){
        rating.className = star + '-star';
    }
});
/** /Рейтинг **/


/** Кнопки + прогресс бар **/
var progressBar = document.getElementById('progress-bar');
var progress = progressBar.firstElementChild;
var percentage = progressBar.lastElementChild;
var animation;

document.addEventListener('click', function(e){
    var target = e.target;

    if (target.classList.contains('btn-small')) {
        progress.value = 20;
        percentage.textContent = progress.value + '%';
        clearInterval(animation);
    } else if (target.classList.contains('btn-big')){
        progress.value = 0;
        percentage.textContent = progress.value + '%';
        clearInterval(animation);
    } else if (target.classList.contains('btn-medium')){
        function fn(){
            if (progress.value == '100') clearInterval(animation);
            progress.value += 1;
            percentage.textContent = progress.value + '%';
        }
        animation = setInterval(fn, 100);
    }
});
/** /Кнопки + прогресс бар **/

