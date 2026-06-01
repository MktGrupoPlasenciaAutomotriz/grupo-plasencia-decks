// ============================================================================
// PLASENCIA MARKETPLACE · POLISH LAYER · interacciones estado-del-arte
// Command palette (Cmd+K), sticky bottom bar PDP, skeleton boot, optimistic UI
// ============================================================================

// ─────────────────────────────────────────────────────────────────────────
// COMMAND PALETTE · Cmd+K
// ─────────────────────────────────────────────────────────────────────────
const CmdK={
  open(){
    if(document.getElementById('cmdkBg'))return;
    const bg=document.createElement('div');bg.className='cmdk-bg';bg.id='cmdkBg';
    bg.innerHTML=`<div class="cmdk" role="dialog" aria-label="Buscador">
      <div class="cmdk-search">
        <span class="ic">${I.search(20)}</span>
        <input id="cmdkInput" placeholder="Busca un auto, una sección, una acción…" autofocus>
        <span class="cmdk-kbd">ESC</span>
      </div>
      <div class="cmdk-list" id="cmdkList"></div>
      <div class="cmdk-foot">
        <span><kbd class="cmdk-kbd">↑↓</kbd>navegar</span>
        <span><kbd class="cmdk-kbd">↵</kbd>elegir</span>
        <span><kbd class="cmdk-kbd">⌘K</kbd>abrir</span>
      </div>
    </div>`;
    bg.onclick=e=>{if(e.target===bg)CmdK.close()};
    document.body.appendChild(bg);
    CmdK.idx=0;CmdK.q='';CmdK.render();
    const inp=document.getElementById('cmdkInput');
    inp.addEventListener('input',e=>{CmdK.q=e.target.value;CmdK.idx=0;CmdK.render()});
    inp.addEventListener('keydown',CmdK.onKey);
  },
  close(){document.getElementById('cmdkBg')?.remove()},
  onKey(e){
    if(e.key==='Escape'){CmdK.close();return}
    const items=CmdK.currentItems();
    if(e.key==='ArrowDown'){e.preventDefault();CmdK.idx=Math.min(CmdK.idx+1,items.length-1);CmdK.render(true)}
    else if(e.key==='ArrowUp'){e.preventDefault();CmdK.idx=Math.max(0,CmdK.idx-1);CmdK.render(true)}
    else if(e.key==='Enter'){e.preventDefault();const it=items[CmdK.idx];if(it)CmdK.runItem(it)}
  },
  catalog(){
    const watch=(STATE.watchlist||[]).map(id=>CARS.find(c=>c.id===id)).filter(Boolean);
    const cars=CARS.slice(0,30);
    return [
      {g:'Navegación',items:[
        {ic:I.car(16),t:'Ver catálogo completo',hint:'todos',run:()=>go('#/catalogo')},
        {ic:I.shield(16),t:'Seminuevos certificados',hint:'167 puntos',run:()=>go('#/catalogo?cond=seminuevo')},
        {ic:I.car(16),t:'Autos nuevos',hint:'14 marcas',run:()=>go('#/catalogo?cond=nuevo')},
        {ic:I.building(16),t:'Las 12 concesionarias',hint:'directorio',run:()=>go('#/concesionarias')},
        {ic:I.user(16),t:'Mi Plasencia',hint:'mi cuenta',run:()=>go('#/cuenta')},
      ]},
      {g:'Acciones rápidas',items:[
        {ic:I.trending(16),t:'Valuar mi auto',hint:'2 min',run:()=>Flow.openTradein()},
        {ic:I.card(16),t:'Pre-aprobar crédito',hint:'sin afectar buró',run:()=>Flow.openCredito()},
        {ic:I.key(16),t:'Cotizar Autolease',hint:'PFAE/PM',run:()=>Flow.openLease()},
        {ic:I.umbrella(16),t:'Cotizar seguro',hint:'amplia plus',run:()=>Flow.openSeguro()},
        {ic:I.cal(16),t:'Agendar cita',hint:'test drive/servicio',run:()=>Flow.openCita()},
        {ic:I.chat(16),t:'Hablar con Plasi',hint:'asistente IA',run:()=>Plasi.open()},
      ]},
      {g:'Mi cuenta · pagar',items:[
        ...(STATE.creditos?.[0]?[{ic:I.cash(16),t:'Pagar mensualidad de crédito',hint:mxn(STATE.creditos[0].mensActual||0),run:()=>Flow.openSim('pagoCredito',{monto:STATE.creditos[0].mensActual,folio:STATE.creditos[0].folio})}]:[]),
        ...(STATE.leases?.[0]?[{ic:I.cash(16),t:'Pagar renta de Autolease',hint:mxn(STATE.leases[0].renta),run:()=>Flow.openSim('pagoLease',{monto:STATE.leases[0].renta,folio:STATE.leases[0].folio})}]:[]),
        ...(STATE.reservas?.[0]?[{ic:I.cash(16),t:`Avanzar pago · ${STATE.reservas[0].marca} ${STATE.reservas[0].modelo}`,hint:'apartado',run:()=>Flow.openPagoMas(STATE.reservas[0].carId)}]:[]),
      ]},
      ...(watch.length?[{g:'Tu watchlist',items:watch.slice(0,8).map(v=>({ic:I.heart(16,true),t:`${v.marca} ${v.modelo} ${v.anio}`,hint:mxn(v.precio),run:()=>go('#/auto/'+v.id)}))}]:[]),
      {g:'Catálogo',items:cars.map(v=>({ic:I.car(16),t:`${v.marca} ${v.modelo} ${v.anio}`,hint:mxn(v.precio)+' · '+(v.cond==='nuevo'?'Nuevo':'Seminuevo'),run:()=>go('#/auto/'+v.id)}))},
    ];
  },
  currentItems(){
    const groups=CmdK.catalog();
    const q=CmdK.q.toLowerCase().trim();
    if(!q)return groups.flatMap(g=>g.items);
    return groups.flatMap(g=>g.items).filter(it=>it.t.toLowerCase().includes(q)||(it.hint||'').toLowerCase().includes(q));
  },
  render(scrollOnly){
    const list=document.getElementById('cmdkList');if(!list)return;
    if(!scrollOnly){
      const groups=CmdK.catalog();const q=CmdK.q.toLowerCase().trim();
      let flatIdx=0;let html='';
      if(!q){
        groups.forEach(g=>{
          if(!g.items.length)return;
          html+=`<div class="cmdk-group">${g.g}</div>`;
          g.items.forEach((it,i)=>{html+=`<div class="cmdk-item" data-idx="${flatIdx++}"><span class="ic">${it.ic}</span>${it.t}${it.hint?`<span class="desc">${it.hint}</span>`:''}</div>`});
        });
      }else{
        const filtered=groups.flatMap(g=>g.items).filter(it=>it.t.toLowerCase().includes(q)||(it.hint||'').toLowerCase().includes(q));
        if(!filtered.length){html=`<div class="cmdk-empty">Sin resultados para "<b>${CmdK.q}</b>". Prueba "SUV", "crédito", "valuar", "Mazda"…</div>`}
        else filtered.forEach((it,i)=>{html+=`<div class="cmdk-item" data-idx="${flatIdx++}"><span class="ic">${it.ic}</span>${it.t}${it.hint?`<span class="desc">${it.hint}</span>`:''}</div>`});
      }
      list.innerHTML=html;
      list.querySelectorAll('.cmdk-item').forEach((el,i)=>{
        el.onclick=()=>{const items=CmdK.currentItems();CmdK.runItem(items[i])};
        el.onmouseenter=()=>{CmdK.idx=+el.dataset.idx;CmdK.render(true)};
      });
    }
    list.querySelectorAll('.cmdk-item').forEach((el,i)=>el.classList.toggle('on',i===CmdK.idx));
    const active=list.querySelector('.cmdk-item.on');if(active)active.scrollIntoView({block:'nearest'});
  },
  runItem(it){if(!it)return;CmdK.close();setTimeout(()=>it.run(),50)},
};
window.CmdK=CmdK;
window.addEventListener('keydown',e=>{
  if((e.metaKey||e.ctrlKey)&&e.key==='k'){e.preventDefault();CmdK.open()}
});

// Hint flotante de Cmd+K (solo primera visita, sin localStorage para demo)
window.addEventListener('load',()=>{
  setTimeout(()=>{
    if(localStorage.getItem('cmdkHintShown'))return;
    const h=document.createElement('div');h.className='cmdk-hint';
    h.innerHTML=`Tip · presiona <kbd>⌘</kbd><kbd>K</kbd> para buscar lo que sea`;
    document.body.appendChild(h);
    h.style.display='block';
    setTimeout(()=>{h.style.opacity='0';h.style.transition='opacity .4s';setTimeout(()=>h.remove(),400);localStorage.setItem('cmdkHintShown','1')},5000);
  },2500);
});

// ─────────────────────────────────────────────────────────────────────────
// STICKY BOTTOM BAR PDP MOBILE
// ─────────────────────────────────────────────────────────────────────────
window.addEventListener('hashchange',mountStickyPDP);
function mountStickyPDP(){
  // Quitar bar previo
  document.getElementById('pdpStickybar')?.remove();
  const hash=(location.hash||'').split('?')[0];
  if(!hash.startsWith('#/auto/'))return;
  const id=hash.replace('#/auto/','');
  setTimeout(()=>{
    if(!CARS||!CARS.length)return;
    const v=CARS.find(c=>c.id===id);if(!v)return;
    const reservado=STATE.reservas?.find(r=>r.carId===v.id);
    const bar=document.createElement('div');bar.id='pdpStickybar';bar.className='pdp-stickybar';
    const mens=mensCredito(v.precio,20,60);
    bar.innerHTML=`<div class="priceblock">
      <div class="pl">${reservado?'Apartado · pagado':'Desde'}</div>
      <div class="pv tnum">${reservado?mxn(reservado.apart):mxn(v.precio)}</div>
      <div class="pm">${reservado?'continúa el pago':'o '+mxn(mens)+'/mes'}</div>
    </div>
    <button class="btn btn-conv btn-md" onclick="${reservado?`Flow.openPagoMas('${v.id}')`:`Flow.openCheckout('${v.id}')`}">${reservado?'Pagar más':'Apartar'}</button>`;
    document.body.appendChild(bar);
  },200);
}

// ─────────────────────────────────────────────────────────────────────────
// LAZY IMG FADE-IN
// ─────────────────────────────────────────────────────────────────────────
function observeLazyImages(){
  document.querySelectorAll('img[loading="lazy"]:not([data-bound])').forEach(img=>{
    img.dataset.bound='1';
    if(img.complete)img.classList.add('loaded');
    else img.addEventListener('load',()=>img.classList.add('loaded'),{once:true});
  });
}
const _origRender=window.render;
if(_origRender){
  window.render=function(){_origRender.apply(this,arguments);setTimeout(()=>{observeLazyImages();mountStickyPDP()},50)};
}

// ─────────────────────────────────────────────────────────────────────────
// SKELETON al boot (reemplaza "Cargando..." text)
// ─────────────────────────────────────────────────────────────────────────
(function(){
  const app=document.getElementById('app');if(!app)return;
  const cur=app.innerHTML;
  if(cur.includes('Cargando')){
    app.innerHTML=`<div style="max-width:1280px;margin:0 auto;padding:24px">
      <div class="skel" style="height:60px;border-radius:14px;margin-bottom:32px"></div>
      <div class="skel" style="height:420px;border-radius:24px;margin-bottom:32px"></div>
      <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:16px;margin-bottom:32px">
        <div class="skel" style="height:140px;border-radius:18px"></div>
        <div class="skel" style="height:140px;border-radius:18px"></div>
        <div class="skel" style="height:140px;border-radius:18px"></div>
        <div class="skel" style="height:140px;border-radius:18px"></div>
      </div>
      <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:16px">
        <div class="skel" style="height:300px;border-radius:18px"></div>
        <div class="skel" style="height:300px;border-radius:18px"></div>
        <div class="skel" style="height:300px;border-radius:18px"></div>
        <div class="skel" style="height:300px;border-radius:18px"></div>
      </div>
    </div>`;
  }
})();
