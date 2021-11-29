import { Component } from '@angular/core';
import { DataService } from '../../../core/services/data.service';
import { Router, ActivatedRoute } from '@angular/router';
import { UtilsService } from 'src/app/core/services/utils.service';
import { ModalController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'valutazione-studente',
  templateUrl: './valutazione-studente.component.html',
  styleUrls: ['./valutazione-studente.component.scss']
})

export class ValutazioneStudenteComponent {
  attivita;
  aa;
  es;
  domande= []
  valutazione = [
    { titolo: 'Moltissimo', punteggio: 5 }, 
    { titolo: 'Molto', punteggio: 4 }, 
    { titolo: 'Abbastanza', punteggio: 3 }, 
    { titolo: 'Poco', punteggio: 2 }, 
    { titolo: 'Per nulla', punteggio: 1 }
  ];
  lastScrollTop = 130;
  buttonShow:boolean;
  domanteTotale = 0;
  domandeCompilati = 0;
  
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private dataService: DataService,
    private utilsService: UtilsService,
    private modalCtrl: ModalController,
    private alertController: AlertController
  ) { }

  ngAfterViewInit(): void {
    this.route.params.subscribe(params => {
      let id = params['id'];
      this.initCounter();
      this.utilsService.presentLoading();
        this.dataService.getAttivitaStudenteById(id).subscribe((attivita: any) => {
          this.attivita = attivita;
          this.aa = attivita.aa;
          this.es = attivita.es;
          this.dataService.getValutazioneAttivita(this.es.id).subscribe((res) => {
            this.domande = res.valutazioni;
            this.domande.forEach(d=> {
              if (d.rispostaChiusa) {
                this.domanteTotale++;
              }
              if (d.punteggio > 0) {
                this.domandeCompilati++;
              }
            })
            this.utilsService.dismissLoading();
          },
          (err: any) => {
            console.log(err);
            this.utilsService.dismissLoading();
          })
        },
          (err: any) => {
            console.log(err);
            this.utilsService.dismissLoading();
          });        
    });
  }

  initCounter() {
    this.domanteTotale = 0;
    this.domandeCompilati = 0;
  }
  
  cancel() {
    this.router.navigate(['../../../'], { relativeTo: this.route });
  }

  save() {
    this.domande = this.prepareSaveArray(this.domande);
    this.dataService.saveValutazioneEsperienza(this.domande, this.es.id).subscribe((res) => {
      this.utilsService.presentSuccessLoading('Salvataggio effettuato con successo!');
    });
  }

  prepareSaveArray(arr) {
    arr.forEach(element => {
      delete element['ultimaModifica'];
    });
    return arr;
  }

  onScroll(event) {
    this.buttonShow = this.lastScrollTop < event.detail.scrollTop;
  };

  checkLimit() {
    var limit = 5;
    const element = event.target as HTMLInputElement;
    const value = element.value;
    if (value.length <= limit) {
      element.value = value;
    } else {
      this.utilsService.presentWarningLoading('Il limite per il numero massimo di caratteri è 250');
      element.value = value.substr(0, limit-1);
    }
  }

  styleReport() {
    var style = {
      'color': '#707070',
      'font-size': '14px'
    };
    if (this.domandeCompilati == this.domanteTotale && this.domandeCompilati > 0) {
      style['color'] = '#007A50'; // green
    }
    return style;
  }

}