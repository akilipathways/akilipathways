import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.akili.pathways',
  appName: 'AkiliPathways',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  }
};

export default config;
