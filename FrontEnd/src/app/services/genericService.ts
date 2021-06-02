import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export class GenericService<T, ID> {
  constructor(protected http: HttpClient, protected url: string) { }

  //permis
  //login, createUser
  login(email: string, password: string): Observable<T> {
    return this.http.get<T>(this.url + '/' + email + '/' + password);
  }

  //ministere
  //createChild, createUser
  checkCitoyenValidity(nassm: string, prenom: string, nom: string, age: number, ville: string): Observable<boolean> {
    return this.http.get<boolean>(this.url + '/' + nassm + '/' + prenom + '/' + nom + '/' + age + '/' + ville);
  }

  //permis
  //createUser
  saveUser(nom: string, prenom: string, email: string, password: string, nassm: string, sexe: string, age: number, numTelephone: string, ville: string): Observable<T> {
    return this.http.post<T>(this.url + '/' + nom + '/' + prenom + '/' + email + '/' + password + '/' + nassm + '/' + sexe + '/' + age + '/' + numTelephone + '/' + ville, {});
  }

  //permis
  //createChild
  saveChild(nom: string, prenom: string, nassm: string, sexe: string, age: number, ville: string, idTuteur: number): Observable<T> {
    return this.http.post<T>(this.url + '/' + nom + '/' + prenom + '/' + nassm + '/' + sexe + '/' + age + '/' + ville + '/' + idTuteur, {});
  }

  //permis
  //dashboard
  findEnfantsByTuteurId(id: ID): Observable<T[]> {
    return this.http.get<T[]>(this.url + '/enfants/' + id);
  }

  //permis
  //requestPermis
  createPermis(nassm: string, typePermis: string): Observable<T> {
    console.log("yes");
    return this.http.post<T>(this.url + '/' + nassm + '&' + typePermis, {});
  }

  //ministere
  //requestPermis
  checkCitizenPermisValidity(nassm: string): Observable<string> {
    return this.http.get(this.url + '/' + nassm, { responseType: 'text' });
  }

  //permis
  //renewPermis adulte
  renewPermisAdulte(id: ID): Observable<T> {
    return this.http.post<T>(this.url + '/renew/' + id, {});
  }

  //permis
  //renewPermis child
  renewPermisChild(id: ID): Observable<T> {
    return this.http.post<T>(this.url + '/renew/' + id, {});
  }

  //permis
  //renewPermis adulte
  checkIfPermisAdulteTestedExist(nassm: string): Observable<boolean> {
    return this.http.get<boolean>(this.url + '/permisExist?/' + nassm);
  }

  //permis
  //renewPermis child
  checkIfPermisChildTestedExist(nassm: string): Observable<boolean> {
    return this.http.get<boolean>(this.url + '/permisExist?/' + nassm);
  }

  //permis
  //getPermis
  sendEmail(id: ID, email: string): Observable<boolean> {
    return this.http.get<boolean>(this.url + '&' + id + '&/email/' + email);
  }

  //permis
  //getPermis
  getPDF(id: ID): Observable<File> {
    return this.http.get<File>(this.url + '&' + id);
  }
}