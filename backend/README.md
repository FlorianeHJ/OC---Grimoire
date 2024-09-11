Bienvenue dans le backend du projet - Mon vieux Grimoire

Mon vieux Grimoire est un site de référencement et de notation de livres.

// Technologies

Ce projet utilise les technologies suivantes :

- Node.js: Environnement d'exécution JavaScript côté serveur.
- Express: Framework pour faciliter la création d'API RESTful.
- MongoDB: Base de données NoSQL pour le stockage des données.
- Mongoose: Bibliothèque pour interagir avec MongoDB.
- bcrypt: Bibliothèque pour le hachage des mots de passe.
- dotenv: Gestion des variables d'environnement.
- jsonwebtoken: Gestion des JSON Web Tokens pour l'authentification.
- express-rate-limit: Protection contre les attaques par force brute.
- multer: Gestion du téléchargement de fichiers.
- sharp: Traitement des images.
- uuid: Génération d'identifiants uniques.

// Installation avec git/github

Clonez le dépôt :
git clone https://github.com/FlorianeHJ/OC---Grimoire.git

Accédez au répertoire du projet :
cd oc---grimoire

Installez les dépendances :
npm install

Crééez un fichier .env puis rajoutez les données suivantes :
MONGO_URI={le lien pour vos infos de connexion de votre bdd}

JWT_SECRET={votre code secret ici}

// Utilisation

Démarrez le serveur :
npm start

- L'application sera disponible à l'adresse http://localhost:3000.
