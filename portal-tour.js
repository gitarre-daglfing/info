(() => {
  const chapters=[...document.querySelectorAll('.story-frame')];
  const finale=document.querySelector('.portal-finale');
  const menuToggle=document.querySelector('[data-mobile-menu-toggle]');
  const pageNavigation=document.querySelector('#page-navigation');
  const navLinks=menuToggle?.closest('.links');
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  const duration=2400;
  let automatic=true,timer=0,animation=0,moving=false,ready=document.readyState==='complete';
  function closeMobileMenu(){
    navLinks?.classList.remove('mobile-menu-open');
    menuToggle?.setAttribute('aria-expanded','false');
    menuToggle?.setAttribute('aria-label','Seitenmenü öffnen');
  }
  menuToggle?.addEventListener('click',()=>{
    const open=menuToggle.getAttribute('aria-expanded')!=='true';
    navLinks?.classList.toggle('mobile-menu-open',open);
    menuToggle.setAttribute('aria-expanded',String(open));
    menuToggle.setAttribute('aria-label',open?'Seitenmenü schließen':'Seitenmenü öffnen');
  });
  pageNavigation?.addEventListener('click',event=>{
    if(event.target.closest?.('a'))closeMobileMenu();
  });
  document.addEventListener('click',event=>{
    if(!event.target.closest?.('.nav'))closeMobileMenu();
  });
  function schedule(){
    clearTimeout(timer);
    // Start the reading interval only after the previous transition completes.
    if(automatic&&ready&&!document.hidden&&!moving)timer=setTimeout(advance,3000);
  }
  function update(){schedule();}
  function manual(){automatic=false;update();}
  function cancelMotion(){
    cancelAnimationFrame(animation);animation=0;moving=false;
  }
  function navigate(target){
    if(!target)return;
    cancelMotion();clearTimeout(timer);
    const start=scrollY,end=Math.max(0,Math.min(document.documentElement.scrollHeight-innerHeight,scrollY+target.getBoundingClientRect().top-90));
    if(reduced.matches||Math.abs(end-start)<2){scrollTo({top:end,behavior:'instant'});schedule();return;}
    moving=true;
    let started;
    function step(now){
      if(document.hidden){cancelMotion();return;}
      started??=now;
      const progress=Math.min(1,(now-started)/duration);
      const eased=(1-Math.cos(Math.PI*progress))/2;
      scrollTo({top:start+(end-start)*eased,behavior:'instant'});
      if(progress<1)animation=requestAnimationFrame(step);
      else{animation=0;moving=false;schedule();}
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
  document.querySelector('[data-tour-start]')?.addEventListener('click',()=>{
    automatic=true;update();
    navigate(chapters[0]);
  });
  document.addEventListener('click',event=>{
    if(event.target.closest?.('[data-tour-start]'))return;
    const anchor=event.target.closest?.('.nav-options a[href^="#"],.nav .pill[href^="#"],.portal-prologue-heading .pill[href^="#"]');
    if(anchor&&!event.metaKey&&!event.ctrlKey&&!event.shiftKey&&!event.altKey){
      manual();
      const target=document.getElementById(anchor.hash.slice(1));
      if(target){event.preventDefault();navigate(target);}
      return;
    }
    if(event.button!==0)return;
    if(event.target.closest?.('a,button,input,textarea,select,label,nav,.story-bottom,.portal-preview,.portal-finale,.footer')){
      manual();
      return;
    }
  },true);
  function takeOver(){manual();cancelMotion();}
  addEventListener('portal-user-interaction',takeOver);
  addEventListener('wheel',takeOver,{passive:true});
  addEventListener('touchmove',takeOver,{passive:true});
  document.addEventListener('keydown',event=>{
    if(event.key==='Escape')closeMobileMenu();
    if(['Tab','Enter',' ','Escape','ArrowDown','ArrowUp','PageDown','PageUp','Home','End'].includes(event.key))takeOver();
  });
  document.addEventListener('visibilitychange',()=>{if(document.hidden)cancelMotion();schedule();});
  reduced.addEventListener('change',()=>{if(reduced.matches)takeOver();});
  addEventListener('load',()=>{ready=true;schedule();},{once:true});
  addEventListener('pagehide',()=>{clearTimeout(timer);cancelMotion();});
  addEventListener('pageshow',schedule);
  update();
})();
