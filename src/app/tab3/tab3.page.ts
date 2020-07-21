import { Component, ViewChild } from '@angular/core';
import { DataService } from '../core/services/data.service'
import { Router, ActivatedRoute } from '@angular/router';
import { IonInfiniteScroll } from '@ionic/angular';
import { ToastController } from '@ionic/angular';

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
  stati = [{ "name": "In attesa", "value": "in_attesa" }, { "name": "In corso", "value": "in_corso" }, { "name": "Revisione", "value": "revisione" }, { "name": "Archiviata", "value": "archiviata" }];
  constructor(private dataService: DataService, private toastController: ToastController, private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.getAttivitaPage(1);
  }

  getAttivitaPage(page: number) {
    this.dataService.getStudenteSummary().subscribe(resp => {
      this.summary = resp;
      this.percentage = ((this.summary.oreValidate / this.summary.oreTotali) * 100).toFixed(0);
      this.dataService.getAttivitaStudenteList(null, (page - 1), this.pageSize)
        .subscribe((response) => {
          this.attivitaStudente = response.content;
        },
          (err: any) => console.log(err),
          () => console.log('get attivita studente'));
    },
      (err: any) => console.log(err),
      () => console.log('get summary studente'));

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
              this.presentToast('non ci sono piu i dati');
              event.target.disabled = true;
            }
            this.attivitaStudente = this.attivitaStudente.concat(response.content);
          },
            (err: any) => console.log(err),
            () => console.log('get attivita studente'));
      }, 500);
    }
  }

  async presentToast(string) {
    const toast = await this.toastController.create({
      message: string,
      duration: 2000,
      position: 'bottom'
    })
    toast.present();
  }

  getColor(esp) {
    if (esp.stato == "in_corso") {
      return '#00CF86';
    } else if (esp.stato == "in_attesa") {
      return '#7FB2E5';
    } else if (esp.stato == 'revisione') {
      return '#F83E5A';
    } else if (esp.stato == 'archiviata') {
      return '#A2ADB8';
    }
  }

}
