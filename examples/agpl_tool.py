# SPDX-License-Identifier: AGPL-3.0-only
# Copyright 2026 LicenseLens contributors.
# Complete corresponding source; Python 3 standard library only, no build step.
# Run: python agpl_tool.py. Every network user can obtain this source at /source.
from http.server import BaseHTTPRequestHandler, HTTPServer
from pathlib import Path

class Handler(BaseHTTPRequestHandler):
    def do_GET(self):
        source = self.path == '/source'
        body = Path(__file__).read_bytes() if source else b'<a href="/source">Download complete corresponding source (AGPL-3.0-only)</a>'
        self.send_response(200)
        self.send_header('Content-Type', 'text/plain; charset=utf-8' if source else 'text/html; charset=utf-8')
        self.end_headers()
        self.wfile.write(body)

if __name__ == '__main__':
    HTTPServer(('127.0.0.1', 8080), Handler).serve_forever()
