import { Component, ViewEncapsulation} from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { DataService } from '../core/services/data.service';
import { UtilsService } from '../core/services/utils.service';
import { AuthService } from '../auth/auth.service';

@Component({
    selector: 'terms-component',
    templateUrl: './terms-component.html',
    styleUrls: ['./terms-component.scss'],
    encapsulation: ViewEncapsulation.None,
})

export class TermsComponent {
   
    termsFile: any;
    accepted: Boolean = false;
    baseUrl;
  
    constructor(
        private route: ActivatedRoute,
        private router: Router,
        public dataService: DataService,
        private utilsService: UtilsService,
        private auth: AuthService,
        private http: HttpClient) {
            
        this.baseUrl = window.location.href;
        // load html file.
        var url = 'assets/terms/terms.html';
        this.http.get(url, {responseType: 'text'} ).subscribe(data => {
            this.termsFile = data;
         });
        // set flag (to show accept refuse button)
        this.route.params.subscribe((params: Params) => {
            if (params['authorized'] == 'true') {
                this.accepted = true;
            }        
        });
    }

    goToMainPage = function () {
        this.router.navigate(['../../tab2'], { relativeTo: this.route });
    }

    acceptPrivacy = function () {
        this.dataService.addConsent().subscribe(consenso => {
            this.accepted = consenso.authorized;
            this.goToMainPage();
        }
        )
    };

    refusePrivacy = function () {
        this.utilsService.presentWarningLoading('Termini rifiutati.');
        setTimeout(() => {
            this.auth.signOut().then(() => { window.location.href = this.baseUrl; });
        }, 2000);
    };

}
