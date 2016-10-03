let s1 = '☆',
    s2 = '★';

function drawRating(vote){
    if (vote >= 0 && vote <= 100){
        let star = Math.ceil(vote / 20) || 1,
            empty = 5 - star;
        return (s2.repeat(star) + s1.repeat(empty));
    }
}

console.log(drawRating(0) ); // ★☆☆☆☆
console.log(drawRating(1) ); // ★☆☆☆☆
console.log(drawRating(50)); // ★★★☆☆
console.log(drawRating(99)); // ★★★★★