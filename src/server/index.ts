import express from "express";
import path from "path";
import http from "http";

import Html from "./index.html";
import Css from "./index.css";

const app = express();
const server = http.createServer(app);

app.get("/", (_, res) => {
	res.header("Content-Type", "text/html");
	res.send(Html);
});
app.get("/index.css", (_, res) => {
	res.header("Content-Type", "text/css");
	res.send(Css);
});

app.use(express.static(path.join(__dirname, "..", "client")));

server.listen(80, () => console.log("server"));