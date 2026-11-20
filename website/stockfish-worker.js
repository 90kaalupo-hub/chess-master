/* Chess Master Stockfish UCI worker bootstrap.
 * Engine: stockfish@19.0.1 lite single-threaded. See STOCKFISH-LICENSE.md.
 * Uses CDN fallbacks because some networks block individual CDN hosts.
 */
var engineBase='';
var Module={
  locateFile:function(path){
    return engineBase+path;
  },
  onRuntimeInitialized:function(){
    postMessage('CM_ENGINE_LOADED');
  },
  onAbort:function(reason){
    postMessage('CM_ENGINE_ERROR '+(reason&&reason.message||String(reason||'Stockfish runtime aborted')));
  }
};
var engineScripts=[
  'https://cdn.jsdelivr.net/npm/stockfish@19.0.1/bin/stockfish-19-lite-single.js',
  'https://unpkg.com/stockfish@19.0.1/bin/stockfish-19-lite-single.js'
];
var loadErrors=[];
var loaded=false;
for(var i=0;i<engineScripts.length;i++){
  try{
    engineBase=engineScripts[i].slice(0,engineScripts[i].lastIndexOf('/')+1);
    importScripts(engineScripts[i]);
    loaded=true;
    break;
  }catch(error){
    loadErrors.push(engineScripts[i]+' — '+(error&&error.message||String(error)));
  }
}
if(!loaded){
  postMessage('CM_ENGINE_ERROR Unable to load Stockfish from available CDNs. '+loadErrors.join(' | '));
}
