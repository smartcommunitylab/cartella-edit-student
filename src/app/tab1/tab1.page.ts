import { Component } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { DataService } from '../core/services/data.service';
import { AlertController } from '@ionic/angular';
import { UtilsService } from '../core/services/utils.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {
  baseUrl;
  editEmail: boolean = false;
  editTelefono: boolean = false;
  
  constructor(
    private auth: AuthService,
    public dataService: DataService,
    private route: ActivatedRoute,
    private router: Router,
    private alertController: AlertController,
    private utlilsService: UtilsService
  ) {
    this.baseUrl = window.location.href;
  }

  signOut() {
    this.auth.signOut().then(() => { window.location.href = this.baseUrl;});
  }

  credits() {
    this.router.navigate(['../credits'], { relativeTo: this.route });
  }

  async showEmailInput() {
    const alert = await this.alertController.create({
      inputs: [
        {
          name: 'email',
          type: 'text',
          value: this.dataService.email?this.dataService.email:'Email'
        }
      ],
      buttons: [
        {
          text: 'Annulla',
          role: 'cancel',
          handler: () => {
            console.log('Confirm Cancel');
          }
        },
        {
          text: 'Salva',
          handler: (input: any) => {
            let validateObj = this.validateEmail(input);
            if (!validateObj.isValid) {
              this.utlilsService.presentWarningLoading(validateObj.message)
              return false;
            } else {
              this.dataService.updateProfile({ email: input.email, phone: this.dataService.phone }).subscribe((studente: any) => {
                this.dataService.setStudenteEmail(studente.email);               
              },
                (err: any) => {
                  console.log(err);
                  if (err.error.ex) {
                    this.utlilsService.presentErrorLoading(err.error.ex);
                  } else {
                    this.utlilsService.presentErrorLoading('Errore');
                  }        
                },
                () => console.log('update profile email'));
            }
            console.log('Confirm Ok');
          }
        }
      ]
    });

    await alert.present();
  }

  async showPhoneInput() {
    const alert = await this.alertController.create({
      inputs: [
        {
          name: 'telefono',
          type: 'number',
          min: 10,
          max: 13,
          value: this.dataService.phone?this.dataService.phone:'Telefono'
        }
      ],
      buttons: [
        {
          text: 'Annulla',
          role: 'cancel',
          handler: () => {
            console.log('Confirm Cancel');
          }
        },
        {
          text: 'Salva',
          handler: (input: any) => {
            let validateObj = this.validateTelefono(input);
            if (!validateObj.isValid) {
              this.utlilsService.presentWarningLoading(validateObj.message)
              return false;
            } else {
              this.dataService.updateProfile({ email: this.dataService.email, phone: input.telefono }).subscribe((studente: any) => {
                this.dataService.setStudenteTelefono(studente.phone);               
              },
                (err: any) => {
                  console.log(err);
                  if (err.error.ex) {
                    this.utlilsService.presentErrorLoading(err.error.ex);
                  } else {
                    this.utlilsService.presentErrorLoading('Errore');
                  }        
                },
                () => console.log('update profile telefono'));
            }
            console.log('Confirm Ok');
          }
        }
      ]
    });

    await alert.present();
  }

  validateEmail(data) {
    if (/(.+)@(.+){2,}\.(.+){2,}/.test(data.email)) {
      return {
        isValid: true,
        message: ''
      };
    } else {
      return {
        isValid: false,
        message: 'Indirizzo email inserito non valido'
      }
    }
  }

  validateTelefono(data) {
    if (data.telefono.length >= 10 && data.telefono.length <= 13) {
      return {
        isValid: true,
        message: ''
      };
    } else {
      return {
        isValid: false,
        message: 'Numero non valido. Inserire numero tra le 10 e le 13 cifre'
      }
    }
  }

}
