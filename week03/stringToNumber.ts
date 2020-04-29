/*
 * @Author: your name
 * @Date: 2020-04-29 13:59:12
 * @LastEditTime: 2020-04-29 14:01:41
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \uap-admin-prodd:\工作内容\训练营\Frontend-01-Template\week03\stringToNumber.ts
 */

/**
 * @description: 字符串转换成num 
 * @param sourceStr: 字符 hex: 十进制以下
 * @return: 转换后的num
 */ 
function stringToNumber(sourceStr: string, hex: number = 10): number {
  if (hex > 10) return
  const flag = /e|E/.test(sourceStr);
  if (!flag) {
    let chars: string[] = sourceStr.split('');
    let number = 0;
    let idx = 0;
    while (idx < chars.length && chars[idx] !== '.') {
      number = number * hex;
      number += chars[idx].codePointAt(0) - '0'.codePointAt(0);
      idx++;
    }
    if (chars[idx] === '.') {
      idx++;
    }
    let fraction = 1;
    while (idx < chars.length) {
      fraction /= hex;
      number += (chars[idx].codePointAt(0) - '0'.codePointAt(0)) * fraction;
      idx++;
    }
    return number;
  } else {
    let logNumber = Number(sourceStr.match(/\d+$/)[0]);
    let number: any = sourceStr.match(/^[\d\.]+/)[0].replace(/\./, '');
    if (/e-|E-/.test(sourceStr)) {
      return Number(number.padEnd(logNumber + 1, 0));
    } else {
      return Number(number.padStart(logNumber + number.length, 0).replace(/^0/, '0.'));
    }
  }
}