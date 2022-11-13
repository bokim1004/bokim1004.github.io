---
title: 타입 연산과 제너릭 사용으로 반복을 줄이기
date: 2022-11-10 22:11:17
category: typescript
thumbnail: { thumbnailSrc }
draft: false
---

> 이펙티브 타입스크립트를 읽고 공부한 것을 기록합니다.

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

값의 형태에 해당되는 타입을 정의하고 싶을 때도 있다.

```ts
const InIT_OPTIONS = {
  width: 640,
  height: 480,
  color: '#00fff',
  label: 'VGA',
}

interface Options {
  width: number
  height: number
  color: string
  label: string
}
```

이런 경우 typeof를 사용하면 된다.

```ts
type Options = typeOf INIT_OPTIONS;
```

이 코드는 자바스크립트의 런타임 연산자 typeof를 사용한 것처럼 보이지만, 실제로는 타입스크립트 단게에서 연산되며 훨씬 더 정확하게 타입을 표현한다.
그런데 값으로부터 타입을 만들어 낼 때는 선언의 순서에 주의해야 한다. 타입 정의를 먼저하고 값이 그 타입에 할당 가능하다고 선언하는 것이 좋다.

```ts
function getUserInfo(userId: string) {
  //...
  return {
    userId,
    name,
    age,
    height,
    weight,
    favoriteColor,
  }
}
//추론된 반환타입은 {userId:string; name:string; age:number...}
```

표준 라이브러리에는 이러한 일반적 패턴의 제너릭 타입이 정의되어있다.
이런 경우 ReturnType 제너릭이 정확히 들어맞는다.

```ts
type UserInfo = ReturnType<typeof getUserInfo>
```

ReturnType은 함수의 값인 getUserInfo가 아니라 함수의 타입인 `typeof getUserInfo`에 적용되었다.
typeof와 마찬가지로 이런 기법은 신중하게 사용해야 한다.
적용 대상이 값인지 타입인지 정확히 알고 구분해서 처리해야 한다.

`Pick`의 정의는 extends를 사용해서 완성할 수 있다. 타입체커를 통해 기존 예제를 실행해보면 오류가 발생한다.

```ts
type Pick<T, K> = {
  [k in K]: T[k]
  //~'K'타입은 'string | number | symbol' 타입에 할당할 수 없다.
}
```

K는 T타입과 무관하고 범위가 너무 넓다. K는 인덱스로 사용될 수 있는 string | number | symbol이 되어야 하며 실제로는 범위를 조금 더 좁힐 수 있다.
K는 실제로 T의 키의 부분 집합, 즉 keyof T가 되어야 한다.

```ts
type Pick<T, K extends keyof T> = {
  [k in K]: T[k] //정상
}
```

타입이 값의 집합이라는 관점에서 생각하면 extends를 확장이 아니라 `부분 집합`이라는 걸 이해하는데 도움이 될 것이다.

#### 요약

- 타입들간의 매핑을 위해 타입스크립트가 제공한 도구들을 공부하면 좋다.
  여기에는 keyof, typeof,인덱싱, 매핑된 타입들이 포함된다.
- 제너릭 타입은 타입을 위한 함수와 같다. 타입을 반복하는 대신 제너릭 타입을 사용하여 타입들 간에 매핑을 하는 것이 좋다.
  제너릭 타입을 제한하려면 extends를 사용하면 된다.
- 표준 라이브러리에 정의된 `pick,Partial,ReturnType`같은 제너릭 타입에 익숙해져야 한다.
