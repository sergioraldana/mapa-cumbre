import { Viewer } from '@photo-sphere-viewer/core';
import { MarkersPlugin } from '@photo-sphere-viewer/markers-plugin';

let photoSphereViewer = null;
let markersPlugin = null;

// Elementos del DOM
const panorama = document.getElementById('panorama');
const viewer = document.getElementById('viewer');
const loading = document.getElementById('loading');
const fullscreenBtn = document.getElementById('fullscreen');
const resetBtn = document.getElementById('reset');
const backToMapBtn = document.getElementById('backToMap');
const hotspotCard = document.getElementById('hotspotCard');
const closeCardBtn = document.getElementById('closeCard');

let currentMode = 'map'; // 'map' or '360'

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    setupControls();
    showMap(); // Start with the map
});

function showMap() {
    currentMode = 'map';
    panorama.innerHTML = `
        <div class="map-container">
            <img src="img/mapa-usac.png" alt="Mapa USAC">
            <div class="map-marker" style="top: 31.5%; left: 45.1%;" data-target="biblioteca-central"></div>
        </div>
    `;
    loading.style.display = 'none';
    backToMapBtn.style.display = 'none';
    fullscreenBtn.style.display = 'none';
    resetBtn.style.display = 'none';
    hotspotCard.style.display = 'none';
    
    // Add event listener for the map marker
    const mapMarker = panorama.querySelector('.map-marker');
    if (mapMarker) {
        mapMarker.addEventListener('click', () => show360('360/biblioteca-central.jpg'));
    }
}

function show360(imageSrc) {
    currentMode = '360';
    backToMapBtn.style.display = 'block';
    fullscreenBtn.style.display = 'block';
    resetBtn.style.display = 'block';
    loading.style.display = 'flex';
    
    // Limpiar contenedor y crear visor
    panorama.innerHTML = '';
    console.log('🔄 Iniciando Photo Sphere Viewer...');
    
    try {
        photoSphereViewer = new Viewer({
            container: panorama,
            panorama: imageSrc,
            caption: 'Biblioteca Central, 4to nivel, Salones 1 y 2',
            description: document.querySelector('#description').innerHTML,
            navbar: 'caption description',
            defaultZoomLvl: 0,
            mousewheel: true,
            mousemove: true,
            touchmoveTwoFingers: true,
            lang: {
                zoom: 'Zoom',
                zoomOut: 'Alejar',
                zoomIn: 'Acercar',
                moveUp: 'Mover arriba',
                moveDown: 'Mover abajo',
                moveLeft: 'Mover izquierda',
                moveRight: 'Mover derecha',
                description: 'Información de la Conferencia',
                download: 'Descargar',
                fullscreen: 'Pantalla completa',
                loading: '🌐 Cargando Vista 360°...',
                menu: 'Menú',
                close: 'Cerrar',
                twoFingers: 'Usa dos dedos para navegar',
                ctrlZoom: 'Usa Ctrl + scroll para hacer zoom',
                loadError: 'No se puede cargar el panorama',
                webglError: 'Tu navegador no parece soportar WebGL'
            },
            plugins: [
                MarkersPlugin.withConfig({
                    markers: [
                        {
                            id: 'conference-image',
                            position: { yaw: 0, pitch: 0 },
                            imageLayer: 'conferencias/biblioteca-central.jpg',
                            size: { width: 800, height: 600 },
                            anchor: 'bottom center'
                        }
                    ],
                })
            ],
            onReady: () => {
                console.log('✅ Photo Sphere Viewer cargado correctamente');
                setupMarkerEvents();
                loading.style.display = 'none';
            },
            onError: (error) => {
                console.error('❌ Error en Photo Sphere Viewer:', error);
                showError('Error al cargar la imagen 360°: ' + error);
            }
        });
        
        // Obtener referencia al plugin de markers
        markersPlugin = photoSphereViewer.getPlugin(MarkersPlugin);
        console.log('🔄 Photo Sphere Viewer inicializado:', photoSphereViewer);
        console.log('🔄 MarkersPlugin cargado:', markersPlugin);
        
    } catch (error) {
        console.error('❌ Error inicializando Photo Sphere Viewer:', error);
        showError('Error al inicializar el visor 360°: ' + error.message);
    }
}

function setupMarkerEvents() {
    if (markersPlugin) {
        console.log('✅ MarkersPlugin configurado correctamente');
    }
}

function setupControls() {
    fullscreenBtn.addEventListener('click', toggleFullscreen);
    resetBtn.addEventListener('click', resetView);
    backToMapBtn.addEventListener('click', showMap);
    closeCardBtn.addEventListener('click', () => {
        hotspotCard.style.display = 'none';
    });
    
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            if (currentMode === '360') {
                showMap();
            } else if (hotspotCard.style.display === 'block') {
                hotspotCard.style.display = 'none';
            }
        }
        if (e.key === 'r' || e.key === 'R') {
            resetView();
        }
    });
}

function showError(message) {
    this.loading.innerHTML = `
        <div style="
            display: flex;
            align-items: center;
            justify-content: center;
            height: 100%;
            color: #e74c3c;
            text-align: center;
            padding: 20px;
        ">
            <div>
                <div style="font-size: 3rem; margin-bottom: 15px;">⚠️</div>
                <h3>Error</h3>
                <p>${message}</p>
                <button onclick="location.reload()" style="
                    background: #667eea;
                    color: white;
                    border: none;
                    padding: 10px 20px;
                    border-radius: 5px;
                    cursor: pointer;
                    margin-top: 15px;
                ">Reintentar</button>
            </div>
        </div>
    `;
}

function toggleFullscreen() {
    if (photoSphereViewer && photoSphereViewer.toggleFullscreen) {
        photoSphereViewer.toggleFullscreen();
    } else {
        // Fallback para cuando no hay Photo Sphere Viewer
        if (viewer.classList.contains('fullscreen')) {
            viewer.classList.remove('fullscreen');
            fullscreenBtn.innerHTML = '<span>⛶</span>';
        } else {
            viewer.classList.add('fullscreen');
            fullscreenBtn.innerHTML = '<span>⛶</span>';
        }
    }
}

function resetView() {
    if (photoSphereViewer) {
        try {
            // Usar el método correcto de Photo Sphere Viewer
            photoSphereViewer.setZoomLevel(0);
            photoSphereViewer.setPosition({
                longitude: 0,
                latitude: 0
            });
            console.log('🔄 Vista reiniciada - zoom y posición original');
        } catch (error) {
            console.log('❌ Error al reiniciar vista:', error);
            // Fallback: recargar el visor
            console.log('🔄 Recargando visor como fallback');
            show360('360/biblioteca-central.jpg');
        }
    }
}
