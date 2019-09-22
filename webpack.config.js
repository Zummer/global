const AssetsWebpackPlugin = require('assets-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const DEV = 'development';
const PROD = 'production';
const NODE_ENV = process.env.NODE_ENV || DEV;
const nodeExternals = require('webpack-node-externals');

function getDevtool(mode) {
    let devtool;
    switch (mode) {
        case DEV:
            devtool = 'source-map';
            break;
        case PROD:
        default:
            devtool = false;
            break;
    }

    return devtool;
}

const babelLoader = {
    loader: 'babel-loader',
    options: {
        presets: [
            '@babel/preset-env',
            '@babel/preset-react'
        ],
        plugins: [
            '@babel/plugin-transform-runtime',
            '@babel/plugin-syntax-dynamic-import'
        ]
    }
};

const tsLoader = {
    loader: 'ts-loader',
    options: {
        configFile: './tsconfig.json'
    }
};

const baseConfig = {
    mode: DEV,
    watch: NODE_ENV === DEV,
    module: {
        rules: [{
            test: /\.(ts|tsx)$/,
            exclude:[/node_modules/],
            use: [
                babelLoader,
                tsLoader
            ],
        },{
            test: /\.(js|jsx)$/,
            use: babelLoader,
            exclude:[/node_modules/],
        }]
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.jsx']
    },
    devtool: getDevtool(NODE_ENV),
    plugins: [
        new ForkTsCheckerWebpackPlugin({
            tsconfig: './tsconfig.json'
        })
    ]
};

const clientConfig = {
    ...baseConfig,
    context: __dirname + '/src/client',
    entry: {
        app: './index.tsx'
    },
    output: {
        path: __dirname + '/public/js',
        filename: '[name].js',
        publicPath: '/js/'
    },
    plugins: [
        ...baseConfig.plugins,
        new AssetsWebpackPlugin({
            path: __dirname + '/public',
            prettyPrint: true,
            filename: 'webpack-assets.json'
        }),
    ],
};

const serverConfig = {
    ...baseConfig,
    target: 'node',
    externals: [nodeExternals()],
    context: __dirname + '/src/server',
    entry: {
        server: './index.ts'
    },
};

module.exports = [clientConfig, serverConfig];
