// ====== MI PLASENCIA · cuenta rearquitectada por dominios ======
let ATAB='resumen';
const Account={
view(){
  if(!STATE.customer){
    return `<div class="wrap" style="padding:80px 24px;text-align:center">
      <div style="color:var(--n300);margin-bottom:8px;display:inline-flex">${I.user(48)}</div>
      <h2 style="font-size:24px;color:var(--navy)">Inicia sesión para entrar a Mi Plasencia</h2>
      <p style="color:var(--n500);margin-top:8px;max-width:480px;margin-left:auto;margin-right:auto">Tu garage, reservas, crédito, autolease, trade-ins y citas en un solo lugar.</p>
      <div style="margin-top:24px;display:flex;gap:10px;justify-content:center"><button class="btn btn-conv btn-lg" onclick="Auth.open('signup')">Crear cuenta</button><button class="btn btn-out btn-lg" onclick="Auth.demo()">Continuar como demo</button></div>
    </div>`;
  }
  const c=STATE.customer;
  const TABS=[
    ['resumen','Resumen',I.user(14)],
    ['reservas','Mis reservas',I.cal(14),STATE.reservas.length],
    ['garage','Mi garage',I.garage(14),STATE.garage.length],
    ['watchlist','Watchlist',I.heart(14,true),STATE.watchlist.length],
    ['credito','Mi crédito',I.card(14),STATE.creditos.length],
    ['autolease','Mi autolease',I.key(14),STATE.leases.length],
    ['seguros','Mis seguros',I.umbrella(14),STATE.seguros.length],
    ['tradein','Mi trade-in',I.trending(14),STATE.tradeins.length],
    ['citas','Mis citas',I.cal(14),STATE.citas.length],
    ['servicios','Historial de servicio',I.wrench(14),STATE.servicios.length],
    ['pagos','Pagos',I.cash(14),STATE.pagos.length],
    ['documentos','Documentos',I.doc(14),STATE.documentos.length],
    ['mensajes','Mensajes',I.chat(14),STATE.conversaciones.length],
    ['referidos','Referidos',I.user(14),STATE.referidos.length],
    ['notificaciones','Notificaciones',I.bell(14),STATE.notifs.length],
    ['perfil','Mi perfil',I.user(14)],
  ];
  const walletPts=c.points||0;
  return `<section class="acct-cover"><div class="wrap">
    <div class="acct-av">${initials(c.nombre)}</div>
    <div class="acct-info">
      <h2>${c.nombre}</h2>
      <div class="sub"><span>${I.user(14)} Cliente desde ${c.desde||'2026'}</span><span>${I.shield(14)} ${c.kyc?'Identidad verificada':'KYC pendiente'}</span></div>
      <div class="badges">${c.preap?'<span class="bp bp-gold">Crédito pre-aprobado · '+mxn(c.linea||850000)+'</span>':'<span class="bp bp-navy">Cliente Plasencia</span>'}</div>
    </div>
    <div class="acct-wallet">
      <div class="lbl">Plasencia Points</div>
      <div class="v tnum">${num(walletPts)}</div>
      <div style="font-size:11px;color:rgba(255,255,255,.6);margin-top:2px">1 pt = $1 en servicio</div>
    </div>
  </div></section>
  <div class="wrap acct-shell"><aside class="acct-side"><nav class="acct-nav">${TABS.map(t=>`<button class="${ATAB===t[0]?'on':''}" onclick="Account.switchTab('${t[0]}')"><span class="ic">${t[2]}</span><span class="lbl">${t[1]}</span>${t[3]?` <span class="badge">${t[3]}</span>`:''}</button>`).join('')}</nav></aside>
    <main class="acct-main" id="acctMain">${Account._panel(ATAB)}</main>
  </div>`;
},

switchTab(tab){
  ATAB=tab;
  const url=new URL(location.href);url.hash='#/cuenta?t='+tab;history.replaceState(null,'',url.toString());
  const m=document.getElementById('acctMain');if(m){m.innerHTML=Account._panel(tab);m.scrollTop=0;window.scrollTo({top:Math.max(0,document.querySelector('.acct-cover')?.offsetHeight-20||0),behavior:'smooth'})}
  document.querySelectorAll('.acct-nav button').forEach(b=>b.classList.toggle('on',b.textContent.toLowerCase().includes(tab.replace('credito','crédito').replace('autolease','autolease'))||b.getAttribute('onclick')?.includes(`'${tab}'`)));
},

_panel(tab){
  const H={
    resumen:['Resumen','Tu actividad reciente y atajos a lo más usado.'],
    reservas:['Mis reservas','Autos que ya apartaste. Avanza pago, agenda entrega o consulta detalle sin perder tu progreso.'],
    garage:['Mi garage','Los autos que ya son tuyos. Servicio, garantía, papeles y trade-in cuando decidas renovar.'],
    watchlist:['Watchlist','Los autos que guardaste para volver. Compara, cotiza o apártalos cuando estés listo.'],
    credito:['Mi crédito','Tu línea Plasencia: saldo, mensualidad, próximo pago y estado de cuenta.'],
    autolease:['Mi autolease','Tu arrendamiento activo: pagos, vigencia, mantenimiento y opciones al cierre.'],
    seguros:['Mis seguros','Pólizas vigentes y siniestros. Renueva, reporta o cotiza nueva cobertura.'],
    tradein:['Mi trade-in','Valuaciones activas de tu auto actual. Acepta la oferta, agenda inspección o aplica como enganche.'],
    citas:['Mis citas','Test drives, entregas y servicios agendados. Reagenda o cancela cuando lo necesites.'],
    servicios:['Historial de servicio','Cada visita al taller con detalle, factura y kilometraje al momento.'],
    pagos:['Pagos','Movimientos de tu crédito, lease, seguros y servicios — todo en una vista.'],
    documentos:['Documentos','Factura, contrato, póliza, tarjeta de circulación, INE — siempre a la mano.'],
    mensajes:['Mensajes','Conversaciones con tus asesores y con Plasi. Continúa la última.'],
    referidos:['Programa de referidos','Invita y gana $2,500 en Points cada vez que alguien compre con Plasencia.'],
    notificaciones:['Notificaciones','Confirmaciones, recordatorios y alertas — todas en un solo lugar.'],
    perfil:['Mi perfil','Datos personales, direcciones, métodos de pago, preferencias y seguridad.'],
  };
  const [t,d]=H[tab]||H.resumen;
  return `<header class="panel-head"><h2>${t}</h2><p>${d}</p></header><div class="panel-body">${Account[tab]?.()||Account.resumen()}</div>`;
},

resumen(){
  const c=STATE.customer;
  const STATS=[
    ['Reservas',STATE.reservas.length,'reservas'],
    ['Mi garage',STATE.garage.length,'garage'],
    ['Crédito',STATE.creditos.length,'credito'],
    ['Autolease',STATE.leases.length,'autolease'],
    ['Seguros',STATE.seguros.length,'seguros'],
    ['Trade-ins',STATE.tradeins.length,'tradein'],
  ];
  return `<div class="stats-row">${STATS.map(s=>`<div class="stat-card" style="cursor:pointer" onclick="ATAB='${s[2]}';render()"><div class="l">${s[0]}</div><div class="v tnum">${s[1]}</div></div>`).join('')}</div>
  <div style="display:grid;grid-template-columns:2fr 1fr;gap:20px;margin-top:24px">
    <div>
      <h3 style="font-family:var(--disp);font-size:18px;color:var(--navy);margin-bottom:12px">Actividad reciente</h3>
      ${STATE.notifs.length?STATE.notifs.slice(0,5).map(n=>`<div class="notif-card"><div class="nic ${n.ic}">${I.check(18)}</div><div style="flex:1"><div style="font-family:var(--disp);font-size:14px;font-weight:700;color:var(--navy)">${n.t}</div><div style="font-size:12.5px;color:var(--n600);margin-top:2px">${n.d}</div><div class="ntime">${n.time}</div></div></div>`).join(''):`<div class="empty"><div class="ic">${I.bell(40)}</div><p>Aún no hay actividad. Explora el catálogo para empezar.</p><button class="btn btn-conv btn-md" style="margin-top:14px" onclick="go('#/catalogo')">Ver catálogo</button></div>`}
    </div>
    <div>
      <h3 style="font-family:var(--disp);font-size:18px;color:var(--navy);margin-bottom:12px">Acciones rápidas</h3>
      <div style="display:flex;flex-direction:column;gap:8px">
        ${STATE.creditos.length&&STATE.creditos[0].mensActual?`<button class="btn btn-conv btn-md btn-full" style="justify-content:flex-start" onclick="Flow.openSim('pagoCredito',{monto:${STATE.creditos[0].mensActual},folio:'${STATE.creditos[0].folio}'})">${I.cash(16)} Pagar mensualidad (${mxn(STATE.creditos[0].mensActual)})</button>`:''}
        ${STATE.leases.length?`<button class="btn btn-conv btn-md btn-full" style="justify-content:flex-start;background:var(--navy)" onclick="Flow.openSim('pagoLease',{monto:${STATE.leases[0].renta},folio:'${STATE.leases[0].folio}'})">${I.cash(16)} Pagar renta lease (${mxn(STATE.leases[0].renta)})</button>`:''}
        <button class="btn btn-out btn-md btn-full" style="justify-content:flex-start" onclick="Flow.openCita()">${I.cal(16)} Agendar servicio o test drive</button>
        <button class="btn btn-out btn-md btn-full" style="justify-content:flex-start" onclick="go('#/catalogo')">${I.car(16)} Explorar catálogo</button>
        <button class="btn btn-out btn-md btn-full" style="justify-content:flex-start" onclick="Flow.openTradein()">${I.trending(16)} Valuar mi auto</button>
        ${!c.preap?`<button class="btn btn-conv btn-md btn-full" style="justify-content:flex-start" onclick="Flow.openCredito()">${I.card(16)} Pre-aprobar crédito</button>`:''}
        <button class="btn btn-out btn-md btn-full" style="justify-content:flex-start;color:var(--red);border-color:var(--n200)" onclick="logout()">${I.logout(16)} Cerrar sesión</button>
      </div>
    </div>
  </div>`;
},

reservas(){
  if(!STATE.reservas.length)return Account._empty('reservas','Aún no apartas ningún auto','Cuando apartes un vehículo, vivirá aquí mientras avanza la entrega. Apartado reembolsable $5,000.',[['Explorar catálogo','#/catalogo','conv']]);
  return STATE.reservas.map(r=>`<div class="card-row">
    <img class="img" src="${r.img}" onerror="this.src='${FALLBACK}'">
    <div class="body">
      <h3>${r.marca} ${r.modelo} <span class="bp bp-gold" style="margin-left:6px">Apartado</span></h3>
      <div class="meta">Folio ${r.folio} · ${r.fecha}</div>
      <div class="info-grid">
        <div class="info-cell"><div class="k">Precio</div><div class="v tnum">${mxn(r.precio)}</div></div>
        <div class="info-cell"><div class="k">Apartado pagado</div><div class="v tnum">${mxn(r.apart)}</div></div>
      </div>
      <div class="progress-mile">
        <div class="mile done"><div class="dot">${I.check(12)}</div>Apartado</div><div class="mile-line done"></div>
        <div class="mile on"><div class="dot">2</div>Documentos</div><div class="mile-line"></div>
        <div class="mile"><div class="dot">3</div>Enganche</div><div class="mile-line"></div>
        <div class="mile"><div class="dot">4</div>Entrega</div>
      </div>
    </div>
    <div class="actions">
      <button class="btn btn-conv btn-md" onclick="Flow.openPagoMas('${r.carId}')">${I.cash(14)} Avanzar pago</button>
      <button class="btn btn-out btn-md" onclick="Flow.openCita('${r.carId}')">${I.cal(14)} Agendar entrega</button>
      <button class="btn btn-ghost btn-sm" onclick="go('#/auto/${r.carId}')">Ver detalle</button>
    </div>
  </div>`).join('');
},

garage(){
  if(!STATE.garage.length)return Account._empty('garage','Tu garage está vacío','Cuando compres con Plasencia, tu auto vivirá aquí: papeles digitales, próximo servicio, garantía, historial. Una sola fuente de verdad.',[['Explorar catálogo','#/catalogo','conv']]);
  return STATE.garage.map(g=>`<div class="card-row">
    <img class="img" src="${g.img}" onerror="this.src='${FALLBACK}'">
    <div class="body">
      <h3>${g.marca} ${g.modelo} ${g.anio}</h3>
      <div class="meta">Placas ${g.placas} · VIN ${(g.vin||'').slice(0,12)}… · Adquirido ${g.adquirido}</div>
      <div class="info-grid" style="grid-template-columns:repeat(4,1fr)">
        <div class="info-cell"><div class="k">Kilometraje</div><div class="v tnum">${num(g.km)} km</div></div>
        <div class="info-cell"><div class="k">Próximo servicio</div><div class="v">${g.proxServ}</div></div>
        <div class="info-cell"><div class="k">Garantía</div><div class="v" style="color:var(--green-d);font-size:12px">${g.garantia||'Vigente'}</div></div>
        <div class="info-cell"><div class="k">Verificación</div><div class="v">${g.proxVerif||'—'}</div></div>
      </div>
    </div>
    <div class="actions">
      <button class="btn btn-conv btn-md" onclick="Flow.openCita('${g.carId}')">${I.wrench(14)} Agendar servicio</button>
      <button class="btn btn-out btn-md" onclick="Flow.openSim('descargarFactura')">${I.doc(14)} Factura · Tarjeta</button>
      <button class="btn btn-out btn-md" onclick="Flow.openSeguro('${g.carId}')">${I.umbrella(14)} Asegurar</button>
      <button class="btn btn-ghost btn-sm" onclick="Flow.openTradein()">Cambiar este auto</button>
    </div>
  </div>`).join('');
},

watchlist(){
  if(!STATE.watchlist.length)return Account._empty('watchlist','Tu watchlist está vacía','Marca cualquier auto con el corazón desde el catálogo para guardarlo aquí y compararlo después.',[['Explorar catálogo','#/catalogo','conv']]);
  const items=STATE.watchlist.map(id=>CARS.find(c=>c.id===id)).filter(Boolean);
  if(!items.length)return Account._empty('watchlist','Tu watchlist se vació','Los autos que tenías ya no están disponibles.',[['Explorar catálogo','#/catalogo','conv']]);
  return `<div class="vgrid">${items.map(vcard).join('')}</div>`;
},

credito(){
  if(!STATE.creditos.length)return Account._empty('credito','Aún no tienes un crédito Plasencia','Pre-aprueba en 2 minutos sin afectar tu buró. Tasa fija 13.5% anual, hasta 60 meses.',[['Pre-aprobarme','#','conv','Flow.openCredito()']]);
  return STATE.creditos.map(cr=>{
    const usado=cr.saldoUsado||0;const disp=cr.linea-usado;const pctUsado=Math.round(usado/cr.linea*100);
    return `<div class="card-row" style="display:block">
    <div style="display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:14px">
      <div>
        <h3 style="font-size:18px;color:var(--navy)">Línea de crédito Plasencia</h3>
        <div style="font-size:12px;color:var(--n500)">Folio ${cr.folio} · Otorgada ${cr.fecha}</div>
        <span class="bp bp-${cr.estado==='pre-aprobado'?(usado>0?'green':'gold'):'green'}" style="margin-top:8px;display:inline-flex">${usado>0?'activo':cr.estado}</span>
      </div>
      <div style="text-align:right">
        <div style="font-family:var(--disp);font-size:11px;font-weight:700;text-transform:uppercase;color:var(--n500);letter-spacing:1px">Disponible</div>
        <div style="font-family:var(--disp);font-weight:900;font-size:28px;color:var(--navy)" class="tnum">${mxn(disp)}</div>
        <div style="font-size:11px;color:var(--n500)">de ${mxn(cr.linea)} · tasa ${cr.tasa}%</div>
      </div>
    </div>
    ${usado>0?`<div style="margin-top:18px"><div style="display:flex;justify-content:space-between;font-size:12px;color:var(--n600);margin-bottom:6px"><span>Saldo usado</span><span class="tnum">${mxn(usado)} (${pctUsado}%)</span></div><div style="height:8px;background:var(--n200);border-radius:99px;overflow:hidden"><div style="height:100%;width:${pctUsado}%;background:linear-gradient(90deg,var(--navy),var(--gold-d))"></div></div></div>`:''}
    <div class="info-grid" style="grid-template-columns:repeat(4,1fr);margin-top:18px">
      <div class="info-cell"><div class="k">Mensualidad</div><div class="v tnum">${mxn(cr.mensActual||0)}</div></div>
      <div class="info-cell"><div class="k">Próximo pago</div><div class="v">${cr.proxPago||'—'}</div></div>
      <div class="info-cell"><div class="k">Avance</div><div class="v">${cr.pagosHechos||0}/${cr.pagosTotal||60} meses</div></div>
      <div class="info-cell"><div class="k">Buró afectado</div><div class="v" style="color:var(--green-d)">No</div></div>
    </div>
    <div style="margin-top:16px;display:flex;gap:8px;flex-wrap:wrap">
      ${usado>0?`<button class="btn btn-conv btn-md" onclick="Flow.openSim('pagoCredito',{monto:${cr.mensActual},folio:'${cr.folio}',mes:${(cr.pagosHechos||0)+1},total:${cr.pagosTotal||60}})">${I.cash(14)} Pagar ${mxn(cr.mensActual)}</button>`:`<button class="btn btn-conv btn-md" onclick="go('#/catalogo')">Usar mi línea</button>`}
      <button class="btn btn-out btn-md" onclick="Flow.openSim('estadoCuenta')">${I.doc(14)} Estado de cuenta</button>
      <button class="btn btn-out btn-md" onclick="toast('Calendario abierto en demo')">${I.cal(14)} Calendario de pagos</button>
    </div>
  </div>`}).join('');
},

autolease(){
  if(!STATE.leases.length)return Account._empty('autolease','Aún no tienes un autolease','Arrendamiento puro deducible para PFAE y empresas. Plazos 24 a 48 meses.',[['Cotizar Autolease','#','conv','Flow.openLease()']]);
  return STATE.leases.map(al=>{
    const pct=Math.round((al.mesActual||0)/al.plazo*100);
    return `<div class="card-row" style="display:block">
    <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:14px;flex-wrap:wrap">
      <div>
        <h3 style="font-size:18px;color:var(--navy)">GP Autolease</h3>
        <div style="font-size:12px;color:var(--n500)">Folio ${al.folio} · Inicio ${al.fecha}</div>
        <span class="bp bp-${al.estado==='cotizado'?'gold':'green'}" style="margin-top:8px;display:inline-flex">${al.estado}</span>
      </div>
      <div style="text-align:right">
        <div style="font-family:var(--disp);font-size:11px;font-weight:700;text-transform:uppercase;color:var(--n500);letter-spacing:1px">Renta mensual</div>
        <div style="font-family:var(--disp);font-weight:900;font-size:28px;color:var(--navy)" class="tnum">${mxn(al.renta)}</div>
        <div style="font-size:11px;color:var(--n500)">${al.plazo} meses · IVA incluido</div>
      </div>
    </div>
    ${al.mesActual?`<div style="margin-top:18px"><div style="display:flex;justify-content:space-between;font-size:12px;color:var(--n600);margin-bottom:6px"><span>Mes ${al.mesActual} de ${al.plazo}</span><span class="tnum">${pct}%</span></div><div style="height:8px;background:var(--n200);border-radius:99px;overflow:hidden"><div style="height:100%;width:${pct}%;background:linear-gradient(90deg,var(--navy),var(--gold-d))"></div></div></div>`:''}
    <div class="info-grid" style="grid-template-columns:repeat(3,1fr);margin-top:18px">
      <div class="info-cell"><div class="k">Próxima renta</div><div class="v">${al.proxRenta||'—'}</div></div>
      <div class="info-cell"><div class="k">Pagos hechos</div><div class="v">${al.mesesPagados||0} meses</div></div>
      <div class="info-cell"><div class="k">Opción de compra al final</div><div class="v" style="color:var(--green-d)">Sí</div></div>
    </div>
    <div style="margin-top:16px;display:flex;gap:8px;flex-wrap:wrap">
      <button class="btn btn-conv btn-md" onclick="Flow.openSim('pagoLease',{monto:${al.renta},folio:'${al.folio}',mes:${al.mesActual||1},total:${al.plazo}})">${I.cash(14)} Pagar renta ${mxn(al.renta)}</button>
      <button class="btn btn-out btn-md" onclick="Flow.openSim('descargarContrato')">${I.doc(14)} Contrato</button>
      <button class="btn btn-out btn-md" onclick="Flow.openCita()">${I.wrench(14)} Mantenimiento</button>
    </div>
  </div>`}).join('');
},

seguros(){
  if(!STATE.seguros.length)return Account._empty('seguros','Aún no tienes seguro contratado','Cobertura amplia respaldada por GNP, gestionada desde tu cuenta Plasencia. Cotiza en 2 minutos.',[['Cotizar seguro','#','conv','Flow.openSeguro()']]);
  return STATE.seguros.map(s=>`<div class="card-row" style="display:block">
    <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:14px;flex-wrap:wrap">
      <div>
        <h3 style="font-size:18px;color:var(--navy)">${s.aseguradora}</h3>
        <div style="font-size:12px;color:var(--n500)">Póliza ${s.poliza} · ${s.modelo||''}</div>
        <span class="bp bp-${s.estado==='vigente'?'green':'gold'}" style="margin-top:8px;display:inline-flex">${s.estado}</span>
      </div>
      <div style="text-align:right">
        <div style="font-family:var(--disp);font-size:11px;font-weight:700;text-transform:uppercase;color:var(--n500);letter-spacing:1px">Prima ${s.frecuencia}</div>
        <div style="font-family:var(--disp);font-weight:900;font-size:28px;color:var(--navy)" class="tnum">${mxn(s.prima)}</div>
        <div style="font-size:11px;color:var(--n500)">${s.cobertura}</div>
      </div>
    </div>
    <div class="info-grid" style="grid-template-columns:repeat(3,1fr);margin-top:18px">
      <div class="info-cell"><div class="k">Vigencia</div><div class="v">${s.vigencia}</div></div>
      <div class="info-cell"><div class="k">Deducible</div><div class="v">${s.deducible}</div></div>
      <div class="info-cell"><div class="k">Asistencia 24/7</div><div class="v" style="color:var(--green-d)">Incluida</div></div>
    </div>
    <div style="margin-top:16px;display:flex;gap:8px;flex-wrap:wrap">
      <button class="btn btn-conv btn-md" onclick="Flow.openSim('reportarSiniestro')">${I.phone(14)} Reportar siniestro</button>
      <button class="btn btn-out btn-md" onclick="Flow.openSim('descargarPoliza')">${I.doc(14)} Descargar póliza</button>
      <button class="btn btn-out btn-md" onclick="Flow.openSim('pagoPrima',{monto:${s.prima},folio:'${s.folio}'})">${I.cycle(14)} Renovar (${mxn(s.prima)})</button>
    </div>
  </div>`).join('');
},

pagos(){
  if(!STATE.pagos.length)return Account._empty('pagos','Sin movimientos registrados','Aquí verás todos los pagos de tu crédito, autolease, seguros y servicios.',[]);
  return `<div style="background:#fff;border:1px solid var(--n200);border-radius:14px;overflow:hidden">
    <table style="width:100%;border-collapse:collapse">
      <thead><tr style="background:var(--n50);text-align:left"><th style="padding:14px;font-family:var(--disp);font-size:11px;font-weight:800;color:var(--n500);text-transform:uppercase;letter-spacing:.5px">Fecha</th><th style="padding:14px;font-family:var(--disp);font-size:11px;font-weight:800;color:var(--n500);text-transform:uppercase;letter-spacing:.5px">Concepto</th><th style="padding:14px;font-family:var(--disp);font-size:11px;font-weight:800;color:var(--n500);text-transform:uppercase;letter-spacing:.5px">Método</th><th style="padding:14px;text-align:right;font-family:var(--disp);font-size:11px;font-weight:800;color:var(--n500);text-transform:uppercase;letter-spacing:.5px">Monto</th></tr></thead>
      <tbody>${STATE.pagos.map(p=>`<tr style="border-top:1px solid var(--n100)"><td style="padding:14px;font-size:13px;color:var(--n600)">${p.fecha}</td><td style="padding:14px;font-size:13px;color:var(--navy);font-weight:600">${p.concepto}</td><td style="padding:14px;font-size:12px;color:var(--n500)">${p.metodo}</td><td style="padding:14px;text-align:right;font-family:var(--disp);font-weight:700;color:var(--navy)" class="tnum">${mxn(p.monto)}</td></tr>`).join('')}</tbody>
    </table>
  </div>`;
},

servicios(){
  if(!STATE.servicios.length)return Account._empty('servicios','Sin historial de servicio','Aquí verás cada servicio que hagas en cualquiera de las 12 concesionarias.',[['Agendar servicio','#','conv','Flow.openCita()']]);
  return STATE.servicios.map(s=>`<div class="card-row">
    <div class="body" style="width:100%">
      <h3>${s.tipo}</h3>
      <div class="meta">${s.suc} · ${s.fecha} · ${num(s.km)} km</div>
      <div style="font-size:13px;color:var(--n600);margin-top:8px">${s.detalle}</div>
    </div>
    <div class="actions">
      <div style="font-family:var(--disp);font-weight:800;color:var(--navy);font-size:18px" class="tnum">${mxn(s.monto)}</div>
      <button class="btn btn-out btn-sm" onclick="Flow.openSim('descargarFactura')">${I.doc(14)} Factura</button>
    </div>
  </div>`).join('');
},

tradein(){
  if(!STATE.tradeins.length)return Account._empty('tradein','Sin valuaciones activas','Valúa tu auto actual y aplícalo como enganche o véndelo en efectivo.',[['Valuar mi auto','#','conv','Flow.openTradein()']]);
  return STATE.tradeins.map(t=>`<div class="card-row" style="display:block">
    <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:14px;flex-wrap:wrap">
      <div>
        <h3 style="font-size:18px;color:var(--navy)">${t.marca} ${t.anio} · ${num(t.km)} km</h3>
        <div style="font-size:12px;color:var(--n500)">Folio ${t.folio} · ${t.fecha}</div>
        <span class="bp bp-gold" style="margin-top:8px;display:inline-flex">${t.estado} · ${t.vigencia} días vigencia</span>
      </div>
      <div style="text-align:right">
        <div style="font-family:var(--disp);font-size:11px;font-weight:700;text-transform:uppercase;color:var(--n500);letter-spacing:1px">Oferta firme</div>
        <div style="font-family:var(--disp);font-weight:900;font-size:28px;color:var(--navy)" class="tnum">${mxn(t.oferta)}</div>
        ${t.bonus?`<div style="font-size:11px;color:var(--green-d);font-weight:700">+ ${mxn(t.bonus)} bonus si cambias</div>`:''}
      </div>
    </div>
    <div style="margin-top:14px;font-size:13px;color:var(--n600)">Camino elegido: <b style="color:var(--navy);font-family:var(--disp)">${t.path==='cambio'?'Cambiar por seminuevo':t.path==='efectivo'?'Vender en efectivo':'Mantener oferta firme'}</b></div>
    <div style="margin-top:16px;display:flex;gap:8px;flex-wrap:wrap">
      ${t.path==='cambio'?`<button class="btn btn-conv btn-md" onclick="go('#/catalogo?cond=seminuevo')">Ver seminuevos</button>`:`<button class="btn btn-conv btn-md" onclick="toast('Oferta aceptada · te contactamos hoy mismo')">${I.check(14)} Aceptar oferta</button>`}
      <button class="btn btn-out btn-md" onclick="Flow.openCita()">${I.cal(14)} Agendar inspección</button>
    </div>
  </div>`).join('');
},

citas(){
  if(!STATE.citas.length)return Account._empty('citas','Sin citas agendadas','Agenda test drive, valuación o servicio en cualquiera de las 12 concesionarias.',[['Agendar cita','#','conv','Flow.openCita()']]);
  return STATE.citas.map(c=>`<div class="card-row">
    <div class="body" style="width:100%">
      <h3>${c.motivo} <span class="bp bp-blue" style="margin-left:6px">${c.dia} · ${c.hora}</span></h3>
      <div class="meta">Folio ${c.folio} · ${c.sucName}</div>
    </div>
    <div class="actions">
      <button class="btn btn-out btn-md" onclick="Flow.openCita('${c.carId||''}')">${I.cal(14)} Reagendar</button>
      <button class="btn btn-ghost btn-sm" style="color:var(--red)" onclick="if(confirm('¿Cancelar esta cita?')){STATE.citas=STATE.citas.filter(x=>x.id!=='${c.id}');save();render();toast('Cita cancelada','check')}">Cancelar</button>
    </div>
  </div>`).join('');
},

notificaciones(){
  if(!STATE.notifs.length)return Account._empty('notificaciones','Sin notificaciones','Aquí aparecerán confirmaciones, recordatorios y alertas.',[]);
  return STATE.notifs.map(n=>`<div class="notif-card"><div class="nic ${n.ic}">${I.check(18)}</div><div style="flex:1"><div style="font-family:var(--disp);font-size:14px;font-weight:700;color:var(--navy)">${n.t}</div><div style="font-size:12.5px;color:var(--n600);margin-top:2px">${n.d}</div><div class="ntime">${n.time}</div></div></div>`).join('');
},

perfil(){
  const c=STATE.customer;
  const dirs=STATE.direcciones||[];
  return `<div style="display:grid;grid-template-columns:1fr 1fr;gap:24px">
    <div>
      <h3 style="font-family:var(--disp);font-size:18px;color:var(--navy);margin-bottom:14px">Datos personales</h3>
      <div class="field"><label>Nombre completo</label><input value="${c.nombre}"></div>
      <div class="field"><label>Correo electrónico</label><input value="${c.email}"></div>
      <div class="field"><label>Teléfono</label><input value="${c.tel||''}"></div>
      <div class="field-row"><div class="field"><label>RFC</label><input value="${c.rfc||''}" placeholder="Para facturación"></div><div class="field"><label>CURP</label><input placeholder="Opcional"></div></div>
      <button class="btn btn-conv btn-md" onclick="toast('Datos guardados')">Guardar cambios</button>

      <h3 style="font-family:var(--disp);font-size:18px;color:var(--navy);margin:28px 0 14px">Mis direcciones</h3>
      ${dirs.map(d=>`<div style="background:#fff;border:1px solid var(--n200);border-radius:12px;padding:14px;margin-bottom:10px"><div style="display:flex;justify-content:space-between;align-items:flex-start;gap:8px"><div><div style="font-family:var(--disp);font-weight:800;color:var(--navy);font-size:14px;display:flex;align-items:center;gap:6px">${I.pin(14)} ${d.etiqueta}${d.default?'<span class="bp bp-gold" style="font-size:9px">Principal</span>':''}</div><div style="font-size:13px;color:var(--n700);margin-top:4px">${d.calle}</div><div style="font-size:12px;color:var(--n500)">${d.colonia} · ${d.cp} · ${d.municipio}, ${d.estado}</div><div style="margin-top:8px;display:flex;gap:6px;flex-wrap:wrap">${d.paraEntrega?'<span class="bp bp-blue" style="font-size:10px">Entrega</span>':''}${d.paraFactura?'<span class="bp bp-navy" style="font-size:10px">Facturación</span>':''}</div></div><button class="btn btn-ghost btn-sm">Editar</button></div></div>`).join('')}
      <button class="btn btn-out btn-md btn-full" style="justify-content:flex-start" onclick="toast('Agregar dirección · demo')">${I.plus(14)} Agregar dirección</button>

      <h3 style="font-family:var(--disp);font-size:18px;color:var(--navy);margin:28px 0 14px">Preferencias de comunicación</h3>
      <div style="background:#fff;border:1px solid var(--n200);border-radius:12px;padding:6px">
        ${[['WhatsApp para confirmaciones de cita',true],['Correo con resumen mensual de mi crédito',true],['SMS solo para alertas críticas',true],['Ofertas y promociones (opt-in)',false],['Newsletter Plasencia (mensual)',false]].map(p=>`<label style="display:flex;align-items:center;gap:12px;padding:12px 14px;border-bottom:1px solid var(--n100);cursor:pointer"><span style="flex:1;font-size:13.5px;color:var(--navy)">${p[0]}</span><input type="checkbox" ${p[1]?'checked':''} style="width:18px;height:18px;accent-color:var(--red)"></label>`).join('')}
      </div>
    </div>
    <div>
      <h3 style="font-family:var(--disp);font-size:18px;color:var(--navy);margin-bottom:14px">Wallet · Métodos de pago</h3>
      <div style="background:linear-gradient(135deg,var(--navy),var(--navy-d));color:#fff;border-radius:14px;padding:18px;position:relative;overflow:hidden">
        <div style="position:absolute;inset:0;background:radial-gradient(ellipse at top right,rgba(236,201,75,.15),transparent 60%);pointer-events:none"></div>
        <div style="position:relative">
          <div style="font-family:var(--disp);font-size:11px;font-weight:700;text-transform:uppercase;color:var(--gold);letter-spacing:1px">Visa principal</div>
          <div style="font-family:var(--disp);font-weight:700;font-size:18px;margin-top:6px;letter-spacing:2px">•••• •••• •••• 6411</div>
          <div style="display:flex;justify-content:space-between;font-size:11px;color:rgba(255,255,255,.6);margin-top:14px"><span>${c.nombre.toUpperCase()}</span><span>12/29</span></div>
        </div>
      </div>
      <button class="btn btn-out btn-md btn-full" style="margin-top:10px;justify-content:flex-start">${I.plus(14)} Agregar método de pago</button>

      <h3 style="font-family:var(--disp);font-size:18px;color:var(--navy);margin:28px 0 14px">Plasencia Points</h3>
      <div class="stat-card"><div class="l">Disponibles</div><div class="v tnum">${num(c.points||0)} pts</div><div style="font-size:11px;color:var(--n500);margin-top:4px">Acumulas 1 pt por cada $100 en servicio o postventa. Canjea en cualquier agencia.</div></div>
      <button class="btn btn-out btn-md btn-full" style="margin-top:10px;justify-content:flex-start" onclick="ATAB='referidos';render()">${I.user(14)} Programa de referidos · $2,500 por invitado</button>

      <h3 style="font-family:var(--disp);font-size:18px;color:var(--navy);margin:28px 0 14px">Seguridad</h3>
      <div style="background:#fff;border:1px solid var(--n200);border-radius:12px;padding:6px">
        <button class="btn btn-ghost btn-md btn-full" style="justify-content:space-between;padding:14px;border-bottom:1px solid var(--n100);border-radius:0">Cambiar contraseña ${I.chevR(16)}</button>
        <button class="btn btn-ghost btn-md btn-full" style="justify-content:space-between;padding:14px;border-bottom:1px solid var(--n100);border-radius:0">Autenticación de 2 factores ${I.chevR(16)}</button>
        <button class="btn btn-ghost btn-md btn-full" style="justify-content:space-between;padding:14px;border-radius:0">Dispositivos conectados ${I.chevR(16)}</button>
      </div>

      <h3 style="font-family:var(--disp);font-size:18px;color:var(--navy);margin:28px 0 14px">Mi cuenta Plasencia</h3>
      <div style="display:flex;flex-direction:column;gap:8px">
        <button class="btn btn-ghost btn-md btn-full" style="justify-content:flex-start;color:var(--n600)">${I.doc(14)} Exportar mis datos</button>
        <button class="btn btn-ghost btn-md btn-full" style="justify-content:flex-start;color:var(--red)" onclick="if(confirm('¿Cerrar sesión?'))logout()">${I.logout(14)} Cerrar sesión</button>
        <button class="btn btn-ghost btn-md btn-full" style="justify-content:flex-start;color:var(--n400);font-size:12px" onclick="if(confirm('¿Eliminar permanentemente tu cuenta? Esta acción no se puede deshacer.'))toast('Demo: eliminar cuenta')">${I.x(14)} Eliminar cuenta</button>
      </div>
    </div>
  </div>`;
},

documentos(){
  if(!STATE.documentos.length)return Account._empty('documentos','Sin documentos guardados','Cuando compres, asegures o agendes con Plasencia, tus documentos vivirán aquí.',[]);
  const cats={compra:'Compra',vehiculo:'Vehículo',seguro:'Seguro',financiero:'Financiero',personal:'Personal'};
  const grouped={};STATE.documentos.forEach(d=>{(grouped[d.categoria]=grouped[d.categoria]||[]).push(d)});
  return Object.entries(grouped).map(([cat,docs])=>`<div style="margin-bottom:24px">
    <h3 style="font-family:var(--disp);font-size:14px;font-weight:800;text-transform:uppercase;color:var(--n500);letter-spacing:.5px;margin-bottom:10px">${cats[cat]||cat}</h3>
    <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:10px">
      ${docs.map(d=>`<div style="background:#fff;border:1px solid var(--n200);border-radius:12px;padding:14px;display:flex;align-items:center;gap:12px">
        <div style="width:42px;height:42px;border-radius:10px;background:linear-gradient(135deg,var(--n50),var(--n100));color:var(--navy);display:flex;align-items:center;justify-content:center;flex-shrink:0">${I.doc(20)}</div>
        <div style="flex:1;min-width:0"><div style="font-family:var(--disp);font-size:14px;font-weight:700;color:var(--navy)">${d.tipo}</div><div style="font-size:11px;color:var(--n500);overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${d.nombre} · ${d.fecha} · ${d.tamano}</div></div>
        <button class="btn btn-out btn-sm" onclick="Flow.openSim('descargarFactura')">${I.doc(14)}</button>
      </div>`).join('')}
    </div></div>`).join('')+`<button class="btn btn-out btn-md" style="margin-top:14px" onclick="toast('Sube documentos desde tu teléfono')">${I.upload(14)} Subir documento</button>`;
},

mensajes(){
  if(!STATE.conversaciones.length)return Account._empty('mensajes','Sin conversaciones','Cuando hables con un asesor, Plasi o un taller, las conversaciones vivirán aquí.',[['Hablar con Plasi','#','conv',`Plasi.open()`]]);
  return STATE.conversaciones.map(c=>`<div class="card-row" style="cursor:pointer" onclick="${c.asesor.startsWith('Plasi')?`Plasi.open()`:`toast('Demo: abrir conversación con '+'${c.asesor}'.split(' · ')[0])`}">
    <div style="width:48px;height:48px;border-radius:99px;background:${c.asesor.startsWith('Plasi')?'transparent':'linear-gradient(135deg,var(--navy),var(--slate))'};color:#fff;font-family:var(--disp);font-weight:900;font-size:18px;display:flex;align-items:center;justify-content:center;flex-shrink:0">${c.asesor.startsWith('Plasi')?I.plasi(48):initials(c.asesor)}</div>
    <div class="body">
      <div style="display:flex;justify-content:space-between;align-items:center;gap:8px"><h3 style="font-size:15px">${c.asesor}</h3><span style="font-size:11px;color:var(--n500)">${c.hora}</span></div>
      <div style="font-size:13px;color:var(--n600);margin-top:4px;overflow:hidden;text-overflow:ellipsis;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical">${c.ultima}</div>
    </div>
    ${c.unread?`<div style="background:var(--red);color:#fff;min-width:22px;height:22px;border-radius:99px;display:flex;align-items:center;justify-content:center;font-family:var(--disp);font-size:11px;font-weight:800;padding:0 7px">${c.unread}</div>`:''}
  </div>`).join('');
},

referidos(){
  const ganado=(STATE.referidos||[]).reduce((s,r)=>s+(r.recompensa||0),0);
  const link='plasencia.mx/r/'+(STATE.customer?.email||'demo').split('@')[0];
  return `<div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-bottom:24px">
    <div class="stat-card"><div class="l">Referidos enviados</div><div class="v tnum">${STATE.referidos.length}</div></div>
    <div class="stat-card"><div class="l">Ganado en bonus</div><div class="v tnum" style="color:var(--gold-d)">${mxn(ganado)}</div></div>
  </div>
  <div style="background:linear-gradient(135deg,var(--navy),var(--navy-d));color:#fff;border-radius:18px;padding:24px;margin-bottom:24px;position:relative;overflow:hidden">
    <div style="position:absolute;inset:0;background:radial-gradient(ellipse at top right,rgba(236,201,75,.2),transparent 60%);pointer-events:none"></div>
    <div style="position:relative">
      <div style="font-family:var(--disp);font-size:11px;font-weight:700;text-transform:uppercase;color:var(--gold);letter-spacing:1px">Invita y gana</div>
      <h3 style="font-size:22px;margin-top:4px">Comparte el grupo, gana $2,500</h3>
      <p style="font-size:13px;color:rgba(255,255,255,.8);margin-top:6px;max-width:480px">Por cada persona que invites y compre con Plasencia, recibes $2,500 en Plasencia Points (válido en servicio, refacciones o tu próximo enganche).</p>
      <div style="display:flex;gap:8px;margin-top:18px;background:rgba(255,255,255,.1);border:1px solid rgba(255,255,255,.2);border-radius:12px;padding:6px;align-items:center"><input value="${link}" readonly style="flex:1;background:transparent;border:none;color:#fff;font-family:var(--disp);font-size:13px;padding:8px 10px;outline:none"><button class="btn btn-gold btn-sm" onclick="navigator.clipboard?.writeText('${link}');toast('Link copiado')">Copiar</button></div>
    </div>
  </div>
  ${STATE.referidos.length?STATE.referidos.map(r=>`<div class="card-row">
    <div style="width:48px;height:48px;border-radius:99px;background:linear-gradient(135deg,var(--navy),var(--slate));color:var(--gold);font-family:var(--disp);font-weight:900;display:flex;align-items:center;justify-content:center;flex-shrink:0">${initials(r.nombre)}</div>
    <div class="body">
      <h3 style="font-size:15px">${r.nombre}</h3>
      <div class="meta">${r.email} · invitado ${r.fecha}</div>
      <span class="bp bp-${r.estado==='compró'?'green':'gold'}" style="margin-top:8px;display:inline-flex">${r.estado}</span>
    </div>
    <div class="actions" style="min-width:140px"><div style="font-family:var(--disp);font-weight:800;color:${r.recompensa>0?'var(--gold-d)':'var(--n400)'}" class="tnum">${r.recompensa>0?'+'+mxn(r.recompensa):'Pendiente'}</div></div>
  </div>`).join(''):''}`;
},

_empty(key,t,d,ctas){
  const iconMap={reservas:'cal',garage:'garage',watchlist:'heart',credito:'card',autolease:'key',seguros:'umbrella',tradein:'trending',citas:'cal',servicios:'wrench',pagos:'cash',documentos:'doc',mensajes:'chat',referidos:'user',notificaciones:'bell'};
  return `<div class="empty">
    <div class="ic">${I[iconMap[key]||'car'](48)}</div>
    <h3 style="font-family:var(--disp);font-size:18px;color:var(--navy);margin-top:8px">${t}</h3>
    <p style="max-width:480px;margin:6px auto 0">${d}</p>
    ${ctas.length?`<div style="margin-top:20px;display:flex;gap:8px;justify-content:center">${ctas.map(c=>`<button class="btn btn-${c[2]||'out'} btn-md" onclick="${c[3]||`go('${c[1]}')`}">${c[0]}</button>`).join('')}</div>`:''}
  </div>`;
},
};
window.Account=Account;

// ====== PLASI · Asistente IA del Grupo (claude-sonnet-4-5) ======
// Endpoint real en crm-worker bajo /api/lead/plasi-marketplace (bypass CF Access).
// Si falla o no responde, cae a respuestas locales transparentemente.
const PLASI_ENDPOINT=window.PLASI_ENDPOINT||'https://crm-plasencia.grupo-plasencia-automotriz.workers.dev/api/lead/plasi-marketplace';

const Plasi={
  history:[],
  open(seed){
    closeModal();
    const existing=$('#plasiPanel');if(existing)existing.remove();
    const el=document.createElement('div');
    el.className='plasi-panel fu';el.id='plasiPanel';
    el.innerHTML=`<div class="plasi-hd">
      <div class="av-iso">${I.plasi(40)}</div>
      <div><div class="nm">Plasi</div><div class="st"><span class="dot"></span>Asistente IA · Dirección de Marketing GP</div></div>
      <button class="x" onclick="Plasi.close()" aria-label="Cerrar">${I.x(18)}</button>
    </div>
    <div class="plasi-intro"><b>Plasi</b> es la IA institucional del grupo. Conoce el catálogo completo, los 12 talleres, las formas de pago y políticas. Te ayudo a decidir.</div>
    <div class="plasi-msgs" id="plasiMsgs"></div>
    <div class="plasi-in"><input id="plasiIn" placeholder="Pregúntame lo que sea…" onkeydown="if(event.key==='Enter'){Plasi.send(this.value);this.value=''}"><button onclick="var i=document.getElementById('plasiIn');Plasi.send(i.value);i.value=''" aria-label="Enviar">${I.send(18)}</button></div>`;
    document.body.appendChild(el);
    const btn=document.getElementById('plasiBtn');if(btn)btn.style.display='none';
    this.greet(seed);
  },
  close(){const p=$('#plasiPanel');if(p)p.remove();const btn=document.getElementById('plasiBtn');if(btn)btn.style.display='flex'},
  greet(seed){
    const m=$('#plasiMsgs');if(!m)return;
    this.history=[];m.innerHTML='';
    this.say('bot','¡Hola! Soy Plasi, la asistente IA de Grupo Plasencia. Puedo ayudarte a elegir auto, calcular crédito o arrendamiento, valuar el tuyo, contratar seguro o agendar cita en cualquiera de las 12 agencias.');
    ['¿Qué SUV me conviene para familia de 4?','Quiero cotizar arrendamiento','¿Cuánto vale mi auto actual?','Compara Mazda CX-30 vs Hyundai Tucson'].forEach(s=>this.say('sug',s));
    if(seed)setTimeout(()=>this.send(seed),300);
  },
  say(kind,txt){
    const m=$('#plasiMsgs');if(!m)return;
    if(kind==='sug'){m.insertAdjacentHTML('beforeend',`<button class="psug" onclick="Plasi.send(this.dataset.q)" data-q="${txt.replace(/"/g,'&quot;')}">${txt} ${I.chevR(14)}</button>`)}
    else if(kind==='typing'){m.insertAdjacentHTML('beforeend',`<div class="pmsg bot ptyping" id="ptyping"><span></span><span></span><span></span></div>`)}
    else{
      if(kind==='bot')this.history.push({role:'assistant',content:txt});
      if(kind==='usr')this.history.push({role:'user',content:txt});
      m.insertAdjacentHTML('beforeend',`<div class="pmsg ${kind}">${txt}</div>`);
    }
    m.scrollTop=m.scrollHeight;
  },
  send(txt){
    if(!txt||!txt.trim())return;
    this.say('usr',txt);
    this.say('typing');
    if(PLASI_ENDPOINT){this.sendReal(txt)}
    else{setTimeout(()=>{const p=$('#ptyping');if(p)p.remove();this.respondLocal(txt.toLowerCase(),txt)},700)}
  },
  async sendReal(txt){
    try{
      const r=await fetch(PLASI_ENDPOINT,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({history:this.history.slice(-10),customer:STATE.customer?{nombre:STATE.customer.nombre,preap:STATE.customer.preap}:null,context:'marketplace-public'})});
      const data=await r.json();
      const p=$('#ptyping');if(p)p.remove();
      this.say('bot',data.response||'Disculpa, no pude procesar eso. ¿Lo intentas de otra forma?');
      if(data.action){setTimeout(()=>this.runAction(data.action),900)}
      else if(data.suggestions)data.suggestions.forEach(s=>this.say('sug',s));
    }catch(e){
      const p=$('#ptyping');if(p)p.remove();
      this.respondLocal(txt.toLowerCase(),txt);
    }
  },
  runAction(a){
    this.close();
    if(a==='catalogo')go('#/catalogo');
    else if(a==='credito')Flow.openCredito();
    else if(a==='lease')Flow.openLease();
    else if(a==='tradein')Flow.openTradein();
    else if(a==='cita')Flow.openCita();
    else if(a==='seguro')Flow.openSeguro();
    else if(a==='concesionarias')go('#/concesionarias');
  },
  respondLocal(q,orig){
    const route=action=>setTimeout(action,900);
    if(/cx-30|tucson|compar/.test(q)){this.say('bot','Te comparo: <b>Mazda CX-30</b> destaca en manejo y acabados premium, motor 2.5 con 191hp. <b>Hyundai Tucson</b> tiene más espacio de cajuela y carga, garantía 5 años. Las dos las encuentras en el grupo. ¿Vamos al catálogo SUV?');this.say('sug','Sí, llévame al catálogo SUV')}
    else if(/ver catalog|llévame al catal|catalogo suv|ver suv|llevame al cat/.test(q)){this.say('bot','Listo, te llevo al catálogo.');route(()=>{this.close();go('#/catalogo')})}
    else if(/suv|famil|familia/.test(q)){this.say('bot','Para familia de 4 con espacio cómodo te recomiendo SUVs medianas: <b>Mazda CX-50</b>, <b>Hyundai Tucson</b>, <b>Jeep Compass</b> o <b>GAC GS3</b>. Las cuatro caben en presupuesto medio. ¿Te muestro?');this.say('sug','Ver SUVs disponibles')}
    else if(/segur|póliza|gnp/.test(q)){this.say('bot','Plasencia Seguros con respaldo GNP. Amplia Plus desde ~$11,240/año con auto sustituto y asistencia 24/7. Abro la cotización.');route(()=>{this.close();Flow.openSeguro()})}
    else if(/cotizar arrenda|arrenda|lease|autolease/.test(q)){this.say('bot','GP Autolease es arrendamiento puro para PFAE/PM, deducible, plazos 24-48 meses. Abro el cotizador.');route(()=>{this.close();Flow.openLease()})}
    else if(/cred|fin|pre-aprob|preaprob/.test(q)){this.say('bot','Plasencia Crédito: pre-aprobación sin afectar tu buró, tasa fija 13.5%, hasta 60 meses. Abro el flujo.');route(()=>{this.close();Flow.openCredito()})}
    else if(/vale|valu|trade|cambi|cuanto.*auto/.test(q)){this.say('bot','En 2 minutos te doy oferta firme por tu auto. Tres caminos: efectivo, cambio por seminuevo (con bonus) o mantener oferta 7 días. Abro la valuación.');route(()=>{this.close();Flow.openTradein()})}
    else if(/cita|test drive|prueba|manejo|agend/.test(q)){this.say('bot','Te abro el agendador. Elige agencia, motivo y horario.');route(()=>{this.close();Flow.openCita()})}
    else if(/precio|cost|cuant/.test(q)){this.say('bot','El catálogo va desde $280K (Foton, Changan) hasta $1.5M (Jeep Wrangler, Infiniti). Filtra por precio máximo desde el buscador.');this.say('sug','Ver catálogo')}
    else if(/concesion|sucur|tienda|12|agenci/.test(q)){this.say('bot','Tenemos 12 agencias en Jalisco y Nayarit, cada una especialista de su marca. Te llevo al directorio.');route(()=>{this.close();go('#/concesionarias')})}
    else{this.say('bot','Puedo ayudarte con: <b>elegir auto</b>, <b>cotizar crédito o arrendamiento</b>, <b>contratar seguro</b>, <b>valuar tu auto actual</b>, <b>agendar cita</b>, o <b>conocer las 12 agencias</b>. ¿Por dónde empezamos?');this.say('sug','Quiero comprar un auto');this.say('sug','Quiero vender el mío');this.say('sug','Cotizar seguro')}
  },
};
window.Plasi=Plasi;
