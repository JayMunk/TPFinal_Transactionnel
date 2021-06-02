import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Citoyen } from 'src/app/models/citoyen';
import { ChildService } from 'src/app/services/child.service';
import { MinistereService } from 'src/app/services/ministere.service';
import { PermisService } from 'src/app/services/permis.service';

@Component({
  selector: 'app-renew-permis',
  templateUrl: './renew-permis.component.html',
  styleUrls: ['./renew-permis.component.css']
})
export class RenewPermisComponent implements OnInit {

  constructor(private servicePermis: PermisService, private serviceChild: ChildService, private router: Router) { }

  citoyen: Citoyen;
  validMessage: string = '';
  infoValide: boolean;
  enfants: Citoyen[];
  userId: number;

  renewPermisForm = new FormGroup({
    citoyenID: new FormControl('', Validators.required)
  });

  ngOnInit(): void {
    this.citoyen = JSON.parse(sessionStorage.getItem("citoyen"));
    this.enfants = JSON.parse(sessionStorage.getItem("enfants"));
  }

  onSubmit() {
    if (this.renewPermisForm.valid) {
      this.userId = this.renewPermisForm.get("citoyenID").value;
      if (this.userId == this.citoyen.idUser) {
        this.renewPermisAdulte();
      } else {
        this.renewPermisChild();
      }
    } else {
      this.validMessage = 'Please fill the form before submitting!';
    }
  }

  private renewPermisChild() {
    this.serviceChild.renewPermisChild(this.userId).subscribe((data) => {
      this.citoyen = data;
      this.router.navigateByUrl('/dashboard');
      this.validMessage = 'good';
    });
  }

  private renewPermisAdulte() {
    this.servicePermis.renewPermisAdulte(this.userId).subscribe((data) => {
      this.citoyen = data;
      this.router.navigateByUrl('/dashboard');
      this.validMessage = 'good';
    });
  }
}
