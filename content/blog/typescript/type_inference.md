---
title: 타입 추론
date: 2022-12-14 18:12:58
category: typescript
thumbnail: { thumbnailSrc }
image: 'https://velog.velcdn.com/images/chloeee/post/39563e2c-9400-4099-b125-7382c076ae1d/image.png'
draft: false
---

## 타입추론

타입스크립트는 타입 추론을 적극적으로 수행한다.
타입추론은 수동으로 명시해야하는 타입 구문의 수를 엄청나게 줄여주기에 코드의 전체적인 안정성이 향상된다.

### 추론 가능한 타입을 사용해 장황한 코드 방지하기

보통 타입 정보가 있는 라이브러리에서 콜백 함수의 매개변수 타입은 자동으로 추론된다.
다음 예제에서 express HTTP 서버 라이브러리를 사용하는 request와 reponse타입 선언은 필요하지 않다.

```js
// 이렇게 하지 맙시다.
app.get('/health', (request: express.Request, response: express.Response) => {
  response.send('OK')
})

//이렇게 합시다.
app.get('/health', (request, response) => {
  response.send('OK')
})
```

- 타입스크립트가 타입을 추론할 수 있다면 타입 구문을 작성하지 않는게 좋다.
- 추론될 수 있는 경우라도 객체 리터럴과 함수 반환에는 타입 명시를 고려해야 한다. 내부 구현의 오류가 사용자 코드 위치에 나타나는 것을 방지해준다.

#### 다른 타입에는 다른 변수 사용하기

자바스크립트에서는 한 변수를 다른 목적을 가지는 다른 타입으로 재사용해도 된다.
그러나 타입스크립트에서는 두 가지 오류가 발생한다.

```ts
let id = '12-34-56'
fetchProduct(id)
id = 123456
//'123456'형식은 string형식에 할당할 수 없다.
fetchProductBySerialNumber(id)
//string형식의 인수는 number형식의 매개변수에 할당될 수 없다.
```

타입스크립트는 '12-34-56'이라는 값을 보고, id의 타입을 string으로 추론했다.
string타입에는 number타입을 할당할 수 없기에 오류가 발생한다.

여기서 변수의 값은 바뀔 수 있지만 그 타입은 보통 바뀌지 않는다는 걸 알 수 있다.
타입을 바꿀 수 있는 한가지 방법은 범위를 좁히는 것인데, 새로운 변수 값을 포함하도록 확장하는 것이 아니라 타입을 더 작게 제한하는 것이다.

id의 타입을 바꾸지 않으려면, string과 number를 모두 포함할 수 있도록 타입을 확장하면 된다.
`string | number`로 표현하며 유니온타입이라고 한다.

```ts
let id: string | number = '12-34-56'
fetchProduct(id)
id = 123456 // 정상
fetchProductBySerialNumber(id) //정상
```

타입스크립트는 첫 번째 함수 호출에서 id는 string으로, 두 번째 호출에서는 number라고 제대로 판단한다.
할당문에서 유니온 타입으로 범위가 좁혀졌기 때문이다.

유니온 타입으로 코드가 동작하긴 하겠지만 더 많은 문제가 생길 수 있다.
id를 사용할 때마다 값이 어떤 타입인지 확인해야하기에 유니온 타입은 string이나 number같은 간단한 타입에 비해 다루기 더 어렵다.
차라리 별도의 변수를 도입하는 것이 낫다.

```ts
const id = '12-34-56'
fetchProduct(id)

const serial = 123456
fetchProductBySerialNumber(serial)
```

다른 타입에는 별도의 변수를 사용하는게 바람직한 이유는 다음과 같다.

- 서로 관련이 없는 두 개의 값을 분리한다.
- 변수명을 더 구체적으로 지을 수 있다.
- 타입 추론을 향상시키며, 타입 구문이 불필요해진다.
- 타입이 좀 간결해진다.
- let 대신 const로 변수를 선언하게 된다. const로 변수를 선언하면 코드가 간결해지고, 타입체커가 타입을 추론하기에도 좋다.

`타입이 바뀌는 변수는 되도록 피해야 하고, 목적이 다른 곳에는 별도의 변수명을 사용해야 한다.`

#### 타입 넓히기

상수를 사용해서 변수를 초기화할 때, 타입을 명시하지 않으면 타입체커는 타입을 결정해야 한다.
이 말은 지정된 단일 값을 가지고 할당 가능한 값들의 집합을 유추해야 한다는 뜻이다.

타입스크립트에서는 이러한 과정을 `넓히기`라고 한다.
넓히기의 과정을 이해한다면 오류의 원인을 파악하고 타입 구문을 더 효과적으로 사용할 수 있을 것이다.

타입 넓히기가 진행될 때, 주어진 값으로 추론 가능한 타입이 여러 개이기에 과정이 상당히 모호하다.

```ts
const mixed = ['x', 1]
```

정보가 충분하지 않다면 mixed가 어떤 타입으로 추론되어야 하는지 알 수 없다.

타입스크립트는 넓히기의 과정을 제어할 수 있도록 몇 가지 방법을 제공한다.
넓히기 과정을 제어할 수 있는 첫 번째 방법은 `const`다. 만약 let대신 const로 변수를 선언하면 더 좁은 타입이 된다.

그러나 const는 만능이 아니다. 객체와 배열의 경우에는 여전히 문제가 있다.
아이템 초반에 있는 mixed 예제(`const mixed = ['x', 1]`)는 배열에 대한 문제를 보여준다.
튜플 타입을 추론해야할지, 요소들은 어떤 타입으로 추론해야할지 알 수 없다.

타입 추론의 강도를 직접 제어하려면 타입스크립트의 기본 동작을 재정의해야 한다.
`타입스크립트의 기본 동작을 재정의하는 세 가지 방법`이 있다.

1. 명시적 타입 구문을 제공하는 것이다.

```ts
const v: { x: 1 | 3 | 5 } = {
  x: 1,
} // 타입이 {x: 1|3|5; }
```

2. 타입 체커에 추가적인 문맥을 제공하는 것이다.
3. const 단언문을 사용하는 것이다. const단언문과 변수 선언에 쓰이는 let이나 const와 혼동해서는 안된다.
   const 단언문은 온전히 타입 공간의 기법이다. 다음 예제를 통해 각 변수에 추론된 타입의 차이점을 살펴보자.

```ts
const v1 = {
  x: 1,
  y: 2,
} //타입은 {x:number; y:number; }
const v2 = {
  x: 1 as const,
  y: 2,
} // 타입은 {x:1, y:number}
```

값 뒤에 `as const`를 작성하면 타입스크립트는 최대한 좁은 타입으로 추론된다.
또한 배열을 튜플 타입으로 추론할 때도 as const를 사용할 수 있다.

```ts
const a1 = [1, 2, 3] // 타입이 number[]
const a2 = [1, 2, 3] as const // 타입이 readonly[1,2,3]
```

- 타입스크립트가 넓히기를 통해 상수의 타입을 추론하는 방법을 이해해야 한다.
- 동작에 영향을 줄 수 있는 방법인 const,타입 구문, 문맥,as const에 익숙해져야 한다.

#### 타입 좁히기

타입 좁히기는 타입스크립트가 넓은 타입으로부터 좁은 타입으로 진행하는 과정을 말한다.
가장 일반적인 예시는 null체크다.

```ts
const el = document.getElementById('foo'); //타입이 HTMLElement | null
if(el) {
  el //타입이 HTMLElement
  el.innerHTML  = 'Party Time".blink();
}
else {
  el // 타입이 null
  alert('No element #foo');
}
```

만약 el이 null이면 분기문의 첫 번째 블록이 실행되지 않는다.
첫번째 블록에서 HTMLElement | null 타입의 null을 제외하므로, 더 좁은 타입이 되어 작업이 훨씬 쉬워진다.

`Array.isArray`같은 일부 내장 함수로도 타입을 좁힐 수 있다.

```ts
function contains(text: string, terms: string | string[]) {
  const termList = Array.isArray(terms) ? terms : [terms]
  termList // 타입이 string[]
}
```

`타입스크립트는 일반적으로 조건문에서 타입을 좁히는데 매우 능숙하다`
그러나 타입을 섣불리 판단하는 실수를 저지르기 쉬우므로 다시 한번 꼼꼼히 따져봐야 한다.
예를 들어 다음 예제는 유니온 타입에서 null을 제외하기 위해 잘못된 방법을 사용했다.

```ts
const el = document.getElementById('foo') // 타입이 HTMLElement | null
if (typeof el === 'object') {
  el // 타입이 HTMLElement | null
}
```

자바스크립트에서는 typeof null이 `object`이기에 if구문에서 null이 제외되지 않았다.

타입스크립트가 타입을 식별하지 못한다면 식별을 돕기 위해 커스텀 함수를 도입할 수 있다.

```ts
function isInputElement(el: HTMLElement): el is HTMLInputElement {
  return 'value' in el
}

function getElementContent(el: HTMLElement) {
  if (isInputElement(el)) {
    el // 타입이 HTMLInputElement
    return el.value
  }
  el // 타입이 HTMLElement
  return el.textContent
}
```

이러한 기법은 `사용자 정의 타입 가드`라고 한다.
반환 타입의 el is HTMLInputElement는 함수 반환이 true인 경우, 타입 체커에서 매개변수의 타입을 좁힐 수 있다고 알려준다.

타입스크립트에서 타입이 어떻게 좁혀지는지 이해한다면 타입추론에 대한 개념을 잡을 수 있고, 오류 발생의 원인을 알 수 있으며 타입 체커를 더 효율적으로 할 수 있다.

#### 비동기 코드에는 콜백대신 async 함수 사용하기

과거의 자바스크립트에서는 비동기 동작을 모델링하기 위해 콜백을 사용했다.
그렇기에 악명 높은 콜백 지옥을 필연적으로 마주할 수밖에 없었다.

콜백이 중첩된 코드는 직관적으로 이해하기 어렵다. 요청들을 병렬로 실행하거나 오류 상황을 빠져나오고 싶다면 더욱 혼란스러워진다.
ES2015는 콜백 지옥을 극복하기 위해 프로미스 개념을 도입했다.

```ts
const page1Promise = fetch(url1)
page1Promise
  .then((response1) => {
    return fetch(url2)
  })
  .then((response2) => {
    return fetch(url3)
  })
  .then((response3) => {
    //
  })
  .catch((error) => {})
```

코드의 중첩도 적어졌고 실행순서도 코드 순서와 같아졌다.
ES2017에서는 `async await `키워드를 도입하여 콜백 지옥을 더욱 간단하게 처리할 수 있게 되었다.

```ts
async function fetchPages() {
  const response1 = await fetch(url1)
  const response2 = await fetch(url2)
  const response3 = await fetch(url3)
}
```

await 키워드는 각각의 프로미스가 처리될 때까지 fetchPages함수의 실행을 멈춘다.
async함수 내에서 await중인 프로미스가 거절되면 예외를 던진다.
이를 통해 일반적인 try/catch구문을 사용할 수 있다.

```ts
async function fetchPages() {
  try {
    const response1 = await fetch(url1)
    const response2 = await fetch(url2)
    const response3 = await fetch(url3)
  } catch (e) {}
}
```

콜백보다는 프로미스나 async/await을 사용해야하는 이유는 다음과 같다

- 콜백보다는 프로미스가 코드를 작성하기 쉽다.
- 콜백보다는 프로미스가 타입을 추론하기 쉽다.

예를 들어, 병렬로 페이지를 로드하고 싶다면 `Promise.all`을 사용해서 프로미스를 조합하면 된다.

```ts
async function fetchPages() {
  const [response1, response2, response3] = await Promise.all([
    fetch(url1),
    fetch(url2),
    fetch(url3),
  ])
}
```

일반적으로 프로미스를 생성하기 보다 async/await을 사용해야 한다.

- 일반적으로 더 간결하고 직관적인 코드가 된다.
- async함수는 항상 프로미스를 반환하도록 강제한다.
