import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { AuthActions } from 'ionic-appauth';
import { NavController } from '@ionic/angular';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { DataService } from '../core/services/data.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {
  constructor(
    private auth: AuthService,
    private navCtrl: NavController,
    private http: HttpClient,
    private dataService: DataService
  ) { }

  signOut() {
    this.auth.signOut();
  }

}
