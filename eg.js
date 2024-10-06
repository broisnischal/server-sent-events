
import app from "express";

const server = app();

server.get("/", (req, res) => res.send("hello"));

server.get("/stream", (req, res) => {
    console.log("SSE Connected in client ....");

    res.setHeader("Content-Type", "text/event-stream");
    write(res, 0);
});

function write(res, i) {
    setTimeout(() => {
        res.write("data: " + i++ + "\n\n");
        write(res, i);
    }, 1000)
}

server.listen(8080);

console.log("Listening on 8080");
