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

// Datos de las ubicaciones
const locations = {
    'iglu': {
        name: 'Aula Magna Iglú',
        image: '360/iglu.jpg',
        capacity: '350 espacios',
        schedule: [
            { time: '9:00 – 9:30', activity: 'Acto protocolario – Inauguración oficial', speaker: 'Autoridades USAC', subSpeaker: '' },
            { time: '9:30 – 10:15', activity: 'Plenaria inaugural', speaker: 'Conferencia: Retos de la regulación de la IA generativa y su relación con los derechos de autor', subSpeaker: 'Dr. Juan Manuel Delva Benavides – Universidad de Guadalajara (UdeG)' },
            { time: '10:30 – 12:00', activity: 'Experiencia inmersiva – Mapping', speaker: '', subSpeaker: 'Willy Posadas, Daniela Pinto' },
            { time: '15:30 – 17:00', activity: 'Conferencia – taller de cierre', speaker: 'El poder de la narrativa en un mundo de bloques: de la construcción al storytelling', subSpeaker: 'Rodrigo Narváez (Bobicraft)' },
            { time: '17:00 – 18:00', activity: 'Premiación de proyectos', speaker: 'Dirección General de Extensión', subSpeaker: 'Ing. Wendy López' }
        ]
    },
    'biblioteca-central': {
        name: 'Biblioteca Central, 4to nivel',
        image: '360/biblioteca-central.jpg',
        capacity: '100 espacios',
        schedule: [
            { time: '10:30 – 12:00', activity: 'Conferencia y taller 1', speaker: '¿Cómo puede la IA mejorar la educación superior?', subSpeaker: 'Juan Carlos Saravia – Kabukiza' },
            { time: '14:00 – 15:30', activity: 'Conferencia y taller 1', speaker: 'IA y liderazgo estudiantil: desafíos y oportunidades', subSpeaker: 'Ing. José David Valerio – Universidad Tecnológica de Honduras' }
        ]
    },
    'ciencias-juridicas': {
        name: 'Auditorio Mario López Larrave – Facultad de Ciencias Jurídicas y Sociales (S7)',
        image: '360/ciencias-juridicas.jpg',
        capacity: '170 espacios',
        schedule: [
            { time: '10:30 – 12:00', activity: 'Conferencia y taller 2', speaker: '¿Cómo puede la IA mejorar la educación superior?', subSpeaker: 'Dr. Juan Pablo Consuegra – Tecnológico de Monterrey, México' },
            { time: '14:00 – 15:30', activity: 'Conferencia y taller 2', speaker: 'IA y liderazgo estudiantil: desafíos y oportunidades', subSpeaker: 'Dr. Rubén Edel Navarro – Universidad Veracruzana, México' }
        ]
    },
    'humanidades': {
        name: 'Auditorio Rolz Bennet – Facultad de Humanidades (S4)',
        image: '360/humanidades.jpg',
        capacity: '217 espacios',
        schedule: [
            { time: '10:30 – 12:00', activity: 'Conferencia y taller 3', speaker: '¿Cómo puede la IA mejorar la educación superior?', subSpeaker: 'Dr. José Antonio Zornosa – Tecnológico de Monterrey, México' },
            { time: '14:00 – 15:30', activity: 'Panel', speaker: 'Experiencia Samsung: Ecosistema de empleabilidad', subSpeaker: 'María Fernanda Hernández – Staff Samsung Innovation Campus' }
        ]
    },
    'ingenieria': {
        name: 'Auditorio Francisco Vela – Facultad de Ingeniería (T3)',
        image: '360/ingenieria.jpg',
        capacity: '250 espacios',
        schedule: [
            { time: '10:30 – 12:00', activity: 'Conferencia y taller 4', speaker: '¿Cómo puede la IA mejorar la educación superior?', subSpeaker: 'Jorge Alberto Herrera – Universidad Tecnológica de Honduras' },
            { time: '14:00 – 15:30', activity: 'Conferencia y taller 4', speaker: 'IA y liderazgo estudiantil: desafíos y oportunidades', subSpeaker: 'Juan José Victoria Maldonado – Orientaciones sobre buenas prácticas de la IA en contextos educativos' }
        ]
    },
    'ciencias-economicas': {
        name: 'Auditorio Álvaro Castillo Urrutia – Facultad de Ciencias Económicas (S8)',
        image: '360/ciencias-economicas.jpg',
        capacity: '220 espacios',
        schedule: [
            { time: '10:30 – 12:00', activity: 'Conferencia y taller 5', speaker: '¿Cómo puede la IA mejorar la educación superior?', subSpeaker: 'Yen Caballero-González – Fundación Ciudad del Saber y SENACYT Panamá' },
            { time: '14:00 – 15:30', activity: 'Conferencia y taller 5', speaker: 'IA y liderazgo estudiantil: desafíos y oportunidades', subSpeaker: 'Juan José Victoria Maldonado – Orientaciones sobre buenas praxis de la IA en contextos educativos' }
        ]
    },
    'arquitectura': {
        name: 'Auditorio – Facultad de Arquitectura (T2)',
        image: '360/arquitectura.jpg',
        capacity: '220 espacios',
        schedule: [
            { time: '10:30 – 12:00', activity: 'Conferencia y taller 6', speaker: '¿Cómo puede la IA mejorar la educación superior?', subSpeaker: 'Dra. Nicia Guillén Yparrea – Tecnológico de Monterrey, México' },
            { time: '14:00 – 15:30', activity: 'Conferencia y taller 6', speaker: 'IA y liderazgo estudiantil: desafíos y oportunidades', subSpeaker: 'IA generativa responsable en educación superior: del hype a la gobernanza práctica. Dr. Juan Manuel Delva Benavides – Universidad de Guadalajara (UdeG)' }
        ]
    },
    'plaza': {
        name: 'Plaza de los Mártires',
        image: '360/plaza.jpg',
        capacity: 'Espacio abierto',
        schedule: [
            { time: '18:00', activity: 'Cierre musical', speaker: '', subSpeaker: '' }
        ]
    },
    'plaza-mario': {
        name: 'Plaza Mario López Larrave (sótano de Biblioteca)',
        image: '360/plaza-mario.jpg',
        capacity: 'Espacio abierto',
        schedule: [
            { time: '9:00 – 17:00', activity: 'Zonas de activación', speaker: '', subSpeaker: 'Arte y Cultura – Deportes – Voluntariado – Simuladores – Podcast' }
        ]
    },
    'lobby-biblioteca': {
        name: 'Lobby Biblioteca Central (primer nivel)',
        image: '360/lobby-biblioteca.jpg',
        capacity: '100 espacios',
        schedule: [
            { time: '9:00 – 17:00', activity: 'Actividades interactivas', speaker: '', subSpeaker: 'Estación realidad virtual (Biblioteca)' }
        ]
    }
};

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    setupControls();
    showMap(); // Start with the map
    
    // Reposicionar marcadores cuando cambie el tamaño de la ventana
    let resizeTimeout;
    window.addEventListener('resize', () => {
        if (currentMode === 'map') {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(positionMarkers, 50);
        }
    });
});

function showMap() {
    currentMode = 'map';
    
    panorama.innerHTML = `
        <div class="map-container">
            <img src="img/mapa-usac.jpg" alt="Mapa USAC" id="mapImage">
            <div class="map-marker" data-target="iglu" title="Aula Magna Iglú" data-x="77.5" data-y="19"></div>
            <div class="map-marker" data-target="lobby-biblioteca" title="Lobby Biblioteca Central" data-x="58" data-y="29"></div>
            <div class="map-marker" data-target="biblioteca-central" title="Biblioteca Central" data-x="55" data-y="25"></div>
            <div class="map-marker" data-target="plaza-mario" title="Plaza Mario López Larrave" data-x="54.5" data-y="40"></div>
            <div class="map-marker" data-target="ciencias-juridicas" title="Facultad de Ciencias Jurídicas" data-x="30" data-y="22"></div>
            <div class="map-marker" data-target="ciencias-economicas" title="Facultad de Ciencias Económicas" data-x="16.8" data-y="25.5"></div>
            <div class="map-marker" data-target="humanidades" title="Facultad de Humanidades" data-x="37" data-y="32"></div>
            <div class="map-marker" data-target="ingenieria" title="Facultad de Ingeniería" data-x="69.5" data-y="55"></div>
            <div class="map-marker" data-target="arquitectura" title="Facultad de Arquitectura" data-x="73" data-y="72"></div>
            <div class="map-marker" data-target="plaza" title="Plaza de los Mártires" data-x="53" data-y="58"></div>
        </div>
    `;
    
    // Posicionar marcadores inmediatamente
    setTimeout(positionMarkers, 50);
    
    loading.style.display = 'none';
    backToMapBtn.style.display = 'none';
    fullscreenBtn.style.display = 'none';
    resetBtn.style.display = 'none';
    hotspotCard.style.display = 'none';
    
    // Add event listeners for all map markers
    const mapMarkers = panorama.querySelectorAll('.map-marker');
    mapMarkers.forEach(marker => {
        marker.addEventListener('click', () => {
            const target = marker.getAttribute('data-target');
            show360(locations[target].image, target);
        });
    });
    
    // Reposicionar marcadores cuando la imagen se cargue
    const mapImage = document.querySelector('#mapImage');
    if (mapImage) {
        if (mapImage.complete) {
            setTimeout(positionMarkers, 100);
        } else {
            mapImage.addEventListener('load', () => {
                setTimeout(positionMarkers, 100);
            });
        }
    }
}

function positionMarkers() {
    const mapContainer = document.querySelector('.map-container');
    const mapImage = document.querySelector('#mapImage');
    const markers = document.querySelectorAll('.map-marker');
    
    if (!mapContainer || !mapImage) return;
    
    // Obtener las dimensiones reales de la imagen
    const imageRect = mapImage.getBoundingClientRect();
    const containerRect = mapContainer.getBoundingClientRect();
    
    // Calcular el offset de la imagen dentro del contenedor
    const imageOffsetX = imageRect.left - containerRect.left;
    const imageOffsetY = imageRect.top - containerRect.top;
    
    markers.forEach(marker => {
        const x = parseFloat(marker.getAttribute('data-x'));
        const y = parseFloat(marker.getAttribute('data-y'));
        
        // Calcular posiciones basadas en el tamaño real de la imagen
        const absoluteX = imageOffsetX + (x / 100) * imageRect.width;
        const absoluteY = imageOffsetY + (y / 100) * imageRect.height;
        
        // Usar posiciones absolutas en píxeles
        marker.style.position = 'absolute';
        marker.style.left = absoluteX + 'px';
        marker.style.top = absoluteY + 'px';
        marker.style.transform = 'translate(-50%, -50%)';
        marker.style.pointerEvents = 'auto';
    });
}

function show360(imageSrc, locationKey) {
    currentMode = '360';
    backToMapBtn.style.display = 'block';
    fullscreenBtn.style.display = 'block';
    resetBtn.style.display = 'block';
    loading.style.display = 'flex';
    
    // Mensaje especial para archivos grandes
    if (locationKey === 'lobby-biblioteca' || locationKey === 'ciencias-juridicas') {
        loading.innerHTML = `
            <div class="loading-content">
                <div class="spinner"></div>
                <h3>🌐 Cargando Vista 360°...</h3>
                <p>Este archivo es grande (${locationKey === 'lobby-biblioteca' ? '10.7 MB' : '11 MB'}), por favor espera un momento.</p>
            </div>
        `;
    }
    
    // Limpiar contenedor y crear visor
    panorama.innerHTML = '';
    console.log('🔄 Iniciando Photo Sphere Viewer...');
    
    const location = locations[locationKey];
    
    try {
        // Crear títulos más descriptivos
        photoSphereViewer = new Viewer({
            container: panorama,
            panorama: imageSrc,
            caption: location.name,
            description: generateDescription(location),
            navbar: ['caption', 'description'],
            defaultZoomLvl: 0,
            mousewheel: true,
            mousemove: true,
            touchmoveTwoFingers: true,
            loadingImg: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTIwIDNDMTEuNzE2IDMgNSAxMC4xNjMgNSAxOS4wODNDNSAyNy4wMDMgMTEuNzE2IDM0LjE2NyAyMCAzNC4xNjdDMjguMjg0IDM0LjE2NyAzNSAyNy4wMDMgMzUgMTkuMDgzQzM1IDEwLjE2MyAyOC4yODQgMyAyMCAzWiIgZmlsbD0iIzAwQTBCOCIvPgo8cGF0aCBkPSJNMjAgMzVDMjguMjg0IDM1IDM1IDI4LjI4NCAzNSAyMEMzNSAxMS43MTYgMjguMjg0IDUgMjAgNUMyMC4wMDEgNSAyMCA1IDIwIDVWMzVDMjAgMzUgMjAgMzUgMjAgMzVaIiBmaWxsPSIjMDBBMEI4Ii8+Cjwvc3ZnPgo=',
            moveSpeed: 1.5,
            zoomSpeed: 1,
            maxZoom: 2,
            minZoom: 0.5,
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
                            position: { 
                                yaw: (() => {
                                    if (locationKey === 'arquitectura' || locationKey === 'iglu' || locationKey === 'lobby-biblioteca') {
                                        return Math.PI; // 180 grados (lado opuesto)
                                    } else if (locationKey === 'ciencias-juridicas' || locationKey === 'plaza' || locationKey === 'plaza-mario') {
                                        return Math.PI / 2; // 90 grados (lado derecho)
                                    } else {
                                        return 0; // 0 grados (frente)
                                    }
                                })(), 
                                pitch: -0.2 
                            },
                            imageLayer: 'conferencias/conferencias.jpeg',
                            size: { width: 1600, height: 900 },
                            anchor: 'bottom center'
                        }
                    ],
                })
            ]
        });
        
        // Configurar eventos después de crear el viewer
        photoSphereViewer.addEventListener('ready', () => {
            console.log('✅ Photo Sphere Viewer cargado correctamente');
            setupMarkerEvents();
            loading.style.display = 'none';
            clearTimeout(loadTimeout); // Limpiar timeout cuando carga exitosamente
            
            // Establecer vista inicial para ingeniería
            if (locationKey === 'ingenieria') {
                setTimeout(() => {
                    // Convertir 149 grados a radianes (149 * π / 180)
                    const headingRadians = (149 * Math.PI) / 180;
                    photoSphereViewer.animate({
                        longitude: headingRadians,
                        latitude: 0,
                        zoom: 0
                    }, 1000);
                }, 500);
            }
            

        });
        
        photoSphereViewer.addEventListener('error', (error) => {
            console.error('❌ Error en Photo Sphere Viewer:', error);
            showError('Error al cargar la imagen 360°: ' + error);
        });
        
        // Timeout para archivos grandes
        const loadTimeout = setTimeout(() => {
            if (loading.style.display !== 'none') {
                console.log('⏰ Timeout de carga para archivo grande');
                showError('El archivo es muy grande y está tardando en cargar. Por favor, espera un momento más o intenta nuevamente.');
            }
        }, 30000); // 30 segundos de timeout
        
        // Obtener referencia al plugin de markers
        markersPlugin = photoSphereViewer.getPlugin(MarkersPlugin);
        console.log('🔄 Photo Sphere Viewer inicializado:', photoSphereViewer);
        console.log('🔄 MarkersPlugin cargado:', markersPlugin);
        
    } catch (error) {
        console.error('❌ Error inicializando Photo Sphere Viewer:', error);
        showError('Error al inicializar el visor 360°: ' + error.message);
    }
}

function generateDescription(location) {
    let html = `
        <div class="conference-info">
            <p><strong>👥 Cupo:</strong> ${location.capacity}</p>
            <div class="schedule">
                <h4>📅 Programa del día:</h4>
                <div class="schedule-list">
    `;
    
    location.schedule.forEach(item => {
        html += `
            <div class="schedule-item">
                <div class="time">⏰ ${item.time}</div>
                <div class="activity">${item.activity}</div>
                ${item.speaker ? `<div class="speaker">${item.speaker}</div>` : ''}
                ${item.subSpeaker ? `<div class="sub-speaker">🎓 ${item.subSpeaker}</div>` : ''}
            </div>
        `;
    });
    
    html += `
                </div>
            </div>
            <a href="https://cumbre.usac.edu.gt/?key=eventos&key2=688bca8b523caba7cd34cae6" target="_blank" class="conference-cta">🎓 Inscríbete aquí</a>
        </div>
    `;
    
    return html;
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
            // Recargar con la ubicación actual
            const currentLocation = Object.keys(locations).find(key => 
                locations[key].image === photoSphereViewer.config.panorama
            );
            if (currentLocation) {
                show360(locations[currentLocation].image, currentLocation);
            } else {
                show360('360/biblioteca-central.jpg', 'biblioteca-central');
            }
        }
    }
}
