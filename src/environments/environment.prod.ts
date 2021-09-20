export const environment = {
  production: true,
  showTabs: true,
  appName: 'Cartella EDIT Studente',
  minimumAge: 14,
	
  apiEndpoint: 'https://cartella.provincia.tn.it/cartella-asl/api',

  cordova_identity_client: '7175611b-cb56-4d76-b516-ee2df4461711',
  cordova_identity_server: 'https://aac.platform.smartcommunitylab.it/',
  cordova_redirect_url: 'it.smartcommunitylab.editstudente.codescanner://callback',
  cordova_scopes: 'openid profile email',
  cordova_end_session_redirect_url: 'cartellaeditstudente://endSession',

  implicit_identity_client: '7175611b-cb56-4d76-b516-ee2df4461711',
  implicit_identity_server: 'https://aac.platform.smartcommunitylab.it',
  implicit_redirect_url: 'https://cartella.provincia.tn.it/cartella/edit-studente/implicit/authcallback',
  implicit_scopes: 'openid profile email',
  implicit_end_session_redirect_url: 'https://cartella.provincia.tn.it/cartella/edit-studente/implicit/endsession',


};
