# cartella-edit-student

Ionic CLI 6.10.1
Node v12.13.1
Angular CLI 6.0.3

## Running the Application
1. Install `Node.js 12.13.1` or higher. *IMPORTANT: The server uses ES2015 features AND the Angular CLI so you need Node 6.11 or higher!!!!*

1. Run `npm i` from project root to install app dependencies

2. Configure AAC client properties in environment.ts or envrionment.prod.ts file

3. Run `ng serve --port 4300` in a separate terminal window to build the TypeScript, watch for changes and launch the web server

4. Go to http://localhost:4300 in your browser 

## Deployment on server

Specify in angular.json file

"baseHref": "/edit-studente/",

in build option, and then with ionic build command it read from this configuration file.

  "build": {
          "builder": "@angular-devkit/build-angular:browser",
          "options": {
            "baseHref": "/edit-studente/",

ionic build

## Opzionale:
if ng is installed, one can run 

ng build --base-href /edit-studente/

Note: --base-href is ignored by ionic build command

## Importante:
Accessibility in ionic framework: <https://justinnoel.dev/2019/07/06/accessibility-in-ionic-framework-apps>
