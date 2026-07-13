import os
import sys
import subprocess

# Auto-install reportlab if it's missing
try:
    from reportlab.lib.pagesizes import A4
    from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, KeepTogether
    from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
    from reportlab.lib import colors
    from reportlab.pdfgen import canvas
except ImportError:
    print("ReportLab is not installed. Installing reportlab library...")
    subprocess.run([sys.executable, "-m", "pip", "install", "--user", "reportlab"], check=True)
    from reportlab.lib.pagesizes import A4
    from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, KeepTogether
    from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
    from reportlab.lib import colors
    from reportlab.pdfgen import canvas

# NumberedCanvas for professional running headers/footers with dynamic page count
class NumberedCanvas(canvas.Canvas):
    def __init__(self, *args, **kwargs):
        super(NumberedCanvas, self).__init__(*args, **kwargs)
        self._saved_page_states = []

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        num_pages = len(self._saved_page_states)
        for state in self._saved_page_states:
            self.__dict__.update(state)
            self.draw_page_decorations(num_pages)
            super(NumberedCanvas, self).showPage()
        super(NumberedCanvas, self).save()

    def draw_page_decorations(self, page_count):
        self.saveState()
        # Page 1 is the cover page, so no header/footer there
        if self._pageNumber > 1:
            self.setFont("Times-Roman", 9)
            self.setFillColor(colors.black)
            
            # Running Header
            self.drawString(54, 790, "Rapport d'Évolution - Projet Bénin Cadeau (MVP)")
            self.setStrokeColor(colors.black)
            self.setLineWidth(0.5)
            self.line(54, 782, 541, 782)
            
            # Running Footer
            page_text = f"Page {self._pageNumber} sur {page_count}"
            self.drawRightString(541, 42, page_text)
            self.drawString(54, 42, "Bénin Cadeau - SICMA & Associés")
            self.line(54, 55, 541, 55)
            
        self.restoreState()

def create_report(output_path):
    # Setup document
    doc = SimpleDocTemplate(
        output_path,
        pagesize=A4,
        leftMargin=54,
        rightMargin=54,
        topMargin=72,
        bottomMargin=72
    )
    
    # Custom Styles (Times New Roman, 1.5 line spacing, strictly black text)
    styles = getSampleStyleSheet()
    
    title_style = ParagraphStyle(
        'CoverTitle',
        parent=styles['Normal'],
        fontName='Times-Bold',
        fontSize=24,
        leading=36,
        alignment=1, # Center
        textColor=colors.black,
        spaceAfter=15
    )
    
    subtitle_style = ParagraphStyle(
        'CoverSubtitle',
        parent=styles['Normal'],
        fontName='Times-Italic',
        fontSize=12,
        leading=18,
        alignment=1, # Center
        textColor=colors.black,
        spaceAfter=40
    )
    
    meta_style = ParagraphStyle(
        'CoverMeta',
        parent=styles['Normal'],
        fontName='Times-Roman',
        fontSize=10,
        leading=15,
        alignment=0, # Left
        textColor=colors.black,
        spaceAfter=10
    )
    
    h1_style = ParagraphStyle(
        'Header1',
        parent=styles['Heading1'],
        fontName='Times-Bold',
        fontSize=14,
        leading=21,
        textColor=colors.black,
        spaceBefore=14,
        spaceAfter=8,
        keepWithNext=True
    )
    
    body_style = ParagraphStyle(
        'BodyText',
        parent=styles['Normal'],
        fontName='Times-Roman',
        fontSize=10,
        leading=15, # 10 * 1.5
        textColor=colors.black,
        spaceAfter=6
    )

    table_header_style = ParagraphStyle(
        'TableHeader',
        parent=styles['Normal'],
        fontName='Times-Bold',
        fontSize=9,
        leading=13.5,
        textColor=colors.black
    )

    table_cell_style = ParagraphStyle(
        'TableCell',
        parent=styles['Normal'],
        fontName='Times-Roman',
        fontSize=8.5,
        leading=12.75,
        textColor=colors.black
    )

    signature_title_style = ParagraphStyle(
        'SigTitle',
        parent=styles['Normal'],
        fontName='Times-Bold',
        fontSize=10.5,
        leading=15.75,
        alignment=2, # Right
        textColor=colors.black,
        spaceBefore=40,
        spaceAfter=4
    )
    
    signature_name_style = ParagraphStyle(
        'SigName',
        parent=styles['Normal'],
        fontName='Times-Roman',
        fontSize=10.5,
        leading=15.75,
        alignment=2, # Right
        textColor=colors.black,
        spaceAfter=15
    )

    story = []
    
    # ------------------ PAGE 1: COVER PAGE ------------------
    story.append(Spacer(1, 150))
    story.append(Paragraph("RAPPORT D'ÉVOLUTION ET D'AVANCEMENT", title_style))
    story.append(Paragraph("Projet « Bénin Cadeau »  Plateforme E-commerce (MVP)", subtitle_style))
    
    story.append(Spacer(1, 80))
    
    # Metadata Table (Cover Page Info)
    meta_data = [
        [Paragraph("<b>Date de rapport :</b>", meta_style), Paragraph("13 Juillet 2026", meta_style)],
        [Paragraph("<b>Statut actuel :</b>", meta_style), Paragraph("Phase de Pré-production (~80% complété)", meta_style)],
        [Paragraph("<b>Cible de livraison :</b>", meta_style), Paragraph("Juillet 2026 (Fin de la Phase 6)", meta_style)],
    ]
    meta_table = Table(meta_data, colWidths=[130, 300])
    meta_table.setStyle(TableStyle([
        ('ALIGN', (0,0), (-1,-1), 'LEFT'),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4),
        ('TOPPADDING', (0,0), (-1,-1), 4),
        ('LEFTPADDING', (0,0), (-1,-1), 0),
        ('LINEBELOW', (0,0), (-1,-1), 0.5, colors.white), # Invisible border
    ]))
    story.append(meta_table)
    story.append(PageBreak())
    
    # ------------------ PAGE 2: INTRODUCTION & TABLE ------------------
    story.append(Paragraph("1. Introduction", h1_style))
    story.append(Paragraph(
        "Conformément au cahier des charges initial validé pour le projet <b>Bénin Cadeau</b>, "
        "l'application est conçue comme une plateforme e-commerce spécialisée dans la vente de cadeaux personnalisés "
        "et de paniers de ravitaillement pour le Bénin (Cotonou et environs). "
        "Le périmètre du MVP (Minimum Viable Product) consiste à proposer un site internet mobile-friendly "
        "complet permettant le parcours du catalogue, la personnalisation simple, la commande, "
        "le paiement sécurisé via FedaPay (Mobile Money et cartes) et la gestion par un back-office. "
        "À ce jour, le développement technique est à un taux d'avancement global de <b>80%</b>.", body_style))
    
    story.append(Spacer(1, 4))
    story.append(Paragraph("2. État d'Avancement des Modules", h1_style))
    
    # Table data
    table_data = [
        [
            Paragraph("Module", table_header_style), 
            Paragraph("Prog.", table_header_style), 
            Paragraph("Ce qui a été fait", table_header_style),
            Paragraph("Ce qu'il reste à faire", table_header_style)
        ],
        [
            Paragraph("<b>Base de données</b>", table_cell_style),
            Paragraph("100%", table_cell_style),
            Paragraph("Schéma Prisma déployé. Script de seeding (seed.ts) opérationnel avec données historiques.", table_cell_style),
            Paragraph("Néant (Entièrement finalisé).", table_cell_style)
        ],
        [
            Paragraph("<b>Interface Client (Front-end)</b>", table_cell_style),
            Paragraph("95%", table_cell_style),
            Paragraph("Pages catalogue, produit, panier, tunnel de commande, confirmation et espace compte client fonctionnels.", table_cell_style),
            Paragraph("Ajustements mineurs sur le style responsive.", table_cell_style)
        ],
        [
            Paragraph("<b>Paiements & Webhooks</b>", table_cell_style),
            Paragraph("90%", table_cell_style),
            Paragraph("Intégration FedaPay (XOF) et redirection. Webhook opérationnel pour valider les commandes payées.", table_cell_style),
            Paragraph("Basculer de l'environnement Sandbox vers Live.", table_cell_style)
        ],
        [
            Paragraph("<b>Back-office Admin</b>", table_cell_style),
            Paragraph("80%", table_cell_style),
            Paragraph("Dashboard KPIs, graphiques (ApexCharts/Recharts), listes de décision et gestionnaires prêts.", table_cell_style),
            Paragraph("Formulaires produits avec upload de photos.", table_cell_style)
        ],
        [
            Paragraph("<b>Emails SMTP</b>", table_cell_style),
            Paragraph("90%", table_cell_style),
            Paragraph("Intégration Nodemailer avec templates de confirmation de commande et de paiement.", table_cell_style),
            Paragraph("Remplacer le serveur SMTP de test (Mailtrap) par celui de production.", table_cell_style)
        ],
        [
            Paragraph("<b>Sécurisation des Accès</b>", table_cell_style),
            Paragraph("70%", table_cell_style),
            Paragraph("Protection des API. Écran de connexion admin (/admin/login) configuré.", table_cell_style),
            Paragraph("Verrouillage final des API d'administration.", table_cell_style)
        ],
        [
            Paragraph("<b>Finition & SEO</b>", table_cell_style),
            Paragraph("40%", table_cell_style),
            Paragraph("Structure technique et URLs lisibles en place.", table_cell_style),
            Paragraph("Méta-descriptions, alt tags images et sitemap.xml.", table_cell_style)
        ]
    ]
    
    modules_table = Table(table_data, colWidths=[90, 45, 177, 175])
    modules_table.setStyle(TableStyle([
        ('GRID', (0,0), (-1,-1), 0.5, colors.black),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('ALIGN', (0,0), (-1,-1), 'LEFT'),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4),
        ('TOPPADDING', (0,0), (-1,-1), 4),
        ('LEFTPADDING', (0,0), (-1,-1), 4),
        ('RIGHTPADDING', (0,0), (-1,-1), 4),
    ]))
    story.append(modules_table)
    story.append(PageBreak())
    
    # ------------------ PAGE 3: CONCLUSION & SIGNATURE ------------------
    story.append(Paragraph("3. Conclusion", h1_style))
    story.append(Paragraph(
        "Le projet <b>Bénin Cadeau (MVP)</b> est à un stade très avancé avec un taux de réalisation global de <b>80%</b>. "
        "L'ensemble du noyau fonctionnel (structure de base, navigation, tunnel de commande, paiement FedaPay, et back-office) "
        "est opérationnel et validé dans un environnement de test.", body_style))
    
    story.append(Paragraph(
        "Les 20% restants n'ont pas encore pu être finalisés en raison de la refonte de la partie client "
        "qui a demandé plus de temps que prévu, ainsi que de l'intégration et de la mise au point du design du back-office "
        "(dashboard et graphiques statistiques d'administration) qui ont également été particulièrement chronophages.", body_style))

    story.append(Paragraph(
        "Un délai d'<b>une semaine</b> est estimé suffisant pour achever ces derniers travaux techniques "
        "(verrouillage des accès de sécurité admin, gestion d'upload médias, liaison des comptes de production FedaPay et SMTP, et finitions SEO) "
        "afin de livrer la plateforme dans un état totalement stable et prêt pour la mise en ligne.", body_style))
    
    story.append(Spacer(1, 40))
    
    # Signature block showing "Le Stagiaire \n Lazare Metonou KOHOUNDE" (Right aligned)
    story.append(Paragraph("<b>Le Stagiaire</b>", signature_title_style))
    story.append(Paragraph("Lazare Metonou KOHOUNDE", signature_name_style))
    
    # Build Document
    doc.build(story, canvasmaker=NumberedCanvas)
    print("PDF report successfully created.")

if __name__ == "__main__":
    output_filename = "Rapport-Evolution-Benin-Cadeau.pdf"
    if len(sys.argv) > 1:
        output_filename = sys.argv[1]
    
    create_report(output_filename)
