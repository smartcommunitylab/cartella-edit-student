import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { forkJoin, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { Studente } from 'src/app/models/Studente';


const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class DataService {
      
  istitutoId: string = "19a46a53-8e10-4cd0-a7d0-fb2da217d1be";
  schoolYear: string = "2019-20";
  listIstituteIds = [];
  istituto: string = "Centro Formazione Professionale Agrario - S. Michele all'Adige'";
  host: string = environment.apiEndpoint;
  private corsiStudio = this.host + '/corsiDiStudio/';
  private reportStudentiByPiano = this.host + "/programmazione";
  private reportClasse = this.host + "/report";
  private attivitaGiornalieraListaEndpoint = this.host + '/attivitaGiornaliera';
  private attivitaGiornalieraStudentiStatusEndpoint = this.host + '/attivitaGiornaliera/esperienze/report'
  private attivitaAlternanzaEndpoint = this.host + '/attivitaAlternanza';
  private studentiProfiles = this.host + '/studenti/profiles';
  private classiRegistration = this.host + '/registration/classi';
  private solveEccezioni = this.host + '/eccezioni/attivita';
  private esperienzaEndPoint = this.host + '/esperienzaSvolta/details';
  corsoDiStudioAPIUrl: string = '/corsi';
  esperienzaSvoltaAPIUrl: string = '/esperienzaSvolta';
  attiitaAlternanzaAPIUrl: string = '/attivitaAlternanza'
  diarioDiBordoAPIUrl: string = "/diarioDiBordo"
  opportunitaAPIUrl: string = '/opportunita';
  timeout: number = 120000;
  coorindateIstituto;

  studenteId = '';

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

  getProfile(): Observable<any> {
    let url = this.host + '/profile';
    return this.http.get<any>(url, {
      observe: 'response'
    })
      // .timeout(this.timeout)
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
      // .timeout(this.timeout)
      .pipe(
        map(res => {
          return res.body;
        },
          catchError(this.handleError)
        )
      );
  }

  // getListaStudentiByIds(ids: any): any {
  //   let singleObservables = ids.map((singleIds: string, urlIndex: number) => {
  //     return this.getStudedente(singleIds)
  //       // .timeout(this.timeout)
  //       .map(single => single as Studente)
  //       .catch((error: any) => {
  //         console.error('Error loading Single, singleUrl: ' + singleIds, 'Error: ', error);
  //         return Observable.of(null);
  //       });
  //   });

  //   return forkJoin(singleObservables);
  // }

  private studenteEndpoint = this.host + '/studente';

  getStudedente(singleId: string): Observable<Studente> {
    return this.http.get<Studente>(
      `${this.studenteEndpoint}/${singleId}`,
      {
        observe: 'response'
      })
      // .timeout(this.timeout)
      .pipe(
        map(res => {
          let competenza = res.body as Studente;
          return competenza
        }));
  };

  private attivitaStudenteEndpoint = this.host + '/studente/attivita';
  
  getAttivitaStudenteList(page, pageSize, studenteId, filters) {
    let params = new HttpParams();
    params = params.append('page', page);
    params = params.append('size', pageSize);
    params = params.append('studenteId', studenteId);

    if (filters) {
      if (filters.filterText)
        params = params.append('filterText', filters.filterText);
      if (filters.dataInizio)
        params = params.append('dataInizio', filters.dataInizio);
      if (filters.dataFine)
        params = params.append('dataFine', filters.dataFine);
      if (filters.stato)
        params = params.append('stato', filters.stato);
      if (filters.Tipologia)
        params = params.append('Tipologia', filters.Tipologia);
    }

    return this.http.get<any>(
      this.attivitaStudenteEndpoint,
      {
        params: params,
        observe: 'response'
      })
      // .timeout(this.timeout)
      .pipe(
        map(res => {
          return (res.body);
        }),
        catchError(this.handleError)
      );
  }
  
  getAttivitaStudenteById(esperienzaId) {
    let url = this.host + '/studente/' + this.studenteId + '/esperienza/' + esperienzaId;
    return this.http.get(url,
      {
        observe: 'response'
      })
      // .timeout(this.timeout)
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
      // .timeout(this.timeout)
      .pipe(
        map(resp => {
          return resp.body
        },
          catchError(this.handleError)
        )
      );
  }

  
  /** ACTIVITES/ESPERIENZA SVOLTA API BLOCK. */

  // //GET /esperienzaSvolta/
  // getEsperienzaSvoltaAPI(dataInizio: any, dataFine: any, stato: any, tipologia: any, filterText: any, terminata: any, nomeStudente: any, page: any, pageSize: any): Observable<IPagedES> {

  //   let url = this.host + this.esperienzaSvoltaAPIUrl + "/istituto/" + this.istitutoId;

  //   let headers = new HttpHeaders();
  //   let params = new HttpParams();

  //   if (dataInizio)
  //     params = params.append('dataInizio', dataInizio);
  //   if (dataFine)
  //     params = params.append('dataFine', dataFine);
  //   if (stato)
  //     params = params.append('stato', stato);
  //   if (tipologia)
  //     params = params.append('tipologia', tipologia);
  //   if (filterText)
  //     params = params.append('filterText', filterText);
  //   if (terminata != null) {
  //     params = params.append('terminata', terminata);
  //   }
  //   if (nomeStudente) {
  //     params = params.append('nomeStudente', nomeStudente);
  //   }

  //   // force individuale to true (students only)
  //   params = params.append('individuale', 'true');
  //   params = params.append('page', page);
  //   params = params.append('size', pageSize);

  //   return this.http.get<IPagedES>(
  //     url,
  //     {
  //       headers: headers,
  //       params: params,
  //       observe: 'response'
  //     })
  //     .timeout(this.timeout)
  //     .pipe(
  //       map(res => {
  //         return (res.body as IPagedES);

  //       }),
  //       catchError(this.handleError)
  //     );
  // }

  // //GET /esperienzaSvolta/details/{id}
  // getEsperienzaSvoltaByIdAPI(id: any): Observable<EsperienzaSvolta> {

  //   let url = this.host + this.esperienzaSvoltaAPIUrl + "/" + this.istitutoId + "/details/" + id;

  //   return this.http.get<EsperienzaSvolta>(url,
  //     {
  //       observe: 'response'
  //     })
  //     .timeout(this.timeout)
  //     .pipe(
  //       map(res => {
  //         let attivita = res.body as EsperienzaSvolta;
  //         return attivita;
  //       }),
  //       catchError(this.handleError)
  //     );
  // }

  // //GET /attivitaAlternanza/{id}
  // getAttivitaAlternanzaByIdAPI(id: any): Observable<AttivitaAlternanza> {

  //   let url = this.host + this.attiitaAlternanzaAPIUrl + '/' + id;

  //   return this.http.get<AttivitaAlternanza>(url,
  //     {
  //       observe: 'response'
  //     })
  //     .timeout(this.timeout)
  //     .pipe(
  //       map(res => {
  //         let attivita = res.body as AttivitaAlternanza;
  //         return attivita;
  //       }),
  //       catchError(this.handleError)
  //     );
  // }
  // //PUT
  // completaAttivitaAlternanza(id: any, upldatedES: any): any {
  //   let url = this.host + this.attiitaAlternanzaAPIUrl + '/' + id + '/completa';

  //   return this.http.put<IApiResponse>(
  //     url,
  //     upldatedES,
  //     { observe: 'response', }
  //   )
  //     .timeout(this.timeout)
  //     .pipe(
  //       map(res => {
  //         if (res.ok)
  //           return true;
  //         else
  //           return res;
  //       }),
  //       catchError(this.handleError));
  // }


  // // GET /download/schedaValutazioneAzienda/{es_id}
  // downloadschedaValutazione(id: any): Observable<Valutazione> {

  //   let url = this.host + '/download/schedaValutazioneScuola/' + this.istitutoId + '/es/' + id;

  //   return this.http.get<Valutazione>(url,
  //     {
  //       observe: 'response'
  //     })
  //     .timeout(this.timeout)
  //     .pipe(
  //       map(res => {
  //         return res.body as Valutazione;
  //       }),
  //       catchError(this.handleError)
  //     );
  // }

  // apiFormat(D) {
  //   var yyyy = D.getFullYear().toString();
  //   var mm = (D.getMonth() + 1).toString(); // getMonth() is zero-based         
  //   var dd = D.getDate().toString();

  //   return yyyy + '-' + (mm[1] ? mm : "0" + mm[0]) + '-' + (dd[1] ? dd : "0" + dd[0]);
  // }

  // // GET /opportunita/{aziendaId}
  // getPagedOppurtunitaAPI(dataInizio: any, dataFine: any, tipologia: any, filterText: any, page: any, pageSize: any): Observable<IPagedOffers> {

  //   let url = this.host + this.opportunitaAPIUrl;

  //   let params = new HttpParams();

  //   params = params.append('istitutoId', this.istitutoId);
  //   if (dataInizio)
  //     params = params.append('dataInizio', dataInizio);
  //   if (dataFine)
  //     params = params.append('dataFine', dataFine);

  //   params = params.append('page', page);
  //   params = params.append('size', pageSize);
  //   if (tipologia)
  //     params = params.append('tipologia', tipologia);
  //   if (filterText)
  //     params = params.append('filterText', filterText);


  //   return this.http.get<IPagedOffers>(
  //     url,
  //     {
  //       params: params,
  //       observe: 'response',
  //     }
  //   )
  //     .timeout(this.timeout)
  //     .pipe(
  //       map(res => {
  //         return (res.body as IPagedOffers);
  //       }),
  //       catchError(this.handleError)
  //     );
  // }

  // // GET /opportunita/details/{id}
  // getOppurtunitaDetailAPI(id: any) {

  //   let url = this.host + this.opportunitaAPIUrl + "/" + this.istitutoId + '/details/' + id;

  //   return this.http.get<IOffer>(
  //     url,
  //     {
  //       observe: 'response',
  //     }
  //   )
  //     .timeout(this.timeout)
  //     .pipe(
  //       map(res => {
  //         let offer = res.body as IOffer;
  //         return offer;
  //       }),
  //       catchError(this.handleError)
  //     );
  // }


  // // POST/opportunita/details/
  // insertOppurtunitaAPI(offer: IOffer): Observable<any> {
  //   let url = this.host + this.opportunitaAPIUrl + "/" + this.istitutoId + '/details/';
  //   return this.http.post<IOffer>(
  //     url,
  //     offer,
  //     { observe: 'response', }
  //   )
  //     .timeout(this.timeout)
  //     .pipe(
  //       map(res => {
  //         if (res.ok) {
  //           return (res.body as IOffer);
  //         } else
  //           return res;
  //       }
  //       ),
  //       catchError(this.handleError))
  // }

  // // DELETE /opportunita/{id}
  // deleteOppurtunita(id: number): Observable<any> {
  //   let url = this.host + this.opportunitaAPIUrl + "/" + this.istitutoId + "/" + id;
  //   return this.http.delete(
  //     url,
  //     {
  //       observe: 'response',
  //       responseType: 'text'
  //     }
  //   )
  //     .timeout(this.timeout)
  //     .pipe(
  //       map(res => {
  //         return res;
  //       }),
  //       catchError(this.handleError)
  //     );
  // }

  // // PUT/opportunita/details/{id}
  // updateOppurtunita(offer: IOffer) {
  //   let url = this.host + this.opportunitaAPIUrl + "/" + this.istitutoId + '/details/' + offer.id;
  //   return this.http.put(
  //     url,
  //     offer,
  //     {
  //       observe: 'response',
  //       responseType: 'text'
  //     }
  //   )
  //     .timeout(this.timeout)
  //     .pipe(
  //       map(res => {
  //         return res;
  //       }),
  //       catchError(this.handleError))
  // }


  // //DIVERSO
  // // PUT /opportunita/{id}/competenze
  // updateCompetenzeAzienda(id: any, listComptenze: any) {
  //   let url = this.host + this.opportunitaAPIUrl + '/' + this.istitutoId + '/' + id + "/competenze";
  //   return this.http.put<IApiResponse>(
  //     url,
  //     listComptenze,
  //     { observe: 'response', }
  //   )
  //     .timeout(this.timeout)
  //     .pipe(
  //       map(res => {
  //         if (res.ok)
  //           return true;
  //         else
  //           return res;
  //       }),
  //       catchError(this.handleError))

  // }


  // // PUT /opportunita/competenze/{id}
  // updateRiferente(id: any, rId: any): Observable<IOffer> {
  //   let url = this.host + this.opportunitaAPIUrl + '/' + id + "/referenteAzienda/" + rId;
  //   return this.http.put<IOffer>(
  //     url,
  //     { observe: 'response', }
  //   )
  //     .timeout(this.timeout)
  //     .pipe(
  //       map(res => {
  //         if (res) {
  //           return (res as IOffer);
  //         } else
  //           return res;
  //       }
  //       ),
  //       catchError(this.handleError))

  // }

  // getAttivitaTipologieAzienda(): Observable<object[]> {
  //   return this.http.get<object[]>(this.host + "/tipologieTipologiaAttivita")
  //     .pipe(
  //       map(tipologie => {
  //         return tipologie;
  //       },
  //         catchError(this.handleError)
  //       )
  //     );
  // }

  // //DIVERSO
  // saveAttivitaGiornaliereStudentiPresenzeAzienda(presenzeObject) {
  //   return this.http.put(this.attivitaGiornalieraListaEndpoint + '/calendario', presenzeObject,
  //     {
  //       observe: 'response',
  //       responseType: 'text'
  //     }
  //   )
  //     .timeout(this.timeout)
  //     .pipe(
  //       map(studenti => {
  //         return studenti
  //       },
  //         catchError(this.handleError)
  //       )
  //     );
  // }

  // addConsent(): Observable<any> {
  //   let url = this.host + '/consent/add';

  //   return this.http.put(
  //     url,
  //     {
  //       observe: 'response',
  //     }
  //   )
  //     .timeout(this.timeout)
  //     .pipe(
  //       map(res => {
  //         return res;
  //       }),
  //       catchError(this.handleError))
  // }

  private handleError(error: HttpErrorResponse) {
    let errMsg = "Errore del server! Prova a ricaricare la pagina.";

    // if (error.name === 'TimeoutError') {
    //   errMsg = error.message;
    // }
    // else if (error.error) {
    //   if (error.error.message) {
    //     errMsg = error.error.message;
    //   } else if (error.error.ex) {
    //     errMsg = error.error.ex;
    //   } else if (typeof error.error === "string") {
    //     try {
    //       let errore = JSON.parse(error.error);
    //       if (errore.ex) {
    //         errMsg = errore.ex;
    //       }
    //     }
    //     catch (e) {
    //       console.error('server error:', errMsg);
    //     }
    //   }
    // }

    console.error('server error:', errMsg);

    let displayGrowl: boolean = true;
    // to avoid display growl tip inccase of 401 | 403
    if ((error.status == 401) || (error.status == 403)) {
      displayGrowl = false;
    }

    // if (DataService.growler.growl && displayGrowl) {
    //   DataService.growler.growl(errMsg, GrowlerMessageType.Danger, 5000);
    // }

    return Observable.throw(errMsg);

  }

}