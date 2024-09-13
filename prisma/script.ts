const { PrismaClient } = require("@prisma/client");
const XLSX = require("xlsx");
const path = require("path");

const prisma = new PrismaClient();

interface CarData {
  [key: number]: any;
}

async function main() {
  // Lire le fichier Excel
  const filePath = path.join(__dirname, "../public/data/Car2DB_fra_cut.xlsx");
  const workbook = XLSX.readFile(filePath);

  const sheetName = workbook.SheetNames[0];
  const worksheet: any[][] = XLSX.utils.sheet_to_json(
    workbook.Sheets[sheetName],
    {
      header: 1,
    }
  );

  // Sauter l'en-tête
  const rows: CarData[] = worksheet.slice(1);

  // Parcourir les données et les insérer dans la base de données
  for (const row of rows) {
    await prisma.car.create({
      data: {
        brand: row[1] || "", // Marque
        model: row[2] || "", // Modèle
        generation: row[3] || null, // Génération
        yearStart: parseInt(row[4], 10) || null, // Année de début (Génération)
        yearEnd: parseInt(row[5], 10) || null, // Année de fin (Génération)
        series: row[6] || "", // Série
        version: row[7] || "", // Version
        bodyType: row[8] || "", // Type carrosserie
        seats: parseInt(row[9], 10) || null, // Nombre de places
        length: parseInt(row[10], 10) || null, // Longueur [mm]
        width: parseInt(row[11], 10) || null, // Largeur [mm]
        height: parseInt(row[12], 10) || null, // Hauteur [mm]
        wheelbase: parseInt(row[13], 10) || null, // Empattement [mm]
        frontTrack: parseInt(row[14], 10) || null, // Voie avant [mm]
        rearTrack: parseInt(row[15], 10) || null, // Voie arrière [mm]
        frontLoad: parseInt(row[16], 10) || null, // Charge sur l'avant/essieu arrière [kg]
        loadHeight: parseInt(row[17], 10) || null, // Hauteur de chargement [mm]
        cargoDims: row[18] || "", // Soute (Longueur x Largeur x Hauteur) [mm]
        cargoVolume: parseFloat(row[19]) || null, // Volume de la soute [m3]
        curbWeight: parseInt(row[20], 10) || null, // Poids à vide [kg]
        groundClearance: parseInt(row[21], 10) || null, // Garde au sol [mm]
        maxCargoVolume: parseInt(row[22], 10) || null, // Volume de coffre maximum [l]
        minCargoVolume: parseInt(row[23], 10) || null, // Volume de coffre minimum [l]
        payload: parseInt(row[24], 10) || null, // Capacité de charge [kg]
        grossWeight: parseInt(row[25], 10) || null, // Poids brut [kg]
        maxTowingWeight: parseInt(row[26], 10) || null, // Masse maximale autorisée de l'ensemble routier [kg]
        engineType: row[27] || "", // Type de moteur
        displacement: parseInt(row[28], 10) || null, // Cylindrée [cm3]
        horsepower: parseInt(row[29], 10) || null, // Puissance de moteur [ch]
        maxPowerRpm: parseInt(row[30], 10) || null, // Régime de puissance maximale [tr/min]
        maxTorque: parseInt(row[31], 10) || null, // Couple maximal [N*m]
        induction: row[32] || "", // Type d'admission
        cylinderLayout: row[33] || "", // Emplacement des cylindres
        cylinders: parseInt(row[34], 10) || null, // Nombre de cylindres
        forcedInduction: row[35] || "", // Type de suralimentation
        bore: parseInt(row[36], 10) || null, // Diamètre de cylindre [mm]
        stroke: parseInt(row[37], 10) || null, // Course de piston [mm]
        valvesPerCylinder: parseInt(row[38], 10) || null, // Nombre de soupapes par cylindre
        maxTorqueRpm: parseInt(row[39], 10) || null, // Régime de couple maximal [tr/min]
        intercooler: row[40] === "Oui", // Présence d'un intercooler
        transmissionType: row[41] || "", // Type de transmission
        actuator: row[42] || "", // Actionneur
        turningDiameter: parseFloat(row[43]) || null, // Diamètre de rotation [m]
        gears: parseInt(row[44], 10) || null, // Nombre de vitesses
        fuelType: row[45] || "", // Marque de carburant
        maxSpeed: parseInt(row[46], 10) || null, // Vitesse max [km/h]
        urbanConsumption: parseFloat(row[47]) || null, // Consommation urbaine sur 100 km [l]
        combinedConsumption: parseFloat(row[48]) || null, // Consommation mixte sur 100 km [l]
        acceleration: parseFloat(row[49]) || null, // Accélération (0-100 km/h) [seconde]
        range: parseInt(row[50], 10) || null, // Réserve de marche [km]
        emissionStandard: row[51] || "", // Norme environnementale
        fuelTank: parseInt(row[52], 10) || null, // Réservoir [l]
        highwayConsumption: parseFloat(row[53]) || null, // Consommation route sur 100 km [l]
        frontBrakes: row[54] || "", // Freins avant
        rearBrakes: row[55] || "", // Freins arrière
        frontSuspension: row[56] || "", // Suspension avant
        rearSuspension: row[57] || "", // Suspension arrière
      },
    });
  }

  console.log("Données insérées avec succès");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
