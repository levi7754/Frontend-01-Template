// import {Carousel} from "./carousel.view";

import { createElement, Text, Wrapper } from './createElement';

import { TimeLine, Animation} from './animation'
import { ease } from './cubicBezier.js'

class Div {
  constructor() {
    this.children = []
    this.root = document.createElement("div")
  }

  setAttribute(name, value) {
    this.root.setAttribute(name, value);
  }

  appendChild(child) {
    this.children.push(child)
    // child.mountTo(this.root)
  }

  render() {
    this.slot = <div></div>
    return <div>
      {this.slot}
    </div>
  }

  mountTo(parent) {
    parent.appendChild(this.root);
    for (let child of this.children) {
      child.mountTo(this.root)
    }
  }
}

class Carousel {
  constructor() {
  }

  setAttribute(name, value) {
    this[name] = value;
  }

  render() {
    const timeLine = new TimeLine();
    timeLine.start();
    let nextPicStopHandler = null;

    let children = this.data.map((url, currentPos) => {
      const lastPos = (currentPos - 1 + this.data.length) % this.data.length
      const nextPos = (currentPos + 1) % this.data.length;
      let offset = 0;

      const onStart = () => {
        timeLine.pause();
        clearTimeout(nextPicStopHandler);

        let currentEl = children[currentPos];
        const currentTransformVal = Number(currentEl.style.transform.match(/translateX\(([\s\S]+)px\)/)[1]);
        offset = currentTransformVal + 500 * currentPos;
      }

      const onPan = event => {

        let lastEl = children[lastPos];
        let currentEl = children[currentPos];
        let nextEl = children[nextPos];
        
        const currentTransformVal = - 500  * currentPos + offset;
        const lastTransformVal = -500 - 500  * lastPos + offset;
        const nextTransformVal = 500 - 500 * nextPos + offset;
        // 拖拽距离
        const dx = event.clientX - event.startX;

        currentEl.style.transform = `translateX(${currentTransformVal + dx}px)`;
        lastEl.style.transform = `translateX(${lastTransformVal + dx}px)`;
        nextEl.style.transform = `translateX(${nextTransformVal + dx}px)`;
      }
      const onPanEnd = event => {
        let direction = 0;
        const dx = event.clientX - event.startX;
        if (dx + offset > 250 ) {
          direction  =1
        } else if(dx + offset < -250) {
          direction = -1
        }

        let lastEl = children[lastPos];
        let currentEl = children[currentPos];
        let nextEl = children[nextPos];

        timeLine.reset();
        timeLine.start();
 
        const lastAnimation = new Animation(lastEl.style, "transform",
        -500 - 500  * lastPos + offset + dx,
        -500 -500 * lastPos + direction * 500, 500, 0, ease, v => `translateX(${v}px)`);
        
        const currentAnimation = new Animation(currentEl.style, "transform",
        - 500  * currentPos + offset + dx,
          - 500 * currentPos + direction * 500, 500, 0, ease, v => `translateX(${v}px)`);
        
          const nextAnimation = new Animation(nextEl.style, "transform",
          500 - 500 * nextPos + offset + dx,
          500 - 500 * nextPos + direction * 500, 500, 0, ease, v => `translateX(${v}px)`)
        

        timeLine.add(lastAnimation)
        timeLine.add(currentAnimation)
        timeLine.add(nextAnimation)

        position = (position - direction + this.data.length) % this.data.length
        nextPicStopHandler = setTimeout(nextPick, 3000);
      }
      let element = <img src={url} onstart={onStart} onPan={onPan} onPanEnd={onPanEnd} enableGesture={true}/>
      element.style.transform = "translateX(0px)";
      element.addEventListener("dragstart", event => event.preventDefault());
      return element;
    })
    let position = 0
    let nextPick = () => {
      let nextPos = (position + 1) % this.data.length;
      let current = children[position]
      let next = children[nextPos]

      let currentAnimation = new Animation(current.style, "transform", -100 * position, -100 - 100 * position, 500, 0, ease, v => `translateX(${5 * v}px)`)
      let nextAnimation = new Animation(next.style, "transform", 100 - 100 * nextPos, - 100 * nextPos, 500, 0, ease, v => `translateX(${5 * v}px)`)
      
      timeLine.add(currentAnimation)
      timeLine.add(nextAnimation)
      // timeLine.start()
      
      position = nextPos

      // current.style.transition = "ease 0s"
      // next.style.transition = "ease 0s"

      // current.style.transform = `translateX(${- 100 * position}%)`
      // next.style.transform = `translateX(${100  - 100 * nextPos}%)`
      
      // setTimeout(() => {
        // current.style.transition = "" // 使用css动画 transition
        // next.style.transition = "" // 使用css动画 transition

        // current.style.transform = `translateX(${- 100 - 100 * position}%)`
        // next.style.transform = `translateX(${- 100 * nextPos}%)`
        // position = nextPos
      // }, 16);
      nextPicStopHandler = setTimeout(nextPick, 3000);
    }

    nextPicStopHandler = setTimeout(nextPick, 3000);
    return <div class="carousel">{children}</div>
  }

  mountTo(parent) {
    this.render().mountTo(parent)
  }
}

let component = <Carousel data={[
  "https://static001.geekbang.org/resource/image/bb/21/bb38fb7c1073eaee1755f81131f11d21.jpg",
  "https://static001.geekbang.org/resource/image/1b/21/1b809d9a2bdf3ecc481322d7c9223c21.jpg",
  "https://static001.geekbang.org/resource/image/b6/4f/b6d65b2f12646a9fd6b8cb2b020d754f.jpg",
  "https://static001.geekbang.org/resource/image/73/e4/730ea9c393def7975deceb48b3eb6fe4.jpg",
]} />

component.mountTo(document.body)