import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { IUserInfo } from '../models/user-info.model';
import { AuthActions } from 'ionic-appauth';
import { NavController } from '@ionic/angular';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { DataService } from '../core/services/data.service';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {
  userInfo: IUserInfo;
  data: any;
  studente;

  constructor(
    private auth: AuthService,
    private navCtrl: NavController,
    private http: HttpClient,
    private dataService: DataService
  ) { }

  ngOnInit() {
    this.auth.authObservable.subscribe((action) => {
      if (action.action === AuthActions.SignOutSuccess) {
        this.navCtrl.navigateRoot('landing');
      }
    });
    this.getProfile();
  }

  public getProfile() {

    this.dataService.getProfile().subscribe(profile => {
      this.userInfo = profile;
      if (profile && profile.studenti) {
          // get ids(keys of map).
          var ids = [];
          for (var k in profile.studenti) {
              ids.push(k);
        } 
        this.dataService.setStudenteId(ids[0]);
        this.dataService.getStudedente(ids[0]).subscribe(resp => { 
          this.studente = resp;
          this.dataService.setStudenteNome(this.studente.name);
          this.dataService.setStudenteCognome(this.studente.surname);
          this.dataService.setIstitutoId(this.studente.istitutoId);
          this.dataService.setClasse(this.studente.classroom);
          this.getIstitutoName(this.studente.istitutoId);
        })
        
      }
    });
  }

  getIstitutoName(id) {
    this.dataService.getIstitutoById(id).subscribe(istituto => {
        this.studente.istitutoName = istituto.name;
    })
}

}
