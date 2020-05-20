/*
 * @Author: your name
 * @Date: 2020-05-19 19:41:38
 * @LastEditTime: 2020-05-20 20:51:47
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \uap-admin-prodd:\工作内容\Project\训练营\20200510\cssRules.js
 */ 
const css = require('css')
let rules = [];

function match(element, selector) {
  if (!selector || !element.attributes) {
    return false;
  }
  if (selector.charAt(0) === "#") {
    const attr = element.attributes.filter(f => f.name === "id")[0]
    if (attr && attr.value === selector.replace("#", "")) {
      return true;
    }
  } else if (selector.charAt(0) === ".") {
    const attr = element.attributes.filter(f => f.name === "class")[0]
    if (attr && attr.value === selector.replace(".", "")) {
      return true;
    }
  } else {
    if (element.tagName === selector) {
      return true;
    }
  }
}

function specificity(selector) {
  const p = [0, 0, 0, 0];
  const selectorParts = selector.split(" ")
  for (const part of selectorParts) {
    if (part.charAt(0) === "#") {
      p[1] += 1;
    } else if (part.charAt(0) === ".") {
      p[2] += 1;
    } else {
      p[3] += 1;
    }
  }
  return p;
}

function compare(sp1, sp2) {
  if (sp1[0] - sp2[0]) {
    return sp1[0] - sp2[0]
  } else if (sp1[1] - sp2[1]) {
    return sp1[1] - sp2[1]
  } else if (sp1[2] - sp2[2]) {
    return sp1[2] - sp2[2]
  }
  return  sp1[3] - sp2[3]
}

module.exports.addCssRules = function addCssRules(text) {
  const ast = css.parse(text);
  rules.push(...ast.stylesheet.rules);
}

module.exports.computeCss = function computeCss(element, stack) {
  // console.log(element)
  const elements = stack.slice().reverse()
  if (!element.computedStyle) {
    element.computedStyle = {}
  }
  for (let rule of rules) {
    const selectorParts = rule.selectors[0].split(" ").reverse()
    if (!match(element, selectorParts[0])) continue;
    let j = 1;
    let matched = false;
    for (let i = 0; i < elements.length; i++) {
      if (match(elements[i], selectorParts[j])) {
        j++;
      }
    }
    if (j >= selectorParts.length) {
      matched = true
    }
    if (matched) {
      // 
      const sp = specificity(rule.selectors[0])
      const computedStyle = element.computedStyle;
      for (const declaration of rule.declarations) {
        if (!computedStyle[declaration.property]) {
          computedStyle[declaration.property] = {}
        }
        if (!computedStyle[declaration.property].specificity) {
          computedStyle[declaration.property].value = declaration.value;
          computedStyle[declaration.property].specificity = sp;
        } else if (compare(computedStyle[declaration.property].specificity, sp) < 0) {
          computedStyle[declaration.property].specificity = sp;
          computedStyle[declaration.property].value = declaration.value
        }
      }
      // console.log(element.computedStyle)
    }
  }
  return element;
}