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
                    a.dismiss({ confirmed: true }, undefined).then(() => console.log('abort loading'));
                }
            });
        });

    }

    async dismissLoading() {
        while (await this.loadingController.getTop() !== undefined) {
            this.isLoading = false;
            return await this.loadingController.dismiss();
        }
        // if (this.isLoading) {
        //     this.isLoading = false;
        //     return await this.loadingController.dismiss({ confirmed: true }, undefined).then(() => console.log('loading dismissed'));
        // }
        return null;        
    }

    async presentSuccessLoading(msg) {
        return await this.loadingController.create({
            'spinner': null,
            'cssClass': 'custom-loading',
            'message': '<div class="overlay-content-successo"><span class="row v-center"><img class="icon" src="assets/image/it-check-circle.svg">&nbsp;<span class="tip-msg">' + msg + '</span></span></div>',
            'duration': 2000
        }).then(a => {
            a.present().then(() => {
                console.log('loading presented');
            });
        })
    }

    async presentErrorLoading(msg) {
        return await this.loadingController.create({
            'spinner': null,
            'cssClass': 'custom-loading',
            'message': '<div class="overlay-content-errore"><span class="row v-center"><img class="icon" src="assets/image/it-error.svg">&nbsp;<span class="tip-msg">' + msg + '</span></span></div>',
            'duration': 2000
        }).then(a => {
            a.present().then(() => {
                console.log('loading presented');
            });
        })
    }

    async presentWarningLoading(msg) {
        return await this.loadingController.create({
            'spinner': null,
            'cssClass': 'custom-loading',
            'message': '<div class="overlay-content-warning"><ion-row><ion-col class="v-center"><img class="icon" src="assets/image/it-warning-circle.svg">&nbsp;<span class="tip-msg">' + msg + '</span></ion-col></ion-row></div>',
            'duration': 2000
        }).then(a => {
            a.present().then(() => {
                console.log('loading presented');
            });
        })
    }

}