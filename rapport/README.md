# Générateur de Rapport d'Évolution - Bénin Cadeau (MVP)

Ce dossier contient le script d'automatisation utilisé pour générer le rapport officiel d'évolution et d'avancement pour le projet Bénin Cadeau.

Le document PDF généré respecte les contraintes strictes demandées :
*   **Mise en page** : Maximum 3 pages, format A4, marges équilibrées.
*   **Style** : Police *Times New Roman*, interligne de *1,5*, couleur du texte *noire* intégrale.
*   **Pied de page** : Numérotation dynamique (« Page X sur Y ») et titre « Bénin Cadeau - SICMA & Associés ».

---

## 🛠️ Instructions d'utilisation

Pour régénérer ou mettre à jour le rapport PDF, suivez les étapes ci-dessous dans votre terminal :

### 1. Création d'un environnement virtuel Python (Recommandé)
Pour isoler proprement les paquets et éviter les conflits système (PEP 668) :
```bash
python3 -m venv venv
```

### 2. Activation de l'environnement
*   **Sur Linux / macOS** :
    ```bash
    source venv/bin/activate
    ```
*   **Sur Windows** (Command Prompt / Powershell) :
    ```cmd
    venv\Scripts\activate
    ```

### 3. Installation des dépendances
La seule bibliothèque externe requise est `reportlab` :
```bash
pip install reportlab
```

### 4. Lancement du script
Pour générer le rapport PDF dans le dossier parent (racine du projet) :
```bash
python generate_report.py ../Rapport-Evolution-Benin-Cadeau.pdf
```

---

## 📝 Modification du contenu

Si vous devez modifier les textes du rapport (par exemple, changer les pourcentages de progression ou ajouter un module de tableau), ouvrez simplement le fichier `generate_report.py` dans votre éditeur de code.

*   **Le tableau** est modifiable dans la variable `table_data` de la fonction `create_report`.
*   **La conclusion** et l'**introduction** sont des objets `Paragraph` que vous pouvez modifier textuellement.
*   Le script utilise les balises HTML de base (comme `<b>`, `<i>`, et `<br/>`) supportées par ReportLab pour le formatage riche.
