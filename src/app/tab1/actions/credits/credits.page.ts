import { Component } from '@angular/core';
import { Keyboard } from '@ionic-native/keyboard/ngx';

@Component({
  selector: 'credits',
  templateUrl: 'credits.page.html',
  styleUrls: ['credits.page.scss']
})
  
export class CreditsPage {

  constructor(private keyboard: Keyboard) { }
 
  openKeyboard() {
    console.log(this.keyboard.isVisible);
    this.keyboard.show();
  }
}