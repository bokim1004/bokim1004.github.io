---
title: 항해플러스 프론트엔드 5기 3주차 회고
date: 2025-04-13 17:04:95
category: etc
thumbnail: { thumbnailSrc }
draft: false
image: "https://velog.velcdn.com/images/chloeee/post/db477a29-3257-42ee-b936-58629e0ef09f/image.png"
---

### 들어가며

3주차 과제는 hook을 직접 구현해보며, 동작원리를 살펴보는 시간을 가졌다. 내가 몰랐던 부분들을 알게 되는 과정이 재밌었던 시간이었다.

## ✨과제 셀프회고

이번 과제를 통해 내가 궁극적으로 얻고 싶었던 것은 Hook을 직접 구현해보며 동작을 제대로 이해해 보는 것이었다.
`React.memo`,`useCallback`,`useMemo`를 실무에서 사용해봤으나 제대로 사용해서 성능 최적화를 하고 있나에 대한 의문이 많았다.
Hook을 직접 구현해보며 어떻게 동작하는건지 정말 많은 부분 알게 되고 이해하게 된 것들이 많다.

### 🥰 과제를 하며 새로 알게된 부분

---

### 1. Hook을 구현하려면 얕은비교, 깊은비교를 먼저 알아야 한다

성능 최적화를 한다고 Hook을 사용했을 때, 얕은 비교와 깊은 비교에 대해 부끄럽지만 크게 생각해본 적이 없다.
얕은 비교,깊은 비교는 어떻게 되는 것인지 살펴보았다.

#### 얕은 비교란?

객체나 배열 등의 참조형 데이터를 비교할 때, `속성 값의 내부까지 보지 않고, 참조(주소)만 비교`하는 방식이다.

```js
const a = { name: '보경' };
const b = { name: '보경' };
a === b; // false (얕은 비교)
```

`a`와 `b`는 내용은 같지만 서로 다른 객체이기 때문에 `===` 비교에서는 false다.

#### 깊은 비교란?

객체의 `내부 속성들까지 전부 재귀적으로 비교`해서 진짜 내용이 같은지를 확인하는 방식이다.
> `왜 재귀적 호출이 필요할까?`
깊은 비교라는 건 단순히 겉모습이 아니라, 값의 내부구조까지 전부같은지 확인하는 것.
근데 이 내부구조는 또 객체나 배열일 수도 있다.  그래서 그런 내부 구조를 다시 비교하려면, 계속해서 안으로 파고들어서 자기 자신을 반복호출(재귀)하는것이다.

#### 🧠 Hooks사용 시, 비교가 왜 중요할까?

리액트에서 훅스(`useEffect`, `useMemo`, `useCallback` 등)는 종속성 배열을 기반으로 작동한다.
useEffect코드를 예로 보면,

```js
useEffect(() => {
  console.log('Check changes');
}, [user]);
```

여기서 `user` 객체가 바뀌었는지를 리액트는 **얕은 비교**로 판단한다. 즉, `user`의 속성 값이 같더라도, 새로운 객체로 생성됐다면 **변경된 걸로 간주**된다.

#### 💥 얕은 비교에는 단점이 존재한다

만약 매 렌더마다 새로운 객체가 만들어지면 (불변성을 지키지 않거나 useMemo등을 안 쓰면) 훅이 **쓸데없이 실행**된다.

#### 🔍 그럼 언제 깊은 비교를 써야 할까?

- 객체나 배열의 **내용 자체가 진짜 바뀌었는지를 보고 싶을 때**
- 혹은 커스텀 훅이나 성능 최적화 상황에서 비교 로직을 세밀하게 제어하고 싶을 때

### 2. useRef는 단지 DOM참조를 위한 Hook만이 아니다

실무에서 useRef를 사용했을 때, DOM요소에 직접 접근해야할 때 많이 썼었다.
단순히 값을 저장하는 용도로 사용한 적이 없었는데 useRef를 직접 구현해보니 이 Hook의 핵심은 컴포넌트가 `리렌더링되어도 값이 유지되도록 저장`하는데 있었다.

```js
export function useRef<T>(initialValue: T): { current: T } {
  // Lazy Initialization: 최초 렌더 시에만 실행됨
  const [ref] = useState(() => ({ current: initialValue }));
  return ref;
}

```

코드를 살펴보면,ref.current에 initialValue를 저장하고 이 값은 컴포넌트가 리렌더되어도 바뀌지 않고 유지된다.

> ✅Lazy Initialization이란?
`() => ({ current: initialValue })` 이렇게 함수 형태로 전달하면 렌더링 시점에서 바로 계산하지 않고 “필요할 때까지 초기값 계산을 미룬다”
즉, 지금 바로 값이나 객체를 만들지 않고,  
→ 정말 필요해졌을 때 딱 한 번 만드는 방식!

### 3. useCallback안에는 useMemo가 있다

useCallback 내부 코드를 살펴보았다.

```ts
import { DependencyList } from "react";

export function useCallback<T extends Function>(
factory: T,
_deps: DependencyList,
) {
return useMemo(() => factory, _deps);
}
```

- `useCallback(fn, deps)` 는  
  "이 함수`fn`를 memoize 해줘, deps 바뀌기 전까진 같은 참조값으로 유지할게" 라는 뜻이다.
- 내부적으로는 그냥 `useMemo(() => fn, deps)` 와 완전히 동일하다.
  - `() => fn`은 함수 자체를 리턴하는 **팩토리 함수**다.

  - 즉, `useMemo`가 실행되면 → `fn`이라는 **함수 그 자체**가 반환된다.

  - **실행되는 게 아니라, 그냥 그 함수 객체를 반환해서 저장해두는 것**이다.

즉, `useCallback(fn, deps)`는 `useMemo(() => fn, deps)`랑 사실상 같은 역할을 한다-!

---

### 🥰 과제 트러블 슈팅 과정

### 🧩 문제 상황 1. Header 컴포넌트가 불필요하게 리렌더링됨

테스트에서`it("알림 추가 및 닫기시 ComplexForm, NotificationSystem만 리렌더링되어야 한다",` 여기서 Header컴포넌트도 리렌더되는 이슈가 있었다.

`문제 원인`은 관심사 분리를 충분히 세분화하지 않고 context를 사용했던 것에 있었다.

#### 🔍 원인 분석

문제는 바로 로그인쪽 상태랑 notification쪽 상태를 하나의 context에 넣어 사용하고 있었던 것이었다.
기존에는 `NotificationSystem`에서 `const { notifications, removeNotification }=useAuthContext()` 이렇게 값을 꺼내쓰고 있었다.

➡️ 그래서 notification이 바뀔 때마다 `useAuthContext()`를 사용하는 이 context를 쓰고 있는 Header, NotificationSystem 둘 다 리렌더가 됐던 것이다.

> ❓**NotificationSystem을 React.memo로 감쌌는데 왜 리렌더될까?**

- `NotificationSystem`을 `React.memo`로 감싸도 **여전히 리렌더되는 이유**는,  
React.memo는 props가 안 바뀌면 리렌더를 막아주는 역할이지만,
context 내부 값이 바뀌면 소용이 없다.
context는 props가 아니라 훅으로 가져오는 것!
그래서 내부 값이 바뀌면 그걸 쓰는 컴포넌트는 무조건 다시 그려진다.

#### ✅ 해결 방법

👉 알림 관련 상태만 따로 NotificationContext로 분리했다.
로그인 관련 상태는 기존처럼 AuthContext에 두고, 알림은 완전히 따로 떼내었다.
이렇게 관심사를 분리해주니까,
Header는 로그인 상태만 보고, NotificationSystem은 알림 상태만 보게 되면서 로 영향받지 않고 리렌더링 문제도 해결이 되었다!

### 🧩 문제 상황 2.generateItems가 2번 호출되는 이슈

`여러 작업을 연속으로 수행해도 각 컴포넌트는 필요한 경우에만 리렌더링되어야 한다"` 테스트 코드 이 부분에서 `xpect(generateItemsSpy).toHaveBeenCalledTimes(1)`
-> 2번 호출되는 이슈가 있었다.

#### 🔍 원인 분석

Main.tsx에서 아래처럼 작성된 부분이 문제의 원인이었다.

```js
const Main: React.FC = () => {
  const [items, setItems] = useState(generateItems(1000));
```

- generateItems(1000) 이 부분이 useState에 전달되기 전에 즉시 실행된다.

- 즉, Main 컴포넌트가 렌더링될 때마다 항상 새로운 배열을 생성하게 되는 것.

- 그래서 React는 “이전 배열이랑 다르네”라고 생각해서 **불필요한 리렌더**가 생길 수 있게 되는 것이다..!

#### ✅ 해결 방법

지연 초기화 방식 (Lazy initialization)을 사용해야 해결이 되었다.

```js
const Main: React.FC = () => {
  const [items, setItems] = useState(()=>generateItems(1000));
```

- 이렇게 해야 `generateItems(1000)`은 **처음 렌더링할 때 딱 한 번만 실행된다**

- 그 이후에는 이 함수는 실행되지 않고, 내부에 저장된 초기값만 사용된다.
