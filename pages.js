const data=globalThis.MUSEUM_CONTENT;
const app=document.querySelector('main');
const section=new URLSearchParams(location.search).get('section')||document.body.dataset.section||'0';
const el=(tag,text,className)=>{const n=document.createElement(tag);if(text)n.textContent=text;if(className)n.className=className;return n;};
const heading=text=>app.append(el('h1',text));
const paragraph=text=>app.append(el('p',text,'intro'));
if(section==='0'){
 heading('Professioneller Musikunterricht\nin München-Daglfing');paragraph(data.introduction);
 const map=el('img');map.src='assets/map.png';map.alt='Karte zur Lage des Musikunterrichts';map.className='lesson-map';app.append(map);
}else if(section==='1'){
 heading('Über die Instrumente');app.append(el('p','Klicke auf ein Instrument um näheres herauszufinden.','intro section-instruction'));
 const covers=el('div',null,'covers');const detail=el('section',null,'detail');detail.setAttribute('aria-live','polite');
 const pick=i=>{covers.querySelectorAll('button').forEach((b,k)=>b.setAttribute('aria-pressed',String(k===i)));detail.replaceChildren(el('small',data.projects[i].type),el('h2',data.projects[i].name),el('p',data.projects[i].description),el('p',data.projects[i].tags.join(' · '),'tags'));};
 data.projects.forEach((p,i)=>{const b=el('button',null,'cover');const image=el('img');image.src=`assets/cover/cover-${i+1}.png`;image.alt='';b.append(image);b.setAttribute('aria-label','Read about '+p.name);b.setAttribute('aria-pressed',String(i===0));b.onclick=()=>pick(i);covers.append(b);});
 app.append(covers,detail);pick(0);
 if(document.body.classList.contains('catalog')){const a=el('a','Return to the museum ↗');a.href='index.html#instrumente';app.append(a);}
}else if(section==='2'){
 heading('Galerie');
 app.append(el('p','Bild klicken zum Vergrößern','intro section-instruction'));
 const images=['bild-1.jpg','bild-2.jpg','bild-3.jpg','bild-4.jpg','testbild-5.jpg','testbild-6.jpg','testbild-7.jpg'];
 const gallery=el('div',null,'gallery-grid');
 let activeImage=0;
 let backgroundInert=[];
 const lightbox=el('section',null,'gallery-lightbox');
 lightbox.hidden=true;lightbox.setAttribute('role','dialog');lightbox.setAttribute('aria-modal','true');lightbox.setAttribute('aria-label','Galerieansicht');
 const close=el('button','×','gallery-lightbox-close');close.type='button';close.setAttribute('aria-label','Galerie schließen');
 const previous=el('button','‹','gallery-lightbox-arrow gallery-lightbox-previous');previous.type='button';previous.setAttribute('aria-label','Vorheriges Bild');
 const next=el('button','›','gallery-lightbox-arrow gallery-lightbox-next');next.type='button';next.setAttribute('aria-label','Nächstes Bild');
 const image=el('img',null,'gallery-lightbox-image');
 const counter=el('span',null,'gallery-lightbox-counter');counter.setAttribute('aria-live','polite');
 lightbox.append(close,previous,image,next,counter);app.append(gallery,lightbox);
 function notifyFullscreenGallery(open){
  if(window.parent!==window)window.parent.postMessage({type:'museum-gallery-lightbox',open},location.origin);
 }
 function showImage(index,direction=1){
  if(image.hasAttribute('src')){
   const outgoing=image.cloneNode();
   outgoing.className=`gallery-lightbox-image gallery-slide-out-${direction>0?'left':'right'}`;
   lightbox.append(outgoing);
   setTimeout(()=>outgoing.remove(),450);
  }
  activeImage=(index+images.length)%images.length;
  image.src=`assets/galerie/${images[activeImage]}`;
  image.alt=`Galeriebild ${activeImage+1}`;
  image.className=`gallery-lightbox-image gallery-slide-in-${direction>0?'right':'left'}`;
  counter.textContent=`${activeImage+1} / ${images.length}`;
 }
 function openGallery(index){
  backgroundInert=[...app.children].filter(node=>node!==lightbox).map(node=>[node,node.inert]);
  backgroundInert.forEach(([node])=>{node.inert=true;});
  lightbox.hidden=false;document.body.classList.add('gallery-open');
  notifyFullscreenGallery(true);
  showImage(index,1);close.focus();
 }
 function closeGallery(){
  if(lightbox.hidden)return;
  lightbox.hidden=true;document.body.classList.remove('gallery-open');
  notifyFullscreenGallery(false);
  backgroundInert.forEach(([node,inert])=>{node.inert=inert;});backgroundInert=[];
  gallery.querySelectorAll('button')[activeImage]?.focus();
 }
 images.forEach((filename,index)=>{
  const button=el('button',null,`gallery-item gallery-item-${index+1}`);
  button.type='button';button.setAttribute('aria-label',`Bild ${index+1} groß anzeigen`);
  const thumbnail=el('img');thumbnail.src=`assets/galerie/${filename}`;thumbnail.alt=`Galeriebild ${index+1}`;thumbnail.loading='lazy';
  button.append(thumbnail);button.addEventListener('click',()=>openGallery(index));gallery.append(button);
 });
 previous.addEventListener('click',()=>showImage(activeImage-1,-1));
 next.addEventListener('click',()=>showImage(activeImage+1,1));
 close.addEventListener('click',closeGallery);
 lightbox.addEventListener('click',event=>{if(event.target===lightbox)closeGallery();});
 document.addEventListener('keydown',event=>{
  if(lightbox.hidden)return;
  if(event.key==='Escape'){event.preventDefault();closeGallery();}
  else if(event.key==='ArrowLeft'){event.preventDefault();showImage(activeImage-1,-1);}
  else if(event.key==='ArrowRight'){event.preventDefault();showImage(activeImage+1,1);}
  else if(event.key==='Tab'){
   const controls=[close,previous,next],index=controls.indexOf(document.activeElement);
   if(event.shiftKey&&index<=0){event.preventDefault();next.focus();}
   else if(!event.shiftKey&&index===controls.length-1){event.preventDefault();close.focus();}
  }
 });
 }
