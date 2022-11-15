---
title: 프로미스와 async await
date: 2022-11-15 16:11:44
category: javascript
thumbnail: { thumbnailSrc }
draft: false
---

회사에서 처음으로 코드리뷰 시간이 있었다.<br/>
맨날 급하게 개발해야한다는 핑계로 너무 생각없이 코드를 짠 부분이 보여서 부끄러웠다.<br/>
아래와 같이 api를 호출하기 위해 useEffect를 사용했다.
이 코드에는 `크게 2가지 문제점`이 있었다.

<p align="center">
<img src="https://velog.velcdn.com/images/chloeee/post/0a28ca6a-b5e9-4e4e-8207-b2e5c2c077cc/image.png" width="500px" >
</p>

#### 1. 왜 프로미스와 async await을 혼용하였는가?

다른 개발자분께서 위 코드는 async await이 적용안되었을 것 같아 보이네요 라고 말씀하셨다. <br/>
async await을 사용하는 이유는 프로미스를 더 편하게 사용하기 위함이다.
이 둘의 차이를 정확히 알고 썼어야 했다.

#### 2. 왜 then에서 e로 값을 받고 있는가?

보통 then에서는 값을 받게 되니까 res,response를 작성한다.
보통 catch에서 에러나는 부분을 e,error로 받는다.
이 부분을 전혀 생각하지도 않고 쓰고 있었다고 한다...

<br/>

> 이번을 계기로 promise와 async await의 차이점을 구체적으로 알고 잘 적용해야겠다는 생각이 들어 공부를 해보았다.

### Promise?
