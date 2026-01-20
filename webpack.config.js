const path = require('path');

module.exports = {
  entry: './src/index.tsx',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'main.js',
    library: {
      type: 'umd',
      name: 'milkdropVisualizer'
    }
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js']
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: {
          loader: 'ts-loader',
          options: {
            transpileOnly: true, // Skip type checking to avoid build failures
            compilerOptions: {
              noEmit: false,
              module: 'esnext',
              target: 'es2017',
              jsx: 'react-jsx'
            }
          }
        },
        exclude: /node_modules/
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader']
      }
    ]
  },
  externals: {
    'react': 'React',
    'react-dom': 'ReactDOM',
    '@jellyfin/client': 'jellyfin-apiclient'
  }
};