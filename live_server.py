#!/usr/bin/env python3
"""
Live Server con recarga automática
Uso: python3 live_server.py
"""

import http.server
import socketserver
import os
import sys
import time
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler
import webbrowser
import threading

class LiveReloadHandler(FileSystemEventHandler):
    def __init__(self, server):
        self.server = server
        self.clients = []
    
    def on_modified(self, event):
        if event.is_directory:
            return
        if event.src_path.endswith(('.html', '.css', '.js')):
            print(f"🔄 Archivo modificado: {event.src_path}")
            self.reload_clients()
    
    def reload_clients(self):
        for client in self.clients:
            try:
                client.send(b"data: reload\n\n")
            except:
                pass
        self.clients.clear()

class LiveServer(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        self.live_reload_handler = kwargs.pop('live_reload_handler', None)
        super().__init__(*args, **kwargs)
    
    def end_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
        self.send_header('Pragma', 'no-cache')
        self.send_header('Expires', '0')
        super().end_headers()
    
    def do_GET(self):
        if self.path == '/live-reload':
            self.send_response(200)
            self.send_header('Content-Type', 'text/event-stream')
            self.send_header('Cache-Control', 'no-cache')
            self.send_header('Connection', 'keep-alive')
            self.end_headers()
            
            if self.live_reload_handler:
                self.live_reload_handler.clients.append(self.wfile)
            
            # Mantener conexión abierta
            while True:
                try:
                    self.wfile.write(b"data: ping\n\n")
                    self.wfile.flush()
                    time.sleep(1)
                except:
                    break
            return
        
        return super().do_GET()

def start_server(port=8080):
    # Configurar el handler
    live_reload_handler = LiveReloadHandler(None)
    
    # Crear el servidor
    with socketserver.TCPServer(("", port), lambda *args, **kwargs: LiveServer(*args, live_reload_handler=live_reload_handler, **kwargs)) as httpd:
        print(f"🚀 Servidor iniciado en http://localhost:{port}")
        print(f"📁 Sirviendo archivos desde: {os.getcwd()}")
        print("🔄 Recarga automática activada")
        print("⏹️  Presiona Ctrl+C para detener")
        
        # Configurar watchdog para recarga automática
        event_handler = LiveReloadHandler(httpd)
        observer = Observer()
        observer.schedule(event_handler, path='.', recursive=True)
        observer.start()
        
        # Abrir navegador automáticamente
        def open_browser():
            time.sleep(1)
            webbrowser.open(f'http://localhost:{port}')
        
        threading.Thread(target=open_browser, daemon=True).start()
        
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\n⏹️  Deteniendo servidor...")
            observer.stop()
            httpd.shutdown()

if __name__ == "__main__":
    port = 8080
    if len(sys.argv) > 1:
        try:
            port = int(sys.argv[1])
        except ValueError:
            print("❌ Puerto inválido. Usando puerto 8080")
    
    start_server(port)
