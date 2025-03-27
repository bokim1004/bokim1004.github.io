---
title: Vanilla JS에서 브라우저 라우터와 Hash 라우터의 차이
date: 2025-03-25 18:03:44
category: javascript
thumbnail: { thumbnailSrc }
image: 'https://velog.velcdn.com/images/chloeee/post/01cbf681-55d4-4e05-8213-d77755bc899b/image.png'
draft: false
---

### 들어가며

오랜만에 Vanilla JS로 개발을 해볼 일이 생겼다.Vanilla JS로 SPA 구현하기를 진행하다보니 라우팅 구현을 2가지 방식으로 할 수 있다는 것을 알게 되었다.
History API를 이용한 브라우저 라우터와 Hash 라우터로 라우팅 구현을 하면서 좀 더 이 부분에 대해 깊이 있는 이해를 하면 좋겠다는 생각이 들었다.
둘의 차이는 무엇이고 동작원리는 어떤지 살펴본 후, 실제로 라우팅 시 겪었던 이슈를 정리해봤다.

### 🔍 1. Hash Router란?

**✨ 특징**

- URL의 #(해시)를 기준으로 라우팅한다.<br/>
  `예: <https://example.com/#/about>`

- `# 이후의 값`은 브라우저가 서버로 전송하지 않는다.

- 서버는 항상 같은 index.html을 응답하고, 클라이언트가 라우팅 처리한다.

**⚙️ 작동 방식**

- `window.addEventListener('hashchange', callback)`을 통해 URL 변경을 감지한다.
- URL의 location.hash 값을 읽어와 렌더링 로직을 수행한다.

**🌟 장점**

- 서버 설정이 필요 없어서 정적 호스팅에 적합하다.
- 아주 간단하게 구현 가능하다.

**❌ 단점**

- SEO에 불리하다. 구글이 해시 기반 라우팅을 완전히 크롤링하지 못하는 경우도 있다고 한다.
- 브라우저 기본 동작과 달라 사용자 경험이 떨어질 수 있다.

### 🔍  2. Browser Router (History Router)란?

**✨ 특징**

- Browser Router는 HTML5 History API를 기반으로 URL을 관리한다.
   `예: https://example.com/about`

- 실제로 페이지를 새로고침하지 않으면서도, 마치 페이지가 이동한 것처럼 보이게 한다.

**⚙️ 작동 방식**

Browser Router는 History API를 기반으로 작동하는데 크게 알아야할 개념은 아래 3가지다.<br/>
`1. history.pushState(state, title, url)`

- 브라우저의 히스토리 스택에 새로운 항목을 추가하면서,주소창(URL)을 바꿔주는 함수로 pushState를 하면 페이지는 새로고침되지 않는다.

```js
history.pushState({}, "", `/profile`);
```

위 코드는 브라우저 주소창을 profile로 바꾼다.<br/>
**주의해야할 점은 화면은 직접 다시 렌더링해야 한다는 것이다**
history.pushState는 그저 url만 바꿔준다.

`2. history.replaceState(state, title, url)`

- 현재 히스토리 항목을 교체한다. 즉, 지금 보고 있는 페이지의 URL을 바꾸는 것이다.
- 뒤로 가기를 눌러도 이전 URL로 돌아가지 않는다.

```js
    history.replaceState(null, "", `${BASE_PATH}/login`);

```

`3.popState 이벤트`

- 브라우저에서 뒤로 가기 / 앞으로 가기 했을 때 발생하는 이벤트이다.
- pushState, replaceState는 이 이벤트를 트리거하지 않는다.

```js
window.addEventListener("popstate", renderRoute);

```

**🌟 장점**

- URL이 깔끔하고, 사용자 경험이 더 자연스럽다.
- SEO 친화적이다.

**❌ 단점**

- 서버 설정 필요하다. 모든 경로 요청에 대해 index.html을 리턴하도록 설정해야 한다 → 그렇지 않으면 새로고침 시 404 에러가 발생한다.

> 난 package.json에서 build시 `cp dist/index.html dist/404.html` 이 부분을 추가해줬다. build시  404.html을 index.html처럼 동작하게한 것인데, index.html을 그대로 복사해서 404.html로 만들어두면 404처럼 보여도 실제로는 라우팅이 잘 작동하게 된다.

- 정적 호스팅(GitHub Pages 등)에서는 설정이 번거로울 수 있다.

### HASH 라우터와 브라우저 라우터 구현 시 이슈가 있었던 부분

나의 경우엔 배포 시 url에 BASE_PATH가 붙어야했다. 그래서 브라우저 라우터쪽에는 BASE_PATH를 아래와 같이 붙여줬다.

```js
const routes = {
  [${BASE_PATH}/]: MainPage,
  [${BASE_PATH}/login]: LoginPage,
  [${BASE_PATH}/profile]: ProfilePage,
}
```

그런데 문제는 hash router쪽 배포한 url로 들어가면 404페이지가 나오는 이슈가 있었다.
문제의 원인을 한참들여다 봤다,,<br/>
`vite.config.js`부분에 아래와 같이 build옵션을 설정해주고, base도 설정해줬다.

```js
 base: isProd ? "/front_5th_chapter1-1/" : "/",
 build: {
      rollupOptions: {
        input: {
          main: resolve(__dirname, "index.html"),
          hash: resolve(__dirname, "index.hash.html"),
        },
      },
    },
```

build하면 dist에 index.hash.html이 잘 나오는데도 원인을 찾지 못해 이것 저것 시도하다가 BASE_PATH가 중복된 것이 문제의 원인이었다 ㅠㅠ
BrowserRouter와 HashRouter는 URL을 해석하는 방식이 달라서 base_path 처리 방식도 다르게 가져가야한다는 것을 알게 되었다.

🔍 요약해보면,<br/>
BrowserRouter는 실제 경로(URL path)를 사용하기 때문에 base_path 설정이 필요했다.<br/>
난 GitHub Pages처럼 서브 디렉토리에 호스팅이 필요했기에 base 설정이 필수인 상황이었다.

HashRouter는 # 뒤에 붙는 해시로 경로를 관리하기 때문에, base_path를 넣을 필요가 없었다.오히려 넣으면 base_path가 중복되었다.
그래서 base_path를 넣지 않고 라우팅되게 해주었다~!

```js
const hashRoutes = {
  ["/"]: MainPage,
  ["/login"]: LoginPage,
  ["/profile"]: ProfilePage,
};

```

### 마치며

핵심적으로 hash router 동작에 대한 이해가 부족했던 것 같다.<br/>
`vite.config.js`에서 base를 추가한 건 이 웹사이트는 `/front_5th_chapter1-1/` 하위 폴더 안에 있으니 이걸 참고해 파일을 가져오라는 뜻이다.
그래서 빌드 시 나온 dist에 있는 html파일에서 `/front_5th_chapter1-1/assets/main.js`이런 파일을 가져오는 것이다.<br/>
그런데 이 부분은 라우팅(URL path)을 위한 건 아니기 때문에 브라우저 라우팅 시 base path(`/front_5th_chapter1-1/` )를 넣어야하는 것이었고,
HashRouter는 그냥 index.hash.html만 잘 열리면, JS가 알아서 해시 경로 보고 라우팅해주는 방식이기 때문에
라우팅 자체는 base path를 신경 안 써도 되는 구조인 것이다.<br/>
개념만 공부하는 것보다 역시 직접 개발해보며 겪어봐야 알게되는 것 같다 >_<

### 참고

- <https://developer.mozilla.org/en-US/docs/Web/API/History/pushState>
