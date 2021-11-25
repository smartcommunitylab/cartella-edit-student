import { Component, ViewChild } from '@angular/core';
import { DataService } from '../core/services/data.service'
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { IonInfiniteScroll } from '@ionic/angular';
import { UtilsService } from '../core/services/utils.service';
import * as moment from 'moment';
import 'moment/locale/it';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {

  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;
  maybeMore: boolean = true;
  totalRecords: number = 0;
  pageSize: number = 10;
  attivitaStudente;
  summary;
  percentage;
  stati = [
    { "name": "In attesa", "value": "in_attesa" },
    { "name": "In corso", "value": "in_corso" },
    { "name": "revisione", "value": "revisione" },
    { "name": "Archiviata", "value": "archiviata" }
  ];
  tipologie;
  esperienzeNoncompleta: number = 0;
  now;

  constructor(
    private dataService: DataService,
    private utilsService: UtilsService,
    private route: ActivatedRoute,
    private router: Router) { 
      this.now = moment();
    }

  ionViewWillEnter(): void {
    this.resetCounter();
    this.getAttivitaPage(1);
  }

  resetCounter() {
    this.esperienzeNoncompleta = 0;
  }

  getAttivitaPage(page: number) {
    this.utilsService.presentLoading();
    this.dataService.getAttivitaTipologie().subscribe((res) => {
      this.tipologie = res;
      this.dataService.getStudenteSummary().subscribe(resp => {
        this.summary = resp;
        this.percentage = ((this.summary.oreValidate / this.summary.oreTotali) * 100).toFixed(0);
        this.dataService.getAttivitaStudenteList(null, (page - 1), this.pageSize)
          .subscribe((response) => {
            this.attivitaStudente = response.content;
            this.updateNonCompletaState();
            if (this.attivitaStudente.length < this.pageSize) {
              this.maybeMore = false;
            }
            // this.attivitaStudente.forEach(aa => {
            //   if (this.isValutazioneActive(aa)) {
            //     this.dataService.getValutazioneAttivita(aa.esperienzaSvoltaId).subscribe((res) => {
            //       aa.valutazioneEsperienza = res;
            //     },
            //       (err: any) => {console.log(err);});
            //   }
            // });             
            // this.utilsService.dismissLoading();
            let promises = [];
            for (let aa of this.attivitaStudente) {
              if (this.isValutazioneActive(aa)) {
                promises.push(
                  this.dataService.getValutazioneAttivita(aa.esperienzaSvoltaId).toPromise().then((res) => {
                    aa.valutazioneEsperienza = res;
                  })
                );
              }
            }
            Promise.all(promises).then(values => {
              this.utilsService.dismissLoading();
            })
          },
            (err: any) => {
              console.log(err);
              this.utilsService.dismissLoading();
            }
          );
      },
        (err: any) => {
          console.log(err);
          this.utilsService.dismissLoading();
          if ((err.status == 401) || (err.status == 403)) {
            let navigationExtras: NavigationExtras = {
              queryParams: {
                errMsg: JSON.stringify(err.error.ex)
              }
            };
            this.router.navigate(['landing'], navigationExtras);
          }
        },
      );
    },
      (err: any) => {
        console.log(err);
        this.utilsService.dismissLoading();
      });
  }

  updateNonCompletaState() {
   this.attivitaStudente.forEach(element => {
     if (element.stato == 'revisione') {
       if (element.oreValidate < element.oreTotali)
         this.esperienzeNoncompleta++;
     }
   });
  }

  getStatoNome(esp) {
    if (this.stati) {
      let rtn = this.stati.find(data => data.value == esp.stato);
      if (rtn.name == 'revisione') {
        if (esp.oreValidate < esp.oreTotali) {
          return 'Non completa' 
        }
        return 'Completa';
      } else
        return rtn.name;      
    }
  }

  openDetail(attivita) {
    this.router.navigate(['../detail', attivita.esperienzaSvoltaId], { relativeTo: this.route });
  }

  getSubTitle() {
    return this.summary.oreValidate + '/' + this.summary.oreTotali + 'h';
  }

  loadData(event) {
    if (this.maybeMore) {
      setTimeout(() => {
        var start = this.attivitaStudente != null ? this.attivitaStudente.length : 0;
        event.target.complete();
        this.dataService.getAttivitaStudenteList(null, (start / this.pageSize), this.pageSize)
          .subscribe((response) => {
            if (start == 0) {
              this.attivitaStudente = [];
            }
            // App logic to determine if all data is loaded and disable the infinite scroll
            if (response.content.length < this.pageSize) {
              this.maybeMore = false;
              event.target.disabled = true;
            }
            this.attivitaStudente = this.attivitaStudente.concat(response.content);
          },
            (err: any) => console.log(err),
            () => console.log('get attivita studente'));
      }, 500);
    }
  }

  getColor(esp) {
    if (esp.stato == "in_corso") {
      return '#007A50';
    } else if (esp.stato == "in_attesa") {
      return '#7FB2E5';
    } else if (esp.stato == 'revisione') {
      if (esp.oreValidate < esp.oreTotali) {
        return '#D1344C';
      }
      return '#707070';      
    } else if (esp.stato == 'archiviata') {
      return '#707070';
    }
  }

  openPresenze(aa) {
    if (aa.rendicontazioneCorpo) {
      this.openDetail(aa);
    } else {
      this.tipologie.filter(tipo => {
        if (tipo.id == aa.tipologia) {
          aa.individuale = tipo.individuale;
        }
      });
      let params = {
        'id': aa.esperienzaSvoltaId,
        'back': true
      }
      if (aa.individuale) {
        this.router.navigate(['../../tab2/presenze/individuale', { data: JSON.stringify(params) }], { relativeTo: this.route });
      } else {
        this.router.navigate(['../../tab2/presenze/gruppo', { data: JSON.stringify(params) }], { relativeTo: this.route });
      }
    }
  }

  isValutazioneActive(aa) {
    let active = false;
    if (aa.tipologia == 7) {
      let dayBeforeFine = moment(aa.dataFine).subtract(1, "days").startOf('day');
      if (dayBeforeFine.isBefore(this.now)) {
        active = true;
      }
      return active;
    }
  }

  openValutazioneEsp(aa) {
    this.router.navigate(['../valutazione/esperiezna', aa.esperienzaSvoltaId], { relativeTo: this.route });
  }
  
  styleStatoVal(aa) {
    var style = {
      'color': '#007A50',//green
      'font-size': '14px'
    };
    if (aa.stato == 'archiviata') {
      style['color'] = '#707070'; // grey
      return style;
    } else if (aa.valutazioneEsperienza.stato == 'incompleta') {
      style['color'] = '#707070'; // grey
    } else if (aa.valutazioneEsperienza.stato == 'non_compilata') {
      style['color'] = '#F83E5A'; // red      
    }    
    return style;
  }

  setValStatus(aa) {
    let stato = 'Completata';
    if (aa.valutazioneEsperienza.stato == 'incompleta') {
      stato = 'Da completare';
    } else if (aa.valutazioneEsperienza.stato == 'non_compilata') {
      stato = 'Non compilata';
    }
    return stato;
  }

  action(aa) {
    let action = 'Compila';
    if (aa.valutazioneEsperienza.stato == 'compilata') {
      action = 'Vedi'
    }
    return action;
  }

}
