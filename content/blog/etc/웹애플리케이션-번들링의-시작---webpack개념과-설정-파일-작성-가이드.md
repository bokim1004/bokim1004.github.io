---
title: 웹 애플리케이션 번들링의 시작 - webpack개념과 설정 파일 작성 예시
date: 2024-10-27 10:10:11
category: etc
thumbnail: { thumbnailSrc }
image: 'https://velog.velcdn.com/images/chloeee/post/649c3922-2d20-476a-97c7-c269623785d6/image.png'
draft: false
---

<p align="center">
<img src="https://velog.velcdn.com/images/chloeee/post/0b73df01-888a-4531-88f4-a42c78034981/image.png" width="500px" height="200px"  >
</p>

### Intro

최근에 Next.js로 개발하는 프로젝트가 있었다.
신입분이 간단한 UI를 개발하시고, 내가 JS쪽 구조를 잡거나 webpack쪽 코드를 작성했어야 했다.
보통 webpack쪽 코드는 시니어분들이 작성해주셨기에 엄청 볼일은 없었는데 이번기회에 webpack쪽 코드를 열심히 들여다봤다. 그런데 알 수 없는 에러가 났다. <br/>
`Error: Conflict: Multiple chunks emit assets to the same filename`이 에러가 웹팩쪽에서 발생하는데 원인을 모르겠는 것이다.
이 에러를 해결하기 위해 혼자 끙끙대다가 리더가 힌트를 주셨다. <br/>

내가 작성한 JS쪽 코드는 next.config.js를 안타는데 난 웹팩 코드를 여기서 작성하고 있었던 것이다. next.js 코드를 위해 따로 next.config.js를 남겨두고 
이 프로젝트의 핵심 코드가 담겨있는 JS용 webpack.config.js를 신규 생성했다.
이렇게 하니 문제가 해결되었다..!
웹팩쪽 코드가 여전히 익숙하지 않아서 이번 기회에 더 공부를 해봐야겠다는 생각이 들어서 이번 글 주제로 잡아 보았다.

<br/>

--- 

<br/>

프론트엔드 개발을 하다보면 "모듈"이라는 개념을 접하게 된다. <br/>
HTML,CSS,Javascript파일뿐만 아니라 이미지,폰트,JSON등 다양한 파일을 하나의 애플리케이션으로 묶어야 하는데 이 때 필요한 것이
`번들링`이다. 이 과정에서 주로 사용하는 도구가 바로 <span style="background:yellow; color:black;"> webpack</span>이다. webpack은 모듈을 효과적으로 관리하고 최적화된 방식으로 빌드할 수 있게 돕는다.

### 1. webpack은 무엇인가?

webpack은 JavaScript 애플리케이션을 위한 정적 모듈 번들러이다. <br/>
여러 파일과 모듈을 하나의 파일로 묶어 최적화된 결과물을 만들어준다.

#### <span style="background:yellow; color:black;"> 왜 webpack을 사용하는 걸까? </span>
• 파일을 최대한 작게 만들어 페이지 로딩 속도를 개선하기 위해<br/>
• 의존성 관리를 통해 서로 연관된 파일들을 안전하게 사용하기 위해<br/>
• 복잡한 모듈을 관리하고, 불필요한 코드를 제거하여 최적화하기 위해

### 2. webpack의 기본 동작 원리
webpack은 크게 다음과 같은 요소로 구성되어 있다.

#### `(1) 엔트리 entry`
애플리케이션 진입점이 되는 파일이다. webpack은 여기서부터 파일을 분석하고 의존성을 추적해서 필요한 파일들을 번들에 포함하게 된다.

난 아래와 같은 형식으로 entry를 작성해주었다.
```js
module.exports = {
  entry: [
    './JS/A/A.js',
    './JS/B/B.js',
    './JS/C/C.js',
    './JS/main/Main.js',
  ],
}
```
#### `(2) 출력 output`
번들링 결과를 어디에, 어떻게 저장할지 정의하는 역할을 한다. 일반적으로 하나의 파일로 묶여 저장된다.
난 아래와 같은 형식으로 output을 작성해주었다. output.filename, output.path속성을 사용해서 webpack에 번들의 이름과 내보낼 위치를 알려준 것이다.
```js
module.exports ={
  output: {
    path: path.resolve(__dirname, 'public/js'),
    filename: 'Main.js',
  },
}

```

#### `(3) 로더 loader`
웹팩은 기본적으로 Javascript와 JSON파일만 이해한다. 로더를 사용하면 webpack이 다른 파일의 유형을 처리할 수 있게 된다.<br/>
Javascript외의 파일 (css,이미지 등)을 웹 애플리케이션에 포함할 수 있게 한다. 예를 들어 CSS파일을 로드하려면 `css-loader`가 필요하다.

로더는 webpack 설정에 2가지 속성을 가진다.
1. 변환이 필요한 파일을 식별하는 `test` 속성
2. 변환을 수행하는데 사용되는 로더를 가리키는 `use`속성

난 아래와 같이 babel-loader를 추가해줬다.
이는 웹팩에서 `Babel`을 사용할 수 있도록 해주는 로더이다.<br/>
Babel은 최신 자바스크립트 문법(ES6,ES7+)이나 JSX코드를
구형 브라우저에서도 동작할 수 있게 ES5문법으로 변환하는 트랜스파일러다.

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.js$/,
        use: {
          loader: 'babel-loader',
        },
      },
    ]
  }
}
```

#### `(4) 플러그인 plugins`
플러그인은 번들링 과정 중 다양한 기능을 추가하는 역할을 한다. 로더가 파일별로 적용된다면 플러그인 번들링 전반에 영향을 미치는 특징이 있다.
new연산자로 호출해 플러그읜의 인스턴스를 만들어서 배열에 추가해야 한다.
난 아래와 같이 플러그인을 추가해줬다.

**1. CleanWebpackPlugin**

- 이것의 역할은 매 빌드 전에 이전 빌드 결과물을 자동으로 삭제해준다. ['js']를 지정하면, 빌드할때마다 `.js`파일이 삭제된다.
- 이 플러그인은 웹팩 기본 플러그인이 아니므로 별도로 설치해야 한다. `npm install --save-dev clean-webpack-plugin`
<br/>

**2. DefinePlugin**

- DefinePlugin은 코드 내에서 전역 상수처럼 사용할 수 있는 변수를 정의할 수 있게 한다. 예를들어 API_BASE_PATH라고 변수를 지정하면 빌드 시점에 코드에서 해당 변수를 사용해 환경에 다라 다른 값을 주입할 수 있다. 이렇게 하면 코드 내에서 환경별 설정을 쉽게 변경할 수 있다.
- DefinePlugin은 웹팩 기본 플러그인이기에 별도 설치필요는 없다.

```js
module.exports = (env) => {
  const environment = env.value;
  
  plugins: [
    new CleanWebpackPlugin({ cleanAfterEveryBuildPatterns: ['js'] }),
    new webpack.DefinePlugin({
      API_BASE_PATH: JSON.stringify(getAPIUrl(environment)),
      API_V2_BASE_PATH: JSON.stringify(getV2Url(environment)),
      BASE_URL: JSON.stringify(baseUrl(environment)),
      ENV: JSON.stringify(environment),
    }),
  ]
}

```

#### `(5)  Mode`
mode 파라미터를 development, production 또는 none으로 설정하면 webpack에 내장된 환경별 최적화를 활성화 할 수 있다.<br/> 
기본값은 production 이다.
```js
module.exports = (env) => {
  const environment = env.value;
  mode: environment ? 'production' : 'development'

};
```

#### `(6) Optimization`
웹팩의 Optimization옵션은 번들 크기를 줄이고, 로딩 속도를 개선하고, 최적화된 코드를 생성할 수 있게 하는 다양한 설정을 포함한다.
이 옵션을 통해 코드 스플리팅, 압축 등의 여러가지 성능 최적화 작업을 수행할 수 있다.<br/>
난 아래와 같은 형식으로 코드를 추가해주었다.

```js
module.exports = {
  optimization: {
    minimize: ['production', 'staging', 'development'].includes(environment),
    minimizer: [
      new TerserPlugin({
        extractComments: false,
        test: /\.js$/,
        terserOptions: {
          compress: {
            drop_console: ['production'].includes(environment),
            drop_debugger: ['production'].includes(environment),
            pure_funcs: ['production'].includes(environment)
              ? ['console.log', 'console.info', 'console.debug']
              : [],
          },
        },
      }),
    ],
  },

}
```

**1. minimize 설정**

- 빌드 환경이 production, staging, development일 때만 코드 압축을 적용하도록 설정한다. 즉, 해당 환경에서만 번들이 압축되어 배포된다.

**2. TerserPlugin 설정**
- TerserPlugin을 사용하여 압축을 수행하며, `extractComments:false`옵션으로 주석을 제거하고 ` test: /\.js$/` 옵션으로 Javascript파일에만 압축을 적용한다.
- TerserPlugin은 기본적으로 웹팩에 포함되지 않은 별도의 패키지이기 때문에, 사용하려면 설치해야 한다.
  - `npm install terser-webpack-plugin --save-dev`

**3. 환경에 따른 압축 세부 설정**
- `drop_console, drop_debugger`: production 환경일 경우 console과 debugger 관련 코드가 최종 번들에서 제거된다.
- `pure_funcs`: production 환경일 때 console.log, console.info, console.debug 같은 콘솔 관련 함수 호출이 제거된다. 이를 통해 불필요한 로그 함수 호출을 줄여 번들 크기를 줄일 수 있다.

<br/> 

---


### 마치며
이번 글에서는 webpack의 기본 개념과 파일 작성 방법을 알아보았다.<br/>
이번 기회에 webpack의 구성요소들을 보며 어떻게 동작하는지 더 잘 알 수 있게 된 것 같다.
이 글을 통해 webpack에 대한 큰 그림을 이해하고 `webpack.config.js`파일을 작성하는데 도움이 되기를 바라며 글을 마쳐본다.

참고 :https://webpack.kr/concepts/