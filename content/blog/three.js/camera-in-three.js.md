---
title: Three.js에서의 카메라 이해하기
date: 2024-11-09 15:11:16
category: three.js
thumbnail: { thumbnailSrc }
image: 'https://velog.velcdn.com/images/chloeee/post/c9eb947c-a3c0-4288-83f3-857c3c2bcc22/image.png'
draft: false
---
### Intro
three.js스터디에 참가하며 공부하고 있다. 이번엔 Three.js의 3가지 기본 요소 중 하나인 카메라에 대해 공부해보았다.

### <div style="background:#FCF475; color:black; padding:7px"> 1. 카메라의 역할과 중요성에 대하여 </div>

3D 환경에서 카메라는 사용자가 보는 시점과 전체적인 시각적 경험을 결정하는 중요한 요소이다.<br/>
3D 세계를 어떻게 관찰하고 탐험할지를 정의하기에 카메라는 3D렌더링에 있어서 핵심적인 역할을 한다.<br/>
카메라의 위치와 방향을 조정하여 3D 공간에서의 특정 객체에 포커스를 맞추거나 특정 장면을 강조할 수 있다.

### <div style="background:#FCF475; color:black; padding:7px"> 2. 카메라 종류  </div>
Three.js에서는 대표적으로 `PerspectiveCamera`와 `OrthographicCamera를 사용한다.

`PerspectiveCamera`
- 원근법이 적용된 카메라로, 멀리 있는 물체는 작게 보이고 가까이 있는 물체는 크게 보이도록 렌더링된다.
- 실제 인간의 시각과 가장 유사하다. 주로 현실적인 3D환경을 표현할 때 많이 사용된다.

 <p align="center">
<img src="https://velog.velcdn.com/images/chloeee/post/75cb2a6a-3113-40b5-a5a5-c885533cadea/image.png" width="500px" height="390px"  >
</p>

- perspective camera에는 4개의 파라미터가 있다.
```js
const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
```
- **FOV**: 시야각이 넓을수록 장면이 더 넓게 보이고, 좁을수록 더 집중된 시점이 된다. 시야각을 조절해 사용자에게 원하는 연출을 제공할 수 있다.

(참고: https://www.youtube.com/watch?v=qe3mahuoYlw)

 <p style="display:flex; gap:10px; width:100%">
<img src="https://velog.velcdn.com/images/chloeee/post/a34dadcd-9e04-43a5-a4d4-ff657312779d/image.png" width="500px" height="390px"  >
<img src="https://velog.velcdn.com/images/chloeee/post/d6a3e842-6bbf-4b10-9d3f-2c44eee7a77a/image.png" width="500px" height="390px"  >
</p>

- **Aspect Ratio**: 화면의 가로 세로 비율로, 보통 `window.innerWidth / window.innerHeight` 값을 사용해 설정한다.
- **Near/Far** : 카메라가 인식할 수 있는 거리 범위를 결정한다. Near와 Far의 차이가 클수록 더 많은 장면을 렌더링할 수 있지만, 성능에 영향을 줄 수 있다.

```js

camera.position.x = 0.4 // 카메라가 오른쪽으로 가기에 물체는 왼쪽으로 간다.
camera.position.x =0 //카메라가 가운데
camera.position.x = -0.4 //카메라가 왼쪽으로 가기에 물체는 오른쪽으로 간다.

camera.position.y=0.5 카메라가 위로 가기에 물체는 아래로 내려간다.
camera.position.y = -0.5 // 카메라가 아래로 내려가기에 물체는 위로 간다.

camera.position.z = 10 카메라가 뒤에 있어서 물체가 작아 보인다.
camera.position.z = -1 카메라가 물체 뒤에 있어서, 물체가 안보인다.


const fov = 75; // 시야각(Field of View)
const aspect = window.innerWidth / window.innerHeight; // 종횡비
const near = 0.1; // 카메라가 인식할 수 있는 가장 가까운 거리
const far = 1000; // 카메라가 인식할 수 있는 가장 먼 거리
const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
camera.position.set(0, 0, 10); // 카메라의 위치 설정
```

`Orthographic Camera`
- 정투영 카메라로, 이 카메라는 원근감이 없고 모든 객체가 동일한 크기로 보인다.
- 주로 **2D 장면이나 UI** 혹은 건축 시각화처럼 일정한 비율이 중요한 경우 표현할 때 사용한다.

```js
const camera = new THREE.OrthographicCamera(left, right, top, bottom, near, far);
```
 <p align="center">
<img src="https://velog.velcdn.com/images/chloeee/post/44194ea1-3e4d-4a98-aa00-efa781561c96/image.png" width="500px" height="390px"  >
</p>

```js

const aspect = window.innerWidth / window.innerHeight;
const cameraSize = 10;

const camera = new THREE.OrthographicCamera(-cameraSize  * 5, cameraSize  * 5, cameraSize , -cameraSize , 0.1, 1000);
camera.position.set(0, 0, 10); // 카메라 위치 설정
camera.lookAt(0, 0, 0); // 카메라가 바라보는 지점 설정

```

- OrthographicCamera는 설정할 때  뷰포트의 종횡비(aspect)를 고려하여 좌우(-left/right)와 상하(-top/bottom)의 범위를 설정한다.
- `cameraSize`는 카메라의 줌에 해당하는 역할을 한다. 값을 작게 설정할수록 확대되고, 크게 설정할수록 시야 범위가 넓어진다.

### <div style="background:#FCF475; color:black; padding:7px"> 3. 카메라 설정과 조정하기 </div>
카메라의 위치와 방향을 조정하여 원하는 장면을 연출할 수 있다.<br/>
Three.js에서는 카메라의 `position`, `rotation`, `lookAt` 메서드를 사용해 카메라의 위치와 방향을 지정할 수 있다.

#### 카메라 위치설정 `camera.position`

- 카메라 위치는 `camera.position.set(x, y, z)`를 통해 설정한다.
```js
camera.position.set(5, 5, 10); // 카메라를 오른쪽 위, 먼 곳으로 이동
```

#### 카메라 회전  `camera.rotation`

- 카메라 회전은 카메라가 x,y,z축 중 어느 방향을 바라볼지 결정한다.
- 각 축에 대한 회전은 `rotation.x`, `rotation.y`, `rotation.z`로 개별 설정이 가능하다.
  
`x축 회전 : 위아래로 바라보는 각도를 조절 (pitching)`

<img src='https://velog.velcdn.com/images/chloeee/post/710eeb7f-de45-4aa4-a782-acc71bd2633e/image.gif' alt='pitching' />

`y축 회전 : 좌우로 바라보는 각도를 조절 (yawing)`

<img src='https://velog.velcdn.com/images/chloeee/post/f2dfabb1-31a9-4672-afa6-2c6fcc7100b8/image.gif' alt='pitching' />

`z축 회전 : 카메라가 뒤집어지는 각도를 조절 ( rolling)`

<img src='https://velog.velcdn.com/images/chloeee/post/d2876d8e-db89-4b3a-9839-fa2480acf6f1/image.gif' alt='pitching' />

(참고: 네이버 블로그 | Can't you fill my Heart? Yaw Pitch Roll 정의)

```js
camera.rotation.x = Math.PI / 4; // x축 기준 45도 회전
camera.rotation.y = Math.PI / 6; // y축 기준 30도 회전
```

#### 카메라 방향 설정 `camera.lookAt`

```js
const target = new THREE.Vector3(0, 0, 0); // 바라볼 지점 설정
camera.lookAt(target); // 카메라가 해당 위치를 바라보도록 설정
```
- 특정 지점을 바라보게 하려면 `camera.lookAt(x, y, z)`를 사용하여 카메라의 시선 방향을 지정할 수 있다
1. `camera.lookAt(x, y, z)` 형태로 좌표를 직접 입력
- 이 형태는 `x`, `y`, `z` 값으로 직접 카메라가 바라볼 좌표를 지정하는 방식
- 카메라의 시점이 `x, y, z` 좌표로 향하게 된다.

```js
camera.lookAt(0, 0, 0);
```
2. `camera.lookAt(vector3)` 형태로 `Vector3` 객체를 입력
- THREE.Vector3 객체를 사용해도 동일한 효과를 얻을 수 있다.
- `Vector3`는 3D 공간의 좌표를 나타내는 객체이므로 이를 통해 보다 유연하게 좌표를 지정할 수 있다.

```js
const target = new THREE.Vector3(0, 0, 0); // 바라볼 지점 설정
camera.lookAt(target); // 카메라가 해당 위치를 바라보도록 설정
```

### 참고 사항

- Three.js에서 카메라의 `rotation`은 직접 조작하기보다는 `lookAt` 메서드를 사용해 특정 지점을 바라보도록 설정하는 경우가 많다.
- `camera.rotation`은 카메라의 방향을 수동으로 조절할 때 쓰고, `camera.lookAt()`은 카메라가 특정 지점을 바라보게 설정할 때 유용하다.

### <div style="background:#FCF475; color:black; padding:7px"> 4. axes helper </div>
- Three.js에서 씬(scene) 내에서 X, Y, Z 축을 시각적으로 표시해 주는 도구
- 녹색: y축 / 빨간색:x축 / 파란색:z축
 <p align="center">
<img src="https://velog.velcdn.com/images/chloeee/post/dd360385-65a3-47e5-840c-8c557f4b6183/image.png" width="500px" height="390px"  >
</p>

### 언제 유용할까?

- 씬에서 **객체가 어느 방향을 보고 있는지** 확인할 때.
- **객체의 위치나 회전**을 조정할 때 기준을 삼기 위해.
- 3D 공간에서의 **기본 좌표계**를 시각적으로 인식하고 싶을 때.

```js
const axesHelper = new THREE.AxesHelper();
scene.add(axesHelper)
```

### <div style="background:#FCF475; color:black; padding:7px"> 5.카메라 애니메이션 </div>
- 카메라에 애니메이션 효과를 주어 움직임이나 회전 등의 동적 변화를 쉽게 줄 수 있다.

`기본 카메라 이동 애니메이션`
- requestAnimationFrame으로 카메라의 위치를 부드럽게 이동시킬 수 있다.
```js

function animateCamera() {
    requestAnimationFrame(animateCamera);
    camera.position.x += 0.05; // 카메라를 오른쪽으로 이동
    camera.lookAt(new THREE.Vector3(0, 0, 0)); // 특정 지점을 계속 바라보게 함
    renderer.render(scene, camera); // 씬 렌더링
}
animateCamera();
```
`camera.position.x`를 점진적으로 증가시키면서 카메라가 왼쪽에서 오른쪽으로 이동한다. <br/>
이때, 카메라가 씬의 특정 지점만을 바라보도록 `lookAt`을 설정하여 객체가 고정된 상태로 보이는 효과를 준다.

### **`GSAP을 사용한 부드러운 애니메이션`**

- GSAP 라이브러리(자바스크립트 애니메이션라이브러리) 를 사용하면 `fromTo`, `to`, `timeline` 등을 활용해 더 쉽게 부드러운 애니메이션을 추가할 수 있다.

### <div style="background:#FCF475; color:black; padding:7px"> 6. 카메라와 상호작용 </div>
Three.js는 카메라와 상호작용할 수 있는 다양한 방법을 제공한다.
마우스나 키보드 이벤트를 통해 카메라의 움직임을 제어할 수 있으며, 이를 통해 **유저가 직접 시점을 조작**할 수 있도록 할 수 있다.

### `OrbitControls - 가장 기본적이고 있기 있는 카메라 컨트롤`
- **OrbitControls**: 마우스를 사용해 카메라를 회전, 확대 및 이동할 수 있는 컨트롤이다. 마우스로 장면을 둘러보거나 줌 인/아웃이 필요할 때 유용하다
- 일반적으로 씬의 특정 객체나 중심점 주위를 돌며 보기 좋기 때문에 가장 많이 사용된다.
  ex) three.js examples
```js
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; // 부드러운 움직임을 추가
```
- OrbitControls는 `enableZoom`, `enablePan`, `maxPolarAngle`과 같은 다양한 옵션을 제공하여 카메라 조작을 세부적으로 설정할 수 있다.
- `enableDamping`을 활성화하면 움직임이 부드러워져 사용자가 조작할 때 더 자연스러운 효과를 준다.

### `Fly Controls`

ex) https://threejs.org/examples/?q=Fly#misc_controls_fly

- 1인칭 시점처럼 사용자가 **자유롭게 공간을 이동**할 수 있게 한다.
- 방향키나 마우스를 사용해 특정 방향으로 전진하거나 회전할 수 있으며, 3D 게임의 이동과 유사하다.
- 복잡한 3D 장면 내부를 자유롭게 탐색할 때 유용하다.

### `DragContorls`

ex) https://threejs.org/examples/?q=Drag#misc_controls_drag

- 사용자가 마우스로 **장면의 객체를 드래그하여 이동**할 수 있게 한다.
- 객체를 선택하여 위치를 변경할 수 있으므로, 인터랙티브한 3D UI나 시뮬레이션에 유용하다.

### `마우스 이벤트`

마우스 이동에 따라 카메라의 위치를 동적으로 조정할 수 있습니다.

```jsx

window.addEventListener('mousemove', (event) => {
    const x = (event.clientX / window.innerWidth) * 2 - 1;
    const y = -(event.clientY / window.innerHeight) * 2 + 1;
    camera.position.x = x * 10;
    camera.position.y = y * 10;
    camera.lookAt(scene.position);
});

```

### 참고
- three.js journey강의