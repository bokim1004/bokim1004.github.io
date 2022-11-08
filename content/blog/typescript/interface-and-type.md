---
title: interface and type
date: 2022-11-08 23:11:40
category: typescript
thumbnail: { thumbnailSrc }
draft: false
---

### 타입과 인터페이스의 차이점 알기

타입스크립트에서 명명된 타입을 정의하는 방법은 2가지가 있다.

```ts
type Tstate {
  name:string;
  capital:string;
}
interface Istate{
  name:string;
  capital:string;
}
```

대부분의 경우에는 타입을 사용해도 되고 인터페이스를 사용해도 된다.
그러나 타입과 인터페이스의 차이를 분명히 알고 같은 상황에서는 동일한 방법으로 명명된 타입을 정의해 일관성을 유지해야 한다.

**인터페이스 선언과 타입선언의 비슷한 점은 무엇일까?**

- 인덱스 시그니처는 인터페이스와 타입에서 모두 사용할 수 있다.

```ts
type TDict = { [key: string]: string }
interface IDict {
  [key: string]: string
}
```

- 함수 타입도 인터페이스나 타입으로 정의할 수 있다.

```ts
type TFn = (x: number) => string
interface IFn {
  (x: number): string
}
const toStrT: TFn = (x) => '' + x //정상
const toStrI: IFn = (x) => '' + x //정상
```

- 타입 별칭과 인터페이스는 모두 제너릭이 가능하다.

```ts
type TPair<T> = {
  first: T
  second: T
}
interface IPair<T> {
  first: T
  second: T
}
```

- 인터페이스는 타입을 확장할 수 있고 타입은 인터페이스를 확장할 수 있다.

```ts
interface IStateWithPop extends TState {
  population: number
}
type TStateWithPop = IState & { population: number }
```

여기서 주의할 점은 인터페이스는 유니온 타입 같은 복잡한 타입을 확장하지는 못한다는 것이다.
복잡한 타입을 확장하고 싶다면 타입과 &를 사용해야 한다.

**인터페이스 선언과 타입선언의 다른 점은 무엇일까?**

- 유니온 타입은 있지만 유니온 인터페이스라는 개념은 없다.

```ts
type AorB = 'a' | 'b'
```

인터페이스는 타입을 확장할 수 있지만 유니온은 할 수 없다. 그런데 유니온 타입을 확장하는게 필요할 때가 있다.
다음 코드를 봐보자. 아래처럼 사용할 수는 있다.

```ts
type Input = {}
type Output = {}
interface VariableMap {
  [name: string]: Input | Output
}
```

또는 유니온 타입에 name속성을 붙인 타입을 만들 수도 있다.

```ts
type NamedVariable = (Input | Output) & { name: string }
```

이 타입은 인터페이스로 표현할 수 없다. type키워드는 일반적으로 interface보다 쓰임새가 많다.
type키워드는 유니온이 될 수도 있고 매핑된 타입 또는 조건부 타입같은 고급기능에 활용되기도 한다.
튜플과 배열 타입도 type 키워드를 이용해 더 간결하게 표현할 수도 있다.

```ts
type Pair = [number, number]
type StringList = string[]
type NamedNums = [string, ...number[]]
```
