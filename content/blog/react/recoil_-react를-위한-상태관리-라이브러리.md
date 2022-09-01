---
title: Recoil_ react를 위한 상태관리 라이브러리
date: 2022-08-29 18:08:80
category: react
thumbnail: { thumbnailSrc }
draft: false
---

<p align="center">
<img src="https://velog.velcdn.com/images/chloeee/post/be2b9861-ab51-4134-931a-06bb3dae2cf7/image.png" width="500px" >
</p>

## Recoil이란?

Recoil이라는 상태관리 라이브러리에 대해 알기 전에 React에는 어떠한 한계가 있고 Recoil은 어떤 역할을 하는지 알아보았다.

React에는 아래와 같은 한계가 있다.

1. 컴포넌트의 상태는 공통된 상위요소까지 끌어올려야만 공유될 수 있으며, 이 과정에서 거대한 트리가 다시 렌더링되는 효과를 야기하기도 한다.
2. Context는 단일 값만 저장할 수 있고, 자체 소비자(consumer)를 가지는 여러값들의 집합을 담을 수 없다.
3. 위 두 가지 특성이 트리의 최상단부터 트리의 말단까지의 코드 분할을 어렵게 한다.

API와 semantics 및 동작을, 가능한 React답게 유지하면서 이것을 개선하고자 한다.
<br/>
Recoil은 본질적인 방향 그래프를 정의하고 React트리에 붙인다. 상태 변화는 이 그래프의 뿌리(atoms)로부터 순수함수(selectors)를 거쳐 컴포넌트로 흐르며, 다음과 같은 접근 방식을 따른다.

- 공유상태(shared state)도 React의 내부상태(local state)처럼 간단한 get/set 인터페이스로 사용할 수 있도록 boilerplate-free API를 제공한다. (필요한 경우 reducers등으로 캡슐화할 수도 있다.)
- 동시성 모드를 비롯한 다른 새로운 React의 기능들과의 호환 가능성도 갖는다.
- 상태 정의는 점진적이고 분산되어 있기에 코드 분할이 가능하다.
- 상태를 사용하는 컴포넌트를 수정하지 않고도 상태를 파생된 데이터로 대체할 수 있다.
- 파생된 데이터를 사용하는 컴포넌트를 수정하지 않고도 파생된 데이터는 동기식과 비동기식 간에 이동할 수 있다.
- 탐색을 일급 개념으로 취급할 수 있고 심지어 링크에서 상태 전환을 인코딩할 수 있다.
- 전체 애플리케이션 상태를 하위 호환되는 방식으로 유지하기가 쉬우므로, 유지된 상태는 애플리케이션 변경에도 살아남을 수 있다.

=> https://recoiljs.org/ko/docs/introduction/motivation 에 위와 같이 Recoil에 대한 설명이 나와있는데, 위 내용만 보면 잘 알기가 어렵다. 주요 개념에 대해 더 알아보며 정리를 해보았다.

### 주요 개념

`Recoil`을 사용하면 atoms(공유상태)에서 selectors(순수 함수)를 거쳐 React컴포넌트로 내려가는 data-flow graph를 만들 수 있다. `Atoms`는 컴포넌트가 구독할 수 있는 상태의 단위다.
`Selectors`는 atoms 상태값을 동기 또는 비동기 방식을 통해 변환한다.

### ATOMS

Atoms는 상태의 단위이며 업데이트와 구독이 가능하다. `atom`이 업데이트되면 각각의 구독된 컴포넌트는 새로운 값을 반영하여 다시 렌더링된다.
`Atoms`는 atom함수를 사용해 생성한다.

```js
const fontSizeState = atom({
  key: 'fontSizeState',
  default: 14,
})
```

`Atoms`는 디버깅, 지속성 및 모든 atoms의 map을 볼 수 있는 특정 고급 API에 사용되는 고유한 키가 필요하다. 두 개의 atom이 같은 키를 갖는 것은 오류이기에 키 값은 전역적으로 고유하도록 해야 한다.

```js
function FontButton() {
  const [fontSize, setFontSize] = useRecoilState(fontSizeState)
  return (
    <button
      onClick={() => setFontSize((size) => size + 1)}
      style={{ fontSize }}
    >
      click to Enlarge{' '}
    </button>
  )
}
```

컴포넌트에서 atom을 읽고 쓰려면 `useRecoilState`라는 훅을 사용한다. React의 useState와 비슷하지만 상태가 컴포넌트 간에 공유될 수 있다는 차이가 있다.
버튼을 클릭하면 버튼의 글꼴 크기가 1만큼 증가하여

```js
function Text() {
  const [fontSize, setFontSize] = useRecoilState(fontSizeState)
  return <p style={{ fontSize }}>This text will increase in size too. </p>
}
```

### Selectors

`Selector`는 atoms나 다른 selectors를 입력으로 받아들이는 순수 함수다. 상위의 atoms 또는 selectors가 업데이트되면 하위의 selector함수도 다시 실행된다.
컴포넌트들은 selectors를 atoms처럼 구독할 수 있으며 selectors가 변경되면 컴포넌트들도 다시 렌더링된다.
<br/>

`Selectors`는 상태를 기반으로 하는 파생 데이터를 계산하는데 사용된다. 최소한의 상태 집합만 atoms에 저장하고 다른 모든 파생되는 데이터는 selectors에 명시한 함수를 통해 효율적으로 계산함으로써 쓸모없는 상태의 보존을 방지한다.
`Selectors`는 selector함수를 사용해 정의한다.

```js
const fontSizeLabelState = selector({
  key: 'fontSizeLabelState',
  get: ({ get }) => {
    const fontSize = get(fontSizeState)
    const unit = 'px'
    return `${fontSize}${unit}`
  },
})
```

`get`속성은 계산될 함수다. 전달되는 get 인자를 통해 atoms와 다른 selectors에 접근할 수 있다. 다른 atoms와 selectors에 접근하면 자동으로 종속 관계가 생성되므로, 참조했던 다른 atoms나 selectors가 업데이트되면 이 함수도 다시 실행된다.

이 fontSizeLabelState 예시에서 selector는 fontSizeState라는 하나의 atom에 의존성을 갖는다. 개념적으로 fontSizeLabelState selector는 fontSizeState를 입력으로 사용하고 형식화된 글꼴 크기 레이블을 출력으로 반환하는 순수 함수처럼 동작한다. <br/>

Selectors는 `useRecoilValue()`를 사용해 읽을 수 있다. `useRecoilValue()`는 하나의 atom이나 selector를 인자로 받아 대응하는 값을 반환한다. <br/>
fontSizeLabelState selector는 writable하지 않기에 `useRecoilState()`를 이용하지 않는다.

```js
function FontButton() {
  const [fontSize, setFontSize] = useRecoilState(fontSizeState)
  const fontSizeLabel = useRecoilValue(fontSizeLabelState)

  return (
    <>
      <div>Current font size: ${fontSizeLabel}</div>

      <button onClick={setFontSize(fontSize + 1)} style={{ fontSize }}>
        Click to Enlarge
      </button>
    </>
  )
}
```

### Recoil 활용 예시

변경된 값을 내부 state에 담아서 리스트형 atom에 넣는 로직이다.

```js
function RegisterModal() {
  const [formData, setFormData] = useState()
  const [list, setList] = useRecoilState(productState)
  const product = useRecoilValue(productState)
  const resetProduct = useResetRecoilState(productState)
  //쓰기전용
  const setList = useSetRecoilState(productsState)
  const setIsOpen = useSetRecoilState(modalState)

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setList((prev) => [...prev, formData])
    setIsOpen(false)
  }
}
```

컴포넌트가 사라질 때 값을 초기화 해줘야 한다. recoil은 전역 상태기에 특정 값으로 변경되지 않는 이상 이전 값을 유지하게 된다.<br/>
recoil에서는 reset함수를 추가로 제공해준다. useEffect를 통해 컴포넌트가 언마운트 되는 시점에 값을 초기화 해주지 않으면 기존 데이터가 그대로 불러와지는 오류가 발생한다.

```js
//상태 초기화
useEffect(() => {
  return () => {
    resetProdcut()
  }
}, [])
```

```js
export const productState = atom({
  key: 'productState',
  default: {
    idx: 0,
    name: '',
    category: '',
    brand: '',
    price: 0,
    desc: '',
  },
})
```

```js
function Product({data}){
    const list =useRecoilValue(productState);
    const setProduct = useSetRecoilState(productState);


    const handleDetail =(idx)=>{
        setProduct(list.filter((row)=>row.idx ===idx[0]);
        setRegisterOpen(true);)
    }
    return (
        data && (
            <article
            className='product'
            onClick={()=>handleDetail(data.idx)}>
            </article>
        )
    )
}
```

버튼를 클릭하면 버튼의 글꼴 크기가 증가하는 동시에 현재 글꼴 크기를 반영하도록 글꼴 크기 레이블을 업데이트하는 두 가지 작업이 수행된다.

참고 : https://recoiljs.org/ko/docs/introduction/core-concepts
