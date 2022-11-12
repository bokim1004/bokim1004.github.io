---
title: typescript-generic
date: 2022-11-10 22:11:17
category: typescript
thumbnail: { thumbnailSrc }
draft: false
---

### 타입 연산과 제너릭 사용으로 반복을 줄이기

타입 중복은 코드 중복만큼 많은 문제를 일으킨다.

```ts
interface Person {
  firstName: string
  lastName: string
}

interface PersonWithBirthDate {
  firstName: string
  lastName: string
  birth: Date
}
```

만약에 선택적 필드인 middleName을 Person에 추가한다고 가정해보자.
그러면 Person과 PersonWithBirthDate은 다른 타입이 된다.

위 예제에서는 한 인터페이스가 다른 인터페이스를 확장하게 해서 반복을 제거하게 한다.

```ts
interface Person {
  firstName: string
  lastName: string
}

interface PersonWithBirthDate extends Person {
  birth: Date
}
```

다음 예시로는 전체 애플리케이션의 상태를 표현하는 State타입과 단지 부분만 표현하는 TopNavState가 있는 경우가 있다.

```ts
interface State {
  userId: string
  pageTitle: string
  recentFiles: string[]
  pageContents: string
}

interface TopNavState {
  userId: string
  pageTitle: string
  recentFiles: string[]
}
```

TopNavState를 확장하여 State를 구상하기 보다, State의 부분 집합으로 TopNavState를 정의하는 것이 바람직해 보인다.
이 방법이 전체 앱의 상태를 하나의 인터페이스로 유지할 수 있게 해준다.
`state를 인덱싱하여 속성의 타입에서 중복을 제거할 수 있다.`

```ts
type TopNavState = {
  userId: State['userId']
  pageTitle: State['pageTitle']
  recentFiles: State['recentFiles']
}
```

State내의 pageTitle이 바뀌면 TopNavState에서도 반영된다. 그러나 여전히 반복되는 코드가 존재한다.
이 때 '매핑된 타입'을 사용하면 좀 더 나아진다.

```ts
type TopNavState = {
  [k in 'userId' | 'pageTitle' | 'recentFiles']: State[k]
}
```

매핑된 타입은 배열의 필드를 루프도는 것과 같은 방식이다.

정의가 완전하지는 않지만 다음과 같이 사용할 수 있다.

```ts
type Pick<T, K> = { [k in K]: T[k] }
type TopNavState = Pick<State, 'userId' | 'pageTitle' | 'recentFiles'>
```

여기서 Pick은 제너릭 타입이다.
중복된 코드를 없앤다는 관점에서 pick을 사용하는 것은 함수를 호출하는 것에 비유할 수 있다.
마치 함수에서 두 개의 매개변수 값을 받아서 결괏값을 반환하는 것처럼 Pick은 T,K 2가지 타입을 받아서 결과 타입을 반환한다.

태그된 유니온에서도 다른 형태의 중복이 발생할 수 있다.

```ts
interface SaveAction {
  type: 'save'
}
interface LoadAction {
  type: 'load'
}
type Action = SaveAction | LoadAction
type ActionType = 'save' | 'load' //타입 반복
```

Action유니온을 인덱싱하면 타입 반복없이 ActionType을 정의할 수 있다.

```ts
type ActionType = Action['type']'; // 타입은 'save' | 'load';

```

Action 유니온에 타입을 더 추가하면 ActionType은 자동적으로 그 타입을 포함한다.
ActionType은 Pick을 사용해 얻게되는 type속성을 가지는 인터페이스와는 다르다.

```ts
type ActionRec = Pick<Action, 'type'> // {type:"save" |"load"}
```
