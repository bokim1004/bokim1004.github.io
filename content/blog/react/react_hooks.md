---
title: 리액트 훅스의 클로저 트랩 (Closure Trap) 이해하기(번역)
date: 2022-07-18 19:07:52
category: react
thumbnail: { thumbnailSrc }
image: 'https://velog.velcdn.com/images/chloeee/post/b03404c5-e25e-43bd-9dae-b8bb14cf6b60/image.png'
draft: false
---

리액트 프로젝트를 개발할 때, 보통 리액트 훅스를 사용한다.
그러나 개발 과정에서, 여러 문제들을 만나기도 한다.
대부분의 클래식한 문제는 리액트 훅스의 `클로저 트랩`이다.

이런 비슷한 문제를 겪어본 사람이 있겠지만, 리액트의 숨겨진 원칙으로부터 나온 문제라는 것을 이해하지 못할 것이다.

### 문제점

```js
import { useEffect, useState } from 'react'

export default function App() {
  const [count, setCount] = useState(0)

  useEffect(() => {
    setInterval(() => {
      setCount(count + 1)
    }, 1500)
  }, [])

  useEffect(() => {
    setInterval(() => {
      console.log(count)
    }, 1500)
  }, [])

  return <div>Hello world</div>
}
```

`count`상태를 만들기 위해 useState를 사용한다. 그리고 가장 첫번째로 있는 useEffect에서 `count`값이 계속해서 오른다. 그러고나서 동시에 다른 useEffect에서 `count`의 최신값을 그린다.

console의 결과는 어떻게 나타날까?

콘솔 결과는 0,1,2,3으로 나오는게 아니라 0,0,0...이 계속 타이핑된다.

### 분석

#### 리액트 런타임에서 컴포넌트는 무엇인가?

- 컴포넌트는 fiber node이다.
- 각 fiber node들은 `memorizedState`라는 속성을 가지며 이는 linked list이다.
- 각 컴포넌트의 훅은 `memorizedState` linked list 노드에 상응하며 상응하는 노드로부터 그들의 값에 접근한다.

<p align="center">
<img src="https://velog.velcdn.com/images/chloeee/post/549159ce-89e3-4e6c-bf44-19502ba1b711/image.png" width="500px" >
</p>

예를 들어, 위 예시에 3개의 훅이 있고, `memorizedState`linked list에 있는 노드에 각각 상응한다.

그러고나서, 자기들의 로직을 완성하기 위해 각자의 `memorizedState`에 접근한다.

### Hooks 실행

Hook은 2가지 단계가 있다. (마운트와 업데이트)

`mount 함수`는 훅이 가장 처음에 만들어졌을 때 실행된다. 그리고 `update 함수`는 훅이 업데이트된 후에 항상 실행된다.

<p align="center">
<img src="https://velog.velcdn.com/images/chloeee/post/22eeee65-51a3-4343-b24b-6311ffc49d01/image.png" width="500px" >
</p>

아래가 바로 useEffect의 실행이다.

#### 훅스는 deps를 어떻게 다루는가?

deps parameter를 다루는데 집중해야하는 이유는 여기에 있다. 만약 deps가 undefined면 deps는 null로 취급받는다.

그러고나서 새롭게 패스된 deps와 이전에 memorizedState에 존재하는 deps를 비교한다. 만약 2개가 동일하다면, 이전에 주어진 함수가 바로 사용된다. 그렇지 않으면 새로운 함수가 만들어진다.

2개의 deps가 동일한지 아닌지 비교하는 로직은 매우 간단하다. 만약 이전 deps가 null이면 바로 false를 리턴한다. 이는 2개의 deps가 같은 것이 아니라는 것을 말해준다.
그렇지 않으면, 배열은 차례로 탐색되고 비교된다.

우리는 3개의 결론을 얻을 수 있다.

1. useEffect의 deps parameter가 undefined거나 null이면, callback 함수가 다시 만들어지고 모든 리렌더링시마다 실행될 것이다.
2. 만약에 빈배열이면 effect는 한번만 실행될 것이다.
3. 그렇지 않으면, deps배열의 각 element들이 변경되었는지 비교해서 effect를 실행할 것인지 결정할 것이다.

<p align="center">
<img src="https://velog.velcdn.com/images/chloeee/post/9121ebc9-cce2-4e66-b5d9-e22a10c234c7/image.png" width="500px" >
</p>

`useMemo`와 `useCallback`같은 hooks도 이런 방식으로 deps를 다룬다.

이전에 언급한 것을 보면, 2개를 알 수 있다.

- useEffect같은 Hooks는 `memorizedState`에 있는 데이터에 접근한다.
- 훅스는 deps가 동일한지 비교함에 따라 콜백 함수를 실행할 건지 말건지 결정한다.

```js
useEffect(() => {
  const timer = setInterval(() => {
    setCount(count + 1)
  }, 500)
}, [])

useEffect(() => {
  const timer = setInterval(() => {
    console.log(count)
  }, 500)
}, [])
```

deps가 빈 배열이면, effect는 1번만 실행된다.
그래서 timer setInterval은 한번만 설정된다. 콜백함수가 참조하는 state는 항상 initial state이고 최신 `state`는 얻을 수 없다.

<p align="center">
<img src="https://velog.velcdn.com/images/chloeee/post/5ef66d6d-719b-4a0f-b89a-85df22c9e2ee/image.png" width="500px" >
</p>

만약 최신 `state`를 얻고 싶으면 매 리렌더할때마다 fn을 실행하게 해야 한다. 이말은 즉 의존성 배열에 `count`를 넣어줘야 한다.

fn은 최신 상태를 갖는데 console 결과를 확인하면 엉망이다.
그 이유는 각 effect가 time interval(시간 간격)을 만들어내기 때문이다. 그래서 effect에서 이전의 time interval은 클리어해줘야 한다.

```js
useEffect(() => {
  let timer = setInterval(() => {
    setCount(count + 1)
  }, 1500)
  return () => clearInterval(timer)
}, [count])

useEffect(() => {
  let timer = setInterval(() => {
    console.log(count)
  }, 1500)
  return () => clearInterval(timer)
}, [count])
```

이런 방식으로 closure trap문제를 해결할 수 있다.

### 결론

memorizedState라 불리는 linked list는 fiber node에 저장된다.
linked list의 노드는 각각의 훅스에 상응하고 각각의 훅은 상응하는 노드에 있는 데이터에 접근한다.

useEffect,useMemo,useCallback같은 훅은 deps parameter를 갖는다.
렌더될 때마다 새로운 deps, 오래된 deps가 비교된다. 그리고 deps가 변경될 때마다 콜백함수가 재실행된다.

그러므로, parameter가 undefined,null인 훅스는 매 렌더시 마다 실행될 것이다. parameter가 `[]`인 훅스는 한번만 실행될 것이며 `[state]`가 파라미터인 훅스는 상태가 변경될때만 실행이될 것이다.

클로저 트랩이 발생하는 이유는, useEffect같은 훅스에서는 특정 상태가 사용되지만 deps 배열에는 추가되지 않아서이다. state가 변경되더라도, 콜백 함수가 재실행되지 않고, 오래된 old state를 여전히 참조한다.

클로저 트랩은 쉽게 해결할 수 있지만, deps배열을 정확하게 설정해야 한다. 이런 방식으로 state가 변경될 때마다, 콜백 함수는 재실행될 것이고 새 상태를 참조할 것이다.
그러나, 이전의 timer나 event listener를 cleaning up하는데 유의해야 한다.

참고: https://betterprogramming.pub/understanding-the-closure-trap-of-react-hooks-6c560c408cde 번역
