export class TimeLine{
  constructor() {
    this.animations = []
    this.requestId = null
    this.state = "inited"
  }
  tick() {
    let t = Date.now() - this.startTime
    let animations = this.animations.filter(animation => !animation.finished)
    for (let animation of this.animations) {
      const { object, property, template, start, end, duration, delay, timingFun, addTime } = animation
      let progression = timingFun((t - delay - addTime) / duration);
      if (t > duration + delay + addTime) {
        progression = 1
        animation.finished = true
      }
      const value = animation.valueFromProgression(progression);
      object[property] = template(value);
    }
    if (animations.length) {
      this.requestId = requestAnimationFrame(() => this.tick())
    }
  }
  start() {
    if (this.state !== 'inited')
      return
    this.state = "playing"
    this.startTime = Date.now()
    this.tick()
  }
  // 暂停
  pause() {
    if (this.state !== 'playing')
      return
    this.state = "pause"
    this.pauseTime = Date.now(); // 用于重启
    this.requestId && cancelAnimationFrame(this.requestId);
  }
  // 继续
  resume() {
    if (this.state !== 'pause')
      return;
    this.state = "playing";
    this.startTime += Date.now() - this.pauseTime;
    this.tick();
  }
  // 重新开始
  restart() {
    if (this.state === 'playing') 
      this.pause();
    this.animations = [];
    this.requestId = null;
    this.state = "inited";
    this.startTime = Date.now();
    this.pauseTime = null;
    this.tick();
  }
  add(animation, addTime) {
    this.animations.push(animation);
    animation.finished = false;
    if (this.state === 'playing')
      animation.addTime = addTime !== void 0 ? addTime : Date.now() - this.startTime;
    else
      animation.addTime = addTime !== void 0 ? addTime : 0 
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