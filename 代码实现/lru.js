// LRU (Least Recently Used) 缓存实现
// 使用双向链表 + 哈希表实现 O(1) 时间复杂度的 get 和 put 操作

// 双向链表节点
class Node {
  constructor(key = 0, value = 0) {
    this.key = key;
    this.value = value;
    this.prev = null;
    this.next = null;
  }
}

class LRUCache {
  constructor(capacity) {
    this.capacity = capacity;
    this.cache = new Map(); // 哈希表，存储 key -> node 的映射
    
    // 创建虚拟头尾节点
    this.head = new Node();
    this.tail = new Node();
    this.head.next = this.tail;
    this.tail.prev = this.head;
  }
  
  // 获取缓存值
  get(key) {
    if (this.cache.has(key)) {
      const node = this.cache.get(key);
      // 将访问的节点移到头部（最近使用）
      this.moveToHead(node);
      return node.value;
    }
    return -1;
  }
  
  // 设置缓存值
  put(key, value) {
    if (this.cache.has(key)) {
      // 更新已存在的节点
      const node = this.cache.get(key);
      node.value = value;
      this.moveToHead(node);
    } else {
      // 添加新节点
      const newNode = new Node(key, value);
      
      if (this.cache.size >= this.capacity) {
        // 删除尾部节点（最久未使用）
        const tail = this.removeTail();
        this.cache.delete(tail.key);
      }
      
      this.cache.set(key, newNode);
      this.addToHead(newNode);
    }
  }
  
  // 将节点添加到头部
  addToHead(node) {
    node.prev = this.head;
    node.next = this.head.next;
    
    this.head.next.prev = node;
    this.head.next = node;
  }
  
  // 删除节点
  removeNode(node) {
    node.prev.next = node.next;
    node.next.prev = node.prev;
  }
  
  // 将节点移到头部
  moveToHead(node) {
    this.removeNode(node);
    this.addToHead(node);
  }
  
  // 删除尾部节点
  removeTail() {
    const lastNode = this.tail.prev;
    this.removeNode(lastNode);
    return lastNode;
  }
  
  // 获取当前缓存大小
  size() {
    return this.cache.size;
  }
  
  // 清空缓存
  clear() {
    this.cache.clear();
    this.head.next = this.tail;
    this.tail.prev = this.head;
  }
  
  // 打印当前缓存状态（用于调试）
  print() {
    const result = [];
    let current = this.head.next;
    while (current !== this.tail) {
      result.push(`${current.key}:${current.value}`);
      current = current.next;
    }
    console.log('LRU Cache:', result.join(' -> '));
  }
}

// 使用示例和测试
function testLRU() {
  console.log('=== LRU Cache 测试 ===');
  
  const lru = new LRUCache(3);
  
  // 测试基本操作
  lru.put(1, 'a');
  lru.put(2, 'b');
  lru.put(3, 'c');
  lru.print(); // 3:c -> 2:b -> 1:a
  
  console.log('get(2):', lru.get(2)); // 'b'，2 移到头部
  lru.print(); // 2:b -> 3:c -> 1:a
  
  lru.put(4, 'd'); // 容量满了，删除最久未使用的 1
  lru.print(); // 4:d -> 2:b -> 3:c
  
  console.log('get(1):', lru.get(1)); // -1，已被删除
  console.log('get(3):', lru.get(3)); // 'c'，3 移到头部
  lru.print(); // 3:c -> 4:d -> 2:b
  
  // 更新已存在的值
  lru.put(3, 'updated_c');
  lru.print(); // 3:updated_c -> 4:d -> 2:b
  
  console.log('当前缓存大小:', lru.size());
}

// 简化版 LRU 实现（仅使用 Map）
// map 能够记录顺序
class SimpleLRU {
  constructor(capacity) {
    this.capacity = capacity;
    this.cache = new Map();
  }
  
  get(key) {
    if (this.cache.has(key)) {
      const value = this.cache.get(key);
      // 删除后重新插入，利用 Map 的插入顺序特性
      this.cache.delete(key);
      this.cache.set(key, value);
      return value;
    }
    return -1;
  }
  
  put(key, value) {
    if (this.cache.has(key)) {
      this.cache.delete(key);
    } else if (this.cache.size >= this.capacity) {
      // 删除最旧的元素（Map 中第一个元素）
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }
    this.cache.set(key, value);
  }
  
  print() {
    console.log('Simple LRU:', Array.from(this.cache.entries()));
  }
}

// 简化版测试
function testSimpleLRU() {
  console.log('\n=== Simple LRU Cache 测试 ===');
  
  const simpleLru = new SimpleLRU(3);
  
  simpleLru.put(1, 'a');
  simpleLru.put(2, 'b');
  simpleLru.put(3, 'c');
  simpleLru.print();
  
  console.log('get(2):', simpleLru.get(2));
  simpleLru.print();
  
  simpleLru.put(4, 'd');
  simpleLru.print();
}

// 运行测试
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { LRUCache, SimpleLRU };
} else {
  testLRU();
  testSimpleLRU();
}