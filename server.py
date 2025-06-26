import http.server
import socketserver
import os
import sys
import urllib.parse

PORT = 8000

class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        # Serve files from the directory where the script is run
        super().__init__(*args, **kwargs)

    def do_GET(self):
        decoded_path = urllib.parse.unquote(self.path)
        
        if decoded_path.endswith(".mp4"):
            try:
                file_path = decoded_path.lstrip('/')
                with open(file_path, 'rb') as f:
                    self.send_response(200)
                    self.send_header("Content-type", "video/mp4")
                    fs = os.fstat(f.fileno())
                    self.send_header("Content-Length", str(fs.st_size))
                    self.end_headers()
                    self.wfile.write(f.read())
            except FileNotFoundError:
                self.send_error(404, "File not found")
        else:
            super().do_GET()

socketserver.TCPServer.allow_reuse_address = True
with socketserver.TCPServer(("", PORT), Handler) as httpd:
    print(f"Serving at http://localhost:{PORT}")
    httpd.serve_forever()
