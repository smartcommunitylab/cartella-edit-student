import { Component } from '@angular/core';
import { DataService } from '../core/services/data.service'
import { Router, ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import 'moment/locale/it';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {
  aa;
  tipologie;
  pageSize: number = 20;
  stato: string = 'in_corso';
  oggi;
  constructor(private dataService: DataService, private route: ActivatedRoute, private router: Router) {
    this.oggi = moment().format('DD-MM-YYYY');
  }

  ngOnInit(): void {
    this.dataService.getAttivitaTipologie().subscribe((res) => {
      this.tipologie = res;
      this.gestioneStudenteAttivita(1);
    },
      (err: any) => console.log(err),
      () => console.log('getAttivitaTipologie'));
  }

  gestioneStudenteAttivita(page) {
    this.dataService.getAttivitaStudenteList(this.stato, page - 1, 20).subscribe(resp => {
 
      if (resp.totalElements == 1) {
        // based on attivita type.
        this.aa = resp.content;
        this.tipologie.filter(tipo => {
          if (tipo.id == this.aa.tipologia) {
            this.aa.individuale = tipo.individuale;
          }
          if (this.aa.individuale) {
            this.router.navigateByUrl('/presenze/gruppo/' + this.aa.id);
          } else {
            this.router.navigateByUrl('/presenze/individuale/' + this.aa.id);
          }
        });
      } else {
          this.aa = resp.content;
      }
    },
      (err: any) => console.log(err),
      () => console.log('getAttivitaIncorso'));
  }

  openPresenze(esp) {
    if (esp.individuale) {
      this.router.navigate(['../presenze/individuale/', esp.esperienzaSvoltaId], { relativeTo: this.route });
    } else {
      this.router.navigate(['../presenze/gruppo/', esp.esperienzaSvoltaId], { relativeTo: this.route });
      }
  }

}
