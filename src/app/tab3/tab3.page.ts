import { Component, ViewChild } from '@angular/core';
import { DataService } from '../core/services/data.service'
import { Router, ActivatedRoute } from '@angular/router';
import { IonInfiniteScroll } from '@ionic/angular';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {

  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;

  filtro;
  totalRecords: number = 0;
  pageSize: number = 10;
  attivitaStudente;
  stati = [ {"name": "In attesa", "value": "in_attesa"}, { "name": "In corso", "value": "in_corso" }, { "name": "Revisionare", "value": "revisione" }, {"name": "Archiviata", "value": "archiviata"}];
  constructor(private dataService: DataService, private route: ActivatedRoute, private router: Router) {

  }

  ngOnInit(): void {
    this.getAttivitaPage(1);
  }
  getAttivitaPage(page: number) {
    // this.filtro.page = page;
    this.dataService.getAttivitaStudenteList((page - 1), 20, this.dataService.studenteId, this.filtro)
      .subscribe((response) => {
        this.totalRecords = response.totalElements;
        this.attivitaStudente = response.content;
      }
        ,
        (err: any) => console.log(err),
        () => console.log('get attivita studente'));
  }

  getStatoNome(statoValue) {
    if (this.stati) {
        let rtn = this.stati.find(data => data.value == statoValue);
        if (rtn) return rtn.name;
        return statoValue;
    }
  }
  
  openDetail(attivita) {
    this.router.navigate(['../detail', attivita.esperienzaSvoltaId], { relativeTo: this.route });
  }

  loadData(event) {
    setTimeout(() => {
      console.log('Done');
      event.target.complete();

      // App logic to determine if all data is loaded and disable the infinite scroll
      // if (data.length == 1000) { 
        // event.target.disabled = true;
      // }
    }, 500);
  }

}
