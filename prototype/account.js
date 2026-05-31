// ====== CUENTA · 8 TABS ======
let ATAB='resumen';
const TABS=[['resumen','Resumen'],['compras','Compras'],['fin','Crédito y Lease'],['citas','Citas'],['post','Postventa'],['favs','Guardados'],['renov','Renovación'],['notif','Notificaciones'],['perfil','Perfil']];

const Account={
view(){
  if(!STATE.customer){Auth.open('signin',()=>go('#/cuenta'));return '<div class="loading">Iniciando sesión…</div>'}
  const c=STATE.customer;
  setTimeout(()=>this.renderTab(),0);
  const unread=STATE.notifs.length;
  return `<section class="acct-cover"><div class="wrap">
    <div class="acct-av">${initials(c.nombre)}</div>
    <div class="acct-info">
      <h2>Hola, ${c.nombre.split(' ')[0]}</h2>
      <div class="sub"><span>${I.user(14)} ${c.email}</span>${c.tel?`<span>${I.phone(14)} ${c.tel}</span>`:''}<span>${I.cal(14)} Cliente desde ${c.desde||'2026'}</span></div>
      <div class="badges">
        ${c.preap?`<span class="bp bp-green">Crédito pre-aprobado</span>`:`<span class="bp bp-amber">KYC pendiente</span>`}
        ${c.kyc?`<span class="bp bp-navy">Identidad verificada</span>`:''}
        <span class="bp bp-gold">Cliente Plasencia</span>
      </div>
    </div>
    <div class="acct-wallet">
      <div class="lbl">Plasencia Wallet</div>
      <div class="v tnum">${num(c.points||0)} pts</div>
      <div style="font-size:11px;color:rgba(255,255,255,.6);margin-top:2px">≈ ${mxn((c.points||0)*0.5)} en beneficios</div>
    </div>
  </div></section>
  <div class="wrap">
    <div class="acct-tabs">${TABS.map(t=>`<button class="${ATAB===t[0]?'on':''}" onclick="ATAB='${t[0]}';Account.renderTab()">${t[1]}${t[0]==='notif'&&unread?`<span class="bp bp-red" style="margin-left:4px;padding:1px 6px">${unread}</span>`:''}</button>`).join('')}</div>
    <div id="acctBody" style="margin-top:28px;padding-bottom:60px"></div>
  </div>`;
},
renderTab(){
  const b=$('#acctBody');if(!b)return;
  $$('.acct-tabs button').forEach((btn,i)=>btn.classList.toggle('on',TABS[i][0]===ATAB));
  const map={resumen:'resumen',compras:'compras',fin:'fin',citas:'citas',post:'post',favs:'favs',renov:'renov',notif:'notif',perfil:'perfil'};
  b.innerHTML=this[map[ATAB]]();
},
resumen(){
  const d=STATE.deals,p=STATE.pagos,s=STATE.servicios,f=STATE.favs;
  const compr=d.filter(x=>['cerrado','enganche','cita'].includes(x.estado)).length;
  const stats=[['Vehículos comprados',compr],['Pagos realizados',p.length],['Servicios agendados',s.length],['Favoritos',f.length]];
  const recent=d.slice(0,3);
  const pend=d.find(x=>x.estado==='apartado');
  return `<div style="display:grid;grid-template-columns:repeat(4,1fr);gap:14px">
    ${stats.map(s=>`<div class="stat-card"><div class="l">${s[0]}</div><div class="v tnum">${s[1]}</div></div>`).join('')}
  </div>
  <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-top:24px">
    <div style="background:linear-gradient(135deg,var(--navy),var(--navy-d));color:#fff;border-radius:16px;padding:24px;position:relative;overflow:hidden">
      <div class="eyebrow gold" style="color:var(--gold)">Tu próxima acción</div>
      ${pend?`<p style="margin-top:8px;color:rgba(255,255,255,.85);font-size:14px">Tienes el apartado de <b style="color:var(--gold)">${(CARS.find(c=>c.id===pend.carId)||{}).modelo||''}</b> sin completar. Continúa con el enganche.</p><button class="btn btn-gold btn-sm" style="margin-top:14px" onclick="ATAB='compras';Account.renderTab()">Continuar compra ${I.arrowR(14)}</button>`
      :STATE.citas.length?`<p style="margin-top:8px;color:rgba(255,255,255,.85);font-size:14px">Tienes una cita agendada. Revisa los detalles.</p><button class="btn btn-gold btn-sm" style="margin-top:14px" onclick="ATAB='citas';Account.renderTab()">Ver citas ${I.arrowR(14)}</button>`
      :compr?`<p style="margin-top:8px;color:rgba(255,255,255,.85);font-size:14px">Estás al día. Agenda servicio o explora renovación.</p><button class="btn btn-gold btn-sm" style="margin-top:14px" onclick="ATAB='post';Account.renderTab()">Ver postventa ${I.arrowR(14)}</button>`
      :`<p style="margin-top:8px;color:rgba(255,255,255,.85);font-size:14px">Aparta tu primer auto y empieza tu ciclo Plasencia.</p><button class="btn btn-gold btn-sm" style="margin-top:14px" onclick="go('#/catalogo')">Explorar catálogo ${I.arrowR(14)}</button>`}
    </div>
    <div style="background:#fff;border:1px solid var(--n200);border-radius:16px;padding:24px">
      <div class="eyebrow">Tu ciclo Plasencia</div>
      <div style="margin-top:10px">${[['Comprar',d.length>0],['Financiar',d.some(x=>x.mensualidad)],['Mantener',s.length>0],['Renovar',false]].map(t=>`<div style="display:flex;align-items:center;gap:10px;padding:6px 0;font-size:13px"><span style="width:22px;height:22px;border-radius:99px;background:${t[1]?'var(--green)':'var(--n200)'};color:#fff;display:flex;align-items:center;justify-content:center">${t[1]?I.check(12):''}</span><span style="color:${t[1]?'var(--navy)':'var(--n500)'};font-weight:${t[1]?'600':'400'}">${t[0]}</span></div>`).join('')}</div>
    </div>
  </div>
  ${recent.length?`<h3 style="font-size:18px;color:var(--navy);margin:28px 0 12px">Actividad reciente</h3>${recent.map(d=>{const v=CARS.find(c=>c.id===d.carId);if(!v)return'';return `<div class="deal-card"><img src="${v.fotos[0]}" onerror="this.src='${FALLBACK}'"><div style="flex:1;min-width:180px"><h4 style="color:var(--navy)">${v.marca} ${v.modelo}</h4><div style="font-size:12px;color:var(--n500)">Folio ${d.folio} · ${d.modalidad}</div></div><span class="bp bp-${d.estado==='cerrado'||d.estado==='cita'?'green':'gold'}" style="text-transform:capitalize">${d.estado}</span></div>`}).join('')}`:''}`;
},
compras(){
  const ESTLBL={apartado:['Apartado','bp-gold'],enganche:['Enganche pagado','bp-navy'],cerrado:['Comprado','bp-green'],cita:['Entrega agendada','bp-green']};
  if(STATE.deals.length===0)return `<div class="empty"><div class="ic">${I.car(40)}</div><p>Aún no tienes compras.</p><button class="btn btn-conv btn-md" style="margin-top:14px" onclick="go('#/catalogo')">Explorar catálogo</button></div>`;
  return STATE.deals.map(d=>{const v=CARS.find(c=>c.id===d.carId);if(!v)return'';const e=ESTLBL[d.estado]||['—','bp-navy'];const suc=getSuc(v.suc);
    return `<div class="deal-card"><img src="${v.fotos[0]}" onerror="this.src='${FALLBACK}'">
      <div style="flex:1;min-width:200px">
        <div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap"><h3 style="font-size:17px;color:var(--navy)">${v.marca} ${v.modelo}</h3><span class="bp ${e[1]}">${e[0]}</span></div>
        <div style="font-size:12px;color:var(--n500);margin-top:2px">${v.anio} · Vendido por ${suc.nombre} · Folio <span class="tnum" style="font-family:var(--disp);font-weight:700">${d.folio}</span></div>
        <div style="display:flex;gap:18px;flex-wrap:wrap;margin-top:10px;font-size:13px;color:var(--n600)">
          <span>Modalidad: <b style="color:var(--navy);text-transform:capitalize">${d.modalidad}</b></span>
          ${d.mensualidad?`<span>Mensualidad: <b style="color:var(--green-d)" class="tnum">${mxn(d.mensualidad)}</b></span>`:''}
          <span>Depósito: <b class="tnum">${mxn(d.apartado)}</b></span>
        </div>
      </div>
      <div style="display:flex;flex-direction:column;gap:8px;min-width:160px">
        ${d.estado==='apartado'?`<button class="btn btn-conv btn-sm" onclick="Account.pagarEnganche('${d.id}')">Pagar enganche</button>`:''}
        ${d.estado==='enganche'?`<button class="btn btn-primary btn-sm" onclick="Flow.openCita('${v.id}')">Agendar entrega</button>`:''}
        ${d.estado==='cita'?`<span style="font-size:12px;color:var(--green-d);font-weight:700;text-align:center">Sábado 11:00 hrs</span>`:''}
        <button class="btn btn-ghost btn-sm" onclick="go('#/auto/${v.id}')">Ver auto</button>
      </div></div>`}).join('');
},
pagarEnganche(id){const d=STATE.deals.find(x=>x.id===id);const v=CARS.find(c=>c.id===d.carId);d.estado='enganche';d.enganche=Math.round(v.precio*0.2);STATE.notifs.unshift({id:uid('n'),ic:'green',t:'Enganche pagado',d:`${v.marca} ${v.modelo} · ${mxn(d.enganche)}`,time:'Hace un momento'});save();this.renderTab();toast('Enganche pagado')},
fin(){
  const fin=STATE.deals.filter(d=>d.modalidad!=='contado'&&d.mensualidad&&(d.estado==='enganche'||d.estado==='cita'||d.estado==='cerrado'));
  if(fin.length===0)return `<div class="empty"><div class="ic">${I.card(40)}</div><p>Cuando compres a crédito o arrendamiento, aquí verás tu estado de cuenta.</p></div>`;
  return fin.map(d=>{const v=CARS.find(c=>c.id===d.carId);const h=STATE.pagos.filter(p=>p.dealId===d.id).length;const total=d.mensualidad*d.plazo;const pagado=d.mensualidad*h;const pct=Math.round(h/d.plazo*100);const lease=d.modalidad==='arrendamiento';
    return `<div class="deal-card" style="display:block">
      <div style="display:flex;gap:14px;align-items:center;justify-content:space-between;flex-wrap:wrap">
        <div style="display:flex;gap:14px;align-items:center"><img src="${v.fotos[0]}" style="width:64px;height:64px;border-radius:12px;object-fit:cover" onerror="this.src='${FALLBACK}'"><div><h3 style="font-size:17px;color:var(--navy)">${v.marca} ${v.modelo}</h3><div style="font-size:12px;color:var(--n500)">${lease?'GP Autolease':'Plasencia Crédito'} · ${d.plazo} meses</div></div></div>
        <span class="bp ${lease?'bp-navy':'bp-green'}">${lease?'Arrendamiento':'Crédito'}</span>
      </div>
      <div style="margin-top:18px"><div style="display:flex;justify-content:space-between;font-size:12px;margin-bottom:6px"><span style="color:var(--n600)">${h} de ${d.plazo} pagos</span><b class="tnum" style="font-family:var(--disp)">${pct}%</b></div><div style="height:10px;background:var(--n200);border-radius:99px;overflow:hidden"><div style="height:100%;background:linear-gradient(90deg,var(--green),var(--green-d));width:${pct}%;transition:.5s var(--ease)"></div></div></div>
      <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-top:18px">
        ${[['Pagado',mxn(pagado)],['Saldo restante',mxn(total-pagado)],[lease?'Renta/mes':'Mensualidad',mxn(d.mensualidad)]].map(s=>`<div style="background:var(--n50);border-radius:12px;padding:14px"><div style="font-family:var(--disp);font-size:10px;font-weight:700;text-transform:uppercase;color:var(--n500)">${s[0]}</div><div style="font-family:var(--disp);font-weight:800;color:var(--navy);font-size:16px;margin-top:2px" class="tnum">${s[1]}</div></div>`).join('')}
      </div>
      ${h<d.plazo?`<div style="margin-top:18px;display:flex;justify-content:space-between;align-items:center;background:linear-gradient(135deg,var(--navy),var(--navy-d));color:#fff;border-radius:14px;padding:16px"><div><div style="font-family:var(--disp);font-size:11px;font-weight:700;text-transform:uppercase;color:var(--gold)">Próximo pago</div><div style="font-family:var(--disp);font-weight:900;font-size:20px" class="tnum">${mxn(d.mensualidad)}</div></div><button class="btn btn-conv btn-sm" onclick="Account.pagarMens('${d.id}')">Pagar ahora ${I.arrowR(14)}</button></div>`:`<div style="margin-top:18px;background:rgba(72,187,120,.1);color:var(--green-d);border-radius:14px;padding:16px;text-align:center;font-weight:700;font-size:14px">Plan liquidado. ¡Felicidades!</div>`}
    </div>`}).join('');
},
pagarMens(id){STATE.pagos.unshift({id:uid('p'),dealId:id,fecha:'Hoy'});const d=STATE.deals.find(x=>x.id===id);const v=CARS.find(c=>c.id===d.carId);STATE.notifs.unshift({id:uid('n'),ic:'green',t:'Pago aplicado',d:`${v.marca} ${v.modelo} · ${mxn(d.mensualidad)}`,time:'Ahora'});STATE.customer.points=(STATE.customer.points||0)+Math.round(d.mensualidad/100);save();this.renderTab();toast('Pago aplicado')},
citas(){
  if(STATE.citas.length===0)return `<div class="empty"><div class="ic">${I.cal(40)}</div><p>No tienes citas agendadas.</p><button class="btn btn-conv btn-md" style="margin-top:14px" onclick="Flow.openCita()">Agendar cita</button></div>`;
  const mot={test_drive:'Prueba de manejo',cotizar:'Cotización presencial',firma:'Firma de contrato',entrega:'Entrega de auto'};
  return `<button class="btn btn-conv btn-md" style="margin-bottom:18px" onclick="Flow.openCita()">${I.plus(16)} Agendar nueva cita</button>`+STATE.citas.map(c=>{const sc=getSuc(c.suc);const v=c.carId?CARS.find(x=>x.id===c.carId):null;return `<div class="deal-card"><div style="width:60px;height:60px;border-radius:14px;background:linear-gradient(135deg,var(--navy),var(--slate));color:var(--gold);display:flex;align-items:center;justify-content:center">${I.cal(28)}</div><div style="flex:1;min-width:180px"><div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap"><h3 style="font-size:16px;color:var(--navy)">${mot[c.motivo]}</h3><span class="bp bp-blue">Confirmada</span></div><div style="font-size:13px;color:var(--n600);margin-top:4px;text-transform:capitalize">${c.fecha} · ${c.hora||'09:00'} hrs</div><div style="font-size:12px;color:var(--n500);margin-top:2px">${sc.nombre}${v?` · ${v.marca} ${v.modelo}`:''} · Folio ${c.folio}</div></div><div style="display:flex;flex-direction:column;gap:6px;min-width:140px"><button class="btn btn-wa btn-sm">${I.wa(14)} Recordarme</button><button class="btn btn-out btn-sm" onclick="Flow.openCita()">Reagendar</button></div></div>`}).join('');
},
post(){
  const comp=STATE.deals.filter(d=>['cerrado','cita','enganche'].includes(d.estado));
  const SERV=[['Servicio 10,000 km',3200,I.wrench(20)],['Servicio mayor',6800,I.wrench(20)],['Alineación y balanceo',1400,I.wrench(20)],['Cambio de llantas',9500,I.wrench(20)]];
  let html=`<div class="deal-card" style="display:block"><h3 style="font-size:18px;color:var(--navy)">Agendar servicio</h3><p style="font-size:13px;color:var(--n500);margin-bottom:16px">Tu auto, tu taller Plasencia, tu horario.</p>`;
  if(comp.length===0)html+=`<p style="font-size:13px;color:var(--n500)">Compra un auto para agendar servicios.</p>`;
  else html+=`<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">${SERV.map(s=>`<button class="btn btn-out btn-md" style="justify-content:space-between;padding:14px 18px" onclick="Account.agendarServ('${s[0]}',${s[1]})"><span style="display:flex;align-items:center;gap:10px">${s[2]}${s[0]}</span><span style="color:var(--n500);font-size:12px" class="tnum">${mxn(s[1])}</span></button>`).join('')}</div>`;
  html+=`</div>`;
  if(STATE.servicios.length)html+=`<h3 style="font-size:17px;color:var(--navy);margin:24px 0 14px">Historial de servicio</h3>`+STATE.servicios.map(s=>`<div class="deal-card"><span style="width:48px;height:48px;border-radius:99px;background:rgba(72,187,120,.15);color:var(--green-d);display:flex;align-items:center;justify-content:center">${I.wrench(22)}</span><div style="flex:1"><div style="font-family:var(--disp);font-weight:700;color:var(--navy);font-size:14px">${s.tipo}</div><div style="font-size:12px;color:var(--n500)">Próximo sábado 10:00 hrs</div></div><div class="tnum" style="font-weight:700;color:var(--navy);font-family:var(--disp)">${mxn(s.costo)}</div><span class="bp bp-green">Agendado</span></div>`).join('');
  return html;
},
agendarServ(tipo,costo){STATE.servicios.unshift({id:uid('s'),tipo,costo});STATE.notifs.unshift({id:uid('n'),ic:'blue',t:'Servicio agendado',d:`${tipo} · Sábado 10:00`,time:'Ahora'});save();this.renderTab();toast('Servicio agendado')},
favs(){
  const favs=CARS.filter(c=>STATE.favs.includes(c.id));
  if(favs.length===0)return `<div class="empty"><div class="ic">${I.heart(40)}</div><p>Aún no tienes favoritos.<br>Toca el corazón en cualquier auto del catálogo para guardarlo.</p><button class="btn btn-conv btn-md" style="margin-top:16px" onclick="go('#/catalogo')">Explorar catálogo</button></div>`;
  return `<div class="vgrid">${favs.map(vcard).join('')}</div>`;
},
renov(){
  const comp=STATE.deals.filter(d=>['cerrado','cita','enganche'].includes(d.estado));
  if(comp.length===0)return `<div class="empty"><div class="ic">${I.cycle(40)}</div><p>Cuando tengas un auto con nosotros, aquí verás tu oferta de recompra con trade-in pre-calculado.</p></div>`;
  const v=CARS.find(c=>c.id===comp[0].carId);const oferta=Math.round(v.precio*0.62/1000)*1000;
  const sug=CARS.filter(c=>c.cond==='nuevo'&&c.tipo===v.tipo&&c.id!==v.id).slice(0,4);
  return `<div style="background:linear-gradient(135deg,var(--navy),var(--navy-d));color:#fff;border-radius:20px;padding:32px;position:relative;overflow:hidden">
    <div style="position:absolute;inset:0;background:radial-gradient(ellipse 60% 80% at 90% 0%,rgba(236,201,75,.18),transparent 60%)"></div>
    <div style="position:relative">
      <div class="eyebrow gold" style="color:var(--gold)">Tu oferta de renovación</div>
      <h3 style="font-size:26px;margin-top:8px">Tu ${v.marca} ${v.modelo} vale hasta</h3>
      <div style="font-family:var(--disp);font-weight:900;font-size:46px;color:var(--gold);line-height:1" class="tnum">${mxn(oferta)}</div>
      <p style="font-size:14px;color:rgba(255,255,255,.8);margin-top:10px;max-width:480px">Aplícalo como enganche de tu siguiente auto. El grupo conoce tu historial: renovar es más fácil que empezar de cero.</p>
      <button class="btn btn-gold btn-md" style="margin-top:18px" onclick="Flow.openValuar()">Confirmar valuación</button>
    </div>
  </div>
  <h3 style="font-size:20px;color:var(--navy);margin:32px 0 18px">Tu siguiente Plasencia</h3>
  <div class="vgrid">${sug.map(vcard).join('')}</div>`;
},
notif(){
  if(STATE.notifs.length===0)return `<div class="empty"><div class="ic">${I.bell(40)}</div><p>Sin notificaciones por ahora.</p></div>`;
  const ics={green:I.check(18),blue:I.cal(18),gold:I.star(18,true)};
  return STATE.notifs.map(n=>`<div class="notif-card"><div class="nic ${n.ic}">${ics[n.ic]||I.bell(18)}</div><div style="flex:1"><div style="font-family:var(--disp);font-weight:700;color:var(--navy)">${n.t}</div><div style="font-size:13px;color:var(--n600);margin-top:2px">${n.d}</div><div class="ntime">${n.time}</div></div></div>`).join('');
},
perfil(){
  const c=STATE.customer;
  return `<div style="max-width:680px"><div class="deal-card" style="display:block">
    <div style="display:flex;gap:16px;align-items:center;margin-bottom:24px"><div style="width:64px;height:64px;border-radius:18px;background:linear-gradient(135deg,var(--navy),var(--navy-d));color:var(--gold);font-family:var(--disp);font-weight:900;font-size:24px;display:flex;align-items:center;justify-content:center">${initials(c.nombre)}</div><div><h3 style="font-size:18px;color:var(--navy)">${c.nombre}</h3><div style="display:flex;gap:6px;margin-top:4px;flex-wrap:wrap">${c.kyc?'<span class="bp bp-navy">Identidad verificada</span>':'<span class="bp bp-amber">KYC pendiente</span>'}${c.preap?'<span class="bp bp-green">Crédito pre-aprobado</span>':''}</div></div></div>
    ${[['nombre','Nombre completo','text'],['email','Correo','email'],['tel','Teléfono','tel'],['rfc','RFC','text'],['ingresos','Ingresos mensuales MXN','number']].map(f=>`<div class="field"><label>${f[1]}</label><input id="pf_${f[0]}" type="${f[2]}" value="${c[f[0]]||''}"></div>`).join('')}
    <div style="display:flex;gap:10px;margin-top:18px;flex-wrap:wrap;align-items:center"><button class="btn btn-conv btn-md" onclick="Account.savePerfil()">Guardar cambios</button>${!c.preap?`<button class="btn btn-out btn-md" onclick="Flow.openCredito()">Pre-aprobar mi crédito</button>`:''}<button class="btn btn-ghost btn-md" onclick="logout()" style="margin-left:auto;color:var(--red)">${I.logout(16)} Cerrar sesión</button></div>
    <span id="pfsaved" style="font-size:13px;color:var(--green-d);font-weight:700;display:block;margin-top:10px"></span>
    <div style="margin-top:24px;padding-top:18px;border-top:1px solid var(--n100);font-size:12px;color:var(--n500);display:flex;align-items:center;gap:8px">${I.shield(16)} Tus datos se gestionan bajo la política de privacidad de Grupo Plasencia. Demo: guardado local en tu navegador.</div>
  </div></div>`;
},
savePerfil(){const c=STATE.customer;['nombre','email','tel','rfc','ingresos'].forEach(k=>{const el=$('#pf_'+k);if(el)c[k]=el.value});c.kyc=!!(c.nombre&&c.rfc);if(c.kyc&&!c.preap){c.preap=true;c.linea=Math.round((+c.ingresos||50000)*15);STATE.notifs.unshift({id:uid('n'),ic:'green',t:'Crédito pre-aprobado',d:`Línea de ${mxn(c.linea)}`,time:'Ahora'})}save();$('#pfsaved').textContent='Guardado correctamente';updateHeader();setTimeout(()=>{$('#pfsaved').textContent=''},2500)}
};

// ====== PLASI ======
const Plasi={
  msgs:[{f:'bot',t:'Hola, soy Plasi, el asistente IA de Plasencia Marketplace. Te ayudo a elegir auto, cotizar crédito o arrendamiento, valuar tu auto actual, agendar cita en cualquier concesionaria, o resolver dudas. ¿En qué te apoyo?'}],
  open(pre){this.render();if(pre)setTimeout(()=>this.send(pre),300)},
  close(){const p=$('#plasiPanel');if(p)p.remove();$('#plasiBtn').style.display=''},
  render(){
    $('#plasiBtn').style.display='none';
    let p=$('#plasiPanel');if(p)p.remove();
    p=document.createElement('div');p.className='plasi-panel fu';p.id='plasiPanel';
    const sug=['¿Cuál SUV me conviene para familia?','¿Cómo funciona el apartado?','¿Qué necesito para el crédito?','Diferencia entre comprar y arrendar','¿Tienen flotillas para empresa?'];
    p.innerHTML=`<div class="plasi-hd"><span class="av">P</span><div style="flex:1"><div class="nm">Plasi · Asistente IA</div><div class="st"><span class="dot"></span>Por Grupo Plasencia · en línea</div></div><button class="x" onclick="Plasi.close()">${I.x(18)}</button></div>
      ${this.msgs.length<=1?`<div class="plasi-intro"><b>¿Quién soy?</b> Soy el asistente de inteligencia artificial del marketplace. Hablo con conocimiento de los 96 autos disponibles, las 12 concesionarias y todos los flujos del grupo.</div>`:''}
      <div class="plasi-msgs" id="pmsgs">${this.msgs.map(m=>`<div class="pmsg ${m.f}">${m.t}</div>`).join('')}${this.msgs.length<=1?'<div style="display:flex;flex-direction:column;gap:6px;margin-top:4px">'+sug.map(s=>`<button class="psug" onclick="Plasi.send(this.querySelector('span').textContent)"><span>${s}</span>${I.chevR(14)}</button>`).join('')+'</div>':''}</div>
      <div class="plasi-in"><input id="pinput" placeholder="Escribe tu pregunta…" onkeydown="if(event.key==='Enter'){Plasi.send(this.value);this.value=''}"><button onclick="var i=document.getElementById('pinput');Plasi.send(i.value);i.value=''" aria-label="Enviar">${I.arrowR(20)}</button></div>`;
    document.body.appendChild(p);
  },
  send(q){q=(q||'').trim();if(!q)return;this.msgs.push({f:'usr',t:q});this.renderMsgs();setTimeout(()=>{this.msgs.push({f:'bot',t:this.reply(q)});this.renderMsgs()},420)},
  renderMsgs(){const m=$('#pmsgs');if(!m)return;m.innerHTML=this.msgs.map(x=>`<div class="pmsg ${x.f}">${x.t}</div>`).join('');m.scrollTop=m.scrollHeight},
  reply(q){const t=q.toLowerCase();
    if(t.includes('familia')||t.includes('suv'))return 'Para familia te recomiendo un SUV: tenemos Mazda CX-5, Hyundai Tucson, Jeep Compass, GAC Emkoo y más, todos cross-marca de las 12 concesionarias del grupo. ¿Quieres que filtre el catálogo por SUV?';
    if(t.includes('apart'))return 'Apartas cualquier auto con $5,000 reembolsables. Reserva la unidad, fija el precio y agenda tu cita. Si no continúas, devolvemos el depósito completo en 72 horas.';
    if(t.includes('crédito')||t.includes('credito')||t.includes('financ'))return 'Para el crédito Plasencia necesitas identificación, comprobante de domicilio e ingresos. Te pre-apruebas en línea sin afectar tu buró. Enganche típico 20%, plazos 12-60 meses, tasa 13.5% anual. ¿Te lanzo el wizard ahora?';
    if(t.includes('arrend')||t.includes('lease'))return 'GP Autolease es arrendamiento puro: renta mensual fija, sin enganche fuerte. Al final del plazo renuevas, devuelves o compras. Ideal para PFAE y empresas (deducible). Plazos 24-48 meses.';
    if(t.includes('valuar')||t.includes('mi auto'))return 'Con gusto valúo tu auto actual para aplicar como enganche. ¿De qué marca, modelo y año es? (En el prototipo la valuación es estimada.)';
    if(t.includes('seminuevo')||t.includes('usado'))return 'Nuestros seminuevos pasan 167 puntos de inspección, con garantía por escrito y devolución de 7 días. Cada uno muestra su historial y la concesionaria que lo vende.';
    if(t.includes('concesion')||t.includes('vendedor')||t.includes('sucursal'))return 'El grupo tiene 12 concesionarias dentro del marketplace: Mazda Bugambilias, López Mateos, Galerías, Santa Anita, Américas, Acueducto, Plasencia Centro y González Gallo; Hyundai Acueducto y Vallarta; Stellantis LCV y Jeep; GAC Plasencia. Compiten por tu compra.';
    if(t.includes('flot')||t.includes('empresa'))return 'Plasencia Flotillas es para Pymes y corporativos: cotización empresarial cross-marca, crédito o arrendamiento, mantenimiento en las 12 concesionarias. Te lanzo el formulario.';
    if(t.includes('cita')||t.includes('agend'))return 'Puedo agendarte cita en cualquiera de las 12 concesionarias del grupo: prueba de manejo, cotización, firma de contrato o entrega. Te confirmamos por WhatsApp.';
    if(t.includes('hola')||t.includes('buen'))return 'Hola, soy Plasi. Te puedo ayudar con: elegir auto, cotizar crédito o arrendamiento, valuar tu auto, agendar cita, conocer las concesionarias o resolver dudas. ¿Sobre cuál te cuento?';
    return 'Buena pregunta. Te puedo ayudar con: elegir auto, cotizar crédito o arrendamiento, el apartado, seminuevos certificados, agendar cita, flotillas o conocer las concesionarias del grupo. ¿Sobre cuál te cuento más?';
  }
};
window.Account=Account;window.Plasi=Plasi;window.Auth=Auth;window.Flow=Flow;window.logout=logout;
