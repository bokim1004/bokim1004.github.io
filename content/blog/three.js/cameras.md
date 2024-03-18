---
title: Three.js journey | Cameras
date: 2023-06-19 22:06:65
category: three.js
thumbnail: { thumbnailSrc }
draft: false
image: 'https://velog.velcdn.com/images/chloeee/post/c9eb947c-a3c0-4288-83f3-857c3c2bcc22/image.png'
---

> Three.js journey 강의를 듣고 공부한 것들을 기록합니다.

 <p align="center">
<img src="https://velog.velcdn.com/images/chloeee/post/c9eb947c-a3c0-4288-83f3-857c3c2bcc22/image.png" width="400px" height="330px"  >
</p>


### Three.js 카메라 종류

### 1. Camera
카메라는 `abstract class로 직접적으로 사용되지는 않습니다.

### 2. Array Camera
`ArrayCamera`는 특정 area에서, 여러개의 카메라에서 scene을 렌더할 때 사용됩니다.
각 카메라는 canvas의 특정 area를 렌더할 것입니다.


### 3. Stereo Camera
`StereoCamera`는 눈과 비슷합니다. 2개의 카메라를 통해 scene을 렌더합니다. 왼쪽 눈은 특정 1개의 카메라를 볼 때 오른 쪽 눈은 다른 특정 1개의 카메라를 봅니다. 이 2개의 카메라를 통해 Scene을 렌더합니다.
VR 헤드셋 같은 디바이스를 사용할 때 사용됩니다.


### 4.Cube Camera
6개 render(forward, backward, leftward, rightward, upward, and downward) 를 하며 각각 다른 방향을 마주합니다. 이는 환경 map이나 shadow, reflection같은 것을 렌더할 수 있습니다.

### 5. Orthographic Camera

카메라 거리에 상관없이 scene을 렌더할 수 있습니다. 
캐릭터가 멀리 가도 크기는 항상 동일함을 유지하게 합니다.<br/>
이는 2D Scene이나 UI elements를 렌더할 때 사용될 수 있습니다.
`Orthographic Camera`는 `Perspective Camera`보다 perspective가 부족하다는 점이 다릅니다.
물체는 카메라의 거리에 상관없이 항상 같은 사이즈를 가집니다.
```js
const camera = new THREE.OrthographicCamera(-1,1,1,-1,0.1,100)
```
parameter값은 각 방향에서(left,right,top,bottom) 얼마나 먼 거리에 있는 카메라가 볼 수 있는지에 대한 값을 제공합니다.



### 6. Perspective Camera
인간의 눈이 이동하는 방향대로 렌더가 될 수 있습니다. 이는 3D Scene에서 제일 많이 사용됩니다.
```javascript
const camera = new Three.PersepectiveCamera(75,sizes.width/sizes.height,1,1000)
```
첫번 째 parameter에 있는 값은 `Field of view`입니다.
이는 각도이고 수직의 vision angle을 뜻합니다. 75를 가장 추천합니다.

두번 째 parameter값은 `Aspect Ratio`입니다.
render가 되는 부분의 height에서 width를 나눈 값입니다.

세번째,네번째 parameter값은 near,far라고 불립니다. 얼마나 가까이 있는 그리고 멀리있는 카메라가 물체를 볼 수 있는지에 대한 값과 상응합니다.

`0.0001`이나 `999999` 같이 극단적인 값은 z-fighting을 방지하기 위해 사용하지 않는 것이 좋다고 합니다.

#### Cursor

const cursor= {
x:0,
y:0
}

window.addEventListner('mousemove',(event) =>{
// -0.5붙이면 render화면에서 -0.5에서 0.5까지 값이 나온다.
cursor.x = event.clientX /sizes.width - 0.5
cursor.y= -(event.clientY/sizes.height -0.5)
})
// 콘솔찍어보면 커서위치를 확인할 수 있다.

cursor coordinates로 tick function안에 camera position을 업데이트 할 수 있습니다.

```js
const tick = () =>{
    
    //update camera
    //커서를 움직일 때마다 카메라가 업데이트 되므로 물체가 커서따라 움직인다.
    camera.position.x = cursor.x *3
    camera.position.y = cursor.y *3
    camera.lookAt(mesh.position)
}
```

### Built-in controls

three.js 문서를 보면 많은 controls들을 확인할 수 있습니다.

1) Device Orientation Controls
이것은 OS,브러우저가 허용하면 디바이스의 방향을 자동적으로 찾고 카메라를 회전하게 합니다.
immersive universe, VR같은 것에 사용될 수 있습니다.
ios는 지원을 중단했다고 합니다.

2) Fly Controls
우주에 있는 것처럼 카메라를 움직일 수 있습니다. 3개의 축 모두  앞뒤 회전이 가능합니다.

3) First Person Controls
이것은 Fly controls와 비슷하지만 축을 고정한다는 점이 다릅니다. (upside down이 안됩니다.)

4) Pointer Lock Controls
이것은 javascript API인 pointer lock을 사용합니다. <br/>
이 API는 cursor를 감추고 중앙에 유지하여 Mousemove 이벤트 콜백에서 움직임을 보냅니다.
이 API를 사용하면 브라우저내에서 바로 FPS 게임을 만들 수 있습니다.

5) Orbit Controls
orbit controls은 매우 간단하고 쉽습니다.
왼쪽 마우스로 한 지점을 회전하고 오른쪽으로는 옆으로 이동하고, 휠을 사용하여 확대 또는 축소할 수 있습니다.

6) Trackball Controls

Trackball Controls는 orbit contorls와 비슷하지만  수직 각도에 제한이 없습니다. 장면이 거꾸로 되더라도 계속 회전할 수 있습니다.


### 마치며

이번엔 three.js에서 사용되는 카메라의 종류와 control 종류에 대해 알아보았는데요.
실제 예시 영상을 보면서 각 카메라들이 어떻게 동작을 하는지 알 수 있어서 좋았습니다!
강의를 하시는 분이 주로 사용하시는 카메라를 접하게 될 것 같긴 하지만, 
나중에 three.js문서를 보며 더 깊이있는 공부를 해야할 것 같네요-!