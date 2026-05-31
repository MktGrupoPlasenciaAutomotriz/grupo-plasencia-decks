// ====== WIZARD HELPERS ======
function steps(arr,cur){return `<div class="wiz-steps">${arr.map((s,i)=>`<div class="wiz-step ${i===cur?'on':i<cur?'done':''}"><div class="num">${i<cur?I.check(14):i+1}</div><span>${s}</span></div>${i<arr.length-1?`<div class="wiz-sep ${i<cur?'done':''}"></div>`:''}`).join('')}</div>`}
function field(id,label,type='text',placeholder='',value=''){return `<div class="field"><label>${label}</label><input id="${id}" type="${type}" placeholder="${placeholder}" value="${value}"></div>`}

// ====== FLOW · todos los flujos transaccionales simulados ======
const Flow={
  // CHECKOUT (apartado → datos → pago → confirmación → entrega)
  openCheckout(carId){
    if(!STATE.customer){Auth.open('signup',()=>Flow.openCheckout(carId));return}
    const v=CARS.find(c=>c.id===carId);if(!v)return;
    this.coStep=0;this.coCar=v;this.coData={metodo:'tarjeta',pagar:5000};
    this.renderCheckout();
  },
  renderCheckout(){
    const v=this.coCar,s=this.coStep,d=this.coData;
    const labels=['Resumen','Tus datos','Pago','Confirmación'];
    let body='';
    if(s===0){
      body=`<h2 style="font-size:22px;color:var(--navy);margin-bottom:6px">Resumen del apartado</h2>
        <p style="font-size:13px;color:var(--n600);margin-bottom:18px">Reserva esta unidad con un depósito reembolsable. Si no continúas, te devolvemos el 100%.</p>
        <div style="display:flex;gap:14px;align-items:center;padding:16px;background:var(--n50);border-radius:14px"><img src="${v.fotos[0]}" style="width:100px;aspect-ratio:16/10;object-fit:cover;border-radius:10px"><div><div style="font-family:var(--disp);font-size:11px;font-weight:800;text-transform:uppercase;color:var(--n600)">${v.marca} · ${v.anio}</div><h3 style="font-size:17px;color:var(--navy);margin-top:2px">${v.modelo}</h3><div class="tnum" style="font-family:var(--disp);font-weight:800;color:var(--navy);font-size:18px;margin-top:6px">${mxn(v.precio)}</div></div></div>
        <div class="summary-box"><div class="row"><span>Depósito reembolsable</span><b class="tnum">${mxn(5000)}</b></div><div class="row"><span>Vigencia del apartado</span><b>72 horas</b></div><div class="row"><span>Concesionaria</span><b>${getSuc(v.suc).nombre}</b></div><div class="row tot"><span>A pagar hoy</span><b class="tnum">${mxn(5000)}</b></div></div>`;
    } else if(s===1){
      const c=STATE.customer;
      body=`<h2 style="font-size:22px;color:var(--navy);margin-bottom:6px">Confirma tus datos</h2>
        <p style="font-size:13px;color:var(--n600);margin-bottom:18px">Los datos se usan para el contrato del apartado.</p>
        <div class="field-row">${field('co_nom','Nombre completo','text','Tu nombre',c.nombre)}${field('co_em','Correo','email','tu@correo.com',c.email)}</div>
        <div class="field-row">${field('co_tel','Teléfono','tel','33 1234 5678',c.tel)}${field('co_rfc','RFC','text','POXC900101AB1',c.rfc||'')}</div>`;
    } else if(s===2){
      body=`<h2 style="font-size:22px;color:var(--navy);margin-bottom:6px">Método de pago</h2>
        <p style="font-size:13px;color:var(--n600);margin-bottom:18px">Pago seguro. Tu depósito se mantiene reembolsable hasta el contrato final.</p>
        <div class="choice-grid">
          ${[['tarjeta','Tarjeta de crédito/débito',I.card(20),'Visa, MC, AMEX. Aprobación instantánea.'],['transfer','Transferencia SPEI',I.cash(20),'Confirmamos en 30 minutos hábiles.'],['oxxo','Pago en OXXO',I.building(20),'Genera ficha y paga en cualquier tienda.'],['wa','WhatsApp con asesor',I.wa(20),'Te enlaza un asesor para guiarte.']].map(m=>`<button class="choice ${d.metodo===m[0]?'on':''}" onclick="Flow.coData.metodo='${m[0]}';Flow.renderCheckout()"><div class="ic">${m[2]}</div><div class="t">${m[1]}</div><div class="d">${m[3]}</div><div class="check">${I.check(12)}</div></button>`).join('')}
        </div>
        ${d.metodo==='tarjeta'?`<div style="margin-top:18px">
          ${field('co_card','Número de tarjeta','text','4242 4242 4242 4242')}
          <div class="field-row">${field('co_exp','Vence (MM/AA)','text','12/28')}${field('co_cvv','CVV','text','•••')}</div>
        </div>`:''}
        <div class="summary-box" style="background:rgba(72,187,120,.06);border-color:rgba(72,187,120,.2)"><div style="display:flex;align-items:center;gap:8px;color:var(--green-d);font-size:13px"><span>${I.shield(16)}</span>Pago 100% seguro · datos cifrados · cumple PCI-DSS</div></div>`;
    } else {
      const f=folio(v.marca,'GP');
      // Crear deal real
      if(!d.created){
        STATE.deals.unshift({id:uid('d'),folio:f,carId:v.id,modalidad:PDP?.mod||'credito',estado:'apartado',apartado:5000,mensualidad:PDP?.mod==='credito'?Math.round(mensCredito(v.precio,PDP.eng,PDP.plazo)):PDP?.mod==='arrendamiento'?Math.round(rentaLease(v.precio,PDP.plazo)):null,plazo:PDP?.mod!=='contado'?PDP?.plazo:null,createdAt:Date.now()});
        STATE.notifs.unshift({id:uid('n'),ic:'green',t:`Apartaste ${v.marca} ${v.modelo}`,d:'Folio '+f+' · Te contactará la concesionaria',time:'Ahora'});
        save();d.created=true;d.folio=f;updateHeader();
      }
      body=`<div class="ok-circle">${I.check(28)}</div><h2 style="font-size:24px;color:var(--navy);text-align:center">¡Apartado confirmado!</h2>
        <p style="font-size:14px;color:var(--n600);text-align:center;margin-top:6px">Tu ${v.marca} ${v.modelo} está reservado. ${getSuc(v.suc).nombre} te contactará en las próximas horas.</p>
        <div class="folio"><div class="k">Folio</div><div class="v tnum">${d.folio}</div></div>
        <div class="summary-box"><div class="row"><span>Depósito pagado</span><b class="tnum">${mxn(5000)}</b></div><div class="row"><span>Estado</span><b style="color:var(--green-d)">Confirmado</b></div><div class="row"><span>Vigencia</span><b>72 horas</b></div></div>
        <div style="margin-top:18px;padding:14px;background:var(--n50);border-radius:12px;font-size:13px;color:var(--n600);display:flex;align-items:center;gap:10px"><span style="color:var(--blue-d)">${I.cal(18)}</span><div><b style="color:var(--navy);font-family:var(--disp)">Próximo paso:</b> Agenda tu cita para conocer el auto y firmar el contrato.</div></div>`;
    }
    const isLast=s===3;
    showModal(`${steps(labels,s)}${body}<div class="wiz-nav">${s>0&&!isLast?`<button class="btn btn-out btn-md" onclick="Flow.coStep--;Flow.renderCheckout()">${I.chevL(16)} Atrás</button>`:'<div></div>'}${isLast?`<div style="display:flex;gap:8px;margin-left:auto;flex-wrap:wrap"><button class="btn btn-out btn-md" onclick="closeModal();go('#/cuenta')">Ir a Mi Plasencia</button><button class="btn btn-conv btn-md" onclick="closeModal();Flow.openCita('${v.id}')">Agendar cita ${I.arrowR(16)}</button></div>`:`<button class="btn btn-conv btn-md" onclick="Flow.coStep++;Flow.renderCheckout()">${s===2?'Confirmar pago':'Continuar'} ${I.arrowR(16)}</button>`}</div>`,'lg');
  },

  // CITA (sucursal → día → hora → confirmación)
  openCita(carId){
    if(!STATE.customer){Auth.open('signup',()=>Flow.openCita(carId));return}
    const v=carId?CARS.find(c=>c.id===carId):null;
    this.ciStep=0;this.ciCar=v;this.ciData={suc:v?v.suc:SUCS[0].id,dia:1,hora:'',motivo:'test_drive'};
    this.renderCita();
  },
  renderCita(){
    const v=this.ciCar,s=this.ciStep,d=this.ciData;
    const labels=v?['¿Para qué?','Día y hora','Confirmación']:['Concesionaria','¿Para qué?','Día y hora','Confirmación'];
    let body='';
    const dias=Array.from({length:7},(_,i)=>{const dt=new Date();dt.setDate(dt.getDate()+i+1);return{n:i+1,d:dt.toLocaleDateString('es-MX',{weekday:'short',day:'numeric',month:'short'})}});
    const horas=['09:00','10:00','11:00','12:00','13:00','16:00','17:00','18:00'];
    const stepIdx=v?s:s;

    if(!v && s===0){
      body=`<h2 style="font-size:22px;color:var(--navy);margin-bottom:6px">Elige concesionaria</h2><p style="font-size:13px;color:var(--n600);margin-bottom:18px">Te atendemos en cualquiera de las 12 del grupo.</p>
        <div style="display:flex;flex-direction:column;gap:8px;max-height:340px;overflow-y:auto">${SUCS.map(sc=>`<button class="choice ${d.suc===sc.id?'on':''}" style="display:flex;align-items:center;gap:12px;text-align:left" onclick="Flow.ciData.suc='${sc.id}';Flow.renderCita()"><div style="width:42px;height:42px;border-radius:10px;background:linear-gradient(135deg,var(--navy),var(--slate));color:var(--gold);font-family:var(--disp);font-weight:900;font-size:14px;display:flex;align-items:center;justify-content:center;flex-shrink:0">${initials(sc.nombre)}</div><div style="flex:1"><div class="t">${sc.nombre}</div><div class="d">${sc.zona} · ${sc.rating} ★</div></div><div class="check">${I.check(12)}</div></button>`).join('')}</div>`;
    } else if((v && s===0)||(!v && s===1)){
      body=`<h2 style="font-size:22px;color:var(--navy);margin-bottom:6px">¿Para qué nos visitas?</h2>
        <div class="choice-grid" style="grid-template-columns:1fr">
          ${[['test_drive','Prueba de manejo',I.car(22),'Quiero conducir la unidad antes de decidir.'],['cotizar','Cotización presencial',I.cash(22),'Quiero ver opciones y precios con un asesor.'],['firma','Firma de contrato',I.doc(22),'Vengo a cerrar la compra ya apartada.'],['entrega','Entrega de mi auto',I.key(22),'Vengo por las llaves de mi auto nuevo.']].map(m=>`<button class="choice ${d.motivo===m[0]?'on':''}" onclick="Flow.ciData.motivo='${m[0]}';Flow.renderCita()"><div style="display:flex;gap:12px;align-items:flex-start"><div class="ic">${m[2]}</div><div><div class="t">${m[1]}</div><div class="d">${m[3]}</div></div></div><div class="check">${I.check(12)}</div></button>`).join('')}
        </div>`;
    } else if((v && s===1)||(!v && s===2)){
      body=`<h2 style="font-size:22px;color:var(--navy);margin-bottom:6px">Elige día y hora</h2><p style="font-size:13px;color:var(--n600);margin-bottom:14px">Te confirmamos por WhatsApp.</p>
        <div style="font-family:var(--disp);font-size:11px;font-weight:700;text-transform:uppercase;color:var(--n500);margin-bottom:6px">Día</div>
        <div class="timeslots" style="grid-template-columns:repeat(7,1fr)">${dias.map(dia=>`<button class="timeslot ${d.dia===dia.n?'on':''}" onclick="Flow.ciData.dia=${dia.n};Flow.renderCita()" style="font-size:11px">${dia.d}</button>`).join('')}</div>
        <div style="font-family:var(--disp);font-size:11px;font-weight:700;text-transform:uppercase;color:var(--n500);margin:14px 0 6px">Hora</div>
        <div class="timeslots">${horas.map((h,i)=>`<button class="timeslot ${d.hora===h?'on':''} ${i===2?'taken':''}" ${i===2?'disabled':''} onclick="${i===2?'':`Flow.ciData.hora='${h}';Flow.renderCita()`}">${h}</button>`).join('')}</div>`;
    } else {
      const sc=getSuc(d.suc);
      const dt=new Date();dt.setDate(dt.getDate()+d.dia);
      const fStr=dt.toLocaleDateString('es-MX',{weekday:'long',day:'numeric',month:'long'});
      const motivos={test_drive:'Prueba de manejo',cotizar:'Cotización presencial',firma:'Firma de contrato',entrega:'Entrega de auto'};
      const fCita=folio(sc.marca,'CITA');
      if(!d.created){STATE.citas.unshift({id:uid('cita'),folio:fCita,carId:v?v.id:null,suc:d.suc,dia:d.dia,hora:d.hora,motivo:d.motivo,fecha:fStr,createdAt:Date.now()});STATE.notifs.unshift({id:uid('n'),ic:'blue',t:'Cita agendada',d:`${motivos[d.motivo]} en ${sc.nombre} · ${fStr} ${d.hora}`,time:'Ahora'});save();d.created=true;d.folio=fCita}
      body=`<div class="ok-circle">${I.check(28)}</div><h2 style="font-size:24px;color:var(--navy);text-align:center">¡Cita agendada!</h2>
        <p style="font-size:14px;color:var(--n600);text-align:center;margin-top:6px">Te enviamos la confirmación por WhatsApp y correo.</p>
        <div class="folio"><div class="k">Folio de cita</div><div class="v tnum">${d.folio}</div></div>
        <div class="summary-box">
          <div class="row"><span>Concesionaria</span><b>${sc.nombre}</b></div>
          <div class="row"><span>Motivo</span><b>${motivos[d.motivo]}</b></div>
          <div class="row"><span>Día</span><b style="text-transform:capitalize">${fStr}</b></div>
          <div class="row"><span>Hora</span><b>${d.hora||'09:00'}</b></div>
          ${v?`<div class="row"><span>Vehículo</span><b>${v.marca} ${v.modelo}</b></div>`:''}
        </div>`;
    }
    const totalSteps=labels.length;const isLast=stepIdx===totalSteps-1;
    const canNext=(!v&&s===0&&d.suc)||(s===(v?0:1)&&d.motivo)||(s===(v?1:2)&&d.hora)||isLast;
    showModal(`${steps(labels,stepIdx)}${body}<div class="wiz-nav">${stepIdx>0&&!isLast?`<button class="btn btn-out btn-md" onclick="Flow.ciStep--;Flow.renderCita()">${I.chevL(16)} Atrás</button>`:'<div></div>'}${isLast?`<button class="btn btn-conv btn-md" onclick="closeModal();go('#/cuenta')" style="margin-left:auto">Ir a Mi Plasencia</button>`:`<button class="btn btn-conv btn-md" onclick="Flow.ciStep++;Flow.renderCita()" ${canNext?'':'disabled'}>Continuar ${I.arrowR(16)}</button>`}</div>`,'lg');
  },

  // CRÉDITO (KYC → ingresos → documentos → resultado)
  openCredito(carId){
    if(!STATE.customer){Auth.open('signup',()=>Flow.openCredito(carId));return}
    const v=carId?CARS.find(c=>c.id===carId):null;
    this.crStep=0;this.crCar=v;this.crData={ingresos:0,buroOK:true,docs:{ine:false,domicilio:false,nomina:false}};
    this.renderCredito();
  },
  renderCredito(){
    const v=this.crCar,s=this.crStep,d=this.crData;
    const labels=['Tipo de persona','Datos KYC','Documentos','Pre-aprobación'];
    let body='';
    if(s===0){
      body=`<h2 style="font-size:22px;color:var(--navy);margin-bottom:6px">¿Qué tipo de persona eres?</h2>
        <p style="font-size:13px;color:var(--n600);margin-bottom:18px">Nos ayuda a darte la mejor tasa y plazo.</p>
        <div class="choice-grid" style="grid-template-columns:1fr">
          ${[['pf','Persona física',I.user(22),'Asalariado o profesionista independiente.'],['pfae','Persona física con actividad empresarial',I.briefcase(22),'PFAE: facturas, deducible.'],['pm','Persona moral',I.building(22),'Empresa con RFC empresarial.']].map(m=>`<button class="choice ${d.tipo===m[0]?'on':''}" onclick="Flow.crData.tipo='${m[0]}';Flow.renderCredito()"><div style="display:flex;gap:12px;align-items:flex-start"><div class="ic">${m[2]}</div><div><div class="t">${m[1]}</div><div class="d">${m[3]}</div></div></div><div class="check">${I.check(12)}</div></button>`).join('')}
        </div>
        <div style="margin-top:18px;padding:14px;background:rgba(66,153,225,.08);border-radius:12px;font-size:12px;color:var(--blue-d);display:flex;align-items:center;gap:10px"><span>${I.shield(18)}</span>Esta es una pre-aprobación suave. <b>No afecta tu buró de crédito.</b></div>`;
    } else if(s===1){
      const c=STATE.customer;
      body=`<h2 style="font-size:22px;color:var(--navy);margin-bottom:6px">Tus datos</h2>
        <div class="field-row">${field('cr_nom','Nombre completo','text','',c.nombre)}${field('cr_rfc','RFC','text','POXC900101AB1',c.rfc||'')}</div>
        ${field('cr_curp','CURP','text','POXC900101HJCRRH00')}
        ${field('cr_ingresos','Ingresos mensuales (MXN)','number','25,000',c.ingresos||'')}
        <div class="field"><label>Antigüedad laboral</label><select id="cr_antig"><option>Menos de 1 año</option><option>1-3 años</option><option selected>3-5 años</option><option>Más de 5 años</option></select></div>`;
    } else if(s===2){
      body=`<h2 style="font-size:22px;color:var(--navy);margin-bottom:6px">Documentos</h2>
        <p style="font-size:13px;color:var(--n600);margin-bottom:18px">Sube fotos claras de los siguientes documentos. Demo: clic para simular subida.</p>
        ${[['ine','INE vigente (ambos lados)'],['domicilio','Comprobante de domicilio (no mayor a 3 meses)'],['nomina','Últimos 3 recibos de nómina o estados de cuenta']].map(doc=>`<div class="upload-zone ${d.docs[doc[0]]?'has':''}" onclick="Flow.crData.docs['${doc[0]}']=true;Flow.renderCredito()"><div class="ic">${d.docs[doc[0]]?I.check(28):I.upload(28)}</div><div class="t">${doc[1]}</div><div class="d">${d.docs[doc[0]]?'Documento cargado correctamente':'PDF o foto · máx 10MB'}</div></div>`).map(h=>`<div style="margin-bottom:10px">${h}</div>`).join('')}`;
    } else {
      const ing=+($('#cr_ingresos')?.value||d.ingresos||45000);d.ingresos=ing;
      const linea=Math.min(ing*15,1500000);const mens=v?Math.round(mensCredito(v.precio,20,60)):0;
      const aprobado=ing>=15000;
      if(!d.created){if(aprobado){STATE.customer.preap=true;STATE.customer.linea=linea;STATE.customer.kyc=true;STATE.customer.ingresos=ing;STATE.notifs.unshift({id:uid('n'),ic:'green',t:'¡Crédito pre-aprobado!',d:`Línea de ${mxn(linea)} · sin afectar tu buró`,time:'Ahora'});save();updateHeader()}d.created=true}
      body=`<div class="ok-circle" style="background:${aprobado?'rgba(72,187,120,.15)':'rgba(214,158,46,.15)'};color:${aprobado?'var(--green-d)':'var(--amber)'}">${aprobado?I.check(28):I.bell(28)}</div>
        <h2 style="font-size:24px;color:var(--navy);text-align:center">${aprobado?'¡Pre-aprobado!':'Tu solicitud está en revisión'}</h2>
        <p style="font-size:14px;color:var(--n600);text-align:center;margin-top:6px">${aprobado?'Felicidades, ya puedes apartar cualquier auto con tu línea pre-aprobada.':'Un asesor te contactará en 24 horas hábiles.'}</p>
        ${aprobado?`<div class="summary-box">
          <div class="row"><span>Línea pre-aprobada</span><b class="tnum" style="color:var(--green-d);font-size:18px">${mxn(linea)}</b></div>
          <div class="row"><span>Tasa</span><b>13.5% anual fija</b></div>
          <div class="row"><span>Plazos</span><b>12 a 60 meses</b></div>
          <div class="row"><span>Enganche mínimo</span><b>20%</b></div>
          ${v?`<div class="row tot"><span>Mensualidad estimada (${v.modelo})</span><b class="tnum" style="color:var(--navy)">${mxn(mens)}</b></div>`:''}
        </div>`:''}`;
    }
    const isLast=s===3;const canNext=(s===0&&d.tipo)||(s===1&&($('#cr_ingresos')?.value||true))||(s===2&&d.docs.ine&&d.docs.domicilio&&d.docs.nomina)||isLast;
    showModal(`${steps(labels,s)}${body}<div class="wiz-nav">${s>0&&!isLast?`<button class="btn btn-out btn-md" onclick="Flow.crStep--;Flow.renderCredito()">${I.chevL(16)} Atrás</button>`:'<div></div>'}${isLast?`<div style="margin-left:auto;display:flex;gap:8px">${v?`<button class="btn btn-conv btn-md" onclick="closeModal();Flow.openCheckout('${v.id}')">Apartar ahora ${I.arrowR(16)}</button>`:`<button class="btn btn-conv btn-md" onclick="closeModal();go('#/catalogo')">Ver catálogo</button>`}</div>`:`<button class="btn btn-conv btn-md" onclick="${s===1?"['nom','rfc','curp','ingresos'].forEach(k=>{const e=document.getElementById('cr_'+k);if(e&&e.value){if(k==='ingresos')Flow.crData.ingresos=+e.value;else STATE.customer[k==='nom'?'nombre':k]=e.value}});":''}Flow.crStep++;Flow.renderCredito()" ${canNext?'':'disabled'}>${s===2?'Verificar y pre-aprobar':'Continuar'} ${I.arrowR(16)}</button>`}</div>`,'lg');
  },

  // LEASE (PFAE/PM → plazo y enganche → contrato → confirmación)
  openLease(carId){
    if(!STATE.customer){Auth.open('signup',()=>Flow.openLease(carId));return}
    const v=carId?CARS.find(c=>c.id===carId):null;
    this.leStep=0;this.leCar=v;this.leData={persona:'pfae',plazo:36,depInicial:10,empresa:''};
    this.renderLease();
  },
  renderLease(){
    const v=this.leCar,s=this.leStep,d=this.leData;
    const labels=['Persona','Plan','Contrato','Confirmación'];
    let body='';
    if(s===0){
      body=`<h2 style="font-size:22px;color:var(--navy);margin-bottom:6px">GP Autolease · Arrendamiento puro</h2>
        <p style="font-size:13px;color:var(--n600);margin-bottom:18px">Renta mensual fija. Sin enganche fuerte. Deducible si facturas.</p>
        <div class="choice-grid" style="grid-template-columns:1fr">
          ${[['pfae','Persona física con actividad empresarial (PFAE)','Deducible · ideal si facturas como persona física.'],['pm','Persona moral','Empresa con RFC. Deducción completa.'],['pf','Persona física','No deducible. Plan personal.']].map(m=>`<button class="choice ${d.persona===m[0]?'on':''}" onclick="Flow.leData.persona='${m[0]}';Flow.renderLease()"><div class="t">${m[1]}</div><div class="d">${m[2]}</div><div class="check">${I.check(12)}</div></button>`).join('')}
        </div>
        ${d.persona==='pm'?`<div style="margin-top:14px">${field('le_emp','Razón social de tu empresa','text','Mi Empresa SA de CV')}</div>`:''}`;
    } else if(s===1){
      const precio=v?v.precio:600000;const renta=Math.round(rentaLease(precio,d.plazo));
      body=`<h2 style="font-size:22px;color:var(--navy);margin-bottom:6px">Tu plan de arrendamiento</h2>
        ${!v?`<div class="field"><label>Auto de interés</label><select id="le_car">${CARS.filter(c=>c.cond==='nuevo').slice(0,20).map(c=>`<option value="${c.id}">${c.marca} ${c.modelo} · ${mxn(c.precio)}</option>`).join('')}</select></div>`:''}
        <div style="font-family:var(--disp);font-size:11px;font-weight:700;text-transform:uppercase;color:var(--n500);margin:14px 0 6px">Plazo</div>
        <div class="plazos">${[24,36,48].map(p=>`<button class="${d.plazo===p?'on':''}" onclick="Flow.leData.plazo=${p};Flow.renderLease()">${p} meses</button>`).join('')}</div>
        <div style="font-family:var(--disp);font-size:11px;font-weight:700;text-transform:uppercase;color:var(--n500);margin:18px 0 6px">Depósito en garantía (${d.depInicial}%)</div>
        <input type="range" min="0" max="20" value="${d.depInicial}" oninput="Flow.leData.depInicial=+this.value;Flow.renderLease()" style="width:100%;accent-color:var(--red)">
        <div class="mensbox" style="margin-top:18px"><div class="lbl">Renta mensual estimada</div><div class="v tnum">${mxn(renta)}</div><div class="sub">${d.plazo} meses · IVA incluido</div></div>
        <div class="summary-box" style="margin-top:14px"><div class="row"><span>Depósito en garantía</span><b class="tnum">${mxn(precio*d.depInicial/100)}</b></div><div class="row"><span>Renta mensual</span><b class="tnum">${mxn(renta)}</b></div><div class="row tot"><span>Total del plan (${d.plazo} m)</span><b class="tnum">${mxn(renta*d.plazo+precio*d.depInicial/100)}</b></div></div>`;
    } else if(s===2){
      body=`<h2 style="font-size:22px;color:var(--navy);margin-bottom:6px">Contrato de arrendamiento</h2>
        <p style="font-size:13px;color:var(--n600);margin-bottom:18px">Documentos para formalizar.</p>
        ${['Identificación oficial','Constancia de situación fiscal','Estados de cuenta (últimos 3 meses)','Comprobante de domicilio'].map(doc=>`<div class="upload-zone has" style="margin-bottom:10px"><div class="ic">${I.check(24)}</div><div class="t">${doc}</div><div class="d">Demo: documento marcado como cargado</div></div>`).join('')}`;
    } else {
      const precio=v?v.precio:600000;const renta=Math.round(rentaLease(precio,d.plazo));const f=folio('AUT','LEASE');
      if(!d.created){STATE.cotizaciones.unshift({id:uid('cot'),tipo:'lease',folio:f,carId:v?v.id:null,plazo:d.plazo,renta,persona:d.persona,createdAt:Date.now()});if(v){STATE.deals.unshift({id:uid('d'),folio:f,carId:v.id,modalidad:'arrendamiento',estado:'apartado',apartado:precio*d.depInicial/100,mensualidad:renta,plazo:d.plazo,createdAt:Date.now()})}STATE.notifs.unshift({id:uid('n'),ic:'green',t:'Arrendamiento contratado',d:`Renta ${mxn(renta)}/mes · ${d.plazo} meses`,time:'Ahora'});save();d.created=true;d.folio=f;updateHeader()}
      body=`<div class="ok-circle">${I.check(28)}</div><h2 style="font-size:24px;color:var(--navy);text-align:center">¡Contrato firmado!</h2>
        <p style="font-size:14px;color:var(--n600);text-align:center;margin-top:6px">Tu contrato GP Autolease está activo. Te contactará un asesor para la entrega.</p>
        <div class="folio"><div class="k">Folio de contrato</div><div class="v tnum">${d.folio}</div></div>
        <div class="summary-box">
          <div class="row"><span>Renta mensual</span><b class="tnum" style="color:var(--navy)">${mxn(renta)}</b></div>
          <div class="row"><span>Plazo</span><b>${d.plazo} meses</b></div>
          <div class="row"><span>Tipo</span><b style="text-transform:uppercase">${d.persona}</b></div>
        </div>`;
    }
    const isLast=s===3;
    showModal(`${steps(labels,s)}${body}<div class="wiz-nav">${s>0&&!isLast?`<button class="btn btn-out btn-md" onclick="Flow.leStep--;Flow.renderLease()">${I.chevL(16)} Atrás</button>`:'<div></div>'}${isLast?`<button class="btn btn-conv btn-md" onclick="closeModal();go('#/cuenta?t=fin')" style="margin-left:auto">Ver en Mi Plasencia</button>`:`<button class="btn btn-conv btn-md" onclick="Flow.leStep++;Flow.renderLease()">${s===2?'Firmar contrato':'Continuar'} ${I.arrowR(16)}</button>`}</div>`,'lg');
  },

  // VALUAR AUTO
  openValuar(){
    showModal(`<h2 style="font-size:22px;color:var(--navy);margin-bottom:6px">Valúa tu auto actual</h2>
      <p style="font-size:13px;color:var(--n600);margin-bottom:18px">Aplica como enganche de tu próximo Plasencia. Estimación inmediata.</p>
      <div class="field-row">${field('vl_marca','Marca','text','Mazda')}${field('vl_modelo','Modelo','text','CX-5')}</div>
      <div class="field-row">${field('vl_anio','Año','number','2020')}${field('vl_km','Kilometraje','number','45000')}</div>
      <div class="field"><label>Estado general</label><select id="vl_est"><option>Excelente</option><option selected>Bueno</option><option>Regular</option></select></div>
      <button class="btn btn-conv btn-md btn-full" style="margin-top:8px" onclick="Flow.calcValuar()">Calcular valor</button>
      <div id="vl_result"></div>`,'lg');
  },
  calcValuar(){
    const m=$('#vl_marca').value,mo=$('#vl_modelo').value,a=+$('#vl_anio').value||2020,km=+$('#vl_km').value||50000;
    const base=400000;const edad=2026-a;const dep=Math.pow(0.86,edad)*Math.max(1-km/200000*0.5,0.4);
    const oferta=Math.round(base*dep/1000)*1000;
    $('#vl_result').innerHTML=`<div class="summary-box" style="margin-top:18px;background:linear-gradient(135deg,var(--navy),var(--navy-d));color:#fff;border:none">
      <div style="font-family:var(--disp);font-size:11px;font-weight:700;text-transform:uppercase;color:var(--gold);letter-spacing:1px">Valor estimado de tu ${m} ${mo} ${a}</div>
      <div style="font-family:var(--disp);font-weight:900;font-size:36px;color:var(--gold);margin-top:6px" class="tnum">${mxn(oferta)}</div>
      <div style="font-size:12px;color:rgba(255,255,255,.7);margin-top:4px">Aplica como enganche. Te enviamos la oferta firme tras inspección.</div>
    </div>
    <button class="btn btn-out btn-md btn-full" style="margin-top:10px" onclick="closeModal();go('#/catalogo')">Ver autos con este enganche ${I.arrowR(16)}</button>`;
  },

  // FLOTILLA
  openFlotilla(){
    this.fStep=0;this.fData={};this.renderFlotilla();
  },
  renderFlotilla(){
    const s=this.fStep,d=this.fData;
    const labels=['Tu empresa','Necesidades','Confirmación'];
    let body='';
    if(s===0){
      body=`<h2 style="font-size:22px;color:var(--navy);margin-bottom:6px">Tu empresa</h2>
        <div class="field-row">${field('fl_emp','Razón social','text','Mi Empresa SA')}${field('fl_rfc','RFC empresarial','text','MEX900101ABC')}</div>
        <div class="field-row">${field('fl_nom','Persona de contacto','text','Tu nombre')}${field('fl_tel','Teléfono','tel','33 0000 0000')}</div>
        ${field('fl_em','Correo corporativo','email','contacto@empresa.com')}
        <div class="field"><label>Sector</label><select id="fl_sect"><option>Logística / Reparto</option><option>Servicios</option><option>Construcción</option><option>Tecnología</option><option>Gobierno</option><option>Otro</option></select></div>`;
    } else if(s===1){
      body=`<h2 style="font-size:22px;color:var(--navy);margin-bottom:6px">Tus necesidades</h2>
        <div class="field-row"><div class="field"><label>Unidades requeridas</label><select id="fl_unid"><option>1-5 unidades</option><option>6-15 unidades</option><option>16-50 unidades</option><option>+50 unidades</option></select></div><div class="field"><label>Plazo de incorporación</label><select id="fl_plz"><option>Inmediato</option><option>1-3 meses</option><option>3-6 meses</option><option>+6 meses</option></select></div></div>
        <div class="field"><label>Modalidad preferida</label><select id="fl_mod"><option>Compra directa</option><option>Arrendamiento puro (GP Autolease)</option><option>Crédito empresarial</option><option>Combinación</option></select></div>
        <div class="field"><label>Tipo de vehículos</label><select id="fl_tipo" multiple size="4" style="height:auto"><option selected>SUV ejecutivo</option><option>Pickup de trabajo</option><option>Sedán de fuerza de ventas</option><option>Van de reparto</option><option>Camión ligero</option></select></div>
        <div class="field"><label>Comentarios (opcional)</label><textarea id="fl_com" rows="3" placeholder="Cuéntanos cualquier detalle relevante"></textarea></div>`;
    } else {
      const f=folio('FLOT','FLT');
      if(!d.created){STATE.cotizaciones.unshift({id:uid('cot'),tipo:'flotilla',folio:f,createdAt:Date.now()});STATE.notifs.unshift({id:uid('n'),ic:'gold',t:'Cotización de flotilla recibida',d:'Un asesor empresarial te contactará en 24h hábiles',time:'Ahora'});save();d.created=true;d.folio=f;updateHeader()}
      body=`<div class="ok-circle">${I.check(28)}</div><h2 style="font-size:24px;color:var(--navy);text-align:center">¡Solicitud recibida!</h2>
        <p style="font-size:14px;color:var(--n600);text-align:center;margin-top:6px">Un asesor empresarial te contactará en 24 horas hábiles con propuesta a medida.</p>
        <div class="folio"><div class="k">Folio de cotización</div><div class="v tnum">${d.folio}</div></div>
        <div style="margin-top:18px;padding:14px;background:var(--n50);border-radius:12px;font-size:13px;color:var(--n600)">${I.briefcase(18)} <b style="color:var(--navy);font-family:var(--disp)">¿Por qué Plasencia Flotillas?</b><br>• Tarifas preferenciales por volumen<br>• Atención dedicada en 12 concesionarias<br>• Mantenimiento programado<br>• Facturación a empresa</div>`;
    }
    const isLast=s===2;
    showModal(`${steps(labels,s)}${body}<div class="wiz-nav">${s>0&&!isLast?`<button class="btn btn-out btn-md" onclick="Flow.fStep--;Flow.renderFlotilla()">${I.chevL(16)} Atrás</button>`:'<div></div>'}${isLast?`<button class="btn btn-conv btn-md" onclick="closeModal()" style="margin-left:auto">Cerrar</button>`:`<button class="btn btn-conv btn-md" onclick="Flow.fStep++;Flow.renderFlotilla()">${s===1?'Enviar solicitud':'Continuar'} ${I.arrowR(16)}</button>`}</div>`,'lg');
  },
  submitFlotilla(){
    const emp=$('#ff_emp')?.value;
    if(!emp){toast('Ingresa el nombre de tu empresa','x');return}
    this.openFlotilla();
  },
};
