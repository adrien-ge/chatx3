# ChatX3 - Assistant IA pour Sage X3

![ChatX3 Logo](https://img.shields.io/badge/ChatX3-IA%20Assistant-blue?style=for-the-badge&logo=chatbot&color=3c77a1)

Une solution d'intelligence artificielle moderne et intégrée pour optimiser votre ERP Sage X3.

## 🚀 Fonctionnalités

- **Interface moderne** avec design sombre et couleurs personnalisées
- **Authentification sécurisée** avec Supabase
- **Chat IA avancé** avec interface intuitive
- **Responsive design** pour tous les appareils
- **Thème personnalisable** avec palette de couleurs #3c77a1
- **Navigation fluide** entre les différentes sections

## 🎨 Design

- **Palette de couleurs** : Bleu professionnel (#3c77a1) avec accents verts
- **Interface moderne** inspirée des meilleures pratiques UX/UI
- **Animations fluides** et transitions élégantes
- **Backdrop blur** et effets de transparence

## 🛠️ Technologies

- **Frontend** : React 18 + TypeScript
- **Styling** : Tailwind CSS avec classes personnalisées
- **Build Tool** : Vite
- **Authentification** : Supabase
- **Déploiement** : Netlify avec GitHub Actions

## 📦 Installation

```bash
# Cloner le repository
git clone https://github.com/adrien-ge/chatx3.git
cd chatx3

# Installer les dépendances
npm install

# Lancer en mode développement
npm run dev

# Build pour la production
npm run build
```

## 🌐 Déploiement

Le projet est configuré pour un déploiement automatique sur Netlify via GitHub Actions.

### Configuration requise

1. **Variables d'environnement Netlify** :
   - `NETLIFY_AUTH_TOKEN` : Token d'authentification Netlify
   - `NETLIFY_SITE_ID` : ID de votre site Netlify

2. **Configuration Supabase** :
   - Créer un projet Supabase
   - Configurer l'authentification
   - Ajouter les variables d'environnement

## 📱 Pages

- **Landing Page** : Page d'accueil avec présentation du produit
- **Chat Page** : Interface de conversation avec l'IA
- **Authentification** : Modal de connexion/inscription
- **Navigation** : Menu utilisateur et navigation principale

## 🔧 Configuration

### Variables d'environnement

Créez un fichier `.env.local` :

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Configuration Tailwind

Les couleurs personnalisées sont définies dans `src/index.css` :

```css
.bg-custom-blue {
  background-color: #3c77a1;
}

.bg-gradient-custom-blue {
  background: linear-gradient(135deg, #3c77a1 0%, #2d5a7a 100%);
}
```

## 🚀 Déploiement rapide

1. **Fork** ce repository
2. **Connectez** votre compte Netlify
3. **Configurez** les variables d'environnement
4. **Déployez** automatiquement !

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 🤝 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à :

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/AmazingFeature`)
3. Commit vos changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📞 Support

Pour toute question ou support, n'hésitez pas à ouvrir une issue sur GitHub.

---

**ChatX3** - L'intelligence artificielle nouvelle génération pour vos conversations et votre productivité 🚀
