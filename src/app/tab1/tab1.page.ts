import { Component } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
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
    public dataService: DataService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.baseUrl = window.location.href;
  }

  signOut() {
    this.auth.signOut().then(() => { window.location.href = this.baseUrl;});
  }

  credits() {
    this.router.navigate(['../credits'], { relativeTo: this.route });
  }

}
