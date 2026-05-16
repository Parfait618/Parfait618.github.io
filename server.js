// server.js
const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

// Autoriser le HTML (même hébergé sur GitHub) à communiquer avec le serveur Railway
app.use(cors());
app.use(express.json());

// Simulation d'une base de données nationale en mémoire
const databaseAdresses = {};

// 1. ENDPOINT D'ENREGISTREMENT (Pour les citoyens)
app.post('/api/v1/address/register', (req, res) => {
    const { code, lat, lon, nom, telephone, description } = req.body;

    if (!code || !lat || !lon) {
        return res.status(400).json({ error: "Données manquantes (code, lat ou lon)." });
    }

    // Stockage ou mise à jour dans notre base de données
    databaseAdresses[code.toUpperCase()] = {
        coordinates: { lat: parseFloat(lat), lon: parseFloat(lon) },
        details: {
            nom: nom || "Non renseigné",
            telephone: telephone || "Non renseigné",
            description: description || "Aucune description fournie",
            pays: "Gabon"
        },
        registeredAt: new Date()
    };

    console.log(`[Base Nationale] Nouvelle adresse enregistrée : ${code}`);
    
    res.status(201).json({ 
        success: true, 
        message: "Adresse officiellement enregistrée dans le système national." 
    });
});

// 2. ENDPOINT DE VÉRIFICATION / RECHERCHE (Payant/API pour les entreprises)
app.get('/api/v1/address/reverse', (req, res) => {
    const codeRecherche = req.query.code;

    if (!codeRecherche) {
        return res.status(400).json({ error: "Le paramètre 'code' est obligatoire." });
    }

    const adresseTrouvee = databaseAdresses[codeRecherche.toUpperCase()];

    if (!adresseTrouvee) {
        return res.status(404).json({ error: "Code d'adresse introuvable dans le registre national." });
    }

    // Renvoie le JSON complet à l'entreprise (Livreur, Banque, etc.)
    res.json({
        status: "success",
        data: adresseTrouvee
    });
});

app.listen(PORT, () => {
    console.log(`Serveur National d'Adressage actif sur le port ${PORT}`);
});
