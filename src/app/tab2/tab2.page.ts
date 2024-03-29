import { Component } from '@angular/core';
import { DataService } from '../core/services/data.service'
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { AuthActions } from 'ionic-appauth';
import { NavController } from '@ionic/angular';
import * as moment from 'moment';
import 'moment/locale/it';
import { UtilsService } from '../core/services/utils.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
  
export class Tab2Page {
  studente;
  aa;
  tipologie;
  pageSize: number = 20;
  stato: string = 'in_corso';
  oggi;
  env = environment;
  baseUrl;
  constructor(
    private auth: AuthService,
    private navCtrl: NavController,
    private dataService: DataService,
    private utilsService: UtilsService,
    private route: ActivatedRoute,
    private router: Router
  ) { 
    this.oggi = moment().format('DD-MM-YYYY');
    this.baseUrl = window.location.href;
  }

  ionViewWillEnter(): void {
    this.auth.authObservable.subscribe((action) => {
      if (action.action === AuthActions.SignOutSuccess) {
        this.navCtrl.navigateRoot('landing');
      }
      this.utilsService.presentLoading();
      this.dataService.getProfile().subscribe(profile => {
        if (profile && profile.studenti && Object.keys(profile.studenti).length > 0) {
          var ids = [];
          for (var k in profile.studenti) {
            ids.push(k);
          }
          this.dataService.setStudenteId(ids[0]);
          this.dataService.getStudedente(ids[0]).subscribe(resp => {
            this.studente = resp;
            var age = moment().diff(moment(this.studente.birthdate, 'DD/MM/YYYY'), 'years');
            // logic for age above 16.
            if (age >= environment.minimumAge) {            
              // if (!profile.authorized) {
              //   this.env.showTabs = false;
              //   this.router.navigate(['../../terms', profile.authorized], { relativeTo: this.route });
              // } else {
              //   this.env.showTabs = true;
              // } 
              this.env.showTabs = true;
              this.dataService.setStudenteNome(this.studente.name);
              this.dataService.setStudenteCognome(this.studente.surname);
              this.dataService.setIstitutoId(this.studente.istitutoId);
              this.dataService.setClasse(this.studente.classroom);
              this.dataService.setStudenteEmail(this.studente.email);
              this.dataService.setStudenteTelefono(this.studente.phone);
              this.dataService.getIstitutoById(this.studente.istitutoId).subscribe(istituto => {
                this.dataService.setIstitutoName(istituto.name);
                this.dataService.getAttivitaTipologie().subscribe((res) => {
                  this.tipologie = res;
                  this.gestioneStudenteAttivita(1);
                  this.utilsService.dismissLoading();
                },
                  (err: any) => {
                    console.log(err);
                    this.utilsService.dismissLoading();
                  },
                  () => {
                    console.log('getAttivitaTipologie');
                    // this.utilsService.dismissLoading();
                  });
              }, (err: any) => {
                console.log(err);
                this.utilsService.dismissLoading();
              })          
            } else { // in case of age < 16
              this.env.showTabs = false;
              this.utilsService.dismissLoading();
              this.utilsService.presentWarningLoading("Spiacente, al momento non è permesso l'accesso al sistema a studenti minori di 16 anni");
              setTimeout(() => {
                this.auth.signOut().then(() => {
                  window.location.href = this.baseUrl; 
                });
              }, 3000);
            }
          })
        } else {
          this.utilsService.dismissLoading();
          this.router.navigate(['../../tab3'], { relativeTo: this.route });
        }
      },
        (err: any) => {
          this.env.showTabs = false;
          this.utilsService.dismissLoading();
          if ((err.status == 401) || (err.status == 403)) {
            let navigationExtras: NavigationExtras = {
              queryParams: {
                errMsg: JSON.stringify(err.error.ex)
              }
            };
            this.router.navigate(['landing'], navigationExtras);
          }
        })
    });
  }

  gestioneStudenteAttivita(page) {
    this.dataService.getAttivitaStudenteList(this.stato, page - 1, this.pageSize).subscribe(resp => {
      this.aa = resp.content;
      // filter here activity rendicontazioneCorpo
      this.aa = this.aa.filter(item => !item.rendicontazioneCorpo);
      this.aa.forEach(esp => {
        this.tipologie.filter(tipo => {
          if (tipo.id == esp.tipologia) {
            esp.individuale = tipo.individuale;
          }
        });
      });
      if (resp.totalElements < 1) {
        this.router.navigate(['../../tab3'], { relativeTo: this.route });
      } else if (resp.totalElements == 1) {
        let params = {
          'id': this.aa[0].esperienzaSvoltaId,
          'back': false
        }
        if (this.aa[0].individuale) {
          this.router.navigate(['../presenze/individuale', { data: JSON.stringify(params) }], { relativeTo: this.route });
        } else {
          this.router.navigate(['../presenze/gruppo', { data: JSON.stringify(params) }], { relativeTo: this.route });
        }
      }
    },
      (err: any) => console.log(err),
      () => console.log('getAttivitaIncorso'));
  }

  openPresenze(esp) {
    let params = {
      'id': esp.esperienzaSvoltaId,
      'back': true
    }
    if (esp.individuale) {
      this.router.navigate(['../presenze/individuale', { data: JSON.stringify(params) }], { relativeTo: this.route });
    } else {
      this.router.navigate(['../presenze/gruppo', { data: JSON.stringify(params) }], { relativeTo: this.route });
      // this.router.navigate(['../../tab3'], { relativeTo: this.route });
      }
  }

}
