// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
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
/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
