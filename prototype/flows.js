// ====== Filtros + Cockpit PDP ======
let FILT={q:'',cond:'todos',marca:'todas',tipo:'todas',max:99999999,shown:12};
let PDP=null;
function applyFilters(){
  let r=CARS.filter(c=>{
    if(FILT.cond!=='todos'&&c.cond!==FILT.cond)return false;
    if(FILT.marca!=='todas'&&c.marca!==FILT.marca)return false;
    if(FILT.tipo!=='todas'&&c.tipo!==FILT.tipo)return false;
    if(c.precio>FILT.max)return false;
    if(FILT.q){const h=(c.marca+' '+c.modelo+' '+c.tipo).toLowerCase();if(!h.includes(FILT.q.toLowerCase()))return false}
    return true;
  });
  const g=$('#vgrid'),cnt=$('#fcount'),lm=$('#loadmore');
  if(cnt)cnt.textContent=r.length+' resultados';
  if(!g)return;
  if(r.length===0){g.innerHTML='';lm.innerHTML=`<div class="empty"><div class="ic">${I.search(40)}</div><p>Sin resultados con esos filtros.</p><button class="btn btn-out btn-md" style="margin-top:14px" onclick="setF('cond','todos');setF('marca','todas');setF('tipo','todas');setF('max',99999999);setF('q','')">Limpiar filtros</button></div>`;return}
  g.innerHTML=r.slice(0,FILT.shown).map(vcard).join('');
  lm.innerHTML=FILT.shown<r.length?`<button class="btn btn-out btn-lg" onclick="FILT.shown+=8;applyFilters()">Ver más vehículos (${r.length-FILT.shown} restantes)</button>`:'';
}
function renderCockpit(){
  const c=$('#cockpit');if(!c||!PDP)return;
  const {v,mod,plazo,eng}=PDP;
  const mens=mod==='credito'?mensCredito(v.precio,eng,plazo):mod==='arrendamiento'?rentaLease(v.precio,plazo):0;
  const plazos=mod==='arrendamiento'?[24,36,48]:[12,24,36,48,60];
  c.innerHTML=`
    <div class="mk">${v.marca} · ${v.anio}</div>
    <h1>${v.modelo}</h1>
    <div class="v-ver">${v.version||v.trans+' · '+v.fuel}</div>
    <div class="price tnum">${mxn(v.precio)}</div>
    <div style="font-family:var(--disp);font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:var(--n500);margin-top:18px">Cómo lo quieres</div>
    <div class="modtabs">${['contado','credito','arrendamiento'].map(m=>`<button class="${mod===m?'on':''}" onclick="setMod('${m}')">${m==='credito'?'Crédito':m==='arrendamiento'?'Arrendar':'Contado'}</button>`).join('')}</div>
    ${mod!=='contado'?`<div class="calc">
      ${mod==='credito'?`<div class="row"><span>Enganche</span><b class="tnum">${mxn(v.precio*eng/100)} · ${eng}%</b></div><input type="range" min="20" max="60" value="${eng}" oninput="PDP.eng=+this.value;renderCockpit()">`:''}
      <div class="row" style="margin-top:10px"><span>Plazo</span></div>
      <div class="plazos">${plazos.map(p=>`<button class="${plazo===p?'on':''}" onclick="PDP.plazo=${p};renderCockpit()">${p}m</button>`).join('')}</div>
      <div class="mensbox"><div class="lbl">${mod==='credito'?'Mensualidad estimada':'Renta mensual estimada'}</div><div class="v tnum">${mxn(mens)}</div><div class="sub">${plazo} meses · ${mod==='credito'?'tasa 13.5% anual':'IVA incluido'}</div></div>
    </div>`:''}
    <div class="cta-stack">
      <button class="btn btn-conv btn-lg btn-full" onclick="Flow.openCheckout('${v.id}')">Apartar con ${mxn(5000)} reembolsable</button>
      <div class="cta-2">
        <button class="btn btn-out btn-md" onclick="Flow.openCita('${v.id}')">${I.cal(16)} Agendar cita</button>
        <button class="btn btn-out btn-md" onclick="Flow.openTradein()">${I.trending(16)} Tomar mi auto</button>
      </div>
      ${mod==='credito'?`<button class="btn btn-ghost btn-md btn-full" style="color:var(--blue-d)" onclick="Flow.openCredito('${v.id}')">${I.card(16)} Pre-aprobar crédito</button>`:''}
      ${mod==='arrendamiento'?`<button class="btn btn-ghost btn-md btn-full" style="color:var(--blue-d)" onclick="Flow.openLease('${v.id}')">${I.key(16)} Cotizar arrendamiento</button>`:''}
    </div>`;
}

// ====== AUTH ======
const Auth={
  mode:'signin',cb:null,
  open(mode='signin',cb=null){this.mode=mode;this.cb=cb;this.render()},
  close(){closeModal();this.cb=null},
  switch(m){this.mode=m;this.render()},
  render(){
    const isSignup=this.mode==='signup';
    showModal(`<div class="auth">
      <h2>${isSignup?'Crea tu cuenta Plasencia':'Bienvenido de vuelta'}</h2>
      <p class="sub">${isSignup?'Una cuenta para todo tu ciclo automotriz con el grupo.':'Accede a tu cuenta del marketplace.'}</p>
      <div class="auth-tabs">
        <button class="${!isSignup?'on':''}" onclick="Auth.switch('signin')">Iniciar sesión</button>
        <button class="${isSignup?'on':''}" onclick="Auth.switch('signup')">Crear cuenta</button>
      </div>
      <div class="auth-social">
        <button onclick="Auth.demo()"><span class="gico">G</span> Continuar con Google</button>
        <button onclick="Auth.demo()"><span class="fico">f</span> Continuar con Facebook</button>
        <button onclick="Auth.demo()">${I.wa(18)} Continuar con WhatsApp</button>
      </div>
      <div class="auth-divider">o con tu correo</div>
      <div style="display:flex;flex-direction:column;gap:12px">
        ${isSignup?`<div class="field"><label>Nombre completo</label><input id="au_nom" placeholder="Tu nombre"></div>`:''}
        <div class="field"><label>Correo electrónico</label><input id="au_em" type="email" placeholder="tu@correo.com"></div>
        <div class="field"><label>Contraseña</label><input id="au_pw" type="password" placeholder="••••••••"></div>
        ${isSignup?`<div class="field"><label>Teléfono (opcional)</label><input id="au_tel" type="tel" placeholder="33 0000 0000"></div>`:''}
        <button class="btn btn-conv btn-lg" onclick="Auth.submit()" style="margin-top:8px">${isSignup?'Crear cuenta':'Iniciar sesión'}</button>
      </div>
      <div class="auth-demo">¿Solo explorando? <a onclick="Auth.demo()">Continuar como demo →</a></div>
    </div>`);
  },
  demo(){
    STATE.customer={nombre:'Cliente Plasencia',email:'demo@plasencia.mx',tel:'33 1234 5678',preap:true,linea:850000,kyc:true,desde:'2025-08-12',points:3480,rfc:'XAXX010101000'};
    // Poblar masivo para demo realista
    const newCar=CARS.find(c=>c.cond==='nuevo')||CARS[0];
    const semiCar=CARS.find(c=>c.cond==='seminuevo')||CARS[1];
    const futCar=CARS.find(c=>c.dest)||CARS[2];
    if(newCar)STATE.reservas=[{id:uid('res'),folio:'GP-MAZ-260520-103045',carId:newCar.id,marca:newCar.marca,modelo:newCar.modelo,anio:newCar.anio,img:newCar.fotos[0],precio:newCar.precio,apart:5000,fecha:'2026-05-20',estado:'apartado',suc:newCar.suc,milestone:2}];
    if(semiCar){
      STATE.garage=[{id:uid('g'),carId:semiCar.id,marca:semiCar.marca,modelo:semiCar.modelo,anio:semiCar.anio,img:semiCar.fotos[0],placas:'JEK-4521-B',vin:'1HGCM82633A4521',km:18560,proxServ:'2026-08-15',adquirido:'2025-09-14',garantia:'Hasta 2028-09-14',proxVerif:'2027-02-01'}];
    }
    STATE.creditos=[{id:uid('cr'),folio:'GP-CR-260512-090000',linea:850000,tasa:13.5,fecha:'2026-05-12',estado:'pre-aprobado',vigencia:18,carId:newCar?.id,saldoUsado:newCar?Math.round(newCar.precio*0.8):0,mensActual:newCar?mensCredito(newCar.precio,20,60):0,proxPago:'2026-06-15',pagosHechos:0,pagosTotal:60}];
    STATE.leases=[{id:uid('al'),folio:'GP-AL-251020-141500',plazo:36,renta:13980,tipo:'pfae',fecha:'2025-10-20',estado:'activo',mesActual:8,proxRenta:'2026-06-20',mesesPagados:7}];
    STATE.tradeins=[{id:uid('ti'),folio:'GP-TI-260528-181200',marca:'Volkswagen',modelo:'Jetta',anio:2019,km:78500,oferta:185000,bonus:14800,path:'cambio',fecha:'2026-05-28',estado:'oferta firme',vigencia:5}];
    STATE.watchlist=CARS.slice(0,5).map(c=>c.id);
    STATE.citas=[
      {id:uid('c'),folio:'GP-TES-260601-100000',suc:newCar?.suc||'bugambilias',sucName:getSuc(newCar?.suc).nombre,motivo:'Entrega de unidad',dia:'2026-06-01',hora:'11:00',carId:newCar?.id},
      {id:uid('c'),folio:'GP-SER-260615-160000',suc:semiCar?.suc||'galerias',sucName:getSuc(semiCar?.suc).nombre,motivo:'Servicio',dia:'2026-08-15',hora:'10:00',carId:semiCar?.id},
    ];
    STATE.pagos=[
      {id:uid('p'),fecha:'2026-05-20',concepto:'Apartado '+newCar?.marca+' '+newCar?.modelo,monto:5000,metodo:'Visa •6411',estado:'aplicado'},
      {id:uid('p'),fecha:'2026-05-15',concepto:'Renta GP Autolease · mes 7',monto:13980,metodo:'Cargo automático',estado:'aplicado'},
      {id:uid('p'),fecha:'2026-04-15',concepto:'Renta GP Autolease · mes 6',monto:13980,metodo:'Cargo automático',estado:'aplicado'},
      {id:uid('p'),fecha:'2026-03-12',concepto:'Servicio 15,000 km · Mazda Galerías',monto:2890,metodo:'Visa •6411',estado:'aplicado'},
    ];
    STATE.servicios=[
      {id:uid('s'),fecha:'2026-03-12',tipo:'Servicio 15,000 km',suc:'Mazda Galerías',km:15240,monto:2890,detalle:'Cambio aceite + filtros + alineación'},
      {id:uid('s'),fecha:'2025-10-08',tipo:'Servicio 10,000 km',suc:'Mazda Galerías',km:10120,monto:2450,detalle:'Cambio aceite + revisión'},
    ];
    STATE.seguros=[{id:uid('sg'),folio:'GP-SG-260510-120000',aseguradora:'Plasencia Seguros · GNP',poliza:'PLZ-2026-04521',vigencia:'2026-05-10 → 2027-05-10',cobertura:'Amplia Plus',deducible:'$5,000 daños / $15,000 robo',prima:11240,frecuencia:'Anual',carId:semiCar?.id,modelo:semiCar?.marca+' '+semiCar?.modelo+' '+semiCar?.anio,estado:'vigente'}];
    STATE.notifs=[
      {id:uid('n'),ic:'green',t:'Cita confirmada · Entrega',d:'Mazda Bugambilias · 1 jun 11:00am',time:'Hace 2h'},
      {id:uid('n'),ic:'gold',t:'Tu Jetta 2019 vale $185,000',d:'Oferta firme vigente 5 días · +$14,800 bonus si lo aplicas',time:'Hoy'},
      {id:uid('n'),ic:'blue',t:'Próximo pago de crédito · 15 jun',d:mxn(mensCredito(newCar?.precio||450000,20,60))+' · cargo automático Visa •6411',time:'Hace 1 día'},
      {id:uid('n'),ic:'green',t:'Bienvenido a Plasencia Marketplace',d:'Tu cuenta demo está lista con datos simulados',time:'Hace 3 días'},
    ];
    save();this.close();updateHeader();toast('Sesión demo iniciada');if(this.cb)setTimeout(this.cb,200);else go('#/cuenta');
  },
  submit(){
    const nombre=$('#au_nom')?.value || $('#au_em')?.value?.split('@')[0].replace(/[._]/g,' ').replace(/\b\w/g,c=>c.toUpperCase()) || 'Cliente';
    STATE.customer={nombre,email:$('#au_em')?.value||'demo@plasencia.mx',tel:$('#au_tel')?.value||'',preap:false,kyc:false,desde:new Date().toISOString().slice(0,10),points:0};
    STATE.notifs.unshift({id:uid('n'),ic:'green',t:'Cuenta creada',d:'Completa tu perfil para pre-aprobar crédito.',time:'Ahora'});
    save();this.close();updateHeader();toast('Cuenta creada');if(this.cb)setTimeout(this.cb,200);else go('#/cuenta?t=perfil');
  }
};
function logout(){if(confirm('¿Cerrar sesión? Tu progreso se conserva.')){STATE.customer=null;save();updateHeader();go('#/');toast('Sesión cerrada')}}
