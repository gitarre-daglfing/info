import * as T from 'three';

export const STARRY_STOPS=[[-1.1,.35],[1.35,-.25],[-1.35,.15],[1.1,.48],[-.85,-.28],[.35,.18],[1.2,0]];

export function arrangeStarryFrames(root,group,camera,phase,time=0,viewportHeight=900){
 const spread=Math.min(1,camera.aspect/1.15);
 const last=root.children.length-1;
 const index=Math.min(last,Math.floor(phase)),t=T.MathUtils.clamp(phase-index,0,1),s=t*t*(3-2*t);
 const a=STARRY_STOPS[index],b=STARRY_STOPS[Math.min(last+1,index+1)];
 const x=T.MathUtils.lerp(a[0],b[0],s)*spread,y=T.MathUtils.lerp(a[1],b[1],s);
 group.position.set(0,0,0);group.rotation.set(0,0,0);group.scale.setScalar(1);root.rotation.set(0,0,0);
 root.children.forEach((frame,i)=>{
  const drift=time*.62+i*1.35;
  // Keep the current artwork floating too; the old zero amplitude made it
  // appear fixed whenever the viewer stopped in front of a frame.
  const motion=.7+.3*T.MathUtils.smoothstep(Math.abs(phase-i),.22,.65);
  const exit=i===last?T.MathUtils.smoothstep(phase,last+.15,last+1.2):0;
  const retreat=i<last?T.MathUtils.smoothstep(phase,i+.08,i+.98):0;
  const side=i%2?1:-1;
  frame.position.set(STARRY_STOPS[i][0]*spread+Math.sin(drift*.7)*.085*motion+side*retreat*9.5,STARRY_STOPS[i][1]+Math.sin(drift)*.23*motion+exit*11+retreat*.7,-i*3.4-exit*.8-retreat*.9);
  frame.rotation.set(Math.sin(drift*.8)*.025*motion,((i%2?1:-1)*.075+Math.cos(drift*.65)*.035)*motion,((i%2?1:-1)*.035+Math.sin(drift*.6)*.025)*motion);
 });
 // Fit each frameless exhibit between navigation and bottom controls.
 const topInset=Math.min(100,viewportHeight*.16);
 const bottomInset=Math.min(118,viewportHeight*.2);
 const usableHeight=Math.max(.45,1-(topInset+bottomInset)/viewportHeight);
 const tangent=Math.tan(T.MathUtils.degToRad(camera.fov/2));
 const distance=Math.max(2.88/(tangent*usableHeight),2.23/(tangent*camera.aspect*.90))+.3;
 const centerShift=(bottomInset-topInset)/viewportHeight*distance*tangent;
 camera.position.set(x,y-centerShift,distance-phase*3.4);
 camera.lookAt(x,y-centerShift,-phase*3.4);
}
