const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
// const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const TerserWebpackPlugin = require('terser-webpack-plugin');

const isDev = process.env.NODE_ENV === 'development';

const filename = (ext, name) =>
	isDev ? `${name}.${ext}` : `${name}.[hash].${ext}`;

const cssLoaders = (addition) => {
	const loaders = [
		{
			loader: MiniCssExtractPlugin.loader,
			options: {},
		},
		'css-loader',
	];

	if (addition) {
		loaders.push(addition);
	}
	return loaders;
};

module.exports = {
	context: path.resolve(__dirname, 'src'),
	entry: ['webpack-dev-server/client?http://localhost:8080/', './index.js'],
	output: {
		filename: filename('js', 'index'),
		path: path.resolve(__dirname, 'dist'),

		clean: true,
	},
	devServer: {
		static: {
			directory: path.resolve(__dirname, 'dist'),
		},
		compress: true,
		port: 8080,
		liveReload: true,
		hot: false,
	},
	plugins: [
		new HtmlWebpackPlugin({
			filename: filename('html', 'index'),
			template: path.resolve(__dirname, 'src/index.html'),
			minify: {
				collapseWhitespace: !isDev,
			},
		}),

		new CleanWebpackPlugin(),
		// new CopyWebpackPlugin([
		// 	{
		// 		from: path.resolve(__dirname, 'src/favicon.ico'),
		// 		to: 'dist',
		// 	},
		// ]),
		new MiniCssExtractPlugin({
			filename: filename('css', 'style'),
		}),
	],
	optimization: {
		minimize: !isDev,
		minimizer: [new TerserWebpackPlugin(), new CssMinimizerPlugin()],
	},
	module: {
		rules: [
			{
				test: /\.css$/,
				use: cssLoaders(),
			},
			{
				test: /\.s[ac]ss$/,
				use: cssLoaders('sass-loader'),
			},
			{
				test: /\.(png|jpg|svg|gif)$/,
				use: ['file-loader'],
			},
			{
				test: /\.(ttf|woff|woff2|eot)$/,
				use: ['file-loader'],
			},
			{
				test: /\.(?:js|mjs|cjs)$/,
				exclude: /node_modules/,
				use: {
					loader: 'babel-loader',
					options: {
						presets: [['@babel/preset-env', { targets: '> 0.25%, not dead' }]],
					},
				},
			},
		],
	},
};
