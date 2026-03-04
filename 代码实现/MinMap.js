class MinHeap {
  constructor(compare = (a, b) => a - b) {
    this.data = [];
    this.compare = compare; // < 0 表示 a 更小
  }

  size() {
    return this.data.length;
  }

  peek() {
    return this.data.length === 0 ? null : this.data[0];
  }

  push(value) {
    this.data.push(value);
    this._siftUp(this.data.length - 1);
  }

  pop() {
    const n = this.data.length;
    if (n === 0) return null;
    if (n === 1) return this.data.pop();

    const top = this.data[0];
    this.data[0] = this.data.pop();
    this._siftDown(0);
    return top;
  }

  _siftUp(i) {
    while (i > 0) {
      // 1) 计算当前节点的父节点下标
      const p = Math.floor((i - 1) / 2);

      // 2) 如果当前节点比父节点小，则交换并继续向上比较
      if (this.compare(this.data[i], this.data[p]) < 0) {
        [this.data[i], this.data[p]] = [this.data[p], this.data[i]];
        i = p; // 交换后，当前位置变成父节点，继续上滤
      } else {
        // 3) 当前节点已经不小于父节点，堆性质满足，结束
        break;
      }
    }
  }

  _siftDown(i) {
    const n = this.data.length;
    while (true) {
      // 1) 计算左右子节点下标
      const l = i * 2 + 1;
      const r = i * 2 + 2;
      let smallest = i;

      // 2) 在“当前节点、左子、右子”中找最小值下标
      if (l < n && this.compare(this.data[l], this.data[smallest]) < 0) {
        smallest = l;
      }
      if (r < n && this.compare(this.data[r], this.data[smallest]) < 0) {
        smallest = r;
      }

      // 3) 如果最小值不是当前节点，交换并继续向下比较
      if (smallest !== i) {
        [this.data[i], this.data[smallest]] = [this.data[smallest], this.data[i]];
        i = smallest;
      } else {
        // 4) 当前节点已经不大于子节点，堆性质满足，结束
        break;
      }
    }
  }
}

// ===== 使用示例1：数字 =====
const heap1 = new MinHeap();
[5, 3, 8, 1, 6].forEach(v => heap1.push(v));
console.log(heap1.peek()); // 1
while (heap1.size()) {
  console.log(heap1.pop()); // 1,3,5,6,8
}

// ===== 使用示例2：任务对象（像 Scheduler）=====
const taskHeap = new MinHeap((a, b) => a.sortIndex - b.sortIndex);

taskHeap.push({ id: 1, sortIndex: 50 });
taskHeap.push({ id: 2, sortIndex: 10 });
taskHeap.push({ id: 3, sortIndex: 30 });

console.log(taskHeap.peek()); // { id: 2, sortIndex: 10 }
console.log(taskHeap.pop());  // { id: 2, sortIndex: 10 }