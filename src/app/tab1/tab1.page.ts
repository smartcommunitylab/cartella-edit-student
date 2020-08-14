import { Component } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { NavController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { DataService } from '../core/services/data.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {
  baseUrl;
  constructor(
    private auth: AuthService,
     public dataService: DataService
  ) {
    this.baseUrl = window.location.href;
  }

  signOut() {
    this.auth.signOut().then(() => { window.location.href = this.baseUrl;});
  }

}
