import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import 'rxjs/add/operator/timeout';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { Studente } from 'src/app/models/Studente';
import { Observable } from 'rxjs/Observable';
import { ToastController } from '@ionic/angular';

@Injectable()
export class DataService {

  istitutoId: string = "";
  schoolYear: string = "";
  listIstituteIds = [];
  istituto: string = "";
  host: string = environment.apiEndpoint;
  studenteEndpoint = this.host + '/studente';
  corsoDiStudioAPIUrl: string = '/corsi';
  esperienzaSvoltaAPIUrl: string = '/esperienzaSvolta';
  attiitaAlternanzaAPIUrl: string = '/attivitaAlternanza'
  diarioDiBordoAPIUrl: string = "/diarioDiBordo"
  opportunitaAPIUrl: string = '/opportunita';
  timeout: number = 120000;
  coorindateIstituto;
  studenteId = '';
  studenteNome = '';
  studenteCognome = '';
  classe = '';
  email = '';
  phone = '';
  static toastCtrl;

  constructor(
    private http: HttpClient,
    private toastController: ToastController) {
    DataService.toastCtrl = toastController;
  }

  setIstitutoId(id) {
    if (id) {
      this.istitutoId = id;
    }
  }

  setSchoolYear(year) {
    if (year) {
      this.schoolYear = year;
    }
  }

  setIstitutoName(name) {
    if (name) {
      this.istituto = name;
    }
  }

  getIstitutoName(): string {
    return this.istituto;
  }

  setListId(list) {
    if (list) {
      this.listIstituteIds = list;
    }
  }

  getListId() {
    if (this.listIstituteIds)
      return this.listIstituteIds;
  }

  setStudenteId(id) {
    if (id) {
      this.studenteId = id;
    }
  }

  setStudenteCognome(surname) {
    if (surname) {
      this.studenteCognome = surname;
    }
  }

  setStudenteNome(name) {
    if (name) {
      this.studenteNome = name;
    }
  }

  setClasse(classRoom) {
    if (classRoom) {
      this.classe = classRoom;
    }
  }

  setStudenteEmail(email) {
    this.email = email;
  }

  getStudenteEmail() {
    return this.email;
  }

  setStudenteTelefono(phone) {
    this.phone = phone;
  }

  getStudenteTelefono() {
    return this.phone;
  }

  /** PROFILE */
  getProfile(): Observable<any> {
    let url = this.host + '/profile';
    return this.http.get<any>(url, {
      observe: 'response'
    })
      .timeout(this.timeout)
      .pipe(
        map(res => {
          return res.body;
        }),
        // catchError(this.handleError)
      );
  }

  updateProfile(body): Observable<any> {
    let url = this.host + '/studente/' + this.studenteId;
    return this.http.post<any>(url, body)
      .timeout(this.timeout)
      .pipe(
        map(res => {
          return res;
        },
          catchError(this.handleError)
        )
      );
  }

  getSchoolYear(istitutoId, dataInizio): Observable<any> {
    let url = this.host + '/schoolYear/' + istitutoId;
    let params = new HttpParams();
    if (dataInizio)
      params = params.append('dateFrom', dataInizio);

    return this.http.get<any>(url, {
      params: params,
      observe: 'response'
    })
      .timeout(this.timeout)
      .pipe(
        map(res => {
          return res.body;
        },
          catchError(this.handleError)
        )
      );
  }

  getStudedente(singleId: string): Observable<Studente> {
    return this.http.get<Studente>(
      `${this.studenteEndpoint}/${singleId}`,
      {
        observe: 'response'
      })
      .timeout(this.timeout)
      .pipe(
        map(res => {
          let studente = res.body as Studente;
          return studente
        }));
  };

  getIstitutoById(id: any): Observable<any> {
    let url = this.host + '/istituto/' + id;

    return this.http.get<any>(url,
      {
        observe: 'response'
      })
      .timeout(this.timeout)
      .pipe(
        map(res => {
          return res.body;
        }),
        catchError(this.handleError)
      );
  }

  addConsent(): Observable<any> {
    let url = this.host + '/consent/add';

    return this.http.put(
      url,
      {
        observe: 'response',
      }
    )
      .timeout(this.timeout)
      .pipe(
        map(res => {
          return res;
        }),
        catchError(this.handleError))
  }

  /** ESPERIENZE */
  getStudenteSummary(): Observable<any> {
    let url = this.host + '/studente/attivita/sommario';
    let params = new HttpParams();
    params = params.append('studenteId', this.studenteId);

    return this.http.get<any>(url,
      {
        observe: 'response',
        params: params
      })
      .timeout(this.timeout)
      .pipe(
        map(res => {
          return res.body;
        }),
        // catchError(this.handleError)
      );
  }

  getAttivitaDocumenti(uuid): Observable<any> {
    let url = this.host + '/download/document/risorsa/' + uuid + '/studente/' + this.studenteId;

    return this.http.get(
      url,
      {
        observe: 'response',
      }
    )
      .timeout(this.timeout)
      .pipe(
        map(res => {
          return res.body;
        }),
        catchError(this.handleError));
  }

  uploadDocumentToRisorsa(option, uuid: string): Observable<any> {
    let url = this.host + '/upload/document/risorsa/' + uuid + '/studente/' + this.studenteId;
    let formData: FormData = new FormData();
    formData.append('data', option.file, option.file.name);
    formData.append('tipo', option.type);

    let headers = new Headers();

    return this.http.post<any>(url, formData)
      .timeout(this.timeout)
      .pipe(
        map(res => {
          return res;
        }),
        catchError(this.handleError)
      )
  }

  downloadRisorsaDocumenti(id: any): Observable<any> {
    let url = this.host + '/download/document/risorsa/' + id + '/studente/' + this.studenteId;

    return this.http.get<any>(url,
      {
        observe: 'response'
      })
      .timeout(this.timeout)
      .pipe(
        map(res => {
          return res.body;
        },
        ),
        catchError(this.handleError)
      );
  }

  openDocument(doc) {
    let url = this.host + '/download/document/' + doc.uuid + '/studente/' + this.studenteId;

    this.http.get(url, {
      responseType: 'arraybuffer'
    }
    ).subscribe(response => this.downLoadFile(response, doc.formatoDocumento));

  }

  downLoadFile(data: any, type: string) {
    let blob = new Blob([data], { type: type });
    let url = window.URL.createObjectURL(blob);
    let pwa = window.open(url);

    if (!pwa || pwa.closed || typeof pwa.closed == 'undefined') {
      alert('Please disable your Pop-up blocker and try again.');
    }
  }

  deleteDocument(id: any): Observable<any> {
    let url = this.host + '/remove/document/' + id + '/studente/' + this.studenteId;

    return this.http.delete(url,
      {
        observe: 'response'
      })
      .timeout(this.timeout)
      .pipe(
        map(res => {
          return res.body;
        },
        catchError(this.handleError)
        ),        
      );

  }

  getAttivitaTipologie(): Observable<object[]> {
    let url = this.host + '/tipologieTipologiaAttivita';

    return this.http.get<object[]>(url)
      .timeout(this.timeout)
      .pipe(
        map(tipologie => {
          return tipologie;
        },
          catchError(this.handleError)
        )
      );
  }

  getAttivitaStudenteList(stato, page, pageSize) {
    let params = new HttpParams();
    params = params.append('page', page);
    params = params.append('size', pageSize);
    params = params.append('studenteId', this.studenteId);
    if (stato) {
      params = params.append('stato', stato);
    }

    let url = this.host + '/studente/attivita';

    return this.http.get<any>(
      url,
      {
        params: params,
        observe: 'response'
      })
      .timeout(this.timeout)
      .pipe(
        map(res => {
          return (res.body);
        }),
        catchError(this.handleError)
      );
  }

  /** PRESENZE **/
  getAttivitaStudenteById(esperienzaId) {
    let url = this.host + '/studente/' + this.studenteId + '/esperienza/' + esperienzaId;
    return this.http.get(url,
      {
        observe: 'response'
      })
      .timeout(this.timeout)
      .pipe(
        map(resp => {
          return resp.body;
        },
          catchError(this.handleError)
        )
      );
  }

  getStudenteAttivitaGiornalieraCalendario(idEsperienza, studenteId, dataInizio, dataFine) {
    let url = this.host + '/studente/' + studenteId + '/esperienza/' + idEsperienza + '/presenze';
    let params = new HttpParams();
    params = params.append('dateFrom', dataInizio);
    params = params.append('dateTo', dataFine);

    return this.http.get<any>(url,
      {
        observe: 'response',
        params: params
      })
      .timeout(this.timeout)
      .pipe(
        map(resp => {
          return resp.body
        },
          catchError(this.handleError)
        )
      );
  }

  saveAttivitaGiornaliereStudentiPresenze(presenzeObject, esperienzaSvoltaId) {
    let url = this.host + '/studente/' + this.studenteId + '/esperienza/' + esperienzaSvoltaId + '/presenze';
    return this.http.post(url, presenzeObject)
      .timeout(this.timeout)
      .pipe(
        map(studenti => {
          return studenti
        },
          catchError(this.handleError))
      );
  }

  getValutazioneAttivita(idEsperienza) {
    let url = this.host + '/valutazione/attivita/studente';
    let params = new HttpParams();
    params = params.append('studenteId', this.studenteId);
    params = params.append('esperienzaSvoltaId', idEsperienza);

    return this.http.get<any>(url,
      {
        observe: 'response',
        params: params
      })
      .timeout(this.timeout)
      .pipe(
        map(resp => {
          return resp.body
        },
          catchError(this.handleError)
        )
      );
  }

  getValutazioneCompetenze(idEsperienza) {
    let url = this.host + '/valutazione/competenze/studente';
    let params = new HttpParams();
    params = params.append('studenteId', this.studenteId);
    params = params.append('esperienzaSvoltaId', idEsperienza);

    return this.http.get<any>(url,
      {
        observe: 'response',
        params: params
      })
      .timeout(this.timeout)
      .pipe(
        map(resp => {
          return resp.body
        },
          catchError(this.handleError)
        )
      );
  }

  saveValutazioneEsperienza(valutazioniObj, idEsperienza) {
    let url = this.host + '/valutazione/attivita/studente';
    let params = new HttpParams();
    params = params.append('studenteId', this.studenteId);
    params = params.append('esperienzaSvoltaId', idEsperienza);
    return this.http.post(url, valutazioniObj, { params: params })
      .timeout(this.timeout)
      .pipe(
        map(valutazioni => {
          return valutazioni
        },
          catchError(this.handleError))
      );
  }

  private async handleError(error: HttpErrorResponse) {
    let errMsg = "Errore del server! Prova a ricaricare la pagina.";

    if (error.error) {

      if (error.error.message) {
        errMsg = error.error.message;
      } else if (error.error.ex) {
        errMsg = error.error.ex;
      } else if (typeof error.error === "string") {
        try {
          let errore = JSON.parse(error.error);
          if (errore.ex) {
            errMsg = errore.ex;
          }
        }
        catch (e) {
          console.error('server error:', errMsg);
        }
      }
    }

    console.error('server error:', errMsg);

    // if ((error.status == 401) || (error.status == 403)) {
    //   const toast = await DataService.toastCtrl.create({
    //     message: errMsg,
    //     duration: 2000,
    //     position: 'middle'
    //   })
    //   toast.present();
    //   window.location.href = '../landing';
    // }

    return Observable.throw(errMsg);

  }

}