/* ═══════════════════════════════════════════════════════════════
   UAECOB · Estudio de Incidentes Bogotá 2020
   Archivo: js/charts.js
   Librería: D3.js v7
═══════════════════════════════════════════════════════════════ */

/* ── Paleta de colores (tema claro) ─────────────────────────── */
const C = {
  azul:    '#3266ad',
  morado:  '#7c5cbf',
  verde:   '#1D9E75',
  ambar:   '#BA7517',
  rojo:    '#E24B4A',
  rosa:    '#D4537E',
  teal:    '#2AB5A0',
  naranja: '#EF9F27',
  gris:    '#888780',
};

/* Colores de ejes y grillas para tema claro */
const AXIS_COLOR  = '#9aa0b8';
const GRID_COLOR  = 'rgba(0,0,0,0.06)';
const TICK_COLOR  = '#6b7a99';
const LABEL_COLOR = '#5a6480';

/* ══════════════════════════════════════════════════════════════
   DATOS
══════════════════════════════════════════════════════════════ */
const DATA = {
  g1: {
    labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jul', 'Ago'],
    values: [3169, 3567, 2801, 2738, 3174, 2266, 2513]
  },
  g2: {
    labels: ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'],
    values: [2744, 2875, 2935, 3040, 3094, 2847, 2693]
  },
  g3: {
    labels: [...Array(24).keys()].map(h => h + 'h'),
    values: [268,237,204,209,177,259,456,603,1142,1943,1672,1226,964,958,1590,1772,1179,1056,1107,681,940,723,491,371]
  },
  g4: {
    labels: ['Sumapaz','Fuera D.C.','Candelaria','Rafael Uribe','La Candelaria','Antonio Nariño','Tunjuelito','Barrios Unidos','Teusaquillo','Los Mártires','R. Uribe Uribe','Santa Fe','Usme','Puente Aranda','Bosa','San Cristóbal','Chapinero','Ciudad Bolívar','Fontibón','Usaquén','Engativá','Kennedy','Suba'],
    values: [12,14,30,129,192,445,503,541,664,677,722,737,870,883,1119,1121,1208,1246,1473,1596,1690,2061,2293]
  },
  g5: {
    labels: ['Los Mártires','Antonio Nariño','La Candelaria','Engativá','Puente Aranda','Teusaquillo','Chapinero','Santa Fe','Barrios Unidos','Fontibón','Usme','Tunjuelito','Kennedy','Suba','R. Uribe Uribe','Usaquén','San Cristóbal','Bosa','Ciudad Bolívar','Rafael Uribe'],
    values: [6.0,7.0,7.7,8.0,8.0,8.0,8.6,8.7,8.9,9.0,9.0,9.0,9.1,9.3,9.7,9.7,9.8,10.0,11.0,11.0],
    colors: function(v) { return v <= 9 ? C.verde : C.rojo; }
  },
  g6: {
    labels: ['0–5 min','5–10 min','10–15 min','15–20 min','20–30 min','30–60 min','60–120 min'],
    values: [17.8, 37.4, 23.2, 9.6, 7.4, 4.0, 0.6],
    counts: [3589, 7557, 4692, 1941, 1496, 798, 129],
    colors: [C.verde, C.azul, C.teal, C.morado, C.ambar, C.naranja, C.rojo]
  },
  g7: {
    labels: ['Incendios','Quemas prohibidas','Rescate','Refuerzos','Matpel','Inc. animales','Falsa alarma','Continuación','Activación','Prevenciones'],
    values: [719, 800, 817, 1211, 1610, 2081, 2249, 2296, 2792, 3360]
  },
  g8: {
    labels: ['B-15 Garcés Navas','B-12 Suba','B-9 Bellavista','B-6 Fontibón','B-7 Ferias','B-4 Puente Aranda','B-11 Candelaria','B-2 Central','B-3 Sur','B-13 Caobos Salazar','B-1 Chapinero','B-5 Kennedy'],
    values: [1018,1064,1110,1148,1167,1187,1232,1256,1262,1481,1800,1905]
  },
  g9: {
    labels: ['Estrato 1','Estrato 2','Estrato 3','Estrato 4','Estrato 5','Estrato 6','Sin estrato','Rural','Departamental'],
    values: [735, 6466, 8299, 2430, 1085, 457, 664, 66, 14],
    colors: [C.ambar, C.ambar, C.rojo, C.morado, C.morado, C.azul, C.gris, C.gris, C.gris]
  },
  g10: {
    labels: ['No aplica','Accidental','Por orden','Natural','Indeterminada','Provocada','Condición humana','Activación'],
    values: [8544, 4122, 3460, 2552, 707, 626, 210, 2]
  },
  g11: {
    labels: ['Candelaria','Fuera D.C.','Rafael Uribe','La Candelaria','Antonio Nariño','Tunjuelito','Los Mártires','Santa Fe','Barrios Unidos','R. Uribe Uribe','Usme','Chapinero','Bosa','Puente Aranda','Teusaquillo','Usaquén','San Cristóbal','Ciudad Bolívar','Engativá','Fontibón','Kennedy','Suba'],
    hombres: [0,0,2,7,13,20,22,23,26,30,31,32,33,35,41,43,45,56,60,60,72,76],
    mujeres: [2,1,0,4,10,1,8,16,16,15,21,14,20,26,32,39,18,31,27,14,48,45]
  },
  g12: {
    labels: ['Candelaria','Rafael Uribe','Fuera D.C.','La Candelaria','Tunjuelito','Antonio Nariño','R. Uribe Uribe','Los Mártires','Usme','Puente Aranda','Barrios Unidos','San Cristóbal','Bosa','Teusaquillo','Ciudad Bolívar','Fontibón','Santa Fe','Engativá','Chapinero','Kennedy','Usaquén','Suba'],
    hombres: [0,2,3,6,6,14,15,17,17,19,21,24,26,27,28,31,33,43,55,61,73,79],
    mujeres: [1,3,1,6,8,13,14,4,16,10,28,10,31,31,13,26,40,54,50,54,74,78]
  },
  g13: {
    labels: ['Barrios Unidos','Santa Fe','Puente Aranda','Teusaquillo','Ciudad Bolívar','Engativá','Fontibón','Usaquén','Kennedy','Suba'],
    expuestos:  [225,254,271,287,295,296,301,380,397,461],
    afectados:  [222,229,269,288,293,297,302,378,396,458],
    rescatados: [49,73,29,58,41,97,57,147,115,157],
    heridos:    [42,39,61,73,87,87,74,82,120,121]
  }
};

/* ══════════════════════════════════════════════════════════════
   TOOLTIP
══════════════════════════════════════════════════════════════ */
const tip = document.getElementById('tooltip');

function showTip(e, html) {
  tip.innerHTML = html;
  tip.style.display = 'block';
  moveTip(e);
}
function moveTip(e) {
  const x = e.clientX + 16;
  const y = e.clientY - 32;
  tip.style.left = x + 'px';
  tip.style.top  = y + 'px';
}
function hideTip() {
  tip.style.display = 'none';
}

/* ══════════════════════════════════════════════════════════════
   FORMATO NUMÉRICO
══════════════════════════════════════════════════════════════ */
function fmt(n) {
  return n >= 1000 ? n.toLocaleString('es-CO') : String(n);
}

/* ══════════════════════════════════════════════════════════════
   FUNCIÓN: BARRAS HORIZONTALES
══════════════════════════════════════════════════════════════ */
function barH(svgId, labels, values, color, unit = '') {
  const el = document.getElementById(svgId);
  if (!el) return;
  const W       = el.parentElement.clientWidth || 700;
  const rowH    = 30;
  const mL      = 168, mR = 72, mT = 8, mB = 28;
  const H       = labels.length * rowH + mT + mB;
  const xMax    = d3.max(values);
  const xScale  = d3.scaleLinear().domain([0, xMax * 1.13]).range([0, W - mL - mR]);

  const svg = d3.select('#' + svgId).attr('width', W).attr('height', H);
  svg.selectAll('*').remove();
  const g = svg.append('g').attr('transform', `translate(${mL},${mT})`);

  /* grid */
  xScale.ticks(5).forEach(t => {
    g.append('line')
      .attr('x1', xScale(t)).attr('x2', xScale(t))
      .attr('y1', 0).attr('y2', H - mT - mB)
      .attr('stroke', GRID_COLOR).attr('stroke-width', 1);
  });

  /* bars */
  const rows = g.selectAll('.row').data(labels).enter().append('g')
    .attr('transform', (d, i) => `translate(0,${i * rowH})`);

  rows.append('rect')
    .attr('x', 0).attr('y', 5)
    .attr('width', (d, i) => xScale(values[i]))
    .attr('height', rowH - 10)
    .attr('rx', 5)
    .attr('fill', typeof color === 'string' ? color : (d, i) => color[i])
    .attr('opacity', 0.88)
    .on('mouseover', (e, d) => {
      const i = labels.indexOf(d);
      showTip(e, `<b>${d}</b><br>${fmt(values[i])}${unit ? ' ' + unit : ''}`);
    })
    .on('mousemove', moveTip)
    .on('mouseout', hideTip);

  /* value labels */
  rows.append('text')
    .attr('x', (d, i) => xScale(values[i]) + 7)
    .attr('y', rowH / 2 + 1)
    .attr('dominant-baseline', 'middle')
    .attr('fill', LABEL_COLOR).attr('font-size', 10.5)
    .text((d, i) => fmt(values[i]) + (unit ? unit : ''));

  /* y labels */
  rows.append('text')
    .attr('x', -9).attr('y', rowH / 2 + 1)
    .attr('text-anchor', 'end').attr('dominant-baseline', 'middle')
    .attr('fill', TICK_COLOR).attr('font-size', 11)
    .text(d => d.length > 18 ? d.slice(0, 17) + '…' : d);

  /* x axis */
  g.append('g')
    .attr('transform', `translate(0,${H - mT - mB})`)
    .call(d3.axisBottom(xScale).ticks(5).tickFormat(d => fmt(d)))
    .call(ax => {
      ax.select('.domain').attr('stroke', '#d0d6e0');
      ax.selectAll('text').attr('fill', TICK_COLOR).attr('font-size', 10);
      ax.selectAll('line').attr('stroke', '#d0d6e0');
    });
}

/* ══════════════════════════════════════════════════════════════
   FUNCIÓN: BARRAS VERTICALES
══════════════════════════════════════════════════════════════ */
function barV(svgId, labels, values, color, unit = '') {
  const el = document.getElementById(svgId);
  if (!el) return;
  const W    = el.parentElement.clientWidth || 700;
  const mL   = 52, mR = 16, mT = 10, mB = 62, H = 290;
  const bW   = Math.min(48, (W - mL - mR) / labels.length - 6);
  const yMax = d3.max(values);
  const xScale = d3.scaleBand().domain(labels).range([0, W - mL - mR]).padding(0.3);
  const yScale = d3.scaleLinear().domain([0, yMax * 1.13]).range([H - mT - mB, 0]);

  const svg = d3.select('#' + svgId).attr('width', W).attr('height', H);
  svg.selectAll('*').remove();
  const g = svg.append('g').attr('transform', `translate(${mL},${mT})`);

  yScale.ticks(5).forEach(t => {
    g.append('line').attr('x1', 0).attr('x2', W - mL - mR)
      .attr('y1', yScale(t)).attr('y2', yScale(t))
      .attr('stroke', GRID_COLOR).attr('stroke-width', 1);
  });

  g.selectAll('.bar').data(labels).enter().append('rect')
    .attr('x', d => xScale(d) + (xScale.bandwidth() - Math.min(xScale.bandwidth(), bW)) / 2)
    .attr('y', (d, i) => yScale(values[i]))
    .attr('width', Math.min(xScale.bandwidth(), bW))
    .attr('height', (d, i) => H - mT - mB - yScale(values[i]))
    .attr('rx', 5)
    .attr('fill', typeof color === 'string' ? color : (d, i) => color[i])
    .attr('opacity', 0.88)
    .on('mouseover', (e, d) => {
      const i = labels.indexOf(d);
      showTip(e, `<b>${d}</b><br>${fmt(values[i])}${unit}`);
    })
    .on('mousemove', moveTip).on('mouseout', hideTip);

  g.append('g').attr('transform', `translate(0,${H - mT - mB})`)
    .call(d3.axisBottom(xScale).tickSize(0))
    .call(ax => {
      ax.select('.domain').attr('stroke', '#d0d6e0');
      ax.selectAll('text').attr('fill', TICK_COLOR).attr('font-size', 9)
        .attr('transform', 'rotate(-35)').attr('text-anchor', 'end');
    });

  g.append('g').call(d3.axisLeft(yScale).ticks(5).tickFormat(d => fmt(d)))
    .call(ax => {
      ax.select('.domain').remove();
      ax.selectAll('text').attr('fill', TICK_COLOR).attr('font-size', 9);
      ax.selectAll('line').remove();
    });
}

/* ══════════════════════════════════════════════════════════════
   FUNCIÓN: LÍNEA / ÁREA
══════════════════════════════════════════════════════════════ */
function lineChart(svgId, labels, values, color) {
  const el = document.getElementById(svgId);
  if (!el) return;
  const W  = el.parentElement.clientWidth || 700;
  const mL = 52, mR = 16, mT = 10, mB = 38, H = 268;
  const xScale = d3.scalePoint().domain(labels).range([0, W - mL - mR]);
  const yScale = d3.scaleLinear().domain([0, d3.max(values) * 1.13]).range([H - mT - mB, 0]);

  const svg = d3.select('#' + svgId).attr('width', W).attr('height', H);
  svg.selectAll('*').remove();
  const g = svg.append('g').attr('transform', `translate(${mL},${mT})`);

  yScale.ticks(5).forEach(t => {
    g.append('line').attr('x1', 0).attr('x2', W - mL - mR)
      .attr('y1', yScale(t)).attr('y2', yScale(t))
      .attr('stroke', GRID_COLOR).attr('stroke-width', 1);
  });

  const area = d3.area()
    .x((d, i) => xScale(labels[i])).y0(H - mT - mB).y1(d => yScale(d))
    .curve(d3.curveCatmullRom);
  const line = d3.line()
    .x((d, i) => xScale(labels[i])).y(d => yScale(d))
    .curve(d3.curveCatmullRom);

  g.append('path').datum(values).attr('d', area).attr('fill', color).attr('opacity', 0.1);
  g.append('path').datum(values).attr('d', line).attr('fill', 'none').attr('stroke', color).attr('stroke-width', 2.4);

  g.selectAll('.dot').data(values).enter().append('circle')
    .attr('cx', (d, i) => xScale(labels[i])).attr('cy', d => yScale(d))
    .attr('r', 4.5).attr('fill', color).attr('stroke', '#ffffff').attr('stroke-width', 2)
    .on('mouseover', (e, d) => {
      const i = values.indexOf(d);
      showTip(e, `<b>${labels[i]}</b><br>${fmt(d)} incidentes`);
    })
    .on('mousemove', moveTip).on('mouseout', hideTip);

  g.append('g').attr('transform', `translate(0,${H - mT - mB})`)
    .call(d3.axisBottom(xScale).tickSize(0))
    .call(ax => {
      ax.select('.domain').attr('stroke', '#d0d6e0');
      ax.selectAll('text').attr('fill', TICK_COLOR).attr('font-size', 9).attr('dy', '12');
    });

  g.append('g').call(d3.axisLeft(yScale).ticks(5).tickFormat(d => fmt(d)))
    .call(ax => {
      ax.select('.domain').remove();
      ax.selectAll('text').attr('fill', TICK_COLOR).attr('font-size', 9);
      ax.selectAll('line').remove();
    });
}

/* ══════════════════════════════════════════════════════════════
   FUNCIÓN: TORTA / DONUT
══════════════════════════════════════════════════════════════ */
function pieChart(svgId, labels, values, counts, colors) {
  const W = 580, H = 350, R = 120;
  const svg = d3.select('#' + svgId).attr('width', W).attr('height', H);
  svg.selectAll('*').remove();

  const pie      = d3.pie().value(d => d).sort(null);
  const arc      = d3.arc().innerRadius(R * 0.5).outerRadius(R);
  const arcHover = d3.arc().innerRadius(R * 0.5).outerRadius(R + 9);

  const g = svg.append('g').attr('transform', `translate(${R + 24},${H / 2})`);
  const slices = g.selectAll('.arc').data(pie(values)).enter().append('g');

  slices.append('path')
    .attr('d', arc)
    .attr('fill', (d, i) => colors[i])
    .attr('stroke', '#ffffff').attr('stroke-width', 2.5)
    .attr('opacity', 0.88)
    .on('mouseover', function (e, d) {
      d3.select(this).transition().duration(120).attr('d', arcHover).attr('opacity', 1);
      showTip(e, `<b>${labels[d.index]}</b><br>${values[d.index]}% · ${fmt(counts[d.index])} incidentes`);
    })
    .on('mousemove', moveTip)
    .on('mouseout', function (e, d) {
      d3.select(this).transition().duration(120).attr('d', arc).attr('opacity', 0.88);
      hideTip();
    });

  /* legend */
  const lgX = R * 2 + 44, lgY = -H / 2 + 20;
  const lg = svg.append('g').attr('transform', `translate(${lgX},${lgY})`);
  labels.forEach((lbl, i) => {
    const row = lg.append('g').attr('transform', `translate(0,${i * 38})`);
    row.append('rect').attr('width', 12).attr('height', 12).attr('rx', 3).attr('fill', colors[i]);
    row.append('text').attr('x', 18).attr('y', 10).attr('fill', LABEL_COLOR).attr('font-size', 11).text(lbl);
    row.append('text').attr('x', 18).attr('y', 25)
      .attr('fill', '#1a2340').attr('font-size', 12).attr('font-weight', '600')
      .text(`${values[i]}%  ·  ${fmt(counts[i])} inc.`);
  });
}

/* ══════════════════════════════════════════════════════════════
   FUNCIÓN: BARRAS AGRUPADAS HORIZONTALES (género, etc.)
══════════════════════════════════════════════════════════════ */
function barGroupedH(svgId, labels, series, colors) {
  const el = document.getElementById(svgId);
  if (!el) return;
  const W      = el.parentElement.clientWidth || 700;
  const rowH   = 23, gap = 6;
  const mL     = 155, mR = 64, mT = 8, mB = 26;
  const nS     = series.length;
  const grpH   = nS * rowH + gap;
  const H      = labels.length * grpH + mT + mB;
  const allV   = series.flatMap(s => s.values);
  const xScale = d3.scaleLinear().domain([0, d3.max(allV) * 1.13]).range([0, W - mL - mR]);

  const svg = d3.select('#' + svgId).attr('width', W).attr('height', H);
  svg.selectAll('*').remove();
  const g = svg.append('g').attr('transform', `translate(${mL},${mT})`);

  xScale.ticks(5).forEach(t => {
    g.append('line').attr('x1', xScale(t)).attr('x2', xScale(t))
      .attr('y1', 0).attr('y2', H - mT - mB)
      .attr('stroke', GRID_COLOR).attr('stroke-width', 1);
  });

  labels.forEach((lbl, li) => {
    const gy = li * grpH;
    g.append('text').attr('x', -9).attr('y', gy + grpH / 2)
      .attr('text-anchor', 'end').attr('dominant-baseline', 'middle')
      .attr('fill', TICK_COLOR).attr('font-size', 10.5)
      .text(lbl.length > 18 ? lbl.slice(0, 17) + '…' : lbl);

    series.forEach((s, si) => {
      const y = gy + si * rowH + 2;
      const v = s.values[li];
      g.append('rect').attr('x', 0).attr('y', y)
        .attr('width', xScale(v)).attr('height', rowH - 4)
        .attr('rx', 4).attr('fill', colors[si]).attr('opacity', 0.86)
        .on('mouseover', e => showTip(e, `<b>${lbl}</b><br>${s.name}: ${fmt(v)}`))
        .on('mousemove', moveTip).on('mouseout', hideTip);
      g.append('text').attr('x', xScale(v) + 5).attr('y', y + rowH / 2 - 2)
        .attr('dominant-baseline', 'middle').attr('fill', LABEL_COLOR).attr('font-size', 9.5)
        .text(fmt(v));
    });
  });

  g.append('g').attr('transform', `translate(0,${H - mT - mB})`)
    .call(d3.axisBottom(xScale).ticks(5).tickFormat(d => fmt(d)))
    .call(ax => {
      ax.select('.domain').attr('stroke', '#d0d6e0');
      ax.selectAll('text').attr('fill', TICK_COLOR).attr('font-size', 9.5);
      ax.selectAll('line').attr('stroke', '#d0d6e0');
    });
}

/* ══════════════════════════════════════════════════════════════
   FUNCIÓN: BARRAS AGRUPADAS VERTICALES (flujo de víctimas)
══════════════════════════════════════════════════════════════ */
function barGroupedV(svgId, labels, series, colors) {
  const el = document.getElementById(svgId);
  if (!el) return;
  const W    = el.parentElement.clientWidth || 700;
  const mL   = 52, mR = 16, mT = 10, mB = 64, H = 310;
  const nS   = series.length;
  const xScale = d3.scaleBand().domain(labels).range([0, W - mL - mR]).padding(0.2);
  const xSub   = d3.scaleBand().domain(d3.range(nS)).range([0, xScale.bandwidth()]).padding(0.07);
  const allV   = series.flatMap(s => s.values);
  const yScale = d3.scaleLinear().domain([0, d3.max(allV) * 1.13]).range([H - mT - mB, 0]);

  const svg = d3.select('#' + svgId).attr('width', W).attr('height', H);
  svg.selectAll('*').remove();
  const g = svg.append('g').attr('transform', `translate(${mL},${mT})`);

  yScale.ticks(5).forEach(t => {
    g.append('line').attr('x1', 0).attr('x2', W - mL - mR)
      .attr('y1', yScale(t)).attr('y2', yScale(t))
      .attr('stroke', GRID_COLOR).attr('stroke-width', 1);
  });

  labels.forEach((lbl, li) => {
    series.forEach((s, si) => {
      const v = s.values[li];
      g.append('rect')
        .attr('x', xScale(lbl) + xSub(si))
        .attr('y', yScale(v))
        .attr('width', xSub.bandwidth())
        .attr('height', H - mT - mB - yScale(v))
        .attr('rx', 4).attr('fill', colors[si]).attr('opacity', 0.88)
        .on('mouseover', e => showTip(e, `<b>${lbl}</b><br>${s.name}: ${fmt(v)}`))
        .on('mousemove', moveTip).on('mouseout', hideTip);
    });
  });

  g.append('g').attr('transform', `translate(0,${H - mT - mB})`)
    .call(d3.axisBottom(xScale).tickSize(0))
    .call(ax => {
      ax.select('.domain').attr('stroke', '#d0d6e0');
      ax.selectAll('text').attr('fill', TICK_COLOR).attr('font-size', 9)
        .attr('transform', 'rotate(-30)').attr('text-anchor', 'end');
    });

  g.append('g').call(d3.axisLeft(yScale).ticks(5).tickFormat(d => fmt(d)))
    .call(ax => {
      ax.select('.domain').remove();
      ax.selectAll('text').attr('fill', TICK_COLOR).attr('font-size', 9);
      ax.selectAll('line').remove();
    });
}

/* ══════════════════════════════════════════════════════════════
   DIBUJAR TODAS LAS GRÁFICAS
══════════════════════════════════════════════════════════════ */
function drawCharts() {
  barV('svg-g1', DATA.g1.labels, DATA.g1.values, C.azul);
  barV('svg-g2', DATA.g2.labels, DATA.g2.values, C.morado);
  lineChart('svg-g3', DATA.g3.labels, DATA.g3.values, C.teal);
  barH('svg-g4', DATA.g4.labels, DATA.g4.values, C.verde);
  barH('svg-g5', DATA.g5.labels, DATA.g5.values, DATA.g5.values.map(v => v <= 9 ? C.verde : C.rojo), ' min');
  pieChart('svg-g6', DATA.g6.labels, DATA.g6.values, DATA.g6.counts, DATA.g6.colors);
  barH('svg-g7', DATA.g7.labels, DATA.g7.values, C.morado);
  barH('svg-g8', DATA.g8.labels, DATA.g8.values, C.azul);
  barV('svg-g9', DATA.g9.labels, DATA.g9.values, DATA.g9.colors);
  barH('svg-g10', DATA.g10.labels, DATA.g10.values, C.verde);
  barGroupedH('svg-g11', DATA.g11.labels,
    [{ name: 'Hombres heridos', values: DATA.g11.hombres }, { name: 'Mujeres heridas', values: DATA.g11.mujeres }],
    [C.azul, C.rosa]);
  barGroupedH('svg-g12', DATA.g12.labels,
    [{ name: 'Hombres rescatados', values: DATA.g12.hombres }, { name: 'Mujeres rescatadas', values: DATA.g12.mujeres }],
    [C.verde, C.naranja]);
  barGroupedV('svg-g13', DATA.g13.labels,
    [{ name: 'Expuestos', values: DATA.g13.expuestos }, { name: 'Afectados', values: DATA.g13.afectados },
     { name: 'Rescatados', values: DATA.g13.rescatados }, { name: 'Heridos', values: DATA.g13.heridos }],
    [C.azul, C.ambar, C.verde, C.rojo]);
}

/* ══════════════════════════════════════════════════════════════
   NAVEGACIÓN: mostrar una gráfica individual
══════════════════════════════════════════════════════════════ */
function showChart(id, el) {
  document.querySelectorAll('.chart-card').forEach(c => c.classList.remove('visible'));
  document.getElementById('card-' + id).classList.add('visible');
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  el.classList.add('active');
  document.querySelectorAll('.section-badge').forEach(b => b.classList.remove('active'));
  document.querySelectorAll('.section-badge')[0].classList.add('active');
  document.getElementById('main').scrollTo({ top: 0, behavior: 'smooth' });
}

/* ══════════════════════════════════════════════════════════════
   NAVEGACIÓN: filtrar por sección
══════════════════════════════════════════════════════════════ */
function filterSection(sec, el) {
  document.querySelectorAll('.section-badge').forEach(b => b.classList.remove('active'));
  el.classList.add('active');
  document.querySelectorAll('.chart-card').forEach(c => {
    if (sec === 'all' || c.dataset.section === sec) {
      c.classList.add('visible');
    } else {
      c.classList.remove('visible');
    }
  });
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
}

/* ══════════════════════════════════════════════════════════════
   CAMBIO DE PESTAÑA DE ANÁLISIS
══════════════════════════════════════════════════════════════ */
function switchTab(tabEl, chartId, panelId) {
  const card = document.getElementById('card-' + chartId);
  card.querySelectorAll('.atab').forEach(t => t.classList.remove('active'));
  card.querySelectorAll('.apanel').forEach(p => p.classList.remove('active'));
  tabEl.classList.add('active');
  document.getElementById(chartId + '-' + panelId).classList.add('active');
}

/* ══════════════════════════════════════════════════════════════
   INICIALIZACIÓN
══════════════════════════════════════════════════════════════ */
window.addEventListener('load', () => {
  drawCharts();
  window.addEventListener('resize', drawCharts);
});
