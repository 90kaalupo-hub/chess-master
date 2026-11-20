# Chess Master — Stockfish engine notice

Chess Master distributes the unmodified **Stockfish.js 19.0.1 lite, single-threaded WebAssembly engine** in `website/engine/stockfish-19.0.1/`.

- Package: `stockfish` version `19.0.1`
- Engine files: `stockfish-19-lite-single.js` and `stockfish-19-lite-single.wasm`
- Licence: GNU General Public License, version 3 (GPL-3.0)
- Full licence text: [COPYING.txt](./engine/stockfish-19.0.1/COPYING.txt)
- Corresponding Stockfish.js source and build scripts: [nmrugg/stockfish.js, tag v19.0.1](https://github.com/nmrugg/stockfish.js/tree/v19.0.1)
- Upstream Stockfish source: [official-stockfish/Stockfish](https://github.com/official-stockfish/Stockfish)

The engine is run as a separate Web Worker and communicates with Chess Master through the Universal Chess Interface (UCI) text protocol. Chess Master does not claim ownership of Stockfish. The engine is distributed under GPL-3.0; the rest of Chess Master retains its own applicable licences. Stockfish comes with no warranty, to the extent permitted by law.

The corresponding source is available from the exact upstream release linked above. The engine is served locally by this website; no external engine CDN is required at runtime.
