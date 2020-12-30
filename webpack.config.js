const webpack = require('webpack');
const path = require('path');
const NODE_ENV = 'development';
const CircularDependencyPlugin = require('circular-dependency-plugin')

const common = {
    nodeEnv: new webpack.DefinePlugin({
        'process.env': {
            NODE_ENV: `'development'`
        }
    }),
    path: path.resolve(__dirname, 'assets/client/dist'),
    publicPath: '/',
    loaders: [
        {
            test: /\.js$/,
            exclude: /node_modules/,
            use: 'babel-loader',
        }
    ],
    resolve: {extensions: ['.js']}
};

module.exports = [
    {
        node: {
            Buffer: false,
            process: false
          },
        // client side rendering
        target: 'web',
        entry: {
            client: './index.js'
        },
        output: {
            path: path.resolve(__dirname, './public'),
            filename: '[name].js',
            publicPath: common.publicPath
        },
        watch: true,
        mode: NODE_ENV,
        plugins: [
            new CircularDependencyPlugin({
                $: "jquery",
                jQuery: "jquery",
                process: 'process/browser',
              })
          ],
        resolve: common.resolve,
        module: {
            rules: [
                {
                    test: /\.js$/,
                    exclude: /node_modules/,
                    use: {
                        loader: 'babel-loader',
                        options: {
                            presets: [
                                "@babel/preset-env","@babel/preset-react"
                            ]
                        },
                    },
                },
                {
                    test: /\.css$/,
                    use: ['style-loader', 'css-loader'],
                },
                { 
                    test: require.resolve('jquery'), 
                    use: [{
                        loader: 'expose-loader',
                        options: '$'
                    }]
                },
                {
                    test: /\.(pdf|jpe)$/i,
                    use: [
                      {
                        loader: 'file-loader',
                      },
                    ],
                }
            ]
        },
        devtool: 'source-map',
        devServer: {
            contentBase: common.path,
            publicPath: common.publicPath,
            open: true,
            historyApiFallback: true
        },
        externals: {
            jquery: 'jQuery'
          }
    },
    ///////////////////////////// Second file output
    {
        // client side rendering
        target: 'web',
        entry: {
            client: './vitrine.js'
        },
        output: {
            path: path.resolve(__dirname, './public/vitrine'),
            filename: '[name].js',
            publicPath: common.publicPath
        },
        watch: true,
        mode: NODE_ENV,
        plugins: [
            new webpack.ProvidePlugin({
                $: "jquery",
                jQuery: "jquery"
              })
          ],
        resolve: common.resolve,
        module: {
            rules: [
                {
                    test: /\.js$/,
                    exclude: /node_modules/,
                    use: {
                        loader: 'babel-loader',
                        options: {
                            presets: [
                                "@babel/preset-env","@babel/preset-react"
                            ]
                        },
                    },
                },
                {
                    test: /\.css$/,
                    use: ['style-loader', 'css-loader'],
                },
                { 
                    test: require.resolve('jquery'), 
                    use: [{
                        loader: 'expose-loader',
                        options: '$'
                    }]
                },
                {
                    test: /\.(pdf|jpe)$/i,
                    use: [
                      {
                        loader: 'file-loader',
                      },
                    ],
                }
            ]
        },
        devtool: 'source-map',
        devServer: {
            contentBase: common.path,
            publicPath: common.publicPath,
            open: true,
            historyApiFallback: true
        },
        externals: {
            jquery: 'jQuery'
          }      
    }
];