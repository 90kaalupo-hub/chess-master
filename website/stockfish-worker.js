/* Chess Master Stockfish UCI worker bootstrap.
 * Engine: stockfish@19.0.1 lite single-threaded. See STOCKFISH-LICENSE.md.
 * First use requires internet; the service worker may cache engine responses.
 */
var Module={
  locateFile:function(path){
    return 'https://cdn.jsdelivr.net/npm/stockfish@19.0.1/bin/'+path;
  },
  // Do not tell the page the engine is ready merely because its JS file
  // imported. The WASM runtime must finish initialising first.
  onRuntimeInitialized:function(){
    postMessage('CM_ENGINE_LOADED');
  },
  onAbort:function(reason){
    postMessage('CM_ENGINE_ERROR '+(reason&&reason.message||String(reason||'Stockfish runtime aborted')));
  }
};
try{
  importScripts('https://cdn.jsdelivr.net/npm/stockfish@19.0.1/bin/stockfish-19-lite-single.js');
}catch(error){
  postMessage('CM_ENGINE_ERROR '+(error&&error.message||String(error)));
}
