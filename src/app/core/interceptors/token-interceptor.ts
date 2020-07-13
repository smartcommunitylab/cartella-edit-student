import { Injectable } from '@angular/core';
import {
    HttpRequest,
    HttpHandler,
    HttpEvent,
    HttpInterceptor,
    HttpErrorResponse,
    HttpResponse
} from '@angular/common/http';
import { from, Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { NavController } from '@ionic/angular';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
    urlsToNotUse: string[];
    constructor(public authService: AuthService, private navCtrl: NavController,
        private router: Router) {
            this.urlsToNotUse= [
                // 'myController1/myAction1/.+',
                // 'myController1/myAction2/.+',
                // 'myController1/myAction3'
              ];
         }
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // intercept only dataservice API.
        if (this.isValidRequestForInterceptor(request.url)) {
            return from(this.authService.getValidToken())
            .pipe(
                switchMap(token => {
                    if (token.accessToken) {
                        request = request.clone({ headers: request.headers.set('Authorization', 'Bearer ' + token.accessToken) });
                    }
                    if (!request.headers.has('Content-Type')) {
                        request = request.clone({ headers: request.headers.set('Content-Type', 'application/json') });
                    }
                    request = request.clone({ headers: request.headers.set('Accept', 'application/json') });
                    return next.handle(request);
                })
            );
        } else {
            return next.handle(request);
        }
    }

    isValidRequestForInterceptor(requestUrl: string) {
        let positionIndicator: string = '/cartella-asl/api/';
        let position = requestUrl.indexOf(positionIndicator);
        if (position > 0) {
        //   let destination: string = requestUrl.substr(position + positionIndicator.length);
        //   for (let address of this.urlsToNotUse) {
        //     if (new RegExp(address).test(destination)) {
        //       return false;
        //     }
        //   }
            return true;
        }
        return false;
    }
}