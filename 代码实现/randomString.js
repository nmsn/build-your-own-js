// 推荐写法：字母 + 数字（62 个字符）
function randomString(len = 16) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  
  // 现代写法（性能更好）
  // return Array.from({ length: len }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
  
  for (let i = 0; i < len; i++) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }
  return result;
}

console.log(randomString(10));     // 如：K7pL9xR2mQ
console.log(randomString(21));     // 如：aB3cD5eF7gH9iJ1kL2mN

// 利用 toString(36) 把随机数转为 0-9a-z 字符（36进制）
const shortRandom = (len = 10) =>
  Math.random().toString(36).substring(2, 2 + len);

// 或更稳定一点（拼接两次避免太短）
const shortRandomBetter = (len = 10) =>
  (Math.random().toString(36) + Math.random().toString(36)).substring(2, 2 + len);

console.log(shortRandom(8));       // 如：3f7k9p2m
console.log(shortRandomBetter(12)); // 如：x8b4nq2r5j1p
