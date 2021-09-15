export const environment = {
  production: true,
  showTabs: true,
  appName: 'Cartella EDIT Studente',
  minimumAge: 14,
  apiEndpoint: 'https://cartella-asl-demo.platform.smartcommunitylab.it/cartella-asl/api',

  cordova_identity_client: 'c_37b06a4d-9ca5-47bb-8630-283249916cdd',
  cordova_identity_server: 'https://aac-adc.platform.smartcommunitylab.it/',
  cordova_redirect_url: 'it.smartcommunitylab.editstudente.codescanner://callback',
  cordova_scopes: 'openid profile email',
  cordova_end_session_redirect_url: 'cartellaeditstudente://endSession',

  implicit_identity_client: 'c_37b06a4d-9ca5-47bb-8630-283249916cdd',
  implicit_identity_server: 'https://aac-adc.platform.smartcommunitylab.it/',
  implicit_redirect_url: 'https://cartella-asl-demo.platform.smartcommunitylab.it/edit-studente/implicit/authcallback',
  implicit_scopes: 'openid profile email',
  implicit_end_session_redirect_url: 'https://cartella-asl-demo.platform.smartcommunitylab.it/edit-studente/implicit/endsession',


};
