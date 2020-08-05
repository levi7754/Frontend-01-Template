import { enableGesture } from './gesture'
export function createElement(Cls, attributes, ...children) {
  let o
  if (typeof Cls === 'string') {
    o = new Wrapper(Cls)
  } else {
    o = new Cls();
  }

  for (const name in attributes) {
    // o[name] = attributes[name]
    o.setAttribute(name, attributes[name])
  }

  let visit = children => {
    for (const child of children) {
      if (typeof child === 'string') {
        child = new Text(child)
      } else if (typeof child === "object" && child instanceof Array) {
        visit(child)
        continue;
      }
      o.appendChild(child)
    }
  }

  visit(children)

  return o
}

export class Text {
  constructor(text) {
    this.children = []
    this.root = document.createTextNode(text)
  }
  mountTo(parent) {
    parent.appendChild(this.root);
  }
}

export class Wrapper {
  constructor(type) {
    this.children = []
    this.root = document.createElement(type)
  }

  setAttribute(name, value) {
    // this[name] = value;
    this.root.setAttribute(name, value);
    if (name.match(/^on([\s\S]+)$/)) {
      const eventName = RegExp.$1.replace(/^[\s\S]/, c => c.toLowerCase());
      this.addEventListener(eventName, value)
    }
    if (name === "enableGesture") {
      enableGesture(this.root)
    }
  }

  appendChild(child) {
    this.children.push(child)
    // child.mountTo(this.root)
  }

  addEventListener() {
    this.root.addEventListener(...arguments)
  }

  get style() {
    return this.root.style
  }

  set innerText(text) {
    return this.root.innerText = text
  }

  mountTo(parent) {
    parent.appendChild(this.root);
    for (let child of this.children) {
      child.mountTo(this.root)
    }
  }
}