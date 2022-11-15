---
title: 프로미스와 async await
date: 2022-11-15 16:11:44
category: javascript
thumbnail: { thumbnailSrc }
draft: false
---

회사에서 처음으로 코드리뷰 시간이 있었다.<br/>
맨날 급하게 개발해야한다는 핑계로 너무 생각없이 코드를 짠 부분이 보여서 부끄러웠다.<br/>
아래와 같이 api를 호출하기 위해 useEffect를 사용했다.
이 코드에는 `크게 2가지 문제점`이 있었다.

<p align="center">
<img src="https://velog.velcdn.com/images/chloeee/post/0a28ca6a-b5e9-4e4e-8207-b2e5c2c077cc/image.png" width="500px" >
</p>

#### 1. 왜 프로미스와 async await을 혼용하였는가?

다른 개발자분께서 위 코드는 async await이 적용 안되었을 것 같아 보이네요 라고 말씀하셨다. <br/>
async await을 사용하는 이유는 프로미스를 더 편하게 사용하기 위함이다.
이 둘의 차이를 정확히 알고 썼어야 했다.

#### 2. 왜 then에서 e로 값을 받고 있는가?

보통 then에서는 값을 받게 되니까 res,response를 작성한다.
보통 catch에서 에러나는 부분을 e,error로 받는다.
이 부분을 전혀 생각하지도 않고 쓰고 있었다고 한다...

<br/>

> 이번을 계기로 promise와 async await의 차이점을 구체적으로 알고 잘 적용해야겠다는 생각이 들어 공부를 해보았다.

### Promise?

프로미스는 자바스크립트 비동기 처리에 사용되는 객체이다.
싱글스레드인 자바스크립트에서 `비동기 처리를 위해 사용한 callback함수의 예외,에러처리에 대한 어려움, 중첩으로 인한 복잡도 증가라는 <br/> 단점을 해결`하기 위해 프로미스 객체를 지원한다.

```js
const promise = new Promise((resolve, reject) => {
  //executor
  //  비동기 작업 성공하면 resolve()를 호출하고
  //비동기 작업 실패시 reject()를 호출하도록 구현한다.
})
```

```js
const promise = new Promise((resolve, reject) => {
  //처리 내용
})
promise
  .then
  //resolve가 호출되면 then이 실행
  ()
  .catch
  //reject가 호출되면 catch 실행
  ()
  .finally
  //콜백 작업 마치고 무조건 실행 (생략 가능함)
  ()
```

`new Promise`에 전달되는 함수는 executor(실행자,실행함수)라고 부른다.
excutor는 `new Promise`가 만들어질 때 자동으로 실행되는데 결과를 최종적으로 만들어내는 제작 코드를 포함한다.
excutor의 인수 `resolve`와 `reject`는 자바스크립트에서 자체 제공하는 콜백이다.
executor에선 결과를 즉시 얻든 늦게 얻든 상관없이, 상황에 따라 인수로 넘겨준 콜백 중 하나를 반드시 호출해야 한다.

` resolve(value)`: 일이 성공적으로 끝난 경우 그 결과를 value와 함께 호출한다.
`reject(error)`: 에러발생 시 에러 객체를 나타내는 error와 함께 호출

다시 말해, excutor는 자동으로 실행되는데 여기서 원하는 일이 처리된다.
처리가 끝나면 excutor는 처리 성공여부에 따라 `resolve`,`reject`를 호출한다.

#### Promise의 3가지 상태

여기서 상태란 프로미스의 처리과정을 의미
`new Promise()`로 프로미스를 생성하고 종료될 때까지 3가지 상태를 갖는다.

<p align="center">
<img src="https://velog.velcdn.com/images/chloeee/post/39c6996f-9669-4589-bfba-d12570a93a5b/image.png" width="500px" >
</p>

1. `Pending(대기)` :비동기 처리 로직이 아직 완료되지 않은 상태

- new Promise()를 호출하면 대기 상태가 됨
  <br/>

2. `Fulfilled(이행)` : 비동기 처리가 완료되어 프로미스가 결과 값을 반환해준 상태

3. `Rejected(실패)`: 비동기 처리가 실패하거나 오류가 발생한 상태

이행(resolved) 혹은 거부(rejected)상태의 프로미스는 `처리된 settled 프로미스`라고 부른다.

#### 소비자:then,catch,finally

프로미스 객체는 executor(제작코드)와 결과나 에러를 받을 소비함수를 이어주는 역할을 한다.
소비함수는 `.then, .catch, .finally` 메서드를 사용해 등록된다.

#### then

`.then`은 프로미스에서 가장 중요하고 기본이 되는 메서드다.

```js
promise.then(
  function (result) {
  //결과를 다룬다.
}
  function (error) {
  //에러를 다룬다.
}
)
```

- `.then`의 첫번째 인수는 프로미스가 이행되었을 때 실행되는 함수이고, 여기서 실행결과를 받는다.
- `.then`의 두 번째 인수는 프로미스가 거부되었을 때 실행되는 함수이고, 여기서 에러를 받는다.
- 작업이 성공적으로 처리된 경우만 다루고 싶다면 `.then`에 인수를 하나만 전달하면 된다.

#### catch

에러가 발생한 경우만 다루고 싶다면 `.then(null, errorHandlingFunction)`같이 null을 첫번째 인수로 전달하면 된다.
`.catch(errorHandlingFunction)`를 써도 되는데 `.catch`는 `.then`에 null을 전달하는 것과 동일하게 작동한다.
`.catch(f)`는 문법이 간결하다는 점만 빼고 `.then(null,f)`과 완벽하게 같다.

#### finally

프라미스가 처리되면(이행이나 거부) f가 항상 실행된다는 점에서 `.finally(f) 호출은 .then(f, f)`과 유사하다.

쓸모가 없어진 로딩 인디케이터(loading indicator)를 멈추는 경우같이, 결과가 어떻든 마무리가 필요하면 finally가 유용하다.

그런데 `finally`는 `.then(f, f)`과 완전히 유사하지는 않다.

1. finally핸들러엔 인수가 없다. 그래서 여기에선 프로미스가 이행되었는지, 거부되었는지 알 수 없다.
   finally에선 절차를 마무리하는 보편적 동작을 수행하기에 성공,실패여부를 몰라도 된다.
2. finally핸들러는 자동으로 다음 핸들러에 결과와 에러를 전달한다.

```js
new Promise((resolve, reject) => {
  setTimeout(() => resolve('결과'), 2000)
})
  .finally(() => alert('프라미스가 준비되었습니다.'))
  .then((result) => alert(result)) //// <-- .then에서 result를 다룰 수 있음

new Promise((resolve, reject) => {
  throw new Error('에러 발생!')
})
  .finally(() => alert('프라미스가 준비되었습니다.'))
  .catch((err) => alert(err)) // <-- .catch에서 에러 객체를 다룰 수 있음
```

finally는 프라미스 결과를 처리하기 위해 만들어 진 게 아니다.
프라미스 결과는 finally를 통과해서 전달된다.. 이런 특징은 아주 유용하게 사용되기도 함!

3. `.finally(f)`는 함수 f를 중복해서 쓸 필요가 없기 때문에 `.then(f, f)`보다 문법 측면에서 더 편리하다.

> 참고 : https://ko.javascript.info/promise-basics , https://hi-zini.tistory.com/entry/%EB%B9%84%EB%8F%99%EA%B8%B0%EC%A0%81-%EB%B0%A9%EC%8B%9D-%EC%B2%98%EB%A6%AC-%EB%B0%A9%EB%B2%95-Callback-Promise-async-await
