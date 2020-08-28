import { Component, OnInit } from '@angular/core';
import { Keyboard } from '@ionic-native/keyboard/ngx';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage {

  constructor(private keyboard: Keyboard) { 

    window.addEventListener('keyboardWillShow', (e) => { alert('keyboardWillShow');}); 
    window.addEventListener('keyboardWillHide', () => { alert('keyboardWillHide'); });
    window.addEventListener('keyboardDidShow', (e) => { alert('keyboardDidShow');}); 
    window.addEventListener('keyboardDidHide', () => { alert('keyboardDidHide');});
    window.addEventListener('ionKeyboardDidShow', ev => {
      alert('ionKeyboardDidShow');
      // Do something with the keyboard height such as translating an input above the keyboard.
    });
    
    window.addEventListener('ionKeyboardDidHide', () => {
      alert('ionKeyboardDidHide');
      // Move input back to original location
    });
    

  }


}
