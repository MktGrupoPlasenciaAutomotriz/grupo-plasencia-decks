// ====== PLASENCIA MARKETPLACE v5 · App core ======
const $ = (s,el=document)=>el.querySelector(s);
const $$ = (s,el=document)=>[...el.querySelectorAll(s)];
const mxn = n => new Intl.NumberFormat('es-MX',{style:'currency',currency:'MXN',maximumFractionDigits:0}).format(n||0);
const num = n => new Intl.NumberFormat('es-MX').format(n||0);
const initials = s => (s||'').split(' ').filter(w=>/^[A-ZÁÉÍÓÚ]/.test(w[0]||'')).map(w=>w[0]).slice(0,2).join('').toUpperCase()||'P';
const FALLBACK='data:image/svg+xml;utf8,'+encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="400" height="250"><rect width="400" height="250" fill="#E2E8F0"/><text x="50%" y="50%" font-family="sans-serif" font-size="14" fill="#A0AEC0" text-anchor="middle" dy=".3em">Foto próximamente</text></svg>');

// Mapa marca → logo SVG. "Multimarca" o sin logo = isotipo GP
const MARCA_LOGOS={Mazda:'mazda',Hyundai:'hyundai',Nissan:'nissan',Chevrolet:'chevrolet',Kia:'kia',Ford:'ford',Jeep:'jeep',RAM:'ram',Dodge:'dodge',Fiat:'fiat',Peugeot:'peugeot',GAC:'gac',GWM:'gwm',Changan:'changan',Buick:'buick',GMC:'gmc',Foton:'foton',Isuzu:'isuzu',Infiniti:'infiniti',Seminuevos:'seminuevos'};
// Mapa: id de sucursal → marca para el logo. Lopez Mateos = Plasencia Seminuevos
const SUC_MARCA={'bugambilias':'Mazda','galerias':'Mazda','santa-anita':'Mazda','americas':'Mazda','acueducto':'Mazda','plasencia':'Mazda','gonzalez-gallo':'Mazda','hyundai-acueducto':'Hyundai','hyundai-vallarta':'Hyundai','stellantis-lcv':'Stellantis','stellantis-jeep':'Jeep','gac-plasencia':'GAC','lopez-mateos':'Seminuevos'};
// Stellantis no tiene logo individual: usa Jeep o RAM según contexto, o isotipo GP
const STELLANTIS_FALLBACK='jeep';

function marcaLogoSrc(m){
  if(!m)return null;
  const k=MARCA_LOGOS[m]||(m==='Stellantis'?STELLANTIS_FALLBACK:null);
  return k?`marcas/${k}.svg`:null;
}
function sucLogoHTML(suc,size='sm'){
  const cls={sm:'seller-logo',md:'dealer-logo',lg:'seller-box-logo',xl:'logo-big'}[size]||'seller-logo';
  const marca=SUC_MARCA[suc.id]||suc.marca;
  const src=marcaLogoSrc(marca);
  if(src)return `<div class="${cls}"><img src="${src}" alt="${marca}"></div>`;
  return `<div class="${cls} gp">${size==='sm'?'GP':initials(suc.nombre)}</div>`;
}

const KEY='plasencia-mkt-v6';
let STATE = JSON.parse(localStorage.getItem(KEY) || 'null') || {customer:null, reservas:[], garage:[], creditos:[], leases:[], pagos:[], servicios:[], citas:[], tradeins:[], watchlist:[], cotizaciones:[], notifs:[], seguros:[]};
if(!STATE.seguros)STATE.seguros=[];
const save = ()=>localStorage.setItem(KEY, JSON.stringify(STATE));

const TASA=0.135;
const mensCredito=(p,e,n)=>{const cap=p*(1-e/100);const i=TASA/12;return i===0?cap/n:cap*i/(1-Math.pow(1+i,-n))};
const rentaLease=(p,n)=>{const f=n<=24?.032:n<=36?.026:.022;return p*f*1.16};
const folio=(m,t='GP')=>{const d=new Date();const p=x=>String(x).padStart(2,'0');return `${t}-${(m||'GEN').slice(0,3).toUpperCase()}-${String(d.getFullYear()%100)}${p(d.getMonth()+1)}${p(d.getDate())}-${p(d.getHours())}${p(d.getMinutes())}${p(d.getSeconds())}`};
const uid=p=>p+'-'+Math.random().toString(36).slice(2,8);

let CARS=[], MARCAS=[], SUCS=[];
const getSuc = id => SUCS.find(s=>s.id===id) || {nombre:'Plasencia',rating:4.8,reviews:0,zona:'',marca:'',desde:2000,autos:0,id:'lopez-mateos'};

// ====== HEADER definitivo · 4 verbos canónicos ======
function header(){
  const route=(location.hash||'#/').split('?')[0];
  const c=STATE.customer;
  const isOn=(prefixes)=>prefixes.some(p=>route.startsWith(p));
  const unread=STATE.notifs.length;
  return `<header class="hdr"><div class="hdr-in">
    <a href="#/" class="logo"><img src="logo-negro.png" alt="Grupo Plasencia"><span class="tag">Marketplace</span></a>
    <nav class="nav">
      <div class="nav-item ${isOn(['#/catalogo','#/concesionaria'])?'on':''}"><a href="#/catalogo">Comprar ${I.chevD(14)}</a>
        <div class="submenu">
          <a href="#/catalogo?cond=nuevo">Autos nuevos<span class="d">Las 14 marcas del grupo</span></a>
          <a href="#/catalogo?cond=seminuevo">Seminuevos certificados<span class="d">Con 167 puntos de inspección</span></a>
          <a href="#/catalogo">Catálogo cross-marca<span class="d">Todo el inventario en un solo lugar</span></a>
          <a href="#/concesionarias">Concesionarias<span class="d">Las 12 del grupo</span></a>
        </div></div>
      <div class="nav-item ${isOn(['#/trade-in'])?'on':''}"><a href="#/trade-in">Vender o cambiar</a></div>
      <div class="nav-item ${isOn(['#/credito','#/autolease','#/seguros'])?'on':''}"><a href="#/credito">Financiar y proteger ${I.chevD(14)}</a>
        <div class="submenu">
          <a href="#/credito">Plasencia Crédito<span class="d">Pre-aprobación sin afectar tu buró</span></a>
          <a href="#/autolease">GP Autolease<span class="d">Arrendamiento puro · deducible</span></a>
          <a href="#/seguros">Plasencia Seguros<span class="d">Cobertura amplia desde tu cuenta</span></a>
        </div></div>
      <div class="nav-item ${isOn(['#/flotillas'])?'on':''}"><a href="#/flotillas">Empresa</a></div>
    </nav>
    <div class="hdr-right">
      ${c?`<button class="notif-bell" onclick="go('#/cuenta?t=notificaciones')" aria-label="Notificaciones">${I.bell(20)}${unread?'<span class="dot"></span>':''}</button>
        <a href="#/cuenta" class="acct"><span class="av">${initials(c.nombre)}</span><span class="acct-nm">${c.nombre.split(' ')[0]}</span>${STATE.reservas.length?`<span class="badge">${STATE.reservas.length}</span>`:''}</a>`
        :`<button class="signin" onclick="Auth.open()">Entrar</button><button class="btn btn-conv btn-md" onclick="Auth.open('signup')">Crear cuenta</button>`}
      <button class="hmb" onclick="toggleMobileNav()" aria-label="Menú">${I.menu(22)}</button>
    </div>
  </div>
  <div class="mobile-nav" id="mobileNav">
    <a href="#/catalogo" onclick="toggleMobileNav()">${I.car(18)} Comprar</a>
    <a href="#/catalogo?cond=nuevo" onclick="toggleMobileNav()" class="sub">Autos nuevos</a>
    <a href="#/catalogo?cond=seminuevo" onclick="toggleMobileNav()" class="sub">Seminuevos certificados</a>
    <a href="#/concesionarias" onclick="toggleMobileNav()" class="sub">Las 12 concesionarias</a>
    <a href="#/trade-in" onclick="toggleMobileNav()">${I.trending(18)} Vender o cambiar mi auto</a>
    <a href="#/credito" onclick="toggleMobileNav()">${I.card(18)} Crédito</a>
    <a href="#/autolease" onclick="toggleMobileNav()">${I.key(18)} Autolease</a>
    <a href="#/seguros" onclick="toggleMobileNav()">${I.umbrella(18)} Seguros</a>
    <a href="#/flotillas" onclick="toggleMobileNav()">${I.briefcase(18)} Para empresas</a>
    ${c?`<a href="#/cuenta" onclick="toggleMobileNav()">${I.user(18)} Mi Plasencia</a>`:`<button onclick="toggleMobileNav();Auth.open()">${I.user(18)} Iniciar sesión</button><button onclick="toggleMobileNav();Auth.open('signup')" class="conv">Crear cuenta</button>`}
  </div></header>`;
}
function toggleMobileNav(){const n=$('#mobileNav');if(n)n.classList.toggle('open')}
function footer(){return `<footer class="ftr"><div class="ftr-in"><div class="ftr-grid">
  <div class="ftr-logo"><img src="logo-blanco.png" alt="Grupo Plasencia"><p>El marketplace de Grupo Plasencia: 12 concesionarias del grupo, 14 marcas y todo el ciclo de tu auto en un solo lugar.</p></div>
  <div><h4>Comprar</h4><ul><li onclick="go('#/catalogo?cond=nuevo')">Autos nuevos</li><li onclick="go('#/catalogo?cond=seminuevo')">Seminuevos certificados</li><li onclick="go('#/catalogo')">Catálogo cross-marca</li><li onclick="go('#/concesionarias')">Las 12 concesionarias</li></ul></div>
  <div><h4>Soluciones</h4><ul><li onclick="go('#/trade-in')">Vender o cambiar tu auto</li><li onclick="go('#/credito')">Plasencia Crédito</li><li onclick="go('#/autolease')">GP Autolease</li><li onclick="go('#/seguros')">Plasencia Seguros</li><li onclick="go('#/flotillas')">Flotillas empresariales</li></ul></div>
  <div><h4>Grupo Plasencia</h4><ul><li>75 años de historia</li><li>12 concesionarias en Jalisco y Nayarit</li><li>14 marcas representadas</li><li>Trabaja con nosotros</li></ul></div>
</div><div class="bottom"><span>© 2026 Grupo Plasencia Automotriz · Prototipo de producto</span><span style="color:var(--gold)">Marketplace · la experiencia ideal</span></div></div></footer>`;}
function updateHeader(){const h=$('.hdr');if(h)h.outerHTML=header()}

// ====== TOAST ======
function toast(msg,ic='check'){const t=document.createElement('div');t.className='toast';t.innerHTML=`<span class="ic">${I[ic](18)}</span>${msg}`;document.body.appendChild(t);setTimeout(()=>t.remove(),3000)}

// ====== MODAL ======
function showModal(html,size=''){closeModal();const d=document.createElement('div');d.className='modal-bg';d.id='modalBg';d.onclick=e=>{if(e.target===d)closeModal()};d.innerHTML=`<div class="modal-wrap ${size} fu"><button class="x" onclick="closeModal()" aria-label="Cerrar">${I.x(18)}</button><div class="modal-body">${html}</div></div>`;document.body.appendChild(d)}
function closeModal(){const m=$('#modalBg');if(m)m.remove()}

// ====== WATCHLIST ======
function toggleFav(id,btn){
  const i=STATE.watchlist.indexOf(id);
  if(i>=0)STATE.watchlist.splice(i,1);else STATE.watchlist.push(id);
  save();
  if(btn){const on=STATE.watchlist.includes(id);btn.classList.toggle('on',on);btn.innerHTML=I.heart(18,on)}
  toast(STATE.watchlist.includes(id)?'Agregado a tu watchlist':'Removido de watchlist','heart');
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
  else if(hash==='#/trade-in')body=Views.tradein();
  else if(hash==='#/credito')body=Views.credito();
  else if(hash==='#/autolease')body=Views.autolease();
  else if(hash==='#/seguros')body=Views.seguros();
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
