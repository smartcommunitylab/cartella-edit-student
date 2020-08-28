import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {

  show: boolean = true;

  constructor() {
    window.addEventListener('ionKeyboardDidShow', ev => {
      console.log('keyboard shown');
      this.show = false;
      // Do something with the keyboard height such as translating an input above the keyboard.
    });
    
    window.addEventListener('ionKeyboardDidHide', () => {
      console.log('keyboard hidden');
      this.show = true;
      // Move input back to original location
    });
   }

}
