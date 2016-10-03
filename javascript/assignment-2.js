function checkSyntax(source){
    let brackets = {
            '<': {type: 1, inverse: false},
            '>': {type: 1, inverse: true},
            '[': {type: 2, inverse: false},
            ']': {type: 2, inverse: true},
            '{': {type: 3, inverse: false},
            '}': {type: 3, inverse: true},
            '(': {type: 4, inverse: false},
            ')': {type: 4, inverse: true}
        },
        stack = [];

    if (typeof source != 'string') throw ('The param should be a type of String');
    for (let i = 0, len = source.length; i < len; i++){
        if (!brackets[source[i]]) continue;
        if (!brackets[source[i]].inverse){
            stack.push(brackets[source[i]]);
        } else {
            if (stack.length && stack[stack.length - 1].type === brackets[source[i]].type) {
                stack.pop();
            } else {
                return 1;
            }
        }
    }
    return (stack.length == 0)? 0 : 1;
}

checkSyntax("---(++++)----"); // == 0
checkSyntax(""); // -> 0
checkSyntax("before ( middle []) after "); // == 0
checkSyntax(") ("); // == 1
checkSyntax("} {"); // == 1
checkSyntax("<(   >)"); // == 1
checkSyntax("(  [  <>  ()  ]  <>  )"); // == 0
checkSyntax("   (      [)"); // == 1
