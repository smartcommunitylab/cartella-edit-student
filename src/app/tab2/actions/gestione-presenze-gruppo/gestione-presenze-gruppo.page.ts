import { Component, ViewChild } from '@angular/core';
import { DataService } from '../../../core/services/data.service'
import { Router, ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import 'moment/locale/it';
import { PickerController, IonContent, ToastController } from '@ionic/angular';
import { PickerOptions } from "@ionic/core";
import { UtilsService } from 'src/app/core/services/utils.service';
import { FestivalService } from 'src/app/core/services/festival.service';

@Component({
  selector: 'gestione-presenze-gruppo',
  templateUrl: 'gestione-presenze-gruppo.page.html',
  styleUrls: ['gestione-presenze-gruppo.page.scss']
})
  
export class GestionePresenzeGruppoPage {
  @ViewChild(IonContent) content: IonContent;

  attivita;
  presenze = [];
  events: any = [];
  oggi;
  today;
  percentage;
  ore = [ { text: '1', value: '1' }, { text: '2', value: '2' }, { text: '3', value: '3' }, { text: '4', value: '4' }, { text: '5', value: '5' }, { text: '6', value: '6' }, { text: '7', value: '7' }, { text: '8', value: '8' }, { text: '9', value: '9' }, { text: '10', value: '10' }, { text: '11', value: '11' }, { text: '12', value: '12' }, { text: 'Assente', value: '0' }]
  backEnabled: boolean;
  
  constructor(
    private dataService: DataService,
    private festivalService: FestivalService,
    private utilsService: UtilsService,
    private toastController: ToastController,
    private pickerController: PickerController,
    private route: ActivatedRoute,
    private router: Router) {
    this.oggi = moment().format('YYYY-MM-DD');
    this.today = moment().startOf('day');
  }

  scrollToOggi() {
    var x = document.getElementById(this.oggi); 
    if (x) {
      document.getElementById(this.oggi).scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }

  ionViewDidEnter() {
    this.scrollToOggi();
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      let paramsPassed = JSON.parse(params['data']);
      this.backEnabled = paramsPassed.back;
      let id = paramsPassed.id;
      this.utilsService.presentLoading();
      this.dataService.getAttivitaStudenteById(id).subscribe((attivita: any) => {
        this.attivita = attivita;
        this.percentage = (this.attivita.oreValidate / this.attivita.oreTotali).toFixed(1);
        this.presenze = [];
        this.events = [];
        this.dataService.getStudenteAttivitaGiornalieraCalendario(this.attivita.es.id, this.attivita.es.studenteId, this.attivita.aa.dataInizio, this.attivita.aa.dataFine/*moment().startOf('day').format('YYYY-MM-DD')*/).subscribe((resp: any) => {
          this.presenze = resp;
          this.initDays();
          for (let addedGiorno of this.presenze) {
            this.events.push(addedGiorno);
          }
          setTimeout(() => {
            this.utilsService.dismissLoading();
            this.scrollToOggi();
          }, 500);
         },
          (err: any) => {
            console.log(err);
            this.utilsService.dismissLoading();
          },
          () => {
            console.log('get attivita giornaliera calendario by id');
          });
      });
    })
  }

  initDays() {
    var startDate = moment(this.attivita.aa.dataInizio);
    var endDate = moment(this.attivita.aa.dataFine);//moment().startOf('day');
    var tot = endDate.diff(startDate, 'days');

    var now = startDate.clone();
    if (this.presenze.length < (tot + 1)) {

      while (now.diff(endDate, 'days') <= 0) {
        var eval2 = now.diff(endDate, 'days');
        var index = this.presenze.findIndex(x => x.giornata === now.format('YYYY-MM-DD'));
        if (index < 0) {
          this.presenze.push({
            "attivitaSvolta": "",
            "esperienzaSvoltaId": this.attivita.es.id,
            "giornata": moment(now).format('YYYY-MM-DD'),
            "istitutoId": this.attivita.aa.istitutoId,
            "oreSvolte": null,
            "verificata": false,
          });

        }
        now.add(1, 'days');
      }
    }

    // sort by giornata.
    this.presenze = this.presenze.sort((a, b) => {
      return moment(a.giornata).diff(moment(b.giornata));
    });

  }

  textColor(giorno) {
    if (this.isInfuture(giorno) || giorno.verificata) {
      return '#A2ADB8'
    }
    if (!this.isweekEnd(giorno) && !this.festivalService.isFestival(giorno)) {
      if (giorno.giornata == this.oggi && !giorno.verificata) {
        return '#0073E6';
      } else if (giorno.oreSvolte == null) {
        return '#FF667D';
      }
    }
    return '#5C6F82';
  }

  fontWeight(giorno) {
    if (!this.isweekEnd(giorno) && !this.isInfuture(giorno) && !this.festivalService.isFestival(giorno)) {
      if (giorno.giornata == this.oggi) {
        return 'bold';
      } else if (giorno.oreSvolte == null) {
        return 'normal';
      }
    }
    return 'normal';
  }

  bgColor(giorno) {
    if (this.isweekEnd(giorno) || this.festivalService.isFestival(giorno)) {
      return '#F0F6FC'
    }
    return 'none';
  }

  viewOre(giorno) {
    if (giorno.oreSvolte != null) {
      if (giorno.oreSvolte == 0) {
        return 'Assente';
      }
      return giorno.oreSvolte;
    } else {
      return '-'
    }
  }

  isError(giorno) {
    return (
      giorno.giornata != this.oggi
      && !this.isInfuture(giorno)
      && !this.isweekEnd(giorno)
      && !this.festivalService.isFestival(giorno)
      && (giorno.oreSvolte == null)
    )
  }
  
  isweekEnd(giorno) {
    var day = moment(giorno.giornata).day();
    return (day === 6) || (day === 0);
  }

  isInfuture(giorno) {
    var date = moment(giorno.giornata);
    return (this.today.diff(date) < 0)
  }

  async showPicker(pz) {
    if (!pz.verificata) {
      let options: PickerOptions = {
        buttons: [
          {
            text: "Annulla",
            role: 'cancel'
          },
          {
            text: 'Salva',
            handler: (picked: any) => {
              pz.oreSvolte = picked.Ore.value;
              this.savePresenze(pz);
              // console.log(pz.oreSvolte);
            }
          }
        ],
        columns: [{
          name: 'Ore',
          options: this.getColumnOptions(),
        }]
      };

      let picker = await this.pickerController.create(options);
      picker.present()
    }
  }

  getColumnOptions() {
    let options = [];
    this.ore.forEach(x => {
      options.push({ text: x.text, value: x.value });
    });
    return options;
  }

  savePresenze(pz) {
    let toBeSaved = this.prepareSaveArray(pz);
    console.log('presenze array size' + toBeSaved.length);
    this.dataService.saveAttivitaGiornaliereStudentiPresenze(toBeSaved, this.attivita.es.id).subscribe((studente: any) => {
      this.presentToast('Salvato con successo!');
    },
      (err: any) => console.log(err),
      () => console.log('save attivita giornaliera presenze'));
  }

  prepareSaveArray(pz) {
    var toBeSaved = [];
    var save = JSON.parse(JSON.stringify(pz))
    save.giornata = moment(pz.giornata, 'YYYY-MM-DD').valueOf();
    toBeSaved.push(save);
    return toBeSaved;
  }

  
  async presentToast(string) {
    const toast = await this.toastController.create({
      message: string,
      duration: 2000,
      position: 'bottom'
    })
    toast.present();
  }

}