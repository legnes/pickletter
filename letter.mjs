export default class Letter {
  constructor(key) {
    this.key = key.toUpperCase();
    this.used = false;
  }

  setUsed(used) {
    this.used = used;
  }

  matches(key) {
    return !this.used && this.key === key.toUpperCase();
  }
}