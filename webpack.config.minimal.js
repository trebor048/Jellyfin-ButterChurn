const path = require('path');

module.exports = {
  mode: 'production',
  entry: './src/index.tsx',
  output: {
    path: path.resolve(__dirname, 'dist-webpack'),
    filename: 'main-webpack.js',
    library: {
      type: 'umd',
      name: 'milkdropVisualizer'
    }
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.jsx']
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: {
          loader: 'ts-loader',
          options: {
            transpileOnly: true,
            compilerOptions: {
              target: 'es2017',
              module: 'esnext',
              jsx: 'react-jsx',
              esModuleInterop: true,
              allowSyntheticDefaultImports: true
            }
          }
        },
        exclude: /node_modules/
      }
    ]
  },
  externals: {
    'react': 'React',
    'react-dom': 'ReactDOM',
    'butterchurn': 'butterchurn',
    'butterchurn-presets': 'butterchurnPresets'
  },
  optimization: {
    minimize: false
  },
  stats: {
    errorDetails: true
  }
};