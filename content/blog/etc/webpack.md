---
title: 웹팩이란?
date: 2022-12-16 20:12:52
category: etc
thumbnail: { thumbnailSrc }
draft: false
---

### Webpack이란?

웹팩은 여러개의 파일을 하나로 묶어주는 모듈번들러이다.
모듈 번들러란 웹 애플리케이션을 구성하는 자원 (HTML,CSS,Javascript,Images등)을 모두 각각의 모듈로 보고 이를 조합해서
병합된 하나의 결과물을 만드는 도구를 의미한다.

<p align="center">
<img src="https://velog.velcdn.com/images/chloeee/post/d83a0fcc-3b11-4836-8bf5-10c67451a555/image.png" width="500px" >
</p>

이런 웹팩은 여러개의 파일을 하나의 파일로 묶어준다. 아래 사진 참고

<p align="center">
<img src="https://velog.velcdn.com/images/chloeee/post/a32219bb-ff0b-47cf-b04b-be947046be51/image.png" width="200px" >
</p>

이런 모듈 번들러는 `프론트엔드에서 서버로 요청할 때 http요청 개수를 줄여줌으로써 퍼포먼스를 확장하고 공백을 줄여 리소스를 최적화한다.`
이런 모듈 번들러를 사용하면 사용자 경험이 더 좋아질 것이다.

#### 모듈이란?

웹팩은 프론트엔드 프레임워크에서 많이 사용되는 모듈 번들러라고 한다.
여기서 이 모듈이란 무엇인가? `모듈이란 프로그래밍 관점에서 특정 기능을 갖는 작은 코드 단위다.

#### React는 반드시 Webpack과 함께 사용해야할까?

아니다. 하지만 함께 사용할 수 있다. Webpack과 react는 서로 다른 작업을 수행한다.
그러므로 Webpack없이 React를 사용하는 것이 가능하다.

#### Webpack을 사용하는 이유는 뭘까?

Webpack은 자바스크립트 모듈 번들러로 Javascript 모듈 번들링에 사용되는 NPM모듈이다.
애플리케이션 모듈 종속성을 해결해 웹 브라우저에서 이해할 수 있는 방식으로 모듈을 연결하고 컴파일, 번들링 -> 빌드한다.

####

#### 참고

https://www.youtube.com/watch?v=NGVc-zw2FG8
https://yamoo9.gitbook.io/webpack/react/create-your-own-react-app
