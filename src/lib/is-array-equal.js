export default function isArrayEqual(arrA = [], arrB = []) {
  return JSON.stringify(arrA.sort()) === JSON.stringify(arrB.sort());
}
