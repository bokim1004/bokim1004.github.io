---
title: 함수와 일급 객체
date: 2022-06-05 16:06:79
category: javascript
thumbnail: { thumbnailSrc }
draft: false
---

| _모던 자바스크립트 DEEP DIVE를 읽고 공부한 부분을 기록합니다._

일급객체는 자바스크립트 공부하면서 많이 들어본 개념이고, 회사의 시니어 개발자 선배도 일급 객체는 꼭 알아두면 좋은 개념이라고 말씀하셨다!
그래서 이번에 일급객체는 무엇인지 공부해보았다.
일급객체는 도대체 무엇일까?

---

### 일급 객체

1.무명의 리터럴로 생성할 수 있다. 즉, 런타임에 생성이 가능하다.<br/> 2.변수나 자료구조(객체,배열등)에 저장할 수 있다.<br/> 3.함수의 매개변수에 전달할 수 있다.<br/> 4. 함수의 반환값으로 사용할 수 있다.

자바스크립트의 함수는 다음예제와 같이 위의 조건을 모두 만족하므로 `일급객체`다.

```js
//1.함수는 무명의 리터럴로 생성할 수 있다.
//2. 함수는 변수에 저장할 수 있다.
//런타임(할당 단계)에 함수 리터럴이 평가되어 함수 객체가 생성되고 변수에 할당된다.
const increase = function(num) {
  return ++num
}

const decrease = function(num) {
  return --num
}
//2. 함수는 객체에 저장할 수 있다.
const auxs = { increase, decrease }

//3. 함수의 매개변수에 전달할 수 있다.
//4.함수의 반환값으로 사용할 수 있다.
function makeCounter(aux) {
  let num = 0
  return function() {
    num = aux(num)
    return num
  }
}

//3.함수는 매개변수에게 함수를 전달할 수 있다.
const increaser = makeCounter(auxs.increase)
console.log(increaser()) //1
console.log(increaser()) //2

//3.함수는 매개변수에게 함수를 전달할 수 있다.
const decreaser = makeCounter(auxs.decrease)
console.log(decreaser()) //-1
console.log(decreaser()) //-2
```

함수가 일급 객체라는 것은 `함수를 객체와 동일하게 사용할 수 있다는 의미`다.
객체는 값이므로 함수는 값과 동일하게 취급할 수 있다. 따라서 함수는 값을 사용할 수 있는 곳이라면 어디서든지 리터럴로 정의할 수 있고 런타임에 함수 객체로 평가된다.

일급객체로서 함수가 가지는 가장 큰 특징은 일반 객체와 같이 함수의 매개변수에 전달할 수 있으며, 함수의 반환값으로 사용할 수도 있다는 것이다.

### 함수 객체의 프로퍼티

함수는 객체다. 따라서 함수도 프로퍼티를 가질 수 있다.

```js
function square(number) {
  return number * number
}
console.dir(square)
//===========
square(number)
arguments: null
caller: null
length: 1
name: 'square'
prototype: {
  constructor: f
}
_proto_: f()
```

arguments,caller,length,name,prototype 프로퍼티는 모두 함수 객체의 데이터 프로퍼티다.
이들 프로퍼티는 일반 객체에는 없는 함수 객체 고유의 프로퍼티다.
하지만 `__proto__`는 접근자 프로퍼티이며 함수 객체 고유의 프로퍼티가 아니라 Object.prototype 객체의 프로퍼티를 상속받은 것을 알 수 있다.
Object.prototype 객체의 프로퍼티는 모든 객체가 상속받아 사용할 수 있다.

### arguments 프로퍼티

함수 객체의 arguments프로퍼티값은 arguments객체다. arguments객체는 함수 호출시 전달된 인수들의 정보를 담고 있는 순회가능한 유사배열 객체이고,
함수 내부에서 지역 변수처럼 사용된다. 함수 외부에서는 참조할 수 없다.

함수를 정의할 때 선언한 매개변수는 함수 몸체 내부에서 변수와 동일하게 취급된다. 즉, 함수가 호출되면 함수 몸체 내에서 암묵적으로 매개변수가 선언되고 undefined로
초기화된 이후 인수가 할당된다.

```js
function multiply(x, y) {
  console.log(arguments)
  return x * y
}
console.log(multiply()) // Nan
console.log(multiply(1)) //Nan
console.log(multiply(1, 2)) //2
console.log(multiply(1, 2, 3)) //2
```

#### arguments객체의 Symbol(Symbol.iterator) 프로퍼티

arguments 객체의 Symbol프로퍼티는 arguments 객체를 순회 가능한 자료구조인 이터러블로 만들기 위한 프로퍼티다.
Symbol.iterator를 프로퍼티 키로 사용한 메서드를 구현하는 것에 의해 이터러블이 된다.

```js
function multiply(x, y) {
  //이터레이터
  const iterator = arguments[Symbol.iterator]()
  //이터레이터의 next메서드를 호출하여 이터러블 객체 arguments를 순회
  console.log(iterator.next()) //{value:1,done:false}
  console.log(iterator.next()) //{value:2, done:false}
  console.log(iterator.next()) // {value:3, done:false}
  console.log(iterator.next()) //{value:undefined, done:true}

  return x * y
}
multiply(1, 2, 3)
```

선언된 매개변수의 개수와 함수를 호출할 때 전달하는 인수의 개수를 확인하지 않는 자바스크립트의 특성때문에 함수가 호출되면
인수 개수를 확인하고 이에 따라 함수의 동작을 달리 정의할 필요가 있을 수 있다. 이 때, 유용하게 사용되는 것이 arguments객체다.
arguments객체는 매개변수 개수를 확정할 수 없는 `가변 인자 함수`를 구현할 때 유용하다.

```js
function sum() {
  let res = 0
  //arguments 객체는 length프로퍼티가 있는 유사 배열 객체이므로 for문으로 순회할 수 있다.
  for (let i = 0; i < arguments.length; i++) {
    res += arguments[i]
  }
  return res
}
```

arguments객체는 배열 형태로 인자 정보를 가지고 있지만 실제 배열이 아닌 `유사 배열 객체`다.
유사 배열 객체란 length 프로퍼티를 가진 객체로 for문으로 순회할 수 있는 객체를 말한다.

유사 배열 객체는 배열이 아니므로 배열 메서드를 사용할 경우 에러가 발생한다. 따라서 배열 메서드를 사용하려면 Function.prototype.call, Function.prototype.apply를 사용해 간접 호출해야하는 번거로움이 있다.

```js
function sum() {
  //arguments 객체를 배열로 변환
  const array = Array.prototype.slice.call(arguments)
  return array.reduce(function(pre, cur) {
    return pre + cur
  }, 0)
}
console.log(sum(1, 2)) //3
console.log(sum(1, 2, 3, 4, 5)) //15
```

이러한 번거로움을 해결하기 위해 ES6에서는`Rest파라미터`를 도입했다.

```js
//ES6 Rest parameter
function sum(..args){
  return args.reduce((pre,cur)=> pre+cur,0);
}
console.log(sum(1,2)); //3
console.log(sum(1,2,3,4,5));//15
```

### length프로퍼티

함수 객체의 length프로퍼티는 함수를 정의할 때 선언한 매개변수의 개수를 가리킨다.

```js
function foo() {}
console.log(foo.length) //0

function bar(x) {
  return x
}
console.log(bar.length) //1

function baz(x, y) {
  return x * y
}
console.log(baz.length) //2
```

주의할 점은 arguments객체의 length프로퍼티는 인자(argument)의 개수를 가리키고, 함수 객체의 length프로퍼티는 매개변수(parameter)의 개수를 가리킨다.

### name프로퍼티

함수 객체의 name 프로퍼티는 함수 이름을 나타낸다. name프로퍼티는 ES5와 ES6에서 동작을 달리하므로 주의해야 한다.

```js
//기명 함수 표현식
var namedFunc = function foo() {};
console.log(namedFunc.name); //foo

//익명 함수 표현식
var anonymousFunc = function() {};
//ES5 : name프로퍼티는 빈 문자열을 값으로 갖는다.
//ES6: name 프로퍼티는 함수 객체를 가리키는 변수 이름을 값으로 갖는다.
console.log(anonymousFunc.name). //anonymousFunc

//함수 선언문
function bar() {}
console.log(bar.name); //bar
```

### 마치며

이번에는 익숙하지 않은 개념들을 접한게 많았는데,
특히 함수 객체의 프로퍼티들에는 어떠한 것들이 있는지 공부할 수 있어서 자바스크립트 지식이 한 단계 더 성장한 느낌이 들었다.
자바스크립트는 공부해도 해도 끝이 없는 것처럼 느껴진다..!
