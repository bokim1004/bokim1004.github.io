---
title: prototype
date: 2022-06-22 07:06:63
category: javascript
thumbnail: { thumbnailSrc }
draft: false
---

| _모던 자바스크립트 DEEP DIVE를 읽고 공부한 부분을 기록합니다._

이번에는 자바스크립트를 공부한다면 꼭 알아야한다는 개념 프로토타입이 무엇인지에 대해 공부해보았다.

## 프로토타입

자바스크립트는 명령형, 함수형, 프로토타입 기반 객체지향 프로그래밍을 지원하는 멀티 패러다임 프로그래밍 언어다.

### 객체지향 프로그래밍

객체지향 프로그래밍은 프로그램을 명령어 또는 함수의 목록으로 보는 전통적인 명령형 프로그래밍의 절차지향적 관점에서 벗어나 여러 개의 독립적 단위, 즉 객체의 집합으로
프로그램을 표현하려는 프로그래밍 패러다임을 말한다.

```js
//이름과 주소 속성을 갖는 객체
const person = {
  name: 'chloe',
  address: 'seoul',
}
console.log(person) // {name:'chloe',address:'seoul'}
```

위와 같이 속성을 통해 여러 개의 값을 하나의 단위로 구성한 복합적인 자료구조를 `객체`라고 한다. 객체지향 프로그래밍은 독립적인 객체의 집합으로 프로그램을 표현하려는 프로그래밍 패러다임이다.

### 상속과 프로그래밍

`상속`은 객체지향 프로그래밍의 핵심 개념으로, 어떤 객체의 프로퍼티 또는 메서드를 다른 객체가 상속받아 그대로 사용할 수 있는 것을 말한다.
자바스크립트는 프로토타입을 기반으로 상속을 구현하여 불필요한 중복을 제거한다. 중복을 제거하는 방법은 기존의 코드를 적극적으로 재사용하는 것이다.

```js
//생성자 함수
function Circle(radius) {
  this.radius = radius
  this.getArea = function() {
    //Math.PI는 원주율을 나타내는 상수다.
    return Math.PI * this.radius ** 2
  }
}
//반지름이 1인 인스턴스 생성
const circle1 = new Circle(1)
//반지름이 2인 인스턴스 생성
const cicle2 = new Circle(2)

// Circle 생성자 함수는 인스턴스를 생성할 때마다 동일한 동작을 하는
//gerArea 메서드를 중복 생성하고 모든 인스턴스가 중복 소유한다.
//getArea 메서드는 하나만 생성하여 모든 인스턴스가 공유해서 사용하는 것이 바람직히다.
```

Circle 생성자 함수가 생성하는 모든 객체(인스턴스)는 radius 프로퍼티와 getArea 메서드를 갖는다.
radius 프로퍼티 값은 일반적으로 인스턴스마다 다르다. 그런데, getArea메서드는 모든 인스턴스가 동일한 내용의 메서드를 사용하므로
단 하나만 생성해서 모든 인스턴스가 공유해서 사용하는 것이 바람직하다.
그런데 Circle 생성자 함수는 인스턴스를 생성할 때마다 getArea 메서드를 중복 생성하고 모든 인스턴스가 중복 소유한다.

동일한 생성자 함수에 의해 생성된 모든 인스턴스가 동일한 메서드를 중복 소유하는 것은 메모리를 불필요하게 낭비하는 결과로 이어진다.

상속을 통해 불필요한 중복을 제거할 수 있다. 자바스크립트는 프로토타입을 기반으로 상속을 구현한다.

```js
//생성자 함수
function Circle(radius) {
  this.radius = radius
}
//Circle 생성자 함수가 생성한 모든 인스턴스가 getArea메서드를
//공유해서 사용할 수 있도록 프로토타입에 추가한다.
//프로토타입은 Circle 생성자 함수의 prototype 프로퍼티에 바인딩되어있다.
Circle.prototype.getArea = function() {
  return Math.PI * this.radius ** 2
}

//인스턴스 생성
const circle1 = new Circle(1)
const circle2 = new Circle(2)
//Circle 생성자 함수가 생성한 모든 인스턴스는 부모 객체의 역할을 하는
// 프로토타입 Circle.prototype으로부터 getArea메서드를 상속받는다.
//즉, Circle새성자 함수가 생성하는 모든 인스턴스는 하나의 getArea메서드를 공유한다.
```

### 프로토타입 객체

프로토타입이란 객체지향 프로그래밍의 근간을 이루는 `객체 간 상속`을 구현하기 위해 사용된다.
프로토타입은 어떤 객체의 상위(부모)객체의 역할을 하는 객체로서 다른 객체에 공유 프로퍼티를 제공한다.
프로토타입을 상속받은 하위(자식)객체는 상위 객체의 프로퍼티를 자신의 프로퍼티처럼 자유롭게 사용할 수 있다.

모든 객체는 [[Prototype]]이라는 내부 슬롯을 가지며, 이 내부 슬롯의 값은 프로토타입의 참조다.
[[Prototype]]에 저장되는 프로토타입은 객체 생성 방식에 의해 결정된다.
즉, 객체가 생성될 때, 객체 생성 방식에 따라 프로토타입이 결정되고 [[Prototype]]에 저장된다.
모든 객체는 하나의 프로토타입을 갖는다. 그리고 모든 프로토타입은 생성자 함수와 연결되어 있다.

#### `__prototype __` 접근자 프로퍼티

`__prototype __` 접근자 프로퍼티는 객체가 직접 소유하는 프로퍼티가 아니라 Object.prototype의 프로퍼티다.
모든객체는 상속을 통해 `Object.prototype._prototype_` 접근자 프로퍼티를 사용할 수 있다.

```js
const person = { name: 'chloe' }

//person 객체는 __prototype__프로퍼티를 소유하지 않는다.
console.log(person.hasOwnProperty('__proto__')) //false

//__prototype__ 프로퍼티는 모든 객체의 프로토타입 객체인 Object.prototype의 접근자 프로퍼티다.
console.log(Object.getOwnPropertyDescriptor(Object.prototype, '__proto__'))

// 모든 객체는 Object.prototype의 접근자 프로퍼티 __proto__를 상속받아 사용할 수 있다.
console.log({}.__proto__ === Object.prototype) //true
```

#### Object.prototype <br/>

모든 객체는 프로포타입의 계층 구조인 프로토타입 체인에 묶여 있다. 자바스크립트 엔진은 객체의 프로퍼티에 접근하려고 할 때, 해당 객체에 접근하려는
프로퍼티가 없다면 `__prototype__`접근자 프로퍼티가 가리키는 참조를 따라 자신의 부모 역할을 하는 프로토타입의 프로퍼티를 순차적으로 검색한다.
프로토타입 체인의 종점, 즉 프로토타입 체인의 최상위 객체는 Object.prototype이며, 이 객체의 프로퍼티와 메서드는 모든 객체에 상속된다.

### 프로토타입 체인

```js
function Person(name) {
  this.name = name
}
//프로토타입 메서드
Person.prototype.sayHello = function() {
  console.log(`Hi! My name is ${this.name}`)
}
const me = new Person('chloe')

//hasOwnProperty는 Object.prototype메서드다.
console.log(me.hasOwnProperty('name')) // true
```

Person 생성자 함수에 의해 생성된 me객체는 Object.prototype의 메서드인 hasOwnProperty를 호출할 수 있다.
이것은 me객체가 Person.prototype뿐만 아니라 Object.prototype도 상속받았다는 것을 의미한다.
me객체의 프로토타입은 Person.prototype이다.

자바스크립트는 객체의 프로퍼티에 접근하려고 할 때, 해당 객체에 접근하려는 프로퍼티가 없다면 [[prototype]]내부 슬롯의 참조를 따라
자신의 부모 역할을 하는 프로토타입의 프로퍼티를 순차적으로 검색한다. 이를 `프로토타입 체인`이라 한다.
프로토타입 체인은 자바스크립트가 객체지향 프로그래밍의 상속을 구현하는 메커니즘이다.

### 프로토타입의 교체

프로토타입은 임의의 다른 객체로 변경할 수 있다. 이것은 부모 객체인 프로토타입을 동적으로 변경할 수 있다는 것을 의미한다.
이러한 특징을 활용해 객체 간의 상속 관계를 동적으로 변경할 수 있다.
프로토타입은 생성자 함수 또는 인스턴스에 의해 교체할 수 있다.

#### 생성자 함수에 의한 프로토타입의 교체

```js
const Person = (function() {
  function Person(name) {
    this.name = name
  }
  //1)생성자 함수의 prototype프로퍼티를 통해 프로토타입을 교체
  Person.prototype = {
    sayHello() {
      console.log(`Hi My name is ${this.name}`)
    },
  }
  return Person
})()

const me = new Person('chloe')
```

1)에서 Person.prototype에 객체 리터럴을 할당했다.
이는 Person생성자 함수가 생성할 객체의 프로토타입을 객체 리터럴로 교체한 것이다.

```js
//프로토타입을 교체하면 constructor 프로퍼티와 생성자 함수 간의 연결이 파괴된다.
console.log(me.constructor === Person) //false
//프로토타입 체인을 따라 Object.prototype의 constructor 프로퍼티가 검색된다.
console.log(me.constructor === Object) //true
```

이처럼 프로토타입을 교체하면 constructor 프로퍼티와 생성자 함수 간의 연결이 파괴된다.
파괴된 constructor프로퍼티와 생성자 함수 간의 연결을 되살릴 수 있다.
프로토타입으로 교체한 객체 리터럴에 constructor 프로퍼티를 추가하여 프로토타입의 cosntructor 프로퍼티를 되살린다.

```js
const Person = (function() {
  function Person(name) {
    this.name = name
  }
  //1)생성자 함수의 prototype프로퍼티를 통해 프로토타입을 교체
  Person.prototype = {
    //constructor 프로퍼티와 생성자 함수 간의 연결을 설정
    constructor: Person,
    sayHello() {
      console.log(`Hi My name is ${this.name}`)
    },
  }
  return Person
})()

const me = new Person('chloe')

//constructor 프로퍼티가 생성자 함수를 가리킨다.
console.log(me.constructor === Person) //true
console.log(me.constructor === Object) //false
```

#### 인스턴스에 의한 프로토타입의 교체

프로토타입은 생성자 함수의 prototype 프로퍼티뿐만 아니라 인스턴스의 `__prototype__`접근자 프로퍼티를 통해 접근할 수 있다.
따라서 인스턴스의 `__prototype__`접근자 프로퍼티를 통해 프로토타입을 교체할 수 있다.

생성자 함수의 prototype 프로퍼티에 다른 임의의 객체를 바인딩하는 것은 미래에 생성할 인스턴스의 프로토타입을 교체하는 것이다.
`__prototype__`접근자 프로퍼티를 통해 프로토타입을 교체하는 것은 이미 생성된 객체의 프로토타입을 교체하는 것이다.

```js
function Person(name) {
  this.name = name
}
const me = new Person('chloe')

//프로토타입으로 교체할 객체
const parent = {
  sayHello() {
    console.log(`Hi! My name is ${this.name}`)
  },
}

//1) me객체의 프로토타입을 parent 객체로 교체한다.
Object.setPrototypeOf(me, parent)
//위 코드는 아래의 코드와 동일하게 동작한다.
//me.__prototype__ =parent;
me.sayHello() //Hi My name is chloe
```

### 결론

프로토타입에 대한 개념을 알고 이를 실제 개발에 적용할 수 있을지는 아직 모르겠다.
자바스크립트 세계는 너무 무궁무진한 것 같다..!
이런 식으로 공부를 계속하다보면 어려운 개념도 언젠가 익숙해지지 않을까 생각해본다!
