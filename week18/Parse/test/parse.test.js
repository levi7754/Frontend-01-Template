import { parseHTML } from "../src/parser";
import { count } from "console";
import { prototype } from "stream";
// const add = require("../src/add.js");
const assert = require("assert");
describe('add', function() {
  parseHTML("<div></div>")
});
it("paser a single element", () => {
  const doc = parseHTML("<div></div>")
  const div = doc.children[0]
  assert.equal(div.tagName, "div");
  assert.equal(div.children.length, 0);
  assert.equal(div.type, "element");
  assert.equal(div.attributes.length, 2);
})

it("paser a single element with text content", () => {
  const doc = parseHTML("<div>levi</div>")
  const text = doc.children[0].children[0]
  assert.equal(text.content, "levi");
  assert.equal(text.type, "text");
  // console.log(text);
})

it("tag missmatch", () => {
  try {
    const doc = parseHTML("<div></liv>")
  } catch (e) {
    assert.equal(e.message, "Tag start end doesn't match!");
  }
})

it("text with", () => {

  const doc = parseHTML("<div>a < b</div>")
  const text = doc.children[0].children[0]
  assert.equal(text.content, "a < b");
  assert.equal(text.type, "text");
})
it("with property 1", () => {

  const doc = parseHTML("<div id=a class='cls' data=\"abc\"></div>")
  const div = doc.children[0]
  let count = 0;
  for (const attr of div.attributes) {
    if (attr.name === 'id') {
      count++;
      assert.equal(attr.value, "a");
    }
    if (attr.name === 'class') {
      count++;
      assert.equal(attr.value, "cls");
    }
    if (attr.name === 'data') {
      count++;
      assert.equal(attr.value, "abc");
    }
  }
  assert.ok(count === 3)
})

it('with property 2', () => {
  const doc = parseHTML("<div id=a class='cls' data=\"abc\"></div>")
  const div = doc.children[0]
  let count = 0;
  for (const attr of div.attributes) {
    if (attr.name === 'id') {
      count++;
      assert.equal(attr.value, "a");
    }
    if (attr.name === 'class') {
      count++;
      assert.equal(attr.value, "cls");
    }
    if (attr.name === 'data') {
      count++;
      assert.equal(attr.value, "abc");
    }
  }
  assert.ok(count === 3)
})
it('with property 3', () => {
  const doc = parseHTML("<div id=a class='cls' data=\"abc\" />")
  const div = doc.children[0]
  let count = 0;
  for (const attr of div.attributes) {
    if (attr.name === 'id') {
      count++;
      assert.equal(attr.value, "a");
    }
    if (attr.name === 'class') {
      count++;
      assert.equal(attr.value, "cls");
    }
    if (attr.name === 'data') {
      count++;
      assert.equal(attr.value, "abc");
    }
  }
  assert.ok(count === 3)
})

it('text with <', () => {
  let doc = parseHTML('<div>li < v</div>')
  let text = doc.children[0].children[0]
  assert.equal(text.content, 'li < v')
  assert.equal(text.type, 'text')
})

it('property error', () => {
  try {
    let doc = parseHTML('<div = ></div>')
  } catch (error) {
    assert.equal(error.message, 'prototype is error')
  }
})

it('script', () => {
  const content = `<div>abc</div>
    <span>span</span>
    /script>
    <script
    <
    </
    </s
    </sc
    </scr
    </scri
    </scrip
    </script
  `
  const doc = parseHTML(`<script>${content}</script>`)
  const text = doc.children[0].children[0]
  assert.equal(text.content, content);
  assert.equal(text.type, "text");
})



it('with property with no value', () => {
  const doc = parseHTML("<div class='cls'/>")
})
it("attribute with no value", () => {
  let doc = parseHTML("<div class id/>");
});

it('tag selfClosing', () => {
  let doc = parseHTML('<div l e v=i/>')
  let div = doc.children[0]
  
  assert.equal(div.tagName, 'div')
  assert.equal(div.children.length, 0)
  assert.equal(div.type, 'element')
  assert.equal(div.attributes.length, 6)
})
it('tag selfClosing2', () => {
  let doc = parseHTML('<img levis/>')
  let img = doc.children[0]
  
  assert.equal(img.tagName, 'img')
  assert.equal(img.children.length, 0)
  assert.equal(img.type, 'element')
  assert.equal(img.attributes.length, 3)
})

it('tag selfClosing 3', () => {
  let doc = parseHTML('<img a=\'b\'/>')
  let img = doc.children[0]
  
  assert.equal(img.tagName, 'img')
  assert.equal(img.children.length, 0)
  assert.equal(img.type, 'element')
  assert.equal(img.attributes.length, 4)
})


it('br selfClosing', () => {
  let doc = parseHTML('<br/>')
  let br = doc.children[0]
  
  assert.equal(br.tagName, 'br')
  assert.equal(br.children.length, 0)
  assert.equal(br.type, 'element')
  assert.equal(br.attributes.length, 3)
})