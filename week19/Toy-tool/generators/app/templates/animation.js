export class TimeLine{
  constructor() {
    this.animations = new Set()
    this.finishAnimations = new Set();
    this.requestId = null
    this.addTimes = new Map()
    this.state = "inited"
  }
  tick() {
    let t = Date.now() - this.startTime
    for (let animation of this.animations) {
      const { object, property, template, duration, delay, timingFun } = animation
      const addTime = this.addTimes.get(animation)
      if (t < delay + addTime)
        continue;

      let progression = timingFun((t - delay - addTime) / duration);

      if (t > duration + delay + addTime) {
        progression = 1;
        this.animations.delete(animation);
        this.finishAnimations.add(animation);
      }
      const value = animation.valueFromProgression(progression);
      // console.log(value);
      object[property] = template(value);
    }
    if (this.animations.size) {
      this.requestId = requestAnimationFrame(() => this.tick());
    } else {
      this.requestId = null;
    }
  }
  start() {
    if (this.state !== 'inited')
      return;
    this.state = "playing";
    this.startTime = Date.now();
    this.tick();
  }
  // 暂停
  pause() {
    if (this.state !== 'playing')
      return;
    this.state = "pause";
    this.pauseTime = Date.now(); // 用于重启
    if (this.requestId) {
      cancelAnimationFrame(this.requestId);
      this.requestId = null;
    };
  }
  // 继续
  resume() {
    if (this.state !== 'pause')
      return;
    this.state = "playing";
    this.startTime += Date.now() - this.pauseTime;
    this.tick();
  }
  // 重置
  reset() {
    if (this.state === 'playing') 
      this.pause();
    this.animations = new Set();
    this.finishAnimations = new Set();
    this.requestId = null;
    this.startTime = Date.now();
    this.addTimes = new Map();
    this.pauseTime = null;
    this.state = "inited";
  }
  // 重新开始
  restart() {
    if (this.state === 'playing') 
      this.pause();
    for (const animation of this.finishAnimations) {
      this.animations.add(animation)
    }
    this.finishAnimations = new Set();
    this.requestId = null;
    this.startTime = Date.now();
    this.pauseTime = null;
    this.state = 'playing';
    this.tick();
  }
  add(animation, addTime) {
    this.animations.add(animation);
    if (this.state === 'playing' && !this.requestId)
      this.tick();
    if (this.state === 'playing')
      this.addTimes.set(animation, addTime !== void 0 ? addTime : Date.now() - this.startTime)
    else
    this.addTimes.set(animation, addTime !== void 0 ? addTime : 0);
  }
}
export class Animation{
  constructor(object, property, start, end, duration, delay, timingFun, template) {
    this.object = object;
    this.template = template;
    this.property = property;
    this.start = start;
    this.end = end;
    this.duration = duration;
    this.delay = delay;
    this.timingFun = timingFun;
  }
  valueFromProgression(progression) {
    return this.start + progression * (this.end - this.start)
    
  }
}
export class ColorAnimation{
  constructor(object, property, start, end, duration, delay, timingFun, template) {
    this.object = object;
    this.template = template || ((v) => `rgba(${v.r}, ${v.g},${v.b}, ${v.a})`);
    this.property = property;
    this.start = start;
    this.end = end;
    this.duration = duration;
    this.delay = delay;
    this.timingFun = timingFun;
  }
  valueFromProgression(progression) {
    return {
      r: this.start.r + progression * (this.end.r - this.start.r),
      g: this.start.g + progression * (this.end.g - this.start.g),
      b: this.start.b + progression * (this.end.b - this.start.b),
      a: this.start.a + progression * (this.end.a - this.start.a)
    }
    
  }
}