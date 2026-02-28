# CarConnect 🚗

Une plateforme innovante de mise en relation entre particuliers et professionnels de l'automobile, développée avec Next.js 14.

## 🌟 Fonctionnalités

### 👤 Espace Utilisateur

- Recherche avancée de véhicules avec filtres
- Système de messagerie intégré
- Gestion des favoris
- Profil personnalisable
- Historique des recherches
- Notifications en temps réel

### 🏢 Espace Professionnel

- Dashboard de gestion
- Publication et gestion d'annonces
- Suivi des leads
- Statistiques détaillées
- Gestion de la vitrine en ligne

### 👨‍💼 Administration

- Gestion complète des utilisateurs
- Modération des annonces
- Tableaux de bord analytiques
- Configuration système

## 🛠️ Technologies

### Frontend

- Next.js 14 (App Router)
- React avec TypeScript
- Tailwind CSS
- Shadcn/ui
- React Query
- Framer Motion

### Backend

- API Routes Next.js
- Prisma ORM
- PostgreSQL
- NextAuth.js

### Autres

- next-intl pour l'internationalisation
- Vercel Analytics
- Axios pour les requêtes HTTP

## 🚀 Installation

```bash
# Cloner le repository
git clone https://github.com/votre-username/drivemetric.git

# Accéder au dossier
cd carconnect

# Installer les dépendances
npm install

# Copier le fichier d'environnement
cp .env.example .env.local

# Configurer la base de données
npx prisma migrate dev

# Lancer le serveur de développement
npm run dev
```

## 📁 Structure du Projet

```
src/
├── app/                    # Routes et pages
│   ├── [locale]/          # Routes internationalisées
│   ├── api/               # Routes API
│   └── ...
├── components/            # Composants React
│   ├── ui/               # Composants UI réutilisables
│   ├── admin/            # Composants administration
│   └── ...
├── lib/                   # Utilitaires et configurations
├── prisma/               # Configuration base de données
└── i18n/                 # Fichiers de traduction
```

## ⚙️ Configuration

Créez un fichier `.env.local` avec les variables suivantes :

```env
DATABASE_URL="postgresql://..."
NEXTAUTH_SECRET="votre-secret"
GOOGLE_CLIENT_ID="votre-client-id"
GOOGLE_CLIENT_SECRET="votre-client-secret"
```

## 🌐 Internationalisation

Le projet supporte actuellement :

- 🇫🇷 Français (par défaut)
- 🇬🇧 Anglais

## 📱 Responsive Design

L'application est optimisée pour :

- 📱 Mobile (>= 320px)
- 💻 Tablette (>= 768px)
- 🖥️ Desktop (>= 1024px)

## 🔐 Sécurité

- Authentification sécurisée via NextAuth.js
- Protection CSRF
- Validation des données
- Gestion des rôles et permissions

## 🚀 Déploiement

```bash
# Build du projet
npm run build

# Démarrer en production
npm start
```

Le projet est configuré pour un déploiement automatique sur Vercel.

## 📝 License

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 🤝 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à :

1. Fork le projet
2. Créer une branche (`git checkout -b feature/nouvelle-fonctionnalite`)
3. Commit vos changements (`git commit -m 'Ajout d'une nouvelle fonctionnalité'`)
4. Push sur la branche (`git push origin feature/nouvelle-fonctionnalite`)
5. Ouvrir une Pull Request

## 📫 Contact

Pour toute question ou suggestion :

- Ouvrir une issue
- Envoyer un email à nicolas-abreu@live.fr

---

Développé avec ❤️
