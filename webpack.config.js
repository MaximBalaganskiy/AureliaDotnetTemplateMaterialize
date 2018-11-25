const path = require("path");
const webpack = require("webpack");
const { AureliaPlugin, ModuleDependenciesPlugin, GlobDependenciesPlugin } = require("aurelia-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

const bundleOutputDir = "./wwwroot/dist";

module.exports = (env, argv) => {
	if ((!argv || !argv.mode) && process.env.ASPNETCORE_ENVIRONMENT === "Development") {
		argv = { mode: "development" };
	}
	console.log("mode=", argv.mode);
	const isDevBuild = argv.mode !== "production";
	const cssLoader = { loader: isDevBuild ? "css-loader" : "css-loader?minimize" };
	return [{
		target: "web",
		mode: isDevBuild ? "development" : "production",
		entry: { "app": ["es6-promise/auto", "aurelia-bootstrapper"] },
		resolve: {
			extensions: [".ts", ".js"],
			modules: ["ClientApp", "node_modules"]
		},
		output: {
			path: path.resolve(bundleOutputDir),
			publicPath: "/dist/",
			filename: "[name].js",
			chunkFilename: "[name].js"
		},
		module: {
			rules: [
				{ test: /\.(woff|woff2)(\?|$)/, loader: "url-loader?limit=1" },
				{ test: /\.(png|eot|ttf|svg)(\?|$)/, loader: "url-loader?limit=100000" },
				{ test: /\.ts$/i, include: [/ClientApp/, /node_modules/], use: "awesome-typescript-loader" },
				{ test: /\.html$/i, use: "html-loader" },
				{ test: /\.css$/i, include: [/node_modules/], issuer: /\.html$/i, use: cssLoader },
				{ test: /\.css$/i, include: [/node_modules/], exclude: [/\materialize.css$/], issuer: [{ not: [{ test: /\.html$/i }] }], use: ["style-loader", cssLoader] },
				{ test: /\materialize.css$/, use: [{ loader: MiniCssExtractPlugin.loader }, cssLoader] },
				{ test: /\.scss$/i, issuer: /(\.html|empty-entry\.js)$/i, use: [cssLoader, "sass-loader"] },
				{ test: /\.scss$/i, issuer: /\.ts$/i, use: ["style-loader", cssLoader, "sass-loader"] }
			]
		},
		optimization: {
			splitChunks: {
				chunks: "all"
				// uncomment the following to create a separate bundle for each npm module
				/* maxInitialRequests: Infinity,
				minSize: 0,
				cacheGroups: {
					vendor: {
						test: /[\\/]node_modules[\\/]/,
						name(module) {
							// get the name. E.g. node_modules/packageName/not/this/part.js
							// or node_modules/packageName
							const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1];

							// npm package names are URL-safe, but some servers don't like @ symbols
							return `npm.${packageName.replace('@', '')}`;
						}
					}
				}*/
			},
			minimizer: [
				new TerserPlugin({
					cache: true,
					parallel: true,
					sourceMap: true // set to true if you want JS source maps
				}),
				new OptimizeCSSAssetsPlugin({})
			]
		},
		devtool: isDevBuild ? "source-map" : false,
		performance: {
			hints: false
		},
		plugins: [
			new webpack.DefinePlugin({ IS_DEV_BUILD: JSON.stringify(isDevBuild) }),
			new HtmlWebpackPlugin({ template: 'Views/Shared/_LayoutTemplate.cshtml', filename: "../../Views/Shared/_Layout.cshtml", inject: false, metadata: {}, alwaysWriteToDisk: true }),
			new AureliaPlugin({ aureliaApp: "boot" }),
			new GlobDependenciesPlugin({ "boot": ["ClientApp/**/*.{ts,html}"] }),
			new ModuleDependenciesPlugin({}),
			new MiniCssExtractPlugin()
		]
	}];
};
