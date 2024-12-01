---
title: Three.js Project - 달 구현해보기 🌕
date: 2024-11-30 16:11:57
category: three.js
thumbnail: { thumbnailSrc }
draft: false
image : 'https://velog.velcdn.com/images/chloeee/post/ff20711d-c6bd-4d27-b5e0-0a649610adf0/image.png'
---
###  Three.js 프로젝트를 시작하며


Three.js study를 10월부터 시작하며  기본적인 개념들을 공부했다. <br/>
Three.js의 3가지 기본 요소인 `scene, camera, render`에서부터 `Geometry`, `Texture`, `Material`등등을 공부하며 여전히 모르는 건 많지만 어느정도 기본적인 것은 많이 파악되었다는 생각이 들었다. <br/>

이젠 개념에 대한 공부뿐만 아니라 실제로 개발을 해봐야겠다는 생각이 들어서, 나만의 프로젝트를 시작해보려고 한다. <br/>
어떤 것을 만들 수 있을까 고민이 많이 되었는데, 처음부터 엄청 어렵고 복잡한 걸 시도해보기보단 작고 쉬운 걸 만들면서 공부하면서 내용을 덧붙이고 확장해나가면 좋겠다는 생각을 했다.


## Three.js로 실제로 존재하는 것들, 예를 들어 달이나 자연을 웹페이지에서 표현할 수는 없을까?


퇴근 후 문득 하늘을 보는데 밤 하늘에 달이 너무나도 밝고 아름다웠다. 동그란 달이 밝은 빛을 내는데, 저렇게 실제하는 자연의 일부를 three.js로 구현해볼 수 있지 않을까라는 생각이 들었다.
<p align="center">
<img src="https://velog.velcdn.com/images/chloeee/post/d039113e-d587-4ca1-96c2-bc09a6f71e4d/image.png
" width="400px" height="470px" >
</p>


## 밤 하늘의 빛나는 달을 Three.js로 구현해보기 🌕

우선 처음은 카메라를 띄우고, THREE.SphereGeometry를 이용해 동그란 구체를 생성해서 달 표면 texture를 보이게 한 후,
조명을 추가하여 달 주변 빛을 나게 하는 방식으로 해보는 것을 목표로 했다.

 
### 1. scene,camera,renderer 3가지 기본 요소를 구현한다.

가장 먼저 `Scene`을 만든다. <br/> Scene안에 3D 객체인 달, 달을 비추는 조명, 달을 보이게 하는 카메라가 배치된다.
말 그대로 3D환경의 기본 무대라고 볼 수 있다. 그리고 Scene을 렌더링하기 위해서는 `canvas`요소가 필요하다. 
```js
import * as THREE from 'three'
const canvas = document.querySelector('canvas.webgl') // scene을 렌더링하기 위해서 필요
const scene = new THREE.Scene()
```
그 다음은 `camera`를 설정한다.<br/>
화면에 3D 객체인 달을 렌더링하려면, 적어도 하나의 카메라가 필요하다.
원근감을 표현하는 `PerspectiveCamera`를 사용해 멀리 있는 물체는 작게 보이고 가까이 있는 물체는 크게 보이도록 렌더링하게 했다.

```js
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 1
camera.position.y = 1
camera.position.z = 2
scene.add(camera)
```
다음은 `renderer`를 생성한다.<br/>
renerer는 camera와 scene에 대한 정보를 기반으로 3D객체인 달을 2D화면에 렌더링하여 사용자에게 보여주게 한다.

```js
const renderer = new THREE.WebGLRenderer({
  canvas: canvas, // webGLRenderer에 전달하며, webGL api는 canvas요소에서만 동작한다.
  antialias: true, // 계단 현상 방지
})

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight
}

renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
```
`setSize` 메서드로 렌더러의 크기를 설정하고 `setPixelRatio`메서드로 렌더러의 픽셀 비율을 설정한다.
`Math.min(window.devicePixelRatio, 2)`로 픽셀 비율 최대 값을 2로 제한한다. 그 이유는 너무 높은 devicePixelRatio 값이 렌더링 성능에 부담을 줄 수 있기 때문이다. 


### 2.  geometry와 material을 조합하여 3D객체인 mesh를 만든다.
달을 만들기 위해 `THREE.SphereGeometry`로 구체 형태의 3D 객체를 생성한다.

<p align="center">
<img src="https://velog.velcdn.com/images/chloeee/post/8223e3ae-7a79-4beb-9940-8663605f09ee/image.png
" width="500px" >
</p>

달의 material은 현실감 있는 조명과 반사 효과를 구현하기 위해 `MeshStandardMaterial`을 사용했다. <br/>
meshStandardMaterial은 `물리 기반 렌더링(PBR, Physically-Based Rendering)`을 지원하는 고급 material이다.

```js
const moonMaterial = new THREE.MeshStandardMaterial({
  roughness: 0.7,    // 표면의 거칠기 조절 (1에 가까울수록 거친 표면)
  metalness: 0.0,    // 금속성 정도 
});


const sphere = new THREE.Mesh(
  new THREE.SphereGeometry(0.5, 64, 64),
  moonMaterial
)
sphere.position.x = 0; 
sphere.position.y = 1;

scene.add(sphere)
```

### 3. 3D객체에 달 표면 Texture를 보이게 한다.
 달 표면을 보여줄 이미지를 하나 다운로드해서 texture로 사용할 수 있게 했다.
 `Three.TextureLoader`로 텍스처 이미지를 로드할 수 있게 하고, MeshStandardMaterial에 적용해주었다.

```js
const textureLoader = new THREE.TextureLoader()
const moonTexture = textureLoader.load('./textures/moon_texture.jpeg')

const moonMaterial = new THREE.MeshStandardMaterial({
  map: moonTexture, // 텍스처를 재질에 적용
  roughness: 0.7,    // 표면의 거칠기 조절 (1에 가까울수록 거친 표면)
  metalness: 0.0,    // 금속성 정도 
});
```

### 4. Environment map으로 달이 뜨는 밤 하늘 모습 보여주기
environment map은 HDR(High Dynamic Range)환경 맵을 로드하고 Scene의 배경이나 물체의 반사 조명을 설정할 수 있다.
여기서 HDR환경 맵은 한마디로 HDR이미지를 활용해서 3D장면에서 주변 환경을 표현하는 텍스처를 의미한다.

난 three.js journey에서 알려준 [Poly heaven](https://polyhaven.com/)이라는 곳에서 3D 달을 뛰어줄 밤하늘 HDR이미지를 하나 찾았다.
파일 형식이 .exr이었기에 Three.js 확장 라이브러리인 `EXRLoader`로 파일을 로드했다.

환경 맵은 여러가지 형식으로 표현될 수 있다.
`environmentMap.mapping = THREE.EquirectangularReflectionMapping` <br/>
이 부분은 로드된 텍스처이미지의 mapping 속성을 설정하는 부분인데, 여기서 사용된 EquirectangularReflectionMapping은 직사각형으로 펼쳐진 환경 맵으로
일반적인 HDR이미지가 이 형식이라고 한다.


```js
const exrLoader = new EXRLoader()
exrLoader.load('./textures/environmentMap/sky.exr', (environmentMap) =>
{
  environmentMap.mapping = THREE.EquirectangularReflectionMapping

  scene.background = environmentMap //  scene 전체가 HDR이미지로 감싸진 것처럼 보이게 된다.
  scene.environment = environmentMap // scene의 환경맵으로 할당하여 HDR텍스처가 반사와 조명효과에 영향을 주게 된다.
})

```
### 5. orbitControl을 이용하여 카메라가 회전,줌,이동되게 하기
카메라와 상호작용할 수 있는 컨트롤러를 이용해 카메라를 사용자 입력에 따라 움직이게 만들어주게 했다.
가장 기본적으로 많이 사용되는 `OrbitControls`를 사용해서 카메라를 중심으로 회전하거나 줌 인/아웃 할 수 있게 만들어주었다.
추가로 enableDamping을 활성화하면 움직임이 부드러워져 사용자가 조작할 때 더 자연스러운 효과를 준다.
```js
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true // 부드러운 움직임을 추가
```


### 6. 화면에서 달이 회전하게 animation 효과 주기
애니메이션 루프함수를 만들어서 매 프레임마다 달의 위치와 장면을 그리고 다시 렌더링하게 한다.
```js
const clock = new THREE.Clock() // 시간을 추적한다.

const tick = () =>
{
  const elapsedTime = clock.getElapsedTime() // 애니메이션의 현재 경과 시간을 계산한다.

  // 시간이 지날수록 sphere 객체가 지속적으로 회전한다.
  sphere.rotation.y = 0.1 * elapsedTime
  sphere.rotation.x = - 0.15 * elapsedTime

  // 카메라 control을 사용하는 경우, control 상태를 업데이트하는데 사용된다.
  // 이는 카메라 위치와 방향을 최신상태로 유지하게한다.
  controls.update()

  // scene을 지속적으로 업데이트해서 애니메이션을 가능하게 한다.
  renderer.render(scene, camera)

  // 브라우저 프레임 타이밍에 맞춰 tick함수를 호출한다.
  window.requestAnimationFrame(tick) 
}

tick() 
```

### 7. 달 주변이 빛나게 조명 추가하기
`ambientLight 주변광`을 설정해줘서 달 표면이 약하게 노란빛을 띄게 해주었다.
```js
const ambientLight = new THREE.AmbientLight(0xFAFAD2, 1)
scene.add(ambientLight)
```
실제 달 사진처럼 달을 감싸는 빛을 추가해보고 싶은데, 이건 어떻게 구현해야하는지 더 찾아봐야할 것 같다. <br/>

## 현재까지 구현한 달의 모습 🌕

아래 이미지는 three.js로 구현한 달의 모습이다 🌝 <br/>
앞으로 three.js를 더 공부해나가면서 추가로 공부한 내용들을 반영하여 더 완성도있는 project를 진행해보려고 한다.


<p align="center">
<img src="https://velog.velcdn.com/images/chloeee/post/a3d82a33-33ee-41b6-b0a6-5c28b903ec47/image.gif" width="500px" >
</p>
