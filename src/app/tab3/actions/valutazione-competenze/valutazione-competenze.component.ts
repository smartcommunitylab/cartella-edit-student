import { Component } from '@angular/core';
import { DataService } from '../../../core/services/data.service';
import { Router, ActivatedRoute } from '@angular/router';
import { UtilsService } from 'src/app/core/services/utils.service';
import { ModalController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'valutazione-competenze',
  templateUrl: './valutazione-competenze.component.html',
  styleUrls: ['./valutazione-competenze.component.scss']
})

export class ValutazioneCompetenzeComponent {
  attivita;
  aa;
  es;
  domande= []
  domanteTotale = 0;
  domandeCompilati = 0;
  valutazioni = [
    { titolo: 'Avanzato', punteggio: 4 },
    { titolo: 'Intermedio', punteggio: 3 },
    { titolo: 'Base', punteggio: 2 },
    { titolo: 'Non acquisita', punteggio: 1 },
  ];

  
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private dataService: DataService,
    private utilsService: UtilsService,
    private modalCtrl: ModalController,
    private alertController: AlertController
  ) {}

  ngAfterViewInit(): void {
    this.route.params.subscribe(params => {
      let id = params['id'];
      this.initCounter();
      this.utilsService.presentLoading();
        this.dataService.getAttivitaStudenteById(id).subscribe((attivita: any) => {
          this.attivita = attivita;
          this.aa = attivita.aa;
          this.es = attivita.es;
          this.dataService.getValutazioneCompetenze(this.es.id).subscribe((res) => {
            this.domande = res.valutazioni;
            this.domande.forEach(d=> {
              this.domanteTotale++;
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

  setValue(punteggio) {
    let titolo = '-'
    let rtn = this.valutazioni.find(data => data.punteggio == punteggio);
    if (rtn) titolo = rtn.titolo;
    return titolo;
  }

  styleValueColor(value) {
    var style = {
      'color': '#5C6F82'      
    };
    if (value == 1) {
      style['color'] = '#F83E5A'; // red   
    }
    return style;
  }

}