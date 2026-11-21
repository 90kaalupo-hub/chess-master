const CACHE='chess-master-v03-android-capture-refresh-77';
const SHARE_DB='chess-master-share-inbox';
function openShareDb(){
  return new Promise((resolve,reject)=>{
    const request=indexedDB.open(SHARE_DB,1);
    request.onupgradeneeded=()=>request.result.createObjectStore('incoming');
    request.onsuccess=()=>resolve(request.result);
    request.onerror=()=>reject(request.error);
  });
}
async function saveIncomingShare(payload){
  const db=await openShareDb();
  await new Promise((resolve,reject)=>{
    const tx=db.transaction('incoming','readwrite');
    tx.objectStore('incoming').put(payload,'latest');
    tx.oncomplete=resolve;tx.onerror=()=>reject(tx.error);tx.onabort=()=>reject(tx.error);
  });
  db.close();
}
const SHELL=['./','./index.html','./stockfish-worker-local.js','./manifest.webmanifest','./icon.svg','./offline.html','./THIRD-PARTY-NOTICES.html','./chess.js'];
self.addEventListener('install',event=>{event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(SHELL)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',event=>{event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key!==CACHE).map(key=>caches.delete(key)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',event=>{
  const request=event.request;
  if(request.method==='POST'){
    const shareUrl=new URL(request.url);
    if(shareUrl.origin===self.location.origin&&shareUrl.pathname.startsWith(new URL(self.registration.scope).pathname)){
      event.respondWith((async()=>{
        const form=await request.formData();
        const payload={text:form.get('text')||'',files:[]};
        for(const [key,value] of form.entries()){
          if(value instanceof File&&value.size){
            payload.files.push({name:value.name,type:value.type,text:await value.text()});
          }
        }
        await saveIncomingShare(payload);
        return Response.redirect(new URL('./?shared=1',self.registration.scope),303);
      })());
    }
    return;
  }
  if(request.method!=='GET')return;
  const url=new URL(request.url);
  if(url.origin!==self.location.origin)return;
  event.respondWith(caches.match(request).then(cached=>cached||fetch(request).then(response=>{
    if(response.ok&&response.type==='basic'){
      const copy=response.clone();
      caches.open(CACHE).then(cache=>cache.put(request,copy));
    }
    return response;
  }).catch(()=>caches.match('./offline.html'))));
});
