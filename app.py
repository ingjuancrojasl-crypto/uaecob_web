"""
UAECOB Bogotá D.C. — Dashboard de Incidentes 2020
Autores: Juan Carlos Rojas Lizarazo · Brayan Andres Sierra Zambrano
Fuente: Unidad Administrativa Especial Cuerpo Oficial de Bomberos Bogotá
Dataset: https://datosabiertos.bogota.gov.co/dataset/incidente-atendido-por-bomberos
Periodo: Enero – Agosto 2020
"""

import streamlit as st
import pandas as pd
import plotly.express as px
import plotly.graph_objects as go
import unicodedata

# ── Configuración de página ──────────────────────────────────────────────────
st.set_page_config(
    page_title="UAECOB Bogotá 2020",
    page_icon="🚒",
    layout="wide",
    initial_sidebar_state="expanded",
)

# ── Paleta de colores institucional ─────────────────────────────────────────
COLORES = {
    "azul":    "#1a5ea8",
    "rojo":    "#c0392b",
    "verde":   "#1D9E75",
    "ambar":   "#d68910",
    "morado":  "#6c3483",
    "teal":    "#148f77",
    "gris":    "#707b7c",
}

MESES_ES = {
    "enero": 1, "febrero": 2, "marzo": 3, "abril": 4,
    "mayo": 5, "junio": 6, "julio": 7, "agosto": 8,
}
NOMBRE_MES = {1:"Ene", 2:"Feb", 3:"Mar", 4:"Abr",
              5:"May", 6:"Jun", 7:"Jul", 8:"Ago"}

FUENTE = (
    "**Fuente:** Unidad Administrativa Especial Cuerpo Oficial de Bomberos Bogotá (UAECOB) · "
    "[Datos Abiertos Bogotá](https://datosabiertos.bogota.gov.co/dataset/incidente-atendido-por-bomberos) · "
    "**Periodo:** Enero–Agosto 2020 · "
    "**Autores:** Juan Carlos Rojas Lizarazo · Brayan Andres Sierra Zambrano"
)

# ── CSS personalizado ────────────────────────────────────────────────────────
st.markdown("""
<style>
    /* Sidebar */
    [data-testid="stSidebar"] { background-color: #0d2b5e; }
    [data-testid="stSidebar"] * { color: #e8edf5 !important; }
    [data-testid="stSidebar"] .stSelectbox label,
    [data-testid="stSidebar"] .stMultiSelect label { color: #aec6e8 !important; font-size: 0.82rem; }

    /* KPI cards */
    .kpi-card {
        background: #ffffff;
        border-left: 4px solid #1a5ea8;
        border-radius: 8px;
        padding: 16px 20px;
        box-shadow: 0 1px 4px rgba(0,0,0,0.08);
        margin-bottom: 8px;
    }
    .kpi-num  { font-size: 2rem; font-weight: 700; color: #1a5ea8; line-height: 1; }
    .kpi-label{ font-size: 0.78rem; color: #707b7c; margin-top: 4px; }

    /* Separador de sección */
    .section-title {
        font-size: 1.05rem; font-weight: 600; color: #0d2b5e;
        border-bottom: 2px solid #1a5ea8; padding-bottom: 4px;
        margin: 24px 0 12px;
    }
    /* Fuente al pie */
    .fuente { font-size: 0.72rem; color: #95a5a6; margin-top: 6px; }
</style>
""", unsafe_allow_html=True)


# ══════════════════════════════════════════════════════════════════════════════
# CARGA Y PREPARACIÓN DE DATOS
# ══════════════════════════════════════════════════════════════════════════════

def quitar_tildes(texto: str) -> str:
    return "".join(
        c for c in unicodedata.normalize("NFD", str(texto))
        if unicodedata.category(c) != "Mn"
    ).upper().strip()


def parse_fecha(s: str):
    try:
        partes = str(s).strip().split(" de ")
        dia  = int(partes[0].split()[-1])
        mes  = MESES_ES[partes[1].lower()]
        anio = int(partes[2])
        return pd.Timestamp(year=anio, month=mes, day=dia)
    except Exception:
        return pd.NaT


def unificar_localidad(nombre):
    if pd.isna(nombre):
        return nombre
    partes = str(nombre).strip().split(" ", 1)
    if partes[0].isdigit() and len(partes) > 1:
        return partes[1].strip()
    return nombre.strip()


@st.cache_data(show_spinner="Cargando datos del dataset UAECOB...")
def cargar_datos() -> pd.DataFrame:
    df = pd.read_csv(
        "incidentes-atendidos-por-uaecob-corte-31-agosto-2020.csv",
        encoding="latin1",
        sep=";",
        low_memory=False,
    )
    df["FECHA"]       = df["FECHA DEL EVENTO"].apply(parse_fecha)
    df["MES"]         = df["FECHA"].dt.month
    df["HORA"]        = pd.to_datetime(
        df["Hora reporte"], format="%H:%M:%S", errors="coerce"
    ).dt.hour
    df["DIA_SEM"]     = df["FECHA"].dt.dayofweek
    df["LOCALIDAD_L"] = df["LOCALIDAD"].apply(unificar_localidad)
    df["ESTRATO_NUM"] = pd.to_numeric(df["ESTRATO"], errors="coerce")
    df["TR_min"]      = (
        pd.to_timedelta(df["Tiempo de Respuesta"].str.strip(), errors="coerce")
        .dt.total_seconds() / 60
    )
    df["TR_limpio"] = df["TR_min"].where(df["TR_min"] <= 120)

    cols_her = ["HOMBRES HERIDOS","MUJERES HERIDAS",
                "MENORES NIÑAS HERIDAS","MENORES NIÑOS HERIDOS"]
    cols_res = ["HOMBRES RESCATADOS","MUJERES RESCATADAS",
                "MENORES NIÑAS RESCATADAS","MENORES NIÑOS RESCATADOS"]
    for c in cols_her + cols_res:
        df[c] = pd.to_numeric(df[c], errors="coerce").fillna(0)
    df["TOTAL_HERIDOS"]    = df[cols_her].sum(axis=1)
    df["TOTAL_RESCATADOS"] = df[cols_res].sum(axis=1)
    return df


# ══════════════════════════════════════════════════════════════════════════════
# SIDEBAR — FILTROS
# ══════════════════════════════════════════════════════════════════════════════
df_raw = cargar_datos()

MESES_DISP = sorted(df_raw["MES"].dropna().unique())
LOCS_DISP  = sorted(df_raw["LOCALIDAD_L"].dropna().unique())
LOCS_DISP  = [l for l in LOCS_DISP if l != "FUERA D.C."]

with st.sidebar:
    st.image(
        "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/"
        "Escudo_de_Bogot%C3%A1.svg/200px-Escudo_de_Bogot%C3%A1.svg.png",
        width=64,
    )
    st.markdown("## 🚒 UAECOB · Bogotá")
    st.markdown("**Dashboard de Incidentes**  \n*Enero – Agosto 2020*")
    st.divider()

    st.markdown("### Filtros")

    meses_sel = st.multiselect(
        "Mes",
        options=MESES_DISP,
        default=MESES_DISP,
        format_func=lambda m: NOMBRE_MES.get(m, str(m)),
    )

    locs_sel = st.multiselect(
        "Localidad",
        options=LOCS_DISP,
        default=LOCS_DISP,
    )

    st.divider()
    st.markdown(
        "<small>Fuente: UAECOB · Datos Abiertos Bogotá<br>"
        "Autores: J.C. Rojas · B.A. Sierra</small>",
        unsafe_allow_html=True,
    )

# ── Aplicar filtros ──────────────────────────────────────────────────────────
df = df_raw.copy()
if meses_sel:
    df = df[df["MES"].isin(meses_sel)]
if locs_sel:
    df = df[df["LOCALIDAD_L"].isin(locs_sel)]


# ══════════════════════════════════════════════════════════════════════════════
# ENCABEZADO
# ══════════════════════════════════════════════════════════════════════════════
st.markdown(
    "# 🚒 Dashboard de Incidentes — UAECOB Bogotá D.C.",
    help="Unidad Administrativa Especial Cuerpo Oficial de Bomberos",
)
st.markdown(FUENTE)
st.divider()


# ══════════════════════════════════════════════════════════════════════════════
# KPI CARDS
# ══════════════════════════════════════════════════════════════════════════════
total      = len(df)
heridos    = int(df["TOTAL_HERIDOS"].sum())
rescatados = int(df["TOTAL_RESCATADOS"].sum())
tr_med     = df["TR_limpio"].median()
tr_str     = f"{tr_med:.1f} min" if pd.notna(tr_med) else "N/D"

k1, k2, k3, k4 = st.columns(4)
with k1:
    st.markdown(
        f'<div class="kpi-card">'
        f'<div class="kpi-num">{total:,}</div>'
        f'<div class="kpi-label">Total incidentes</div></div>',
        unsafe_allow_html=True,
    )
with k2:
    st.markdown(
        f'<div class="kpi-card" style="border-color:#c0392b">'
        f'<div class="kpi-num" style="color:#c0392b">{heridos:,}</div>'
        f'<div class="kpi-label">Personas heridas</div></div>',
        unsafe_allow_html=True,
    )
with k3:
    st.markdown(
        f'<div class="kpi-card" style="border-color:#1D9E75">'
        f'<div class="kpi-num" style="color:#1D9E75">{rescatados:,}</div>'
        f'<div class="kpi-label">Personas rescatadas</div></div>',
        unsafe_allow_html=True,
    )
with k4:
    st.markdown(
        f'<div class="kpi-card" style="border-color:#d68910">'
        f'<div class="kpi-num" style="color:#d68910">{tr_str}</div>'
        f'<div class="kpi-label">Tiempo de respuesta mediano</div></div>',
        unsafe_allow_html=True,
    )


# ══════════════════════════════════════════════════════════════════════════════
# VISUALIZACIÓN 1 — Incidentes por mes (barras) — Evolución temporal
# ══════════════════════════════════════════════════════════════════════════════
st.markdown('<div class="section-title">📅 Viz 1 · Incidentes por mes — Evolución temporal</div>',
            unsafe_allow_html=True)
st.caption(
    "Comparación mensual del volumen de incidentes. La caída de marzo–abril coincide con el "
    "confinamiento obligatorio por COVID-19 decretado en Colombia el 25 de marzo de 2020."
)

por_mes = df["MES"].value_counts().sort_index().reset_index()
por_mes.columns = ["Mes", "Incidentes"]
por_mes["Mes_nombre"] = por_mes["Mes"].map(NOMBRE_MES)

fig1 = px.bar(
    por_mes,
    x="Mes_nombre", y="Incidentes",
    text="Incidentes",
    color="Incidentes",
    color_continuous_scale=["#aec6e8", "#1a5ea8"],
    labels={"Mes_nombre": "Mes", "Incidentes": "N.º de incidentes"},
    title="Incidentes por mes — UAECOB Bogotá 2020",
)
fig1.update_traces(texttemplate="%{text:,}", textposition="outside")
fig1.update_layout(
    coloraxis_showscale=False,
    plot_bgcolor="white",
    paper_bgcolor="white",
    font_family="Arial",
    title_font_size=14,
    margin=dict(t=50, b=40),
    yaxis=dict(gridcolor="#f0f0f0", title="N.º de incidentes"),
    xaxis_title="Mes del año 2020",
    showlegend=False,
)
st.plotly_chart(fig1, use_container_width=True)
st.markdown('<div class="fuente">Fuente: UAECOB · Datos Abiertos Bogotá · Periodo: Enero–Agosto 2020 (Junio sin registros en el dataset)</div>',
            unsafe_allow_html=True)


# ══════════════════════════════════════════════════════════════════════════════
# VISUALIZACIÓN 2 — Incidentes por hora (línea + área) — Distribución temporal
# ══════════════════════════════════════════════════════════════════════════════
st.markdown('<div class="section-title">⏰ Viz 2 · Distribución horaria de incidentes</div>',
            unsafe_allow_html=True)
st.caption(
    "Patrón bimodal característico: pico a las 9h (inicio jornada laboral) y "
    "segundo pico entre 15h–16h (reactivación post-almuerzo). Las madrugadas (2h–5h) "
    "registran la menor actividad."
)

por_hora = df["HORA"].value_counts().sort_index().reset_index()
por_hora.columns = ["Hora", "Incidentes"]
por_hora = por_hora.sort_values("Hora")

fig2 = go.Figure()
fig2.add_trace(go.Scatter(
    x=por_hora["Hora"], y=por_hora["Incidentes"],
    mode="lines+markers",
    fill="tozeroy",
    fillcolor="rgba(26,94,168,0.15)",
    line=dict(color="#1a5ea8", width=2.5),
    marker=dict(size=5),
    name="Incidentes",
    hovertemplate="<b>%{x}h</b>: %{y:,} incidentes<extra></extra>",
))
fig2.update_layout(
    title="Incidentes por hora del día (0–23 h) — UAECOB 2020",
    xaxis=dict(title="Hora del día", tickmode="linear", dtick=1, gridcolor="#f0f0f0"),
    yaxis=dict(title="N.º de incidentes", gridcolor="#f0f0f0"),
    plot_bgcolor="white", paper_bgcolor="white",
    font_family="Arial", title_font_size=14,
    margin=dict(t=50, b=40),
    showlegend=False,
)
st.plotly_chart(fig2, use_container_width=True)
st.markdown('<div class="fuente">Fuente: UAECOB · Datos Abiertos Bogotá · Periodo: Enero–Agosto 2020</div>',
            unsafe_allow_html=True)


# ══════════════════════════════════════════════════════════════════════════════
# VISUALIZACIÓN 3 — Distribución del tiempo de respuesta — Histograma
# ══════════════════════════════════════════════════════════════════════════════
st.markdown('<div class="section-title">⏱️ Viz 3 · Distribución del tiempo de respuesta</div>',
            unsafe_allow_html=True)
st.caption(
    "Distribución de los tiempos de respuesta en minutos (outliers > 120 min excluidos). "
    "El 55% de los incidentes fue atendido en menos de 10 minutos."
)

tr_data = df["TR_limpio"].dropna()
fig3 = px.histogram(
    x=tr_data,
    nbins=24,
    color_discrete_sequence=["#1D9E75"],
    labels={"x": "Tiempo de respuesta (min)", "count": "N.º de incidentes"},
    title="Distribución del tiempo de respuesta — UAECOB 2020",
)
fig3.add_vline(
    x=tr_data.median(),
    line_dash="dash", line_color="#c0392b",
    annotation_text=f"Mediana: {tr_data.median():.1f} min",
    annotation_position="top right",
    annotation_font_color="#c0392b",
)
fig3.update_layout(
    plot_bgcolor="white", paper_bgcolor="white",
    font_family="Arial", title_font_size=14,
    margin=dict(t=50, b=40),
    yaxis=dict(title="N.º de incidentes", gridcolor="#f0f0f0"),
    xaxis=dict(gridcolor="#f0f0f0"),
    showlegend=False,
)
st.plotly_chart(fig3, use_container_width=True)
st.markdown('<div class="fuente">Fuente: UAECOB · Datos Abiertos Bogotá · Outliers > 120 min excluidos</div>',
            unsafe_allow_html=True)


# ══════════════════════════════════════════════════════════════════════════════
# VISUALIZACIÓN 4 — Tipo de servicio top 10 — Comparación de categorías
# ══════════════════════════════════════════════════════════════════════════════
st.markdown('<div class="section-title">🗂️ Viz 4 · Tipo de servicio más frecuente — Top 10</div>',
            unsafe_allow_html=True)
st.caption(
    "Clasificación de cada atención. Prevenciones, activaciones y falsas alarmas "
    "representan más del 40% de la carga operativa total de la UAECOB."
)

serv = df["SERVICIO"].value_counts().head(10).reset_index()
serv.columns = ["Servicio", "Incidentes"]
serv["Servicio"] = serv["Servicio"].apply(
    lambda s: s.split(". ", 1)[-1] if ". " in s else s
)
serv = serv.sort_values("Incidentes")

fig4 = px.bar(
    serv,
    x="Incidentes", y="Servicio",
    orientation="h",
    text="Incidentes",
    color="Incidentes",
    color_continuous_scale=["#d7bde2", "#6c3483"],
    labels={"Incidentes": "N.º de incidentes", "Servicio": "Tipo de servicio"},
    title="Top 10 tipos de servicio — UAECOB Bogotá 2020",
)
fig4.update_traces(texttemplate="%{text:,}", textposition="outside")
fig4.update_layout(
    coloraxis_showscale=False,
    plot_bgcolor="white", paper_bgcolor="white",
    font_family="Arial", title_font_size=14,
    margin=dict(t=50, b=40, l=180),
    xaxis=dict(title="N.º de incidentes", gridcolor="#f0f0f0"),
    yaxis_title="",
    showlegend=False,
)
st.plotly_chart(fig4, use_container_width=True)
st.markdown('<div class="fuente">Fuente: UAECOB · Datos Abiertos Bogotá · Periodo: Enero–Agosto 2020</div>',
            unsafe_allow_html=True)


# ══════════════════════════════════════════════════════════════════════════════
# VISUALIZACIÓN 5 — Incidentes por localidad — Composición / proporciones
# ══════════════════════════════════════════════════════════════════════════════
st.markdown('<div class="section-title">📍 Viz 5 · Incidentes por localidad — Composición territorial</div>',
            unsafe_allow_html=True)

col_v5a, col_v5b = st.columns([1, 1])

with col_v5a:
    st.caption(
        "Distribución de incidentes, heridos y rescatados por localidad de Bogotá. "
        "Suba, Kennedy y Engativá concentran la mayor carga operativa."
    )
    metrica_sel = st.radio(
        "Métrica a visualizar:",
        options=["Incidentes", "Heridos", "Rescatados"],
        horizontal=True,
    )

resumen_loc = (
    df.groupby("LOCALIDAD_L")
    .agg(
        Incidentes=("LOCALIDAD_L", "count"),
        Heridos=("TOTAL_HERIDOS", "sum"),
        Rescatados=("TOTAL_RESCATADOS", "sum"),
    )
    .reset_index()
    .rename(columns={"LOCALIDAD_L": "Localidad"})
    .sort_values(metrica_sel, ascending=True)
)
resumen_loc = resumen_loc[resumen_loc["Localidad"] != "FUERA D.C."]

# Paleta según métrica
PALETAS = {
    "Incidentes": ["#aec6e8", "#1a5ea8"],
    "Heridos":    ["#f5b7b1", "#c0392b"],
    "Rescatados": ["#a9dfbf", "#1D9E75"],
}

with col_v5a:
    fig5a = px.bar(
        resumen_loc,
        x=metrica_sel, y="Localidad",
        orientation="h",
        text=metrica_sel,
        color=metrica_sel,
        color_continuous_scale=PALETAS[metrica_sel],
        title=f"{metrica_sel} por localidad — UAECOB 2020",
    )
    fig5a.update_traces(
        texttemplate="%{text:,}", textposition="outside"
    )
    fig5a.update_layout(
        coloraxis_showscale=False,
        plot_bgcolor="white", paper_bgcolor="white",
        font_family="Arial", title_font_size=13,
        margin=dict(t=45, b=30, l=130),
        xaxis=dict(title=metrica_sel, gridcolor="#f0f0f0"),
        yaxis_title="",
        height=560,
        showlegend=False,
    )
    st.plotly_chart(fig5a, use_container_width=True)

with col_v5b:
    top5 = resumen_loc.nlargest(5, metrica_sel)[["Localidad", metrica_sel]]
    total_top5 = top5[metrica_sel].sum()
    total_all  = resumen_loc[metrica_sel].sum()
    pct_top5   = total_top5 / total_all * 100 if total_all > 0 else 0

    fig5b = px.pie(
        resumen_loc.nlargest(8, metrica_sel),
        names="Localidad", values=metrica_sel,
        title=f"Top 8 localidades — proporción de {metrica_sel.lower()}",
        color_discrete_sequence=px.colors.sequential.Blues_r,
        hole=0.35,
    )
    fig5b.update_traces(
        textinfo="percent+label",
        hovertemplate="<b>%{label}</b><br>%{value:,}<br>%{percent}<extra></extra>",
    )
    fig5b.update_layout(
        font_family="Arial", title_font_size=13,
        margin=dict(t=45, b=10),
        legend=dict(font_size=10),
        height=560,
    )
    st.plotly_chart(fig5b, use_container_width=True)

st.markdown(
    f"**Insight:** Las 5 localidades con mayor {metrica_sel.lower()} concentran "
    f"**{pct_top5:.1f}%** del total registrado en el periodo seleccionado."
)
st.markdown('<div class="fuente">Fuente: UAECOB · Datos Abiertos Bogotá · Periodo: Enero–Agosto 2020</div>',
            unsafe_allow_html=True)


# ══════════════════════════════════════════════════════════════════════════════
# PIE DE PÁGINA
# ══════════════════════════════════════════════════════════════════════════════
st.divider()
st.markdown(
    "**Herramientas y Visualización de Datos — Proyecto 2**  \n"
    "Fundación Universitaria Los Libertadores · 2026  \n"
    f"Dataset: {total:,} registros · Enero–Agosto 2020 (Junio sin datos)  \n"
    "Tecnología: Python · Streamlit · Plotly",
    help="Dashboard desarrollado para el Proyecto 2 del curso Herramientas y Visualización de Datos",
)
