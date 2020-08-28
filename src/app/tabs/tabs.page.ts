import { Component, OnInit } from '@angular/core';
import { Keyboard } from '@ionic-native/keyboard/ngx';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {

  constructor(private keyboard: Keyboard) { 

    this.keyboard.onKeyboardShow().subscribe(() => {
      // This is never executed...
      console.log('Keyboard is now open');
    });
    
    this.keyboard.onKeyboardHide().subscribe(() => {
      // This is never executed...
      console.log('Keyboard is now close');
  });

  }


}
