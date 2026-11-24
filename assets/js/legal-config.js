window.LEGAL_CONFIG = {
  companyName: "Picturial",
  legalForm: "[Forme juridique — ex. SAS, SARL, entreprise individuelle]",
  siret: "[SIRET — 14 chiffres]",
  address: "1c rue du Baron Chouard, 67700 Monswiller, France",
  email: "contact@picturial.fr",
  phone: "07 66 74 55 26",
  phoneHref: "+33766745526",
  publicationDirector: "[Prénom Nom — directeur·rice de la publication]",
  dpo: "[Délégué à la protection des données — ou « Non désigné »]",
  host: {
    name: "[Nom de l'hébergeur — ex. OVHcloud, Netlify, Vercel]",
    address: "[Adresse de l'hébergeur]",
    phone: "[Téléphone de l'hébergeur]",
    website: "[Site web de l'hébergeur]"
  },
  lastUpdate: "24 novembre 2026"
};

document.addEventListener("DOMContentLoaded", () => {
  const cfg = window.LEGAL_CONFIG || {};
  document.querySelectorAll("[data-legal]").forEach((el) => {
    const value = el.getAttribute("data-legal").split(".").reduce((acc, key) => (acc == null ? acc : acc[key]), cfg);
    if (value != null) el.textContent = value;
  });
});
