import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Citoyen } from 'src/app/models/citoyen';
import { ChildService } from 'src/app/services/child.service';
import { MinistereService } from 'src/app/services/ministere.service';

@Component({
  selector: 'app-create-child',
  templateUrl: './create-child.component.html',
  styleUrls: ['./create-child.component.css']
})
export class CreateChildComponent implements OnInit {

  constructor(private serviceChild: ChildService, private serviceMinistere: MinistereService, private router: Router) { }

  tuteur: Citoyen;
  enfant: Citoyen;
  validMessage: string = '';
  enfantValide: boolean;

  addChildForm = new FormGroup({
    prenom: new FormControl('', [Validators.required, Validators.minLength(4)]),
    nom: new FormControl('', [Validators.required, Validators.minLength(4)]),
    numAssuranceSocial: new FormControl('', Validators.required),
    sexe: new FormControl('', Validators.required),
    age: new FormControl('', [Validators.required, Validators.max(16)]),
    ville: new FormControl('', Validators.required),
  });

  ngOnInit(): void {
    this.enfant = new Citoyen();
    this.tuteur = JSON.parse(sessionStorage.getItem('citoyen'));
  }

  onSubmit() {
    if (this.addChildForm.get('age').value > 16) {
      this.validMessage =
        'Vous devez avoir moin de 16 ans pour vous créer un compte enfant!';
    } else if (!this.addChildForm.valid) {
      this.validMessage = 'Please fill the form before submitting!';
    } else {
      this.setEnfantValue();

      this.serviceMinistere.checkCitoyenValidity(this.enfant.numAssuranceSocial, this.enfant.prenom, this.enfant.nom, this.enfant.age, this.enfant.ville).subscribe((data) => {
        this.enfantValide = data;
        if (data == true) {
          this.serviceChild.saveChild(this.enfant.nom, this.enfant.prenom, this.enfant.numAssuranceSocial, this.enfant.sexe, this.enfant.age, this.enfant.ville, this.enfant.idTuteur).subscribe((data) => {
            this.enfant = data;
            this.addChildForm.reset();
            this.router.navigateByUrl('/dashboard');
            this.validMessage = 'good';
          });
        } else {
          this.validMessage = 'Vos informations sont invalide. Contacter le ministère';
        }
      });
    }

  }
  private setEnfantValue() {
    this.enfant.prenom = this.addChildForm.get('prenom').value;
    this.enfant.nom = this.addChildForm.get('nom').value;
    this.enfant.numAssuranceSocial = this.addChildForm.get('numAssuranceSocial').value;
    this.enfant.sexe = this.addChildForm.get('sexe').value;
    this.enfant.age = this.addChildForm.get('age').value;
    this.enfant.ville = this.addChildForm.get('ville').value;
    this.enfant.idTuteur = this.tuteur.idUser;
  }

}

