import express from "express";
import path from "path";
import http from "http";

import Html from "./index.html";
import Css from "./index.css";
import Logo from "./logo.svg";

import * as io from "socket.io";

import { createCanvas, loadImage } from "canvas";

import loadAudio from "audio-loader";
import Intro from "./intro.wav";

const app = express();
const server = http.createServer(app);

const socket = new io.Server(server);

const introPromise = new Promise<any>(resolve => loadAudio(path.join(__dirname, Intro), (_ : never, data : any) => resolve(data)));

socket.on("connection", async (client) => {
	console.log("Connection established.");
	const intro = await introPromise;
	client.emit("audio", {
		length : intro.length,
		numberOfChannels : intro.numberOfChannels,
		sampleRate: intro.sampleRate,
		channelData: intro._channelData
	});
	const canvas = createCanvas(640, 480);
	const context = canvas.getContext("2d");
	const logo = await loadImage(path.join(__dirname, Logo));
	const padding = 50;
	logo.height = logo.height * ((canvas.width - 2 * padding) / logo.width);
	logo.width = canvas.width - padding * 2;
	context.drawImage(logo, padding, canvas.height / 2 - logo.height / 2);
	const id = context.getImageData(0, 0, canvas.width, canvas.height);
	client.emit("video", {		
		x : 0,
		y : 0,
		width : id.width,
		height : id.height,
		data : id.data
	});
	client.on("disconnect", () => {
		console.log("Connection closed.");
	});
});

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