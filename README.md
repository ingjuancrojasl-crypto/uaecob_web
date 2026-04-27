# 🚒 UAECOB Bogotá — Dashboard de Incidentes 2020 (Streamlit)

Dashboard interactivo de visualización de datos de incidentes atendidos por el Cuerpo Oficial de Bomberos de Bogotá D.C. durante el periodo enero–agosto de 2020.

## Dataset

- **Fuente:** Unidad Administrativa Especial Cuerpo Oficial de Bomberos Bogotá (UAECOB)
- **URL:** https://datosabiertos.bogota.gov.co/dataset/incidente-atendido-por-bomberos
- **Descripción:** Registro de 20.228 incidentes atendidos por bomberos en Bogotá D.C. Incluye localidad, hora, tipo de servicio, estación, víctimas (heridos, rescatados) y tiempo de respuesta.
- **Periodo:** Enero – Agosto 2020 (junio sin registros en el dataset fuente)
- **Variables:** 41 columnas — fecha, localidad, estrato, servicio, víctimas, tiempos, coordenadas

## Hallazgos Principales

1. **Impacto del COVID-19:** Los incidentes cayeron ~23% entre febrero (pico: 3.567) y abril (valle: 2.738), coincidiendo con la cuarentena obligatoria del 25 de marzo de 2020.
2. **Patrón bimodal horario:** La demanda se concentra en dos franjas críticas: 8h–11h y 14h–17h, con un pico máximo a las 9h. Las madrugadas (2h–5h) son el periodo de menor actividad.
3. **Carga territorial desigual:** Suba, Kennedy y Engativá concentran más del 35% de todos los incidentes, mientras Sumapaz registra la mínima actividad por su condición rural.
4. **40% de servicios no son emergencias activas:** Prevenciones (16%), falsas alarmas (11%) y activaciones consumen recursos significativos sin corresponder a emergencias reales.
5. **Tiempo de respuesta satisfactorio pero desigual:** La mediana general es 9 min; sin embargo, localidades periféricas del sur (Ciudad Bolívar, Rafael Uribe) superan los 11 min frente a 6–7 min de localidades centrales.

## Visualizaciones Implementadas

| # | Tipo | Descripción |
|---|------|-------------|
| 1 | Barras verticales + paleta secuencial | Incidentes por mes — Evolución temporal |
| 2 | Línea + área rellena | Distribución horaria de incidentes (0–23h) |
| 3 | Histograma + línea de mediana | Distribución del tiempo de respuesta |
| 4 | Barras horizontales + paleta secuencial | Top 10 tipos de servicio (comparación de categorías) |
| 5 | Barras horizontales + gráfico de dona | Incidentes / heridos / rescatados por localidad (composición) |

Cada visualización aplica:
- **Unidad 1:** Tipo de gráfico correcto según el dato, principios de Gestalt, data storytelling
- **Unidad 2:** Paletas secuenciales para datos continuos, cualitativas para categorías, accesibilidad
- **Unidad 3:** Data-ink ratio alto, jerarquía visual, títulos descriptivos con insights, fuente en cada gráfica

## Tecnologías Utilizadas

- **Framework:** Streamlit ≥ 1.32
- **Lenguaje:** Python 3.10+
- **Visualización:** Plotly Express / Plotly Graph Objects
- **Análisis:** Pandas

## Instalación y Ejecución Local

### Requisitos Previos
- Python 3.10 o superior
- pip

### Instrucciones

```bash
# 1. Clonar el repositorio
git clone https://github.com/TU_USUARIO/uaecob-streamlit.git
cd uaecob-streamlit

# 2. Crear entorno virtual (recomendado)
python -m venv venv
source venv/bin/activate        # Linux/Mac
venv\Scripts\activate           # Windows

# 3. Instalar dependencias
pip install -r requirements.txt

# 4. Colocar el dataset en la raíz del proyecto
# El archivo debe llamarse:
# incidentes-atendidos-por-uaecob-corte-31-agosto-2020.csv

# 5. Ejecutar la aplicación
streamlit run app.py
```

La aplicación abrirá automáticamente en `http://localhost:8501`

## Despliegue en Streamlit Community Cloud

1. Subir el repositorio a GitHub (con `app.py`, `requirements.txt` y el CSV)
2. Ir a https://share.streamlit.io
3. Conectar la cuenta de GitHub
4. Seleccionar el repositorio y el archivo `app.py`
5. Hacer clic en **Deploy**

**URL en producción:** *(completar después del despliegue)*

## Estructura del Repositorio

```
uaecob-streamlit/
├── app.py                                                  # Aplicación principal
├── requirements.txt                                        # Dependencias
├── incidentes-atendidos-por-uaecob-corte-31-agosto-2020.csv  # Dataset
└── README.md                                               # Este archivo
```

## Autores

- Juan Carlos Rojas Lizarazo
- Brayan Andres Sierra Zambrano

**Curso:** Herramientas y Visualización de Datos  
**Institución:** Fundación Universitaria Los Libertadores  
**Año:** 2026
