---
title: 항해플러스 프론트엔드 5기_2주차 회고
date: 2025-04-06 22:04:35
category: etc
thumbnail: { thumbnailSrc }
draft: false
image: "https://velog.velcdn.com/images/chloeee/post/db477a29-3257-42ee-b936-58629e0ef09f/image.png"
---

### 들어가며

벌써 2주차가 지났고 3주차에 들어가게 되었다. 2주차의 과제 주제는 바로 virtualDom을 직접 구현하고 가상돔을 돔으로 변환하는 것이었다.
말로만 들어도 어렵겠다 생각했는데, 정말 쉽지 않은 과제였다.
많은 어려움들이 있었지만 운이 좋게 과제를 마무리할 수 있었다. 어떤 문제가 있었고 어떻게 해결했는지 정리해보았다-!

---

### 🌟 이번 과제를 통해 배운 점

<br/>

**1. virtualDom의 구조가 어떻게 생겼는지를 알게 되었다.**

Virtual DOM은 실제 DOM의 추상화된 형태로, 일반적으로 객체 트리 형태로 표현된다. 가상돔의 구조를 js객체로 표현하면 아래와 같다.

```js
const virtualDom = {
  type: 'div',
  props: {
    id: 'container',
    className: 'box',
  },
  children: [
    {
      type: 'h1',
      props: { style: 'color: blue' },
      children: ['Hello, Virtual DOM!'],
    },
    {
      type: 'ul',
      props: {},
      children: [
        {
          type: 'li',
          props: {},
          children: ['Item 1'],
        },
        {
          type: 'li',
          props: {},
          children: ['Item 2'],
        },
      ],
    },
  ],
};

```

- `type`: 태그 이름 (예: 'div', 'h1', 'ul')
- `props`: 해당 요소의 속성 (id, className, style 등)
- `children`: 자식 요소들 (문자열도 가능)

<br/>

**2. virtualDom을 직접 구현해보며 `실제 동작 원리`에 대해 파악할 수 있게 되었다.**

- `diffing과정이 어떻게 진행이 되는지 직접 코드를 작성하며 이해할 수 있게 되었다.`
  <br/>

  ⸰ diffing은 virtualDom에서 변경점을 찾아내는 과정인데, updateElement 함수를 작성하며 oldNode와 newNode를 비교하며 virtualDom tree를 비교하는 과정을 구현했다.<br/>
  ⸰ 가상 돔의 핵심은 diff 알고리즘이다. 이 알고리즘은 실제 DOM을 문서에서 분리된 (가상의) 새로운 DOM 요소의 사본으로 바꾸는 가장 빠른 방법을 찾아낸다.<br/>
  ⸰ newNode와 oldNode의 타입이 다르면 노드 교체가 필요하지만 같은 타입이라면 속성을 업데이트하고 자식 노드를 재귀적 업데이트하는 과정이 필요했다.
    <br/>

- `virtualDom 구현시 정규화 과정을 거치고, 왜 이 과정이 필요한지 알게 되었다.`
  <br/>

  ⸰ normalizeVNode 함수를 작성하여 vNode(가상 노드)를 정규화 형태로 변환하게 만들어, 일관된 형식의 가상 노드를 반환해 DOM조작, 렌더링 과정에서 일관된 데이터 구조를 사용할 수 있도록 해야한다.<br/>
  ⸰ 이런 정규화 과정을 통해 모든 children을 하나의 평평한 배열로 만들고, 필요없는 값을 제거하면 이후의 diff알고리즘은 단일한 규칙만 따르면 되어서 훨씬 단순하고 빠르게 작동한다.<br/>
  ⸰ 정규화과정은 렌더링 과정을 효율적으로 만들고, 이후의 diff,patch 과정을 단순화한다.<br/>

<br/>

---

### 🙌 문제 **(과제, 프로젝트를 진행하면서 부딪혔던 기술적인 문제)**

1. `normalizeVNode개발 시, 가상돔의 구조를 잘 파악하지 못해 발생한 이슈가 있었다.`<br/>

- vNode.type이 태그명뿐만 아니라 함수형 컴포넌트도 들어올 수 있었다.<br/>
- vNode.type이 함수형 컴포넌트일 경우 props안에 children을 명시적으로 넣어줘야 했다. 계속 children을 넣지 않아서 문제가 발생했었다;
  - 일반 태그 (예: 'div')의 경우, children은 구조상 이미 vNode.children으로 처리하니까 문제가 없다. 그러나 함수형 컴포넌트는 props를 통해 자식 노드를 전달받는다. 그래서 props안에 children을 명시적으로 넣어줘야했다.

   ```js
   const vNodeResult = vNode.type({
      ...vNode.props,
      children: normalizeChildren(vNode.children),
    });
   ```

3. `eventManager 구현에 많은 어려움이 있었다.` <br/>

- addEvent,removeEvent를 통해 element에 대한 이벤트를 저장하거나 삭제하는 함수를 구현해야했고, setupEventListener함수에서 이 이벤트 함수를 가져와서 한번에 root에 이벤트를 등록할 수 있게 이벤트 위임방식으로 개발해야했다.<br/>
- 이벤트 위임하는 방법을 몰라서 이 부분을 너무 복잡하게 생각해서 많은 시간을 소요해야 했다. 이벤트 위임을 단일 루트에서 할 수 있게 구현한다고 생각하면 쉽게 생각할 수 있었던 부분이었는데 말이다-!<br/>
- 마지막에 테스트 통과 한 개가 계속 안되서 문제의 원인을 찾는데 많은 시간을 소요했다. eventManger쪽 자체에 문제가 있다고 생각했는데..문제는 속성을 업데이트하는 함수부분에 있었다.<br/>
   -> eventManager안에 있는 addEvent함수, removeEvent함수를 updateAttributes함수에서도 적용해줘야하는 부분을 빼먹었던 것이었다...이벤트 위임방식이 익숙하지 않아 생겼던 이슈였다. 이슈를 해결해나가며 이 부분에 대해 더 이해도를 높일 수 있었다.

  - 코드 일부분을 보면 속성을 업데이트하는 함수에서 이벤트를 추가하고 삭제할 때, eventManager쪽에서 정의한 addEvent,removeEvent를 가져와서 해야하는 것을 전혀 생각 못하고 있었다..ㅠ
  - 이벤트 위임은 이벤트가 버블링 되는 걸 이용해 어떤 요소에서 발생한 이벤트인지 판단하는 방식인데, 이게 아직 익숙하지 못해서 어려웠었다.

   ```js
   export function updateAttributes(target, originNewProps, originOldProps) {
    
           if (oldPropsValue && typeof oldPropsValue === "function") {
          removeEvent(target, eventType, oldPropsValue);
        }

        addEvent(target, eventType, value);

   ```

   <br/>

---

### **Keep : 현재 만족하고 계속 유지할 부분**

포기하고 싶었던 순간도 있었지만, 포기하지 않고 끝까지 마무리 해낸 것!

### **Problem : 개선이 필요하다고 생각하는 문제점**

시간 관리를 잘 못하고 있는 것 같다. 너무 삽질을 하는데 많은 시간을 쓰는 것 같아서 시간 관리가 필수다!!

### **Try : 문제점을 해결하기 위해 시도해야 할 것**

너무 안되는 이슈에 많은 시간을 투자하지 말고, 잠깐 쉬었다가 문제를 다시 재정리해보고 접근해보자. 시간이 금이다 ㅠㅠ!
