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
  ) { 
    
   this.domande[0] = {
      id: 1,
      competenzaTitolo: 'Valutare le caratteristiche contestuali dell’ambiente per svolgere le proprie mansioni in maniera corretta e non fuori luogo ',
      punteggio: 5,
      rispostaChiusa: true
    }

    this.domande[1] = {
      id: 2,
      competenzaTitolo: 'Valutare le caratteristiche contestuali dell’ambiente per svolgere le proprie mansioni in maniera corretta e non fuori luogo',
      punteggio: 4,
      rispostaChiusa: true
    }

    this.domande[2] = {
      id: 3,
      competenzaTitolo: 'Valutare le caratteristiche contestuali dell’ambiente per svolgere le proprie mansioni in maniera corretta e non fuori luogo',
      punteggio: 3,
      rispostaChiusa: true
    }

    this.domande[3] = {
      id: 4,
      competenzaTitolo: 'Valutare le caratteristiche contestuali dell’ambiente per svolgere le proprie mansioni in maniera corretta e non fuori luogo. Valutare le caratteristiche contestuali dell’ambiente per svolgere le proprie mansioni in maniera corretta e non fuori luogo',
      risposta: 2,
      rispostaChiusa: false
    }

    this.domande[4] = {
      id: 5,
      competenzaTitolo: 'Valutare le caratteristiche contestuali dell’ambiente per svolgere le proprie mansioni in maniera corretta e non fuori luogo',
      punteggio: 0,
      rispostaChiusa: true
    }

  }

  ngAfterViewInit(): void {

  }

  cancel() {
    this.router.navigate(['../../../'], { relativeTo: this.route });
  }

 

}