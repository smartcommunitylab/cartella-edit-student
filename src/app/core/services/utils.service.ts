import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';

@Injectable()
export class UtilsService {

    loading;

    constructor(public loadingController: LoadingController) {
    }

    async presentLoading() {
        this.loading = await this.loadingController.create({
            'message': 'Caricamento in corso…',
            'duration': 2000
        });
        return await this.loading.present();
    }

    async dismissLoading() {
        this.loading.dismiss();
    }

}