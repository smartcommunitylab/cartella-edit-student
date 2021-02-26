import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { IAuthAction, AuthActions } from 'ionic-appauth';
import { NavController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.page.html',
  styleUrls: ['./landing.page.scss'],
})
export class LandingPage implements OnInit {
  action: IAuthAction;
  errMsg;

  constructor(
    private auth: AuthService,
    private navCtrl: NavController,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {

    this.route.queryParams.subscribe(params => {
      if (params['errMsg']) {
        let errMsg = params['errMsg'].replace(/(^'|'$)/g, '');
        errMsg = errMsg.replace(/(^"|"$)/g, '');
        this.errMsg = 'Attenzione: ' + errMsg;
      } else {
        this.auth.authObservable.subscribe((action) => {
          this.action = action;
          if (action.action === AuthActions.SignInSuccess) {
            this.navCtrl.navigateRoot('home');
          }
        });
      }
    });

  }

  signIn() {
    this.auth.signIn();
  }
}
