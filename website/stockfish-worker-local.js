/* Chess Master Stockfish UCI worker bootstrap.
 * Engine: Stockfish.js 19.0.1 lite single-threaded, self-hosted.
 * See STOCKFISH-LICENSE.md and engine/stockfish-19.0.1/COPYING.txt.
 */
var engineBase='./engine/stockfish-19.0.1/';
var Module={
  locateFile:function(path){return engineBase+path;},
  onRuntimeInitialized:function(){postMessage('CM_ENGINE_LOADED');},
  onAbort:function(reason){
    postMessage('CM_ENGINE_ERROR '+(reason&&reason.message||String(reason||'Stockfish runtime aborted')));
  }
};
try{
  importScripts(engineBase+'stockfish-19-lite-single.js');
}catch(error){
  postMessage('CM_ENGINE_ERROR Local Stockfish engine failed to load: '+(error&&error.message||String(error)));
}
