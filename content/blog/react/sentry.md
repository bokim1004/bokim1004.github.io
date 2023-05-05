    ---
title: SENTRY로 프론트 에러 잡아내기
date: 2023-04-09 12:04:83
category: react
thumbnail: { thumbnailSrc }
image: 'https://velog.velcdn.com/images/chloeee/post/799f969c-5144-4301-a2db-fa842d3b445f/image.png'
draft: false
---

<p align="center">
<img src="https://velog.velcdn.com/images/chloeee/post/799f969c-5144-4301-a2db-fa842d3b445f/image.png" width="500px" alt="image" />
</p>

프론트에서도 오류를 모니터링하는 방법이 뭐가 있을까요?<br/>
프론트에서 발생하는 오류들을 모니터링하기 위해 저희 개발팀에서는 `sentry`를 도입해보자는 의견이 나왔습니다.

### Sentry?

<a href="https://sentry.io/welcome/?utm_source=google&utm_medium=cpc&utm_campaign=9657410528&utm_content=g&utm_term=sentry&device=c&gclid=Cj0KCQjwocShBhCOARIsAFVYq0hxiVSj9Jvc8_HkRAYqnILqrAgBZvPG4x8eN7W7TQn30DJGiX3hZV8aAiaBEALw_wcB&gclid=Cj0KCQjwocShBhCOARIsAFVYq0hxiVSj9Jvc8_HkRAYqnILqrAgBZvPG4x8eN7W7TQn30DJGiX3hZV8aAiaBEALw_wcB" target="_blank">Sentry</a>는 오류를 모니터링할 수 있게 해주는 모니터링 툴입니다.<br/>
백엔드, 프론트엔드에서 발생하는 에러트래킹, 퍼포먼스 성능에 대한 모니터링까지 가능하게 해줍니다.

<p align="center">
<img src="https://velog.velcdn.com/images/chloeee/post/afb749bd-0795-4b0a-a711-33e344f378a0/image.png" width="500px" alt="image" />
</p>
Sentry를 적용하기 위해서는 우선 회원 가입을 해야합니다.
참고로 Sentry는 유료입니다!<br/> 저는 우선 테스트를 해보기 위해 무료버전인 Developer 버전으로 시작해보았습니다.

<p align="center">
<img src="https://velog.velcdn.com/images/chloeee/post/b612d041-e1f9-42d8-a9b9-f8f907f248b2/image.png
" width="500px" alt="image" />
</p>

현재 Sentry에는 다양한 언어, 프레임워크에 대한 지원을 하고 있습니다.
저는 React기준으로 sentry를 설정해주기 위해 react관련 문서 (<a href="https://docs.sentry.io/platforms/javascript/guides/react" target="_blank">참고</a>)를 보았습니다.

### install

Sentry를 사용하기 위해 패키지를 설치합니다.

```text
# Using npm
npm install --save @sentry/react

# Using yarn
yarn add @sentry/react
```

### Configure

Application 최상단 부분인 `index.tsx`에 넣어주었습니다.

```js
import { createRoot } from "react-dom/client";
import React from "react";
import * as Sentry from "@sentry/react";
import App from "./App";

Sentry.init({
  dsn: "https://examplePublicKey@o0.ingest.sentry.io/0",
  integrations: [new Sentry.BrowserTracing()],
  tracesSampleRate: 1.0,
});


const container = document.getElementById(“app”);
const root = createRoot(container);
root.render(<App />);
```

dsn은 식별키로 가입하고 들어간 sentry페이지에서 Setting → Client Keys(DSN)로 들어가면 확인하실 수 있습니다.

### React Error Boundary

React 컴포넌트 트리 안에서 자동적으로 에러를 잡아 sentry로 보낼 수 있게 해주는
error Boundary 컴포넌트를 제공합니다.

```js
import React from 'react'
import * as Sentry from '@sentry/react'
;<Sentry.ErrorBoundary fallback={<p>An error has occurred</p>}>
  <Example />
</Sentry.ErrorBoundary>
```

### Capturing Errors

sentry는 `Sentry.captureException` 또는 `Sentry.captureMessage`를 사용해 에러를 캡쳐하고 전송할 수 있게 해줍니다.

```js
import * as Sentry from '@sentry/react'
// capturing

try {
  aFunctionThatMightFail()
} catch (err) {
  Sentry.captureException(err)
}
```

captureException, captureMessage는 side effects이기에,
매 렌더마다 발생하는 것을 피하기 위해 useEffect안에서 사용해야 합니다.

```js
import * as Sentry from '@sentry/react'
import { useEffect } from 'react'

function App() {
  const [info, error] = useQuery('/api/info')
  useEffect(() => {
    if (error) {
      Sentry.captureException(error)
    }
  }, [error])

  // ...
}
```

Sentry에 텍스트 메시지를 전송해야할 경우 captureMessage를 사용할 수 있습니다.

```js
Sentry.captureMessage('Something went wrong')
```

로컬에서 에러를 테스트 해보니 Sentry페이지 Issues에 어떤 에러가 났는지 쌓이고 있음을 확인할 수 있었습니다.

<p align="center">
<img src="https://velog.velcdn.com/images/chloeee/post/2e8a3a25-771d-4a6a-b3b1-46c11e307bde/image.png
" width="500px" alt="image" />
</p>

### Slack과 연동하기

<p align="center">
<img src="https://velog.velcdn.com/images/chloeee/post/9a1ba3b6-917f-4256-ba1f-49e748926f47/image.png
" width="500px" alt="image" />
</p>

sentry페이지에서 Settings > Integrations와 들어가면 슬랙과 연동할 수 있습니다.

<p align="center">
<img src="https://velog.velcdn.com/images/chloeee/post/ed768496-ed5f-4f3d-afdd-70ce2e061c13/image.png
" width="500px" alt="image" />
</p>

Alert에 등록할 프로젝트를 선택하고 상황별로 WHEN, IF값을 넣어주고 THEN에서 `send a slack notification` 선택 후 슬랙메시지를 전송할 채널명을 입력할 수 있습니다.

제대로 연동이 됐으면 아래와 같이 에러 발생시 슬랙 알람이 오게 됩니다.

<p align="center">
<img src="https://velog.velcdn.com/images/chloeee/post/f415286e-adc2-4df8-a056-e8d8302ff856/image.png
" width="500px" alt="image" />
</p>

### 마치며

아직 테스트로 Sentry를 사용해보았는데, 실제로 제대로 적용하면 프론트에서 발생하는 에러 모니터링에 매우 좋을 것 같다는 생각을 했습니다.
이전에 발생한 에러들도 쉽게 모니터링할 수 있고, 그래프로 시각화되어 있어 어떤 에러가 몇번 발생하는지도 알 수 있어서 매우 유용할 것 같습니다.

### 참고

- https://tech.kakaopay.com/post/frontend-sentry-monitoring/ <br/>
- https://node-js.tistory.com/33<br/>
- https://velog.io/@singsoong/Sentry-%EC%84%A4%EC%A0%95-%