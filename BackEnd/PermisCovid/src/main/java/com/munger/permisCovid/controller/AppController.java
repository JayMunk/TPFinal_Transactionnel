package com.munger.permisCovid.controller;

import com.munger.permisCovid.model.Child;
import com.munger.permisCovid.model.Citoyen;
import com.munger.permisCovid.service.SystemService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.io.File;
import java.util.List;

@RestController
public class AppController {

    @Autowired
    SystemService service;

    //login, createUser
    @GetMapping("/citoyens/{email}/{password}")
    public Citoyen login(@PathVariable("email") String email, @PathVariable("password") String password) {
        return service.login(email, password);
    }

    //dashboard
    @GetMapping("/child/enfants/{id}")
    public List<Child> findEnfantsByTuteurId(@PathVariable("id") int idTuteur) {
        return service.findChild(idTuteur);
    }

    //createUser
    @PostMapping("/citoyens/{nom}/{prenom}/{email}/{password}/{nassm}/{sexe}/{age}/{numTelephone}/{ville}")
    public Citoyen createUser(@PathVariable int age, @PathVariable String email, @PathVariable String nassm, @PathVariable String nom, @PathVariable String numTelephone, @PathVariable String password, @PathVariable String prenom, @PathVariable String sexe, @PathVariable String ville) {
        Citoyen c1 = new Citoyen(nom, prenom, email, password, nassm, sexe, age, numTelephone, ville);
        return service.createUser(c1);
    }

    //createChild
    @PostMapping("/child/{nom}/{prenom}/{nassm}/{sexe}/{age}/{ville}/{idTuteur}")
    public Child createChild(@PathVariable int age, @PathVariable String nassm, @PathVariable String nom, @PathVariable String prenom, @PathVariable String sexe, @PathVariable String ville, @PathVariable int idTuteur) {
        Child c1 = new Child(nom, prenom, nassm, sexe, age, ville, idTuteur);
        return service.createChild(c1);
    }

    //requestPermis Adulte
    @PostMapping("/citoyens/{nassm}&{typePermis}")
    public Citoyen createPermisUser(@PathVariable("nassm") String nassm, @PathVariable("typePermis") String typePermis) throws Exception {
        return service.requestPermisUser(nassm, typePermis);
    }

    //requestPermis Adulte
    @PostMapping("/child/{nassm}&{typePermis}")
    public Child createPermisChild(@PathVariable("nassm") String nassm, @PathVariable("typePermis") String typePermis) throws Exception {
        return service.requestPermisChild(nassm, typePermis);
    }

    //renewPermis user
    @PostMapping("/citoyens/renew/{id}")
    public Citoyen updatePermisUser(@PathVariable("id") int id) {
        return service.renewPermisUser(id);
    }

    //renewPermis child
    @PostMapping("/child/renew/{id}")
    public Child updatePermisChild(@PathVariable("id") int id) {
        return service.renewPermisChild(id);
    }

    //requestPermis Adulte
    @GetMapping("/citoyen/permisExist?/{nassm}")
    public boolean checkIfPermisAdulteTestedExist(@PathVariable("nassm") String nassm) {
        return service.citoyenHasPermisTested(nassm);
    }

    //requestPermis Child
    @GetMapping("/child/permisExist?/{nassm}")
    public boolean checkIfPermisChildTestedExist(@PathVariable("nassm") String nassm) {
        return service.childHasPermisTested(nassm);
    }

    @GetMapping("/citoyens&{id}&/email/{email}")
    public boolean sendPermisEmail(@PathVariable("id") int id, @PathVariable("email") String email) throws Exception {
        return service.sendEmail(email, id);
    }

    @GetMapping("/citoyens&{id}")
    public File getPDF(@PathVariable("id") int id) {
        return service.getPDF(id);
    }
}
