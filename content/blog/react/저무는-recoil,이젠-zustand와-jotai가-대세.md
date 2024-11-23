---
title: 저무는 recoil,이젠 zustand와 jotai가 대세
date: 2024-11-23 14:11:57
category: react
thumbnail: { thumbnailSrc }
image: 'https://velog.velcdn.com/images/chloeee/post/63de255c-a9f6-46fe-b026-d7b4c624d983/image.png'
draft: false
---

이번엔 리액트에서 많이 사용되는 상태관리 도구 recoil, zustand,jotai에 대해 공부해봤다.
요즘은 recoil보다는 zustand, jotai를 많이 쓴다는 소식을 들었는데 왜 그런것인지 궁금했다.


## React 상태관리 도구의 트렌드를 살펴보자

<p align="center">
<img src="https://velog.velcdn.com/images/chloeee/post/ce56b84f-0c1f-4a61-b956-15403577023b/image.png" width="500px" >
</p>

React에는 여러 상태관리도구가 있는데, 현재 회사에서는 recoil로 상태관리를 하고 있다. 
그러나 최근 1년 안에 npm trend를 보면 jotai,zustand가 recoil을 앞선 것을 볼 수 있다.

## 현재 회사 솔루션에 사용된 상태 관리도구 히스토리


2022년 3월 지금 회사에 입사를 했는데, 기존에는 상태관리를 할 때 redux가 사용되고 있었다.
redux는 매우 복잡하고 이것을 사용하면 코드 양이 많아지고 관리가 어려워지는 등의 단점이 있어서 redux 사용을 지양하자는 의견이 그 때 당시 개발팀 내부에서 있었다.

2022년 하반기에 솔루션 공통화를 진행하며, recoil이 도입되게 되었다.<br/>
왜 recoil이었을까? recoil은 리액트의 상태관리 라이브러리로 그만큼  상대적으로 러닝커브도 낮고 state를 관리하는 방법이 매우 간단한 편이기에 사용하자는 대다수의 의견때문이었다.

그런데 2024년이 된 지금… 위에서 볼수 있듯이 상태관리 도구의 트렌드는 많이 바뀌었다.

## 왜 이렇게 Recoil의 인기가 떨어지게 된걸까?

### **첫 번째 이유: 업데이트 주기가 상대적으로 느리다.**

[깃헙](https://github.com/facebookexperimental/Recoil/tags)에서 볼 수 있다시피,
2023년 3월 3일이 마지막 업데이트였다..!
2024년에는 한번도 없었음..🙃
<p align="center">
<img src="https://velog.velcdn.com/images/chloeee/post/0abba91c-2245-4790-b723-e63049e1838a/image.png" width="400px" >
</p>

심지어 누군가 아래와 같은 질문을 8월에 남겼다. 여전히 유지보수되고 있는 라이브러리가 맞냐고..? <br/>
댓글을 읽어보니,,, 확실히 인기가 떨어진게 느껴졌다.
<p align="center">
<img src="https://velog.velcdn.com/images/chloeee/post/7659a33c-3e7a-4c08-a322-ca2e71989c7c/image.png" width="400px" >
</p>


### **두 번째 이유: memory leak 이슈가 있다.**

memory leak이슈가 있다는 글은 [깃헙 이슈](https://github.com/facebookexperimental/Recoil/issues?q=is%3Aissue+is%3Aopen+memory+)에도 찾아볼 수 있고, 다양한 개발자들의 블로그에서도 찾을 수 있었다.<br/>
[예시 블로그 1) ](https://medium.com/@altoo/recoil%EC%9D%98-%EB%A9%94%EB%AA%A8%EB%A6%AC-%EB%88%84%EC%88%98-%EB%AC%B8%EC%A0%9C-fb709973acf2 ),
[예시 블로그 2)](https://raejoonee.tistory.com/29)

현업에서 recoil을 사용했을 때는, memory leak 이슈를 크게 느끼지 못했었다.<br/>
atom에서 파생되는 selector, atomFamily, selectorFamily에 캐시 정책을 기본값인 keep-all을 사용하게 되면 이전 상태들이 메모리상에서 해제되지 않고 유지된다. <br/>
그래서 Recoil 공식 문서에서는 아래와 같이 메모리 문제를 해결하는 방법을 제시해주었다.
<p align="center">
<img src="https://velog.velcdn.com/images/chloeee/post/d24bceb2-9640-400e-acef-2245233edc06/image.png
" width="500px" >
</p>

위의 예에서 clockState는 매초 재계산되며, 새로운 의존성 값 세트를 내부 캐시에 추가한다. 
이로 인해 시간이 지나면서 내부 캐시가 무한히 커질 수 있어 메모리 문제가 발생할 수 있다. 
하지만 `가장 최근 사용된 값 제거 정책(most-recent eviction policy)`을 사용하면, 내부 selector 캐시는 가장 최근의 의존성 값 세트와 해당 값에 기반한 실제 selector 값만 유지하게 된다. 
이를 통해 메모리 문제를 해결할 수 있다는 것이다.

어떤 memory leak 이슈가 recoil에서 발생할 수 있는지 깃헙이슈에 올라온 글을 찾아보다가, SSR을 사용하면서 atomFamily와 selectorFamily를 사용할 때 메모리 누수가 발생하는 문제가 있었다고 한다. <br/>
참고: https://github.com/facebookexperimental/Recoil/issues/1864
문제를 발견한 개발자는 다른 방법을 이용해 memory leak문제를 해결했다는 글을 남겼다..!

나는 현재 현업에서 SSR을 사용하지 않고 atomFamily와 selectorFamily또한 사용하지 않고 있기에 이에 대한 내용은 더 파보지 않았다.

### **세 번째 이유 : Recoil 메인 개발자가 퇴사했다고 한다.**

 Meta에서 팀 리더로 Recoil을 개발했했던 Douglas Armstrong이 작년 1월 정리 해고로 퇴사를 하게 되었다고 한다.
Recoil 초기설계부터 개발까지 담당했던 개발자가 없어졌기에 Recoil이 더이상 업데이트가 안되고 인기가 사라진게 아닐까 추측해볼 수 있었다.
<p align="center">
<img src="https://velog.velcdn.com/images/chloeee/post/d88541ff-036f-4fd4-80f0-d093aa6768ff/image.png" width="500px" >
</p>

### **네 번째 이유: 더 직관적이고 가벼운 상태 관리도구들의 등장 (zustand,jotai)**

recoil과 비교했을 때 zustand와 jotai는 훨씬 더 오픈 소스 커뮤니티가 활발하고 꾸준한 업데이트를 하고 있음을 확인할 수 있었다.<br/>
[zustand](https://github.com/pmndrs/zustand/tags)를 보면 최근까지도 꾸준히 업데이트되고 있다.
<p align="center">
<img src="https://velog.velcdn.com/images/chloeee/post/b597faff-3c16-4bf2-82fb-fd9afc6e5893/image.png
" width="400px" >
</p>

[깃헙에 올라온 이슈](https://github.com/pmndrs/zustand/issues?q=is%3Aopen+is%3Aissue)들도 바로바로 해결되고 closed됨을 볼 수 있었다.

[jotai](https://github.com/pmndrs/jotai/tags)또한 현재까지 업데이트가 활발히 이루어지고 있었다.
<p align="center">
<img src="https://velog.velcdn.com/images/chloeee/post/e49e4af3-de08-4c7d-90ac-6e7184a9912f/image.png
" width="400px" >
</p>

[깃헙에 올라온 이슈](https://github.com/pmndrs/jotai/issues)들도 바로바로 해결되고 있음을 볼 수 있었다.



## 어떤 점이 Recoil보다 zustand,jotai가 더 좋은건지 비교해보자

각각의 상태 관리도구들은 어떤 특징을 가지고 있는지 보면서, zustand와 jotai는 recoil과 어떤 점이 다른지 비교해보았다.

### **1. Recoil**


Recoil은 Facebook이 만든 React를 위한 상태 관리 라이브러리로, atom(상태 단위)과 selector(파생 상태)를 이용해 상태를 관리한다. <br/>
동작원리를 간단하게 보면, atom으로 상태를 정의하고 컴포넌트는 atom을 구독한다. <br/>
상태를 업데이트하면 `해당 atom을 구독하는 컴포넌트만 리렌더링`된다. 
쉽게 말해, recoil은 데이터를 쪼개서 관리하고 필요한 컴포넌트만 구독하게 만들어서 효율적으로 업데이트를 한다.
- 사용 예시
```js
const sizeTendencyState = atom<SizeTendencyType | null>({
  key: 'sizeTendencyState',
  default: null,
});

const [sizeTendency, setSizeTendency] = useRecoilState<SizeTendencyType | null>(sizeTendencyState);

```

### **2. Zustand**

Zustand는 하나의 스토어를 중앙 집중형으로 활용해 이 스토어 내부에서 상태를 관리한다.
redux의 대안으로 주목받은 라이브러리로 React에 종속되지 않고 범용적으로 사용가능하다.<br/>
동작원리를 간단하게 보면, store(저장소)를 만들고 상태와 상태 변경 로직을 정의한다. 컴포넌트는 store에서 필요한 상태만 가져오고 구독한다.
상태가 바뀌면 구독 중인 컴포넌트만 리렌더링한다. 쉽게 말해, zustand는 저장소(store)를 만들어 필요한 상태만 가져다 쓰는 방식으로 매우 빠르고 가볍다.
- recoil코드를 zustand로 변경 시

```js
import { create } from 'zustand'

const useSizeTendencyStore = create<{
  sizeTendency: SizeTendencyType | null;
  setSizeTendency: (sizeTendency: SizeTendencyType | null) => void;
}>((set) => ({
  sizeTendency: null, // 초기값
  setSizeTendency: (sizeTendency) => set({ sizeTendency }), // 상태 업데이트 함수
}));

const { sizeTendency, setSizeTendency } = useSizeTendencyStore();

```

`recoil과 다른 점`
- zustand의 경우, atom이 아니라 create를 사용해 하나의 스토어를 만들어서 상태를 관리한다는 점이 가장 다르다.
- 그리고 이 스토어를 컴포넌트 내부에서 사용할 수 있게 훅으로 받아서 사용하는데, recoil에서 useRecoilState를 사용해 데이터를 가져오는 방식과 다르다. 
- Recoil처럼 App최상단에서 provider로 애플리케이션을 감싸지 않아도 된다.

zustand는 매우 간단하고 직관적이어서 학습곡선이 매우 낮은 라이브러리임을 볼 수 있었다. 그리고 라이브러리 크기도 가장 작다고 한다.
 Recoil 79.1kB이고 Jotai 13.1kB인데 Zustand 2.9kB 크기밖에 안한다고 한다..! 성능에 그만큼 긍정적인 영향을 미칠 수 있을 것으로 보인다.

### **3. jotai**

jotai는 bottom-up 접근법으로 작은 단위의 상태를 위로 전파하는 구조를 가지고 있다.
Recoil과 비슷하게 최소 단위 상태인 atom을 이용한다. Recoil과 다른 점은 atom하나만으로 상태를 만들 수도 있고 파생된 상태를 만들 수도 있다는 것이다.
- recoil코드를 jotai로 변경 시
```js
import { atom, useAtom } from 'jotai';
const sizeTendencyState = atom<SizeTendencyType | null>(null);

const [sizeTendency, setSizeTendency] = useAtom(sizeTendencyState);
```
`recoil과 다른 점` 
- 코드를 보면 recoil과 매우 비슷해보이지만 atom을 생성할 때 별도의 key를 넘겨주지 않는다.
- 그리고 recoil에서는 파생된 값을 만들기 위해서는 selector가 필요했지만, jotai에서는 selector없이 atom만으로도 가능하다.

jotai를 보면 더 가볍고 작은 프로젝트에 적합하다고 느꼈다. 더 복잡한 상태관리는 recoil, zustand가 더 좋을 것 같기도 하다.
recoil과 비교해봤을 대 zustand,jotai가 좀 더 사용이 직관적이고 간단하다고 느꼈다.  <br/>


## 기회가 되면 zustand, jotai로 마이그레이션을 진행해보자

recoil에서는 다양한 기능을 제공하지만, 현재 진행하는 프로젝트에서는 이 다양한 기능을 많이 사용할 일이 생각보다 없었다.(내가 다 몰라서 그런 걸수도 있지만..) 
파생값을 만드는 selector를 사용할 일도 많이 없고 atomfamily같은 기능을 사용할 일도 없었다.
오히려 잘못된 방식으로 사용되는 부분도 있었다. selector가 필요없고 atom만 사용하면 되는데, selector가 무분별하게 사용된 부분도 있었다.. <br/>
그리고 무엇보다 업데이트가 거의 없고 점점 저물어가는 recoil을 계속 쓰는게 맞는건지 의문이 든다.
시간이 허락해준다면, 좀 더 사용이 쉽고 가벼운 zustand나 jotai로 마이그레이션을 해보는 것도 좋을 것 같다. 커뮤니티가 활발하고, 업데이트가 주기적으로 된다는 점에서 더 좋은 대안일 것 같다.



### 참고
- https://medium.com/@clockclcok/recoil-%EC%9D%B4%EC%A0%9C%EB%8A%94-%EB%96%A0%EB%82%98-%EB%B3%B4%EB%82%BC-%EC%8B%9C%EA%B0%84%EC%9D%B4%EB%8B%A4-ff2c8674cdd5
- https://raejoonee.tistory.com/29
- https://recoiljs.org/docs/api-reference/core/selector/
- https://medium.com/@ian-white/recoil-vs-jotai-vs-zustand-09d3c8bd5bc0
