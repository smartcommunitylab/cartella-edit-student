import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';

@Injectable()
export class UtilsService {

    isLoading;

    constructor(public loadingController: LoadingController) {}

    async presentLoading() {
        this.isLoading = true;

        return await this.loadingController.create({
            'spinner': null,
            'cssClass': 'custom-loading',
            'message': '<div class="overlay-content"><ion-row class="v-center"><img class="animated-gif" src="assets/image/spinnerGlobal.gif">&nbsp;Caricamento in corso…</ion-row></div>',
        }).then(a => {
            a.present().then(() => {
                console.log('loading presented');
                if (!this.isLoading) {
                    a.dismiss({ confirmed: true }, undefined).then(() => console.log('abort laoding'));
                }
            });
        });

    }

    async dismissLoading() {
        this.isLoading = false;
        return await this.loadingController.dismiss({ confirmed: true }, undefined).then(() => console.log('loading dismissed'));
    }

}