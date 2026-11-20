/* Chess Master Stockfish UCI bridge.
 * Stockfish.js is loaded from the pinned npm release; see STOCKFISH-LICENSE.md.
 * First analysis requires internet. The service worker attempts to cache the engine.
 */
const ENGINE_BASE='https://cdn.jsdelivr.net/npm/stockfish@19.0.1/bin/';
const ENGINE_FILE='stockfish-19-lite-single.js';
let ready=false, queue=[], busy=false;
self.Module={
  locateFile(path){return ENGINE_BASE+path;}
};
try{
  importScripts(ENGINE_BASE+ENGINE_FILE);
  ready=true;
  self.postMessage({type:'loaded'});
}catch(error){
  self.postMessage({type:'error',message:'Could not load Stockfish engine: '+(error&&error.message||error)});
}
self.onmessage=function(event){
  const data=event.data||{};
  if(data.type==='uci'){if(ready)self.postMessage({type:'command',command:'uci'});return;}
  if(data.type==='send'&&typeof data.command==='string'){
    if(!ready){self.postMessage({type:'error',message:'Stockfish is not loaded yet.'});return;}
    self.postMessage({type:'command',command:data.command});
  }
};
