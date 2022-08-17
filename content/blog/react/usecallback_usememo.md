---
title: usecallback과 usememo 차이점
date: 2022-08-08 19:08:68
category: react
thumbnail: { thumbnailSrc }
draft: false
---

useCallback과 useMemo는 리액트로 개발할 때 성능 최적화를 위해 많이 사용되는 hook이다.
이것에 대한 정확한 특징과 차이점을 더 자세히 알기 위해 공부를 해보았다.

### useCallback과 useMemo에 대해 파고들기 전 먼저 알아둘 점

1. 함수형 컴포넌트는 그냥 함수다. 단지 jsx를 반환하는 함수라는 것을 먼저 알아야 한다.<br/>
   컴포넌트가 렌더링된다는 것은 누군가가 그 함수(컴포넌트)를 호출하여서 실행되는 것을 말한다. 함수가 실행될 때마다 내부에 선언되어있던 표현식(변수,또 다른 함수 등)도 매번 다시 선언되어 사용된다. <br/>

2. 컴포넌트는 자신의 state가 변경되거나, 부모에게서 받는 props가 변경되었을 때마다 리렌더링된다.( 하위 컴포넌트에 최적화 설정을 해주지 않으면 부모에게서 받는 props가 변경되지 않았더라도 리렌더링 되는게 기본이다) <br/>

3. `memoization`은 무언가를 기억하는 것이다. <br/>

4. `useMemo`와 `useCallback`은 한마디로 dependancies가 변경될 때까지 렌더 시 무언가를 기억하는 것이다. <span style="background-color:yellow">차이점은 무언가를 기억하느냐이다.</span><br/>

5. `useMemo`는 함수에서 리턴(반환)된 value를 기억하는 것이다.<br/>

6. `useCallback`은 실제 함수를 기억하는 것이다.<br/>

```js
const fn = () =>42  / / assuming expensive calculation here
const memoFn = useCallback(fn,[dep]) // (1)
const memoFnReturn = useMemo(fn,[dep]) //(2)
```

(1)은 memoized된 버전인 fn을 리턴할 것이다. memoFn함수를 invoke할 때마다, 복잡한 computation이 다시 시작된다.<br/>
(2)는 dep이 변경될 때마다 fn을 invoke할 것이고 리턴된 value를 기억할 것이다. 이 value(42)는 memoFnReturn에 저장될 것이다.

### useMemo?

`메모이제이션된 값을 반환한다`라는 문장이 핵심이다. <br/>
하위 컴포넌트에서 상위컴포넌트로부터 props를 전달 받는다. 하위 컴포넌트에서는 props를 전달 받으면 서로 다른 함수로 각각의 값을 가공한 새로운 값을 보여주는 역할을 한다.<br/>
하위 컴포넌트는 props로 넘겨받는 인자가 하나라도 변경될 때마다 렌더링되는데 props.a만 변경되었을 때 이전과 같은 값인 props.b도 다시 함수를 호출해서 재계산해야할까? 그냥 이전에 계산된 값을 쓰면 되는데~!

`useMemo를 사용하면 의존성 배열에 넘겨준 값이 변경되었을 때만 메모이제이션된 값을 다시 계산한다.`

#### useMemo를 왜 사용하고 언제 사용하는가?

초기렌더에 useMemo를 사용하면 더 expensive하지만 그 다음 리렌더시에는 훨씬 큰 성능 향상을 가져다 준다.
만약, application의 data/processing 복잡도가 5000이상이거나 리렌더가 되는 경우가 있다면, useMemo를 사용하는 것이 이득이다.

useMemo는 불필요한 리렌더를 피할 때 유용하다.

### useCallback?

`메모이제이션된 함수를 반환한다`라는 문장이 핵심이다.

```js
const onChangeHandler = useCallback (e =>{
     if(e.target.id ===“color”) setColor(e.target.value);
     else setMovie(e.target.value);
},[]);

```

이벤트 핸들러 함수나 api를 요청하는 함수를 주로 useCallback으로 선언하는 코드가 많다.<br/>
하지만, 비싼 계산이 아니라면 useMemo사용을 권장하지 않는 것처럼 함수 재선언을 막기 위해 useCallback을 사용하는 것도 크게 의미있어 보이지는 않는다.<br/>
만약 하위 컴포넌트가 React.memo()같은 것으로 최적화되어있고 그 하위 컴포넌트에게 callback함수를 props로 넘길 때, 상위 컴포넌트에서 useCallback으로 함수를 선언하는 것이 유용하다라는 의미다.

### 정리

`useMemo` 는 특정 결과값을 재사용 할 때 사용하는 반면, `useCallback` 은 특정 함수를 새로 만들지 않고 재사용하고 싶을때 사용한다.
