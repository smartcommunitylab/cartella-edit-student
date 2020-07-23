import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams, HttpHeaders, HttpResponse } from '@angular/common/http';
import { forkJoin, of } from 'rxjs';
import 'rxjs/add/operator/timeout';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { Studente } from 'src/app/models/Studente';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class DataService {
      
  istitutoId: string = "19a46a53-8e10-4cd0-a7d0-fb2da217d1be";
  schoolYear: string = "2019-20";
  listIstituteIds = [];
  istituto: string = "Centro Formazione Professionale Agrario - S. Michele all'Adige'";
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

  constructor(
    private http: HttpClient) {
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

  setIstitutoPosition(coord) {
    this.coorindateIstituto = coord;
  }

  getIstitutoPosition() {
    return this.coorindateIstituto;
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
        catchError(this.handleError)
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
        catchError(this.handleError)
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

  uploadDocumentToRisorsa(file: File, uuid: string): Observable<any> {
    let url = this.host + '/upload/document/risorsa/' + uuid + '/studente/' + this.studenteId;
    let formData: FormData = new FormData();
    formData.append('data', file, file.name);
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
        }),
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
        }),
        catchError(this.handleError)
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

  // getAttivitaStudenteList(stato, page, pageSize) {
  //   let params = new HttpParams();
  //   params = params.append('page', page);
  //   params = params.append('size', pageSize);
  //   params = params.append('studenteId', this.studenteId);
  //   if (stato) {
  //       params = params.append('stato', stato);
  //   }

  //   let url = this.host + '/studente/attivita';
  
  //   return this.http.get<any>(
  //     url,
  //     {
  //       params: params,
  //       observe: 'response'
  //     })
  //     .timeout(this.timeout)
  //     .pipe(
  //       map(res => {
  //         return (res.body);
  //       }),
  //       catchError(this.handleError)
  //     );
  // }
  
  // getAttivitaStudenteById(esperienzaId) {
  //   let url = this.host + '/studente/' + this.studenteId + '/esperienza/' + esperienzaId;
  //   return this.http.get(url,
  //     {
  //       observe: 'response'
  //     })
  //     // .timeout(this.timeout)
  //     .pipe(
  //       map(resp => {
  //         return resp.body;
  //       },
  //         catchError(this.handleError)
  //       )
  //     );
  // }

  // getStudenteAttivitaGiornalieraCalendario(idEsperienza, studenteId, dataInizio, dataFine) {
  //   let url = this.host + '/studente/' + studenteId + '/esperienza/' + idEsperienza + '/presenze';
  //   let params = new HttpParams();
  //   params = params.append('dateFrom', dataInizio);
  //   params = params.append('dateTo', dataFine);


  //   return this.http.get<any>(url,
  //     {
  //       observe: 'response',
  //       params: params
  //     })
  //     // .timeout(this.timeout)
  //     .pipe(
  //       map(resp => {
  //         return resp.body
  //       },
  //         catchError(this.handleError)
  //       )
  //     );
  // }

  // saveAttivitaGiornaliereStudentiPresenze(presenzeObject, esperienzaSvoltaId) {
  //   let url = this.host + '/studente/' + this.studenteId + '/esperienza/' + esperienzaSvoltaId + '/presenze';
  //   return this.http.post(url, presenzeObject)
  //     .timeout(this.timeout)
  //     .pipe(
  //       map(studenti => {
  //         return studenti
  //       },
  //         catchError(this.handleError))
  //     );
  // }

  private handleError(error: HttpErrorResponse) {
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

    return Observable.throw(errMsg);

  }
  

}