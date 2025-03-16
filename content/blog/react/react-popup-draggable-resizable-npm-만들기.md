---
title: npm 패키지 만들어보기 (react-popup-draggable-resizable)
date: 2025-03-16 13:03:61
category: react
thumbnail: { thumbnailSrc }
draft: false
image: "https://velog.velcdn.com/images/chloeee/post/68714a4e-a56c-4db8-9165-e1551e015293/image.png"
---

NPM패키지를 한번도 publish해본 경험이 없어서 이번 기회에 경험삼아 만들어보고 싶었다.<br/>
패키지 작성부터 빌드, publish까지 "한 번 만들어보면 별거 아니지만, 해보기 전까지는 어렵게 느껴진다”라는 말을 듣고 이번 기회에 도전해보기로 했다.<br/>
NPM패키지를 작성해보면서 어떻게 패키지를 만들어야하는지 살펴보고, 실제 publish까지 해본 과정을 글로 남겨보았다.

## 1. 어떤 패키지를 만들면 좋을까?

처음에는 react-popup관련 패키지를 만들어보려고 했다. 하지만 이미 여러 가지 라이브러리가 있고, 그 중에서도 활용도가 높은 것들이 많았다. 다른 기능을 고민하다가 react에서 팝업이 draggable되고 resizable되게 해주는 npm 패키지를 만들면 좋겠다는 생각이 들었다.
기존에 `react-modal-resizable-draggable`이라고 있었으나, 이 패키지는 4년 전에 업데이트되고 현재는 업데이트 되지 않는 패키지였고, react class component로 작성되어 있어 함수형 컴포넌트로 직접 만들어보기로 결정했다.

## 2. Draggable & Resizable 팝업 컴포넌트 구현

**1. 커스텀 훅 분리**

팝업 컴포넌트를 구성하는 데 있어 중요한 기능은 드래그와 리사이즈이다.
이 두 가지 기능을 커스텀 훅으로 분리하여 관리했다.

📁 `src/hooks/useDraggable.ts` <br/>
📁 `src/hooks/useResizable.ts`

**2. 팝업 컴포넌트 만들기**

이제 드래그와 리사이즈 기능을 DraggableAndResizablePopup 컴포넌트로 합쳤다.

`📁 src/components/DraggableAndResizablePopup.tsx`

## 3. package.json 설정

npm 패키지를 배포하려면 `package.json`을 잘 설정해야 한다.

### 🔑 핵심 설정 항목

1) `name` 설정하기

- 여기에 패키지 이름을 작성할 수 있다. 난 아직은 개발용으로 만든거라 `@chloebok-dev`라고 앞에 붙였다.
- 이는 npm에서 organization을 하나 만들면 되었다.

  <img src="https://velog.velcdn.com/images/chloeee/post/d6f5ca1c-7fd1-48cd-9c74-b5255b3c43ab/image.png" alt="image" width="300px" />

   ```js
     "name": "@chloebok-dev/react-popup-draggable-resizable",
   ```

2) `type` 설정하기

패키지의 유형을 명시하는 부분이다.  이 패키지가 ES Module(module) 유형인지,  CommonJS(commonjs) 유형인지를 적는다.
만약 아무것도 적지 않으면 기본적으로 `commonjs`라고 보면 된다. <br/>
현재는 기존의 비표준이었던  CommonJS 방식에서 현재 표준 방식인 ES Module 방식으로 넘어가고 있기에, 기본 타입을 `module`이라고 지정해주었다.

```js
   "type": "module",
```

`CommonJS? ES Module?`

- CommonJS는 간단히 말해 `require()`와 `module.exports =` 를 사용하는 모듈 시스템이라고 보면 된다.
- ES Module은 `import`와 `export`를 사용하는 모듈 시스템이다.

<br/>

3) `main` 설정하기

기본 import를 할 때, 가리킬 스크립트의 위치를 지정한다.
import{} from “@chloebok-dev/react-popup-draggable-resizable”를 했을 때 가르키는 것이 아래 main이라고 보면 된다.

```js
"main": "./dist/index.js",
   ```

4) `types` 설정하기

기본 import를 할 경우, 가리킬 TypeScript 타입 파일의 위치를 지정한다. (d.ts)

   ```js
   "types": "./dist/index.d.ts",
   ```

5) `exports` 설정하기

exports 필드는 Node.js 12.7.0에서 도입된 기능이다. <br/>
패키지가 특정 모듈을 어떻게 노출할지 제어하기 위해 만들어졌다. 기존 main 필드는 하나의 진입점을 제공하고, exports 필드는 여러 개의 엔트리를 세분화해서 제공한다. 난 아래와 같이 작성해주었다.

```js
   "exports": {
      ".": {
         "types": "./dist/index.d.ts",
         "import": "./dist/index.js"
      },
      "./components/DraggableAndResizablePopup": {
         "types": "./dist/components/DraggableAndResizablePopup.d.ts",
         "import": "./dist/components/DraggableAndResizablePopup.js"
      }
   },

```

## 4. 패키지 빌드

패키지를 빌드하는 방법에는 여러가지가 있다.

**1. tsup**

가장 대중적인 패키지 빌드 도구이다.

```js
yarn add --dev tsup
```

yarn tsup하면 dist에 cjs,js가 들어가게 된다.

```js
// tsup.config.ts
import { defineConfig } from "tsup";

export default defineConfig({
  entry: {
    index: "src/index.ts",
    resizableAndDraggable: "src/components/DraggableAndResizable.tsx",
  
  },
  format: ["esm", "cjs"],
  clean: true,
  dts: true,
});
```

이 entry에 들어가는 부분들을 다 적어줘야한다는 단점이 있다. 그게 싫으면 아래 bunchee를 쓰면 된다.

**2. bunchee**

package.json의 설정 항목을 가지고 자동으로 빌드를 수행하게 하는 도구다.<br/>
위에 설명한 package.json의 여러 필드들을 활용해 빌드 설정을 추론하고 이를 통해 빌드를 한다.
yarn bunchee하면 dist에 js 올라간다. <br/>
유저가 import해서 사용해야하는거는 dist에 올라가야한다는 것을 기억하자. <br/>
package.json에서 추가해주면 그걸 보고 bunchee가 알아서 dist에 올린다.

```js
yarn add --dev bunchee
```

## 출판하기

아래 스크립트를 통해 npm 패키지를 출판할 수 있다.

```js
npm publish
```

### `changesets`으로 버저닝 자동화하기

```js
yarn add --dev @changesets/cli

```

<img src="https://velog.velcdn.com/images/chloeee/post/cda14686-25c2-462e-8bae-38a9365c2031/image.png" alt="image" />

위 이미지처럼 major인지 minor인지 patch인지 구분해서 버저닝할 수 있다.

`.changeset/config.json`을 만든다.

```js
{
  "$schema": "https://unpkg.com/@changesets/config@3.1.1/schema.json",
  "changelog": "@changesets/cli/changelog",
  "commit": false,
  "fixed": [],
  "linked": [],
  "access": "public", // 공개 패키지이므로 public으로 바꿔준다.
  "baseBranch": "main",
  "updateInternalDependencies": "patch",
  "ignore": []
}

```

### GitHub Actions 셋팅하기

- 아래 파일을 .github/workflows/release.yml에 만든다.
  
```js
name: Release

on:
  push:
    branches:
      - main

concurrency: ${{ github.workflow }}-${{ github.ref }}

jobs:
  release:
    name: Release
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Repo
        uses: actions/checkout@v3

      - name: Setup Node.js 20.x
        uses: actions/setup-node@v3
        with:
          node-version: 20.x

      - name: Install Dependencies
        run: yarn

      - name: Build
        run: yarn build

      - name: Create Release Pull Request or Publish to npm
        id: changesets
        uses: changesets/action@v1
        with:
          publish: yarn release
        env:
          NPM_TOKEN: ${{ secrets.NPM_PACKAGE_PUBLISH_KEY }}
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```
  
- NPM에서 액세스 토큰을 생성해 GitHub Actions Repository Secret에 채워준다. (NPM_TOKEN) <br/>
  `Settings → Secrets and variables → Actions → New repository secret`
- GitHub Actions의 권한을 ”Read and write permissions”로 변경하고, ”Allow GitHub Actions to create and approve pull requests”도 체크해준다.<br/>
  `Settings → Actions → General → Workflow permissions`

## 마무리

이번 npm 패키지 제작은 처음이라 많은 부분이 서툴렀지만, 직접 배포까지 해보니 확실히 어렵지 않았다. <br/>
내가 만든 패키지가 벌써 56번이나 다운로드 되었다.. ㅇㅅㅇ!!
<img src="https://velog.velcdn.com/images/chloeee/post/7b2a1902-b73c-46b3-9bd5-084bb4e4cb63/image.png" alt="image" />
[내가 만든 @chloebok-dev/react-popup-draggable-resizable npm 패키지](https://www.npmjs.com/package/@chloebok-dev/react-popup-draggable-resizable?activeTab=readme)<br/>

아직 완전하지 않고 수정이 필요한 부분도 있을 것 같아서 추가적으로 업데이트를 계속 해줘야할 것 같다.<br/>
이번에 npm패키지를 만들면서 많은 것을 배우고 성취감도 느낄 수 있었다.

## 참고

- 멘땀삭 강의를 보고 npm 패키지 만드는 연습을 함.
