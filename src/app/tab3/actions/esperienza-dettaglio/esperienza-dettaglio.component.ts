import { Component } from '@angular/core';
import { DataService } from '../../../core/services/data.service';
import { Router, ActivatedRoute } from '@angular/router';
import * as Leaflet from 'leaflet';
import { UtilsService } from 'src/app/core/services/utils.service';
import { ModalController } from '@ionic/angular';
import { DocumentUploadModalComponent } from '../documento-upload-modal/document-upload-modal.component';
import { AlertController } from '@ionic/angular';
import * as moment from 'moment';
import 'moment/locale/it';

@Component({
  selector: 'esperienza-dettaglio',
  templateUrl: './esperienza-dettaglio.component.html',
  styleUrls: ['./esperienza-dettaglio.component.scss']
})

export class EsperienzaDettaglioComponent {
  attivita;
  aa;
  es;
  map;
  oreValidate: any;
  oreTotali: any;
  tipologie;
  stati = [{ "name": "In attesa", "value": "in_attesa" }, { "name": "In corso", "value": "in_corso" }, { "name": "Giorni non compilati", "value": "revisione" }, { "name": "Archiviata", "value": "archiviata" }];
  tipiDoc = [{ "name": "Piano formativo", "value": "piano_formativo" }, { "name": "Convenzione", "value": "convenzione" }, { "name": "Valutazione studente", "value": "valutazione_studente" }, { "name": "Valutazione esperienza", "value": "valutazione_esperienza" }, { "name": "Altro", "value": "doc_generico" }, { "name": "Pregresso", "Altro": "pregresso" }];
  removableDoc = ["valutazione_esperienza", "doc_generico"];
  individuale: boolean;
  now;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private dataService: DataService,
    private utilsService: UtilsService,
    private modalCtrl: ModalController,
    private alertController: AlertController
  ) {
    this.now = moment();
  }

  ngAfterViewInit(): void {
    this.route.params.subscribe(params => {
      let id = params['id'];
      this.utilsService.presentLoading();
      this.dataService.getAttivitaTipologie().subscribe((res) => {
        this.tipologie = res;
        this.dataService.getAttivitaStudenteById(id).subscribe((attivita: any) => {
          this.attivita = attivita;
          this.aa = attivita.aa;
          this.es = attivita.es;
          if (this.hasCoordinate()) {
            setTimeout(() => { //ensure that map div is rendered
              this.drawMap();
            }, 0);}
          this.dataService.getAttivitaDocumenti(this.es.uuid).subscribe(resp => {
            this.es.documenti = resp;
            if (this.isValutazioneActive()) {
              this.dataService.getValutazioneAttivita(this.es.id).subscribe((res) => {
                this.es.valutazioneEsperienza = res;
                this.dataService.getValutazioneCompetenze(this.es.id).subscribe((res) => {
                  this.es.valutazioneCompetenze = res;
                  this.utilsService.dismissLoading(); 
                },
                  (err: any) => {
                    this.utilsService.dismissLoading();
                    console.log(err);
                  })
              },
                (err: any) => {
                  this.utilsService.dismissLoading();
                  console.log(err);
                });
            } else {
              this.utilsService.dismissLoading();             
            }
          },
            (err: any) => {
              console.log(err);
              this.utilsService.dismissLoading();
            },
            () => {
              console.log('getAttivitaDocumenti');
            });
        },
          (err: any) => {
            console.log(err);
            this.utilsService.dismissLoading();
          },
          () => {
            console.log('getAttivitaStudente');
          });
      },
        (err: any) => {
          console.log(err);
          this.utilsService.dismissLoading();
        },
        () => {
          console.log('getAttivitaTipologie');
        });
    });
  }

  openDetail(attivita) {
    this.router.navigate([attivita.id], { relativeTo: this.route });
  }

  getTipologia(tipologiaId) {
    if (this.tipologie) {
      return this.tipologie.find(data => data.id == tipologiaId);
    } else {
      return tipologiaId;
    }
  }

  getStatoNome(statoValue) {
    if (this.stati) {
      let rtn = this.stati.find(data => data.value == statoValue);
      if (rtn) return rtn.name;
      return statoValue;
    }
  }

  getSubTitle() {
    return this.oreValidate + '/' + this.oreTotali + 'h';
  }

  drawMap(): void {
    if (this.map) {
      this.map.remove();
    }
    this.map = Leaflet.map('map');
    Leaflet.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
      maxZoom: 18
    }).addTo(this.map);

    if (this.aa.latitude && this.aa.longitude) {
      let selectedLocationMarker = Leaflet.marker([this.aa.latitude, this.aa.longitude]).addTo(this.map);
      this.map.setView(selectedLocationMarker.getLatLng(), 14);
    }
  }

  hasCoordinate(): boolean {
    return (this.aa.latitude && this.aa.longitude);
  }

  getColor(esp) {
    if (esp.stato == "in_corso") {
      return '#007A50';
    } else if (esp.stato == "in_attesa") {
      return '#7FB2E5';
    } else if (esp.stato == 'revisione') {
      return '#F83E5A';
    } else if (esp.stato == 'archiviata') {
      return '#A2ADB8';
    }
  }

  openPresenze(aa, esp) {
    this.tipologie.filter(tipo => {
      if (tipo.id == aa.tipologia) {
        aa.individuale = tipo.individuale;
      }
    });
    let params = {
      'id': esp.id,
      'back': true
    }
    if (aa.individuale) {
      this.router.navigate(['../../../tab2/presenze/individuale', { data: JSON.stringify(params) }], { relativeTo: this.route });
    } else {
      this.router.navigate(['../../../tab2/presenze/gruppo', { data: JSON.stringify(params) }], { relativeTo: this.route });
    }
  }

  async openDocumentUpload() {
    const modal = await this.modalCtrl.create({
      component: DocumentUploadModalComponent,
      componentProps: {
        tipologiaId : this.aa.tipologia
      }
      // cssClass: 'my-custom-modal-css'
    });
    modal.lastElementChild.setAttribute('aria-label', 'documento upload modal');
    modal.lastElementChild.setAttribute('role', 'none');
    modal.onWillDismiss().then(dataReturned => {
      console.log('Receive: ', dataReturned);
      if (dataReturned.data) {
        this.utilsService.presentLoading();
        this.dataService.uploadDocumentToRisorsa(dataReturned.data, this.es.uuid + '').subscribe((doc) => {
          this.utilsService.dismissLoading();
          this.dataService.getAttivitaDocumenti(this.es.uuid).subscribe(resp => {
            this.utilsService.presentSuccessLoading('Salvataggio effettuato con successo!');
            this.es.documenti = resp;
          });
        },
          (err: any) => {
            console.log(err);
            this.utilsService.dismissLoading();
          });
      }
    });
    return await modal.present();
  }

  setDocType(type) {
    if (this.tipiDoc) {
      let rtn = this.tipiDoc.find(data => data.value == type);
      if (rtn) return rtn.name;
      return type;
    }
  }

  openDocument(doc) {
    this.dataService.openDocument(doc);
  }

  deleteDocumento(doc) {
    this.utilsService.presentLoading();
    this.dataService.deleteDocument(doc.uuid).subscribe(response => {
      this.utilsService.dismissLoading();
      this.dataService.downloadRisorsaDocumenti(this.es.uuid).subscribe((docs) => {
        this.es.documenti = docs;
      });
    },
      (err: any) => {
        this.utilsService.dismissLoading();
        this.handleError(err);        
      })
  }

  isValutazioneActive() {
    let active = false;
    if (this.aa.tipologia == 7) {
      let dayBeforeFine = moment(this.aa.dataFine).subtract(1, "days").startOf('day');
      if (dayBeforeFine.isBefore(this.now)) {
        active = true;
      }
      return active;
    }
  }

  handleError(error) {
    let errMsg = "Errore del server!";
    if (error.error) {
      if (error.error.message) {
        errMsg = error.error.message;
      } else if (error.error.ex) {
        errMsg = error.error.ex;
      } else if (typeof error.error === "string") {
        try {
          let errore = JSON.parse(error.error);
          if (errore.ex) {
            errMsg = errore.ex;
          }
        }
        catch (e) {
          console.error('server error:', errMsg);
        }
      }
    }
    this.utilsService.presentErrorLoading(errMsg);
  }

  async showDeleteConfirmationAlert(doc) {
    const alert = await this.alertController.create({
      header: 'Cancella documento',
      message: 'Sei sicuro di voler cancellare il documento?',
      cssClass: 'my-custom-class',
      buttons: [
        {
          text: 'Annulla',
          role: 'cancel',
          handler: () => {
            console.log('Confirm Cancel');
          }
        },
        {
          text: 'Cancella',
          cssClass: 'secondary',
          handler: () => {
            this.deleteDocumento(doc);
          }
        }
      ]
    });

    await alert.present();
  }

  isRemovable(doc) {
    let removable = false;
    if (this.removableDoc.indexOf(doc.tipo) > -1 && this.attivita.aa.stato != 'archiviata') {
      removable = true;
    }
    return removable;
  }

  openValutazioneEsp(es) {
    this.router.navigate(['../../valutazione/esperiezna', es.id], { relativeTo: this.route });
  }

  openValutazioneCompetenze(es) {
    this.router.navigate(['../../valutazione/competenze', es.id], { relativeTo: this.route });
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