# Haingo Couture — Site web

Site vitrine de luxe (React + Vite) pour l'atelier de couture **Haingo Couture** — *L'élégance et la simplicité*.
Trilingue : **Français · English · Malagasy**. Thème **noir & or**.

## Démarrage

```bash
npm install
npm run dev      # site de développement → http://localhost:5130
npm run build    # build de production dans dist/
npm run preview  # prévisualiser le build
```

## Modifier vos coordonnées

Toutes les coordonnées sont en dur dans **`src/config/site.js`** (aucun `.env`) :
téléphone, WhatsApp, email, Facebook, adresse, horaires, identifiants admin.

- Modifiez la valeur directement dans le fichier, puis redémarrez `npm run dev`
  (ou rebuildez).
- Instagram / TikTok : laissez la chaîne vide pour masquer l'icône.

## Formulaire de contact

Le formulaire envoie les messages vers **haingomalal@gmail.com** via
[FormSubmit](https://formsubmit.co) (endpoint dans `siteConfig.contactFormEndpoint`).

- **À faire une seule fois** : au premier envoi, un email de confirmation arrive
  sur haingomalal@gmail.com — cliquez sur le lien d'activation, sinon les
  messages restent en attente côté FormSubmit.

## Responsive

Le site est adapté jusqu'aux petits écrans (**iPhone SE**, 375 px, et 320 px) :
en-tête compact, grilles repliées, boutons et formulaires redimensionnés.

## Les photos

- Les créations sont dans **`public/creations/`** (39 photos).
- Le catalogue (catégorie + titre FR/EN/MG de chaque photo) est dans **`src/data/creations.js`**.
- Pour ajouter une photo : déposez le fichier dans `public/creations/`, puis ajoutez une ligne dans `src/data/creations.js`.

Catégories utilisées : `mariage`, `traditionnel`, `soiree`, `homme`.

## Logo

- `public/logo.jpg` : original (fond blanc).
- `public/logo.png` : version fond transparent, utilisée dans l'en-tête et le pied de page.

## Traductions

Les textes des 3 langues sont dans **`src/i18n/translations.js`**.
Le sélecteur de langue (FR / EN / MG) est dans l'en-tête ; le choix est mémorisé dans le navigateur.
