# Asset and code provenance

## License boundary

The repository's [`LICENSE`](LICENSE) applies to the website source code. It does not grant a license to the website-specific copy, photographs, illustrations, or other media listed below. Those materials remain subject to the rights of their respective copyright holders; obtain permission from the applicable holder before reusing them unless a separate license applies.

## Website-specific content

The following site-specific materials are not covered by the source-code MIT license:

- Gallery photographs in `assets/galerie/`
- Instrument cover images in `assets/cover/`
- `assets/map.png`, `klick.png`, and `tel.png`
- Website-specific text and copy, including the German content in `index.html` and `pages-content.js`

No additional reuse rights for these materials are granted by this repository's MIT license. Their rights remain with their respective copyright holders.

## Third-party materials

| Material | Source | Terms / local notice |
| --- | --- | --- |
| The Starry Night (1889), Vincent van Gogh | [Google Art Project reproduction on Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg) | Public-domain painting and reproduction; local desktop/mobile WebP derivatives |
| Flow direction field | [DomonJi/InteractiveStarryNight](https://github.com/DomonJi/InteractiveStarryNight) | MIT, copyright 2016 Domon; `assets/starry-gallery/INTERACTIVE-STARRY-NIGHT-LICENSE.txt` |
| Three.js | [mrdoob/three.js](https://github.com/mrdoob/three.js) | MIT; `assets/THREE-LICENSE.txt`; bundled into `assets/music.js` |

`starry-flow-map.png` is an encoded derivative of the upstream flow direction field. The JavaScript shader uses that field to warp the complete painting, not to add particles on top. This is not Petros Vrellis's implementation.

Retain applicable third-party notices when redistributing. Replacing or adding assets requires checking and documenting their sources and terms separately.
