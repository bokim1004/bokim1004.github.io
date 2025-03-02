---
title: SSR은 어떻게 동작하는가
date: 2025-03-02 12:03:15
category: etc
thumbnail: { thumbnailSrc }
draft: false
image: "https://velog.velcdn.com/images/chloeee/post/0d8cdcec-8e69-4e8f-ae87-02dd6f5a0d3d/image.png"
---

### 들어가며

실무에서는 SSR(Server-Side Rendering)을 사용할 일이 많지 않아 아쉬웠는데, 이번 기회에 SSR의 원리와 동작 방식에 대해 정리해보았다.
특히, Next.js와 같은 프레임워크를 사용할 때 SSR을 제대로 활용하려면 먼저 SSR의 본질적인 개념과 동작 원리를 이해하는 것이 중요하다고 생각했다.<br/>
SSR의 핵심은 서버에서 HTML을 생성하여 클라이언트에 전달하는 방식이다. 이를 통해 초기 로딩 속도를 개선하고 SEO(검색 엔진 최적화)에 유리한 웹 애플리케이션을 구축할 수 있다. <br/>그렇다면 SSR이 어떻게 동작하는지, 어떤 장점과 단점이 있는지 살펴보자.

## SSR의 핵심 동작 방식

SSR을 사용하면 브라우저가 화면을 보기까지 다음과 같은 과정을 거친다.

<p align="center">
<img src="https://velog.velcdn.com/images/chloeee/post/28fe6aa8-9090-4275-94e8-c45527fc1ebb/image.png" width="500px"></img>
</p>

### 1️⃣ 브라우저가 서버에 요청을 보낸다

사용자가 웹사이트에 접속하면 브라우저는 서버에 HTML을 요청한다. CSR(Client-Side Rendering)에서는 브라우저가 빈 HTML과 JavaScript 번들을 받아와서 렌더링하는 반면, SSR에서는 서버가 미리 HTML을 구성하여 반환한다.

### 2️⃣ 서버에서 HTML을 생성한다

서버는 요청을 받으면 React 코드를 실행하여 HTML을 생성하고, 데이터를 미리 가져와서 페이지를 구성한다.
이 과정에서 중요한 점은 서버에서 React를 실행하는 방식이다.

```js
import { renderToString } from "react-dom/server";
import App from "./App";

const html = renderToString(<App />);
```

React의 `renderToString() 메서드`는 컴포넌트를 HTML 문자열로 변환해준다.
Next.js에서는 getServerSideProps를 활용하여 데이터를 서버에서 미리 불러온 후, 해당 데이터를 포함한 HTML을 렌더링할 수 있다.

 ```js
 export async function getServerSideProps() {
  const res = await fetch("https://api.example.com/data");
  const data = await res.json();

  return {
    props: { data },
  };
}

const Page = ({ data }) => {
  return <div>{data.message}</div>;
};

export default Page;

 ```

 위 코드에서는 getServerSideProps가 실행된 후, 데이터를 서버에서 가져와 페이지에 전달하고, 최종 HTML을 렌더링하여 브라우저로 전송한다.

### 3️⃣ 브라우저가 HTML을 받아서 화면을 그린다

브라우저는 서버에서 전달받은 HTML을 해석해서 즉시 화면을 렌더링한다.<br/>
이 단계에서 사용자는 이미 웹사이트의 모습을 볼 수 있다.

## Hydration: 정적인 HTML을 React 앱으로 변환

SSR을 통해 서버에서 HTML을 받아 렌더링했지만, 이 상태에서는 React의 상태 관리나 이벤트 핸들러가 동작하지 않는다.
이를 해결하기 위해 클라이언트에서 `Hydration`과정이 필요하다.

🔹**Hydration 과정**🔹

Hydration이란 서버에서 렌더링된 HTML을 React와 연결하여 동적인 인터랙션이 가능하도록 만드는 과정이다.<br/>

1. 브라우저가 HTML을 렌더링한 후, React 관련 JavaScript 파일을 다운로드한다.
2. React는 `ReactDOM.hydrate()`를 사용하여 기존 HTML을 탐색하고, 컴포넌트와 연결한다.
3. React의 상태 관리 및 이벤트 핸들러가 활성화되면서 정적 HTML이 동적인 React 앱으로 변환된다.

```js
import { hydrateRoot } from "react-dom/client";
import App from "./App";

hydrateRoot(document.getElementById("root"), <App />);
```

Hydration 과정을 통해 정적인 HTML이 단일 페이지 애플리케이션(SPA)으로 변환된다. 즉, DOM 구조가 재사용되고, 이벤트 핸들러가 DOM 요소에 연결되며, 애플리케이션 상태가 클라이언트에서 복원된다. 이를 통해 웹 애플리케이션은 SPA처럼 동작할 수 있는 것이다.

🔹**Hydration 과정에서 발생하는 주요 작업**🔹

1️⃣ **DOM 구조 재사용**

React는 기존 DOM을 지우고 새로 생성하는 것이 아니라, 이미 렌더링된 HTML을 탐색하여 가상 DOM(Virtual DOM)과 동기화한다.

2️⃣ **이벤트 핸들러 연결**

서버에서 전달된 HTML은 초기에는 단순한 정적 HTML일 뿐이므로, JavaScript가 실행되지 않으면 동작하지 않는다.
Hydration이 진행되면서 React가 기존 HTML 요소들에 이벤트 핸들러를 연결하여 동적인 UI가 가능해진다.

3️⃣ **애플리케이션 상태 복원**

서버에서 렌더링된 HTML이 브라우저에 표시된 후, 클라이언트에서 React가 실행되면서 상태 관리 로직이 활성화된다.
예를 들어, Redux, Recoil, Zustand 같은 상태 관리 라이브러리가 초기 상태를 복원하면, 마치 클라이언트에서 처음부터 렌더링된 것처럼 동작하게 된다.

## SSR의 장점과 단점에 대해 알아보자

### ✅ SSR의 장점

**1️⃣ 빠른 초기 로딩 속도**<br/>
서버에서 HTML을 완성된 상태로 생성하여 클라이언트에 전달하기 때문에, 브라우저는 JavaScript가 실행되기 전에도 즉시 콘텐츠를 표시할 수 있다는 장점이 있다.<br/>
반면 CSR(Client-side Rendering) 방식은 JavaScript 번들이 다운로드되고 실행될 때까지 화면이 비어 있다.

**2️⃣  SEO(검색 엔진 최적화) 유리**<br/>
검색 엔진 크롤러(구글, 네이버 등)는 HTML을 읽어서 페이지 내용을 분석한다.<br/>
CSR은 JavaScript가 실행되기 전까지 빈 HTML을 전달하지만, SSR은 완전한 HTML을 제공하기 때문에 검색 엔진이 페이지를 제대로 읽을 수 있다.

**3️⃣  느린 네트워크 환경에서도 유리**<br/>

CSR 방식은 클라이언트에서 JavaScript 파일을 다운로드하고 실행해야 하는 반면, SSR 방식은 기본적인 HTML을 즉시 표시 가능하다.
네트워크 속도가 느릴 때 CSR 방식은 JavaScript 번들이 로드될 때까지 사용자가 아무것도 볼 수 없다.

### ❌ SSR의 단점

**1️⃣ 서버 부하 증가**<br/>
모든 요청마다 서버에서 HTML을 생성해야 하기 때문에, 트래픽이 많을 경우 서버 부하가 증가할 수 있다.
캐싱(Cache)을 활용하지 않으면, 매 요청마다 동일한 HTML을 생성해야 하므로 비효율적이다.

**2️⃣ 초기 JavaScript 실행 지연**<br/>
Hydration 과정이 필요하므로, JavaScript 실행이 완료되기 전까지는 완전한 React 기능을 사용할 수 없다.

## SSR 최적화: 실무에서 고려해야 할 점

실무에서 SSR을 도입할 때는 몇 가지 최적화 기법을 고려해야 한다.

1️⃣ **캐싱(Cache) 활용**
서버에서 매번 HTML을 생성하면 부하가 크기 때문에, CDN과 캐싱을 적극 활용하는 것이 중요하다. 예를 들어, getServerSideProps 대신 getStaticProps를 사용하면 정적 HTML을 생성할 수 있어 서버 부담을 줄일 수 있다.

2️⃣ **로딩 전략 최적화**
SSR을 사용할 때 클라이언트에서 불필요한 JavaScript가 실행되지 않도록 코드 분할(Code Splitting)을 활용하는 것이 중요하다.

```js
import dynamic from "next/dynamic";
const HeavyComponent = dynamic(() => import("../components/HeavyComponent"), {
  ssr: false,
});
```

위 코드처럼 dynamic을 사용하면 SSR을 비활성화하고 클라이언트에서만 특정 컴포넌트를 로드할 수 있다.

## 마치며

SSR을 학습하면서 서버와 브라우저의 역할을 정확히 이해하는 것이 렌더링 성능을 최적화하는 데 얼마나 중요한지 다시금 깨달았다.
SEO가 중요한 프로젝트라면 SSR이 적합하지만, 서버 부하를 고려해야 하며, CSR과 SSR을 적절히 혼합하는 전략이 필요하다.<br/>
프론트엔드 개발자로서 렌더링 방식에 대한 깊은 이해는 필수적이며, 앞으로도 SSR을 더욱 최적화하여 활용할 수 있는 방법을 고민해야겠다.

## 참고

- <https://www.workingsoftware.dev/understanding-ssr-with-hydration-for-software-architects/>
- <https://de-velop-humus.tistory.com/30>
- <https://yozm.wishket.com/magazine/detail/2330/>
