import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Citoyen } from '../models/citoyen';
import { GenericService } from './genericService';

@Injectable({
  providedIn: 'root'
})
export class MinistereService extends GenericService<Citoyen, Number>{

  constructor(http: HttpClient) {
    super(http, '/serverMinistere/ministere')
  }
}
