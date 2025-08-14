# Cumbre Contecta USAC - Mapa Inmersivo

Aplicación web para visualizar ubicaciones de conferencias con vista 360° interactiva.

## 🚀 Características

- **Mapa interactivo** con marcadores pulsantes
- **Vista 360°** con Photo Sphere Viewer desde CDN
- **Hotspots inmersivos** dentro del panorama
- **Diseño responsive** con tema de IA
- **Efectos glassmorphism** modernos

## 📁 Estructura del Proyecto

```
conferencias/
├── index.html              # Página principal
├── styles.css              # Estilos CSS
├── script-cdn.js           # Lógica JavaScript con Photo Sphere Viewer CDN
├── live_server.py          # Servidor de desarrollo
├── 360/
│   └── biblioteca-central.jpg  # Imagen 360° equirectangular
├── img/
│   └── mapa-usac.jpg       # Mapa de ubicaciones
└── conferencias/
    └── biblioteca-central.jpg  # Imagen de conferencia
```

## 🛠️ Instalación y Uso

### 1. Clonar o descargar el proyecto

### 2. Iniciar el servidor de desarrollo
```bash
python3 live_server.py
```

### 3. Abrir en el navegador
```
http://localhost:8080
```

## 🎮 Controles

- **Mapa:** Click en marcador pulsante → Abre vista 360°
- **Vista 360°:** 
  - Arrastrar para rotar
  - Rueda del mouse para zoom
  - Click en "Inscríbete aquí" → Enlace de inscripción
  - Click en icono de cámara → Muestra imagen de conferencia
- **Navegación:** Botón "←" para volver al mapa

## 🎨 Tecnologías

- **HTML5** - Estructura
- **CSS3** - Estilos con glassmorphism
- **JavaScript ES6+** - Lógica interactiva
- **Photo Sphere Viewer 5** - Visor 360° desde CDN
- **Three.js** - Dependencia de Photo Sphere Viewer
- **Python** - Servidor de desarrollo

## 📱 Responsive

La aplicación se adapta automáticamente a:
- Desktop (1200px+)
- Tablet (768px - 1199px)
- Mobile (< 768px)

## 🔧 Personalización

### Añadir nuevas ubicaciones:
1. Agregar imagen 360° en carpeta `360/`
2. Agregar imagen de conferencia en `conferencias/`
3. Modificar `script-cdn.js` para incluir nuevo marcador

### Cambiar tema:
- Editar variables CSS en `styles.css`
- Modificar gradientes y colores en `body` y `.viewer-container`

## 🎯 Solución Técnica

**Problema inicial:** Photo Sphere Viewer tenía problemas de compatibilidad con ES6 modules locales.

**Solución implementada:** 
- Uso de **Photo Sphere Viewer desde CDN** con importmap
- **Three.js** como dependencia automática
- **Hotspots inmersivos** con marcadores interactivos
- **Mejor rendimiento** y compatibilidad garantizada

## 📄 Licencia

Este proyecto utiliza Photo Sphere Viewer y Three.js bajo licencia MIT.

---

**Última actualización:** Enero 2025 - Versión con efectos tech y diseño mejorado
