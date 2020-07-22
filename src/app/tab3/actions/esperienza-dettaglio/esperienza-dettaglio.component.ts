import { Component, OnInit } from '@angular/core';
import { DataService } from '../../../core/services/data.service';
import { Router, ActivatedRoute } from '@angular/router';
import * as Leaflet from 'leaflet';

@Component({
  selector: 'esperienza-dettaglio',
  templateUrl: './esperienza-dettaglio.component.html',
  styleUrls: ['./esperienza-dettaglio.component.scss']
})

export class EsperienzaDettaglioComponent implements OnInit {
  attivita;
  aa;
  es;
  map;
  oreValidate: any;
  oreTotali: any;
  tipologie;
  stati = [{ "name": "In attesa", "value": "in_attesa" }, { "name": "In corso", "value": "in_corso" }, { "name": "Revisione", "value": "revisione" }, { "name": "Archiviata", "value": "archiviata" }]; individuale: boolean;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private dataService: DataService) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      let id = params['id'];
      this.dataService.getAttivitaStudenteById(id).subscribe((attivita: any) => {
        this.attivita = attivita;
        this.aa = attivita.aa;
        this.es = attivita.es;
        this.dataService.getAttivitaDocumenti(this.es.uuid).subscribe(resp => {
          this.es.documenti = resp;
        });

        if (this.hasCoordinate()) {
          setTimeout(() => { //ensure that map div is rendered
            this.drawMap();
          }, 0);
        }

      },
        (err: any) => console.log(err),
        () => console.log('getAttivita'));
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

  uploadDocument(fileInput) {
    if (fileInput.target.files && fileInput.target.files[0]) {
      this.dataService.uploadDocumentToRisorsa(fileInput.target.files[0], this.es.uuid).subscribe((doc) => {
        this.dataService.downloadRisorsaDocumenti(this.es.uuid).subscribe((docs) => {
          this.es.documenti = docs;
        });
      });
    }
  }

  openDocument(doc) {
    this.dataService.openDocument(doc);
  }

  deleteDocumento(doc) {
    this.dataService.deleteDocument(doc.uuid).subscribe(response => {
      this.dataService.downloadRisorsaDocumenti(this.es.uuid).subscribe((docs) => {
        this.es.documenti = docs;
      });
    })
  }

}