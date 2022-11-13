---
title: 동적 데이터에 인덱스 시그니처 사용하기
date: 2022-11-13 13:11:29
category: typescript
thumbnail: { thumbnailSrc }
draft: false
---

> 이펙티브 타입스크립트를 읽고 공부한 것을 기록합니다.

자바스크립트의 장점 중 하나는 바로 객체를 생성하는 문법이 간단하다는 것이다.

```ts
const rocket = {
  name: 'Falcon 9',
  variant: 'Block 5',
  thrust: '7,067 KN',
}
```

자바스크립트 객체는 문자열 키를 타입의 값에 관계없이 매핑한다.
타입스크립트에서는 타입에 `인덱스 시그니처`를 명시하여 유연하게 매핑을 표현할 수 있다.

```ts
type Rocket = { [property: string]: string }
const rocket: Rocket = {
  name: 'Falcon 9',
  variant: 'Block 5',
  thrust: '7,067 KN',
} // 정상
```

`[property:string] :string`이 인덱스 시그니처이며 다음 세 가지 의미를 가지고 있다.

`키의 이름` : 키의 위치만 표시하는 용도이다. 타입 체커에서는 사용하지 않기에 무시할 수 있는 참고 정보이다.
`키의 타입` : string이나 number 또는 symbol의 조합이어야 하지만, 보통은 string을 사용한다.
`값의 타입`: 어떤 것이든 될 수 있다.

이렇게 타입 체크가 수행되면 네가지 단점이 드러난다.

1. 잘못된 키를 포함해 모든 키를 허용한다. name대신 Name으로 작성해도 유요한 Rocket타입이 된다.
2. 특정 키가 필요하지 않다. {}도 유효한 Rocket타입이다.
3. 키마다 다른 타입을 가질 수 없다. 예를 들어 thrust는 string이 아니라 number여야할 수도 있다.
4. 타입스크립트 언어 서비스는 다음과 같은 경우에 도움이 되지 못한다. name:을 입력할 때, 키는 무엇이든 가능하기에 자동완성 기능이 동작하지 않는다.

결론적으로 인덱스 시그니처는 부정확하므로 더 나은 방법을 찾아야 한다.
`인덱스 시그니처`는 동적 데이터를 표현할 떄 사용한다.
예를 들어 CSV파일처럼 행과 열에 이름이 있고 데이터행을 열 이름과 값으로 매핑하는 객체로 나타내고 싶은 경우이다.

```ts
function parseCSV(input: string): { [columName: string]: string[] } {
  const lines = input.split('\n')
  const [header, ...rows] = lines
  const headerColumns = header.split(',')

  return rows.map((rowStr) => {
    const row: { [columnName: string]: string } = {}
    rowStr.split(',').forEach((cell, i) => {
      row[headerColumns[i]] = cell
    })
    return row
  })
}
```

일반적으로 열 이름이 무엇인지 미리 알 방법은 없다. 이럴 때는 인덱스 시그니처를 사용한다.
반면에 열 이름을 알고 있는 특정한 상황에 parseCSV가 사용된다면 미리 선언해둔 타입으로 단언문을 사용한다.

```ts
interface ProductRow {
  productId: string
  name: string
  price: string
}

declare let csvData: string
const products = parseCSV(csvData) as unknown as productRow[]
```

아래의 예시를 한번 봐보자.

```ts
interface Row1 {
  [column: string]: number
} // 너무 광범위

interface Row2 {
  a: number
  b?: number
  c?: number
  d?: number
} // 최선

type Row3 =
  | { a: number }
  | { a: number; b: number }
  | { a: number; b: number; c: number }
  | { a: number; b: number; c: number; d: number }
// 가장 정확하지만 사용하기 번거로움
```

string타입이 너무 광범위해서 인덱스 시그니처를 사용하는데 문제가 있다면 두 가지 다른 대안을 생각해 볼 수 있다.

첫 번째, `Record를 사용하는 방법`이다. Record는 키 타입에 유연성을 제공하는 제너릭타입이다.
특히 string의 부분 집합을 사용할 수 있다.

```ts
type Vec3D = Record<'x' | 'y' | 'z', number>;
Type Vec3D = {
  x:number;
  y:number;
  z:number;
}
```

두 번째, 매핑된 타입을 사용하는 방법이다. 매핑된 타입은 키마다 별도의 타입을 사용하게 해준다.

```ts
type Vec3D = { [k in 'x' | 'y' | 'z']: number };
Type Vec3D = {
  x:number;
  y:number;
  z:number;
}

type ABC = {  [k in 'a' | 'b' | 'c'] : k extends 'b' ? string :number};
Type ABC = {
  a:number;
  b:string;
  c:number;
}
```

#### 요약

- 런타임 때까지 객체의 속성을 알 수 없을 경우에만 (예를들어 CSV파일에서 로드하는 경우) 인덱스 시그니처를 사용하도록 한다.
- 안전한 접근을 위해 인덱스 시그니처의 값 타입에 undefined를 추가하는 것을 고려해야 한다.
- 가능하다면 인터페이스, Record, 매핑된 타입같은 인덱스 시그니처보다 정확한 타입을 사용하는 것이 좋다.
