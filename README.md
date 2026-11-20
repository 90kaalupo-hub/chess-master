# Chess Master

A mobile-first chess website, built website-first with an Android app planned after the web experience is stable.

## Website

Open `website/index.html` locally or deploy the `website/` directory as the site root.

### v0.1 foundation
- Responsive Chess Master dashboard
- Local two-player chessboard with legal move validation
- Undo, board flip, new game, check/checkmate/draw status
- PGN import and export
- Move-by-move replay controls
- Up to 30 recent games saved locally on the device
- Installable PWA manifest and service-worker caching
- Offline fallback page

The chess rules library is loaded from cdnjs. The service worker attempts to cache it after the first successful online load for later offline use. Offline behavior should still be tested on the target browser/device; first-time use requires an internet connection.

## Free hosting with GitHub Pages

1. In the repository, open **Settings → Pages**.
2. Under **Build and deployment**, select **Deploy from a branch**.
3. Choose branch **main** and folder **/ (root)**, then save. The root entry page forwards visitors to the website folder.
4. Wait for GitHub Pages to publish and use the URL shown in Settings → Pages.

No paid hosting is required for a public GitHub Pages site, subject to GitHub's current account and repository limits.

## Advanced game review update (feature branch)
- Added a post-analysis Game Review summary with the recorded PGN result when available, separate White/Black accuracy estimates, and a clear note that local games do not change an online rating.
- Analysis move cards are now keyboard-accessible and selectable. Selecting a move opens the matching replay position, shows its classification and coach explanation, includes the before/after engine evaluation when available, and draws an arrow for the engine's principal suggested move.
- Added Previous/Next move navigation to the review summary.
- These results remain Chess Master's Stockfish-derived estimates. They are not Chess.com CAPS2 accuracy, official game ratings, or online rating changes.
- Validation still required: test real PGNs and engine output on Android browsers, verify cached analysis retrieval, check arrow orientation after board flip, and measure performance for long games. No claim of full device QA is made by this code change.

## v0.2 — Stockfish analysis (in progress)

- Upgrade game replay with a move-by-move timeline, selectable positions, autoplay, pause/resume, playback speeds, and last-move highlighting.
- Add local Stockfish analysis for both players, with per-move evaluations, best-move suggestions, move classifications, accuracy estimates, and an evaluation graph.
- Engine candidate selected for the browser prototype: **Stockfish.js 19.0.1, lite single-threaded WebAssembly**. Its published size is approximately 1.7 MB, and the single-threaded build does not require cross-origin isolation headers, which suits GitHub Pages and Android browsers.
- The intended release will serve the engine files from this repository (not rely on a live CDN), cache them through the PWA service worker, and run analysis in a Web Worker so the board remains responsive.
- Before distributing the engine, include the exact matching GPL-3.0 licence and corresponding source/build notices for the exact Stockfish.js release. Stockfish.js is GPL-3.0; see the [upstream package and build documentation](https://github.com/nmrugg/stockfish.js).
- Add a first analysis prototype: run the lite single-threaded engine in a Web Worker, evaluate each position at depth 10, show estimated accuracy and move-loss labels, and display the engine's principal variation.
- The prototype currently loads the pinned engine JavaScript and WASM from jsDelivr; first use requires internet. The service worker attempts to cache these engine responses for repeat/offline use, which still needs real-device verification.
- The engine is not yet bundled in this repository. Offline operation, engine score orientation, accuracy calibration, move-classification thresholds, and mobile performance must be verified before calling analysis complete.

## Later roadmap

Chess.com import, offline AI bots, puzzles, lessons, profiles, accounts, premium features and online multiplayer remain later milestones.
