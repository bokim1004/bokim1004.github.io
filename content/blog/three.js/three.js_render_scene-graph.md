---
title: Three.js에서 renderer와 Scene Graph 이해하기
date: 2024-11-09 16:11:31
category: three.js
thumbnail: { thumbnailSrc }
draft: false
image: 'https://velog.velcdn.com/images/chloeee/post/c9eb947c-a3c0-4288-83f3-857c3c2bcc22/image.png'
---
이번엔 Three.js의 기본 요소 중 하나로 장면을 렌더링하는데 필수적인 `renderer`와 renderer가 화면에 출력할 객체들을 구조적으로 관리해주는
`Scene Graph`에 대해 알아보았다.

## Three.js에서 renderer란?

three.js에서 renderer란 3D장면을 실제 화면에 그리는 역할을 한다. <br/>
renerer는 카메라와 장면(scene)에 대한 정보를 기반으로 3D객체들을 2D화면에 렌더링하여 사용자에게 보여준다.<br/>
Three.js에서는 주로 `WebGLRenderer`를 사용하며, 이는 WebGL을 통해 브라우저의 GPU를 활용하여 그래픽 성능을 최적화시켜준다.

### <div style="background:#FFFFCC; color:black; padding:7px"> 1. Renderer의 주요 역할 </div>
1. Scene과 Camera 정보처리: renerer는 장면(scene)과 카메라를 입력으로 받아, 카메라 관점에서 scene을 렌더링한다.
2. 프레임 갱신: 매 프레임마다 `renderer.render(scene,camera)`를 호출하여 애니메이션과 상호작용이 실시간으로 반영되게 한다.
3. 안티 앨리어싱 등 그래픽 옵션 설정: 렌더러 초기화 시 안티앨리어싱, 해상도 조정 등의 옵션을 통해 렌더링 품질을 제어할 수 있다. <br/>
`renderer`는 결과적으로 3D객체들이 화면에 올바르게 나타나도록 돕는 역할을 하며, 이를 통해 생동감있고 몰입감있는 장면을 구현할 수 있다.

### <div style="background:#FFFFCC; color:black; padding:7px"> 2. Renderer 설정 및 옵션 </div>
WebGLRenderer는 다양한 옵션을 설정할 수 있다. 
```js
const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#canvas'),
  antialias: true, // 계단 현상 방지
  alpha: true, // 배경 투명도
});
renderer.setSize(window.innerWidth, window.innerHeight);

```
`옵션`
- antialias: true로 설정하면 계단 현상을 줄여준다. 성능에 영향을 줄 수 있지만, 선명한 렌더링 결과를 얻을 수 있다.
- alpha(투명도):배경을 투명하게 만든다. 배경이 웹페이지와 자연스럽게 어우러질 수 있다.

옵션을 통해 렌더링의 품질과 성능을 제어할 수 있고, scene의 요구사항에 맞게 조정할 수 있다.

### <div style="background:#FFFFCC; color:black; padding:7px"> 3. 계단 현상은 무엇인가? </div>


Three.js에서 계단 현상(aliasing)은 렌더링된 이미지의 경계가 부드럽지 않고 계단처럼 보이는 현상이다.

<img src="https://velog.velcdn.com/images/chloeee/post/29b90543-602a-4f64-9e16-053b5292f77b/image.png" alt="img" width="500px" height="400px"  />

주로 고해상도 그래픽에서 각진 경계가 뚜렷하게 나타날 때 발생한다.
이 문제는 픽셀이 네모난 형태이기 때문에, 비스듬한 선이나 곡선의 가장자리가 부드럽게 보이지 않고, 딱딱한 경계를 형성하게 된다.

`계단현상의 원인`
1. **픽셀화**: 그래픽에서 선이나 경계가 비스듬하게 그려질 때, 화면의 픽셀 그리드와 맞물리면서 비정상적으로 보일 수 있다.
2. **해상도**: 낮은 해상도로 렌더링할 경우, 더 많은 계단현상이 발생할 수 있다.

`해결 방법`

Three.js에서는 계단현상을 완화하기 위해 다양한 방법을 사용할 수 있다.

1. **안티 앨리어싱(Anti-aliasing)**:
    - `WebGLRenderer`의 `antialias` 속성을 `true`로 설정하여 안티 앨리어싱을 활성화할 수 있다. 
   이는 경계의 픽셀 색상을 부드럽게 조정하여 계단현상을 줄여준다.

    ```jsx
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    
    ```

2. **고해상도 렌더링**:
    - 더 높은 해상도로 렌더링하고, 화면 크기에 맞게 다운샘플링하면 경계가 더 부드럽게 보일 수 있다. 
    - 이를 위해 `setSize` 메소드를 사용하여 크기를 조정할 수 있다.

  `setSize 메서드에 대하여`
  setSize 메서드는 Three.js에서 WebGLRenderer 객체가 렌더링할 캔버스의 크기를 설정하는 데 사용된다. 
  이 메서드를 통해 캔버스의 가로와 세로 크기를 지정할 수 있고, 이는 장면의 해상도와 출력 크기에 직접적인 영향을 미친다.
```js
renderer.setSize(window.innerWidth, window.innerHeight);
```


3. **Post-processing**:
    - 후처리 효과를 적용하여 안티 앨리어싱을 추가로 적용할 수 있다. 예를 들어, FXAA(Fast Approximate Anti-Aliasing)와 같은 후처리 기술을 사용할 수 있다.
   
4. **텍스처 필터링**:
    - 텍스처의 필터링 모드를 설정하여 더 부드러운 경계를 만들 수 있다. 예를 들어, `THREE.LinearFilter`와 같은 필터를 사용할 수 있다.

### <div style="background:#FFFFCC; color:black; padding:7px"> 4. Renderer의 주요 메서드와 활용법 </div>


renderer에서 가장 중요한 메서드는 `render(scene, camera)`이다.
이 메서드는 장면(Scene)과 카메라(Camera)를 기반으로 화면에 그림을 그린다.

```js
function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
animate();
```
위 예시 코드는 requestAnimationFrame을 사용하여 애니메이션 루프를 생성하고 render 메서드를 호출한다. 
이를 통해 장면을 반복적으로 렌더링하여 실시간으로 화면에 출력한다.


## Scene graph란?

씬 그래프는 3D객체들(Scene안에 포함된 요소)을 트리 구조로 구성하여 쉽게 관리할 수 있도록 돕는 개념이다.
최상위 Scene을 루트로 두고, 그 아래의 여러 노드가 부모-자식 관계로 연결된다. <br/>
이렇게 계층을 이루는 이유는, 특정 객체가 다른 객체의 자식으로 설정되었을 때, 부모 객체의 이동에 자식도 영향을 받게 하기 위해서다.

(출처:공식문서)

<img src="https://velog.velcdn.com/images/chloeee/post/001e47fb-d2b7-4549-86f6-3a2b56cb3870/image.png" alt="img" width="500px" height="400px"  />

예를 들어, 부모- 자식관계에 대해 더 설명해보면 부모객체가 이동하거나 회전할 때 자식객체도 자동으로 따라가게 된다.
아래 예시 코드로 부모객체가 자식 객체에 영향을 주는 모습을 볼 수 있다.

```js
const scene = new THREE.Scene(); // Scene은 Scene Graph의 루트
const parent = new THREE.Object3D(); // 부모 객체 생성
scene.add(parent); // 부모 객체를 Scene에 추가

const child = new THREE.Mesh(
  new THREE.BoxGeometry(),
  new THREE.MeshBasicMaterial({ color: 0x00ff00 })
); // 자식 객체 생성
parent.add(child); // 자식 객체를 부모 객체에 추가

```
### <div style="background:#FFFFCC; color:black; padding:7px"> Scene graph의 주요 내용</div>


### `1) 장면 (Scene) : 3D객체들이 추가되는 최상위 컨테이너`
scene은 씬그래프의 최상위 컨테이너로 3D객체들을 담고 있는 공간이다. <br/>
모든 3D객체는 이 Scene에 추가되어야 화면에 보이게 된다.

```js
const scene = new THREE.Scene();
```
### `2) 객체(Object 3D) : 모든 3D객체의 기본 요소`

Three.js에서 3D객체들은 모두 Object3D를 상속받는다. `Object3D`는 모든 3D객체가 가져야 하는 위치(position), 회전(Rotation), 크기(Scale)속성을 포함하고 있어서
어떤 3D객체도 이 특성을 가질 수 있게 한다.

예를 들어, Object3D는 모든 3D객체가 가져야할 기본뼈대이다.
Mesh,Camera같은 구체적인 객체는 Object3D를 통해 이 뼈대를 물려받는다.

```js
const cube = new THREE.Mesh(geometry, material); // Mesh도 Object3D를 상속
cube.position.set(1, 1, 1); // 위치를 조정할 수 있는 이유는 Object3D를 상속했기 때문이다.
scene.add(cube); // Scene에 추가하면 화면에 나타남
```

### `3) 부모-자식 관계: 부모의 변형이 자식에게 자동 적용된다.`
부모-자식 관계란 한 객체가 다른 객체에 속하는 구조를 의미한다. 부모 객체가 이동하거나 회전하면 자식 객체도 그 변형에 따라 자동으로 움직인다.<br/>
이렇게 부모-자식 관계를 설정하면, 복잡한 구조를 단순하게 표현할 수 있다.

코드 예시를 보면, 부모가 움직이면 자식도 자동으로 움직인다.
```js
const parent = new THREE.Object3D(); // 부모 객체 생성
scene.add(parent); // 부모를 Scene에 추가

const child = new THREE.Mesh(geometry, material); // 자식 객체 생성
parent.add(child); // 자식을 부모 객체에 추가

// 부모가 움직이면 자식도 자동으로 함께 움직임
parent.position.set(1, 1, 0);
```
### `4) 좌표계 변환: 각 객체는 자신의 좌표계에서 변환`
모든 객체는 자신만의 좌표계를 가지고 있다. 부모 객체가 변형되더라도 자식 객체는 자신의 좌표계에서 이동,회전,크기 변환을 할 수 있다.
이런 개념을 `좌표계 변환`이라고 하며, 개별 객체들이 자신의 좌표계를 기준으로 자유롭게 변형될 수 있다.
각각의 객체가 자율적으로 움직일 수 있는 작은 무대를 가지고 있는 것이지만, 부모의 무대(좌표계)가 이동하면, 자식의 무대도 함께 이동하는 개념이다.

### `5)트래버설(순회): 씬의 모든 객체를 순회하며 렌더링`
트래버설은 Scene내에 있는 모든 객체들을 차례대로 방문하는 과정이다. <br/>
Three.js는 Scene graph에 있는 객체들을 트리 구조로 관리하기에, 순회를 통해 모든 객체를 빠짐없이 확인하고, 필요한 경우 객체를 화면에 그려준다.


### <div style="background:#FFFFCC; color:black; padding:7px"> Scene graph 예제 코드</div>

```js
// 중앙 구체 생성
const centralSphere = new THREE.Mesh(
  new THREE.SphereGeometry(0.5, 32, 32),
  new THREE.MeshBasicMaterial({ color: 0xffaa00 })
);
scene.add(centralSphere);

// 위성 구체 생성
const satellite = new THREE.Object3D();
satellite.position.x = 2; // 위성을 중앙 구체에서 일정 거리 떨어뜨림
centralSphere.add(satellite);

const satelliteMesh = new THREE.Mesh(
  new THREE.SphereGeometry(0.2, 32, 32),
  new THREE.MeshBasicMaterial({ color: 0x00aaff })
);
satellite.add(satelliteMesh);


function animate() {
  requestAnimationFrame(animate);

  // 중앙 구체 자체를 회전
  centralSphere.rotation.y += 0.01;

  // 위성 구체가 중앙 구체 주위를 공전하게 함
  satellite.rotation.z += 0.05;

  renderer.render(scene, camera);
}
animate();

```
<img src="https://velog.velcdn.com/images/chloeee/post/a6e015be-02d8-456d-a34d-6e87570d4eb3/image.gif" alt="img" width="500px" height="400px"  />

이 예제에서 centralSphere는 자전하며 회전하고, satellite는 centralSphere를 중심으로 공전한다.<br/>
이를 통해 부모-자식 관계가 중심 객체와 주위를 도는 객체의 움직임을 쉽게 표현할 수 있다는 것을 알 수 있다.


### 참고
- https://threejs.org/manual/#ko/scenegraph
- three.js journey강의