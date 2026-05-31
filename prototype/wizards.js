// ====== WIZARDS · transactional flows ======
function ensureAuth(cb){if(STATE.customer){cb();return}Auth.open('signup',cb)}
function wizSteps(steps,cur){return `<div class="wiz-steps">${steps.map((s,i)=>{const st=i<cur?'done':i===cur?'on':'';return `<div class="wiz-step ${st}"><div class="num">${i<cur?'✓':i+1}</div>${s}</div>${i<steps.length-1?`<div class="wiz-sep ${i<cur?'done':''}"></div>`:''}`}).join('')}</div>`}

const Flow={
// === CHECKOUT (apartado + datos + pago + confirmación) ===
openCheckout(carId){
  const v=CARS.find(c=>c.id===carId);if(!v)return;
  ensureAuth(()=>this._checkout(v,0,{trade:0}));
},
_checkout(v,step,d){
  const steps=['Resumen','Datos','Pago','¡Listo!'];
  const apart=5000;
  const html=`<h2 style="font-size:22px;color:var(--navy)">Apartar ${v.marca} ${v.modelo}</h2>
    <p style="color:var(--n500);font-size:13px;margin-top:4px">Reserva con $5,000 reembolsables. 7 días para confirmar.</p>
    ${wizSteps(steps,step)}
    ${step===0?`
      <div style="display:flex;gap:14px;background:var(--n50);border-radius:12px;padding:14px;border:1px solid var(--n200)">
        <img src="${v.fotos[0]}" style="width:100px;height:68px;object-fit:cover;border-radius:8px" onerror="this.src='${FALLBACK}'">
        <div style="flex:1"><div style="font-family:var(--disp);font-weight:700;color:var(--navy)">${v.marca} ${v.modelo}</div><div style="font-size:12px;color:var(--n500)">${v.anio} · ${v.trans} · ${v.fuel}</div><div style="font-family:var(--disp);font-weight:800;color:var(--navy);margin-top:6px" class="tnum">${mxn(v.precio)}</div></div>
      </div>
      <div class="summary-box">
        <div class="row"><span>Precio del vehículo</span><b class="tnum">${mxn(v.precio)}</b></div>
        <div class="row"><span>Apartado reembolsable</span><b class="tnum">${mxn(apart)}</b></div>
        ${d.trade>0?`<div class="row"><span>Trade-in aplicado</span><b style="color:var(--green-d)" class="tnum">−${mxn(d.trade)}</b></div>`:''}
        <div class="row tot"><span>A pagar ahora</span><b class="tnum">${mxn(apart)}</b></div>
      </div>
      <div style="background:#FFF8E5;border:1px solid var(--gold);border-radius:12px;padding:14px;margin-top:14px;display:flex;align-items:flex-start;gap:10px">
        <span style="color:var(--gold-d);flex-shrink:0">${I.trending(20)}</span>
        <div style="flex:1"><b style="font-family:var(--disp);color:var(--navy);font-size:13px">¿Cambias tu auto actual?</b><div style="font-size:12px;color:var(--n600);margin-top:2px">Aplica tu valuación como enganche o pago parcial.</div></div>
        <button class="btn btn-out btn-sm" onclick="closeModal();Flow.openTradein()">Valuar</button>
      </div>
    `:''}
    ${step===1?`
      <div class="field"><label>Nombre completo</label><input id="ck_nom" value="${STATE.customer?.nombre||''}"></div>
      <div class="field-row">
        <div class="field"><label>Correo</label><input id="ck_em" type="email" value="${STATE.customer?.email||''}"></div>
        <div class="field"><label>Teléfono</label><input id="ck_tel" value="${STATE.customer?.tel||''}"></div>
      </div>
      <div class="field"><label>Notas (opcional)</label><textarea rows="2" placeholder="Algo que la concesionaria deba saber…"></textarea></div>
    `:''}
    ${step===2?`
      <div class="choice-grid">
        <button class="choice on" id="pmTar" onclick="document.querySelectorAll('.choice').forEach(c=>c.classList.remove('on'));this.classList.add('on');Flow.pm='tarjeta'"><div class="check">${I.check(14)}</div><div class="ic">${I.card(20)}</div><div class="t">Tarjeta</div><div class="d">Crédito o débito · 1 o 3 MSI</div></button>
        <button class="choice" id="pmTr" onclick="document.querySelectorAll('.choice').forEach(c=>c.classList.remove('on'));this.classList.add('on');Flow.pm='transferencia'"><div class="check">${I.check(14)}</div><div class="ic">${I.cash(20)}</div><div class="t">Transferencia SPEI</div><div class="d">Pago inmediato</div></button>
      </div>
      <div class="field" style="margin-top:14px"><label>Número de tarjeta (demo)</label><input value="4242 4242 4242 4242" readonly></div>
      <div class="field-row"><div class="field"><label>Vence</label><input value="12/29" readonly></div><div class="field"><label>CVV</label><input value="•••" readonly></div></div>
      <div style="font-size:11px;color:var(--n500);margin-top:6px;display:flex;align-items:center;gap:6px">${I.shield(14)} Demo: no se cobra realmente.</div>
    `:''}
    ${step===3?`
      <div class="ok-circle">${I.check(28)}</div>
      <h2 style="text-align:center;color:var(--navy);font-size:24px">¡Apartado confirmado!</h2>
      <p style="text-align:center;color:var(--n500);margin-top:6px;font-size:14px">Tu ${v.marca} ${v.modelo} está reservado por 7 días. El asesor te contactará en menos de 2 horas.</p>
      <div class="folio"><div class="k">Folio de reserva</div><div class="v">${d.folio}</div></div>
      <div style="background:var(--n50);border-radius:12px;padding:14px;margin-top:14px">
        <div style="font-family:var(--disp);font-size:11px;font-weight:700;text-transform:uppercase;color:var(--n500);letter-spacing:.5px">Próximos pasos</div>
        <ol style="margin:8px 0 0 20px;font-size:13px;color:var(--n700);line-height:1.7">
          <li>Tu asesor te llama hoy mismo para coordinar entrega.</li>
          <li>Firma de contrato y enganche restante en concesionaria o en línea.</li>
          <li>Te entregamos tu auto. Bienvenido al grupo.</li>
        </ol>
      </div>
    `:''}
    <div class="wiz-nav">
      ${step>0&&step<3?`<button class="btn btn-out btn-md" onclick='Flow._checkout(${JSON.stringify(v.id)},${step-1},${JSON.stringify(d)})'>${I.chevL(14)} Atrás</button>`:'<span></span>'}
      ${step<3?`<button class="btn btn-conv btn-md" onclick='Flow._checkoutNext(${JSON.stringify(v.id)},${step},${JSON.stringify(d)})'>${step===2?'Pagar '+mxn(apart):'Continuar'} ${I.chevR(14)}</button>`:`<button class="btn btn-conv btn-md btn-full" onclick='closeModal();go("#/cuenta?t=reservas")'>Ver mis reservas</button>`}
    </div>`;
  showModal(html,'lg');
},
_checkoutNext(id,step,d){
  const v=CARS.find(c=>c.id===id);
  if(step===2){
    const f=folio(v.marca,'AP');d.folio=f;
    STATE.reservas.unshift({id:uid('res'),folio:f,carId:v.id,marca:v.marca,modelo:v.modelo,anio:v.anio,img:v.fotos[0],precio:v.precio,apart:5000,fecha:new Date().toISOString().slice(0,10),estado:'apartado',suc:v.suc,milestone:1});
    STATE.notifs.unshift({id:uid('n'),ic:'green',t:'Reserva confirmada',d:`${v.marca} ${v.modelo} apartado · ${f}`,time:'Ahora'});
    save();updateHeader();
  }
  this._checkout(v,step+1,d);
},

// === CITA ===
openCita(carId){
  const v=carId?CARS.find(c=>c.id===carId):null;
  ensureAuth(()=>this._cita(v,0,{}));
},
_cita(v,step,d){
  const steps=['Concesionaria','Motivo','Día y hora','Confirmación'];
  const sucList=v?[getSuc(v.suc)]:SUCS.slice(0,6);
  const motivos=[['Test drive',I.car(20)],['Ver el auto',I.search(20)],['Cotizar crédito',I.card(20)],['Servicio',I.wrench(20)]];
  const days=Array.from({length:5},(_,i)=>{const d=new Date();d.setDate(d.getDate()+i+1);return {iso:d.toISOString().slice(0,10),lbl:['Dom','Lun','Mar','Mié','Jue','Vie','Sáb'][d.getDay()]+' '+d.getDate()}});
  const hours=['10:00','11:30','13:00','15:00','16:30','18:00'];
  const html=`<h2 style="font-size:22px;color:var(--navy)">Agendar cita ${v?`· ${v.marca} ${v.modelo}`:''}</h2>
    ${wizSteps(steps,step)}
    ${step===0?`<div class="choice-grid" style="grid-template-columns:1fr">${sucList.map(s=>`<button class="choice ${d.suc===s.id?'on':''}" onclick="Flow.citaSuc='${s.id}';document.querySelectorAll('.choice').forEach(c=>c.classList.remove('on'));this.classList.add('on')"><div class="check">${I.check(14)}</div><div style="display:flex;gap:12px;align-items:center">${sucLogoHTML(s,'sm')}<div><div class="t">${s.nombre}</div><div class="d">${s.zona} · ${I.star(11)} ${s.rating} · ${num(s.reviews)} reseñas</div></div></div></button>`).join('')}</div>`:''}
    ${step===1?`<div class="choice-grid">${motivos.map(m=>`<button class="choice ${d.motivo===m[0]?'on':''}" onclick="Flow.citaMot='${m[0]}';document.querySelectorAll('.choice').forEach(c=>c.classList.remove('on'));this.classList.add('on')"><div class="check">${I.check(14)}</div><div class="ic">${m[1]}</div><div class="t">${m[0]}</div></button>`).join('')}</div>`:''}
    ${step===2?`<div class="field"><label>Día</label><div class="timeslots">${days.map(x=>`<button class="timeslot ${d.dia===x.iso?'on':''}" onclick="Flow.citaDia='${x.iso}';document.querySelectorAll('[data-r=d]').forEach(b=>b.classList.remove('on'));this.classList.add('on')" data-r="d">${x.lbl}</button>`).join('')}</div></div><div class="field"><label>Hora</label><div class="timeslots">${hours.map(h=>`<button class="timeslot ${d.hora===h?'on':''}" onclick="Flow.citaHr='${h}';document.querySelectorAll('[data-r=h]').forEach(b=>b.classList.remove('on'));this.classList.add('on')" data-r="h">${h}</button>`).join('')}</div></div>`:''}
    ${step===3?`<div class="ok-circle">${I.check(28)}</div><h2 style="text-align:center;color:var(--navy);font-size:24px">¡Cita confirmada!</h2><p style="text-align:center;color:var(--n500);margin-top:6px;font-size:14px">Te esperamos. Recibirás recordatorio por WhatsApp.</p><div class="folio"><div class="k">Folio</div><div class="v">${d.folio}</div></div><div class="summary-box"><div class="row"><span>Concesionaria</span><b>${d.sucName}</b></div><div class="row"><span>Motivo</span><b>${d.motivo}</b></div><div class="row"><span>Día y hora</span><b>${d.dia} · ${d.hora}</b></div></div>`:''}
    <div class="wiz-nav">${step>0&&step<3?`<button class="btn btn-out btn-md" onclick='Flow._cita(${v?JSON.stringify(v.id):'null'},${step-1},${JSON.stringify(d)})'>${I.chevL(14)} Atrás</button>`:'<span></span>'}${step<3?`<button class="btn btn-conv btn-md" onclick='Flow._citaNext(${v?JSON.stringify(v.id):'null'},${step},${JSON.stringify(d)})'>Continuar ${I.chevR(14)}</button>`:`<button class="btn btn-conv btn-md btn-full" onclick='closeModal();go("#/cuenta?t=citas")'>Ver mis citas</button>`}</div>`;
  showModal(html,'lg');
},
_citaNext(carId,step,d){
  const v=carId?CARS.find(c=>c.id===carId):null;
  if(step===0){if(!Flow.citaSuc&&v){Flow.citaSuc=v.suc}if(!Flow.citaSuc)return toast('Elige una concesionaria','x');d.suc=Flow.citaSuc;d.sucName=getSuc(d.suc).nombre}
  if(step===1){if(!Flow.citaMot)return toast('Elige un motivo','x');d.motivo=Flow.citaMot}
  if(step===2){if(!Flow.citaDia||!Flow.citaHr)return toast('Elige día y hora','x');d.dia=Flow.citaDia;d.hora=Flow.citaHr;const f=folio(d.motivo,'CT');d.folio=f;STATE.citas.unshift({id:uid('c'),folio:f,suc:d.suc,sucName:d.sucName,motivo:d.motivo,dia:d.dia,hora:d.hora,carId:v?.id});STATE.notifs.unshift({id:uid('n'),ic:'blue',t:'Cita agendada',d:`${d.sucName} · ${d.dia} ${d.hora}`,time:'Ahora'});save();updateHeader()}
  this._cita(v,step+1,d);
},

// === CRÉDITO ===
openCredito(carId){const v=carId?CARS.find(c=>c.id===carId):null;ensureAuth(()=>this._cred(v,0,{}))},
_cred(v,step,d){
  const steps=['Tipo de persona','KYC','Documentos','¡Pre-aprobado!'];
  const html=`<h2 style="font-size:22px;color:var(--navy)">Pre-aprobación de crédito</h2><p style="color:var(--n500);font-size:13px;margin-top:4px">Sin afectar tu buró. Recibes respuesta en pantalla.</p>${wizSteps(steps,step)}
  ${step===0?`<div class="choice-grid">${[['pf',I.user(20),'Persona Física','Asalariado o sin actividad'],['pfae',I.briefcase(20),'PFAE','Persona Física Actividad Empresarial'],['pm',I.building(20),'Persona Moral','Empresa']].map(p=>`<button class="choice ${d.tipo===p[0]?'on':''}" onclick="Flow.credTipo='${p[0]}';document.querySelectorAll('.choice').forEach(c=>c.classList.remove('on'));this.classList.add('on')"><div class="check">${I.check(14)}</div><div class="ic">${p[1]}</div><div class="t">${p[2]}</div><div class="d">${p[3]}</div></button>`).join('')}</div>`:''}
  ${step===1?`<div class="field-row"><div class="field"><label>Nombre completo</label><input value="${STATE.customer?.nombre||''}"></div><div class="field"><label>Fecha de nacimiento</label><input type="date"></div></div><div class="field-row"><div class="field"><label>RFC</label><input value="${STATE.customer?.rfc||''}" placeholder="ABCD800101AB1"></div><div class="field"><label>CURP</label><input placeholder="ABCD800101HJCXXX01"></div></div><div class="field-row"><div class="field"><label>Ingreso mensual</label><input type="number" placeholder="45000"></div><div class="field"><label>Antigüedad laboral</label><select><option>Menos de 1 año</option><option selected>1-3 años</option><option>3-5 años</option><option>Más de 5 años</option></select></div></div><div style="font-size:11px;color:var(--n500);display:flex;align-items:center;gap:6px">${I.shield(14)} Tus datos se procesan bajo nuestro aviso de privacidad.</div>`:''}
  ${step===2?`<div style="display:flex;flex-direction:column;gap:10px"><div class="upload-zone has"><div class="ic">${I.check(24)}</div><div class="t">INE.pdf · subida ✓</div><div class="d">Anverso y reverso detectados</div></div><div class="upload-zone has"><div class="ic">${I.check(24)}</div><div class="t">comprobante_domicilio.pdf ✓</div><div class="d">Recibo de luz · 1 mes de antigüedad</div></div><div class="upload-zone has"><div class="ic">${I.check(24)}</div><div class="t">recibos_nomina_3meses.pdf ✓</div><div class="d">3 últimos recibos detectados</div></div></div><div style="font-size:11px;color:var(--n500);margin-top:8px;display:flex;align-items:center;gap:6px">${I.check(14)} Demo: documentos pre-cargados</div>`:''}
  ${step===3?(()=>{const linea=v?v.precio:850000;const tasa=13.5;const m=v?mensCredito(v.precio,20,60):mensCredito(linea,20,60);return `<div class="ok-circle">${I.check(28)}</div><h2 style="text-align:center;color:var(--navy);font-size:24px">¡Estás pre-aprobado!</h2><p style="text-align:center;color:var(--n500);margin-top:6px;font-size:14px">Línea de crédito asignada. Vigencia 30 días.</p><div class="mensbox" style="margin-top:18px"><div class="lbl">Línea pre-aprobada</div><div class="v tnum">${mxn(linea)}</div><div class="sub">Tasa fija ${tasa}% anual · 12 a 60 meses</div></div><div class="summary-box"><div class="row"><span>Ejemplo: 60 meses al 20% enganche</span><b class="tnum">${mxn(m)}/mes</b></div><div class="row"><span>Folio</span><b>${d.folio}</b></div></div>`})():''}
  <div class="wiz-nav">${step>0&&step<3?`<button class="btn btn-out btn-md" onclick='Flow._cred(${v?JSON.stringify(v.id):'null'},${step-1},${JSON.stringify(d)})'>${I.chevL(14)} Atrás</button>`:'<span></span>'}${step<3?`<button class="btn btn-conv btn-md" onclick='Flow._credNext(${v?JSON.stringify(v.id):'null'},${step},${JSON.stringify(d)})'>Continuar ${I.chevR(14)}</button>`:`<div style="display:flex;gap:8px;width:100%"><button class="btn btn-out btn-md" style="flex:1" onclick='closeModal();go("#/cuenta?t=credito")'>Ver Mi Crédito</button>${v?`<button class="btn btn-conv btn-md" style="flex:1" onclick='closeModal();Flow.openCheckout("${v.id}")'>Apartar este auto</button>`:`<button class="btn btn-conv btn-md" style="flex:1" onclick='closeModal();go("#/catalogo")'>Explorar catálogo</button>`}</div>`}</div>`;
  showModal(html,'lg');
},
_credNext(carId,step,d){const v=carId?CARS.find(c=>c.id===carId):null;if(step===0){if(!Flow.credTipo)return toast('Elige tipo de persona','x');d.tipo=Flow.credTipo}if(step===2){const f=folio('CR','PA');d.folio=f;const linea=v?v.precio:850000;STATE.creditos.unshift({id:uid('cr'),folio:f,linea,tasa:13.5,fecha:new Date().toISOString().slice(0,10),estado:'pre-aprobado',vigencia:30});STATE.customer.preap=true;STATE.customer.linea=linea;STATE.customer.kyc=true;STATE.notifs.unshift({id:uid('n'),ic:'green',t:'Crédito pre-aprobado',d:`Línea por ${mxn(linea)} · vigencia 30 días`,time:'Ahora'});save()}this._cred(v,step+1,d)},

// === ARRENDAMIENTO ===
openLease(carId){const v=carId?CARS.find(c=>c.id===carId):null;ensureAuth(()=>this._lease(v,0,{}))},
_lease(v,step,d){
  const steps=['Tipo','Plan','Contrato','Confirmación'];
  const plazos=[24,36,48];const precio=v?v.precio:500000;
  const html=`<h2 style="font-size:22px;color:var(--navy)">Cotizar GP Autolease</h2>${wizSteps(steps,step)}
  ${step===0?`<div class="choice-grid">${[['pfae',I.briefcase(20),'PFAE','Persona Física con Actividad Empresarial'],['pm',I.building(20),'Persona Moral','Empresa o Pyme']].map(p=>`<button class="choice ${d.tipo===p[0]?'on':''}" onclick="Flow.leaseTipo='${p[0]}';document.querySelectorAll('.choice').forEach(c=>c.classList.remove('on'));this.classList.add('on')"><div class="check">${I.check(14)}</div><div class="ic">${p[1]}</div><div class="t">${p[2]}</div><div class="d">${p[3]}</div></button>`).join('')}</div>`:''}
  ${step===1?`<div class="field"><label>Plazo</label><div class="plazos" style="margin-top:8px">${plazos.map(p=>`<button class="${d.plazo===p?'on':''}" onclick="Flow.leasePlazo=${p};document.querySelectorAll('.plazos button').forEach(b=>b.classList.remove('on'));this.classList.add('on')">${p} meses</button>`).join('')}</div></div><div class="summary-box"><div class="row"><span>Auto</span><b>${v?v.marca+' '+v.modelo:'(catálogo)'}</b></div><div class="row"><span>Renta mensual estimada (24m)</span><b class="tnum">${mxn(rentaLease(precio,24))}</b></div><div class="row"><span>Renta mensual estimada (36m)</span><b class="tnum">${mxn(rentaLease(precio,36))}</b></div><div class="row"><span>Renta mensual estimada (48m)</span><b class="tnum">${mxn(rentaLease(precio,48))}</b></div></div>`:''}
  ${step===2?`<div class="field"><label>Razón social</label><input placeholder="Mi Empresa SA de CV"></div><div class="field-row"><div class="field"><label>RFC</label><input placeholder="ABC800101AB1"></div><div class="field"><label>Representante legal</label><input value="${STATE.customer?.nombre||''}"></div></div><div style="background:var(--n50);border-radius:12px;padding:14px;font-size:12px;color:var(--n600);margin-top:10px;display:flex;align-items:flex-start;gap:8px">${I.doc(16)} <span>Contrato marco generado. Vigencia ${d.plazo||36} meses. Opción de compra al final.</span></div>`:''}
  ${step===3?`<div class="ok-circle">${I.check(28)}</div><h2 style="text-align:center;color:var(--navy);font-size:24px">¡Cotización lista!</h2><p style="text-align:center;color:var(--n500);margin-top:6px;font-size:14px">Tu asesor de flotillas te contactará en menos de 24h.</p><div class="folio"><div class="k">Folio cotización</div><div class="v">${d.folio}</div></div>`:''}
  <div class="wiz-nav">${step>0&&step<3?`<button class="btn btn-out btn-md" onclick='Flow._lease(${v?JSON.stringify(v.id):'null'},${step-1},${JSON.stringify(d)})'>${I.chevL(14)} Atrás</button>`:'<span></span>'}${step<3?`<button class="btn btn-conv btn-md" onclick='Flow._leaseNext(${v?JSON.stringify(v.id):'null'},${step},${JSON.stringify(d)})'>Continuar ${I.chevR(14)}</button>`:`<button class="btn btn-conv btn-md btn-full" onclick='closeModal();go("#/cuenta?t=autolease")'>Ver Mi Autolease</button>`}</div>`;
  showModal(html,'lg');
},
_leaseNext(carId,step,d){const v=carId?CARS.find(c=>c.id===carId):null;if(step===0){if(!Flow.leaseTipo)return toast('Elige tipo','x');d.tipo=Flow.leaseTipo}if(step===1){d.plazo=Flow.leasePlazo||36}if(step===2){const f=folio('AL','CT');d.folio=f;const precio=v?v.precio:500000;STATE.leases.unshift({id:uid('al'),folio:f,plazo:d.plazo,renta:rentaLease(precio,d.plazo),tipo:d.tipo,fecha:new Date().toISOString().slice(0,10),estado:'cotizado'});STATE.notifs.unshift({id:uid('n'),ic:'green',t:'Autolease cotizado',d:`Renta estimada ${mxn(rentaLease(precio,d.plazo))}/mes · ${d.plazo}m`,time:'Ahora'});save()}this._lease(v,step+1,d)},

// === TRADE-IN ===
openTradein(quick=false){this._ti(0,{quick})},
_ti(step,d){
  const steps=['Identifica','Inspección','Oferta','Confirmación'];
  const html=`<h2 style="font-size:22px;color:var(--navy)">Valúa tu auto</h2><p style="color:var(--n500);font-size:13px;margin-top:4px">Oferta firme en 2 minutos. Sin compromiso.</p>${wizSteps(steps,step)}
  ${step===0?`<div class="field-row"><div class="field"><label>Marca</label><select id="ti_m">${['Mazda','Hyundai','Toyota','Nissan','Chevrolet','Ford','Volkswagen','Kia','Jeep','Otro'].map(m=>`<option ${d.marca===m?'selected':''}>${m}</option>`).join('')}</select></div><div class="field"><label>Modelo</label><input id="ti_mo" placeholder="CX-5, Versa, etc." value="${d.modelo||''}"></div></div><div class="field-row"><div class="field"><label>Año</label><select id="ti_y">${Array.from({length:15},(_,i)=>2025-i).map(y=>`<option ${d.anio==y?'selected':''}>${y}</option>`).join('')}</select></div><div class="field"><label>Kilometraje</label><input id="ti_k" type="number" placeholder="50000" value="${d.km||''}"></div></div><div class="field-row"><div class="field"><label>Transmisión</label><select id="ti_t"><option>Automática</option><option>Manual</option></select></div><div class="field"><label>Estado general</label><select id="ti_e"><option>Excelente</option><option selected>Bueno</option><option>Regular</option></select></div></div>`:''}
  ${step===1?`<p style="font-size:13px;color:var(--n600);margin-bottom:12px">Sube 4 fotos clave. En la versión final, nuestro asesor puede agendar inspección física.</p><div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">${['Frente','Lado izquierdo','Lado derecho','Trasera'].map(t=>`<div class="upload-zone has"><div class="ic">${I.check(20)}</div><div class="t">${t} ✓</div><div class="d">demo.jpg</div></div>`).join('')}</div><div style="background:var(--n50);border-radius:12px;padding:14px;margin-top:14px;font-size:12px;color:var(--n600);display:flex;align-items:flex-start;gap:8px">${I.shield(16)} <span>Verificamos contra catálogo de partes y libro azul. Oferta firme hasta inspección presencial.</span></div>`:''}
  ${step===2?(()=>{const base=d.anio>=2022?420000:d.anio>=2019?280000:d.anio>=2016?180000:120000;const ajuste=Math.max(.4,1-(d.km||50000)/200000);const oferta=Math.round(base*ajuste/1000)*1000;const bonus=Math.round(oferta*.08/1000)*1000;d.oferta=oferta;d.bonus=bonus;return `<div style="text-align:center"><div style="font-family:var(--disp);font-size:11px;font-weight:700;text-transform:uppercase;color:var(--n500);letter-spacing:1px">Oferta firme · 7 días</div><div style="font-family:var(--disp);font-weight:900;font-size:42px;color:var(--navy);margin-top:4px" class="tnum">${mxn(oferta)}</div><div style="font-size:13px;color:var(--n600)">${d.marca||'Tu auto'} ${d.anio||''} · ${num(d.km||50000)} km</div></div><div style="margin-top:20px;display:flex;flex-direction:column;gap:10px"><button class="choice ${d.path==='cambio'?'on':''}" style="text-align:left;position:relative" onclick="Flow.tiPath='cambio';document.querySelectorAll('.choice').forEach(c=>c.classList.remove('on'));this.classList.add('on')"><div class="check">${I.check(14)}</div><span class="bp bp-gold" style="position:absolute;top:14px;right:42px">+${mxn(bonus)}</span><div style="display:flex;gap:12px;align-items:center"><div class="ic">${I.cycle(20)}</div><div><div class="t">Cambiar por un seminuevo Plasencia</div><div class="d">Oferta + bonus aplicado como enganche</div></div></div></button><button class="choice ${d.path==='efectivo'?'on':''}" style="text-align:left" onclick="Flow.tiPath='efectivo';document.querySelectorAll('.choice').forEach(c=>c.classList.remove('on'));this.classList.add('on')"><div class="check">${I.check(14)}</div><div style="display:flex;gap:12px;align-items:center"><div class="ic">${I.cash(20)}</div><div><div class="t">Vender en efectivo</div><div class="d">Transferencia en 24h tras entrega</div></div></div></button><button class="choice ${d.path==='guardar'?'on':''}" style="text-align:left" onclick="Flow.tiPath='guardar';document.querySelectorAll('.choice').forEach(c=>c.classList.remove('on'));this.classList.add('on')"><div class="check">${I.check(14)}</div><div style="display:flex;gap:12px;align-items:center"><div class="ic">${I.cal(20)}</div><div><div class="t">Mantener oferta firme 7 días</div><div class="d">Decide sin presión</div></div></div></button></div>`})():''}
  ${step===3?`<div class="ok-circle">${I.check(28)}</div><h2 style="text-align:center;color:var(--navy);font-size:24px">¡Valuación registrada!</h2><p style="text-align:center;color:var(--n500);margin-top:6px;font-size:14px">${d.path==='cambio'?'Aplica como enganche de cualquier seminuevo del catálogo.':d.path==='efectivo'?'Tu asesor te contactará para coordinar inspección y pago.':'Oferta firme por 7 días.'}</p><div class="folio"><div class="k">Folio valuación</div><div class="v">${d.folio}</div></div><div class="summary-box"><div class="row"><span>Tu auto</span><b>${d.marca||'—'} ${d.anio||''}</b></div><div class="row"><span>Oferta</span><b class="tnum">${mxn(d.oferta)}</b></div>${d.path==='cambio'?`<div class="row"><span>Bonus por cambio</span><b style="color:var(--green-d)" class="tnum">+${mxn(d.bonus)}</b></div><div class="row tot"><span>Total aplicable</span><b class="tnum">${mxn(d.oferta+d.bonus)}</b></div>`:''}</div>`:''}
  <div class="wiz-nav">${step>0&&step<3?`<button class="btn btn-out btn-md" onclick='Flow._ti(${step-1},${JSON.stringify(d)})'>${I.chevL(14)} Atrás</button>`:'<span></span>'}${step<3?`<button class="btn btn-conv btn-md" onclick='Flow._tiNext(${step},${JSON.stringify(d)})'>${step===2?'Confirmar elección':'Continuar'} ${I.chevR(14)}</button>`:`<div style="display:flex;gap:8px;width:100%">${d.path==='cambio'?`<button class="btn btn-conv btn-md" style="flex:1" onclick='closeModal();go("#/catalogo?cond=seminuevo")'>Ver seminuevos</button>`:`<button class="btn btn-out btn-md" style="flex:1" onclick='closeModal();go("#/cuenta?t=tradein")'>Ver mi trade-in</button>`}<button class="btn btn-out btn-md" style="flex:1" onclick='closeModal()'>Cerrar</button></div>`}</div>`;
  showModal(html,'lg');
},
_tiNext(step,d){if(step===0){d.marca=$('#ti_m').value;d.modelo=$('#ti_mo').value;d.anio=+$('#ti_y').value;d.km=+$('#ti_k').value||50000}if(step===2){if(!Flow.tiPath)return toast('Elige un camino','x');d.path=Flow.tiPath;const f=folio('TI','VA');d.folio=f;ensureAuth(()=>{STATE.tradeins.unshift({id:uid('ti'),folio:f,marca:d.marca,anio:d.anio,km:d.km,oferta:d.oferta,bonus:d.path==='cambio'?d.bonus:0,path:d.path,fecha:new Date().toISOString().slice(0,10),estado:'oferta firme',vigencia:7});STATE.notifs.unshift({id:uid('n'),ic:'gold',t:'Valuación lista',d:`${d.marca} ${d.anio} · oferta ${mxn(d.oferta)}`,time:'Ahora'});save();updateHeader();this._ti(step+1,d)});return}this._ti(step+1,d)},

// === FLOTILLAS ===
openFlotilla(){this._flot(0,{})},
_flot(step,d){
  const steps=['Empresa','Necesidades','Confirmación'];
  const html=`<h2 style="font-size:22px;color:var(--navy)">Cotización Plasencia Flotillas</h2>${wizSteps(steps,step)}
  ${step===0?`<div class="field"><label>Razón social</label><input id="fl_rs" placeholder="Mi Empresa SA de CV"></div><div class="field-row"><div class="field"><label>RFC</label><input id="fl_rfc"></div><div class="field"><label>Industria</label><select id="fl_ind"><option>Logística</option><option>Construcción</option><option>Comercial</option><option>Servicios</option><option>Gobierno</option></select></div></div><div class="field"><label>Contacto</label><input id="fl_nom" value="${STATE.customer?.nombre||''}"></div><div class="field-row"><div class="field"><label>Correo corporativo</label><input id="fl_em" type="email" value="${STATE.customer?.email||''}"></div><div class="field"><label>Teléfono</label><input id="fl_tel" value="${STATE.customer?.tel||''}"></div></div>`:''}
  ${step===1?`<div class="field"><label>Cantidad de unidades</label><select id="fl_n"><option>1-5</option><option>6-15</option><option>16-50</option><option>+50</option></select></div><div class="field"><label>Uso principal</label><div class="choice-grid">${[[I.car(20),'Ejecutivo','Sedanes y SUVs'],[I.truck(20),'Carga','Pickups y vans'],[I.key(20),'Flota mixta','Combinado']].map((u,i)=>`<button class="choice ${i===0?'on':''}" onclick="document.querySelectorAll('.choice').forEach(c=>c.classList.remove('on'));this.classList.add('on');Flow.flotUso='${u[1]}'"><div class="check">${I.check(14)}</div><div class="ic">${u[0]}</div><div class="t">${u[1]}</div><div class="d">${u[2]}</div></button>`).join('')}</div></div><div class="field"><label>Forma de pago preferida</label><div class="plazos" style="margin-top:8px"><button class="on" onclick="document.querySelectorAll('.plazos button').forEach(b=>b.classList.remove('on'));this.classList.add('on');Flow.flotPago='Lease'">GP Autolease</button><button onclick="document.querySelectorAll('.plazos button').forEach(b=>b.classList.remove('on'));this.classList.add('on');Flow.flotPago='Credito'">Crédito automotriz</button><button onclick="document.querySelectorAll('.plazos button').forEach(b=>b.classList.remove('on'));this.classList.add('on');Flow.flotPago='Contado'">Contado</button></div></div>`:''}
  ${step===2?`<div class="ok-circle">${I.check(28)}</div><h2 style="text-align:center;color:var(--navy);font-size:24px">¡Solicitud enviada!</h2><p style="text-align:center;color:var(--n500);margin-top:6px;font-size:14px">Nuestro equipo de flotillas te contactará en menos de 24 horas hábiles con propuesta cross-marca.</p><div class="folio"><div class="k">Folio cotización</div><div class="v">${d.folio}</div></div>`:''}
  <div class="wiz-nav">${step>0&&step<2?`<button class="btn btn-out btn-md" onclick='Flow._flot(${step-1},${JSON.stringify(d)})'>${I.chevL(14)} Atrás</button>`:'<span></span>'}${step<2?`<button class="btn btn-conv btn-md" onclick='Flow._flotNext(${step},${JSON.stringify(d)})'>Continuar ${I.chevR(14)}</button>`:`<button class="btn btn-conv btn-md btn-full" onclick='closeModal()'>Cerrar</button>`}</div>`;
  showModal(html,'lg');
},
_flotNext(step,d){if(step===1){const f=folio('FL','CT');d.folio=f;STATE.cotizaciones.unshift({id:uid('co'),folio:f,tipo:'flotilla',fecha:new Date().toISOString().slice(0,10),estado:'recibida'});STATE.notifs.unshift({id:uid('n'),ic:'green',t:'Cotización flotillas recibida',d:'Asesor te contactará en 24h',time:'Ahora'});save()}this._flot(step+1,d)},

// === SEGUROS ===
openSeguro(carId){ensureAuth(()=>this._seg(carId,0,{}))},
_seg(carId,step,d){
  const v=carId?CARS.find(c=>c.id===carId):null;
  const steps=['Auto a asegurar','Cobertura','Prima','¡Contratado!'];
  const garageCars=STATE.garage||[];
  const html=`<h2 style="font-size:22px;color:var(--navy)">Cotizar Plasencia Seguros</h2><p style="color:var(--n500);font-size:13px;margin-top:4px">Cobertura amplia respaldada por GNP. Activa hoy mismo.</p>${wizSteps(steps,step)}
  ${step===0?`
    ${garageCars.length?`<div style="font-family:var(--disp);font-size:11px;font-weight:700;text-transform:uppercase;color:var(--n500);letter-spacing:.5px;margin-bottom:8px">Autos en tu garage</div><div class="choice-grid" style="grid-template-columns:1fr">${garageCars.map(g=>`<button class="choice ${d.car===g.id?'on':''}" onclick="Flow.segCar='${g.id}';document.querySelectorAll('.choice').forEach(c=>c.classList.remove('on'));this.classList.add('on')"><div class="check">${I.check(14)}</div><div style="display:flex;gap:12px;align-items:center"><img src="${g.img}" style="width:60px;height:40px;object-fit:cover;border-radius:6px"><div><div class="t">${g.marca} ${g.modelo} ${g.anio}</div><div class="d">Placas ${g.placas} · ${num(g.km)} km</div></div></div></button>`).join('')}</div>`:''}
    <div style="font-family:var(--disp);font-size:11px;font-weight:700;text-transform:uppercase;color:var(--n500);letter-spacing:.5px;margin:18px 0 8px">O ingresa otro auto</div>
    <div class="field-row"><div class="field"><label>Marca</label><select id="sg_mk">${MARCAS.map(m=>`<option>${m}</option>`).join('')}</select></div><div class="field"><label>Año</label><select id="sg_yr">${Array.from({length:10},(_,i)=>2026-i).map(y=>`<option>${y}</option>`).join('')}</select></div></div>
  `:''}
  ${step===1?`<div class="choice-grid">${[['rc',I.shield(20),'Responsabilidad civil','La básica obligatoria','$3,200/año'],['lim',I.shield(20),'Limitada','RC + robo total','$5,800/año'],['amp',I.shield(20),'Amplia','RC + robo + daños','$9,400/año'],['plus',I.shield(20),'Amplia Plus','Todo + auto sustituto','$11,240/año']].map(p=>`<button class="choice ${d.cov===p[0]?'on':''}" onclick="Flow.segCov='${p[0]}';document.querySelectorAll('.choice').forEach(c=>c.classList.remove('on'));this.classList.add('on')"><div class="check">${I.check(14)}</div>${p[0]==='plus'?'<span class="bp bp-gold" style="position:absolute;top:12px;right:34px;font-size:9px">Recomendado</span>':''}<div class="ic">${p[1]}</div><div class="t">${p[2]}</div><div class="d">${p[3]} · ${p[4]}</div></button>`).join('')}</div><div style="font-size:11px;color:var(--n500);margin-top:12px;display:flex;align-items:center;gap:6px">${I.shield(14)} Respaldado por GNP — A.M. Best A · 120+ años en México.</div>`:''}
  ${step===2?(()=>{const primas={rc:3200,lim:5800,amp:9400,plus:11240};const p=primas[d.cov]||11240;d.prima=p;return `<div style="text-align:center"><div style="font-family:var(--disp);font-size:11px;font-weight:700;text-transform:uppercase;color:var(--n500);letter-spacing:1px">Prima anual</div><div style="font-family:var(--disp);font-weight:900;font-size:42px;color:var(--navy);margin-top:4px" class="tnum">${mxn(p)}</div><div style="font-size:13px;color:var(--n600)">o ${mxn(Math.round(p/12))} al mes · sin recargo por mensualidad</div></div><div class="summary-box"><div class="row"><span>Aseguradora</span><b>Plasencia Seguros · GNP</b></div><div class="row"><span>Cobertura</span><b>${{rc:'Responsabilidad Civil',lim:'Limitada',amp:'Amplia',plus:'Amplia Plus'}[d.cov]||'Amplia Plus'}</b></div><div class="row"><span>Deducible daños / robo</span><b>$5,000 / $15,000</b></div><div class="row"><span>Asistencia 24/7</span><b style="color:var(--green-d)">Incluida</b></div></div><div class="field" style="margin-top:14px"><label>Cómo quieres pagar</label><div class="plazos" style="margin-top:8px"><button class="on">Anual (1 pago)</button><button>Semestral</button><button>Mensual</button></div></div>`})():''}
  ${step===3?`<div class="ok-circle">${I.check(28)}</div><h2 style="text-align:center;color:var(--navy);font-size:24px">¡Tu póliza está activa!</h2><p style="text-align:center;color:var(--n500);margin-top:6px;font-size:14px">Cobertura vigente desde hoy. Recibes la póliza por correo y vive en Mi Plasencia → Mis Seguros.</p><div class="folio"><div class="k">Número de póliza</div><div class="v">${d.folio}</div></div>`:''}
  <div class="wiz-nav">${step>0&&step<3?`<button class="btn btn-out btn-md" onclick='Flow._seg(${carId?JSON.stringify(carId):'null'},${step-1},${JSON.stringify(d)})'>${I.chevL(14)} Atrás</button>`:'<span></span>'}${step<3?`<button class="btn btn-conv btn-md" onclick='Flow._segNext(${carId?JSON.stringify(carId):'null'},${step},${JSON.stringify(d)})'>${step===2?'Contratar ahora':'Continuar'} ${I.chevR(14)}</button>`:`<button class="btn btn-conv btn-md btn-full" onclick='closeModal();go("#/cuenta?t=seguros")'>Ver Mis Seguros</button>`}</div>`;
  showModal(html,'lg');
},
_segNext(carId,step,d){
  if(step===0){d.car=Flow.segCar||carId}
  if(step===1){if(!Flow.segCov)Flow.segCov='plus';d.cov=Flow.segCov}
  if(step===2){const f='PLZ-'+new Date().getFullYear()+'-'+Math.floor(Math.random()*90000+10000);d.folio=f;const g=STATE.garage.find(x=>x.id===d.car);STATE.seguros.unshift({id:uid('sg'),folio:f,aseguradora:'Plasencia Seguros · GNP',poliza:f,vigencia:new Date().toISOString().slice(0,10)+' → '+(new Date().getFullYear()+1)+'-'+String(new Date().getMonth()+1).padStart(2,'0')+'-'+String(new Date().getDate()).padStart(2,'0'),cobertura:{rc:'Responsabilidad Civil',lim:'Limitada',amp:'Amplia',plus:'Amplia Plus'}[d.cov],deducible:'$5,000 daños / $15,000 robo',prima:d.prima,frecuencia:'Anual',carId:g?.carId,modelo:g?g.marca+' '+g.modelo+' '+g.anio:'',estado:'vigente'});STATE.notifs.unshift({id:uid('n'),ic:'green',t:'Póliza activa',d:`${d.cov==='plus'?'Amplia Plus':'cobertura'} · ${mxn(d.prima)}/año`,time:'Ahora'});save();updateHeader()}
  this._seg(carId,step+1,d);
},
};
window.Flow=Flow;
