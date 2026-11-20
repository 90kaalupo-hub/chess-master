Chess Master — Stockfish engine notice

This project intends to use the unmodified Stockfish.js 19.0.1 lite,
single-threaded WebAssembly engine distributed in the npm package
"stockfish" version 19.0.1.

Stockfish.js engine code and the Stockfish engine are licensed under the
GNU General Public License, version 3 (GPL-3.0). The full licence text is
available at:
https://www.gnu.org/licenses/gpl-3.0.txt

Upstream Stockfish.js source and build scripts:
https://github.com/nmrugg/stockfish.js/tree/v19.0.1

Upstream Stockfish source:
https://github.com/official-stockfish/Stockfish

The engine is a separate program communicating with Chess Master through
the Universal Chess Interface (UCI) protocol. This project does not claim
ownership of Stockfish. The engine is fetched from the pinned npm release
at runtime in this prototype; it is not yet bundled in this repository.
Before redistributing a bundled engine, Chess Master must include the
complete corresponding source code or a valid written offer, the full
GPL-3.0 licence, and all applicable notices for the exact distributed
binary and build.

Stockfish comes with no warranty, to the extent permitted by law.
