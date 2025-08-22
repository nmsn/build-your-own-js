// 方法一
obj[Symbol.iterator] = function() {
	const keys = Object.keys(this);
  let count = 0;
  
  return {
  	next() {
    	if (count < keys.length) {
      	return { value: obj[keys[count++]], done: false };
      }       
      return { value: undefined, done: true };
    }
  }
}



// 方法二
obj[Symbol.iterator] = function*() {
	const keys = Object.keys(this);
	for (let i of keys) {
  	yield obj[i];
  }
}

// 测试用例
// const obj = {
// 	a: 1,
// 	b: 2,
//   c: 3,
// }

// for(let i of obj) {
// 	console.log(i);
// }