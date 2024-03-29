import { Component } from '@angular/core';
import { DataService } from '../../../core/services/data.service'
import { ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import 'moment/locale/it';
import { AlertController, PickerController } from '@ionic/angular';
import { PickerOptions } from "@ionic/core";
import { FestivalService } from 'src/app/core/services/festival.service';
import { environment } from '../../../../environments/environment';
import { UtilsService } from 'src/app/core/services/utils.service';

@Component({
  selector: 'gestione-presenze-individuale-input',
  templateUrl: 'gestione-presenze-individuale-input.page.html',
  styleUrls: ['gestione-presenze-individuale-input.page.scss']
})
export class GestionePresenzeIndividualeInputPage {
 
  attivita;
  giorno;
  events: any = [];
  oggi;
  today;
  percentage;
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
  env = environment;
  picker;
  data;

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


  ngAfterViewInit(): void {
    this.route.params.subscribe(params => {
      this.data = params['data'];
      let id = params['id'];      
      this.dataService.getAttivitaStudenteById(id).subscribe((attivita: any) => {
        this.attivita = attivita;
        this.percentage = (this.attivita.oreValidate / this.attivita.oreTotali).toFixed(1);
        this.dataService.getStudenteAttivitaGiornalieraCalendario(this.attivita.es.id, this.attivita.es.studenteId, this.data, this.data).subscribe((resp: any) => {
          this.giorno = resp[0];
          if (!this.giorno) {
            this.giorno = {
              "attivitaSvolta": "",
              "esperienzaSvoltaId": this.attivita.es.id,
              "giornata": this.data,
              "istitutoId": this.attivita.aa.istitutoId,
              "oreSvolte": null,
              "verificata": false,
            }
          }
        },
          (err: any) => {
            this.utilsService.dismissLoading();
            console.log(err);
          },
          () => {
            console.log('get attivita giornaliera calendario by id');
          });
      });
    })
  }


  textColor(giorno) {
    if (!this.isweekEnd(giorno)
      && !this.festivalService.isFestival(giorno)) {
      if (giorno.giornata == this.oggi && !giorno.verificata) {
        return '#0073E6';
      } else if (giorno.oreSvolte == null) {
        return '#FF667D';
      }
      return '#5C6F82';
    }
  }

  border(giorno) {
    if (!this.isweekEnd(giorno) && !this.festivalService.isFestival(giorno)) {
      if (giorno.giornata != this.oggi && !giorno.verificata && (giorno.attivitaSvolte == null && giorno.oreSvolte == null)) {
        return '1px solid #FF667D';
      }
    }    
    return '1px solid #5C6F82';    
  }

  fontWeight(giorno) {
      if (giorno.giornata == this.oggi) {
        return 'bold';
      } else if (giorno.oreSvolte == null) {
        return 'normal';
      }    
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
    return (!this.isweekEnd(giorno) && !this.festivalService.isFestival(giorno) && giorno.giornata != this.oggi && (giorno.oreSvolte == null))
  }

  isweekEnd(giorno) {
    var day = moment(giorno.giornata).day();
    return (day === 6) || (day === 0);
  }

  async showPickerOre(pz) {
    if (!pz.verificata) {
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

  async showPickerModalita(pz) {
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
    }
  }


  // ionViewWillLeave() {
  //   if (this.picker) {
  //     this.picker.dismiss();
  //   }
  // }

  // getColumnOptionsOre() {
  //   let options = [];
  //   this.ore.forEach(x => {
  //     options.push({ text: x.label, value: x.value });
  //   });
  //   return options;
  // }

  // getColumnOptionsModalita() {
  //   let options = [];
  //   options.push(
  //     { text: 'Presenza', value: 'presenza' },
  //     { text: 'Remoto', value: 'remoto' }
  //   );
  //   return options;
  // }

  savePresenze(pz) {
    let toBeSaved = this.prepareSaveArray(pz);
    console.log('presenze singolo array size ' + toBeSaved.length);
    this.dataService.saveAttivitaGiornaliereStudentiPresenze(toBeSaved, this.giorno.esperienzaSvoltaId).subscribe((studente: any) => {
      this.utilsService.presentSuccessLoading('Salvataggio effettuato con successo!');
      this.utilsService.lastSaved(this.giorno.esperienzaSvoltaId, pz.giornata);
      this.dataService.getStudenteAttivitaGiornalieraCalendario(this.attivita.es.id, this.attivita.es.studenteId, this.data, this.data).subscribe((resp: any) => {
        this.giorno = resp[0];
        if (!this.giorno) {
          this.giorno = {
            "attivitaSvolta": "",
            "esperienzaSvoltaId": this.attivita.es.id,
            "giornata": this.data,
            "istitutoId": this.attivita.aa.istitutoId,
            "oreSvolte": null,
            "verificata": false,
          }
        }
      },
        (err: any) => {
          this.utilsService.dismissLoading();
          console.log(err);
        },
        () => {
          console.log('get attivita giornaliera calendario by id');
        });
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

  onFocus() {
    this.env.showTabs = false;
  }

  onBlur() {
    this.env.showTabs = true;
  }

  checkLimit() {
    var limit = 250;
    const element = event.target as HTMLInputElement;
    const value = element.value;
    if (value.length <= limit) {
      element.value = value;
    } else {
      this.utilsService.presentWarningLoading('Il limite per il numero massimo di caratteri è 250');
      element.value = value.substr(0, limit-1);
    }
  }

}
