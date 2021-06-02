import { HttpClient } from '@angular/common/http';
import { NullVisitor } from '@angular/compiler/src/render3/r3_ast';
import { Injectable } from '@angular/core';
import { Citoyen } from '../models/citoyen';
import { GenericService } from './genericService';

@Injectable({
  providedIn: 'root'
})
export class PermisService extends GenericService<Citoyen, Number>{

  constructor(http: HttpClient) {
    super(http, '/serverPermis/citoyens')
  }

  public userIsLogin() {
    let citoyen = sessionStorage.getItem('citoyen');
    return citoyen != null;
  }

  public logOut() {
    sessionStorage.clear();
  }
}
