---
title: 웹팩(Webpack) 이해하기
date: 2023-02-25 21:02:21
category: etc
thumbnail: { thumbnailSrc }
draft: false
---

보통 CRA를 통해 리액트 환경을 쉽게 구성하다보니, 웹팩에 대해서 공부할 일이 별로 없었던 것 같습니다.<br/>
주니어에서 중니어로 성장하려면 CRA를 사용하지 않고 웹팩을 통해 개발환경을 구성하는 법도 알아야겠다는 생각이 들었습니다.
기본적으로 웹팩이 무엇인지에 대한 공부를 해보고 정리해보았습니다.

### Webpack

웹팩은 여러개의 파일을 하나로 묶어주는 모듈번들러입니다.
모듈 번들러란 웹 애플리케이션을 구성하는 자원 (HTML,CSS,Javascript,Images등)을 모두 각각의 모듈로 보고 이를 조합해서
병합된 하나의 결과물을 만드는 도구를 의미합니다.

<p align="center">
<img src="https://velog.velcdn.com/images/chloeee/post/d83a0fcc-3b11-4836-8bf5-10c67451a555/image.png" width="500px" >
</p>

이런 웹팩은 여러개의 파일을 하나의 파일로 묶어주는 역할을 합니다. 아래 사진을 참고해주세요.

<p align="center">
<img src="https://velog.velcdn.com/images/chloeee/post/a32219bb-ff0b-47cf-b04b-be947046be51/image.png" width="200px" >
</p>

이런 모듈 번들러는 `프론트엔드에서 서버로 요청할 때 http요청 개수를 줄여줌으로써 퍼포먼스를 확장하고 공백을 줄여 리소스를 최적화합니다.`
이런 모듈 번들러를 사용하면 사용자 경험이 더 좋아질 것을 예상할 수 있겠죠?

#### ✅ 모듈이란?

웹팩은 프론트엔드 프레임워크에서 많이 사용되는 모듈 번들러라고 합니다.
여기서 이 모듈이란 과연 무엇일까요? `모듈이란 프로그래밍 관점에서 특정 기능을 갖는 작은 코드 단위`라고 합니다.

#### ✅ React는 반드시 Webpack과 함께 사용해야할까?

그렇지 않습니다. 하지만 함께 사용할 수 있습니다. Webpack과 react는 서로 다른 작업을 수행합니다.
그러므로 Webpack없이 React를 사용하는 것이 가능합니다.

#### ✅ Webpack을 사용하는 이유는 뭘까?

Webpack은 자바스크립트 모듈 번들러로 Javascript 모듈 번들링에 사용되는 NPM모듈입니다.
애플리케이션 모듈 종속성을 해결해 웹 브라우저에서 이해할 수 있는 방식으로 모듈을 연결하고 컴파일, 번들링 -> 빌드를 하게 됩니다.

### webpack 설정 파일관련

webpack을 사용하기 위한 방법이 필요한데 configuaration 설정 파일을 따로 만들면 됩니다.
이 파일을 통해 웹팩에게 알려주는 것이라고 볼 수 있죠.

`webpack.config.js`파일을 만들어 봅시다.
파일 내용을 작성하는 방법은 공식 홈페이지를 참조하면 됩니다.

```js
module.experts = {
  // 시작에 해당되는 파일
  entry: './src/index.js',
  output: {
    // 아래 위치에 output이 저장된다.
    path: path.resolve(__dirname, 'public/js'),
    filename: 'index_bundle.js',
  },
}
```

### webpack mode

개발을 하기 위한 development 모드와 실제 서비스를 하기 위한 production 모드가 있습니다.
아래와 같이 작성하면 됩니다.

```js
module.experts = {
  mode: 'development',
}
```

### webpack loader

css,png,js등의 모듈을 최종적인 아웃풋으로 만들어가는 과정에서 쓰이는 것이 loader이다.
다양한 loader의 종류는 공식홈페이지에 나옵니다.

```js
module.experts = {
module: {
  rules:[
    //확장자가 css인 파일을 만나면 아래 loader들을 사용해 처리해라.뒤쪽에 있는 loader가 먼저 실행됨
      test: /\.css$/,
      //webpack을 동작시켰을 때 확장자가 css인 파일 만나면 웹팩이 알아서 css파일을 웹팩안으로 로드시켜주는 명령이다.
       use: [
            //웹페이지 안에 style태그로 주입시키는 역할을 한다.
            'style-loader',
            'css-loader',

       ],
  ]
}
  },

```

### webpack output 설정

```js
module.experts = {

  entry: {
    //webpack은 아래 2개의 파일을 다 번들링 시켜준다.
    index:'./src/index.js',
    about:'./src/index.js',
  }
  output: {
    // 아래 위치에 output이 저장된다.
    path: path.resolve(__dirname, 'public/js'),
    //entry의 이름이 [name]으로 들어가서 index_bundle.js, about_bundle.js로 각각 번들링 된다.
    filename: '[name]_bundle.js',
  },
}
```

### plugin

로더를 통해 만들어진 최종적인 결과물을 변형하는 역할을 하는 것이 플러그인입니다.
플러그인의 종류는 많고 사용방법도 제각각입니다.
`html-webpack-plugin`으로 예시를 들어보겠습니다.
HtmlWebpackPlugin은 webpack 번들을 제공하는 HTML 파일 생성을 단순화합니다. <br/>
이 플러그인은 매번 컴파일에 변경되는 해시로 된 파일 이름을 가진 webpack 번들에 특히 유용한 것입니다.

`npm install -D html-webpack-plugin`을 해줍니다.

```js
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.experts = {
  plugins: [
    new HtmlWebpackPlugin({
      //template html을 바탕으로 filename의 html파일이 만들어지고 여기에 번들링된 파일들이 들어가게 된다.
      template: './src/index.html',
      filename: './index.html',
      chunks: ['index'],
    }),
    new HtmlWebpackPlugin({
      template: './src/about.html',
      filename: './about.html',
      chunks: ['about'],
    }),
  ],
}
```

### npx webpack

npx webpack을 해서 webpack 파일 수정된 것을 컴파일 다시해서 확인하고 하는게 번거로울 수 있습니다.
이 경우 `npx webpack --watch`를 하면 됩니다. 그럼 연속적으로 수정된 것이 컴파일이 저절로 되고 확인이 가능해집니다.

### 참고

- https://www.youtube.com/watch?v=NGVc-zw2FG8
- https://yamoo9.gitbook.io/webpack/react/create-your-own-react-app <br/>
- 생활코딩-webpack
- https://webpack.kr/
