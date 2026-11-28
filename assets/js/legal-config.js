window.LEGAL_CONFIG = {
  companyName: "Picturial",
  legalForm: "SARL",
  siret: "388 235 152 00039",
  address: "1c rue du Baron Chouard, 67700 Monswiller, France",
  email: "contact@picturial.fr",
  phone: "07 66 74 55 26",
  phoneHref: "+33766745526",
  publicationDirector: "Christian Klein",
  dpo: "Non désigné (non requis à ce stade — art. 37 du RGPD)",
  host: {
    name: "OVHcloud SAS",
    address: "2 rue Kellermann, 59100 Roubaix, France",
    phone: "+33 9 72 10 10 07",
    website: "https://www.ovhcloud.com"
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
