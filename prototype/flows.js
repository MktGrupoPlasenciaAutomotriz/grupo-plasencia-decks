// ====== FILTROS + COCKPIT PDP ======
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
  if(r.length===0){g.innerHTML='';lm.innerHTML=`<div class="empty"><div class="ic">${I.search(40)}</div><p>Sin resultados con esos filtros.</p></div>`;return}
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
        <button class="btn btn-out btn-md" onclick="Flow.openValuar()">${I.cash(16)} Valuar mi auto</button>
      </div>
      ${mod==='credito'?`<button class="btn btn-ghost btn-md btn-full" style="color:var(--blue-d)" onclick="Flow.openCredito('${v.id}')">${I.card(16)} Pre-aprobar crédito sin afectar buró</button>`:''}
      ${mod==='arrendamiento'?`<button class="btn btn-ghost btn-md btn-full" style="color:var(--blue-d)" onclick="Flow.openLease('${v.id}')">${I.key(16)} Cotizar arrendamiento detallado</button>`:''}
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
      <div class="auth-form" style="display:flex;flex-direction:column;gap:12px">
        ${isSignup?`<div class="field"><label>Nombre completo</label><input id="au_nom" required placeholder="Tu nombre"></div>`:''}
        <div class="field"><label>Correo electrónico</label><input id="au_em" type="email" required placeholder="tu@correo.com"></div>
        <div class="field"><label>Contraseña</label><input id="au_pw" type="password" required placeholder="••••••••"></div>
        ${isSignup?`<div class="field"><label>Teléfono (opcional)</label><input id="au_tel" type="tel" placeholder="33 0000 0000"></div>`:''}
        <button class="btn btn-conv btn-lg" onclick="Auth.submit()" style="margin-top:8px">${isSignup?'Crear cuenta':'Iniciar sesión'}</button>
      </div>
      <p style="font-size:12px;color:var(--n500);margin-top:16px;text-align:center">${isSignup?'Al crear tu cuenta aceptas los términos y aviso de privacidad de Grupo Plasencia.':'<a onclick="toast(&quot;Demo: recuperación de contraseña&quot;)" style="color:var(--blue-d);cursor:pointer">¿Olvidaste tu contraseña?</a>'}</p>
      <div class="auth-demo">¿Solo explorando? <a onclick="Auth.demo()">Continuar como demo →</a></div>
    </div>`);
  },
  demo(){
    STATE.customer={nombre:'Chucho Porras',email:'chucho@plasencia.mx',tel:'33 1234 5678',preap:true,linea:850000,kyc:true,desde:new Date().toISOString().slice(0,10),points:1240};
    STATE.notifs.unshift({id:uid('n'),ic:'green',t:'Bienvenido a Plasencia Marketplace',d:'Tu cuenta demo está lista. Crédito pre-aprobado por '+mxn(850000),time:'Ahora'});
    save();this.close();updateHeader();toast('Sesión demo iniciada');if(this.cb)setTimeout(this.cb,200);else go('#/cuenta');
  },
  submit(){
    const nombre=$('#au_nom')?.value || $('#au_em').value.split('@')[0].replace(/[._]/g,' ').replace(/\b\w/g,c=>c.toUpperCase()) || 'Cliente';
    STATE.customer={nombre,email:$('#au_em').value,tel:$('#au_tel')?.value||'',preap:false,kyc:false,desde:new Date().toISOString().slice(0,10),points:0};
    STATE.notifs.unshift({id:uid('n'),ic:'green',t:'Cuenta creada',d:'Completa tu perfil para pre-aprobar crédito.',time:'Ahora'});
    save();this.close();updateHeader();toast('Cuenta creada');if(this.cb)setTimeout(this.cb,200);else go('#/cuenta?t=perfil');
  }
};
function logout(){if(confirm('¿Cerrar sesión? Tu progreso se conserva.')){STATE.customer=null;save();updateHeader();go('#/');toast('Sesión cerrada')}}
