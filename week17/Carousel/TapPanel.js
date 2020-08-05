import { createElement, Text, Wrapper } from './createElement';

import { TimeLine, Animation} from './animation'
import { ease } from './cubicBezier.js'

class TapPanel {
  constructor() {
  }

  setAttribute(name, value) {
    this[name] = value;
  }
  getAttribute(child) {
    return this[name] = value;
  }

  select(i) {
    for (const view of this.childViews) {
      view.style.display = 'none'
    }
    this.childViews[i].style.display = ''
    for (const view of this.titleViews) {
      view.classList.remove('selected')
    }
    this.titleViews[i].classList.add('select')
  }

  render() {
  this.childViews = this.children.map(child => <div style="widthL 300px;height:300px;">{child}</div>)
  this.titleViews = this.children.map((title, i) => <span onClick={() => this.select(i)}
    style="background-color: orangeRed;width: 300px;height:300px;">{title}</span>)
    setTimeout(() => this.select(0), 16);
    return <div class="tab-panel">
      <h1 style="margin: 0;width: 300px;">{this.titleViews}</h1>
      <div style="border: 1px solid lightgreen;">
        {this.childViews}
      </div>
    </div>
  }

  mountTo(parent) {
    this.render().mountTo(parent)
  }
}

// let component = <Carousel data={[
//   "https://static001.geekbang.org/resource/image/bb/21/bb38fb7c1073eaee1755f81131f11d21.jpg",
//   "https://static001.geekbang.org/resource/image/1b/21/1b809d9a2bdf3ecc481322d7c9223c21.jpg",
//   "https://static001.geekbang.org/resource/image/b6/4f/b6d65b2f12646a9fd6b8cb2b020d754f.jpg",
//   "https://static001.geekbang.org/resource/image/73/e4/730ea9c393def7975deceb48b3eb6fe4.jpg",
// ]} />

// component.mountTo(document.body)