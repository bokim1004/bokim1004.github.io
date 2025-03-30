---
title: Vanilla JS에서 브라우저 라우터와 Hash 라우터의 차이
date: 2025-03-25 18:03:44
category: javascript
thumbnail: { thumbnailSrc }
image: 'https://velog.velcdn.com/images/chloeee/post/01cbf681-55d4-4e05-8213-d77755bc899b/image.png'
draft: false
---

### 들어가며

오랜만에 Vanilla JS로 개발을 해볼 일이 생겼다.Vanilla JS로 SPA 구현하기를 진행하다보니 라우팅 구현을 두 가지 방식으로 구현할 수 있다는 것을 알게 되었다.
바로 History API를 이용한 `Browser 라우터`와 `Hash 라우터`이다. 이 두 방식의 차이와 동작 원리를 더 깊이 이해하고 싶어졌고, 실제로 라우팅 시 겪었던 이슈들도 함께 정리해봤다.

---

### 🔍 1. Hash Router란?

**✨ 특징**

- URL의 #(해시)를 기준으로 라우팅한다.<br/>
  `예: <https://example.com/#/about>`

- `# 이후의 값`은 브라우저가 서버로 전송하지 않는다.
- 서버는 항상 같은 index.html을 응답하고, 클라이언트가 라우팅 처리한다.<br/>
   ⸰ 브라우저 주소창에서 아무리 경로가 바뀌어도 서버는 오직 루트 경로`(/)`만 요청받는다.
   ⸰ 따라서, 서버에 따로 설정해줄 필요가 없다.

**⚙️ 작동 방식**

- `window.addEventListener('hashchange', callback)`을 통해 URL 변경을 감지한다.
- location.hash 값을 기반으로 화면을 렌더링한다.

**🌟 장점**

- 서버 설정이 필요 없어서 정적 호스팅에 적합하다.
- 아주 간단하게 구현 가능하다.

**❌ 단점**

- SEO에 불리하다.(구글이 해시 기반 라우팅을 완전히 크롤링하지 못하는 경우도 있다고 함)
- 브라우저 기본 동작과 달라 사용자 경험이 떨어질 수 있다.

---

### 🔍  2. Browser Router (History Router)란?

**✨ 특징**

- Browser Router는 HTML5 History API를 기반으로 URL을 관리한다.
   `예: https://example.com/about`
- URL 경로를 그대로 사용하기에, 서버가 해당 경로 요청을 처리할 수 있도록 설정이 필요하다.

- 실제로 페이지를 새로고침하지 않으면서도, 마치 페이지가 이동한 것처럼 보이게 한다.
<br/>

**⚙️ 작동 방식**

Browser Router는 다음 세 가지 History API를 기반으로 동작한다:<br/>
`1. history.pushState(state, title, url)`

- 브라우저 주소창의 URL을 바꾸면서도 새로고침 없이 페이지 전환이 가능하다.

```js
history.pushState({}, "", `/profile`);
```

위 코드는 브라우저 주소창을 profile로 바꾼다.<br/>
**주의해야할 점은 화면은 직접 다시 렌더링해야 한다는 것이다**
history.pushState는 그저 url만 바꿔준다.

`2. history.replaceState(state, title, url)`

- 현재 페이지의 URL을 대체한다. (뒤로 가기로 이전 URL로 돌아가지 않음)

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
- SEO에 유리하다.

**❌ 단점**

- 정적 호스팅(GitHub Pages 등)에서는 설정이 번거로울 수 있다.
- 서버 설정이 필요하다.
   ⸰ 모든 경로 요청에 대해 `index.html`을 리턴하도록 설정하지 않으면, 새로고침 시 404에러가 발생한다.

**📌 BrowserRouter는 왜 서버 설정이 필요할까?**<br/>

예를 들어 `https://example.com/profile` 이런 URL 경로가 있다고 하자. <br/>
브라우저는 서버에 `/profile`경로로 요청을 보낸다. 서버는 이 경로에 해당하는 파일을 찾는데, 이 경로에 맞는 파일이 없으면 404에러가 발생하는 것이다.<br/>

SPA구현 시 모든 페이지가 `index.html`하나로 구성되고 JS가 클라이언트에서 경로에 맞는 컴포넌트를 렌더링하는데 서버는 모든 경로 요청에 대해 `index.html`을 리턴하도록 설정해야 한다.<br/>
난 package.json에서 build시 `cp dist/index.html dist/404.html` 이 부분을 추가해줬다. build시  404.html을 index.html처럼 동작하게한 것인데, index.html을 그대로 복사해서 404.html로 만들어두면 404처럼 보여도 실제로는 라우팅이 잘 작동하게 된다.

---

### 🛠 라우터 구현 시 겪은 이슈

나의 경우엔 배포 시 url에 BASE_PATH가 붙어야했다. 그래서 Browser Router에서 다음처럼 설정했다.

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

빌드하면 dist에 `index.hash.html`파일은 잘 생성되었지만, Hash Router에서 base path가 URL에 중복된 것이 문제의 원인이었다.
BrowserRouter와 HashRouter는 URL을 해석하는 방식이 달라서 base_path 처리 방식도 다르게 가져가야한다는 것을 알게 되었다.<br/>
Hash Router에서는 BASE_PATH를 제거하고 아래와 같이 경로를 간단하게 설정했다.<br/>
BrowserRouter는 실제 경로(URL path)를 사용하기 때문에 base_path 설정이 필요했다.
난 GitHub Pages처럼 서브 디렉토리에 호스팅이 필요했기에 base 설정이 필수인 상황이었다.<br/>
그러나, HashRouter는 # 뒤에 붙는 해시로 경로를 관리하기 때문에, base_path를 넣을 필요가 없었다.<br/>
오히려 넣으면 base_path가 중복되었다.
그래서 base_path를 넣지 않고 라우팅되게 해주었다~!

```js
const hashRoutes = {
  ["/"]: MainPage,
  ["/login"]: LoginPage,
  ["/profile"]: ProfilePage,
};

```

---

### ✅ 요약

| 항목               | Hash Router                        | Browser Router                         |
|--------------------|------------------------------------|----------------------------------------|
| URL 형태           | example.com/#/about                | example.com/about                      |
| 서버 설정 필요 여부 | ❌ 필요 없음                         | ✅ 필요 (모든 요청을 index.html로 응답) |
| SEO                | ❌ 불리함                           | ✅ 유리함                               |
| 장점               | 구현이 쉽고 정적 호스팅에 적합        | URL이 자연스럽고 SEO에 좋음            |
| 단점               | SEO와 UX에 단점                     | 서버 설정이 번거로움                   |

<br/>

---

### 마치며

핵심적으로 hash router 동작에 대한 이해가 부족했던 것 같다.<br/>
`vite.config.js`에서 base를 추가한 건 이 웹사이트는 `/front_5th_chapter1-1/` 하위 폴더 안에 있으니 이걸 참고해 파일을 가져오라는 뜻이다.
그래서 빌드 시 나온 dist에 있는 html파일에서 `/front_5th_chapter1-1/assets/main.js`이런 파일을 가져오는 것이다.<br/>
그런데 이 부분은 라우팅(URL path)을 위한 건 아니기 때문에 브라우저 라우팅 시 base path(`/front_5th_chapter1-1/` )를 넣어야하는 것이었고,
HashRouter는 그냥 index.hash.html만 잘 열리면, JS가 알아서 해시 경로 보고 라우팅해주는 방식이기 때문에
라우팅 자체는 base path를 신경 안 써도 되는 구조인 것이다.<br/>
개념만 공부하는 것보다 역시 직접 개발해보며 겪어봐야 알게되는 것 같다~~

### 참고

- <https://developer.mozilla.org/en-US/docs/Web/API/History/pushState>
