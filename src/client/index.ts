import { io } from "socket.io-client";

const socket = io();
socket.on("connect", () => {
	console.log("Connection established.");
});
document.body.onclick = () => {
	document.body.onclick = null;
	const audioContext = new window.AudioContext();
	socket.on("audio", (event) => {
		const buffer = audioContext.createBuffer(event.numberOfChannels, event.length, event.sampleRate);
		event.channelData.forEach((channel : Buffer, channelIndex : number) => {
			const buffering = buffer.getChannelData(channelIndex);
			const data = new Float32Array(channel);
			data.forEach((chunk, index) => {
				buffering[index] = chunk;
			});
		});
		const source = audioContext.createBufferSource();
		source.buffer = buffer;
		source.connect(audioContext.destination);
		source.start();
	});
};
const canvas = document.querySelector("canvas");
const context = canvas?.getContext("2d");
socket.on("video", (event) => {
	if(context) {
		const id = context.getImageData(event.x, event.y, event.width, event.height);
		const data = new Uint8Array(event.data);
		data.forEach((byte, index) => {
			id.data[index] = byte;
		});
		context.putImageData(id, event.x, event.y);
	}
});

console.log("client");