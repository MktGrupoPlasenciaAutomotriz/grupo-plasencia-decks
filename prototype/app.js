// ====== PLASENCIA MARKETPLACE v5 · App core ======
const $ = (s,el=document)=>el.querySelector(s);
const $$ = (s,el=document)=>[...el.querySelectorAll(s)];
const mxn = n => new Intl.NumberFormat('es-MX',{style:'currency',currency:'MXN',maximumFractionDigits:0}).format(n||0);
const num = n => new Intl.NumberFormat('es-MX').format(n||0);
const initials = s => (s||'').split(' ').filter(w=>/^[A-ZÁÉÍÓÚ]/.test(w[0]||'')).map(w=>w[0]).slice(0,2).join('').toUpperCase()||'P';
const FALLBACK='data:image/svg+xml;utf8,'+encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="400" height="250"><rect width="400" height="250" fill="#E2E8F0"/><text x="50%" y="50%" font-family="sans-serif" font-size="14" fill="#A0AEC0" text-anchor="middle" dy=".3em">Foto próximamente</text></svg>');

// Las 13 marcas NUEVAS oficiales que vende el grupo (KO-Estrategico, fuente oficial)
// NO incluye Nissan/Chevrolet/Kia/Buick/GMC/Foton/Infiniti — esas solo aparecen
// como seminuevos por trade-ins multi-marca, no son marcas representadas
const MARCAS_NUEVAS=['Mazda','Hyundai','Ford','Jeep','RAM','Dodge','Fiat','Peugeot','Chrysler','GAC','GWM','Changan','Isuzu'];
// Mapa marca → logo SVG (solo las 13 reales del grupo + Seminuevos como entidad)
const MARCA_LOGOS={Mazda:'mazda',Hyundai:'hyundai',Ford:'ford',Jeep:'jeep',RAM:'ram',Dodge:'dodge',Fiat:'fiat',Peugeot:'peugeot',GAC:'gac',GWM:'gwm',Changan:'changan',Isuzu:'isuzu',Seminuevos:'seminuevos'};
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

const KEY='plasencia-mkt-v7'; // bump: multi-perfil cross-cliente
const SESSION_KEY='plasencia-mkt-session';
const SESSION_TTL_MS = 30*60*1000; // 30 min de inactividad → desloguea

let STATE = JSON.parse(localStorage.getItem(KEY) || 'null') || {customer:null, reservas:[], garage:[], creditos:[], leases:[], pagos:[], servicios:[], citas:[], tradeins:[], watchlist:[], cotizaciones:[], notifs:[], seguros:[], documentos:[], direcciones:[], referidos:[], conversaciones:[], personas:[]};
['seguros','documentos','direcciones','referidos','conversaciones','personas'].forEach(k=>{if(!STATE[k])STATE[k]=[]});

// Sesion de login: vive en sessionStorage (se borra al cerrar tab/browser)
// + TTL de 30 min de inactividad. Para el piloto: cada sesion nueva pide login.
// El resto del state (reservas, garage, watchlist, demo data) persiste en localStorage.
STATE.customer = null;
try{
  const raw = sessionStorage.getItem(SESSION_KEY);
  if(raw){
    const parsed = JSON.parse(raw);
    if(parsed.customer && parsed.ts && (Date.now() - parsed.ts) < SESSION_TTL_MS){
      STATE.customer = parsed.customer;
    }else{
      sessionStorage.removeItem(SESSION_KEY);
    }
  }
}catch{}

const save = ()=>{
  const {customer, ...rest} = STATE;
  // localStorage: TODO menos customer
  localStorage.setItem(KEY, JSON.stringify({...rest, customer:null}));
  // sessionStorage: solo customer + timestamp (renovado en cada save)
  if(customer){
    sessionStorage.setItem(SESSION_KEY, JSON.stringify({customer, ts:Date.now()}));
  }else{
    sessionStorage.removeItem(SESSION_KEY);
  }
};
// Migración: limpia localStorage de versiones previas que tengan customer guardado ahí
save();

const TASA=0.135;
const mensCredito=(p,e,n)=>{const cap=p*(1-e/100);const i=TASA/12;return i===0?cap/n:cap*i/(1-Math.pow(1+i,-n))};
const rentaLease=(p,n)=>{const f=n<=24?.032:n<=36?.026:.022;return p*f*1.16};
const folio=(m,t='GP')=>{const d=new Date();const p=x=>String(x).padStart(2,'0');return `${t}-${(m||'GEN').slice(0,3).toUpperCase()}-${String(d.getFullYear()%100)}${p(d.getMonth()+1)}${p(d.getDate())}-${p(d.getHours())}${p(d.getMinutes())}${p(d.getSeconds())}`};
const uid=p=>p+'-'+Math.random().toString(36).slice(2,8);

let CARS=[], MARCAS=[], SUCS=[];

// Inventario PROXY · datos reales del KO-Estrategico + catalogo Seminuevos piloto
// El piloto Otero (8 lotes) muestra 239 unidades — eso es subset del grupo
// El grupo total Seminuevos cubre las 42 agencias y multi-marca (incluye trade-ins
// de Toyota, Nissan, VW, Renault que NO se venden nuevos)
// Volumen: ~800 facturas/mes (Mazda 403 + Hyundai 121 + GAC 39 + GWM 80 + resto)
const INVENTORY={
  total:2700, // 1,950 nuevos + 750 seminuevos certificados
  nuevos:1950,
  seminuevos:750, // grupo completo, multi-marca, ~12-15 lotes
  lotesSeminuevos:15, // estimacion del grupo (piloto Otero confirma 8 puntos)
  ciudades:['Guadalajara','Tepic','Colima','Manzanillo','Puerto Vallarta','San Luis Potosi','Mazatlan'],
  estados:6, // Jalisco, Nayarit, Colima, SLP, Sinaloa, Aguascalientes
  agencias:42, // 37-42 segun fuente; tomamos 42 (data ventas)
  // Solo las 13 marcas NUEVAS oficiales (KO-Estrategico). El grupo NO vende
  // Nissan/Chevrolet/Kia/Buick/GMC/Infiniti/Foton — pueden aparecer como seminuevos
  // por trade-ins multi-marca, pero no son marcas representadas con agencia.
  porMarca:{
    Mazda:780,    // 10-11 agencias · CPL mas eficiente · 403 facturas/mes
    Hyundai:420,  // 7 agencias · 121 facturas/mes
    GWM:165,      // 4 agencias · 319 facturas en 4 meses
    Ford:140,     // 4-5 agencias
    GAC:155,      // 4 agencias · 39 facturas/mes con escala creciente
    Changan:95,   // 3-4 agencias
    Jeep:55,      // Stellantis · 1-2 agencias dedicadas
    RAM:42,       // Stellantis comerciales
    Fiat:28,      // Stellantis
    Peugeot:25,   // Stellantis
    Dodge:18,     // Stellantis
    Chrysler:8,   // Stellantis
    Isuzu:55      // 2 agencias (comerciales/pesados)
  },
  // Las 12 sucursales destacadas del catalogo.json son una SELECCION; la realidad es 37-42 puntos
  // El directorio /concesionarias muestra las 12 + nota "y X mas en otros estados"
  porSucursal:{
    'bugambilias':95,'galerias':88,'santa-anita':74,'americas':92,'acueducto':85,
    'plasencia':110,'gonzalez-gallo':68,'hyundai-acueducto':82,'hyundai-vallarta':68,
    'stellantis-lcv':115,'stellantis-jeep':95,'gac-plasencia':65,'lopez-mateos':300
  }
};
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
          <a href="#/catalogo?cond=nuevo">Autos nuevos<span class="d">Las 13 marcas del grupo</span></a>
          <a href="#/catalogo?cond=seminuevo">Seminuevos certificados<span class="d">+750 unidades multi-marca · 167 puntos de inspección · ~15 lotes</span></a>
          <a href="#/catalogo">Catálogo cross-marca<span class="d">Todo el inventario en un solo lugar</span></a>
          <a href="#/concesionarias">Concesionarias<span class="d">Las ${INVENTORY.agencias} agencias del grupo en ${INVENTORY.estados} estados</span></a>
        </div></div>
      <div class="nav-item ${isOn(['#/trade-in'])?'on':''}"><a href="#/trade-in">Vender o cambiar</a></div>
      <div class="nav-item ${isOn(['#/credito','#/autolease','#/seguros'])?'on':''}"><a href="#/credito">Financiar y proteger ${I.chevD(14)}</a>
        <div class="submenu">
          <a href="#/credito">Plasencia Crédito<span class="d">Pre-aprobación sin afectar tu buró</span></a>
          <a href="#/autolease">GP Autolease<span class="d">Arrendamiento puro · deducible</span></a>
          <a href="#/seguros">Plasencia Seguros<span class="d">Cobertura amplia desde tu cuenta</span></a>
        </div></div>
      <div class="nav-item ${isOn(['#/flotillas','#/empresa'])?'on':''}"><a href="#/flotillas">Para tu empresa ${I.chevD(14)}</a>
        <div class="submenu">
          <a href="#/flotillas">Plasencia Flotillas<span class="d">Compra cross-marca para tu negocio · contrato marco</span></a>
          <a href="#/autolease">GP Autolease<span class="d">Arrendamiento puro deducible · PFAE y Pymes</span></a>
          <a href="#/seguros">Seguros corporativos<span class="d">Cobertura para flotilla completa</span></a>
          <a href="#/flotillas#servicio">Servicio para flotilla<span class="d">Mantenimiento programado en los 42 talleres</span></a>
        </div></div>
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
    <a href="#/concesionarias" onclick="toggleMobileNav()" class="sub">Las 42 agencias</a>
    <a href="#/trade-in" onclick="toggleMobileNav()">${I.trending(18)} Vender o cambiar mi auto</a>
    <a href="#/credito" onclick="toggleMobileNav()">${I.card(18)} Crédito</a>
    <a href="#/autolease" onclick="toggleMobileNav()">${I.key(18)} Autolease</a>
    <a href="#/seguros" onclick="toggleMobileNav()">${I.umbrella(18)} Seguros</a>
    <a href="#/flotillas" onclick="toggleMobileNav()">${I.briefcase(18)} Para tu empresa</a>
    <a href="#/flotillas" onclick="toggleMobileNav()" class="sub">Plasencia Flotillas</a>
    <a href="#/autolease" onclick="toggleMobileNav()" class="sub">GP Autolease (PFAE / Pyme)</a>
    <a href="#/seguros" onclick="toggleMobileNav()" class="sub">Seguros corporativos</a>
    ${c?`<a href="#/cuenta" onclick="toggleMobileNav()">${I.user(18)} Mi Plasencia</a>`:`<button onclick="toggleMobileNav();Auth.open()">${I.user(18)} Iniciar sesión</button><button onclick="toggleMobileNav();Auth.open('signup')" class="conv">Crear cuenta</button>`}
  </div></header>`;
}
function toggleMobileNav(){const n=$('#mobileNav');if(n)n.classList.toggle('open')}
function footer(){return `<footer class="ftr"><div class="ftr-in"><div class="ftr-grid">
  <div class="ftr-logo"><img src="logo-blanco.png" alt="Grupo Plasencia"><p>+${num(INVENTORY.total)} autos · 13 marcas · ${INVENTORY.agencias} agencias en ${INVENTORY.estados} estados del occidente de México · 75 años. El marketplace donde todo el ciclo de tu auto vive en un solo lugar.</p></div>
  <div><h4>Comprar</h4><ul><li onclick="go('#/catalogo?cond=nuevo')">Autos nuevos</li><li onclick="go('#/catalogo?cond=seminuevo')">Seminuevos certificados</li><li onclick="go('#/catalogo')">Catálogo cross-marca</li><li onclick="go('#/concesionarias')">Las 42 agencias</li></ul></div>
  <div><h4>Soluciones</h4><ul><li onclick="go('#/trade-in')">Vender o cambiar tu auto</li><li onclick="go('#/credito')">Plasencia Crédito</li><li onclick="go('#/autolease')">GP Autolease</li><li onclick="go('#/seguros')">Plasencia Seguros</li><li onclick="go('#/flotillas')">Flotillas empresariales</li></ul></div>
  <div><h4>Grupo Plasencia</h4><ul><li>75 años de historia</li><li>${INVENTORY.agencias} agencias en ${INVENTORY.ciudades.length} ciudades del occidente</li><li>13 marcas representadas</li><li>Trabaja con nosotros</li></ul></div>
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
  // Renovar timestamp de sesión en cada navegación (mantiene viva la sesión mientras el usuario interactúe)
  window.addEventListener('hashchange',()=>{if(STATE.customer)save();render()});
  render();
}).catch(e=>{$('#app').innerHTML='<div class="loading">No se pudo cargar el catálogo: '+e+'</div>'});

Object.assign(window,{go,setF:(k,v)=>{FILT[k]=v;FILT.shown=12;applyFilters()},setFoto:(i)=>{PDP.foto=i;$('#galMain').src=PDP.v.fotos[i];$$('.gal-thumbs button').forEach((b,j)=>b.classList.toggle('on',j===i))},setMod:(m)=>{PDP.mod=m;PDP.plazo=m==='arrendamiento'?36:60;renderCockpit()},closeModal,toggleFav,toast});
