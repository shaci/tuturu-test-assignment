function func(s, a, b) {
   if (typeof s != 'string' ||
       typeof a != 'string' ||
       typeof b != 'string') throw ('All the params should be a type of String');
   if (s.length == 0) return -1;

   var aIndex = s.lastIndexOf(a),
       bIndex = s.lastIndexOf(b);

   aIndex = (aIndex == 0)? -1 : aIndex;
   bIndex = (bIndex == 0)? -1 : bIndex;

   return Math.max(aIndex, bIndex);
}

console.log(func('123','1','3'));
console.log(func(123,'1','3'));