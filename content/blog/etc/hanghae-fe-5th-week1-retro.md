---
title: 항해플러스 프론트엔드 5기 | 1주차 회고
date: 2025-03-30 17:03:05
category: etc
thumbnail: { thumbnailSrc }
draft: false
image: 'https://velog.velcdn.com/images/chloeee/post/db477a29-3257-42ee-b936-58629e0ef09f/image.png'
---

### 들어가며

항해플러스 프론트엔드 1주차가 드디어 시작되었다.
항해플러스 과정에 대한 이야기는 많이 들었는데, 생각보다 빡세지만 배우는게 많다는 후기가 많아서 지원하게 되었다. <br/>
난 어떤 환경안에 있는지 굉장히 중요한 사람이라 들어오길 참 잘했다는 생각이 든 1주였다.
1주차 과제는 vanilla JS로 SPA를 개발하는 것이었다. vanilla JS로 개발하는 것부터 넘 오랜만이라 기대되는 시간이었다.<br/>
1주차 과제를 완료한 후, 회고를 해봤다.

---

### 🙌 과제를 통해 배운 점

**1. Vanilla JS로 라우팅 구현을 하며 새롭게 배운 점들이 많았다.**

- historyAPI를 이용한 browser 라우터뿐만 아니라 hash를 이용한 라우터방식도 있다는 것을 새롭게 알게 되었다.
- historyAPI에서 `history.popState() ,history.replaceState(),history.pushState()`가 어떻게 동작하는지 구분해서 이해하게 되었다.
- history 기반 라우팅은 브라우저 주소는 변경되지만, 페이지는 새로고침 없이 전환된다는 것을 직접 구현하면서 체감할 수 있었다.
  또한 테스트 코드를 실행하면서 놓치고 있던 부분도 발견하게 되었는데,<br/>
  `history.replaceState(null, "",${BASE_PATH}/login);`<br/>
  이렇게 브라우저 라우팅 시 URL을 변경하더라도 실제 DOM이 변경되는 건 아니기 때문에, 아래 코드처럼 직접 렌더링을 트리거해줘야 한다는 점을 알게 되었다.
  이 부분은 실제 라우팅 동작에 대해 더 깊이 이해할 수 있었던 계기가 되었다.<br/>
  `root.innerHTML = routes[${BASE_PATH}/login]();`

**2. Vanila JS로 개발 시, 이벤트 등록과 관련해서도 잘 이해하게 되었다.**

submit 이벤트를 동작하기 위해서는 아래와 같이 addEventListener를 해줘야 동작을 하는데,<br/>
`form.addEventListener("submit", (e) =>` 이 이벤트 리스너가 화면이 로드될 때 등록되어야 한다는 것도 이번에 깨달았다.

현재는 renderRoute 함수 안에서 이벤트 등록이 이뤄지며, DOMContentLoaded 시점에 실행되도록 아래와 같이 처리했다.
`window.addEventListener("DOMContentLoaded", renderRoute);`

이처럼 과제를 진행하면서 Vanilla JS에서의 라우팅 처리, 이벤트 바인딩, DOM 조작 방식 등에 대해 실전으로 익힐 수 있었고, 이전에는 깊게 생각하지 않았던 동작 원리들을 배울 수 있었다.

---

### 🌟 해결이 어려웠던 문제를 해결한 과정

**1. 로그아웃하고 → 로그인 페이지로 넘어가는 부분에서 문제가 있어서 많은 시간을 소요했다.**

> 문제가 있었던 코드:<br/> > `<li><a href="/login" id="logout" data-route-link class="text-gray-600">로그아웃</a></li>` <br/>

로그아웃 시, login으로 바로가게 해줬었는데 문제는 로그아웃 시 동작해야하는 클릭 이벤트가 동작을 안하고 href 동작에 따라 로그인페이지로만 이동하는 현상이 있었다.
맨처음 DOMContentLoaded할 때, 이벤트를 등록해줬는데 이벤트가 동작되지 않는 이슈였다.

다음과 같이 해결을 해주니 문제가 해결되었다.😀😀

**a). a 태그 안에서 data-route-link를 지워줬다.**

왜냐하면 data-route-link가 있으면 아래 코드가 동작되어서 href 속성 값을 가져와서 이동을 하기 때문이었다.

```js
const link = event.target.closest('a[data-route-link]')
if (link) {
  event.preventDefault()
  navigateTo(link.getAttribute('href'))
}
```

로그아웃 이벤트보다 위 코드가 먼저 실행돼서 로그아웃이 무시되는 것으로 보여서 로그아웃 시에는 동작하지 않게 해줬다.

**b).`<a href=”/#`으로 href속성을 변경해줬다.**

`<a>`의 기본 동작을 비활성화해주기 위해서였다.<br/>

> `<li><a href="#" id="logout"  class="text-gray-600">로그아웃</a></li>`

**c). 로그아웃 이벤트 클릭 동작은 이벤트 위임 방식으로 해주었다.**

document에 클릭 이벤트를 한 번만 등록해두고, 실제 클릭된 요소(event.target)에서 #logout 요소를 찾아서 처리하는 이벤트 위임방식으로 실행되게 해주었다.

```js
document.addEventListener('click', (event) => {
  const logoutBtn = event.target.closest('#logout')

  if (logoutBtn) {
    event.preventDefault()
    Store.logout()
    history.replaceState(null, '', `${BASE_PATH}/login`)
    renderRoute()
    return
  }
})
```

위 과정으로 해결해주니 문제가 해결되었다~!

**2. 가장 시간을 많이 쏟았던 이슈는 hash 라우터 이슈였다.**

배포 과정을 마치고 index.hash.html로 들어가면 404페이지가 나오는 이슈가 있었다. <br/>
이 이슈의 원인은 `BASE_PATH(/front_5th_chapter1-1/)가 중복`된 것이었다. 이 원인을 알아내기까지 너무 삽질이 많았다ㅠㅠ

이 문제는 hash router쪽에 BASE_PATH를 다 지워주니 해결이 되었다.<br/>
`BrowserRouter`와 `HashRouter`는 URL을 해석하는 방식이 달라서 base_path 처리 방식도 다르게 가져가야한다는 것을 이번 계기로 알게 되었다.
`BrowserRouter`는 실제 경로(URL path)를 사용하기 때문에 base_path 설정이 필요하지만, `HashRouter`는 # 뒤에 붙는 해시로 경로를 관리하기 때문에 base_path를 넣을 필요가 없었다. 오히려 넣으면 base_path가 중복되었다.<br/>
그래서 base_path를 넣지 않고 라우팅되게 해주었다.

내가 이해하지 못하고 있던 부분이 `vite.config.js`에서 base를 설정해준 부분이었는데, 이 부분은 이 웹사이트는 `/front_5th_chapter1-1/ 하위 폴더 안`에 있으니 이걸 참고해 파일을 가져오라는 것이다.

> `base: isProd ? "/front_5th_chapter1-1/" : "/",`
> 그런데 이 부분은 라우팅(URL path)을 위한 건 아니기 때문에 브라우저 라우팅 시 base path(/front_5th_chapter1-1/ )를 넣어야하는 것이었고, HashRouter는 그냥 index.hash.html만 잘 열리면, JS가 알아서 해시 경로 보고 라우팅해주는 방식이기 때문에 라우팅 자체는 base path를 신경 안 써도 되는 구조인 것라는 것을 알게 되었다...!

---

### **Keep : 현재 만족하고 계속 유지할 부분**

시간을 지켜 1주차 과제를 잘 마무리하려고 했던 부분은 계속 유지해야할 부분이다.10주가 굉장히 물흐르듯 빠르게 지나갈 것 같다~
과제에서 만족스러웠던 부분은 컴포넌트를 페이지 단위로 분리하고, 사용자 상태를 Store.js 에서 따로 관리하도록 구조화한 점이 만족스러웠다.

### **Problem : 개선이 필요하다고 생각하는 문제점**

1주차 과제를 하며 아쉬웠던 부분은 다음과 같다.

`디자인 패턴 관련`

- 처음 설계시 디자인 패턴을 구체적으로 정하고 개발하지 못했던 부분이 아쉬워서, 시간이 되면 리팩토링을 해보면 좋을 것 같다.

`renderRoute 되는 부분`

- 아쉬운 부분은 renderRoute되는 코드 부분이다. 더 깔끔하게 분리해놓으면 좋은 코드가 될 것 같아서 리팩토링이 필요하다.

`router 파일 관련`

- 브라우저 라우터와 hash 라우터 부분을 다른 파일로 서로 구분해 줬는데, 두 파일에서 공통적으로 사용되는 코드가 있어서 이 부분은 따로 빼서 재사용되게 하면 더 좋을 것 같다.

전반적으로 디자인패턴 고려하여 리팩토링하면 코드가 전반적으로 깔끔해지고 가독성높아질 것 같다는 생각을 했다.

### **Try : 문제점을 해결하기 위해 시도해야 할 것**

처음 개발을 시작할 때, 설계를 잘하고 시작하면 좋을 것 같다. 제대로된 설계없이 구현에 급급하고, 테스트코드 통과에만 집중했던 시간도 많아서 아쉬운 점들이 있었다.
설계는 수정되기도 하지만, 2주차 과제를 할 때 첫 단추를 잘 끼우고 들어가보려고 한다.
