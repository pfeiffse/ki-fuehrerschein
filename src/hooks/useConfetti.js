// useConfetti - Canvas-basiertes Konfetti-System (SLZB-Farben)
import { useEffect, useRef } from 'react'

const CCOL = ['#ffb225','#e70c14','#3aa533','#3c9dd7','#063b81','#ffffff']

export function useConfetti() {
  const cvRef = useRef(null)
  const stRef = useRef({ parts: [], running: false })

  useEffect(() => {
    const cv = document.createElement('canvas')
    cv.style.cssText = 'position:fixed;inset:0;width:100%;height:100%;pointer-events:none;z-index:9999'
    cv.setAttribute('aria-hidden','true')
    document.body.appendChild(cv)
    cvRef.current = cv
    const resize = () => {
      const d = window.devicePixelRatio||1
      cv.width = innerWidth*d; cv.height = innerHeight*d
      cv.getContext('2d').setTransform(d,0,0,d,0,0)
    }
    window.addEventListener('resize',resize); resize()
    return () => { window.removeEventListener('resize',resize); cv.remove() }
  }, [])

  function loop() {
    const cv = cvRef.current; if(!cv) return
    const cx = cv.getContext('2d'), st = stRef.current
    cx.clearRect(0,0,innerWidth,innerHeight)
    for(let i=st.parts.length-1;i>=0;i--){
      const p=st.parts[i]
      p.vy+=.18; p.vx*=.99; p.vy*=.99; p.x+=p.vx; p.y+=p.vy; p.r+=p.vr; p.life++
      if(p.life>p.max||p.y>innerHeight+40){st.parts.splice(i,1);continue}
      cx.save(); cx.globalAlpha=Math.min(1,(p.max-p.life)/40)
      cx.translate(p.x,p.y); cx.rotate(p.r); cx.fillStyle=p.c
      if(p.round){cx.beginPath();cx.arc(0,0,p.w/2,0,7);cx.fill()}
      else cx.fillRect(-p.w/2,-p.h/2,p.w,p.h*Math.abs(Math.cos(p.life/8)))
      cx.restore()
    }
    if(st.parts.length) requestAnimationFrame(loop)
    else { st.running=false; cx.clearRect(0,0,innerWidth,innerHeight) }
  }

  function burst(o) {
    const st = stRef.current
    for(let i=0;i<(o.n||140);i++){
      const p={x:o.x,y:o.y,w:6+Math.random()*7,h:8+Math.random()*10,c:CCOL[i%CCOL.length],
        vx:(o.vx||0)+(Math.random()-.5)*(o.spread||10),vy:(o.vy||0)+(Math.random()-.5)*(o.spread||10)*.6,
        r:Math.random()*6,vr:(Math.random()-.5)*.3,life:0,max:o.max||220,round:Math.random()<.25}
      if(o.rain){p.x=Math.random()*innerWidth;p.y=-20-Math.random()*innerHeight*.5;p.vx=(Math.random()-.5)*2;p.vy=2+Math.random()*3}
      st.parts.push(p)
    }
    if(!st.running){st.running=true;loop()}
  }

  const cannons = () => {
    burst({x:0,y:innerHeight*.75,vx:14,vy:-15,spread:9,n:110})
    burst({x:innerWidth,y:innerHeight*.75,vx:-14,vy:-15,spread:9,n:110})
  }
  const rain = (n) => burst({rain:true,n:n||200,max:320})

  return { burst, cannons, rain }
}
