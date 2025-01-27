---
title: react hooks와 함수형 프로그래밍
date: 2025-01-27 12:01:53
category: react
thumbnail: { thumbnailSrc }
draft: false
image: "https://velog.velcdn.com/images/chloeee/post/04c899a2-ec4e-4377-90d2-0440f60f65ad/image.png"
---
언젠가 테크리드가 이런 얘기를 한 적이 있다.
"React Hooks와 함수형 프로그래밍은 서로 밀접한 관계가 있지만, 엄연히 달라요." <br/>
그렇다면 이 둘은 어떤 특징을 가지고 있고, 어떤 밀접한 관계가 있는지 알아보려고 한다.

### React Hooks란?
Hooks는 함수형 컴포넌트에서 React의 `상태`와 `생명주기` 기능에 직접적으로 연결(hook)할 수 있도록 해주는 함수이다.
class형 컴포넌트를 사용하지 않고도 함수형 컴포넌트 내에서 componentDidMount(), componentDidUpdate(), componentWillUnmount() 같은 기능을 활용할 수 있다.

### 함수형 프로그래밍
함수형 프로그래밍은 프로그래밍 철학 또는 프로그래밍이다. 
이것의 핵심은 **"데이터와 상태를 변경하지 않고, 순수한 함수들로 코드를 작성"**하는데 있다.
이를 통해서 코드의 `예측 가능성`과 `가독성`을 높이는 게 목표이다.

함수형 프로그래밍의 주요원칙을 보면 다음과 같다. 
1. **불변성:** 데이터를 직접 변경하는 것을 피하고, 대신 값을 업데이트한 새로운 데이터 구조를 생성한다. <br/>
2. **순수함수:** 동일한 입력값에 대해 항상 동일한 출력값을 반환하며, 부작용을 일으키지 않는 함수이다. <br/>
3. **일급함수와 고차함수:** 함수를 값처럼 취급하여, 함수가 다른 함수의 인수로 전달되거나 반환될 수 있으며 변수에 할당될 수 있다. <br/>
4. **선언형 프로그래밍:** 프로그램이 수행해야 할 작업을 기술하는데 중점을 두며, 이를 달성하기 위한 세부 단계를 나열하지 않는다.

### React Hooks와 함수형 프로그래밍의 연결고리
hooks는 함수형 프로그래밍의 아이디어를 기반으로 만들어졌다. <br/>

**1. 불변성** <br/>
리액트에서 불변성은 기본적인 개념이다. state와 props는 불변한다. 이 말은 한번 상태가 set되고 update되면 직접적으로 수정될 수 없다는 것을 의미한다.
이렇게 됨으로써 예상치못한 변수를 피하고 디버깅을 쉽게할 수 있게 만들어준다.
```js
  const [todos, setTodos] = useState([]);

  const addTodo = (text) => {
    const newTodo = { id: Date.now(), text };
    setTodos((prevTodos) => [...prevTodos, newTodo]);
  };
```
위 코드 예시에서 볼 수 있듯이, 배열을 바로 수정하는게 아니라 업데이트된 elements와 같이 새로운 배열을 만든다.

**2. 순수 함수**

리액트에서 함수형 컴포넌트에서 순수 함수는 매우 중요한 역할을 한다.
대부분의 React 컴포넌트는 함수형으로 작성되며, props를 입력받아 UI를 반환하는 순수 함수처럼 동작한다.
React는 순수 함수형 컴포넌트를 만들기위해 `React.memo`를 제공한다. props가 변경될 때에만 이 컴포넌트가 리렌더될 것이다.

```js
import React, { memo } from 'react';

const PureComp = memo(props => {
  return <div>{props.message}</div>;
});
```
**3. 고차 컴포넌트 (Higher-Order Component)**

고차 컴포넌트는 컴포넌트를 입력으로 받아, 새로운 컴포넌트를 반환하는 함수이다. 이는 React의 조합적 특성에서 파생된 패턴으로 볼 수 있다.
```js
// Higher-Order Component (HOC)
function withLoading(WrappedComponent) {
  return function WithLoadingComponent({ isLoading, ...props }) {
    if (isLoading) {
      return <div>Loading...</div>; // 로딩 중일 때 표시할 UI
    }
    return <WrappedComponent {...props} />; // 로딩이 끝난 후 전달받은 컴포넌트 렌더링
  };
}
// 일반 컴포넌트
function MyComponent({ data }) {
  return (
    <div>
      <h1>Data:</h1>
      <p>{data}</p>
    </div>
  );
}

// HOC를 적용한 컴포넌트
const MyComponentWithLoading = withLoading(MyComponent);

// 사용 예시
function App() {
  const isLoading = true;
  const data = "This is the loaded data";

  return (
    <div>
      <MyComponentWithLoading isLoading={isLoading} data={data} />
    </div>
  );
}
```

**4. 일차 함수**

React의 Hooks는 함수형 컴포넌트 내부에서 state와 side-effect를 함수형 방식으로 처리할 수 있도록 해주는 일차 함수이다.
일급함수는 함수가 값처럼 취급되는 것을 의미한다. React의 Hooks는 함수 그 자체이기에 다른 함수 안에서 호출할 수 있고, 변수에 할당할 수 있으며,
다른 함수의 매개변수로 전달하거나 반환값으로 사용할 수 있다.

### React와 함수형 프로그래밍을 함께 사용하는 이유?

React에서 함수형 프로그래밍 원칙을 따르면, 더 선언적이고 읽기 쉬운 코드를 작성 가능하다.
상태 관리와 데이터 흐름이 명확해진다. 버그 발생 가능성이 줄어든다.

### React Hooks와 함수형 프로그래밍의 다른 점 
Hooks는 함수형 프로그래밍 원칙(불변성,순수성,선언형 스타일)을 따라 설계되었지만, 함수형 프로그래밍 자체는 더 넓고 일반적인 개념으로 볼 수 있다.

### 마치며

React Hooks를 필수로 사용하며 개발하고 있지만, 함수형 프로그래밍 형식으로 개발하고 있다는 것을 전혀 인식하지 못하고 있었던 것 같다.
앞으로는 내가 Hooks를 사용하게 됨으로써 불변성,순수성,선언형 스타일로 코드를 작성하게 되는구나를 인식하며 개발을 할 수 있을 것 같다.


### 참고
- https://blog.saeloun.com/2024/07/25/functional-programming-in-react/
- https://javascript.plainenglish.io/links-between-react-hooks-and-functional-programming-3d86fdb1b645
- https://javascript.plainenglish.io/functional-programming-with-react-ef55329cc524