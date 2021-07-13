
export const uuidv4 = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c == 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

export class Logger {
  constructor(prefix, color) {
    this.prefix = prefix
    this.color = color
  }

  log(...msg) {
    console.log(`%c[${this.prefix}]`, this.color, ...msg)
    return this
  }
}