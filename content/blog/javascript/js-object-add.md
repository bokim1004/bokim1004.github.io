---
title: 자바스크립트 객체에 프로퍼티를 추가하는 방법
date: 2023-03-11 17:03:42
category: javascript
thumbnail: { thumbnailSrc }
image: 'https://velog.velcdn.com/images/chloeee/post/ead6b29b-6ea7-40d9-8c71-6047800518c2/image.png'
draft: false
---

이번주에 기억남는 에러 중 하나가 있었는데요. <br/>
신발 사이즈를 입력하고 이전페이지에 갔다가 다시 오면 신발 사이즈 입력한게 사리지는 이슈였습니다 ㅠㅠ<br/>
이전페이지에서 선택한 신발정보 상태에 추가로 "size" 프로퍼티를 추가하는 방법으로 이 문제를 해결할 수 있었습니다.
다른 방법이 있었을지 모르겠지만, 다른 개발자와 얘기를 해본 결과 이 방법이 최선인 것 같았습니다.

<p align="center">
<img src="https://velog.velcdn.com/images/chloeee/post/49242c83-35f6-47ac-ad69-548d45799ff5/image.png" width="250px" height="400px" >
</p>

각각 선택한 신발의 사이즈를 입력해줍니다. 이 때, 기존에 존재하는 선택한 신발의 값을 가지고 있는 객체에 size프로퍼티를 추가해줍니다. <br/>
사이즈를 입력하면 그럼 아래와 같이 size 프로퍼티에 값이 추가되는 것을 확인할 수 있습니다.

```js
array = [
  {
    id: 1234,
    brand: 'A.P.C',
    modelName: '화이트 스니커즈',
    shoeId: 'example',
    size: 230,
  },
]
```

선택한 신발의 리스트는 selectedShoe라는 선택한 신발 값 객체를 담고있는 배열을 map으로 돌려준 것입니다.

```js
  const [selectedShoe, setSelectedShoe] = useRecoilState(selectShoesSelector);
  {selectedShoe.map((shoe: any, idx: number) => {<></>}}
```

selectedShoe의 상태에 size가 추가되었으니, 그럼 이전 페이지에 갔다가 다시 와도 사이즈 값이 사라지지 않게 됩니다.

코드를 간단하게 살펴보면 아래와 같습니다.

```js
{selectedShoe.map((shoe: any, idx: number) => {<>
  <h1>{shoe.brand}</h1>
  <h2>{shoe.modelName}</h2>
<Select
  defaultValue={shoe.size}
  onChange={(value: any) => {
    changeShoeSize(shoe, Number(value))
  }}
/>
</>}}
```

여러개 사이즈 중에 한 개를 선택할 때 함수 `changeShoeSize`를 호출합니다.
이 함수 안에서 size 프로퍼티를 추가해주는 로직을 짜야했습니다.

```js
const changeShoeSize = (shoe: any, size: number) => {
  //selectedShoe에 map을 돌려 새로운 배열을 만든다. 이 때,size를 추가해준다.
  let shoeWithSize = selectedShoe.map((value: any) => {
    if (value._id === shoe._id) {
      return {
        ...value,
        size: size,
      }
    }
    return value
  })
  setSelectedShoe([...shoeWithSize])
}
```

새로운 배열을 만들어주는 map을 이용해 size 프로퍼티를 추가하여 줍니다. `setSelectedShoe`될 때 `shoeWithSize` 배열 값을 복사해줍니다.
그리고 조건을 걸어줘서 현재 사이즈 값을 변경하는 곳에만 size 프로퍼티를 추가해줘야 합니다.
그럼 끝!! <br/>

추가적으로 `객체에 프로퍼티를 추가하는 방법`에는 무엇이 있을까 알아보았습니다.
<br/>

### 1. Dot Notation (.) 사용하기

가장 쉬운 방법은 Dot natation을 사용하는 방법입니다.
아래 예제를 살펴봅시다.

```js
let obj = {
  name: 'chloe',
  age: 24,
  major: 'Computer Science',
}
//위 객체에 새로운 프로퍼티를 추가해줍니다.
obj.secondName = 'Jain'
obj.gender = 'Female'
```

콘솔로그를 다시 찍어보면 아래와 같이 나오게 됩니다.

```js
{
  name: 'chloe',
  age: 24,
  major: 'Computer Science',
  secondName: 'Jain',
  gender: 'Female',
}
```

여기서 주의할 점은 프로퍼티 네임에 숫자나 특수문자를 입력하면 안된다는 것입니다.

```js
obj.123name = 'Hello';
```

위와 같이쓰면 `Syntax Error`가 납니다.

```js
SyntaxError: Invalid or unexpected token
```

<br/>

### 2. Square Brackets Notation [] 사용하기

위의 예시처럼 dot notation 사용이 어려운 경우가 있습니다.
이 때 `Brackets Notation []`을 사용해 객체에 새로운 프로퍼티를 추가할 수 있습니다.
아래 예시를 살펴봅시다.

```js
let obj = {
  name: 'India',
  state: 'Delhi',
}
obj['state'] = 'Mumbai' //이미 존재하는 state 프로퍼티를 변경
obj.city = {} //obj 아래 객체 추가
obj['city']['name'] = 'Navi Mumbai' //city프로퍼티에 name 프로퍼티 추가
obj.city['street'] = 12 // dot and square bracket notation 혼합
```

콘솔로그를 찍어보면 아래와 같이 나올 것입니다.

```js
{ name: 'India',
  state: 'Mumbai',
  city: { name: 'Navi Mumbai', street: 12 } }
```

<br/>

### 3. Object.defineProperty() 사용하기

```js
Object.defineProperty(obj, new_property, configuration)
```

이 메소드를 사용하면 객체를 변경할 수 있게 해줍니다.
예시를 살펴보겠습니다.

```js
let obj = {}
Object.defineProperty(obj, 'id', {
  value: 101,
  writable: false, // false로 하면 id 프로퍼티는 수정할 수 없습니다.
})
obj.id = 412 //'id' property에 영향을 주지 않습니다.
console.log('Object ID:', obj.id) // 101로 나옵니다.

Object.defineProperty(obj, 'name', {
  value: 'Chloe',
  writable: true, // true면 name property는 변경가능합니다.
obj.name = 'Mayank Jain' //name property를 변경할 수 있습니다.
console.log('Object Name:', obj.name) //prints 'Mayank Jain'
```

<br/>

### 4. Object.assign() 사용하기

이 메소드를 사용해도 객체에 프로퍼티를 추가할 수 있습니다.

```js
Object.assign(target, source)
```

```js
let student = { name: 'Chloe', age: 25 }
let info = { gender: 'Female', nationality: 'Korean' }

Object.assign(student, info) //info Object를 student객체에 추가할 수 있다.
console.log(student) // stundent객체에 info객체가 추가된다.
console.log(info) //info객체만 나온다
```

콘솔을 찍은 결과는 짜잔..!!

```js
//student
{ name: 'Chloe', age: 25, gender: 'Female', nationality: 'Korean'}
//info
{ gender: 'Female', nationality: 'Korean' }
```

<br/>

### 5. Spread Operater(...) 사용하기

`Spread operator (...)`는 기존에 존재하는 객체를 복사합니다.
예시를 살펴봅시다.

```js
let obj = { name: 'Mayank', id: '035' }
console.log(obj)
obj = { ...obj, nationality: 'Indian', gender: 'Male' } //기존 객체를 복사하고 프로퍼티를 추가한다.
console.log(obj) //새로운 프로퍼티를 추가한 객체가 프린트 된다.

let obj2 = { country: 'India', city: 'Delhi', pincode: '110053' }
let obj3 = { name: 'Raj', lastName: 'Kumar', age: '21', gender: 'Male' }

obj3 = { ...obj3, ...obj2 } //obj3객체에 obj2객체 프로퍼티를 추가한다.
console.log(obj3)
```

콘솔 찍힌 것을 차례로 보면 아래와 같습니다.

```js
{ name: 'Mayank', id: '035' }

{ name: 'Mayank',
  id: '035',
  nationality: 'Indian',
  gender: 'Male' }

{ name: 'Raj',
  lastName: 'Kumar',
  age: '21',
  gender: 'Male',
  country: 'India',
  city: 'Delhi',
  pincode: '110053' }
```

## 결론

객체에 프로퍼티를 추가하는 방법에 대해 정리해보았습니다.<br/>
평소에 익숙하지 않았던 Brackets Notation[]을 사용하거나, Object.defineProperty()를 사용하는 방법으로도 객체에 프로퍼티를 추가할 수 있구나를 이번 기회에 알게되었네요.<br/>
이 글이 도움이 되길 바라며 이번 글을 마칩니다 :)

> 참고 :https://www.scaler.com/topics/add-property-to-object-javascript/
