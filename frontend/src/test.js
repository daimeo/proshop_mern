// // IIFE
// (function b() {
//     var foo = "hello";
//     console.log(foo);
// })();
// console.log();
//
// // Non IIFE
// function a() {
//     var bar = "world";
//     console.log(bar);
// }
// a();

// import { Base64 } from "js-base64";
const { Base64 } = require("js-base64");

let image = "../uploads/image-1675147033173.png";
let latin = "dankogai";
let utf8 = "小飼弾";
let u8s = new Uint8Array([100, 97, 110, 107, 111, 103, 97, 105]);
console.log(Base64.encode(image));
console.log(Base64.encode(latin)); // ZGFua29nYWk=
console.log(Base64.encode(latin, true)); // ZGFua29nYWk skips padding
console.log(Base64.encodeURI(latin)); // ZGFua29nYWk
console.log(Base64.btoa(latin)); // ZGFua29nYWk=
// Base64.btoa(utf8); // raises exception
Base64.fromUint8Array(u8s); // ZGFua29nYWk=
Base64.fromUint8Array(u8s, true); // ZGFua29nYW which is URI safe
Base64.encode(utf8); // 5bCP6aO85by+
Base64.encode(utf8, true); // 5bCP6aO85by-
Base64.encodeURI(utf8); // 5bCP6aO85by-

console.log(Base64.decode("Li4vdXBsb2Fkcy9pbWFnZS0xNjc1MTQ3MDMzMTczLnBuZw=="));
console.log(Base64.decode("ZGFua29nYWk=")); // dankogai
console.log(Base64.decode("ZGFua29nYWk")); // dankogai
console.log(Base64.atob("ZGFua29nYWk=")); // dankogai
// Base64.atob("5bCP6aO85by+"); // 'å°�é£¼å¼¾' which is nonsense
console.log(Base64.toUint8Array("ZGFua29nYWk=")); // u8s above
console.log(Base64.decode("5bCP6aO85by+")); // 小飼弾
// note .decodeURI() is unnecessary since it accepts both flavors
console.log(Base64.decode("5bCP6aO85by-")); // 小飼弾
//
// Base64.isValid(0); // false: 0 is not string
// Base64.isValid(""); // true: a valid Base64-encoded empty byte
// Base64.isValid("ZA=="); // true: a valid Base64-encoded 'd'
// Base64.isValid("Z A="); // true: whitespaces are okay
// Base64.isValid("ZA"); // true: padding ='s can be omitted
// Base64.isValid("++"); // true: can be non URL-safe
// Base64.isValid("--"); // true: or URL-safe
// Base64.isValid("+-"); // false: can't mix both
