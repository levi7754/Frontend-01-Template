/*
 * @Author: your name
 * @Date: 2020-04-29 13:53:30
 * @LastEditTime: 2020-04-29 13:53:34
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: \uap-admin-prodd:\工作内容\训练营\Frontend-01-Template\week03\numberToString.ts
 */
 
/**
 * Convert Number to String
 * @param number 数字
 * @param hex 进制
 */
function numberToString(sourceNum: number, hex: number): string {
  let integer: number = Math.floor(sourceNum)
  let fraction: string[] | string = String(sourceNum).match(/\.\d+$/)
  if (fraction) {
    fraction = fraction[0].replace('', '')
  }
  let result: string = ''
  while (integer > 0) {
    result = String(integer % hex) + result
    integer = Math.floor(integer / hex)
  }
  return fraction ? `${result}.${fraction}` : result
}