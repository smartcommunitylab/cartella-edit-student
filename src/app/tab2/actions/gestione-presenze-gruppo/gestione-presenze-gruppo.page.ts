import { Component, ViewChild } from '@angular/core';
import { DataService } from '../../../core/services/data.service'
import { ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import 'moment/locale/it';
import { PickerController, IonContent, AlertController } from '@ionic/angular';
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
  backEnabled: boolean;
  picker;
  id;
  
  ore: any[] = [ 
    { label: '-', value: '-1', type: 'radio', checked: true },
    { label: 'Assente', value: '0', type: 'radio', checked: false },
    { label: '1', value: '1', type: 'radio', checked: false },
    { label: '2', value: '2', type: 'radio', checked: false },
    { label: '3', value: '3', type: 'radio', checked: false },
    { label: '4', value: '4', type: 'radio', checked: false },
    { label: '5', value: '5', type: 'radio', checked: false },
    { label: '6', value: '6', type: 'radio', checked: false },
    { label: '7', value: '7', type: 'radio', checked: false },
    { label: '8', value: '8', type: 'radio', checked: false },
    { label: '9', value: '9', type: 'radio', checked: false },
    { label: '10', value: '10', type: 'radio', checked: false },
    { label: '11', value: '11', type: 'radio', checked: false },
    { label: '12', value: '12', type: 'radio', checked: false }
   ]

  constructor(
    private dataService: DataService,
    private festivalService: FestivalService,
    private utilsService: UtilsService,
    private pickerController: PickerController,
    private alertController: AlertController,
    private route: ActivatedRoute) {
    this.oggi = moment().format('YYYY-MM-DD');
    this.today = moment().startOf('day');
  }

  scrollToOggi() {
    if (this.utilsService.saveMap[this.attivita.es.id]) {
      var lastSavedDay = this.utilsService.saveMap[this.attivita.es.id];
      var x = document.getElementById(lastSavedDay);  
      if (x) {
        document.getElementById(lastSavedDay).scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    } else {
      var x = document.getElementById(this.oggi);  
      if (x) {
        document.getElementById(this.oggi).scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }
  
  ionViewDidEnter() {
    this.scrollToOggi();
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['data']) {
        let paramsPassed = JSON.parse(params['data']);
        this.backEnabled = paramsPassed.back;
        this.id = paramsPassed.id;
        this.initPresenze();
      }     
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
    if (this.isInfuture(giorno) || giorno.verificata || giorno.validataEnte) {
      return '#707070'
    }
    if (!this.isweekEnd(giorno) && !this.festivalService.isFestival(giorno)) {
      if (giorno.giornata == this.oggi && !giorno.verificata && !giorno.validataEnte) {
        return '#0066CC';
      } else if (giorno.oreSvolte == null) {
        return '#D1344C';
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

  viewModalita(giorno) {
    if (giorno.smartWorking != null) {
      if (giorno.smartWorking) {
        return 'Remoto';
      } else {
        return 'Presenza';
      }      
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

  async showPickerOre(pz) {
    if (this.isInfuture(pz) || pz.verificata || pz.validataEnte || this.attivita.aa.stato=='archiviata') {
      return false;
    } else {
      if (!pz.verificata && !pz.validataEnte) {
        const alert = await this.alertController.create({
          cssClass: 'my-custom-class',
          header: 'Inserisci ore svolte',
          inputs: this.ore,
          buttons: [
            {
              text: 'Salva',
              cssClass: 'primary expanded camelcase',
              handler: (selected) => {
                pz.oreSvolte = selected;
                this.savePresenze(pz);
              }
            },
            {
              text: 'Annulla',
              role: 'cancel',
              cssClass: 'secondary camelcase',
              handler: () => {
                console.log('Confirm Cancel');
              }
            }
          ]
        });
        await alert.present();
      }
    }
  }

  async showPickerModalita(pz) {
    if (this.isInfuture(pz) || pz.verificata || pz.validataEnte || this.attivita.aa.stato=='archiviata') {
      return false;
    } else {
      if (!pz.verificata && !pz.validataEnte) {
        const alert = await this.alertController.create({
          cssClass: 'my-custom-class',
          header: 'Seleziona modalità',
          inputs: [ 
            { label: 'Presenza', value: 'presenza', type: 'radio', checked: true },
            { label: 'Remoto', value: 'remoto', type: 'radio', checked: false },
          ],
          buttons: [
            {
              text: 'Salva',
              cssClass: 'primary camelcase',
              handler: (selected) => {
                if (selected == 'remoto') {
                  pz.smartWorking = true; 
                } else {
                  pz.smartWorking = false;
                }
                this.savePresenze(pz);
              }
            },
            {
              text: 'Annulla',
              role: 'cancel',
              cssClass: 'secondary camelcase',
              handler: () => {
                console.log('Confirm Cancel');
              }
            }
          ]
        });
        await alert.present();
        // let options: PickerOptions = {
        //   buttons: [
        //     {
        //       text: "Annulla",
        //       role: 'cancel'
        //     },
        //     {
        //       text: 'Salva',
        //       handler: (picked: any) => {
        //         if (picked.Modalità.value == 'remoto') {
        //           pz.smartWorking = true; 
        //         } else {
        //           pz.smartWorking = false;
        //         }
        //         this.savePresenze(pz);
        //       }
        //     }
        //   ],
        //   columns: [{
        //     name: 'Modalità',
        //     options: this.getColumnOptionsModalita(),
        //   }]
        // };
  
        // this.picker = await this.pickerController.create(options);
        // this.picker.present();
      }
    }    
  }

  ionViewWillLeave() {
    if (this.picker) {
      this.picker.dismiss();
    }
  }

  getColumnOptionsOre() {
    let options = [];
    this.ore.forEach(x => {
      options.push({ text: x.text, value: x.value });
    });
    return options;
  }

  getColumnOptionsModalita() {
    let options = [];
    options.push(
      { text: 'Presenza', value: 'presenza' },
      { text: 'Remoto', value: 'remoto' }
    );
    return options;
  }

  savePresenze(pz) {
    let toBeSaved = this.prepareSaveArray(pz);
    console.log('presenze gruppo array size ' + toBeSaved.length);
    this.dataService.saveAttivitaGiornaliereStudentiPresenze(toBeSaved, this.attivita.es.id).subscribe((studente: any) => {
      this.utilsService.lastSaved(this.attivita.es.id, pz.giornata);
      this.initPresenze();
    },
      (err: any) => {
        console.log(err);
        if (err.error.ex) {
          this.utilsService.presentErrorLoading(err.error.ex);
        } else {
          this.utilsService.presentErrorLoading('Errore');
        }        
      },
      () => console.log('save attivita giornaliera presenze'));
  }

  prepareSaveArray(pz) {
    var toBeSaved = [];
    console.log(JSON.stringify(pz));
    var save = JSON.parse(JSON.stringify(pz))
    save.giornata = moment(pz.giornata, 'YYYY-MM-DD').valueOf();
    toBeSaved.push(save);
    return toBeSaved;
  }

  initPresenze() {
    this.utilsService.presentLoading();
    this.dataService.getAttivitaStudenteById(this.id).subscribe((attivita: any) => {
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
  }

}