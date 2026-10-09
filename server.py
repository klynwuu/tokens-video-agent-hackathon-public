"""Local artifact server with byte ranges so MP4 chapter seeking works."""
import argparse
from functools import partial
from http.server import SimpleHTTPRequestHandler,ThreadingHTTPServer
from pathlib import Path
import re

class Handler(SimpleHTTPRequestHandler):
    def send_head(self):
        self.byte_range=None
        if any(part.startswith('.') for part in __import__('urllib.parse', fromlist=['urlsplit']).unquote(__import__('urllib.parse', fromlist=['urlsplit']).urlsplit(self.path).path).split('/') if part):
            self.send_error(404);return None
        file=Path(self.translate_path(self.path))
        if not file.is_file():
            return super().send_head()
        stream=file.open('rb');stat=file.stat();size=stat.st_size
        header=self.headers.get('Range')
        start,end=0,max(0,size-1)
        if header:
            match=re.fullmatch(r'bytes=(\d*)-(\d*)',header.strip())
            if not match or not any(match.groups()):
                stream.close();self.send_error(416,'Invalid byte range');return None
            a,b=match.groups()
            if a:
                start=int(a);end=min(size-1,int(b)) if b else size-1
            else:
                start=max(0,size-int(b));end=size-1
            if start>=size or end<start:
                stream.close();self.send_response(416);self.send_header('Content-Range',f'bytes */{size}');self.send_header('Content-Length','0');self.end_headers();return None
            self.byte_range=(start,end)
        self.send_response(206 if header else 200)
        self.send_header('Content-Type',self.guess_type(str(file)))
        self.send_header('Content-Length',str(end-start+1 if size else 0))
        self.send_header('Accept-Ranges','bytes')
        self.send_header('Last-Modified',self.date_time_string(stat.st_mtime))
        if header:self.send_header('Content-Range',f'bytes {start}-{end}/{size}')
        self.end_headers();return stream

    def copyfile(self,source,output):
        if self.byte_range is None:return super().copyfile(source,output)
        start,end=self.byte_range;source.seek(start);remaining=end-start+1
        while remaining:
            data=source.read(min(128*1024,remaining))
            if not data:break
            try:output.write(data)
            except (BrokenPipeError,ConnectionResetError):break
            remaining-=len(data)

if __name__=='__main__':
    parser=argparse.ArgumentParser();parser.add_argument('--port',type=int,default=4180);parser.add_argument('--directory',default=str(Path(__file__).resolve().parent/'public'));args=parser.parse_args()
    server=ThreadingHTTPServer(('127.0.0.1',args.port),partial(Handler,directory=args.directory))
    print(f'Demo: http://127.0.0.1:{args.port}/',flush=True)
    server.serve_forever()
