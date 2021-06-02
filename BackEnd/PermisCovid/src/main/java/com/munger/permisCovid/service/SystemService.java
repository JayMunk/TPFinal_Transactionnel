package com.munger.permisCovid.service;

import com.munger.permisCovid.model.Child;
import com.munger.permisCovid.model.Citoyen;
import com.munger.permisCovid.model.Permis;
import com.munger.permisCovid.repository.ChildRepository;
import com.munger.permisCovid.repository.CitoyenRepository;
import com.munger.permisCovid.repository.PermisRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.File;
import java.nio.file.FileSystems;
import java.nio.file.Path;
import java.time.LocalDate;
import java.util.List;

import com.google.zxing.BarcodeFormat;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.qrcode.QRCodeWriter;
import com.itextpdf.io.image.ImageDataFactory;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.Image;
import com.itextpdf.layout.element.Paragraph;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;

import javax.mail.Transport;
import javax.mail.internet.MimeMessage;

@Service
public class SystemService {
    private static final String HOME = System.getProperty("user.home");
    private static final String FILE_PATH = HOME + "/Downloads/";
    @Autowired
    private CitoyenRepository citoyenRepository;
    @Autowired
    private PermisRepository permisRepository;
    @Autowired
    private ChildRepository childRepository;

    @Autowired(required = false)
    private JavaMailSender mailSender;

    public Citoyen login(String email, String pwd) {
        return citoyenRepository.findCitoyenByEmailAndPassword(email, pwd);
    }

    public boolean isLoginExist(String email) {
        return citoyenRepository.findCitoyenByEmail(email) != null;
    }

    public boolean citoyenHasPermis(String email) {
        Citoyen c1 = citoyenRepository.findCitoyenByEmail(email);
        return permisRepository.findPermisByIdCitoyen(c1.getIdUser()) != null;
    }

    public Citoyen renewPermisUser(int id) {
        Permis permis = permisRepository.findPermisByIdCitoyen(id);
        renewPermis(permis);
        return citoyenRepository.findCitoyenByIdUser(id);
    }

    public Child renewPermisChild(int id) {
        Permis permis = permisRepository.findPermisByIdChild(id);
        renewPermis(permis);
        return childRepository.findChildByIdChild(id);
    }

    private void renewPermis(Permis permis) {
        if (permis.getDateExpiration() != null) {
            permis.renouveler();
            permisRepository.save(permis);
        }
    }

    public Citoyen requestPermisUser(String nassm, String typePermis) throws Exception {
        Citoyen c1 = citoyenRepository.findCitoyenByNumAssuranceSocial(nassm);
        Permis p1;
        if (typePermis.equals("Vaccinated")) {
            p1 = new Permis(c1.getIdUser(), -1, true, false);
            permisRepository.save(p1);
            c1.setPermis(p1.getIdPermis());
            citoyenRepository.save(c1);
            generateQR(String.valueOf(p1), c1.getIdUser());
            generatePDF(c1.getPrenom(), c1.getIdUser());
        } else if (typePermis.equals("Tested")) {
            p1 = new Permis(c1.getIdUser(), -1, false, true);
            p1.setDateExpiration(LocalDate.now().plusDays(14));
            permisRepository.save(p1);
            c1.setPermis(p1.getIdPermis());
            citoyenRepository.save(c1);
            generateQR(String.valueOf(p1), c1.getIdUser());
            generatePDF(c1.getPrenom(), c1.getIdUser());
        }
        return c1;
    }

    public Child requestPermisChild(String nassm, String typePermis) throws Exception {
        Child c1 = childRepository.findChildByNumAssuranceSocial(nassm);
        Permis p1;
        if (typePermis.equals("Vaccinated")) {
            p1 = new Permis(-1, c1.getIdChild(), true, false);
            permisRepository.save(p1);
            c1.setPermis(p1.getIdPermis());
            childRepository.save(c1);
            generateQR(String.valueOf(p1), c1.getIdChild());
            generatePDF(c1.getPrenom(), c1.getIdChild());
        } else if (typePermis.equals("Tested")) {
            p1 = new Permis(-1, c1.getIdChild(), false, true);
            p1.setDateExpiration(LocalDate.now().plusDays(14));
            permisRepository.save(p1);
            c1.setPermis(p1.getIdPermis());
            childRepository.save(c1);
            generateQR(String.valueOf(p1), c1.getIdChild());
            generatePDF(c1.getPrenom(), c1.getIdChild());
        }
        return c1;
    }

    public void generateQR(String data, int id) throws Exception {
        Path path = FileSystems.getDefault().getPath(FILE_PATH + id + ".png");
        QRCodeWriter qr = new QRCodeWriter();
        MatrixToImageWriter.writeToPath(qr.encode(data, BarcodeFormat.QR_CODE,
                //Integer.parseInt(environment.getProperty("qrCode.with")),
                //Integer.parseInt(environment.getProperty("qrCode.height"))),
                //environment.getProperty("qrCode.extension"),
                300, 300),
                "PNG",
                path);
    }

    public void generatePDF(String prenom, int id) throws Exception {
        PdfWriter writer = new PdfWriter(FILE_PATH + id + ".pdf");

        PdfDocument pdf = new PdfDocument(writer);

        Document document = new Document(pdf);
        Image image = new Image(ImageDataFactory.create(FILE_PATH + id + ".png"));

        Paragraph p = new Paragraph("Bonjour " + prenom + "\n")
                .add("Voici ton code permis de sante")
                .add(image);
        document.add(p);
        document.close();
    }

    public boolean sendEmail(String mailTo, int id) throws Exception {
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true);

        helper.setTo(mailTo);
        helper.setSubject("Permis Covid");
        helper.setText("Voici votre permis Covid");
        helper.addAttachment("QR CODE", new File(FILE_PATH + id + ".png"));
        helper.addAttachment("QR PDF", new File(FILE_PATH + id + ".pdf"));

        Transport.send(message);
        return true;
    }

    public Citoyen createUser(Citoyen c) {
        return citoyenRepository.save(c);
    }

    public List<Child> findChild(int idTuteur) {
        return childRepository.findEnfantByIdTuteur(idTuteur);
    }

    public File getPDF(int id) {
        return new File(FILE_PATH + id + ".pdf");
    }

    public Child createChild(Child child) {
        return childRepository.save(child);
    }

    public boolean citoyenHasPermisTested(String nassm) {
        Citoyen c1 = citoyenRepository.findCitoyenByNumAssuranceSocial(nassm);
        return permisRepository.findPermisByIdCitoyenAndIsTestedNegativeIsTrue(c1.getIdUser()) != null;
    }

    public boolean childHasPermisTested(String nassm) {
        Child c1 = childRepository.findChildByNumAssuranceSocial(nassm);
        return permisRepository.findPermisByIdChildAndIsTestedNegativeIsTrue(c1.getIdChild()) != null;
    }
}
