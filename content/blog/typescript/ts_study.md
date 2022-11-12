---
title: [Effective typescript] 타입스크립트 알아보기
date: 2022-09-10 14:09:35
category: typescript
thumbnail: { thumbnailSrc }
draft: false
---

> 이펙티브 타입스크립트를 읽고 공부한 것을 기록합니다.

### 타입스크립트 알아보기

타입스크립트는 사용 방식 면에서 조금 독특하다. <br/>
자바스크립트로 컴파일되며 실행 역시 자바스크립트로 이루어진다.

#### 아이템 1 타입스크립트와 자바스크립트의 관계 이해하기

타입스크립트는 문법적으로도 자바스크립트의 상위집합이다. 모든 자바스크립트 프로그램이 타입스크립트라는 명제는 참이지만, 그 반대는 성립하지 않는다. <br/>

<p align="center">
<img src="https://velog.velcdn.com/images/chloeee/post/6b90f4ef-5bde-4b2f-9f82-df746aeddd05/image.png" width="300px" >
</p>
모든 자바스크립트는 타입스크립트이지만, 모든 타입스크립트가 자바스크립트는 아니다.<br/>

<span style="background-color:yellow"> 타입 시스템의 목표 중 하나는 런타임에 오류를 발생시킬 코드를 미리찾아내는 것이다.</span> 타입스크립트가 `정적타입`시스템이라는 것은 바로 이런 특징을 말하는 것이다. 그러나 타입체커가 모든 오류를 찾아내지는 않는다.

```js
const states = [
  { name: 'Arizona', capital: 'Phoenix' },
  { name: 'Alaska', capital: 'Juneau' },
  { name: 'Alabama', capital: 'Montgomery' },
]

for (const state of states) {
  console.log(state.capitol)
}
//실행결과
undefined
undefined
undefined
```

앞의 코드는 유효한 자바스크립트(또한 타입스크립트)이고 어떤 오류없이 실행된다. 그러나 루프 내의 `state.capitol`은 의도한 코드가 아닌게 분명하다.<br/>
이런 경우에 타입스크립트 타입 체커는 추가적인 타입 구문없이도 오류를 찾아낸다.

```ts
for (const state of states) {
  console.log(state.capitol)
}
//capitol 속성이 ...형식에 없습니다.
//capital을 사용하시겠습니까?
```

타입스크립트는 타입 구문없이도 오류를 잡을 수 있지만, 타입 구문을 추가하면 훨씬 더 많은 오류를 찾아낼 수 있다.
타입스크립트는 오타가 있는 경우, 어느쪽이 오타인지 판단하지 못한다. 따라서 명시적으로 `states`를 선언하여 의도를 분명하게 하는 것이 좋다.

```ts
interface State {
  name: string
  capital: string
}

const states: State[] = [
  { name: 'Arizona', capital: 'Phoenix' },
  { name: 'Alaska', capital: 'Juneau' },
  { name: 'Alabama', capital: 'Montgomery' },
]
```

의도를 명확히 하면 타입스크립트가 잠재적인 문제점을 찾을 수 있게 된다.

### 요약

- 모든 자바스크립트 프로그램은 이미 타입스크립트 프로그램이다. 반대로, 타입스크립트는 별도의 문법을 가지고 있기에 일반적으로는 유효한 자바스크립트 프로그램이 아니다.
- 타입스크립트는 자바스크립트 런타임 동작을 모델링하는 타입 시스템을 가지고 있기에 런타임 오류를 발생시키는 코드를 찾아내려고 한다. 그러나 모든 오류를 찾아내는 것은 아니다.
- 타입스크립트 타입 시스템은 전반적으로 자바스크립트 동작을 모델링한다. 그러나 잘못된 매개변수 개수로 함수를 호출하는 경우처럼, 자바스크립트에서는 허용되지만 타입스크립트에서는 문제가 되는 경우가 있다.
