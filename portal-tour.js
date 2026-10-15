(() => {
  const chapters=[...document.querySelectorAll('.story-frame')];
  const finale=document.querySelector('.portal-finale');
  const hint=document.querySelector('[data-portal-continue]');
  const hintLabel=hint?.querySelector('[data-continue-label]');
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  const duration=2400;
  let automatic=true,timer=0,animation=0,moving=false,ready=document.readyState==='complete';
  function syncHint(){
    const arrived=document.body.classList.contains('portal-arrived');
    if(hint){hint.hidden=arrived;hint.disabled=moving;}
    if(hintLabel)hintLabel.textContent=moving?'Weiter zum nächsten Bild…':'Klicken Sie außerhalb des Bildrahmens, um zum nächsten Bild zu gelangen';
    document.body.classList.toggle('portal-travelling',moving);
  }
  function schedule(){
    clearTimeout(timer);
    // Start the reading interval only after the previous transition completes.
    if(automatic&&ready&&!document.hidden&&!moving)timer=setTimeout(advance,3000);
  }
  function update(){
    schedule();syncHint();
  }
  function manual(){automatic=false;update();}
  function cancelMotion(){
    cancelAnimationFrame(animation);animation=0;moving=false;syncHint();
  }
  function navigate(target){
    if(!target)return;
    cancelMotion();clearTimeout(timer);
    const start=scrollY,end=Math.max(0,Math.min(document.documentElement.scrollHeight-innerHeight,scrollY+target.getBoundingClientRect().top-90));
    if(reduced.matches||Math.abs(end-start)<2){scrollTo({top:end,behavior:'instant'});schedule();return;}
    moving=true;syncHint();
    let started;
    function step(now){
      if(document.hidden){cancelMotion();return;}
      started??=now;
      const progress=Math.min(1,(now-started)/duration);
      const eased=(1-Math.cos(Math.PI*progress))/2;
      scrollTo({top:start+(end-start)*eased,behavior:'instant'});
      if(progress<1)animation=requestAnimationFrame(step);
      else{animation=0;moving=false;syncHint();schedule();}
    }
    animation=requestAnimationFrame(step);
  }
  window.museumPortalNavigate=navigate;
  function advance(){
    if(moving||document.hidden||document.body.classList.contains('portal-fullscreen'))return;
    const phase=Number(document.body.style.getPropertyValue('--story-phase')||0);
    const entering=chapters[0]?.getBoundingClientRect().top>100;
    const next=entering?chapters[0]:chapters[Math.min(chapters.length,Math.floor(phase+.08)+1)]||finale;
    if(!next||document.body.classList.contains('portal-arrived')){manual();return;}
    if(next===finale)manual();
    navigate(next);
  }
  hint?.addEventListener('click',()=>{manual();advance();});
  document.querySelector('[data-tour-start]')?.addEventListener('click',()=>{
    automatic=true;update();
    history.replaceState(null,'','#frame-0');
    navigate(chapters[0]);
  });
  document.addEventListener('click',event=>{
    if(event.target.closest?.('[data-tour-start]'))return;
    manual();
    const anchor=event.target.closest?.('a[href^="#frame-"],a[href="#gallery-invitation"],a[href="#portal-prologue"]');
    if(anchor&&!event.metaKey&&!event.ctrlKey&&!event.shiftKey&&!event.altKey){
      const target=document.getElementById(anchor.hash.slice(1));
      if(target){event.preventDefault();history.replaceState(null,'',anchor.hash);navigate(target);}
      return;
    }
    if(event.defaultPrevented||event.button!==0||event.target.closest?.('a,button,input,textarea,select,label,nav,.story-bottom,.portal-preview,.portal-finale,.footer')||document.body.classList.contains('portal-fullscreen'))return;
    // The wood rim is WebGL, not a DOM click target.
    if(window.museumPortalContainsPoint?.(event.clientX,event.clientY))return;
    advance();
  },true);
  function takeOver(){manual();cancelMotion();}
  addEventListener('portal-user-interaction',takeOver);
  addEventListener('wheel',takeOver,{passive:true});
  addEventListener('touchmove',takeOver,{passive:true});
  document.addEventListener('keydown',event=>{
    if(['Tab','Enter',' ','Escape','ArrowDown','ArrowUp','PageDown','PageUp','Home','End'].includes(event.key))takeOver();
  });
  document.addEventListener('visibilitychange',()=>{if(document.hidden)cancelMotion();schedule();});
  reduced.addEventListener('change',()=>{if(reduced.matches)takeOver();});
  addEventListener('load',()=>{ready=true;schedule();},{once:true});
  addEventListener('pagehide',()=>{clearTimeout(timer);cancelMotion();});
  addEventListener('pageshow',schedule);
  addEventListener('scroll',syncHint,{passive:true});
  update();
})();
