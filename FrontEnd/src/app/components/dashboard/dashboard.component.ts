import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Citoyen } from 'src/app/models/citoyen';
import { ChildService } from 'src/app/services/child.service';
import { PermisService } from 'src/app/services/permis.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  citoyen: Citoyen
  enfantsTable: Citoyen[]
  nbEnfant: number

  constructor(private serviceChild: ChildService, private router: Router) { }

  ngOnInit(): void {
    this.citoyen = JSON.parse(sessionStorage.getItem('citoyen'));
    this.serviceChild.findEnfantsByTuteurId(this.citoyen.idUser).subscribe(
      (enfants) => {
        this.enfantsTable = enfants;
        sessionStorage.setItem('enfants', JSON.stringify(this.enfantsTable));
        this.nbEnfant = enfants.length;
      }
    );
  }

}
