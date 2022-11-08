---
title: 타입스크립트의 타입 시스템
date: 2022-11-06 22:11:09
category: typescript
thumbnail: { thumbnailSrc }
draft: false
---

타입스크립트는 코드를 자바스크립트로 변환하는 역할도 하지만 가장 중요한 역할은 `타입 시스템`에 있다.

### 타입이 값들의 집합이라고 생각하기

런타임에 모든 변수는 자바스크립트 세상의 값으로부터 정해지는 각자의 고유한 값을 가진다.
변수에는 다음처럼 다양한 종류의 값을 할당할 수 있다.
그러나 코드가 실행되기 전, 즉 타입스크립트가 오류를 체크하는 순간에는 `타입을 가지고 있다.`
`할당가능한 값들의 집합`이 타입이다.

가장 작은 집합은 아무 값도 포함하지 않는 공집합이며, 타입스크립트에서는 `never 타입`이다.
never타입으로 선언된 변수의 범위는 공집합이기에 아무런 값도 할당할 수 없다.

그 다음으로 작은 집합은 한 가지 값만 포함하는 타입이다. 이들은 타입스크립트에서는 유닛타입이라고도 불리는 리터럴 타입이다.

```ts
type A = 'A'
type Twelve = 12
```

두 개 혹은 세 개로 묶으려면 유니온 타입을 사용한다.

```ts
type AB = 'A' | 'B'
type AB12 = 'A' | 'B' | 12
```

`&연산자`는 두 타입의 인터섹션(교집합)을 계산한다.

```ts
interface Person {
  name: string
}
interface Lifespan {
  birth: Date
  death?: Date
}
type PersonSpan = Person & Lifespan
```

언뜻 보기에 Person과 Lifespan 인터페이스는 공통으로 가지는 속성이 없기에 PersonSpan의 타입을 공집합(never타입)으로 예상하기 쉽다.
그러나 타입 연산자는 인터페이스의 속성이 아닌 , 값의 집합(타입의 범위)에 적용된다.
그래서 Person과 Lifespan 둘다 가지는 값은 인터섹션 타입에 속하게 된다.

```ts
const ps: PersonSpan = {
  name: 'david',
  birth: new Date('1912/04/04'),
  death: new Date('1954/04/02'),
}
```

당연히 앞의 세 가지보다 더 많은 속성을 가지는 값도 PersonSpan타입에 속한다.
`인터섹션 타입의 값은 각 타입 내의 속성을 모두 포함하는 것이 일반적인 규칙이다`
조금 더 일반적으로 PersonSpan 타입을 선언하는 방법은 `extends 키워드`를 쓰는 것이다.

```ts
interface Person {
  name: string
}
interface PersonSpan extends Person {
  birth: Date
  death?: Date
}
```

---

### 타입 단언보다는 타입 선언을 사용하기

타입스크립트에서 변수에 값을 할당하고 타입을 부여하는 방법은 두 가지이다.

```ts
interface Person {
  name: string
}
const alice: Person = { name: 'Alice' } //타입은 Person
const bob = { name: 'BoB' } as Person //타입은 Person
```

이 두 가지 방법은 결과가 같아 보이지만 그렇지 않다.
첫 번째 `alice:Person`은 변수에 타입선언을 붙여서 그 값이 `선언된 타입`임을 명시한다.
두 번째 `as Person`은 타입 단언을 수행한다. 그러면 타입스크립트가 추론한 타입이 있더라도 Person타입으로 간주한다.
** 타입 단언보다 타입 선언을 사용하는 게 낫다.**

```ts
const alice: Person = {}
// Person유형에 필요한 name속성이  {}유형에 없습니다.
const bob = {} as Person
// 오류 없음
```

타입 선언은 할당되는 값이 해당 인터페이스를 만족하는지 검사한다. 타입 단언은 강제로 타입을 지정했으니 타입 체커에게 오류를 무시하라고 하는 것이다.
타입 선언과 타입 단언의 차이는 속성을 추가할 때도 마찬가지다.

```ts
const alice: Person = {
  name:'alice',
  occupation:'developer;
}
// 개체 리터럴은 알려진 속성만 지정할 수 있으며 Person형식에 occupation이 없습니다.
const bob = {
  name:'bob',
  occupation:'developer'
} as Person
// 오류 없음
```

타입 단언이 꼭 필요한 경우가 아니라면, 안전성 체크도 되는 타입 선언을 사용하는 것이 좋다.

---

### 함수 표현식에 타입 적용하기

자바스크립트와 타입스크립트에서는 함수 문장(statement)과 함수 표현식(expression)을 다르게 인식한다.

```ts
//문장
function rollDice1(sides: number): number {
  //~~
}
//표현식
const rollDice2 = function (sides: number): number {
  //~~
}
//표현식
const rollDice3 = (sides: number): number => {
  //
}
```

타입스크립트에서는 `함수 표현식`을 사용하는 것이 좋다. 함수의 매개변수부터 반환값까지 전체를 함수 타입으로 선언하여 함수 표현식에 재 사용할 수 있다는 장점이 있다.

```ts
type DiceRollFn = (sides: number) => number
const rollDice: DiceRollFn = (sides) => {
  //
}
```

함수 타입의 선언은 불필요한 코드의 반복을 줄인다. 사칙 연산을 하는 함수 네개는 다음과 같이 작성할 수 있다.

```ts
function add(a: number, b: number) {
  return a + b
}
function sub(a: number, b: number) {
  return a - b
}
function mul(a: number, b: number) {
  return a * b
}
function div(a: number, b: number) {
  return a / b
}
```

반복되는 함수 시크니처를 하나의 함수 타입으로 통합할 수 있다.

```ts
type BinaryFn = (a: number, b: number) => number
const add: BinaryFn = (a, b) => a + b
const sub: BinaryFn = (a, b) => a - b
const mul: BinaryFn = (a, b) => a * b
const div: BinaryFn = (a, b) => a / b
```

`매개변수나 반환 값에 타입을 명시하기보다 함수 표현식 전체에 타입 구문을 적용하는 것이 좋다.`<br/>
위 형식의 타입 구문 적용은 처음봤는데 다음에 꼭 적용해봐야겠다.

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
