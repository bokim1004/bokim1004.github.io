---
title: type_inference
date: 2022-12-14 18:12:58
category: typescript
thumbnail: { thumbnailSrc }
draft: false
---

## 타입추론

타입스크립트는 타입 추론을 적극적으로 수행한다.
타입추론은 수동으로 명시해야하는 타입 구문의 수를 엄청나게 줄여주기에 코드의 전체적인 안정성이 향상된다.

### 추론 가능한 타입을 사용해 장황한 코드 방지하기

보통 타입 정보가 있는 라이브러리에서 콜백 함수의 매개변수 타입은 자동으로 추론된다.
다음 예제에서 express HTTP 서버 라이브러리를 사용하는 request와 reponse타입 선언은 필요하지 않다.

```js
// 이렇게 하지 맙시다.
app.get('/health', (request: express.Request, response: express.Response) => {
  response.send('OK')
})

//이렇게 합시다.
app.get('/health', (request, response) => {
  response.send('OK')
})
```

- 타입스크립트가 타입을 추론할 수 있다면 타입 구문을 작성하지 않는게 좋다.
- 추론될 수 있는 경우라도 객체 리터럴과 함수 반환에는 타입 명시를 고려해야 한다. 내부 구현의 오류가 사용자 코드 위치에 나타나는 것을 방지해준다.
