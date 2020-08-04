import { Component, ViewChild } from '@angular/core';
import { DataService } from '../../../core/services/data.service'
import { Router, ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import 'moment/locale/it';
import { PickerController, IonContent } from '@ionic/angular';
import { PickerOptions } from "@ionic/core";

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
  
  constructor(private dataService: DataService, private pickerController: PickerController, private route: ActivatedRoute, private router: Router) {
    this.oggi = moment().format('YYYY-MM-DD');
    this.today = moment().startOf('day');
  }

  
  ngOnInit(): void {
    this.route.params.subscribe(params => {
      let paramsPassed = JSON.parse(params['data']);
      this.backEnabled = paramsPassed.back;
      let id = paramsPassed.id;
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
         },
          (err: any) => console.log(err),
          () => console.log('get attivita giornaliera calendario by id'));
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

  
  async showPicker(pz) {
    if (!pz.verificata) {
      let options: PickerOptions = {
        buttons: [
          {
            text: "Annulla",
            role: 'cancel'
          },
          {
            text: 'Ok',
            handler: (picked: any) => {
              pz.oreSvolte = picked.Ore.value;
              console.log(pz.oreSvolte);
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

  

}
