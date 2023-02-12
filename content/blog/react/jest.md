---
title: TDD(테스트 주도 개발)과 jest에 대하여
date: 2023-02-11 15:02:03
category: react
thumbnail: { thumbnailSrc }
draft: false
---

개발을 할 때 테스트 코드를 작성하는 곳도 많다고 들었다.
우리 회사는 테스트 코드를 아직 작성하지 않는데 나중에 꼭 해보자고 건의해보고 싶은 부분이다.
그러기 위해서는 테스트 코드는 무엇이고 어떻게 작성하는지 먼저 아는게 중요하다는 생각이 들었다.
TDD에 대해 많이 들어봤는데 이것에 대해 알아보고 더 나아가 react에서 테스트를 위해 사용하기 좋은 JS 테스트 프레임워크 `jest`에 대해 알아보려고 한다.

## TDD (테스트 주도 개발)

테스트 코드를 먼저 작성하는 개발방법론을 테스트 주도 개발이라고 부른다.
작은 단위의 테스트 케이스를 작성하고 이를 통과하는 코드를 추가하는 단계를 반복하여 구현한다.

`테스트 코드를 작성해야 하는 이유는 무엇일까?`

- 더욱 깔끔하게 코드를 작성하는게 가능해진다.
- 장기적으로 개발 비용을 절감할 수 있다.

### TDD 개발 주기를 알아보자

<img src="https://velog.velcdn.com/images/chloeee/post/273d0f0e-b72f-4440-9e02-7e59344b9ac4/image.png" width="500px" />

1. Red단계 : 실패하는 테스트 코드를 먼저 작성한다.
2. Green단계 : 테스트 코드를 성공시키기 위한 실제 코드를 작성한다.
3. Blue단계 : 중복 코드 제거 등의 리팩토링을 실행한다.

### 보통의 개발 방식과 TDD 개발 방식에는 차이가 있다.

일반적으로 개발할 때, 요구 사항을 분석 => 설계 => 개발 => 테스트 => 배포 형태의 개발주기를 갖는다.

하지만 이런 방법에는 다음과 같은 위험들이 존재한다.

1. 소비자의 요구사항이 처음부터 명확하지 않기에 변경될 수 있다.
2. 처음부터 완벽하게 설계하는 것은 매우 어렵다.
3. 소스코드 품질이 저하될 수 있다.
4. 테스트를 할 때 많은 시간과 비용이 필요할 수 있다.

이렇게 코드를 짜면 재사용이 어렵고 관리가 어려워서 유지보수가 어렵다.
그렇다면 TDD 개발방식은 어떠할까? <br/>
TDD의 가장 큰 차이점은 `테스트 코드를 작성한 후에 실제 코드를 작성한다는 것이다.`
디자인(설계) 단계에서 프로그래밍 목적을 미리 정해야 하고, 무엇보다 테스트해야 할지 미리 정의(테스트 케이스 작성)해야만 한다.
테스트 코드를 작성하는 도중에 발생하는 예외 사항(버그 및 수정사항)은 테스트 케이스에 추가하고 설계를 개선한다.
이후에 테스트가 통과된 코드만을 코드 개발 단계에서 실제 코드로 작성한다.

### TDD 방식의 장단점은 무엇일까?

우선 TDD방식의 장점은 다음과 같다.

1. 더 품질좋은 객체지향적인 코드를 생산할 수 있다.
   TDD는 코드의 재사용 보장을 명시하므로 TDD를 통한 소프트웨어 개발 시 기능 별 철저한 모듈화가 이뤄진다.

2. 재설계 시간을 단축할 수 있다.
   테스트 코드를 먼저 작성하기 때문에 개발자가 지금 무엇을 해야하는지 분명히 정의하고 개발을 시작하게된다.
   또한 테스트 시나리오를 작성하면서 다양한 예외사항에 대해 정리할 수 있기에 재설계 시간을 단축할 수 있다.

3. 디버깅 시간을 단축할 수 있다.
   TDD의 경우 자동화 된 유닛 테스팅을 전제하므로 특정 버그를 손 쉽게 찾아낼 수 있다

그러나 TDD방식에도 단점은 있다.

TDD방식으로 개발을 하게 되면 일반적인 개발방식에 비해 더 많은 시간을 필요로 한다,
소프트웨어의 품질보다는 일정을 맞추는게 훨씬 중요한 곳들은 TDD 방식을 잘 사용하지 않는다고 한다.

## JS 테스트 프레임워크 Jest

자바스크립트를 테스트하기 위한 테스팅 툴이 여러가지가 있다. 그 중 많이 쓰이는 것이 리액트를 만든 페이스북에서 선보인 `Jest`다.

#### 설치

```js
npm install jest --save-dev
```

package.json에서 아래와 같이 수정을 해준다.

```Js
"scripts":{
  "test":"jest"
}
```

#### test.js 작성하기

case.js파일이 있다고 하면 case.test.js 파일을 하나 더 만들어 테스트를 위한 코드를 작성한다.

```js
//case.js
const case1 = {
  add: (num1, num2) => num1 + num2,
  makeUser: (name, age) => ({ name, age }),
}

module.exports = case1
```

expect에 검증하는 값을 넣어주고 ToBe에 기대하는 값을 넣어준다

```js
//case.test.js
const case = require("./case");

test("1은?", () => {

  expect(1).toBe(1);
});

//성공 케이스
test("3더하기 3은 6", () => {
  expect(case.add(3, 3)).toBe(6);
});

//실패케이스

test("4더하기 3은 6", () => {
  expect(case.add(4, 3)).toBe(6);
});

```

`npm test`를 해보면 어떤 것이 fail인지 Pass인지 알 수 있다.

### toBe와 toEqual은 어떤 차이가 있을까?

toBe와 toEqual은 거의 동일하게 쓰인다.

아래 객체 값을 확인할 때는 toBe로 해보고 테스트를 하면 fail이 뜨지만, toEqual로 하면 pass가 된다.
toEqual은 재귀적으로 각 요소들을 확인하기 때문에 그런 것이다.
보다 엄격하게 테스트를 하려면 `toStrictEqual`을 사용하면 된다.

```js
test("이름,나이 전달받아 객체로 반환", () => {
  expect(case.makeUser("jay", 30)).toEqual({
    name: "jay",
    age: 30,
  });
});

```

### toBeNull, toBeUndefined, toBeDefined

말 그대로 각각 Null인 경우, undefined인 경우, Defined인 경우 통과된다.

```js
test('null은 Null', () => {
  expect(null).toBeNull()
})
```

### toBeTruthy,toBeFalsy

boolean값을 판별해준다.

0은 False이기에 아래를 테스트하면 패스된다.

```js
test('0은 false', () => {
  expect(case.add(1,-1)).toBeFalsy()
})
```

### 크다,작다 비교관련

- toBeGreaterThan(크다)
- toBeGreaterThanOrEqual(크거나 같다)
- toBeLessThan(작다)
- toBeLessThanOrEqual(작거나 같다)

아래는 통과한다.

```js
test('id는 10자 이하', () => {
  const id = 'THE_BLACK'
  expect(id.length).toBeLessThanOrEqual(10)
})
```

### toContain

배열에서 특정요소가 있는지 확인할 때 사용한다.

```js
test('유저 리스트에 Chloe가 있나요?', () => {
  const user = 'chloe'
  const userList = ['TOM', 'JANE', 'KAY']
  expect(userList).toContain(user)
})
```

위 코드를 테스트 해보면 배열에 속해있지 않기에 fail이 된다.

## 마치며

TDD에 대해 알아봤고 더 나아가 react에서 테스트를 위해 많이 사용되는 jest에 대해 간단하게만 알아보았다.
Jest를 통해 테스트 코드를 작성하게 되면 더 안정적으로 에러가 더 발생하고 더 높은 품질의 코드를 작성할 수 있게될 것이라는 생각이 들었다.

> 참고

- https://hanamon.kr/tdd%EB%9E%80-%ED%85%8C%EC%8A%A4%ED%8A%B8-%EC%A3%BC%EB%8F%84-%EA%B0%9C%EB%B0%9C/
- https://www.youtube.com/watch?v=g4MdUjxA-S4
