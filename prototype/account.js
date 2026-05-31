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
  <div class="wrap" style="padding:0 24px 60px"><div class="acct-tabs">${TABS.map(t=>`<button class="${ATAB===t[0]?'on':''}" onclick="ATAB='${t[0]}';render()">${t[2]} ${t[1]}${t[3]?` <span class="bp bp-red" style="padding:1px 7px;font-size:10px">${t[3]}</span>`:''}</button>`).join('')}</div>
    <div style="padding:28px 0">${Account[ATAB]?.()||Account.resumen()}</div>
  </div>`;
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
        <button class="btn btn-out btn-md btn-full" style="justify-content:flex-start" onclick="go('#/catalogo')">${I.car(16)} Explorar catálogo</button>
        <button class="btn btn-out btn-md btn-full" style="justify-content:flex-start" onclick="Flow.openTradein()">${I.trending(16)} Valuar mi auto</button>
        ${!c.preap?`<button class="btn btn-conv btn-md btn-full" style="justify-content:flex-start" onclick="Flow.openCredito()">${I.card(16)} Pre-aprobar crédito</button>`:''}
        <button class="btn btn-out btn-md btn-full" style="justify-content:flex-start" onclick="Flow.openCita()">${I.cal(16)} Agendar cita</button>
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
      <button class="btn btn-conv btn-md">Pagar enganche</button>
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
      <button class="btn btn-out btn-md">${I.doc(14)} Documentos</button>
      <button class="btn btn-out btn-md" onclick="Flow.openTradein()">${I.cycle(14)} Cambiar este auto</button>
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
      ${usado>0?`<button class="btn btn-conv btn-md">${I.cash(14)} Pagar ${mxn(cr.mensActual)}</button>`:`<button class="btn btn-conv btn-md" onclick="go('#/catalogo')">Usar mi línea</button>`}
      <button class="btn btn-out btn-md">${I.doc(14)} Estado de cuenta</button>
      <button class="btn btn-out btn-md">${I.cal(14)} Calendario de pagos</button>
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
      <button class="btn btn-conv btn-md">${I.cash(14)} Pagar renta de mes</button>
      <button class="btn btn-out btn-md">${I.doc(14)} Contrato</button>
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
      <button class="btn btn-conv btn-md">${I.phone(14)} Reportar siniestro</button>
      <button class="btn btn-out btn-md">${I.doc(14)} Ver póliza</button>
      <button class="btn btn-out btn-md">${I.cycle(14)} Renovar</button>
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
      <button class="btn btn-out btn-sm">${I.doc(14)} Factura</button>
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
      ${t.path==='cambio'?`<button class="btn btn-conv btn-md" onclick="go('#/catalogo?cond=seminuevo')">Ver seminuevos</button>`:`<button class="btn btn-conv btn-md">${I.check(14)} Aceptar oferta</button>`}
      <button class="btn btn-out btn-md">${I.cal(14)} Agendar inspección</button>
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
      <button class="btn btn-out btn-md">${I.cal(14)} Reagendar</button>
      <button class="btn btn-ghost btn-sm" style="color:var(--red)">Cancelar</button>
    </div>
  </div>`).join('');
},

notificaciones(){
  if(!STATE.notifs.length)return Account._empty('notificaciones','Sin notificaciones','Aquí aparecerán confirmaciones, recordatorios y alertas.',[]);
  return STATE.notifs.map(n=>`<div class="notif-card"><div class="nic ${n.ic}">${I.check(18)}</div><div style="flex:1"><div style="font-family:var(--disp);font-size:14px;font-weight:700;color:var(--navy)">${n.t}</div><div style="font-size:12.5px;color:var(--n600);margin-top:2px">${n.d}</div><div class="ntime">${n.time}</div></div></div>`).join('');
},

perfil(){
  const c=STATE.customer;
  return `<div style="display:grid;grid-template-columns:1fr 1fr;gap:20px">
    <div>
      <h3 style="font-family:var(--disp);font-size:18px;color:var(--navy);margin-bottom:14px">Datos personales</h3>
      <div class="field"><label>Nombre completo</label><input value="${c.nombre}"></div>
      <div class="field"><label>Correo electrónico</label><input value="${c.email}"></div>
      <div class="field"><label>Teléfono</label><input value="${c.tel||''}"></div>
      <div class="field-row"><div class="field"><label>RFC</label><input value="${c.rfc||''}" placeholder="Para facturación"></div><div class="field"><label>CURP</label><input placeholder="Opcional"></div></div>
      <button class="btn btn-conv btn-md" style="margin-top:8px" onclick="toast('Datos guardados')">Guardar cambios</button>
    </div>
    <div>
      <h3 style="font-family:var(--disp);font-size:18px;color:var(--navy);margin-bottom:14px">Wallet · Métodos de pago</h3>
      <div style="background:linear-gradient(135deg,var(--navy),var(--navy-d));color:#fff;border-radius:14px;padding:18px">
        <div style="font-family:var(--disp);font-size:11px;font-weight:700;text-transform:uppercase;color:var(--gold);letter-spacing:1px">Visa principal</div>
        <div style="font-family:var(--disp);font-weight:700;font-size:18px;margin-top:6px">•••• •••• •••• 6411</div>
        <div style="display:flex;justify-content:space-between;font-size:11px;color:rgba(255,255,255,.6);margin-top:14px"><span>${c.nombre.toUpperCase()}</span><span>12/29</span></div>
      </div>
      <button class="btn btn-out btn-md btn-full" style="margin-top:10px;justify-content:flex-start">${I.plus(14)} Agregar método de pago</button>
      <h3 style="font-family:var(--disp);font-size:18px;color:var(--navy);margin:24px 0 14px">Plasencia Points</h3>
      <div class="stat-card"><div class="l">Disponibles</div><div class="v tnum">${num(c.points||0)} pts</div><div style="font-size:11px;color:var(--n500);margin-top:4px">Acumulas 1 pt por cada $100 en servicio o postventa. Canjea en cualquier concesionaria.</div></div>
      <button class="btn btn-ghost btn-md btn-full" style="margin-top:24px;color:var(--red);justify-content:flex-start" onclick="logout()">${I.logout(14)} Cerrar sesión</button>
    </div>
  </div>`;
},

_empty(key,t,d,ctas){
  const iconMap={reservas:'cal',garage:'garage',watchlist:'heart',credito:'card',autolease:'key',seguros:'umbrella',tradein:'trending',citas:'cal',servicios:'wrench',pagos:'cash',notificaciones:'bell'};
  return `<div class="empty">
    <div class="ic">${I[iconMap[key]||'car'](48)}</div>
    <h3 style="font-family:var(--disp);font-size:18px;color:var(--navy);margin-top:8px">${t}</h3>
    <p style="max-width:480px;margin:6px auto 0">${d}</p>
    ${ctas.length?`<div style="margin-top:20px;display:flex;gap:8px;justify-content:center">${ctas.map(c=>`<button class="btn btn-${c[2]||'out'} btn-md" onclick="${c[3]||`go('${c[1]}')`}">${c[0]}</button>`).join('')}</div>`:''}
  </div>`;
},
};
window.Account=Account;

// ====== PLASI · Asistente IA del Grupo (claude-sonnet-4-5 cuando endpoint este LIVE) ======
// Endpoint real: cuando este expuesto en crm-worker, setear PLASI_ENDPOINT a
//   https://crm.plasencia.mx/api/public/plasi-marketplace
// Mientras tanto: fallback local con respuestas predefinidas.
const PLASI_ENDPOINT=window.PLASI_ENDPOINT||null;

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
