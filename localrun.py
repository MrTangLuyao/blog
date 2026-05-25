#!/usr/bin/env python3
"""localrun.py — preview the blog locally.

Markdown posts (type: 'md') are loaded with fetch(), which the browser blocks
on file:// — so you can't just double-click index.html anymore. This serves the
repo over http instead.

    python3 localrun.py

It starts a static server rooted at this folder, opens the blog in your default
browser, and waits. Press any key (or Ctrl+C) to shut it down.
"""

import functools
import http.server
import os
import socket
import sys
import threading
import webbrowser

ROOT = os.path.dirname(os.path.abspath(__file__))
DEFAULT_PORT = 8000
PAGE = "index.html"


class Handler(http.server.SimpleHTTPRequestHandler):
    """Serve ROOT, but never cache — so edits to .md / .js show on refresh."""

    def end_headers(self):
        self.send_header("Cache-Control", "no-store, must-revalidate")
        self.send_header("Expires", "0")
        super().end_headers()

    def log_message(self, *args):
        pass  # keep the console quiet


def pick_port(start):
    for port in range(start, start + 30):
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
            if s.connect_ex(("127.0.0.1", port)) != 0:
                return port
    return start


def wait_for_keypress():
    """Block until the user presses a single key. Falls back to Enter if the
    terminal can't be put into raw mode (e.g. stdin isn't a tty)."""
    try:
        import msvcrt  # Windows
        msvcrt.getch()
        return
    except ImportError:
        pass
    try:
        import termios
        import tty
        fd = sys.stdin.fileno()
        old = termios.tcgetattr(fd)
        try:
            tty.setraw(fd)
            sys.stdin.read(1)
        finally:
            termios.tcsetattr(fd, termios.TCSADRAIN, old)
    except Exception:
        try:
            input()
        except EOFError:
            raise KeyboardInterrupt


def main():
    port = pick_port(DEFAULT_PORT)
    handler = functools.partial(Handler, directory=ROOT)
    httpd = http.server.ThreadingHTTPServer(("127.0.0.1", port), handler)

    url = f"http://localhost:{port}/{PAGE}"
    threading.Thread(target=httpd.serve_forever, daemon=True).start()

    print(f"  serving {ROOT}")
    print(f"  blog → {url}")
    print("  press any key (or Ctrl+C) to stop")
    webbrowser.open(url)

    try:
        wait_for_keypress()
    except KeyboardInterrupt:
        pass
    finally:
        httpd.shutdown()
        print("\n  stopped.")


if __name__ == "__main__":
    main()
