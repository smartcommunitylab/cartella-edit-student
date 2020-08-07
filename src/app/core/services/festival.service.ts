import { Injectable } from '@angular/core';
import * as moment from 'moment';
import 'moment/locale/it';

@Injectable()
export class FestivalService {
   
    giorni = [];

    constructor() {
        var anno = moment().startOf('day').format('YYYY');
        this.giorni.push(anno + '-01-01');
        this.giorni.push(anno + '-01-06');
        this.giorni.push(anno + '-04-25');
        this.giorni.push(anno + '-05-01');
        this.giorni.push(anno + '-06-02');
        this.giorni.push(anno + '-08-15');
        this.giorni.push(anno + '-11-01');
        this.giorni.push(anno + '-12-08');
        this.giorni.push(anno + '-12-25');
        this.giorni.push(anno + '-12-26');
        this.calcuatePasqua(anno);
        // this.calcuatePasqua(1990); // test case 15-04
        // this.calcuatePasqua(1976); // test case 18-04
        // this.calcuatePasqua(2049); // test case 18-04
        // this.calcuatePasqua(1943); // test case 25-04
        // this.calcuatePasqua(2021); // test case 04-04
        // this.calcuatePasqua(2022); // test case 17-04
    }

    isFestival(giorno) {
        return (this.giorni.indexOf(giorno.giornata) > 0)
    }

    calcuatePasqua(N) {
        var pasqua, pasquaLunedi;
        var x = 24;
        var y = 5;
        var a = N % 19;
        var b = N % 4;
        var c = N % 7;
        var d = (19 * a + x) % 30;
        var e = (2 * b + 4 * c + 6 * d + y) % 7;
        var sum = 22 + d + e;
        if (sum <= 31) {
            pasqua = '03-' + ('0' + sum).slice(-2);
            pasquaLunedi = '03-' + ('0' + (sum + 1)).slice(-2);
            console.log('pasqua(' + N + ')-> ' + pasqua);
            console.log('pasquaLunedi(' + N + ')-> ' + pasquaLunedi);
        } else {
            var sum2 = sum - 31;
            if (sum2 == 25 && d == 28 && a > 10) {
                pasqua = '04-18';
                pasquaLunedi = '04-19';
            } else if (sum2 == 26) {
                pasqua = '04-19';
                pasquaLunedi = '04-20';
            } else {
                pasqua = '04-' + ('0' + sum2).slice(-2);
                pasquaLunedi = '04-' + ('0' + (sum2 +1)).slice(-2);
            }
            console.log('pasqua(' + N + ')-> ' + pasqua);
            console.log('pasquaLunedi(' + N + ')-> ' + pasquaLunedi);
        }

        this.giorni.push(N + '-' + pasqua);
        this.giorni.push(N + '-' + pasquaLunedi);
    }


}