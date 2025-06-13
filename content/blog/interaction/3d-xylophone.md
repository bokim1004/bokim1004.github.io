---
title: 3D xylophone 만들기
date: 2025-06-12 18:06:14
category: interaction
thumbnail: { thumbnailSrc }
draft: false
image: 'https://velog.velcdn.com/images/chloeee/post/ffefdfe8-2d64-4b9f-8742-d559bb0be436/image.png'
---

난 거의 매일 꿈을 꾸는데, 꿈 속에서 은색의 실로폰을 봤다.
하나 하나 눌러보면 소리가 나는 악기였는데, 이 장면이 너무 인상적이어서 웹으로 한번 만들어보면 좋겠다는 생각이 들었다.
3D로 개발하고 싶어서 Three.js를 사용하려고 했는데 이번엔 react-three-fiber를 사용해서 개발해봤다.

### 🛠 사용한 기술 스택

- React + @react-three/fiber
- @react-three/drei (Text3D, OrbitControls)
- @react-spring/three (실로폰 눌리는 애니메이션 시 사용)
- HTML5 Audio API (소리 재생)
- Framer Motion (텍스트 애니메이션)

## 실제 구현한 부분

### 1. 맨 처음 들어오면 보이는 intro 화면 만들기

 <p style="display:flex; gap:10px; width:100%">
<img src="https://velog.velcdn.com/images/chloeee/post/5901c8a6-e761-4c4e-a4d2-7041b8fa3929/image.png" width="550px" height="390px"  >
</p>

react-three/drei의 `Text3D`를 사용해 Xylophone 글자를 3D로 보이게 표현했다.<br/>
그리고 react-spring/three를 활용해, 3D 텍스트가 오른쪽으로 튀어나오는 것처럼 보이게 애니메이션 효과를 추가해줬다.<br/>
애니메이션을 추가해줘서 화면에 들어갔을 때 역동적인 느낌을 주고 싶었다.

### 2. 은색 3D 실로폰 만들기

각 건반을 boxGeometry를 사용해 3D박스 형태로 구현했다.

 <p style="display:flex; gap:10px; width:100%">
<img src="https://velog.velcdn.com/images/chloeee/post/221814b4-169e-41aa-b21b-000dec2f4f23/image.png" width="550px" height="390px"  >
</p>

```js
<animated.meshStandardMaterial
  color="#cccccc"
  metalness={1}
  roughness={0.1}
  emissive="#ffffff"
  emissiveIntensity={emissiveIntensity}
/>
```

실로폰 건반을 만들면서, 그냥 회색이 아니라 빛을 머금은 은색 느낌을 주고 싶었다.<br/>
그래서 `meshStandardMaterial`에 다음과 같은 속성을 설정했다. <br/>
`emissive="#ffffff" + emissiveIntensity`: 누를 때마다 빛이 더해지는 느낌을 주기 위해 설정을 했고,
react-spring으로 이 값을 애니메이션 처리해, 누르면 반짝이는 듯한 반응을 주었다.

### 3. 마우스로 실로폰 건반을 클릭하면 해당 음을 재생시키기

그냥 누르면 음이 재생하게 하는 건 쉬워보였지만...3D라는 특성 상 여러 개념들을 알고 있어야 했다.

```js
const raycaster = useRef(new THREE.Raycaster())
const mouse = useRef(new THREE.Vector2())
```

raycaster는 마우스가 클릭한 위치에서 3D공간으로 광선(ray)을 쏘는 도구이고,
mouse는 현재 마우스 위치를 저장할 벡터 값으로 보면 된다.

`🧭 1단계: 마우스 좌표 → NDC 좌표로 변환`

```js
mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1
mouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1
```

마우스 좌표를 Three.js의 카메라 공간인 NDC (Normalized Device Coordinates) 로 바꿔야 했다.
이 범위는 -1 ~ 1 사이고, WebGL에서 3D 위치를 추적하는 데 필요하다.
브라우저의 마우스 좌표와 webGL(Three.js)의 카메라 좌표계는 다르기 때문에 그렇다.

`🎯 2단계: Raycaster로 ray 쏘기`

```js
raycaster.current.setFromCamera(mouse.current, camera)
```

변환된 마우스 위치를 기준으로, 카메라에서 그 위치로 보이지 않는 가상의 선(ray)을 쏜다.
이 선이 어떤 3D 오브젝트와 충돌했는지 확인할 수 있다.<br/>
mouse는 현재 마우스 위치를 -1~1 범위의 WebGL 좌표(NDC) 로 변환해 저장하고,
이 값을 이용해 raycaster가 3D 공간에 광선을 쏘게 되는 것이다.

`🎯 3단계: 어떤 오브젝트와 충돌했는지 찾기`

```js
const intersects = raycaster.current.intersectObjects(scene.children)
```

장면(Scene)에 있는 모든 객체들과 비교해서,ray가 어떤 오브젝트에 먼저 부딪혔는지를 확인한다.
intersects는 부딪힌 순서대로 객체들을 배열로 반환해준다.

`🎯 4단계: 충돌한 오브젝트에서 note 읽기 → 사운드 재생`

```js
if (intersects.length > 0) {
  const key = intersects[0].object
  const note = key.userData.note
}
```

맨 처음 부딪힌 오브젝트를 key로 가져오고, 그 객체에 미리 설정해둔 userData.note 속성을 통해 무슨 음인지 알아낸다.

`음 재생 + 애니메이션 상태 설정`

```js
if (note) {
  setPressedNote(note) // 눌림 애니메이션용 상태 저장
  setCurrentNote(note) // 화면에 표시할 현재 음
  play(note) // 사운드 재생
  setTimeout(() => setPressedNote(null), 200)
}
```

audio api를 이용해 저장한 사운드를 재생하게 하면 끝이다!

## 정리해보면

사용자가 실로폰을 클릭하면, 해당 위치를 기준으로 3D 공간에 ray(광선)를 쏘고 어떤 건반과 충돌했는지 확인해 해당 음을 재생하는 것이다.
동시에 건반은 살짝 눌리는 애니메이션과 함께 화면에 해당 음이 떠오르게 구현했다.

3D 실로폰을 개발해보며, 내가 머릿속으로 생각했던 것을 웹 상에서 구현하는 것이 재밌었다.
그리고 react-three-fiber를 처음 사용해보며 three.js를 공부하며 배웠던 지식이 있어서 그런지 엄청 낯설지가 않았다.
이번에 만든게 엄청 완성도가 높은 것은 아니지만, 이것 저것 많이 개발해보며 인터랙션쪽 시야를 더 넓혀보고 싶다.
