['1', '2', '3'].map(parseInt)

// 【1, NaN, NaN】

/**
 * map 函数的参数是 (element, index, array)
 * parseInt 接收两个参数（string, radix）,string 是要解析的字符串，radix 是 2-36 之间的整数，表示被解析字符串的基数
 * map 方法会为每个元素调用 parseInt 函数，传递元素作为 str 参数，索引作为 radix 参数(2-36 的整数，如果超出这个范围则返回 NaN，假如指定 0 或未指定（undefined），基础将会根据字符串的值进行推算)
 * 推算规则如下：
 *  如果输入的 string 以 0x 或 0X 开头，那么 radix 被假定为 16
 *  如果输入的 string 以 0 开头，那么 radix 被假定为 8（在严格模式下无效）
 *  如果输入的 string 以其他任何值开头，那么 radix 被假定为 10
 * 因此，第一个元素 '1' 被解析为 1（基数为 10），第二个元素 '2' 被解析为 NaN（基数为 2），第三个元素 '3' 被解析为 NaN（基数为 3）
 */