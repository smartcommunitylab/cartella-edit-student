
import { Component, ViewChild } from '@angular/core';
import { DataService } from '../../../core/services/data.service'
import { Router, ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import 'moment/locale/it';
import { IonContent } from '@ionic/angular';
import { FestivalService } from "../../../core/services/festival.service";
import { UtilsService } from 'src/app/core/services/utils.service';

@Component({
  selector: 'gestione-presenze-individuale',
  templateUrl: 'gestione-presenze-individuale.page.html',
  styleUrls: ['gestione-presenze-individuale.page.scss']
})
export class GestionePresenzeIndividualePage {
  @ViewChild(IonContent) content: IonContent;

  attivita;
  presenze = [];
  events: any = [];
  oggi;
  lastSavedDay;
  today;
  percentage;
  ore = [{ text: '1', value: '1' }, { text: '2', value: '2' }, { text: '3', value: '3' }, { text: '4', value: '4' }, { text: '5', value: '5' }, { text: '6', value: '6' }, { text: '7', value: '7' }, { text: '8', value: '8' }, { text: '9', value: '9' }, { text: '10', value: '10' }, { text: '11', value: '11' }, { text: '12', value: '12' }, { text: 'Assente', value: '0' }]
  backEnabled: boolean;

  constructor(
    private dataService: DataService,
    private festivalService: FestivalService,
    private utilsService: UtilsService,
    private route: ActivatedRoute,
    private router: Router) {
    this.oggi = moment().format('YYYY-MM-DD');
    this.today = moment().startOf('day');
  }

  scrollToOggi() {
    if (this.utilsService.saveMap[this.attivita.es.id]) {
      var lastSavedDay = this.utilsService.saveMap[this.attivita.es.id];
      var x = document.getElementById(lastSavedDay);
      if (x) {
        x.scrollIntoView({ behavior: 'smooth', block: 'center' });
        x.focus();
      }
    } else {
      var x = document.getElementById(this.oggi);
      if (x) {
        x.scrollIntoView({ behavior: 'smooth', block: 'center' });
        x.focus();
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
            }, 1500);
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
            this.utilsService.dismissLoading();
            console.log(err);
          },
          () => {
            console.log('get attivita student by id');
          });
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
    if (giorno.verificata || giorno.validataEnte) {
      return '#5C6F82';
    }
    if (!this.isweekEnd(giorno)
      && !this.festivalService.isFestival(giorno)
      && !this.isInfuture(giorno)) {
      if (giorno.giornata == this.oggi && !giorno.verificata) {
        return '#0073E6';
      } else if (giorno.oreSvolte == null) {
        return '#D1344C';
      }
    }
    return '#5C6F82';
  }

  validatoTextColor(giorno) {
    if (giorno.verificata || giorno.validataEnte) {
      return '#A2ADB8';
    }
  }

  border(giorno) {
    if (!this.isweekEnd(giorno)
      && !this.festivalService.isFestival(giorno)
      && !this.isInfuture(giorno)) {
      if (giorno.giornata == this.oggi && !giorno.verificata) {
        return '1px solid #0073E6';
      } else if (giorno.oreSvolte == null) {
        return '1px solid #FF9700';
      }
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

  isweekEnd(giorno) {
    var day = moment(giorno.giornata).day();
    return (day === 6) || (day === 0);
  }

  isInfuture(giorno) {
    var date = moment(giorno.giornata);
    return (this.today.diff(date) < 0)
  }

  isError(giorno) {
    return (
      giorno.giornata != this.oggi
      && !this.isInfuture(giorno)
      && !this.isweekEnd(giorno)
      && !this.festivalService.isFestival(giorno)
      && (giorno.oreSvolte == null))
  }

  input(pz) {
    if (this.isInfuture(pz) || this.attivita.aa.stato == 'archiviata') {
      return false;
    } else {
      if (!pz.verificata && !pz.validataEnte) {
        // this.router.navigate(['modifica', { data: JSON.stringify(pz) }], { relativeTo: this.route });
        this.router.navigate(['modifica', { data: pz.giornata, id: pz.esperienzaSvoltaId }], { relativeTo: this.route });
      }
    }
  }

  getColumnOptions() {
    let options = [];
    this.ore.forEach(x => {
      options.push({ text: x.text, value: x.value });
    });
    return options;
  }

  getDiarioText(giorno) {
    let text = 'inserisci diario di bordo.';
    if (giorno.attivitaSvolta != '') {
      text = giorno.attivitaSvolta;
    }
    return text;
  }

  styleDiario(giorno) {
    var style = {};
    if (giorno.attivitaSvolta == '') {
      style['font-style'] = 'italic'
    }
    return style;
  }
  

}