import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'document-upload-modal',
  templateUrl: './document-upload-modal.component.html',
  styleUrls: ['./document-upload-modal.component.scss']
})
export class DocumentUploadModalComponent implements OnInit {

  titolo: string;
  // annoRiferimento: any;
  // monte3anno: number;
  // monte4anno: number;
  // monte5anno: number;
  // note: string = '';
  // fieldsError: string;
  optionSelected: boolean = false;
  optionType;
  fileSelected: boolean = false;
  selectedFileName;
  optionTypes = {
    "1": "valutazione_esperienza",
    "2": "doc_generico"   
  }
  tipiDoc = [{ "name": "Valutazione esperienza", "value": "valutazione_esperienza" }, { "name": "Altro", "value": "doc_generico" }];
  selectedDocType;
  saveFileObj = { type: null, file: null };
  @Output() newDocumentListener = new EventEmitter<Object>();

  constructor(public modalCtrl: ModalController) { }

  ngOnInit() {
  }


  dismiss() {
    this.modalCtrl.dismiss();
  }

  create(option) {
    this.optionSelected = true;
    this.selectedDocType = this.optionTypes[option];
    var x = document.getElementById(option);
    x.classList.add('active');
    for (let i = 1; i <= 2; i++) {
      if (i !== option) {
        var x = document.getElementById(i + '');
        x.classList.remove('active');
      }
    }
    // this.fileSelected = false;
    // this.selectedFileName = null;
  }

  uploadDocument(fileInput) {
    if (fileInput.target.files && fileInput.target.files[0]) {
      this.fileSelected = true;
      this.selectedFileName = fileInput.target.files[0].name;
      this.saveFileObj.type = this.selectedDocType;
      this.saveFileObj.file = fileInput.target.files[0];
    }
  }

  carica() {
    this.newDocumentListener.emit(this.saveFileObj);
    this.modalCtrl.dismiss(this.saveFileObj);;
  }


}
