import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Citoyen } from 'src/app/models/citoyen';
import { ChildService } from 'src/app/services/child.service';
import { MinistereService } from 'src/app/services/ministere.service';
import { PermisService } from 'src/app/services/permis.service';

@Component({
  selector: 'app-request-permis',
  templateUrl: './request-permis.component.html',
  styleUrls: ['./request-permis.component.css']
})
export class RequestPermisComponent implements OnInit {

  constructor(private servicePermis: PermisService, private serviceChild: ChildService, private serviceMinistere: MinistereService, private router: Router) { }

  citoyen: Citoyen;
  validMessage: string = '';
  nassm: string;
  resultRequest: string;
  enfants: Citoyen[];
  requestedCitoyenNASSM: string;
  returnedCitoyen: Citoyen;

  requestPermisForm = new FormGroup({
    citoyen: new FormControl('', Validators.required)
  });

  ngOnInit(): void {
    this.citoyen = JSON.parse(sessionStorage.getItem("citoyen"));
    this.enfants = JSON.parse(sessionStorage.getItem("enfants"));

  }

  onSubmit() {
    if (this.requestPermisForm.valid) {
      this.validMessage = '';
      this.requestedCitoyenNASSM = this.requestPermisForm.get('citoyen').value;
      this.serviceMinistere.checkCitizenPermisValidity(this.requestedCitoyenNASSM).subscribe((data) => {
        this.resultRequest = data;
        if (this.resultRequest == "Vaccinated" || this.resultRequest == "Tested") {
          if (this.requestedCitoyenNASSM == this.citoyen.numAssuranceSocial) {
            this.requestPermisUser();
          } else {
            this.requestPermisChild();
          }
        } else if (this.resultRequest == "None") {
          this.validMessage = 'Vous devez soit vous faire vaccinner ou tester';
        }
      })
    } else {
      this.validMessage = 'Please fill the form before submitting!';
    }
  }
  requestPermisChild() {
    this.serviceChild.createPermis(this.requestedCitoyenNASSM, this.resultRequest).subscribe((data) => {
      this.returnedCitoyen = data;
      if (this.returnedCitoyen != null) {
        this.router.navigate(['/dashboard']);
      }
    });
  }
  private requestPermisUser() {
    this.servicePermis.createPermis(this.requestedCitoyenNASSM, this.resultRequest).subscribe((data) => {
      this.returnedCitoyen = data;
      if (this.returnedCitoyen != null) {
        this.router.navigate(['/dashboard']);
      }
    });
  }
}
