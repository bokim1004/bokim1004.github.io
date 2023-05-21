---
title:  <Three.js journey>  transform objects
date: 2023-05-20 15:05:28
category: three.js
thumbnail: { thumbnailSrc }
draft: false
image: 'https://velog.velcdn.com/images/chloeee/post/c9eb947c-a3c0-4288-83f3-857c3c2bcc22/image.png'
---

> Three.js journey 강의를 듣고 공부한 것들을 기록합니다.

 <p align="center">
<img src="https://velog.velcdn.com/images/chloeee/post/c9eb947c-a3c0-4288-83f3-857c3c2bcc22/image.png" width="550px" height="390px"  >
</p>

### Transform objects

scene을 animation하기 앞서, scene에서 어떻게 물체들을 변형시킬 수 있는지 알아야합니다.
scene에서 물체를 변경시키기 위한 4가지 프로퍼티들이 있습니다.

1. position (물체를 움직일 때)
2. scale(크기를 조정할 때)
3. rotation(물체를 회전시킬 때)
4. quaternion(또한 물체를 회전시킬 때)


### To move Object

`position`은 3개의 필수적인 프로퍼티들을 가지고 있습니다.
바로 `x,y,z`인데, 이는 3D 스페이스에서 무언가를 위치시키기 위한 3개의 중요한 축입니다.
Three.js에서는 `y축`은 위로 가는 것이고, `z축`은 뒤로 가는 것, `x축`은 오른쪽으로 가는 것입니다.

1 unit의 의미는 개발하는 사람에게 달려있습니다. 1은 1 centimeter일수도, 1 meter,또는 1 kilometer일 수도 있습니다.
무엇을 만들지에 따라 unit을 그에 맞게 적용하면 됩니다. 만약 집을 만든다면  1unit은 1 meter로 생각하는 것이 좋습니다.
mesh에 포지션 프로퍼티를 추가하여, 만든 큐브가 어디로 갈지 정할 수 있습니다.

```js
const geometry = new THREE.BoxGeometry(1,1,1)
const meterial = new THREE.MeshBasicMeterial({color:0xff0000})
const mesh = new THREE.Mesh(geometry,material)
mesh.position.x=0.7
mesh.position.y =-0.6
mesh.position.z=3
scene.add(mesh)

```
 <p align="center">
<img src="https://velog.velcdn.com/images/chloeee/post/ec66df05-f796-4d0e-b36a-adb23e36ca12/image.png
" width="550px" height="390px"  />
</p>
항상 기억해야한다는 것은 render 메서드 전에 호출해야한다는 것입니다. 
그렇지 않으면 object를 움직이기 전에 mesh가 render되게 됩니다.

`position`프로퍼티는 `Vector3`클래스의 인스턴스입니다. 
이 클래스는 x,y,z 프로퍼티를 갖고 또한 많은 유용한 메서드를 가지고 있습니다.
```js
//scene의 센터와 object의 위치를 계산하고 싶다면 아래처럼 콘솔을 찍어보면 됩니다.
console.log(mesh.position.length())
```
object와 카메라 사이 거리도 아래코드를 사용하면 구할 수 있습니다. 카메라 코드 아래 작성이 되어야 합니다.

```js
console.log(mesh.position.distanceTo(camera.position))
```

그리고 값을 normalize할 수 있습니다.
이것의 의미는 멀리있는 vector에서 1unit으로 길이를 줄일 수 있다는 것입니다.
```js
console.log(mesh.positon.normalize())
```

value를 변경하기 위해서는 x,y,z를 각각 사용해도 되지만, set 메서드를 이용해 사용할 수도 있습니다.

```js
mesh.position.set(0.7,-0.6,1)
```

### AxesHelper

공간에서 positioning을 하는 것은 매우 어려운 일입니다.
이때,축에 line이 생기게 하는 AxesHelper를 사용하면 매우 좋은 솔루션이 됩니다.
```js
const axesHelper = new THREE.AxesHelper(2)
scene.add(axesHelper)
```
 <p align="center">
<img src="https://velog.velcdn.com/images/chloeee/post/c38b6e36-29c5-4a77-919a-4e0e8910bd0a/image.png
" width="550px" height="390px"  />
</p>
위 이미지에서 보면 green line은 y축을 의미하고 red line은 x축을 의미합니다. blue line에 해당하는 z축은 완벽하게 카메라와 얼라인된 상태기에
볼 수 없습니다.

### Scale Object
scale또한 `Vector3`입니다. 기본값으로 x,y,z는 1과 동일합니다. 이는 object에 아무런 scale이 적용되지 않았음을 의미합니다.
0.5를 value로 넣으면 object는 축에서 사이즈의 절반이될 것이고 2를 value로 넣으면 축에서 2배의 사이즈로 될 것입니다.

```js
mesh.scale.x = 2
mesh.scale.y = 0.25
mesh.scale.z = 0.5
```

### Rotate Object

Rotation을 다루는 방법에는 2가지가 있습니다.
말 그대로 많이 알려진 `rotation`프로퍼티를 사용하는 것이고 또 다른 방법으론 `quternion`프로퍼티를 사용하는 것입니다.
`rotation`프로퍼티는 x,y,z 프로퍼티들을 가집니다. 그러나 Vector3 대신 `Euler`입니다.
Euler의 프로퍼티인 x,y,z를 변경하는 것은 object의 가운데에 stick을 넣고 이 stick에 object를 돌린다고 생각하면 됩니다.

- `y축`을 돌리는 것은 carousel과 비슷한 것이라고 생각하면 됩니다.
- `x축`을 돌리는 것은 차의 바퀴가 돌아가는 것과 같은 것이라고 생각하면 됩니다.
- `z축`을 돌리는 것은 비행기 propeller가 회전하는 것과 같은 것이라고 생각하면 됩니다.

```js
mesh.rotation.x = Math.PI * 0.25
mesh.rotation.y = Math.PI * 0.25
```
그러나, 이렇게 rotation을 섞어 쓰면, 이상한 결과를 만나게 될 수도 있습니다.
왜일까요? x축을 회전하는 동안, 다른 축의 orientaion을 변경할 수 있기 때문입니다.
rotaion은 x,y,z 이 순서대로 적용이 됩니다.
이는 axis가 더이상 동작하지 않는, `gimbal lock`이라는 이상한 결과를 주기도 합니다.

이 rotation순서는`reorder`메서드를 사용하여 변경될 수 있습니다.
```js
mesh.rotation.reorder('YXZ')
mesh.rotation.x = Math.PI * 0.25
mesh.rotation.y = Math.PI * 0.25
```
Euler는 이해하기 쉬운 반면, order 문제가 있을 수 있습니다.
그래서 많은 엔진, 3D소프트웨어에서 다른 솔루션인 `Quternion`을 사용하는 이유입니다.

### Quternion

`Quternion`프로퍼티는 rotation을 할 수 있게 하나 order 문제를 해결하기 위한 더 수학적인 방법입니다.
그렇기에 이는 `rotation`보다 더 이해하기 어렵습니다.

### Look at this!

`object3D`인스턴스는 `lookAt`이라고 불리는 메서드가 있습니다.
이것을 사용하면 -z가 제공한 타겟을 마주할 수 있게 object가 자동적으로 회전합니다.
파라미터에 넣은 값이 타겟이며 이 타겟은 `Vector3`여야 합니다.

```js
camera.lookAt(new THREE.Vector3(0, - 1, 0))
```

### Combining Transformations

`position`,`rotation`,`scale` 혼합하여 사용할 수 있습니다.

```js
mesh.position.x = 0.7
mesh.position.y = - 0.6
mesh.position.z = 1
mesh.scale.x = 2
mesh.scale.y = 0.25
mesh.scale.z = 0.5
mesh.rotation.x = Math.PI * 0.25
mesh.rotation.y = Math.PI * 0.25
```

 <p align="center">
<img src="https://velog.velcdn.com/images/chloeee/post/ef2e8530-bc13-4e32-9df0-b15d943561e7/image.png
" width="550px" height="390px"  />
</p>

### Scene graph

 벽과 문,창문,지붕등과 함께 집을 짓는다고 해봅시다.
 집을 다 만들었는데 집이 너무 작다면, 각 object를 re-scale하고 position또한 업데이트해야할 것입니다.
 이 때, 모든 object를 한 컨테이너에 그룹화하여 하면 좋은 대안이 될 것입니다.
 이것을 하기 위해서 `Group`클래스를 사용할 수 있습니다.

 ```js

const cube1 = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshBasicMaterial({ color: 0xff0000 })
)

group.add(cube1)

const cube2 = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshBasicMaterial({ color: 0x00ff00 })
)
cube2.position.x = -2
group.add(cube2)

const cube3 = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshBasicMaterial({ color: 0x0000ff })
)
cube3.position.x = 2
group.add(cube3)
```
 <p align="center">
<img src="https://velog.velcdn.com/images/chloeee/post/4a78977c-f161-422c-a35d-fc6a3d5c94b9/image.png
" width="550px" height="390px"  />
</p>

```js
 const group = new THREE.Group()
group.position.y=1
group.scale.y = 2
group.rotation.y = 0.2
scene.add(group)
```
위와 같이 그룹을 추가해주면 아래같이 변경된다.

 <p align="center">
<img src="https://velog.velcdn.com/images/chloeee/post/2083c0cb-c444-41ce-8c90-db83e1c76fe8/image.png
" width="550px" height="390px"  />
</p>

### 마치며

이번에는 object의 위치를 변경하고 rotation하는 방법에 대해 알아보았습니다.
강의를 들으며 아직 이해하기 어렵고 복잡하다고 느낀 부분들이 있는데요.
나중에 복습을 하며 더 공부가 필요할 것 같네요 !-!
