---
title: <Three.js journey> Animations
date: 2023-06-03 16:06:49
category: three.js
thumbnail: { thumbnailSrc }
draft: false
image: 'https://velog.velcdn.com/images/chloeee/post/c9eb947c-a3c0-4288-83f3-857c3c2bcc22/image.png'

---


> Three.js journey 강의를 듣고 공부한 것들을 기록합니다.

<p align="center">
<img src="https://velog.velcdn.com/images/chloeee/post/c9eb947c-a3c0-4288-83f3-857c3c2bcc22/image.png" width="550px" height="390px"  >
</p>

### Animations

Three.js에서의 Animation은 stop motion같습니다.
예를 들면 물체를 옮기고 렌더를 하고, 그 다음 또 물체를 옮기고 다른 렌더를 하는 방식으로 진행되기 때문입니다.<br/>
각 프레임마다 렌더를 하고 물체를 업데이트 해야 하는데, 이는 `window.requestAnimationFrame` 메서드를 이용해 할 수 있습니다.
requestAnimationFrame의 목적은 제공된 다음 프레임에 함수를 호출하기 위함입니다.<br/>


### Adaptation to the framerate

프레임속도에 맞게 animation을 적용시키려면, 지난 tick이랑 비교했을 때 얼마나 많은 시간을 소요로 했는지 알아야 합니다. <br/>
첫번째, 시간을 측정해야 합니다. `Date.now()`를 사용해 현재 시간을 얻을 수 있습니다.
현재 시간에 이전 시간을 뺀 `deltaTime`을 이용해 물체를 animating할 수 있습니다.


```js
let time = Date.now();
const tick = () =>{
    //Time
    const currentTime = Date.now()
    // 이전 타임을 빼서 delta time을 구할 수 있다. 이는 animation에 사용할 수 있다.
    const deltaTime = currentTime - time
    time = currentTime
    console.log(deltaTime)
    
    //update objects
    mesh.position.x += 0.01
    mesh.rotation.y += 0.02 * deltaTime
    
    //render
    renderer.render(scene,camera)
    
    //next frame에 호출된다.
    window.requestAnimationFrame(tick)
}

tick();
```

### Using Clock

위에 방법보다 더 쉽게 할 수 있는 방법이 있습니다.
Three.js에는 `Clock`이라는 빌트인 솔루션이 있는데, 타임 계산을 다루는 역할을 합니다.

```js
//Clock
const clock = new THREE.Clock()

//Animations

const tick = () =>{
    //Clock
    const elapsedTime = clock.getElapsedTime()
    mesh.rotation.y = Math.sin(elapsedTime)
    //카메라가 mesh를 바라보게 한다.
    camera.lookAt(mesh.position)
    
}
```
getElapsedTime() 은 Clock이 만들어진 이후로 얼마나 많은 second가 지났는지 리턴을 할 수 있습니다.
`position`프로퍼티를 이용해 움직이는 것도 가능합니다. `Math.sin`을 이용하면 up down으로 가볍게 이동합니다.                   
`Math.cos`를 이용하면 물체가 circle을 만들며 이동합니다.

### Using a Library

#### GSAP
scene을 특정한 방법으로 animate하기 위해 library를 사용하는 방법이 있습니다.
여러가지가 있지만 GSAP가 가장 유명합니다.
`npm install --save gsap@3.5.1` 터미널에 실행을 하고나면 import해서 아래같이 사용할 수 있습니다.
gsap.to(...)를 사용하면 테스트를 위한 쌍둥이를 만들 수 있게 되는데요. 트윈 (Animation A에서 B까지) 를 호출해 사용할 수 있습니다.
```js
import gsap from 'gsap'

gsap.to(mesh.position, {duration:1, delay:1, x:2 } )
```
GSAP에는 내장된 `requestAnimationFrame`을 가지고 있기에 매번 animation을 업데이트 하지 않아도 됩니다.
그래도, 각 프레임마다 물체가 움직이는 것을 보고 싶다면 scene에서 render하는 것은 계속해야합니다.

### Choosing the Right solution
위의 예시에서처럼 native js를 사용하는 것과 animation 라이브러리를 사용하는 방법이 있습니다.
무엇을 선택하든 상관이 없습니다. 선호하는 방식을 선택하면 됩니다.

### 마치며 

three.js에서 간단하게 animation하는 방법에 대해 알아보았습니다.
간단하게 강의를 들었을 때는 쉽게 되는 것 같지만 (?), 실제 프로젝트로 들어가면 더 어려울 것도 같네요.
미래를 위해 조금씩이라도 꾸준히 three.js를 공부해보려고 합니다. :-)