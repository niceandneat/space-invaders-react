import merge from 'webpack-merge';
import common from './webpack.common';

const config = merge(common, {
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
    contentBase: './dist',
    hot: true,
  },
  optimization: {
    usedExports: true,
  },
});

export default config;
