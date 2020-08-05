import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';

@Injectable()
export class UtilsService {

    loading;

    constructor(public loadingController: LoadingController) {
    }

    async presentLoading() {
        this.loading = await this.loadingController.create({
            'spinner': null,
            'cssClass': 'custom-loading',
            'message': '<ion-row class="v-center"><img class="animated-gif" src="assets/image/spinnerGlobal.gif">&nbsp;Caricamento in corso…</ion-row>',
            'duration': 2000
        });
        return await this.loading.present();
    }

    async dismissLoading() {
        this.loading.dismiss();
    }

}