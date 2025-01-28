---
title: FSD아키텍쳐 활용하여 폴더구조 변경하기
date: 2025-01-28 12:01:62
category: 업무기록
thumbnail: { thumbnailSrc }
draft: false
image: "https://velog.velcdn.com/images/chloeee/post/49c177e3-1bb4-4cc9-a0d5-84adb3fd8270/image.png"
---

### 가독성이 좋지 않고 복잡했던 기존 폴더구조의 문제점
- `pages`안에 각 페이지 별로 대부분의 코드들이 분류되어 들어가 있다. (가독성이 좋지 않음)
- `components`안에 뷰로직,비즈니스로직, 작은 컴포넌트들이 다 모여있어서 구분이 어렵다.
- api호출하는 부분은 커스텀 훅안에 넣어져있다.


<예시 이미지> <br/>
<img src="https://velog.velcdn.com/images/chloeee/post/d659687e-b2c1-4430-975d-6c0703693c6c/image.png" alt="image" width="300px" />

### FSD아키텍쳐로 폴더구조 변경하기
위 문제를 해결하기 위해 FSD아카텍쳐를 이용해 폴더구조를 변경하기로 결정했다. 

**< FSD아키텍쳐란?>**
- 기능(feature)을 기준으로 코드를 분리하는 방식이다. 
- 기능 중심의 폴더 구조는 비즈니스 로직을 더 명확하게 해준다.
<img src="https://velog.velcdn.com/images/chloeee/post/546b29fd-5302-420d-a98c-54e8548ef453/image.png" alt="image" width="300px" />
  
난 `features`폴더를 만들어 기능 별로 구분을 해주었다.
A4,Letter,Paperless,gate 이런식으로 구분을 했다.
여기서 아래와 같이 폴더를 구분했다.

```text
- api 폴더 : api fetch하는 코드가 있음
- components 폴더: 한 기능 안에 여러 곳 사용가능한 컴포넌트 코드가 있음
- hooks 폴더: 한 기능 안에 재사용할 수 있는 hook 코드가 있음
- model 폴더: 비즈니스로직 코드가 있음
- ui 폴더: 뷰로직 코드가 있음
```

### 실제로 FSD아키텍쳐 폴더구조를 적용한 결과 

<img src="https://velog.velcdn.com/images/chloeee/post/590c4945-caca-48e5-9f76-22363d531760/image.png
" alt="image" width="200px" />


### 결론

- 프로젝트의 성장과 함께 폴더 구조도 계속해서 변화해야하기에 이번 기회에 변경하여 적용을 완료했다.
- FSD 아키텍쳐를 활용하여 폴더구조를 변경하니 폴더 가독성이 훨씬 높아졌다. 추후 유지보수에도 도움이 될 것으로 기대된다.

### 참고

- https://velog.io/@teo/separation-of-concerns-of-frontend