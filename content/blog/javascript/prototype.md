---
title: prototype
date: 2022-06-22 07:06:63
category: javascript
thumbnail: { thumbnailSrc }
draft: false
---

| _모던 자바스크립트 DEEP DIVE를 읽고 공부한 부분을 기록합니다._

이번에는 많이 들어봤지만 잘 알고 있지는 못하는 프로토타입이 무엇인지에 대해 공부해보았다.

## 프로토타입

자바스크립트는 명령형, 함수형, 프로토타입 기반 객체지향 프로그래밍을 지원하는 멀티 패러다임 프로그래밍 언어다.

### 객체지향 프로그래밍

객체지향 프로그래밍은 프로그램을 명령어 또는 함수의 목록으로 보는 전통적인 명령형 프로그래밍의 절차지향적 관점에서 벗어나 여러 개의 독립적 단위, 즉 객체의 직합으로
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

동일한 생성자 함수에 의해 생성된 모든 인스턴스가 동일한 메서드를 중복 소유하는 것은 메모리를 불필요하게 낭비한다.

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
