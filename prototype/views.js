// ====== VEHICLE CARD + VIEWS ======
function vcard(v){
  const mens=mensCredito(v.precio,20,60);
  const suc=getSuc(v.suc);
  const liked=STATE.favs.includes(v.id);
  return `<article class="vcard" onclick="go('#/auto/${v.id}')">
    <div class="ph">
      <img src="${v.fotos[0]}" alt="${v.marca} ${v.modelo}" loading="lazy" onerror="this.src='${FALLBACK}'">
      <div class="ovl">
        ${v.dest?'<span class="bp bp-gold">Destacado</span>':''}
        ${v.cond==='nuevo'?'<span class="bp bp-green">Nuevo · 0 km</span>':'<span class="bp bp-navy">Seminuevo · 167 pts</span>'}
      </div>
      <button class="like ${liked?'on':''}" onclick="event.stopPropagation();toggleFav('${v.id}',this)" aria-label="Guardar">${I.heart(18,liked)}</button>
    </div>
    <div class="body">
      <div class="mk">${v.marca}<span class="yr">· ${v.anio}</span></div>
      <h3>${v.modelo}</h3>
      <div class="specs"><span>${v.cond==='nuevo'?'0 km':num(v.km)+' km'}</span><span>·</span><span>${v.trans}</span><span>·</span><span>${v.fuel}</span></div>
      <div class="seller">
        <div class="seller-av">${initials(suc.nombre)}</div>
        <div class="seller-info">
          <div class="seller-name">${suc.nombre}</div>
          <div class="seller-meta"><span class="star">${I.star(11)}</span>${suc.rating} · ${num(suc.reviews)} reseñas</div>
        </div>
      </div>
      <div class="foot">
        <div><div class="price tnum">${mxn(v.precio)}</div><div class="mens">o <b class="tnum">${mxn(mens)}</b>/mes</div></div>
      </div>
    </div>
  </article>`;
}

const Views={
// ====== HOME ======
home(){
  const dest=CARS.filter(c=>c.dest).slice(0,4);
  const topDealers=SUCS.slice().sort((a,b)=>b.reviews-a.reviews).slice(0,6);
  const SOLUC=[
    [I.car(24),'Comprar','Nuevos y seminuevos certificados de 14 marcas, en un solo catálogo cross-marca.','#/catalogo'],
    [I.card(24),'Financiar','Plasencia Crédito: pre-aprobación en línea en 2 minutos, sin afectar tu buró.',null,'Flow.openCredito()'],
    [I.key(24),'Arrendar','GP Autolease: arrendamiento puro para personas físicas con actividad empresarial y empresas.',null,'Flow.openLease()'],
    [I.shield(24),'Asegurar','Seguros y garantía extendida integrados directamente a tu compra.'],
    [I.wrench(24),'Mantener','Postventa y servicio programado agendados desde tu cuenta única Plasencia.'],
    [I.cycle(24),'Renovar','Tu auto actual se valúa en línea y aplica como enganche del siguiente.'],
  ];
  const PERSONAS=[
    [I.family(24),'Compro mi primer auto','María, 32 años · PFAE','Soy joven, vivo en Zapopan y quiero algo confiable sub $500K. Necesito financiamiento simple y un asesor que me guíe.',"go('#/catalogo?cond=nuevo')"],
    [I.briefcase(24),'Renuevo flotilla de mi empresa','Carlos, 47 años · Pyme','Tengo 8 vehículos de trabajo. Necesito cotización empresarial, factura y mantenimiento programado.',"go('#/flotillas')"],
    [I.cycle(24),'Compro para mi familia','Andrea, 51 años · Decisora del hogar','Necesito un segundo auto para mi hija universitaria. Quiero seminuevo certificado, garantía y un proceso fácil.',"go('#/catalogo?cond=seminuevo')"],
  ];
  const CICLO=[
    ['01','Descubre','Compara entre marcas por uso, no por logo. 12 concesionarias compiten por ti.'],
    ['02','Decide','Calcula crédito o arrendamiento. Valúa tu auto. Pre-aprueba sin afectar buró.'],
    ['03','Aparta','Reserva con $5,000 reembolsables. Paga el enganche en línea, sin filas.'],
    ['04','Vive','Servicios programados, refacciones y postventa desde tu cuenta única.'],
    ['05','Renueva','A los 5 años, recompra con tu historial. El ciclo se cierra dentro del grupo.'],
  ];
  return `
  <section class="hero">
    <div class="bg"></div><div class="grad"></div>
    <div class="hero-in fu">
      <div class="eyebrow gold">Grupo Plasencia · 75 años · 12 concesionarias · 14 marcas</div>
      <h1 style="margin-top:14px">Toda tu vida automotriz,<br><span class="y">en un solo lugar.</span></h1>
      <p class="sub">El marketplace donde las 12 concesionarias del grupo compiten por ti. Compra, financia, arrienda, mantén y renueva tu auto con el respaldo de 75 años.</p>
      <div class="search-shell">
        <div class="si">${I.search(20)}<input id="heroSearch" placeholder="Busca por marca, modelo o uso (ej. SUV familiar)…" onkeydown="if(event.key==='Enter')go('#/catalogo?q='+encodeURIComponent(this.value))"></div>
        <button class="btn btn-conv btn-lg" onclick="go('#/catalogo')">Ver catálogo</button>
      </div>
      <div class="trust-line">
        <span><span class="ico">${I.check(16)}</span>Precio justo, sin sorpresas</span>
        <span><span class="ico">${I.check(16)}</span>167 puntos de inspección</span>
        <span><span class="ico">${I.check(16)}</span>Apartado reembolsable</span>
        <span><span class="ico">${I.check(16)}</span>Crédito sin afectar buró</span>
      </div>
      <div class="hero-stats">
        <div class="stat"><div class="v tnum">${CARS.length}</div><div class="l">Autos disponibles</div></div>
        <div class="stat"><div class="v">${MARCAS.length}</div><div class="l">Marcas del grupo</div></div>
        <div class="stat"><div class="v">${SUCS.length}</div><div class="l">Concesionarias</div></div>
        <div class="stat"><div class="v">75</div><div class="l">Años de historia</div></div>
      </div>
    </div>
  </section>

  <section class="personas"><div class="wrap">
    <h2>¿Qué te trae al marketplace hoy?</h2>
    <p class="lede">Diseñamos cada flujo pensando en quién eres y qué necesitas.</p>
    <div class="persona-grid">
      ${PERSONAS.map(p=>`<div class="persona" onclick="${p[4]}">
        <div class="ic">${p[0]}</div><div class="who">${p[2]}</div><h3>${p[1]}</h3><p>${p[3]}</p>
        <div class="cta">Empezar aquí ${I.chevR(14)}</div>
      </div>`).join('')}
    </div>
  </div></section>

  <div class="marcas"><div class="marcas-in">
    <span class="lbl">Las 14 marcas del grupo</span>
    ${MARCAS.map(m=>{const s=marcaLogoSrc(m);return s?`<img class="marca-logo" src="${s}" alt="${m}" title="${m}" onclick="go('#/catalogo?marca=${encodeURIComponent(m)}')" onerror="this.outerHTML='<b style=\\'font-family:var(--disp);font-weight:800;color:var(--n600);font-size:14px;cursor:pointer\\' onclick=\\'go(\\&quot;#/catalogo?marca=${encodeURIComponent(m)}\\&quot;)\\'>${m}</b>'">`:`<b style="font-family:var(--disp);font-weight:800;color:var(--n600);font-size:14px;cursor:pointer" onclick="go('#/catalogo?marca=${encodeURIComponent(m)}')">${m}</b>`}).join('')}
  </div></div>

  <section class="sec"><div class="wrap">
    <div class="eyebrow">Todo lo que tu auto necesita</div>
    <h2>Seis soluciones. Una sola cuenta. Una relación de cinco años.</h2>
    <p class="lede">No eres un prospecto de una marca, eres cliente del grupo. Todo lo que tu auto necesita, en un solo lugar.</p>
    <div class="sol-grid">
      ${SOLUC.map(s=>`<div class="sol" ${s[3]?`onclick="go('${s[3]}')"`:s[4]?`onclick="${s[4]}"`:''} style="${s[3]||s[4]?'cursor:pointer':''}">
        <div class="ic">${s[0]}</div><h3>${s[1]}</h3><p>${s[2]}</p>
        ${s[3]||s[4]?`<a class="more">Conocer más ${I.chevR(12)}</a>`:''}
      </div>`).join('')}
    </div>
  </div></section>

  <section style="background:#fff;border-top:1px solid var(--n200);border-bottom:1px solid var(--n200)"><div class="wrap" style="padding:80px 24px">
    <div style="display:flex;justify-content:space-between;align-items:flex-end;gap:16px;flex-wrap:wrap">
      <div><div class="eyebrow">Destacados de la semana</div><h2 style="margin-top:10px">Selección de las 12 concesionarias</h2></div>
      <button class="btn btn-out btn-md" onclick="go('#/catalogo')">Ver todo el catálogo ${I.arrowR(16)}</button>
    </div>
    <div class="vgrid">${dest.map(vcard).join('')}</div>
  </div></section>

  <section class="sec"><div class="wrap">
    <div class="eyebrow gold">Las 12 concesionarias del grupo</div>
    <h2 style="margin-top:10px">Tus vendedores en el marketplace.</h2>
    <p class="lede">Cada concesionaria opera dentro del marketplace bajo la promesa Plasencia. Compiten por tu compra: tú eliges con quién te quedas.</p>
    <div class="dealers-hero">
      <div class="bg"></div><div class="grad"></div>
      <div class="ctn"><h2 style="color:#fff">12 concesionarias. 1 grupo. 1 promesa.</h2><p>Cada concesionaria mantiene su identidad y especialidad. Todas operan bajo la promesa Plasencia: precio justo, inspección certificada, garantía por escrito.</p></div>
    </div>
    <div class="dealer-grid">
      ${topDealers.map(d=>`<div class="dealer" onclick="go('#/concesionaria/${d.id}')">
        <div class="ic">${initials(d.nombre)}</div>
        <div class="dealer-info">
          <h4>${d.nombre}</h4><div class="meta">${d.zona} · Desde ${d.desde}</div>
          <div class="rating"><span class="star">${I.star(13)}</span><b>${d.rating}</b><span class="reviews">(${num(d.reviews)} reseñas)</span></div>
          <div class="autos">${d.autos} ${d.autos===1?'auto':'autos'} disponibles ${I.chevR(12)}</div>
        </div>
      </div>`).join('')}
    </div>
    <div style="text-align:center;margin-top:28px"><button class="btn btn-out btn-md" onclick="go('#/concesionarias')">Ver las 12 concesionarias ${I.arrowR(16)}</button></div>
  </div></section>

  <section class="sec" style="background:#fff;border-top:1px solid var(--n200)"><div class="wrap">
    <div class="eyebrow">El ciclo del auto, capturado</div>
    <h2 style="margin-top:10px">Comprar un auto no es un evento. Es una relación.</h2>
    <p class="lede">Cinco años, doce oportunidades. El grupo te acompaña en todo el ciclo.</p>
    <div class="ciclo-grid ciclo">
      ${CICLO.map(c=>`<div><div class="n">${c[0]}</div><h3>${c[1]}</h3><p>${c[2]}</p></div>`).join('')}
    </div>

    <div class="plasi-explainer">
      <div class="av">P</div>
      <div>
        <h3>Conoce a Plasi, tu asistente IA</h3>
        <p>Plasi es el asistente de inteligencia artificial del marketplace. Te ayuda a elegir auto, cotizar crédito o arrendamiento, valuar tu auto actual, agendar cita o resolver dudas. Disponible 24/7 desde el botón flotante.</p>
      </div>
      <button class="btn btn-gold btn-md" onclick="Plasi.open()">${I.chat(16)} Hablar con Plasi</button>
    </div>

    <div class="promo">
      <div class="img"></div>
      <div class="ctn">
        <div class="eyebrow gold">Para ti y tu familia</div>
        <h2>Empieza por el auto. Quédate por el grupo.</h2>
        <p>Explora el catálogo cross-marca y vive la experiencia automotriz como debe ser en la era digital y de la IA.</p>
        <div style="margin-top:24px;display:flex;gap:10px;flex-wrap:wrap">
          <button class="btn btn-gold btn-lg" onclick="go('#/catalogo')">Explorar catálogo</button>
          <button class="btn btn-out btn-lg" style="color:#fff;border-color:rgba(255,255,255,.3)" onclick="Plasi.open()">${I.chat(16)} Hablar con Plasi</button>
        </div>
      </div>
    </div>
  </div></section>`;
},

// ====== CATALOGO ======
catalogo(){
  const tipos=[...new Set(CARS.map(c=>c.tipo))];
  return `<div class="filters"><div class="filters-in">
    <input placeholder="Buscar auto…" value="${FILT.q}" oninput="setF('q',this.value)">
    <select onchange="setF('cond',this.value)"><option value="todos">Condición</option><option value="nuevo" ${FILT.cond==='nuevo'?'selected':''}>Nuevos</option><option value="seminuevo" ${FILT.cond==='seminuevo'?'selected':''}>Seminuevos</option></select>
    <select onchange="setF('marca',this.value)"><option value="todas">Marca</option>${MARCAS.map(m=>`<option ${FILT.marca===m?'selected':''}>${m}</option>`).join('')}</select>
    <select onchange="setF('tipo',this.value)"><option value="todas">Tipo</option>${tipos.map(t=>`<option ${FILT.tipo===t?'selected':''}>${t}</option>`).join('')}</select>
    <select onchange="setF('max',+this.value)"><option value="99999999">Precio máx.</option><option value="350000">&lt; $350,000</option><option value="600000">&lt; $600,000</option><option value="900000">&lt; $900,000</option></select>
    <span class="count" id="fcount"></span>
  </div></div>
  <div class="wrap" style="padding:32px 24px 0">
    <div class="eyebrow">Catálogo cross-marca · 12 concesionarias</div>
    <h2 style="font-size:clamp(24px,3vw,34px);font-weight:800;color:var(--navy);margin-top:8px">Encuentra por uso, no por logo</h2>
  </div>
  <div class="wrap" style="padding-bottom:48px"><div id="vgrid" class="vgrid"></div><div id="loadmore" style="text-align:center;margin-top:40px"></div></div>`;
},

// ====== CONCESIONARIAS ======
concesionarias(){
  return `<div class="wrap" style="padding:40px 24px 0">
    <div class="eyebrow">Las 12 concesionarias del grupo</div>
    <h2 style="font-size:clamp(24px,3vw,34px);color:var(--navy);margin-top:8px">Tus vendedores en el marketplace.</h2>
    <p class="lede">Cada concesionaria opera dentro del marketplace bajo la promesa Plasencia. Elige por proximidad, rating o especialidad.</p>
  </div>
  <div class="wrap" style="padding-bottom:48px;padding-top:24px"><div class="dealer-grid">
    ${SUCS.map(d=>`<div class="dealer" onclick="go('#/concesionaria/${d.id}')">
      <div class="ic">${initials(d.nombre)}</div>
      <div class="dealer-info">
        <h4>${d.nombre}</h4><div class="meta">${d.zona} · Especialista ${d.marca} · Desde ${d.desde}</div>
        <div class="rating"><span class="star">${I.star(13)}</span><b>${d.rating}</b><span class="reviews">(${num(d.reviews)} reseñas)</span></div>
        <div class="autos">${d.autos} ${d.autos===1?'auto':'autos'} disponibles ${I.chevR(12)}</div>
      </div>
    </div>`).join('')}
  </div></div>`;
},

concesionaria(id){
  const d=SUCS.find(x=>x.id===id);
  if(!d)return `<div class="empty"><p>Concesionaria no encontrada.</p></div>`;
  const autos=CARS.filter(c=>c.suc===id);
  return `<section class="dealer-hero-page"><div class="wrap">
    <div class="av">${initials(d.nombre)}</div>
    <div>
      <h1>${d.nombre}</h1>
      <div class="meta"><span>${I.pin(14)} ${d.zona}</span><span>Especialista ${d.marca}</span><span>${I.cal(14)} Desde ${d.desde}</span></div>
      <div class="rating-row"><span style="display:flex;align-items:center;gap:6px"><b>${d.rating}</b> ${I.star(18)} rating</span><span>${num(d.reviews)} reseñas verificadas</span></div>
    </div>
    <div class="stats">
      <div><div class="v">${autos.length}</div><div class="l">Autos</div></div>
      <div><div class="v">${2026-d.desde}</div><div class="l">Años</div></div>
      <div><div class="v">${d.rating}</div><div class="l">Rating</div></div>
    </div>
  </div></section>
  <div class="wrap" style="padding:40px 24px">
    <h2 style="font-size:24px;color:var(--navy)">Inventario en ${d.nombre}</h2>
    ${autos.length?`<div class="vgrid" style="margin-top:24px">${autos.slice(0,12).map(vcard).join('')}</div>`:`<div class="empty"><p>Sin autos en este momento.</p></div>`}
  </div>`;
},

// ====== FLOTILLAS ======
flotillas(){
  const BENEF=[
    [I.briefcase(24),'Cotización empresarial','Tarifas preferenciales por volumen, facturación a tu empresa, contrato marco para futuras unidades.'],
    [I.doc(24),'Crédito y arrendamiento','Líneas de crédito para flotillas, deducibilidad fiscal vía GP Autolease, contratos a 24-60 meses.'],
    [I.wrench(24),'Mantenimiento integral','Servicio programado en las 12 concesionarias del grupo, refacciones priorizadas, uptime garantizado.'],
  ];
  return `<section class="flotillas-hero"><div class="wrap">
    <div>
      <div class="eyebrow gold" style="color:var(--gold)">Plasencia Flotillas</div>
      <h1 style="margin-top:14px">Una flota.<br><span>Una sola gestión.</span></h1>
      <p class="sub">Para Pymes, corporativos y gobierno. Cotización empresarial cross-marca, crédito o arrendamiento, mantenimiento programado y atención dedicada.</p>
      <div style="margin-top:24px;display:flex;gap:10px;flex-wrap:wrap">
        <button class="btn btn-gold btn-lg" onclick="Flow.openFlotilla()">Cotizar flotilla ${I.arrowR(16)}</button>
        <button class="btn btn-out btn-lg" style="color:#fff;border-color:rgba(255,255,255,.3)" onclick="alert('Contacto comercial demo')">${I.phone(16)} Llamar a un asesor</button>
      </div>
    </div>
    <div class="quick-form">
      <h3>Cotización express</h3>
      <p style="font-size:13px;color:var(--n600);margin-top:4px">Recibe propuesta en 24 horas.</p>
      <div style="margin-top:14px;display:flex;flex-direction:column;gap:10px">
        <div class="field"><label>Empresa</label><input id="ff_emp" placeholder="Razón social"></div>
        <div class="field"><label>Unidades requeridas</label><select id="ff_unid"><option>1-5 unidades</option><option>6-15 unidades</option><option>16-50 unidades</option><option>+50 unidades</option></select></div>
        <div class="field"><label>Uso principal</label><select id="ff_uso"><option>Reparto / logística</option><option>Personal ejecutivo</option><option>Fuerza de ventas</option><option>Servicios / técnicos</option><option>Otro</option></select></div>
        <button class="btn btn-conv btn-md" onclick="Flow.submitFlotilla()">Solicitar cotización</button>
      </div>
    </div>
  </div></section>
  <section class="sec"><div class="wrap">
    <div class="eyebrow">Beneficios Plasencia Flotillas</div>
    <h2 style="margin-top:10px">Pensado para quien factura y opera flota.</h2>
    <div class="flot-benef">
      ${BENEF.map(b=>`<div class="bf"><div class="ic">${b[0]}</div><h4>${b[1]}</h4><p>${b[2]}</p></div>`).join('')}
    </div>
    <div style="margin-top:48px;background:#fff;border:1px solid var(--n200);border-radius:18px;padding:32px">
      <h3 style="font-size:20px;color:var(--navy)">Marcas disponibles para flotilla</h3>
      <p style="font-size:13px;color:var(--n600);margin-top:4px">Las 14 marcas del grupo, incluyendo nuevos y seminuevos.</p>
      <div style="margin-top:18px;display:flex;flex-wrap:wrap;gap:18px;align-items:center">
        ${MARCAS.map(m=>{const s=marcaLogoSrc(m);return s?`<img class="marca-logo" src="${s}" alt="${m}" title="${m}" style="height:32px">`:`<b style="font-family:var(--disp);color:var(--n600)">${m}</b>`}).join('')}
      </div>
    </div>
  </div></section>`;
},

// ====== PDP ======
pdp(id){
  const v=CARS.find(c=>c.id===id);
  if(!v)return `<div class="empty"><p>Vehículo no encontrado. <a href="#/catalogo" style="color:var(--red);font-weight:700">Ver catálogo</a></p></div>`;
  PDP={v,foto:0,mod:'credito',plazo:60,eng:20};
  setTimeout(renderCockpit,0);
  const suc=getSuc(v.suc);
  return `<div class="wrap"><div class="crumb"><a href="#/">Inicio</a>${I.chevR(12)}<a href="#/catalogo">Catálogo</a>${I.chevR(12)}<span style="color:var(--navy)">${v.marca} ${v.modelo}</span></div>
    <div class="pdp">
      <div>
        <div class="gal-main"><img id="galMain" src="${v.fotos[0]}" onerror="this.src='${FALLBACK}'" alt="${v.marca} ${v.modelo}"></div>
        <div class="gal-thumbs">${v.fotos.map((f,i)=>`<button class="${i===0?'on':''}" onclick="setFoto(${i})"><img src="${f}" onerror="this.src='${FALLBACK}'"></button>`).join('')}</div>
        <div class="trust-row">
          <div class="t"><span class="ic">${I.check(18)}</span>${v.cond==='nuevo'?'Unidad nueva de agencia':'167 puntos de inspección'}</div>
          <div class="t"><span class="ic">${I.shield(18)}</span>Garantía incluida</div>
          <div class="t"><span class="ic">${I.doc(18)}</span>${v.cond==='nuevo'?'Factura de agencia':'Historial documentado'}</div>
          <div class="t"><span class="ic">${I.cycle(18)}</span>Devolución 7 días</div>
        </div>
        <div class="seller-box">
          <div class="av">${initials(suc.nombre)}</div>
          <div class="info">
            <h4>Vendido por ${suc.nombre}</h4>
            <div class="meta">${suc.zona} · Especialista ${suc.marca} · Desde ${suc.desde}</div>
            <div class="rating"><span class="star">${I.star(15)}</span><b>${suc.rating}</b><span class="rv">${num(suc.reviews)} reseñas · ${suc.autos} autos</span></div>
          </div>
          <div class="ctas">
            <a href="#/concesionaria/${suc.id}" class="btn btn-out btn-sm">Ver concesionaria</a>
            <button class="btn btn-wa btn-sm" onclick="alert('Mensaje a la concesionaria via WhatsApp (demo)')">${I.wa(14)} WhatsApp</button>
          </div>
        </div>
        <h2 style="font-size:20px;color:var(--navy);margin-top:28px">Especificaciones</h2>
        <div class="specs-grid">
          ${[['Año',v.anio],['Kilometraje',v.cond==='nuevo'?'0 km':num(v.km)+' km'],['Transmisión',v.trans],['Combustible',v.fuel],['Rendimiento',v.rend+' km/l'],['Pasajeros',v.pas],['Color',v.color||'Por elegir'],['Carrocería',v.tipo],['Sucursal',suc.nombre.replace('Plasencia ','')]].map(s=>`<div class="c"><div class="k">${s[0]}</div><div class="v">${s[1]}</div></div>`).join('')}
        </div>
      </div>
      <div><div class="cockpit" id="cockpit"></div></div>
    </div>
    <div style="margin-top:64px"><h2 style="font-size:22px;color:var(--navy);margin-bottom:20px">Similares en el grupo</h2>
      <div class="vgrid">${CARS.filter(c=>c.tipo===v.tipo&&c.id!==v.id).slice(0,4).map(vcard).join('')}</div>
    </div>
  </div>`;
},

cuenta(){return Account.view()},
};
