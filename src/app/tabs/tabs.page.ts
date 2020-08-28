import { Component, OnInit } from '@angular/core';
import { Keyboard } from '@ionic-native/keyboard/ngx';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss'],
  providers: [Keyboard]
})
export class TabsPage {

  constructor(private keyboard: Keyboard) { 

    window.addEventListener('keyboardWillShow', (e) => { console.log('keyboardWillShow');}); 
    window.addEventListener('keyboardWillHide', () => { console.log('keyboardWillHide'); });
    window.addEventListener('keyboardDidShow', (e) => {console.log('keyboardDidShow');}); 
    window.addEventListener('keyboardDidHide', () => {console.log('keyboardDidHide');});
 

  }


}
