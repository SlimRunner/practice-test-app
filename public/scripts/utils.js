export const mod = (n, m) => (n * m >= 0 ? n % m : n % m + m);

export class CycList {
  constructor({
    start,
    finish,
    multipleof = 1,
    displacement = 0,
    shuffled = false
  }) {
    const sortedList = Array.from(
      rangeIt(start, finish, multipleof, displacement)
    );
    let tempList = [];
    if (shuffled) {
      tempList = shuffle(sortedList);
    } else {
      tempList = sortedList;
    }
    const list = tempList.map(e => e);
    this._list = list;
    this._index = 0;
    this._length = list.length;
    console.log(this._list);
  }

  _changeIndex(delta) {
    this._index = mod(this._index + delta, this._length);
    return this._index;
  }

  at(index) {
    this._index = mod(index, this._length);
    return this._list[this._index];
  }

  current() {
    return this._list[this._index];
  }

  next() {
    return this._list[this._changeIndex(1)];
  }

  prev() {
    return this._list[this._changeIndex(-1)];
  }
}

export function shuffle(l) {
  return l
    .map(e => [e, Math.random()])
    .sort((a, b) => b[1] - a[1])
    .map(e => e[0]);
}

export function* rangeIt(a, b, m, nth = 0) {
  if (a === b) {
    yield a;
    return;
  }
  let i = a;
  let n = mod(nth, m);
  let s = Math.sign(b - a);
  if (i % m !== n) {
    i += (s >= 0 ? m - mod(i - n, m) : -mod(i - n, m));
    if (!(s >= 0 ? (i <= b) : (i >= b))) return;
  }
  while ((s >= 0 ? (i <= b) : (i >= b))) {
    yield i;
    i += s * m;
  }
}

export function* listIt({
  start,
  finish,
  multipleof = 1,
  displacement = 0,
  shuffled = false
}) {
  const sortedList = Array.from(
    rangeIt(start, finish, multipleof, displacement)
  );
  let tempList = [];
  if (shuffled) {
    tempList = shuffle(sortedList);
  } else {
    tempList = sortedList;
  }
  const list = tempList.map(e => e);

  let i = 0;
  let len = list.length;

  while (true) {
    yield list[i];
    i = (i + 1) % len;
  }
}
