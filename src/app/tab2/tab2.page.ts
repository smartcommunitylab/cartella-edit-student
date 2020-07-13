import { Component, ViewChild } from '@angular/core';
import { DataService } from '../core/services/data.service'
import { Router, ActivatedRoute } from '@angular/router';
import { IonInfiniteScroll } from '@ionic/angular';
import * as moment from 'moment';
moment['locale']('it');

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {

  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;
  
  presenze = [];
  viewDate: Date; //set this date to starting point of period.
  viewEndDate: Date;
  constructor(private dataService: DataService, private route: ActivatedRoute, private router: Router) {}
  
  ngOnInit(): void {
    this.getAttivitaDetails();
  }
  getAttivitaDetails() {
    let id = 231;
    this.viewDate = new Date('2020-04-22');
    this.viewEndDate = new Date('2020-04-29');
    this.dataService.getStudenteAttivitaGiornalieraCalendario(id, this.dataService.studenteId, moment(this.viewDate).format('YYYY-MM-DD'), moment(this.viewEndDate).format('YYYY-MM-DD')).subscribe((resp: any) => {
      this.presenze = resp;
      }
        ,
        (err: any) => console.log(err),
        () => console.log('get attivita studente'));
  }

  
}
