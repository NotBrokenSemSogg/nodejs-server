import http from "http";
import fs from "fs";
import path from "path";
import mime from "mime";

// Setting up IP
const hostname = "192.168.0.38";
const port = 80; 

// HTML
const server = http.createServer((req, res) => {
    const now = new Date();
        console.log(`${now.getMonth() + 1}-${now.getDate()}-${now.getFullYear()} ${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}.${now.getMilliseconds()}, [HTTP]: Request for ` + req.url +' by method ' + req.method);
        if (req.method == 'GET') {
            var fileUrl;
            if (req.url == '/') fileUrl = '/index.html';
            else fileUrl = req.url;

            var filePath = path.resolve('./public' + fileUrl);
            const fileExt = path.extname(filePath);
            if (fileExt == '.html') {
                fs.exists(filePath, (exists) => {
                    if (!exists) {
                        filePath = path.resolve('./public/404.html');
                        res.statusCode = 404;
                        res.setHeader('Content-Type', 'text/html');
                        fs.createReadStream(filePath).pipe(res);
                        return;
                    }
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'text/html');
                    fs.createReadStream(filePath).pipe(res);
                });
            }
            else if (fileExt == '.css') {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'text/css');
                fs.createReadStream(filePath).pipe(res);
            }
            else if (fs.existsSync("./public/" + fileUrl)) {
                var mimeType = mime.getType(fileExt);
                res.writeHead(200, { "Content-Type": mimeType });
                var data = fs.readFileSync(filePath);
                res.end(data);
            } else {
                filePath = path.resolve("./public/404.html");
                res.statusCode = 404;
                res.setHeader("Content-Type", "text/html");
                fs.createReadStream(filePath).pipe(res);
            }
        }
    else {
        filePath = path.resolve('./public/404.html');
        res.statusCode = 404;
        res.setHeader('Content-Type', 'text/html');
        fs.createReadStream(filePath).pipe(res);
    }
});
server.listen(port, hostname, () => {
    const now = new Date();
        console.log(`${now.getMonth() + 1}-${now.getDate()}-${now.getFullYear()} ${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}.${now.getMilliseconds()}: HTTP server running at http://${hostname}:${port}/`);
});