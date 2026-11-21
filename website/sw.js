const CACHE='chess-master-v03-share-target-71';
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
  const shareRequestUrl=new URL(request.url);
  if(request.method==='POST'&&shareRequestUrl.origin===self.location.origin&&shareRequestUrl.pathname.startsWith(new URL(self.registration.scope).pathname)){
    event.respondWith((async()=>{&&url.origin===self.location.origin&&url.pathname.startsWith(new URL(self.registration.scope).pathname)){
    event.respondWith((async()=>{
      try{
        const form=await request.formData();
        const file=form.get('pgn');
        await saveIncomingShare({
          title:String(form.get('title')||''),text:String(form.get('text')||''),url:String(form.get('url')||''),
          pgnFile:file&&typeof file!=='string'?file:null,receivedAt:Date.now()
        });
        return Response.redirect(new URL('./?shared=1',self.registration.scope).href,303);
      }catch(error){
        return Response.redirect(new URL('./?shareError=1',self.registration.scope).href,303);
      }
    })());
    return;
  }
  if(request.method!=='GET')return;
  const url=new URL(request.url);
  if(url.origin===self.location.origin){
    if(request.mode==='navigate'){
      event.respondWith(fetch(request).then(response=>{if(response.ok){const copy=response.clone();caches.open(CACHE).then(cache=>cache.put(request,copy));}return response;}).catch(()=>caches.match(request).then(cached=>cached||caches.match('./index.html')).then(cached=>cached||caches.match('./offline.html'))));
    }else{
      event.respondWith(caches.match(request).then(cached=>cached||fetch(request).then(response=>{if(response.ok){const copy=response.clone();caches.open(CACHE).then(cache=>cache.put(request,copy));}return response;}).catch(()=>caches.match('./offline.html'))));
    }
  }else if((url.hostname==='cdnjs.cloudflare.com'&&url.pathname.includes('/chess.js/'))){
    event.respondWith(caches.match(request).then(cached=>cached||fetch(request).then(response=>{if(response.ok||response.type==='opaque'){const copy=response.clone();caches.open(CACHE).then(cache=>cache.put(request,copy));}return response;})));
  }
});
