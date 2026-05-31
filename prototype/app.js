// ====== PLASENCIA MARKETPLACE · App core ======
const $ = (s,el=document)=>el.querySelector(s);
const $$ = (s,el=document)=>[...el.querySelectorAll(s)];
const mxn = n => new Intl.NumberFormat('es-MX',{style:'currency',currency:'MXN',maximumFractionDigits:0}).format(n||0);
const num = n => new Intl.NumberFormat('es-MX').format(n||0);
const initials = s => (s||'').split(' ').filter(w=>/^[A-ZÁÉÍÓÚ]/.test(w[0]||'')).map(w=>w[0]).slice(0,2).join('').toUpperCase()||'P';
const FALLBACK='data:image/svg+xml;utf8,'+encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="400" height="250"><rect width="400" height="250" fill="#E2E8F0"/><text x="50%" y="50%" font-family="sans-serif" font-size="14" fill="#A0AEC0" text-anchor="middle" dy=".3em">Foto próximamente</text></svg>');
const MARCA_LOGOS={Mazda:'mazda',Hyundai:'hyundai',Nissan:'nissan',Chevrolet:'chevrolet',Kia:'kia',Ford:'ford',Jeep:'jeep',RAM:'ram',Dodge:'dodge',Fiat:'fiat',Peugeot:'peugeot',GAC:'gac',GWM:'gwm',Changan:'changan',Buick:'buick',GMC:'gmc',Foton:'foton',Isuzu:'isuzu',Infiniti:'infiniti'};
const marcaLogoSrc = m => MARCA_LOGOS[m]?`marcas/${MARCA_LOGOS[m]}.svg`:null;

const KEY='plasencia-mkt-v4';
let STATE = JSON.parse(localStorage.getItem(KEY) || 'null') || {customer:null, deals:[], pagos:[], servicios:[], citas:[], cotizaciones:[], favs:[], notifs:[]};
const save = ()=>localStorage.setItem(KEY, JSON.stringify(STATE));

const TASA=0.135;
const mensCredito=(p,e,n)=>{const cap=p*(1-e/100);const i=TASA/12;return i===0?cap/n:cap*i/(1-Math.pow(1+i,-n))};
const rentaLease=(p,n)=>{const f=n<=24?.032:n<=36?.026:.022;return p*f*1.16};
const folio=(m,t='GP')=>{const d=new Date();const p=x=>String(x).padStart(2,'0');return `${t}-${(m||'GEN').slice(0,3).toUpperCase()}-${String(d.getFullYear()%100)}${p(d.getMonth()+1)}${p(d.getDate())}-${p(d.getHours())}${p(d.getMinutes())}${p(d.getSeconds())}`};
const uid=p=>p+'-'+Math.random().toString(36).slice(2,8);

let CARS=[], MARCAS=[], SUCS=[];
const getSuc = id => SUCS.find(s=>s.id===id) || {nombre:'Plasencia',rating:4.8,reviews:0,zona:'',marca:'',desde:2000,autos:0};

// ====== HEADER / FOOTER ======
function header(){
  const route=(location.hash||'#/').split('?')[0];
  const c=STATE.customer;
  const link=(h,l)=>`<a href="${h}" class="${route===h?'on':''}">${l}</a>`;
  const unread=STATE.notifs.length;
  return `<header class="hdr"><div class="hdr-in">
    <a href="#/" class="logo"><img src="logo-negro.png" alt="Grupo Plasencia"><span class="tag">Marketplace</span></a>
    <nav class="nav">${link('#/catalogo','Catálogo')}${link('#/concesionarias','Concesionarias')}${link('#/flotillas','Flotillas')}<a href="#/catalogo?cond=nuevo">Nuevos</a><a href="#/catalogo?cond=seminuevo">Seminuevos</a><a href="#/catalogo?mod=lease">Autolease</a></nav>
    <div class="hdr-right">
      ${c?`<button class="notif-bell" onclick="go('#/cuenta?t=notif')" aria-label="Notificaciones">${I.bell(20)}${unread?'<span class="dot"></span>':''}</button>
        <a href="#/cuenta" class="acct"><span class="av">${initials(c.nombre)}</span><span>${c.nombre.split(' ')[0]}</span>${STATE.deals.length?`<span class="badge">${STATE.deals.length}</span>`:''}</a>`
        :`<button class="signin" onclick="Auth.open()">Iniciar sesión</button><button class="btn btn-conv btn-md" onclick="Auth.open('signup')">Crear cuenta</button>`}
    </div>
  </div></header>`;
}
function footer(){return `<footer class="ftr"><div class="ftr-in"><div class="ftr-grid">
  <div class="ftr-logo"><img src="logo-blanco.png" alt="Grupo Plasencia"><p>El marketplace de Grupo Plasencia: 12 concesionarias del grupo, 14 marcas y todo el ciclo de tu auto en un solo lugar.</p></div>
  <div><h4>Comprar</h4><ul><li onclick="go('#/catalogo?cond=nuevo')">Autos nuevos</li><li onclick="go('#/catalogo?cond=seminuevo')">Seminuevos certificados</li><li onclick="go('#/catalogo')">Catálogo cross-marca</li><li onclick="Plasi.open('Valuar mi auto actual')">Valuar mi auto</li></ul></div>
  <div><h4>Soluciones</h4><ul><li onclick="Flow.openCredito()">Plasencia Crédito</li><li onclick="go('#/catalogo?mod=lease')">GP Autolease</li><li onclick="go('#/flotillas')">Flotillas</li><li>Plasencia Seguros</li><li>Postventa</li></ul></div>
  <div><h4>Grupo Plasencia</h4><ul><li onclick="go('#/concesionarias')">12 concesionarias</li><li>75 años de historia</li><li>Trabaja con nosotros</li><li>Contacto</li></ul></div>
</div><div class="bottom"><span>© 2026 Grupo Plasencia Automotriz · Prototipo de producto</span><span style="color:var(--gold)">Marketplace · la experiencia ideal</span></div></div></footer>`;}
function updateHeader(){const h=$('.hdr');if(h)h.outerHTML=header()}

// ====== TOAST ======
function toast(msg,ic='check'){const t=document.createElement('div');t.className='toast';t.innerHTML=`<span class="ic">${I[ic](18)}</span>${msg}`;document.body.appendChild(t);setTimeout(()=>t.remove(),3000)}

// ====== MODAL ======
function showModal(html,size=''){closeModal();const d=document.createElement('div');d.className='modal-bg';d.id='modalBg';d.onclick=e=>{if(e.target===d)closeModal()};d.innerHTML=`<div class="modal-wrap ${size} fu"><button class="x" onclick="closeModal()" aria-label="Cerrar">${I.x(18)}</button><div class="modal-body">${html}</div></div>`;document.body.appendChild(d)}
function closeModal(){const m=$('#modalBg');if(m)m.remove()}

// ====== FAVS ======
function toggleFav(id,btn){
  const i=STATE.favs.indexOf(id);
  if(i>=0)STATE.favs.splice(i,1);else STATE.favs.push(id);
  save();
  if(btn){const on=STATE.favs.includes(id);btn.classList.toggle('on',on);btn.innerHTML=I.heart(18,on)}
  toast(STATE.favs.includes(id)?'Guardado en favoritos':'Removido de favoritos','heart');
}

// ====== ROUTER ======
function go(hash){location.hash=hash}
function render(){
  const app=$('#app');
  const hash=(location.hash||'#/').split('?')[0];
  const qs=new URLSearchParams((location.hash.split('?')[1]||''));
  let body='';
  if(hash==='#/'||hash==='#'||hash==='')body=Views.home();
  else if(hash==='#/catalogo'){FILT={q:qs.get('q')||'',cond:qs.get('cond')||'todos',marca:qs.get('marca')||'todas',tipo:'todas',max:99999999,shown:12};body=Views.catalogo();setTimeout(applyFilters,0)}
  else if(hash.startsWith('#/auto/'))body=Views.pdp(hash.replace('#/auto/',''));
  else if(hash==='#/concesionarias')body=Views.concesionarias();
  else if(hash.startsWith('#/concesionaria/'))body=Views.concesionaria(hash.replace('#/concesionaria/',''));
  else if(hash==='#/flotillas')body=Views.flotillas();
  else if(hash==='#/cuenta'){ATAB=qs.get('t')||'resumen';body=Views.cuenta()}
  else body=Views.home();
  app.innerHTML=header()+'<div class="fu">'+body+'</div>'+footer();
  window.scrollTo(0,0);
}

// ====== BOOT ======
fetch('catalogo.json').then(r=>r.json()).then(data=>{
  CARS=data.cars; SUCS=data.sucursales; MARCAS=[...new Set(CARS.map(c=>c.marca))].sort();
  window.addEventListener('hashchange',render);render();
}).catch(e=>{$('#app').innerHTML='<div class="loading">No se pudo cargar el catálogo: '+e+'</div>'});

Object.assign(window,{go,setF:(k,v)=>{FILT[k]=v;FILT.shown=12;applyFilters()},setFoto:(i)=>{PDP.foto=i;$('#galMain').src=PDP.v.fotos[i];$$('.gal-thumbs button').forEach((b,j)=>b.classList.toggle('on',j===i))},setMod:(m)=>{PDP.mod=m;PDP.plazo=m==='arrendamiento'?36:60;renderCockpit()},closeModal,toggleFav,toast});
