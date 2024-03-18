---
title: Three.js journey | Fullscreen and resizing
date: 2023-07-17 18:07:69
category: three.js
thumbnail: { thumbnailSrc }
draft: false
image: 'https://velog.velcdn.com/images/chloeee/post/c9eb947c-a3c0-4288-83f3-857c3c2bcc22/image.png'
---


### resize

Resize 이벤트를 활용하여 resize를 할 수 있습니다.
```js
const sizes ={
width:window.innerWidth,
height:window.innerHeight
}
```

```js
window.addEventListener('resize',()=>{
    console.log('window has been resized')
    
    //Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight
    
    //Update camera
    camera.aspect = sizes.width/size.height
    camera.updateProjectionMatrix()
    //Update renderer
    renderer.setSize(sizes.width,sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio,2))
})
```

현재 pixel ratio를 알고 싶으면 `window.devicePixelRatio`를 사용하면 됩니다.
rerender를 업데이트하기 위해서는 `rerender.setPixelRatio()`를 사용할 수 있습니다.


### Handle Full screen
dbclick 이벤트로 fullscreen mode로 만들 수 있습니다.
```js
window.addEventListener('dblclick',()=>{
if(!document.fullsceenElement){
    console.log('go fullscreen')
}
else {
    if(document.exitFullscreen){
        document.exitFullscreen()
    }
    else if(document.webkitExitFullscreen){
        document.webkitExitFullscreen()
    }
}
})
```

canvas element에서 fullscreen mode로 가고 싶다면 requestFullscreen()을 사용하면 됩니다.

```js
window.addEventListener('dblclick',()=>{
if(!document.fullsceenElement){
  canvas.requestFullscreen()
}
else {
    document.exitFullscreen()
}
})
```

그러나, safari에서는 위 코드가 먹히지 않습니다.
그래서 safari에서도 가능하게 하려면 아래와 같이 작성할 수 있습니다.

```js
window.addEventListener('dblclick',()=>{
    
    const fullscreenElement = document.fullscreenElement || document.webkitFullscreenElement
if(!fullscreenElement){
    if(canvas.requestFullscreen) {
        canvas.requestFullscreen()
    }
   else if(canvas.webkitRequestFullscreen) {
       canvas.webkitRequestFullscreen()
    }
}
else {
    document.exitFullscreen()
}
})
```