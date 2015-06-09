module.exports = {
    entry: "./js/client.js",
    output: {
        path: 'public',
        filename: "client-bundle.js"
    },
    resolve: {
        modulesDirectories: ['node_modules', 'bower_components']
    },
    module: {
        loaders: [
            { test: /\.js$/, exclude: /node_modules/, loader: "babel-loader"}
        ]
    }
};
