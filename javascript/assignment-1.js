"use strict";

function dscount(source){
    let string = source[0].toLowerCase(),
        substr = (source[1].toString() + source[2].toString()).toLowerCase(),
        count = 0;

    for (let i = 0, len = string.length; i < len; i++){
        if (string.startsWith(substr, i)) count++;
    }
    return count;
};

// Для удобства можно использовать эти тесты:
try {
    test(dscount, ['ab___ab__', 'a', 'b'], 2);
    test(dscount, ['___cd____', 'c', 'd'], 1);
    test(dscount, ['de_______', 'd', 'e'], 1);
    test(dscount, ['12_12__12', '1', '2'], 3);
    test(dscount, ['_ba______', 'a', 'b'], 0);
    test(dscount, ['_a__b____', 'a', 'b'], 0);
    test(dscount, ['-ab-аb-ab', 'a', 'b'], 2);
    test(dscount, ['aAa', 'a', 'a'], 2);

    console.info("Congratulations! All tests passed successfully.");
} catch(e) {
    console.error(e);
}

// Простая функция тестирования
function test(call, args, count) {
    let r = (call(args) === count);
    console.assert(r, `Finded items count: ${count}`);
    if (!r) throw "Test failed!";
}