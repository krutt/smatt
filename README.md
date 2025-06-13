# sMATT

[![Bitcoin-only](https://img.shields.io/badge/bitcoin-only-FF9900?logo=bitcoin)](https://twentyone.world)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://github.com/krutt/smatt/blob/master/LICENSE)
[![Top](https://img.shields.io/github/languages/top/krutt/smatt)](https://github.com/krutt/smatt)
[![Languages](https://img.shields.io/github/languages/count/krutt/smatt)](https://github.com/krutt/smatt)
[![Size](https://img.shields.io/github/repo-size/krutt/smatt)](https://github.com/krutt/smatt)
[![Last commit](https://img.shields.io/github/last-commit/krutt/smatt/master)](https://github.com/krutt/smatt)

[![sMATT banner](https://github.com/krutt/smatt/blob/master/static/smatt-banner.svg)](static/smatt-banner.svg)

## Prerequisites

* [node](https://nodejs.org) - Run JavaScript Everywhere
* [pnpm](https://pnpm.io) - Fast, disk space efficient package manager
* Web browser of choice (Chrome or Firefox)
  * [![Chrome Logo](static/chrome.svg) Chrome](https://www.google.com/chrome)
  * [![Firefox Logo](static/firefox.svg) Firefox](https://www.mozilla.org/en-US/firefox/new)
* Alby - Bitcoin Lightning Wallet & Nostr
  * [![Chrome Logo](static/chrome.svg) Add extension to Chrome](https://chromewebstore.google.com/detail/alby-bitcoin-wallet-for-l/iokeahhehimjnekafflcihljlcjccdbe)
  * [![Firefox Logo](static/firefox.svg) Add extension to Firefox](https://addons.mozilla.org/en-US/firefox/addon/alby)

## Stack

* [Pyodide](https://pyodide.org/en/stable)
* [Tailwind CSS](https://tailwindcss.com)
* [Vite](https://vitejs.dev)
* [Vue 3](https://v3.vuejs.org)

## List of sMATT contracts presented

* Vault

## Contribute

<details>
  <summary> Project structure </summary>

  ```
  smatt/
  ├── LICENSE                              # MIT License permission outline
  ├── README.md                            # Project setup and test setup walkthrough
  ├── index.html                           # Hypertext template where application is embedded
  ├── package.json                         # Project definitions and dependencies 
  ├── src/
  │   ├── assets/                          # Collection of stylesheets and vector assets
  │   │   └── ...                          # TODO: expand descriptions
  │   │
  │   ├── components/                      # Collection of Vue frontend components
  │   │   └── ...                          # TODO: expand descriptions
  │   │
  │   ├── stores/                          # Collection of Vue composable stores
  │   │   └── ...                          # TODO: expand descriptions
  │   │
  │   ├── views/                           # Collection of Vue frontend pages
  │   │   └── ...                          # TODO: expand descriptions
  │   │
  │   └── workers/                         # Collection of web workers
  │       └── mattvm.js                    # Pyodide parser with `pymatt` pre-installed
  │
  ├── static/                              # Static assets
  │   ├── coi-serviceworker.min.js         # Cross-origin isolation through a service worker
  │   ├── chrome.svg                       # Vector asset of Chrome web browser logo
  │   ├── favicon.ico                      # Small graphic image for the browser's address bar
  │   ├── firefox.svg                      # Vector asset of Firefox logo used by README.md
  │   ├── pymatt-0.0.1-py3-none-any.whl    # Wheel file for `pymatt` python package
  │   ├── pyodide.asm.js                   # The JS half of the main "binary"
  │   ├── pyodide.asm.wasm                 # The WebAssembly half of the main "binary"
  │   ├── pyodide.js                       # Legacy support for browsers unable to use es6 module
  │   ├── pyodide.mjs                      # Small JS loader shim which exports `loadPyodide`
  │   ├── pyodide-lock.json                # Lockfile for Python packages
  │   ├── python_stdlib.zip                # Python standard libraries for Pyodide
  │   ├── smatt.svg                        # Project logo
  │   ├── smatt-banner.svg                 # Project banner
  │   └── smatt-social.svg                 # Project social link preview
  │
  ├── tailwind.config.js                   # Styling plugins and rules for TailwindCSS
  └── vite.config.js                       # Bundler configuration and static asset bypass
  ```

  Notable exemptions: `dotfiles`, `lockfile` and `component library generated files`
</details>

### Acknowledgements

1. [ลูกทัวร์ - Look Tour](https://www.f0nt.com/release/sov-looktour) typeface
  by [uvSOV - Worawut Thanawatanawanich](https://fb.com/worawut.thanawatanawanich)
2. [Merkleize All The Things](https://merkle.fun)
  by [Salvatore Ingala](https://salvatoshi.com) [𝕏 @salvatoshi](https://x.com/salvatoshi)
3. [BIP-443: OP_CHECKCONTRACTVERIFY](https://github.com/bitcoin/bips/blob/master/bip-0443.mediawiki)
4. [YT: Merkleize All The Things (MATT) - Advancing Bitcoin | March 2nd, 2023](https://youtu.be/56_rItUgrbA)
5. [YT: sMATT contracts, zero to hero - bitcoin++ | May 3rd, 2024](https://youtu.be/BvXI1IOargk)
6. [VitePress Python Editor](https://github.com/zqianem/vitepress-python-editor)
  by [@zqianem](https://github.com/zqianem)
7. [YT: Build in-browser 3D experiences with WebGL and PyScript](https://youtu.be/NQyzFbYZjHk)
  by [Łukasz Langa](https://lukasz.langa.pl)
  at [Pycon US](https://us.pycon.org) 2024

## License

This project is licensed under the terms of the MIT license.
