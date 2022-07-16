import prodConfig from './production';
import devConfig from './development';

const config = process.env.NODE_ENV === 'production' ? prodConfig : devConfig;

export default config;