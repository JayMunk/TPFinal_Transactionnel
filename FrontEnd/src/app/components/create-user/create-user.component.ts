import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Citoyen } from 'src/app/models/citoyen';
import { PermisService } from 'src/app/services/permis.service';
import { MinistereService } from 'src/app/services/ministere.service';

@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.css'],
})
export class CreateUserComponent implements OnInit {
  constructor(private servicePermis: PermisService, private serviceMinistere: MinistereService, private router: Router) { }

  citoyen: Citoyen;
  validMessage: string = '';
  citoyenValide: boolean;

  addUserForm = new FormGroup({
    email: new FormControl('', Validators.required),
    prenom: new FormControl('', [Validators.required, Validators.minLength(4)]),
    nom: new FormControl('', [Validators.required, Validators.minLength(4)]),
    password: new FormControl('', Validators.required),
    numAssuranceSocial: new FormControl('', Validators.required),
    sexe: new FormControl('', Validators.required),
    age: new FormControl('', [Validators.required, Validators.min(16)]),
    numTelephone: new FormControl('', Validators.required),
    ville: new FormControl('', Validators.required),
  });

  ngOnInit(): void { this.citoyen = new Citoyen() }

  onSubmit() {
    if (this.addUserForm.get('age').value <= 16) {
      this.validMessage =
        'Vous devez avoir plus de 16 ans pour vous créer un compte!';
    } else if (!this.addUserForm.valid) {
      this.validMessage = 'Please fill the form before submitting!';
    } else {

      this.setCitoyenValue();

      this.serviceMinistere.checkCitoyenValidity(this.citoyen.numAssuranceSocial, this.citoyen.prenom, this.citoyen.nom, this.citoyen.age, this.citoyen.ville).subscribe((data) => {
        this.citoyenValide = data;
        if (data == true) {
          this.servicePermis.saveUser(this.citoyen.nom, this.citoyen.prenom, this.citoyen.email, this.citoyen.password, this.citoyen.numAssuranceSocial, this.citoyen.sexe, this.citoyen.age, this.citoyen.numTelephone, this.citoyen.ville).subscribe((data) => {
            this.citoyen = data;
            this.servicePermis.login(this.citoyen.email, this.citoyen.password).subscribe((data) => {
              this.citoyen = data;
              if (this.citoyen != null) {
                sessionStorage.setItem('citoyen', JSON.stringify(this.citoyen));
                this.router.navigateByUrl('/dashboard');
                this.addUserForm.reset();
              } else {
                this.validMessage = 'Login or password incorrect!';
              }
            }
            )
          });
        } else {
          this.validMessage = 'Vos informations sont invalide. Contacter le ministère';
        }
      });
    }
  }

  private setCitoyenValue() {
    this.citoyen.email = this.addUserForm.get('email').value;
    this.citoyen.prenom = this.addUserForm.get('prenom').value;
    this.citoyen.nom = this.addUserForm.get('nom').value;
    this.citoyen.password = this.addUserForm.get('password').value;
    this.citoyen.numAssuranceSocial = this.addUserForm.get('numAssuranceSocial').value;
    this.citoyen.sexe = this.addUserForm.get('sexe').value;
    this.citoyen.age = this.addUserForm.get('age').value;
    this.citoyen.numTelephone = this.addUserForm.get('numTelephone').value;
    this.citoyen.ville = this.addUserForm.get('ville').value;
  }
}

