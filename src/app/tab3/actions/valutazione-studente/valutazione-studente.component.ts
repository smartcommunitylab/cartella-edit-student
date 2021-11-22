import { Component } from '@angular/core';
import { DataService } from '../../../core/services/data.service';
import { Router, ActivatedRoute } from '@angular/router';
import { UtilsService } from 'src/app/core/services/utils.service';

@Component({
  selector: 'valutazione-studente',
  templateUrl: './valutazione-studente.component.html',
  styleUrls: ['./valutazione-studente.component.scss']
})

export class ValutazioneStudenteComponent {
  attivita;
  aa;
  es;
  valutazione = [
    { titolo: 'Moltissimo', punteggio: 5 }, 
    { titolo: 'Molto', punteggio: 4 }, 
    { titolo: 'Abbastanze', punteggio: 3 }, 
    { titolo: 'Poco', punteggio: 2 }, 
    { titolo: 'Per nulla', punteggio: 1 }
  ];
  domande;  
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private dataService: DataService,
    private utilsService: UtilsService,
   ) { 
    
    // this.domande[0] = {
    //   id: 1,
    //   nome: 'Valutare le caratteristiche contestuali dell’ambiente per svolgere le proprie mansioni in maniera corretta e non fuori luogo ',
    //   punteggio: '5',
    //   rispostaChiusa: true
    // }

    // this.domande[1] = {
    //   id: 2,
    //   nome: 'Valutare le caratteristiche contestuali dell’ambiente per svolgere le proprie mansioni in maniera corretta e non fuori luogo',
    //   punteggio: '4',
    //   rispostaChiusa: true
    // }

    // this.domande[2] = {
    //   id: 3,
    //   nome: 'Valutare le caratteristiche contestuali dell’ambiente per svolgere le proprie mansioni in maniera corretta e non fuori luogo',
    //   punteggio: '3',
    //   rispostaChiusa: true
    // }

    // this.domande[3] = {
    //   id: 4,
    //   nome: 'Valutare le caratteristiche contestuali dell’ambiente per svolgere le proprie mansioni in maniera corretta e non fuori luogo. Valutare le caratteristiche contestuali dell’ambiente per svolgere le proprie mansioni in maniera corretta e non fuori luogo',
    //   risposta: '2',
    //   rispostaChiusa: false
    // }

    // this.domande[4] = {
    //   id: 5,
    //   nome: 'Valutare le caratteristiche contestuali dell’ambiente per svolgere le proprie mansioni in maniera corretta e non fuori luogo',
    //   punteggio: '0',
    //   rispostaChiusa: true
    // }

  }

  ngAfterViewInit(): void {
    this.route.params.subscribe(params => {
      let id = params['id'];
      this.utilsService.presentLoading();
        this.dataService.getAttivitaStudenteById(id).subscribe((attivita: any) => {
          this.attivita = attivita;
          this.aa = attivita.aa;
          this.es = attivita.es;

        },
          (err: any) => {
            console.log(err);
            this.utilsService.dismissLoading();
          });        
    });
  }

  cancel() {
    this.router.navigate(['../../../'], { relativeTo: this.route });
  }

  save() {
    console.log('');
    this.domande = this.prepareSaveArray(this.domande);
  }

  prepareSaveArray(arr) {
    arr.forEach(element => {
      delete element['ultimaModifica'];
    });
    return arr;
  }
 
 
}