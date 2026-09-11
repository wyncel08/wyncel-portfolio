from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path


PROJECT_ROOT = Path(__file__).resolve().parent


class PortfolioHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(PROJECT_ROOT), **kwargs)

    def do_GET(self):
        if self.path == "/wyncel-profile":
            self.send_response(301)
            self.send_header("Location", "/wyncel-profile/")
            self.end_headers()
            return

        if self.path.startswith("/wyncel-profile/"):
            self.path = self.path[len("/wyncel-profile") :]

        super().do_GET()


if __name__ == "__main__":
    server = ThreadingHTTPServer(("127.0.0.1", 8000), PortfolioHandler)
    print("Wyncel Profile is running at http://127.0.0.1:8000/wyncel-profile/")
    server.serve_forever()