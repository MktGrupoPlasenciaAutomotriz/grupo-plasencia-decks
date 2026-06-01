// ====== VEHICLE CARD + VIEWS ======
function vcard(v){
  const mens=mensCredito(v.precio,20,60);
  const suc=getSuc(v.suc);
  const liked=STATE.watchlist.includes(v.id);
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
        ${sucLogoHTML(suc,'sm')}
        <div class="seller-info">
          <div class="seller-name">${suc.nombre}</div>
          <div class="seller-meta"><span class="star">${I.star(11)}</span>${suc.rating} · ${num(suc.reviews)}</div>
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
    [I.car(24),'Encuentra tu próximo auto','Compara nuevos y seminuevos de 14 marcas en un solo catálogo. Filtra por uso, presupuesto o forma de pago.','#/catalogo'],
    [I.trending(24),'Vende o cambia el que ya tienes','Sube fotos, recibe oferta firme en 2 minutos. Decide después: efectivo, cambio o esperar.','#/trade-in'],
    [I.card(24),'Págalo como te acomode','Crédito con tasa fija sin afectar tu buró, contado con descuento, o arrendamiento puro si facturas.','#/credito'],
    [I.umbrella(24),'Asegúralo aquí mismo','Cobertura amplia respaldada por GNP. Cotiza, contrata y administra desde tu cuenta.','#/seguros'],
    [I.briefcase(24),'¿Es para tu empresa?','Flotillas: cotización empresarial cross-marca, contrato marco, mantenimiento en los 12 talleres.','#/flotillas'],
    [I.wrench(24),'Mantenlo donde lo compraste','Servicio y refacciones en los 12 talleres del grupo. Agenda en línea, ve tu historial completo.'],
  ];
  // Entradas por INTENCION del cliente, en su voz
  const INTENT=[
    [I.car(20),'Quiero un auto nuevo','Las 14 marcas, lado a lado',`go('#/catalogo?cond=nuevo')`],
    [I.shield(20),'Quiero un seminuevo','Con 167 puntos revisados',`go('#/catalogo?cond=seminuevo')`],
    [I.trending(20),'Quiero vender el mío','Oferta firme en 2 minutos',`go('#/trade-in')`],
    [I.briefcase(20),'Es para mi empresa','Cotización para flotilla',`go('#/flotillas')`],
  ];
  const CICLO=[
    ['01','Descubre sin presión','Ves nuevos, seminuevos y todas las marcas del grupo en un solo catálogo. Filtra por lo que importa: precio, uso, transmisión.'],
    ['02','Decide con datos','Calcula tu crédito o renta, valúa tu auto actual, agenda test drive. Todo desde tu celular, sin pisar la agencia.'],
    ['03','Aparta sin filas','Reserva con $5,000 reembolsables. Pagas el enganche en línea, firmas digital, te entregamos donde tú digas.'],
    ['04','Maneja tranquilo','Tu garage, póliza, próximo servicio y pagos en una sola cuenta. Sin perseguir a nadie por WhatsApp.'],
    ['05','Renueva fácil','Cuando quieras cambiar, tu historial cuenta: trade-in con bonus, crédito ya pre-aprobado, todo dentro del grupo.'],
  ];
  return `
  <section class="hero">
    <div class="bg"></div><div class="grad"></div>
    <div class="hero-in fu">
      <div class="eyebrow gold">+${num(INVENTORY.total)} autos · 14 marcas · ${INVENTORY.agencias} agencias en ${INVENTORY.estados} estados</div>
      <h1 style="margin-top:14px">Tu próximo auto,<br><span class="y">sin perseguir a nadie.</span></h1>
      <p class="sub">Compara entre 14 marcas y +${num(INVENTORY.total)} unidades en un solo catálogo. Cotiza crédito, valúa tu actual y agenda entrega — desde tu celular, en menos de lo que tarda una llamada al vendedor.</p>
      <div class="search-shell">
        <div class="si">${I.search(20)}<input placeholder="¿Qué buscas? SUV familiar, pickup de trabajo, sedán económico…" onkeydown="if(event.key==='Enter')go('#/catalogo?q='+encodeURIComponent(this.value))"></div>
        <button class="btn btn-conv btn-lg" onclick="go('#/catalogo')">Ver catálogo</button>
      </div>
      <div class="trust-line">
        <span><span class="ico">${I.check(16)}</span>Precio sin regateo</span>
        <span><span class="ico">${I.check(16)}</span>Seminuevos con 167 puntos</span>
        <span><span class="ico">${I.check(16)}</span>Apartas con $5,000 reembolsables</span>
        <span><span class="ico">${I.check(16)}</span>Crédito sin afectar tu buró</span>
      </div>
      <div class="hero-stats">
        <div class="stat"><div class="v tnum">+${num(INVENTORY.total)}</div><div class="l">Autos disponibles</div></div>
        <div class="stat"><div class="v tnum">14</div><div class="l">Marcas representadas</div></div>
        <div class="stat"><div class="v tnum">${INVENTORY.agencias}</div><div class="l">Agencias en ${INVENTORY.estados} estados</div></div>
        <div class="stat"><div class="v tnum">75</div><div class="l">Años de respaldo</div></div>
      </div>
    </div>
  </section>

  <section class="intents"><div class="wrap">
    <div class="intents-grid">
      ${INTENT.map(it=>`<button class="intent" onclick="${it[3]}"><div class="ic">${it[0]}</div><h3>${it[1]}</h3><p>${it[2]}</p><div class="more">Empezar ${I.chevR(12)}</div></button>`).join('')}
    </div>
  </div></section>

  <div class="marcas"><div class="marcas-in">
    <span class="lbl">+${num(INVENTORY.total)} autos · 14 marcas · ${INVENTORY.agencias} agencias en ${INVENTORY.estados} estados</span>
    ${MARCAS.map(m=>{const s=marcaLogoSrc(m);const inv=INVENTORY.porMarca[m]||0;const inner=s?`<img src="${s}" alt="${m}">`:`<b style="font-family:var(--disp);font-weight:800;color:var(--n600);font-size:14px">${m}</b>`;return `<button class="marca-chip" onclick="go('#/catalogo?marca=${encodeURIComponent(m)}')" title="${m} · ${inv} autos disponibles">${inner}${inv?`<span class="marca-count tnum">${inv}</span>`:''}</button>`}).join('')}
  </div></div>

  <section class="sec"><div class="wrap">
    <div class="eyebrow">Todo en una cuenta</div>
    <h2>Comprar es solo el principio.</h2>
    <p class="lede">Lo difícil empieza después: financiamiento, seguro, servicio, renovar. Aquí tienes todo eso resuelto y en un solo lugar — para que dejes de coordinar y simplemente uses tu auto.</p>
    <div class="sol-grid">
      ${SOLUC.map(s=>`<div class="sol" ${s[3]?`onclick="go('${s[3]}')"`:''} style="${s[3]?'cursor:pointer':''}">
        <div class="ic">${s[0]}</div><h3>${s[1]}</h3><p>${s[2]}</p>
        ${s[3]?`<a class="more">Conocer más ${I.chevR(12)}</a>`:''}
      </div>`).join('')}
    </div>

    <div class="tradein-band">
      <div class="ctn">
        <div class="eyebrow gold" style="color:var(--gold)">Vende o cambia tu auto actual</div>
        <h2 style="margin-top:10px">Tu auto vale más de lo que crees.</h2>
        <p>Oferta firme en 2 minutos. Sin compromiso. Tres caminos: vender en efectivo, cambiar por un seminuevo o aplicar como enganche de tu próximo Plasencia.</p>
        <div class="ctas">
          <button class="btn btn-gold btn-lg" onclick="go('#/trade-in')">Valuar mi auto ${I.arrowR(16)}</button>
          <button class="btn btn-ghost-dark btn-lg" onclick="Plasi.open('¿Cómo funciona el trade-in?')">¿Cómo funciona?</button>
        </div>
      </div>
      <div class="stats">
        <div class="stat"><div class="v">2 min</div><div class="l">Para tu oferta firme</div></div>
        <div class="stat"><div class="v">+$X</div><div class="l">Bonus si lo aplicas a compra</div></div>
        <div class="stat"><div class="v">200+</div><div class="l">Trade-ins al mes</div></div>
      </div>
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
    <div class="eyebrow gold">12 agencias compitiendo por ti</div>
    <h2 style="margin-top:10px">Elige con quién quieres tratar.</h2>
    <p class="lede">Cada agencia tiene su propio rating, reseñas y especialidad. Tú decides cuál te entrega — con la misma promesa Plasencia: precio justo, inspección certificada, garantía por escrito.</p>
    <div class="dealers-hero">
      <div class="bg"></div><div class="grad"></div>
      <div class="ctn"><h2 style="color:#fff">12 agencias. 14 marcas. Una sola promesa.</h2><p>Cambia de agencia sin perder tu historial. Compra en una, da servicio en otra, vende en una tercera. Tu cuenta Plasencia te sigue.</p></div>
    </div>
    <div class="dealer-grid">
      ${topDealers.map(d=>`<div class="dealer" onclick="go('#/concesionaria/${d.id}')">
        ${sucLogoHTML(d,'md')}
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
    <div class="eyebrow">Cómo funciona</div>
    <h2 style="margin-top:10px">De decidir a manejar, en cinco pasos.</h2>
    <p class="lede">Y después seguimos juntos: cada servicio, cada pago, cada renovación. Sin perder tu historial cuando cambies de auto.</p>
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
          <button class="btn btn-ghost-dark btn-lg" onclick="Plasi.open()">${I.chat(16)} Hablar con Plasi</button>
        </div>
      </div>
    </div>
  </div></section>`;
},

// ====== CATALOGO ======
catalogo(){
  const tipos=[...new Set(CARS.map(c=>c.tipo))];
  return `<div class="brand-strip">
    <div class="brand-strip-in">
      <button class="brand-chip ${FILT.marca==='todas'?'on':''}" onclick="setF('marca','todas')"><span class="all-ic">${I.car(18)}</span><span class="brand-lbl">Todas</span></button>
      ${MARCAS.map(m=>{const s=marcaLogoSrc(m);return `<button class="brand-chip ${FILT.marca===m?'on':''}" onclick="setF('marca','${m}')" title="${m}">${s?`<img src="${s}" alt="${m}">`:`<span class="brand-lbl">${m}</span>`}</button>`}).join('')}
    </div>
  </div>
  <div class="filters"><div class="filters-in">
    <input placeholder="Buscar auto…" value="${FILT.q}" oninput="setF('q',this.value)">
    <select onchange="setF('cond',this.value)"><option value="todos">Condición</option><option value="nuevo" ${FILT.cond==='nuevo'?'selected':''}>Nuevos</option><option value="seminuevo" ${FILT.cond==='seminuevo'?'selected':''}>Seminuevos</option></select>
    <select onchange="setF('tipo',this.value)"><option value="todas">Tipo</option>${tipos.map(t=>`<option ${FILT.tipo===t?'selected':''}>${t}</option>`).join('')}</select>
    <select onchange="setF('max',+this.value)"><option value="99999999">Precio máx.</option><option value="350000">&lt; $350,000</option><option value="600000">&lt; $600,000</option><option value="900000">&lt; $900,000</option></select>
    <span class="count" id="fcount"></span>
  </div></div>
  <div class="wrap" style="padding:32px 24px 0">
    <div class="eyebrow">${FILT.marca==='todas'?`+${num(INVENTORY.total)} unidades · 14 marcas · 12 agencias`:`${INVENTORY.porMarca[FILT.marca]||0} ${FILT.marca} disponibles ahora`}</div>
    <h2 style="font-size:clamp(24px,3vw,34px);font-weight:800;color:var(--navy);margin-top:8px">${FILT.marca==='todas'?'Todo el inventario, lado a lado':FILT.marca+' en el Grupo Plasencia'}</h2>
    <p style="font-size:13px;color:var(--n500);margin-top:6px">Mostramos una selección curada de los autos más buscados. ¿No ves el que quieres? <a style="color:var(--blue-d);text-decoration:underline;cursor:pointer" onclick="Plasi.open('Busco un auto específico que no veo en el catálogo')">Pregúntale a Plasi</a> o <a style="color:var(--blue-d);text-decoration:underline;cursor:pointer" onclick="Flow.openCita()">agenda con un asesor</a>.</p>
  </div>
  <div class="wrap" style="padding-bottom:48px"><div id="vgrid" class="vgrid"></div><div id="loadmore" style="text-align:center;margin-top:40px"></div></div>`;
},

// ====== CONCESIONARIAS ======
concesionarias(){
  return `<div class="wrap" style="padding:40px 24px 0">
    <div class="eyebrow">+${num(INVENTORY.total)} autos · ${INVENTORY.agencias} agencias · 14 marcas · ${INVENTORY.estados} estados</div>
    <h2 style="font-size:clamp(24px,3vw,34px);color:var(--navy);margin-top:8px">Elige con quién quieres tratar.</h2>
    <p class="lede">El grupo opera <b>${INVENTORY.agencias} agencias</b> en ${INVENTORY.ciudades.join(', ')}. Aquí ves las ${SUCS.length} más activas en Guadalajara. <a style="color:var(--blue-d);text-decoration:underline;cursor:pointer" onclick="Plasi.open('¿Tienen agencia en mi ciudad?')">Pregunta por tu ciudad</a> · tu cuenta funciona en cualquiera.</p>
  </div>
  <div class="wrap" style="padding-bottom:48px;padding-top:24px"><div class="dealer-grid">
    ${SUCS.map(d=>{const inv=INVENTORY.porSucursal[d.id]||d.autos;return `<div class="dealer" onclick="go('#/concesionaria/${d.id}')">
      ${sucLogoHTML(d,'md')}
      <div class="dealer-info">
        <h4>${d.nombre}</h4><div class="meta">${d.zona} · Especialista ${d.marca} · Desde ${d.desde}</div>
        <div class="rating"><span class="star">${I.star(13)}</span><b>${d.rating}</b><span class="reviews">(${num(d.reviews)} reseñas)</span></div>
        <div class="autos"><b class="tnum">${num(inv)}</b> autos disponibles ${I.chevR(12)}</div>
      </div>
    </div>`}).join('')}
  </div></div>`;
},

concesionaria(id){
  const d=SUCS.find(x=>x.id===id);
  if(!d)return `<div class="empty"><p>Concesionaria no encontrada.</p></div>`;
  const autos=CARS.filter(c=>c.suc===id);
  return `<section class="dealer-hero-page"><div class="wrap">
    ${sucLogoHTML(d,'xl')}
    <div>
      <h1>${d.nombre}</h1>
      <div class="meta"><span style="display:flex;align-items:center;gap:4px">${I.pin(14)} ${d.zona}</span><span>Especialista ${d.marca}</span><span style="display:flex;align-items:center;gap:4px">${I.cal(14)} Desde ${d.desde}</span></div>
      <div class="rating-row"><span style="display:flex;align-items:center;gap:6px"><b>${d.rating}</b> ${I.star(18)} rating</span><span>${num(d.reviews)} reseñas verificadas</span></div>
    </div>
    <div class="stats">
      <div><div class="v tnum">${num(INVENTORY.porSucursal[d.id]||d.autos)}</div><div class="l">Autos disponibles</div></div>
      <div><div class="v tnum">${2026-d.desde}</div><div class="l">Años</div></div>
      <div><div class="v tnum">${d.rating}</div><div class="l">Rating</div></div>
    </div>
  </div></section>
  <div class="wrap" style="padding:40px 24px">
    <div style="display:flex;justify-content:space-between;align-items:flex-end;gap:14px;flex-wrap:wrap;margin-bottom:8px">
      <div>
        <h2 style="font-size:24px;color:var(--navy)">Inventario en ${d.nombre}</h2>
        <p style="font-size:13px;color:var(--n500);margin-top:4px">Mostramos ${Math.min(12,autos.length)} de ${num(INVENTORY.porSucursal[d.id]||d.autos)} disponibles. ¿Buscas algo específico? <a style="color:var(--blue-d);text-decoration:underline;cursor:pointer" onclick="Plasi.open('Buscar auto en ${d.nombre}')">Pregúntale a Plasi</a>.</p>
      </div>
      <button class="btn btn-out btn-md" onclick="Flow.openCita()">${I.cal(14)} Agendar visita</button>
    </div>
    ${autos.length?`<div class="vgrid" style="margin-top:24px">${autos.slice(0,12).map(vcard).join('')}</div>`:`<div class="empty"><div class="ic">${I.car(40)}</div><p>Sin autos en la selección curada — el inventario completo lo tiene el asesor.</p><button class="btn btn-conv btn-md" style="margin-top:14px" onclick="Flow.openCita()">Agendar visita</button></div>`}
  </div>`;
},

// ====== TRADE-IN (público) ======
tradein(){
  const PATHS=[
    [I.cash(28),'Vender en efectivo','Te pagamos por transferencia en 24 horas. Sin compromiso de compra.','Mejor para liquidez inmediata'],
    [I.cycle(28),'Cambiar por un seminuevo','Aplica como enganche de un seminuevo de Plasencia. Bono adicional por cambio.','+$ bonus','recommended'],
    [I.cal(28),'Mantener oferta firme','Tu valuación queda firme 7 días. Decide cuando quieras, sin presión.','Sin presión'],
  ];
  return `<section class="tradein-hero"><div class="wrap">
    <div>
      <div class="eyebrow gold" style="color:var(--gold)">Vende o cambia tu auto</div>
      <h1 style="margin-top:14px">Tu auto vale más<br><span>de lo que crees.</span></h1>
      <p class="sub">Oferta firme en 2 minutos. Sin compromiso. Las 12 concesionarias del grupo reciben +200 trade-ins al mes — pagamos mejor porque tenemos a quién venderlo.</p>
      <div style="margin-top:24px;display:flex;gap:10px;flex-wrap:wrap">
        <button class="btn btn-gold btn-lg" onclick="Flow.openTradein()">Empezar valuación ${I.arrowR(16)}</button>
        <button class="btn btn-ghost-dark btn-lg" onclick="Plasi.open('¿Cómo funciona el trade-in?')">¿Cómo funciona?</button>
      </div>
    </div>
    <div class="quick-form">
      <h3>Valuación express</h3>
      <p style="font-size:13px;color:var(--n600);margin-top:4px">Estimación en 30 segundos.</p>
      <div style="margin-top:14px;display:flex;flex-direction:column;gap:10px">
        <div class="field-row">
          <div class="field"><label>Marca</label><select id="qti_marca">${['Mazda','Hyundai','Toyota','Nissan','Chevrolet','Ford','Volkswagen','Kia','Jeep','Otro'].map(m=>`<option>${m}</option>`).join('')}</select></div>
          <div class="field"><label>Año</label><select id="qti_anio">${Array.from({length:15},(_,i)=>2025-i).map(y=>`<option>${y}</option>`).join('')}</select></div>
        </div>
        <div class="field"><label>Kilometraje aprox.</label><input id="qti_km" type="number" placeholder="50000"></div>
        <button class="btn btn-conv btn-md" onclick="Flow.openTradein(true)">Ver mi oferta ${I.arrowR(14)}</button>
      </div>
    </div>
  </div></section>
  <section class="sec"><div class="wrap">
    <div class="eyebrow">3 caminos con tu oferta</div>
    <h2 style="margin-top:10px">Tu decides cómo cierras.</h2>
    <p class="lede">La misma valuación, tres formas de capitalizarla. Eliges cuando ya tengas la oferta firme.</p>
    <div class="paths-grid">
      ${PATHS.map(p=>`<div class="path-card" onclick="Flow.openTradein()">
        ${p[4]?`<span class="bp bp-gold badge-deal">Más elegida</span>`:''}
        <div class="ic">${p[0]}</div>
        <h3>${p[1]}</h3>
        <p>${p[2]}</p>
        <div style="margin-top:14px;font-family:var(--disp);font-size:11px;font-weight:700;color:var(--red);text-transform:uppercase;letter-spacing:.5px">${p[3]}</div>
      </div>`).join('')}
    </div>
    <div style="margin-top:60px;background:#fff;border:1px solid var(--n200);border-radius:18px;padding:32px;display:grid;grid-template-columns:repeat(3,1fr);gap:24px">
      <div><div class="eyebrow">Por qué Plasencia paga más</div></div>
      <div><div style="display:flex;align-items:center;gap:10px"><span style="color:var(--green-d)">${I.check(20)}</span><b style="font-family:var(--disp);color:var(--navy)">200+ trade-ins/mes</b></div><p style="font-size:13px;color:var(--n600);margin-top:6px">Volumen en 12 concesionarias da escala para pagar mejor.</p></div>
      <div><div style="display:flex;align-items:center;gap:10px"><span style="color:var(--green-d)">${I.check(20)}</span><b style="font-family:var(--disp);color:var(--navy)">Inventario propio</b></div><p style="font-size:13px;color:var(--n600);margin-top:6px">Plasencia Seminuevos los re-vende → margen para mejor oferta.</p></div>
    </div>
  </div></section>`;
},

// ====== CRÉDITO landing público ======
credito(){
  return `<section class="tradein-hero"><div class="wrap">
    <div>
      <div class="eyebrow gold" style="color:var(--gold)">Plasencia Crédito</div>
      <h1 style="margin-top:14px">Crédito automotriz<br><span>sin sorpresas.</span></h1>
      <p class="sub">Pre-aprobación en 2 minutos sin afectar tu buró. Tasa fija 13.5% anual. Plazos 12 a 60 meses. Enganche desde 20%.</p>
      <div style="margin-top:24px;display:flex;gap:10px;flex-wrap:wrap">
        <button class="btn btn-gold btn-lg" onclick="Flow.openCredito()">Pre-aprobarme ahora ${I.arrowR(16)}</button>
        <button class="btn btn-ghost-dark btn-lg" onclick="go('#/autolease')">¿Mejor arrendamiento?</button>
      </div>
    </div>
    <div class="quick-form">
      <h3>Simulador rápido</h3>
      <p style="font-size:13px;color:var(--n600);margin-top:4px">Estimación con tasa actual.</p>
      <div style="margin-top:14px;display:flex;flex-direction:column;gap:10px">
        <div class="field"><label>Precio del auto</label><input id="sim_p" type="number" value="450000"></div>
        <div class="field-row">
          <div class="field"><label>Enganche %</label><input id="sim_e" type="number" value="20"></div>
          <div class="field"><label>Plazo (meses)</label><select id="sim_n"><option>12</option><option>24</option><option>36</option><option>48</option><option selected>60</option></select></div>
        </div>
        <button class="btn btn-conv btn-md" onclick="simularCredito()">Calcular mensualidad</button>
        <div id="sim_result"></div>
      </div>
    </div>
  </div></section>
  <section class="sec"><div class="wrap">
    <div class="eyebrow">Cómo funciona</div>
    <h2 style="margin-top:10px">Pre-aprobación en 4 pasos.</h2>
    <div class="flot-benef" style="margin-top:36px">
      ${[
        [I.user(24),'1 · Tipo de persona','Eliges entre Persona Física, PFAE o Persona Moral. Cada una con su mejor tasa.'],
        [I.doc(24),'2 · Datos KYC','Nombre, RFC, CURP, ingresos y antigüedad laboral. 2 minutos.'],
        [I.upload(24),'3 · Documentos','Subes INE, comprobante de domicilio y últimos 3 recibos de nómina.'],
        [I.check(24),'4 · Pre-aprobación','Recibes línea de crédito y mensualidad en pantalla. Sin afectar buró.'],
      ].map(b=>`<div class="bf"><div class="ic">${b[0]}</div><h4>${b[1]}</h4><p>${b[2]}</p></div>`).slice(0,3).join('')}
    </div>
  </div></section>`;
},

// ====== AUTOLEASE landing público ======
autolease(){
  return `<section class="tradein-hero"><div class="wrap">
    <div>
      <div class="eyebrow gold" style="color:var(--gold)">GP Autolease</div>
      <h1 style="margin-top:14px">Arrendamiento puro<br><span>sin enganche fuerte.</span></h1>
      <p class="sub">Renta mensual fija, deducible para PFAE y empresas. Al final del plazo: renuevas, devuelves o compras. Plazos 24 a 48 meses.</p>
      <div style="margin-top:24px;display:flex;gap:10px;flex-wrap:wrap">
        <button class="btn btn-gold btn-lg" onclick="Flow.openLease()">Cotizar arrendamiento ${I.arrowR(16)}</button>
        <button class="btn btn-ghost-dark btn-lg" onclick="go('#/credito')">¿Mejor crédito?</button>
      </div>
    </div>
    <div class="quick-form">
      <h3>Comparar crédito vs lease</h3>
      <table style="width:100%;margin-top:10px;font-size:13px;border-collapse:collapse">
        <tr style="border-bottom:1px solid var(--n200)"><td style="padding:10px 4px;color:var(--n500)">Concepto</td><td style="padding:10px 4px;text-align:center;color:var(--navy);font-weight:700">Crédito</td><td style="padding:10px 4px;text-align:center;color:var(--gold-d);font-weight:700">Lease</td></tr>
        ${[['Enganche','20%+','0-10%'],['Mensualidad','Más alta','Más baja'],['Eres dueño','Sí, al pagarlo','No (puedes comprar al final)'],['Deducible','No','Sí (PFAE/PM)'],['Plazo típico','60 meses','36 meses']].map(r=>`<tr style="border-bottom:1px solid var(--n100)"><td style="padding:8px 4px;color:var(--n600)">${r[0]}</td><td style="padding:8px 4px;text-align:center">${r[1]}</td><td style="padding:8px 4px;text-align:center">${r[2]}</td></tr>`).join('')}
      </table>
    </div>
  </div></section>`;
},

// ====== SEGUROS landing publico ======
seguros(){
  return `<section class="tradein-hero"><div class="wrap">
    <div>
      <div class="eyebrow gold" style="color:var(--gold)">Plasencia Seguros</div>
      <h1 style="margin-top:14px">Asegúralo<br><span>en la misma cuenta.</span></h1>
      <p class="sub">Cobertura amplia respaldada por GNP. Cotiza en 2 minutos, contrata sin papeles físicos y administra tu póliza desde Mi Plasencia. Asistencia 24/7 en todo México.</p>
      <div style="margin-top:24px;display:flex;gap:10px;flex-wrap:wrap">
        <button class="btn btn-gold btn-lg" onclick="Flow.openSeguro()">Cotizar mi seguro ${I.arrowR(16)}</button>
        <button class="btn btn-ghost-dark btn-lg" onclick="Plasi.open('¿Qué cubre el seguro Plasencia?')">¿Qué cubre?</button>
      </div>
    </div>
    <div class="quick-form">
      <h3>Cotización express</h3>
      <p style="font-size:13px;color:var(--n600);margin-top:4px">Estimación con datos básicos.</p>
      <div style="margin-top:14px;display:flex;flex-direction:column;gap:10px">
        <div class="field-row">
          <div class="field"><label>Marca de tu auto</label><select id="sg_m">${MARCAS.map(m=>`<option>${m}</option>`).join('')}</select></div>
          <div class="field"><label>Año</label><select id="sg_y">${Array.from({length:8},(_,i)=>2026-i).map(y=>`<option>${y}</option>`).join('')}</select></div>
        </div>
        <div class="field"><label>Cobertura</label><select id="sg_c"><option>Amplia Plus (recomendada)</option><option>Amplia</option><option>Limitada</option><option>Responsabilidad civil</option></select></div>
        <button class="btn btn-conv btn-md" onclick="Flow.openSeguro()">Ver mi prima estimada ${I.arrowR(14)}</button>
      </div>
    </div>
  </div></section>
  <section class="sec"><div class="wrap">
    <div class="eyebrow">3 coberturas, una experiencia</div>
    <h2 style="margin-top:10px">El seguro que querrías que existiera.</h2>
    <p class="lede">Sin agentes que no responden, sin pólizas en papel que se pierden. Todo digital, todo en tu cuenta.</p>
    <div class="flot-benef" style="margin-top:36px">
      ${[
        [I.shield(24),'Cobertura amplia respaldada','Daños materiales, robo total, responsabilidad civil, gastos médicos a ocupantes y asistencia legal incluidos.'],
        [I.phone(24),'Asistencia 24/7 desde la app','Reporta siniestro con un toque. Grúa, ajustador y taller propio del grupo te llegan donde estés.'],
        [I.cycle(24),'Renovación automática · sin sorpresas','Te avisamos 30 días antes con tu prima actualizada. Aceptas con un click o ajustas cobertura.'],
      ].map(b=>`<div class="bf"><div class="ic">${b[0]}</div><h4>${b[1]}</h4><p>${b[2]}</p></div>`).join('')}
    </div>
    <div style="margin-top:48px;background:#fff;border:1px solid var(--n200);border-radius:18px;overflow:hidden">
      <div style="padding:24px;background:var(--n50);border-bottom:1px solid var(--n200)"><h3 style="font-family:var(--disp);font-size:18px;color:var(--navy)">Compara coberturas</h3></div>
      <table style="width:100%;border-collapse:collapse;font-size:13px">
        <thead><tr><th style="padding:12px;text-align:left;color:var(--n500);font-family:var(--disp);font-size:11px;text-transform:uppercase;letter-spacing:.5px">Concepto</th><th style="padding:12px;text-align:center;color:var(--n500);font-family:var(--disp);font-size:11px;text-transform:uppercase;letter-spacing:.5px">RC</th><th style="padding:12px;text-align:center;color:var(--n500);font-family:var(--disp);font-size:11px;text-transform:uppercase;letter-spacing:.5px">Limitada</th><th style="padding:12px;text-align:center;color:var(--n500);font-family:var(--disp);font-size:11px;text-transform:uppercase;letter-spacing:.5px">Amplia</th><th style="padding:12px;text-align:center;color:var(--gold-d);font-family:var(--disp);font-size:11px;text-transform:uppercase;letter-spacing:.5px;background:rgba(236,201,75,.08)">Amplia Plus</th></tr></thead>
        <tbody>${[['Responsabilidad civil','✓','✓','✓','✓'],['Robo total','—','✓','✓','✓'],['Daños materiales','—','—','✓','✓'],['Gastos médicos','—','—','✓','✓'],['Auto sustituto','—','—','—','✓'],['Cero deducible robo','—','—','—','✓']].map(r=>`<tr style="border-top:1px solid var(--n100)"><td style="padding:10px 12px;color:var(--n700);font-weight:600">${r[0]}</td>${r.slice(1).map((v,i)=>`<td style="padding:10px 12px;text-align:center;color:${v==='✓'?(i===3?'var(--gold-d)':'var(--green-d)'):'var(--n400)'};font-weight:700;${i===3?'background:rgba(236,201,75,.04)':''}">${v}</td>`).join('')}</tr>`).join('')}</tbody>
      </table>
    </div>
  </div></section>`;
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
        <button class="btn btn-ghost-dark btn-lg" onclick="alert('Contacto comercial demo')">${I.phone(16)} Llamar a un asesor</button>
      </div>
    </div>
    <div class="quick-form">
      <h3>Cotización express</h3>
      <p style="font-size:13px;color:var(--n600);margin-top:4px">Recibe propuesta en 24 horas.</p>
      <div style="margin-top:14px;display:flex;flex-direction:column;gap:10px">
        <div class="field"><label>Empresa</label><input placeholder="Razón social"></div>
        <div class="field"><label>Unidades requeridas</label><select><option>1-5 unidades</option><option>6-15 unidades</option><option>16-50 unidades</option><option>+50 unidades</option></select></div>
        <button class="btn btn-conv btn-md" onclick="Flow.openFlotilla()">Solicitar cotización</button>
      </div>
    </div>
  </div></section>
  <section class="sec"><div class="wrap">
    <div class="eyebrow">Beneficios Plasencia Flotillas</div>
    <h2 style="margin-top:10px">Pensado para quien factura y opera flota.</h2>
    <div class="flot-benef">
      ${BENEF.map(b=>`<div class="bf"><div class="ic">${b[0]}</div><h4>${b[1]}</h4><p>${b[2]}</p></div>`).join('')}
    </div>
  </div></section>`;
},

// ====== PDP ======
pdp(id){
  const v=CARS.find(c=>c.id===id);
  if(!v)return `<div class="empty"><div class="ic">${I.car(40)}</div><p>Vehículo no encontrado. <a href="#/catalogo" style="color:var(--red);font-weight:700">Ver catálogo</a></p></div>`;
  PDP={v,foto:0,mod:'credito',plazo:60,eng:20};
  setTimeout(renderCockpit,0);
  const suc=getSuc(v.suc);
  return `<div class="wrap"><div class="crumb"><a href="#/">Inicio</a>${I.chevR(12)}<a href="#/catalogo">Catálogo</a>${I.chevR(12)}<span style="color:var(--navy)">${v.marca} ${v.modelo}</span></div>
    <div class="pdp">
      <div>
        <div class="gal-main"><img id="galMain" src="${v.fotos[0]}" onerror="this.src='${FALLBACK}'" alt="${v.marca} ${v.modelo}"></div>
        <div class="gal-thumbs">${v.fotos.map((f,i)=>`<button class="${i===0?'on':''}" onclick="setFoto(${i})"><img src="${f}" onerror="this.src='${FALLBACK}'"></button>`).join('')}</div>

        <div class="pdp-tradein" onclick="go('#/trade-in')">
          <div class="ic">${I.trending(22)}</div>
          <div class="ctn">
            <h4>¿Cambias tu auto actual?</h4>
            <p>Valúa el tuyo y aplícalo como enganche de este ${v.modelo}. Oferta firme en 2 minutos.</p>
          </div>
          <button class="btn btn-out btn-sm">Valuar ${I.arrowR(14)}</button>
        </div>

        <div class="trust-row">
          <div class="t"><span class="ic">${I.check(18)}</span>${v.cond==='nuevo'?'Unidad nueva de agencia':'167 puntos de inspección'}</div>
          <div class="t"><span class="ic">${I.shield(18)}</span>Garantía incluida</div>
          <div class="t"><span class="ic">${I.doc(18)}</span>${v.cond==='nuevo'?'Factura de agencia':'Historial documentado'}</div>
          <div class="t"><span class="ic">${I.cycle(18)}</span>Devolución 7 días</div>
        </div>
        <div class="seller-box">
          ${sucLogoHTML(suc,'lg')}
          <div class="info">
            <h4>Vendido por ${suc.nombre}</h4>
            <div class="meta">${suc.zona} · Especialista ${suc.marca} · Desde ${suc.desde}</div>
            <div class="rating"><span class="star">${I.star(15)}</span><b>${suc.rating}</b><span class="rv">${num(suc.reviews)} reseñas · ${suc.autos} autos en inventario</span></div>
          </div>
          <div class="ctas">
            <a href="#/concesionaria/${suc.id}" class="btn btn-out btn-sm">Ver concesionaria</a>
            <button class="btn btn-wa btn-sm" onclick="toast('Demo: mensaje vía WhatsApp')">${I.wa(14)} WhatsApp</button>
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

function simularCredito(){
  const p=+$('#sim_p').value,e=+$('#sim_e').value,n=+$('#sim_n').value;
  const m=mensCredito(p,e,n);
  $('#sim_result').innerHTML=`<div style="background:linear-gradient(135deg,var(--navy),var(--navy-d));color:#fff;border-radius:12px;padding:18px;margin-top:14px;text-align:center"><div style="font-family:var(--disp);font-size:11px;font-weight:700;text-transform:uppercase;color:var(--gold);letter-spacing:1px">Mensualidad estimada</div><div style="font-family:var(--disp);font-weight:900;font-size:28px;color:var(--gold)" class="tnum">${mxn(m)}</div><div style="font-size:11px;color:rgba(255,255,255,.6);margin-top:2px">${n} meses · tasa 13.5% · enganche ${mxn(p*e/100)}</div></div><button class="btn btn-conv btn-md btn-full" style="margin-top:10px" onclick="Flow.openCredito()">Pre-aprobarme con estos datos ${I.arrowR(14)}</button>`;
}
window.simularCredito=simularCredito;
