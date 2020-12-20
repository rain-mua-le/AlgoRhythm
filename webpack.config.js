const path = require('path');

module.exports = {
  entry: { 
    visual: "./src/art.js",
    musicGenerator: "./src/generator.js",
    musicPlayer: './src/player.js'
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
};