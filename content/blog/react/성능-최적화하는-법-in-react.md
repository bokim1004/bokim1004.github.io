---
title: 리액트 성능 최적화하는 법
date: 2023-04-22 14:04:43
category: react
thumbnail: { thumbnailSrc }
draft: false
---

리액트에서 성능 최적화를 위한 방법들에 대해서 알아보았습니다.<br/>
리액트로 개발을 하면서 성능 최적화를 해야한다는 말을 많이 들어봤는데요.
성능 최적화를 위한 방법들에 대해서 찾아보다가 Youtube에서 좋은 영상을 발견해 정리해보았습니다~

### 1. Lazy loading

```text
Lazy loading is a strategy to identify resources as non-blocking (non-critical) and load these only when needed.
It's a way to shorten the length of the critical rendering path, which translates into reduced page load times.
```

MDN Web Doc를 보면 Lazy loading에 대해 위와 같이 설명하고 있습니다.
`lazy loading`은 필요할 때만 구성요소들을 로드하는 것이라고 하는데요.
기본적으로 lazy loading은 앱의 렌더링 시간을 최적화하고 가속화하는데 유용한 기술입니다.

사용하는 방법은 아래와 같습니다.

```js
const LazyComponent = React.lazy(() => import('./LazyComponent'))
```

lazy loading은 일반적으로 `Suspense` 구성요소 내에서 렌더링되므로 컴포넌트가 로드되기를 기다리는 동안 대체콘텐츠를 먼저 나오게 추가할 수 있습니다.

```js
const LazyComponent = React.lazy(() => import('./LazyComponent'))

function Component() {
  return (
    <Suspense fallback={<Spinner />}>
      <LazyComponent />
    </Suspense>
  )
}
```

### 2. Dependency 최적화

소프트웨어 개발 시 자주 간과되는 한 가지 측면은 바로 사용할 수 있는 코드를 위해
개발자가 오픈소스 라이브러리나 패키지에 얼마나 의존하는지입니다.
예를들어 lodash 라이브러리가 있다. 라이브러리에서 100개 이상의 메서드 중 3개만 필요한 상황을 가정해보면 최종 번들에 모든 추가 메서드를 포함하는 것은 최적이 아닐 것입니다.
애플리케이션 번들 크기를 최적화할 때, 실제로 활용되고 있는 코드의 양을 확인하는 것이 좋습니다. 더이상 사용되지 않는 depency는 제거합시다.

### 3. 불필요한 구성요소 렌더링 피하기

구성요소가 다시 렌더링되면 React는 기본적으로 하위 구성요소도 다시 렌더링을 합니다. 이렇게 되면 앱 속도가 느려지고, 이에 따라 느리고 반응없는 웹페이지의 영향으로 사용자에게도 불편함을 제공합니다.
React.Memo를 통해 구성요소가 변경될 때만 다시 렌더링되게 할 수 있습니다.

```js
const ListItem =React.memo(({item})=> <li>{item.name}<li>)
```

### 4. production build사용하기

리액트를 개발하다보면 기본적으로 개발 시 매우 유용한 많은 경고들이 포함되어있습니다.
그러나 이들은 React를 더 크고 느리게 만드므로 앱을 배포할 때는 반드시 프로덕션 버전을 사용해야 합니다.

### 5. 글로벌 저장소를 사용하기보다 useState 사용하기

글로벌 저장소를 사용하는 것보다 컴포넌트 내에서 useState를 사용하는 것이 훨씬 더 빠르다고 합니다.

### 6. CDN사용하기

> CDN ? CDN(Content Delivery Network)은 지리적 제약없이 전 세계 사용자에게 빠르고 안전하게 콘텐츠를 전송할 수 있는 콘텐츠 전송 기술을 의미한다.

CDN을 사용하는 것은 정적인 컨텐츠를 더 빠르게 전달할 수 있는 방법입니다.
CDN을 사용하면 로드되는 시간이 개선되고 컨텐츠의 글로벌 가용성이 높아집니다.

### 참고

- https://www.youtube.com/watch?v=rBhKb9JE8z0&t=83s
