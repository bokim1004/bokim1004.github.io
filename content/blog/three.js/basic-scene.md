---
title: [Three.js journey] basic scene
date: 2023-05-01 18:05:86
category: three.js
thumbnail: { thumbnailSrc }
draft: false
---

> Three.js journey 강의를 듣고 공부한 것들을 기록합니다.


## First Scene

scene을 만들기 위해서는 4개의 요소들이 필요합니다.

1. object를 담을 scene
2. objects
3. camera
4. renderer

### Scene

scene은 컨테이너와 같습니다. object,model,particle,light등을 두게 되는 곳입니다.
scene을 만들기 위해서는 아래와 같은 코드를 사용합니다.

```js
const scene = new THREE.Scene()
```

### Objects
Object는 여러개일 수 있습니다. 기본 형상, 가져온 모델,원자,조명등일 수 있습니다.
아주 심플한 red cube를 만들어봅시다.
red cube를 만들기 위해서는 Mesh라는 이름의 object타입을 만들어야 합니다.
`Mesh`는 geometry(shape)와 material의 혼합입니다.

다양한 종류의 geometry와 material이 있지만 아직은 심플하게 만들 것이기에 `BoxGeometry`와 `MeshBasicMaterial`을 만들어보겠습니다.
geometry를 만들기 위해  박스 사이즈에 상응하는 3개의 파라미터가 있는 `BoxGeometry`클래스를 사용히면 됩니다.

```js
const geomtery = new THREE.BoxGeometry(1,1,1)
```
material을 만들기 위해서는 1개의 파라미터가 있는 `MeshBasicMaterial`클래스를 사용해봅시다.
빨간색 큐브를 만들기 위해서 여기서 색상을 정해줄 수 있습니다.

Three.js에서는 여러방법으로 색상을 지정해줄 수 있습니다.
JS hexadecimal을 활용해 `0xff000`을 사용할 수도 있고 string hexadecimal `'#ff0000'`을 사용할 수도 있습니다. 컬러 이름 `'red'`라고 사용할 수도 있습니다.


```js
const geometry = new THREE.BoxGeometry(1,1,1)
const meterial = new THREE.MeshBasicMeterial({color:0xff0000})
```

마지막으로 Mesh를 만들기 위해서 `Mesh`클래스를 사용하고 geometry와 material을 파라미터로 보내면 됩니다.

```js
const geometry = new THREE.BoxGeometry(1,1,1)
const meterial = new THREE.MeshBasicMeterial({color:0xff0000})
const mesh = new THREE.Mesh(geometry,matchMedia())
```

그 다음 이 scene에 mesh를 추가해줍니다.
```js
scene.add(mesh)
```

### Camera

카메라는 실제로 보이는 것은 아닙니다. 이론적인 관점에 가깝다고 볼 수 있습니다.
scene을 렌더할 때, 이는 카메라에서 보는 관점에서 화면에 나오게 됩니다.
무비 세트에서처럼 여러개의 카메라를 가질 수도 있고 원하는대로 카메라들을 서로 바꿀 수 있습니다.

camera를 만들기 위해서는 `PerspectiveCamera`클래스를 사용합니다.
2개의 파라미터가 필요한데요.
첫번째는 `The field of view`입니다. 이는 시야의 앵글이 얼마나 큰지를 의미합니다.
큰 앵글을 사용하면 다양한 방향에서 한번에 볼 수 있지만 결과가 작은 사각형에 그려지기에 왜곡이 있을 수 있습니다.
작은 앵글을 사용하면 줌인한 것처럼 보이게 될 것입니다. The field of view는 한마디로 각도로 표시되며 수직 시야각에 해당합니다.
다음 파라미터는 `The aspect ratio`입니다. 이는 높이에서 캔버스의 넓이를 나눈 값이라고 볼 수 있습니다.
코드를 한번 봐보면 아래와 같습니다.


```js
//sizes
const sizes = {
    width:800,
    height:600
}

//Camera
const camera = new THREE.PerspectiveCamera(75,sizes.width/sizes.height);
scene.add(camera)
```

### Renderer

renderer의 역할은 렌더를 하기 위함입니다.
renderer를 만들기 위해서는 `WebGLRenderer`클래스와 1개의 파라미터를 사용합니다.
그리고 스크립트를 로드하기 전에 canvas 요소를 하나 만듭니다.
```js
<canvas class={"webgl"}></canvas>
```

canvas 변수를 하나 만들어 이 element에서 가져오고 저장할 수 있게합니다.
```js
const canvas = document.querySelector('canvas.webgl')
```
그리고 `setSize`를 통해 캔버스 사이즈를 자동적으로 resize할 수 있습니다.
```js
const renderer = new THREE.WebGLRenderer({
    canvas:canvas
})
renderer.setSize(sizes.width,sizes.height)
```

render방법을 통해 렌더가 됩니다.
```js
renderer.render(scene,camera)
```
그 다음으로 물체의 위치를 구체화해줘야 합니다.
scene의 가운데 있지만 물체가 그 내부에 있기에 보이지 않습니다.
Three.js는 z축을 앞면과 뒷면의 축으로 생각합니다.
camera를 뒷면으로 옮기려면 속성에 양수 값을 주어야 합니다.
아래 코드를 봐봅시다.

```js
const camera = new THREE.PerspectiveCamera(75,sizes.width/sizes.height);
camera.position.z = 3;
scene.add(camera)
```
### 결과

아래와 같이 red cube가 화면에 뜨게 됩니다!
<p >
<img src="https://velog.velcdn.com/images/chloeee/post/0030aaa4-f09c-4355-9855-319a2b25c1c7/image.png" width="500px" alt="imgs"/>
</p>

### 마치며

아주 단순한 red cube를 만드는데 생각보다 많은 클래스들이 쓰이고 각기 다른 parameter들의 값을 넣어줘야해서 헷갈리는 부분들이 많았던 것 같습니다.
여러번 계속 반복하며 이런 three.js 클래스에 익숙해지는 시간을 더 가져봐야할 것 같네요 🥲