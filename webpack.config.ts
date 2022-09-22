import path from "path";
import { Configuration } from "webpack";

const shared : Configuration = {
	module : {
		rules: [{
			test: /\.tsx?$/,
			use: "ts-loader",
			exclude: /node_modules/,
		}, {
			test: /\.(html|css)$/i,
			loader: "raw-loader",
		}, {
			test: /\.(svg|wav)$/i,
			loader: "file-loader"
		}],
	},
	resolve: {
		extensions: [".tsx", ".ts", ".js"],
	},
	externals: {
		canvas: "commonjs canvas",
		"audio-loader": "commonjs audio-loader",
	}
};

const config : Array<Configuration> = [{
	...shared,
	mode: "development",
	entry: "./src/client/index.ts",
	target: "web",
	output: {
		filename: "index.js",
		path: path.resolve(__dirname, "dist", "client"),
	},
}, {
	...shared,
	mode: "development",
	entry: "./src/server/index.ts",
	target: "node",
	output: {
		filename: "index.js",
		path: path.resolve(__dirname, "dist", "server"),
	},
}];

export default config;