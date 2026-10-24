import assert from 'node:assert/strict';
import fs from 'node:fs';
import {JSDOM} from 'jsdom';

const dom=new JSDOM(fs.readFileSync('page-3.html','utf8'),{
 url:'https://example.org/page-3.html',
 runScripts:'outside-only'
});
const {window}=dom;
window.document.body.dataset.section='2';
window.eval(fs.readFileSync('pages-content.js','utf8'));
window.eval(fs.readFileSync('pages.js','utf8'));

const {document}=window;
const thumbnails=[...document.querySelectorAll('.gallery-item')];
assert.equal(document.querySelector('main h1')?.textContent,'Galerie');
assert.equal(thumbnails.length,7);
assert.equal(document.querySelector('.gallery-copyright')?.textContent,'© Paul Jesberger');
assert.deepEqual(thumbnails.map(button=>button.querySelector('img').getAttribute('src')),[
 'assets/galerie/bild-1.jpg',
 'assets/galerie/bild-2.jpg',
 'assets/galerie/bild-3.jpg',
 'assets/galerie/bild-4.jpg',
 'assets/galerie/testbild-5.jpg',
 'assets/galerie/testbild-6.jpg',
 'assets/galerie/testbild-7.jpg'
]);

const lightbox=document.querySelector('.gallery-lightbox');
thumbnails[2].click();
assert.equal(lightbox.hidden,false);
assert.ok(document.body.classList.contains('gallery-open'));
assert.equal(document.activeElement,document.querySelector('.gallery-lightbox-close'));
assert.equal(document.querySelector('.gallery-grid').inert,true);
assert.equal(document.querySelector('.gallery-lightbox-image').getAttribute('src'),'assets/galerie/bild-3.jpg');
assert.equal(document.querySelector('.gallery-lightbox-counter').textContent,'3 / 7');

document.querySelector('.gallery-lightbox-next').click();
assert.equal(document.querySelector('.gallery-lightbox-image').getAttribute('src'),'assets/galerie/bild-4.jpg');
document.dispatchEvent(new window.KeyboardEvent('keydown',{key:'ArrowLeft',bubbles:true}));
assert.equal(document.querySelector('.gallery-lightbox-image').getAttribute('src'),'assets/galerie/bild-3.jpg');
document.dispatchEvent(new window.KeyboardEvent('keydown',{key:'Escape',bubbles:true}));
assert.equal(lightbox.hidden,true);
assert.ok(!document.body.classList.contains('gallery-open'));
assert.ok(!document.querySelector('.gallery-grid').inert);
assert.equal(document.activeElement,thumbnails[2]);
thumbnails[0].click();
document.querySelector('.gallery-lightbox-close').click();
assert.equal(lightbox.hidden,true,'The X button closes the gallery');
assert.equal(document.activeElement,thumbnails[0]);

window.close();
console.log('Passed: seven gallery photos, image selection, next/previous navigation, Escape and focus restoration.');
