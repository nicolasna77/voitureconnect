"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import axios from "axios";

const departements = [
  { code: "01", nom: "Ain" },
  { code: "02", nom: "Aisne" },
  { code: "03", nom: "Allier" },
  { code: "04", nom: "Alpes-de-Haute-Provence" },
  { code: "05", nom: "Hautes-Alpes" },
  { code: "06", nom: "Alpes-Maritimes" },
  { code: "07", nom: "Ardèche" },
  { code: "08", nom: "Ardennes" },
  { code: "09", nom: "Ariège" },
  { code: "10", nom: "Aube" },
  { code: "11", nom: "Aude" },
  { code: "12", nom: "Aveyron" },
  { code: "13", nom: "Bouches-du-Rhône" },
  { code: "14", nom: "Calvados" },
  { code: "15", nom: "Cantal" },
  { code: "16", nom: "Charente" },
  { code: "17", nom: "Charente-Maritime" },
  { code: "18", nom: "Cher" },
  { code: "19", nom: "Corrèze" },
  { code: "2A", nom: "Corse-du-Sud" },
  { code: "2B", nom: "Haute-Corse" },
  { code: "21", nom: "Côte-d'Or" },
  { code: "22", nom: "Côtes-d'Armor" },
  { code: "23", nom: "Creuse" },
  { code: "24", nom: "Dordogne" },
  { code: "25", nom: "Doubs" },
  { code: "26", nom: "Drôme" },
  { code: "27", nom: "Eure" },
  { code: "28", nom: "Eure-et-Loir" },
  { code: "29", nom: "Finistère" },
  { code: "30", nom: "Gard" },
  { code: "31", nom: "Haute-Garonne" },
  { code: "32", nom: "Gers" },
  { code: "33", nom: "Gironde" },
  { code: "34", nom: "Hérault" },
  { code: "35", nom: "Ille-et-Vilaine" },
  { code: "36", nom: "Indre" },
  { code: "37", nom: "Indre-et-Loire" },
  { code: "38", nom: "Isère" },
  { code: "39", nom: "Jura" },
  { code: "40", nom: "Landes" },
  { code: "41", nom: "Loir-et-Cher" },
  { code: "42", nom: "Loire" },
  { code: "43", nom: "Haute-Loire" },
  { code: "44", nom: "Loire-Atlantique" },
  { code: "45", nom: "Loiret" },
  { code: "46", nom: "Lot" },
  { code: "47", nom: "Lot-et-Garonne" },
  { code: "48", nom: "Lozère" },
  { code: "49", nom: "Maine-et-Loire" },
  { code: "50", nom: "Manche" },
  { code: "51", nom: "Marne" },
  { code: "52", nom: "Haute-Marne" },
  { code: "53", nom: "Mayenne" },
  { code: "54", nom: "Meurthe-et-Moselle" },
  { code: "55", nom: "Meuse" },
  { code: "56", nom: "Morbihan" },
  { code: "57", nom: "Moselle" },
  { code: "58", nom: "Nièvre" },
  { code: "59", nom: "Nord" },
  { code: "60", nom: "Oise" },
  { code: "61", nom: "Orne" },
  { code: "62", nom: "Pas-de-Calais" },
  { code: "63", nom: "Puy-de-Dôme" },
  { code: "64", nom: "Pyrénées-Atlantiques" },
  { code: "65", nom: "Hautes-Pyrénées" },
  { code: "66", nom: "Pyrénées-Orientales" },
  { code: "67", nom: "Bas-Rhin" },
  { code: "68", nom: "Haut-Rhin" },
  { code: "69", nom: "Rhône" },
  { code: "70", nom: "Haute-Saône" },
  { code: "71", nom: "Saône-et-Loire" },
  { code: "72", nom: "Sarthe" },
  { code: "73", nom: "Savoie" },
  { code: "74", nom: "Haute-Savoie" },
  { code: "75", nom: "Paris" },
  { code: "76", nom: "Seine-Maritime" },
  { code: "77", nom: "Seine-et-Marne" },
  { code: "78", nom: "Yvelines" },
  { code: "79", nom: "Deux-Sèvres" },
  { code: "80", nom: "Somme" },
  { code: "81", nom: "Tarn" },
  { code: "82", nom: "Tarn-et-Garonne" },
  { code: "83", nom: "Var" },
  { code: "84", nom: "Vaucluse" },
  { code: "85", nom: "Vendée" },
  { code: "86", nom: "Vienne" },
  { code: "87", nom: "Haute-Vienne" },
  { code: "88", nom: "Vosges" },
  { code: "89", nom: "Yonne" },
  { code: "90", nom: "Territoire de Belfort" },
  { code: "91", nom: "Essonne" },
  { code: "92", nom: "Hauts-de-Seine" },
  { code: "93", nom: "Seine-Saint-Denis" },
  { code: "94", nom: "Val-de-Marne" },
  { code: "95", nom: "Val-d'Oise" },
  { code: "971", nom: "Guadeloupe" },
  { code: "972", nom: "Martinique" },
  { code: "973", nom: "Guyane" },
  { code: "974", nom: "La Réunion" },
  { code: "976", nom: "Mayotte" },
];

const ValorCg = () => {
  const [plaque, setPlaque] = useState("");
  const [region, setRegion] = useState("");
  const [cout, setCout] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const calculerCout = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (!plaque || !region) {
      setError("Veuillez remplir tous les champs");
      return;
    }

    console.log(region);
    const options = {
      method: "GET",
      url: "https://api-simulateur-de-cout-carte-grise-france.p.rapidapi.com/calc",
      params: {
        plaque: plaque,
        departement: region.slice(0, 2),
        demarche: "1",
      },
      headers: {
        "x-rapidapi-key": process.env.NEXT_PUBLIC_RAPIDAPI_KEY,
        "x-rapidapi-host":
          "api-simulateur-de-cout-carte-grise-france.p.rapidapi.com",
      },
    };

    try {
      const response = await axios.request(options);
      setCout(response.data.cout);
      console.log(response.data);
    } catch (error) {
      console.error(error);
      setError(
        "Une erreur s'est produite lors du calcul. Veuillez vérifier votre clé API et réessayer."
      );
    }
  };

  return (
    <div className="py-8">
      <Card className="w-full my-12 max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold text-primary">
            SIMULER LE PRIX DE VOTRE CARTE GRISE
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={calculerCout}
            className="space-y-4 max-w-md py-8 m-auto"
          >
            <div className="space-y-2 flex flex-col items-center">
              <Label htmlFor="immat">Plaque d&apos;immatriculation</Label>
              <div className="relative before:content-[''] before:z-10 before:absolute before:top-[0px] before:w-[30px] before:h-[57px] before:bg-[#1677af] before:rounded-[3px] before:bg-[url('https://guichetcartegrise.com/img/plaque-france.png')] before:bg-no-repeat before:bg-center before:bg-contain before:ml-0">
                <Input
                  id="immat"
                  type="text"
                  size={80}
                  value={plaque}
                  className="h-[57px] text-xl pl-20 w-[300px] border-[#16779A] border border-solid border-3 border-l-[25px] border-t border-b border-r-[25px] rounded-[3px] outline-none"
                  placeholder="dq-123-dq"
                  onChange={(e) => setPlaque(e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="region">Région</Label>
              <Select onValueChange={setRegion}>
                <SelectTrigger id="region">
                  <SelectValue placeholder="Sélectionnez votre région" />
                </SelectTrigger>
                <SelectContent>
                  {departements.map((departement) => (
                    <SelectItem key={departement.code} value={departement.code}>
                      {departement.nom}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button
              type="submit"
              size="lg"
              className="max-w-md text-2xl w-full"
            >
              Calculer
            </Button>
          </form>
          {error && <p className="text-red-500 text-center">{error}</p>}
          {cout !== null && (
            <div className="text-lg font-semibold text-center mt-4">
              Coût estimé : {cout.toFixed(2)} €
            </div>
          )}
        </CardContent>
      </Card>

      <div className="space-y-8 container py-8 m-auto">
        <h2 className="text-2xl font-bold mb-4">
          Prix de la carte grise par département : calcul et exemple
        </h2>

        <p className="mb-4">
          Le prix de la carte grise en 2024 dépend de nombreux critères : votre
          lieu d&apos;habitation, la nature de votre véhicule, son ancienneté et
          son usage. Pour estimer le prix de votre carte grise et connaître le
          coût du certificat d&apos;immatriculation en fonction de votre
          département et de votre démarche, aidez-vous du simulateur ci-dessus.
          Retrouvez également toutes les taxes qui composent le tarif de
          l&apos;immatriculation et qui vous permettront de calculer le prix de
          votre carte grise par département.
        </p>

        <h3 className="text-xl font-semibold mb-3">
          Montant de la carte grise: ce qui fait varier son prix
        </h3>

        <p className="mb-4">
          Le coût d&apos;une carte grise est calculé à partir de plusieurs taxes
          et redevances. Il faut néanmoins savoir que le prix du certificat
          d&apos;immatriculation va dépendre de nombreux critères.
        </p>

        <ul className="list-disc list-inside space-y-2 mb-4">
          <li>
            <strong>La nature de votre demande :</strong> selon le motif de
            votre demande*, vous n&apos;aurez pas nécessairement à payer toutes
            les taxes. C&apos;est notamment le cas si vous faites une demande de
            changement de nom sur la carte grise.
          </li>
          <li>
            <strong>La nature de votre véhicule :</strong> le calcul du prix de
            la carte grise est notamment réalisé en fonction de la puissance de
            votre véhicule, de sa nature (voiture, moto, etc.), de son taux
            d&apos;émission de CO2 et de son ancienneté.
          </li>
          <li>
            <strong>Votre lieu de résidence :</strong> chaque conseil régional
            définit le montant du cheval fiscal au sein de sa région, ce qui
            explique pourquoi le prix d&apos;un certificat
            d&apos;immatriculation n&apos;est pas identique partout en France. À
            titre d&apos;exemple, il est de 55€ en Centre-Val de Loire et de
            54,95€ en Île-de-France.
          </li>
          <li>
            <strong>L&apos;utilisation du véhicule :</strong> les véhicules
            professionnels peuvent être concernés par le paiement d&apos;une
            majoration véhicule de transport, ce qui n&apos;est pas le cas des
            particuliers.
          </li>
        </ul>

        <p className="mb-4">
          *Par la suite, nous présentons le prix de la carte grise uniquement
          pour une première immatriculation ou un changement de propriétaire.
        </p>

        <h3 className="text-xl font-semibold mb-3">
          Le calcul du coût de la carte grise
        </h3>

        <p className="mb-4">
          Comme nous l&apos;avons évoqué plus haut, le prix du certificat
          d&apos;immatriculation se compose de 5 éléments : la taxe régionale,
          la majoration véhicule de transport, la taxe sur les véhicules
          polluants, la taxe de gestion et la redevance d&apos;acheminement.
          Guichet Carte Grise, votre partenaire pour faire sa carte grise, vous
          présente ces différentes taxes.
        </p>
        <div className="bg-gray-100 p-4 rounded-md mb-4">
          <p className="font-bold mb-2">Bon à savoir</p>

          <p className="mb-4">
            La taxe sur les véhicules polluants, aussi appelée malus écologique,
            se compose du malus CO2 et du malus au poids. Son montant est au
            maximum de 60 000 € en 2024.
          </p>
        </div>
        <h3 className="text-xl font-semibold mb-3">
          Prix de la carte grise en 2024 : les différentes taxes
        </h3>

        <p className="mb-4">
          Si le prix de la carte grise varie d&apos;un département à un autre,
          c&apos;est pour une raison toute simple : différentes taxes composent
          le tarif de l&apos;immatriculation, dont certaines sont votées au
          niveau régional. Pour calculer le prix de votre carte grise par
          département, retrouvez ci-dessous les 5 postes à prendre en compte.
        </p>

        <h4 className="text-lg font-semibold text-primary mb-3">
          1. La taxe régionale : son impact sur le coût de
          l&apos;immatriculation
        </h4>

        <p className="mb-2">Le prix du cheval fiscal par région</p>

        <p className="mb-4">
          La taxe régionale est le principal élément qui va faire varier le prix
          de la carte grise par département. Elle est calculée sur la base
          d&apos;un prix du cheval fiscal, variable selon les régions.
        </p>

        <h4 className="text-lg font-semibold mb-3">
          Prix du cheval fiscal en 2024
        </h4>

        <Table className="py-4 mb-4">
          <TableHeader>
            <TableRow>
              <TableHead>Région</TableHead>
              <TableHead>Prix</TableHead>
              <TableHead>
                Exonération pour les véhicules « dits propres »
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>Auvergne-Rhône-Alpes</TableCell>
              <TableCell>43,00 €</TableCell>
              <TableCell>100 %</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Bourgogne-Franche-Comté</TableCell>
              <TableCell>51,00 €</TableCell>
              <TableCell>0 %</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Bretagne</TableCell>
              <TableCell>55,00 €</TableCell>
              <TableCell>0 %</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Centre-Val de Loire</TableCell>
              <TableCell>55,00 €</TableCell>
              <TableCell>0 %</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Corse</TableCell>
              <TableCell>27,00 €</TableCell>
              <TableCell>100 %</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Grand Est</TableCell>
              <TableCell>48,00 €</TableCell>
              <TableCell>0 %</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Hauts-de-France</TableCell>
              <TableCell>36,20 €</TableCell>
              <TableCell>50 %</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Île-de-France</TableCell>
              <TableCell>54,95 €</TableCell>
              <TableCell>0 %</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Normandie</TableCell>
              <TableCell>46,00 €</TableCell>
              <TableCell>0 %</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Nouvelle-Aquitaine</TableCell>
              <TableCell>45,00 €</TableCell>
              <TableCell>0 %</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Occitanie</TableCell>
              <TableCell>47,00 €</TableCell>
              <TableCell>0 %</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>PACA</TableCell>
              <TableCell>51,20 €</TableCell>
              <TableCell>100 %*</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Pays-de-la-Loire</TableCell>
              <TableCell>51,00 €</TableCell>
              <TableCell>0 %</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Guadeloupe</TableCell>
              <TableCell>41,00 €</TableCell>
              <TableCell>0 %</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Guyane</TableCell>
              <TableCell>42,50 €</TableCell>
              <TableCell>0 %</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>La Réunion</TableCell>
              <TableCell>51,00 €</TableCell>
              <TableCell>0 %</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Martinique</TableCell>
              <TableCell>30,00 €</TableCell>
              <TableCell>0 %</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Mayotte</TableCell>
              <TableCell>30,00 €</TableCell>
              <TableCell>0 %</TableCell>
            </TableRow>
          </TableBody>
        </Table>

        <p className="mb-4">
          *L&apos;exonération pour les véhicules « dits propres » est supprimée
          en région PACA à partir du 1er mars 2024.
        </p>

        <p className="font-bold mb-2">
          Bon à savoir : une exonération automatique pour les véhicules «
          propres »
        </p>

        <p className="mb-4">
          Les véhicules « propres » sont ceux fonctionnant uniquement à
          l&apos;électricité, à l&apos;hydrogène ou avec une combinaison de ces
          deux énergies. Ils sont automatiquement exonérés du paiement de la
          taxe régionale, et ce, dans toutes les régions de France. Il faut les
          distinguer des véhicules « dits propres » (hybrides, E85, GPL, etc.).
          Pour eux, l&apos;exonération varie selon les régions : elle est de 0,
          50 ou 100 % du montant de la taxe régionale.
        </p>

        <h4 className="text-lg font-semibold mb-3">
          Le calcul de la taxe régionale
        </h4>

        <p className="mb-4">
          Pour calculer son montant, vous aurez besoin de plusieurs
          informations.
        </p>

        <ul className="list-disc list-inside space-y-2 mb-4">
          <li>
            Le tarif du cheval fiscal : le prix du cheval fiscal est voté par
            chaque conseil régional. Il existe donc de grandes disparités selon
            les territoires. Reportez-vous au tableau ci-dessus pour connaître
            son montant dans votre région.
          </li>
          <li>
            La puissance de votre véhicule : le montant de la taxe régionale est
            également déterminé en fonction de la puissance fiscale de votre
            véhicule. Plus celle-ci est importante, plus le prix de votre carte
            grise le sera également.
          </li>
          <li>
            Le taux d&apos;exonération : certaines régions accordent une
            exonération partielle ou intégrale de taxe régionale aux véhicules «
            dits propres », à savoir les véhicules hybrides et à ceux
            fonctionnant au superéthanol E85, au gaz naturel ou encore au gaz de
            pétrole liquéfié (GPL). Le taux d&apos;exonération est de 50% ou 100
            % selon les régions.
          </li>
          <li>
            Le barème applicable : un barème s&apos;applique également en
            fonction de la nature du véhicule à immatriculer (voiture, camion,
            moto, etc.) et de son ancienneté. Retrouvez le taux applicable dans
            le tableau ci-dessous.
          </li>
        </ul>

        <h4 className="text-lg font-semibold mb-3">
          Barème de la taxe régionale
        </h4>

        <Table className="py-4 mb-4">
          <TableHeader>
            <TableRow>
              <TableHead>Type de véhicule</TableHead>
              <TableHead>Ancienneté</TableHead>
              <TableHead>Taux</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>
                Voiture particulière, voiturette et camionnette et utilitaire de
                moins de 3,5 tonnes de PTAC
              </TableCell>
              <TableCell>Neuf ou moins de 10 ans</TableCell>
              <TableCell>1</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Plus de 10 ans</TableCell>
              <TableCell>0,5</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Moto de plus de 125 cm3</TableCell>
              <TableCell>Neuve ou moins de 10 ans</TableCell>
              <TableCell>0,5</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Plus de 10 ans</TableCell>
              <TableCell>0,25</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Moto de moins de 125 cm3</TableCell>
              <TableCell>Neuve ou moins de 10 ans</TableCell>
              <TableCell>La moitié du prix d&apos;un CV</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Plus de 10 ans</TableCell>
              <TableCell>Le quart du prix d&apos;un CV</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                Utilitaire dont le PTAC est supérieur à 3,5 tonnes
              </TableCell>
              <TableCell>Neuf ou moins de 10 ans</TableCell>
              <TableCell>0,5</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Plus de 10 ans</TableCell>
              <TableCell>0,25</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                Cyclomoteur à 2 roues ou à 3 roues non carrossé
              </TableCell>
              <TableCell>-</TableCell>
              <TableCell>Gratuit</TableCell>
            </TableRow>
          </TableBody>
        </Table>

        <p className="mb-4">
          La taxe régionale, symbolisée par le sigle Y1, est l&apos;élément qui
          détermine une partie du prix final de la carte grise. Son montant est
          calculé en fonction du prix du cheval fiscal. Il faut savoir que le
          prix du cheval fiscal est différent selon les régions et peut varier
          d&apos;une année sur l&apos;autre car il est fixé par le conseil
          régional. Pour déterminer la valeur de la taxe régionale, il faut
          multiplier le prix du cheval fiscal de votre région par la puissance
          du véhicule à immatriculer.
        </p>

        <p className="mb-4">
          Pour déterminer le montant de la taxe régionale lors de
          l&apos;immatriculation, utilisez la formule suivante :
        </p>

        <p className="font-bold mb-4">
          Taxe régionale = [(puissance CV x prix du CV) x (1 - taux
          d&apos;exonération)] x taux du barème
        </p>

        <p className="mb-2">
          Les cas particuliers pour le calcul de la taxe régionale
        </p>

        <p className="mb-4">
          Il faut également savoir que le montant de la taxe régionale – et donc
          le prix de la carte grise - va varier selon la nature du véhicule à
          immatriculer, sa date de mise en circulation et sa nature. Après avoir
          multiplié le prix du cheval fiscal par la puissance de votre véhicule,
          vous devez appliquer le barème suivant :
        </p>

        <ul className="list-disc list-inside space-y-2 mb-4">
          <li>
            Pour une voiture particulière, un tricycle à moteur, une camionnette
            ou un utilitaire dont le PTAC est inférieur à 3,5 tonnes: vous payez
            la taxe régionale à taux plein si votre véhicule a moins de 10 ans,
            vous n&apos;en payez que la moitié s&apos;il a plus de 10 ans.
          </li>
          <li>
            Pour un deux roues: moitié du taux pour un véhicule de moins de 10
            ans, quart du taux pour un véhicule de plus de 10 ans.
          </li>
          <li>
            Pour un cyclomoteur à 2 roues ou à 3 roues non carrossé: vous êtes
            exonéré de taxe régionale.
          </li>
          <li>
            Pour un utilitaire dont le PTAC est supérieur à 3,5 tonnes: moitié
            du taux pour un véhicule de moins de 10 ans, quart du taux au-delà.
          </li>
        </ul>

        <h4 className="text-lg font-semibold text-primary mb-3">
          2. Majoration véhicule de transport et prix de la carte grise
        </h4>

        <p className="mb-4">
          Appliquée uniquement aux véhicules utilitaires, la majoration véhicule
          de transport impacte le prix de la carte grise.Elle est calculée en
          fonction du PTAC (poids total en charge) du véhicule et
          s&apos;applique principalement aux véhicules de transport en commun et
          de transport de marchandises. Symbolisée par le sigle Y2 sur la carte
          grise, le montant de la majoration véhicule de transport varie entre
          34 et 285€ et va dépendre du poids maximal autorisé, incluant ce que
          le véhicule transporte (marchandises, usagers, etc.).
        </p>

        <h4 className="text-lg font-semibold mb-3">
          Majoration véhicule de transport
        </h4>

        <Table className="py-4 mb-4">
          <TableHeader>
            <TableRow>
              <TableHead>PTAC</TableHead>
              <TableHead>Montant</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>Inférieur ou égal à 3,5 tonnes</TableCell>
              <TableCell>34 €</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Entre 3,5 et 6 tonnes</TableCell>
              <TableCell>127 €</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Entre 6 et 11 tonnes</TableCell>
              <TableCell>189 €</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                Supérieur à 11 tonnes et véhicule de transport en commun
              </TableCell>
              <TableCell>285 €</TableCell>
            </TableRow>
          </TableBody>
        </Table>

        <h4 className="text-lg font-semibold text-primary mb-3">
          3. Coût de l&apos;immatriculation : la taxe sur les véhicules
          polluants
        </h4>

        <p className="mb-4">
          Pour calculer le prix de la carte grise, il faut également tenir
          compte de la taxe sur les véhicules polluants. Pour les véhicules
          neufs, cette taxe se compose de deux éléments : le malus CO2 et le
          malus au poids.
        </p>

        <h4 className="text-lg font-semibold mb-3">Le malus CO2</h4>

        <p className="mb-4">
          Le montant du malus CO2, aussi appelé taxe sur les émissions de CO2
          des véhicules de tourisme, va dépendre du taux d&apos;émission de CO2
          par kilomètre (pour les véhicules ayant fait l&apos;objet
          d&apos;&apos;une réception communautaire).
        </p>

        <h4 className="text-lg font-semibold mb-3">
          Malus CO2 en 2024 (grille simplifiée)
        </h4>

        <Table className="py-4 mb-4">
          <TableHeader>
            <TableRow>
              <TableHead>Taux d&apos;émission de CO2</TableHead>
              <TableHead>Montant</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>Inférieur à 117 g/km</TableCell>
              <TableCell>0 €</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Entre 118 g/km et 193 g/km</TableCell>
              <TableCell>Entre 50 et 55 023 €</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Supérieur à 193 g/km</TableCell>
              <TableCell>60 000 €</TableCell>
            </TableRow>
          </TableBody>
        </Table>

        <h4 className="text-lg font-semibold mb-3">Le malus au poids</h4>

        <p className="mb-4">
          Le montant du malus au poids, aussi appelé taxe sur la masse en ordre
          de marche des véhicules de tourisme, dépend de la masse en ordre de
          marche du véhicule, indiqué en case G de la carte grise. Le montant
          total correspond à l&apos;addition du malus pour chaque tranche de
          tarif marginal.
        </p>

        <h4 className="text-lg font-semibold mb-3">
          Malus au poids en en 2024
        </h4>

        <Table className="py-4 mb-4">
          <TableHeader>
            <TableRow>
              <TableHead>Fraction de la masse en ordre de marche</TableHead>
              <TableHead>Tarif marginal</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>Jusqu&apos;à 1 599 kg</TableCell>
              <TableCell>0 €</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>De 1 600 à 1 799 kg</TableCell>
              <TableCell>10 €</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>De 1800 à 1 899 kg</TableCell>
              <TableCell>15 €</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>De 1 900 à 1 999 kg</TableCell>
              <TableCell>20 €</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>De 2 000 à 2 099 kg</TableCell>
              <TableCell>25 €</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>À partir de 2 100 kg</TableCell>
              <TableCell>30 €</TableCell>
            </TableRow>
          </TableBody>
        </Table>

        <p className="font-bold mb-2">Bon à savoir</p>

        <p className="mb-4">
          les véhicules d&apos;occasion sont en revanche exonérés de la taxe sur
          les véhicules polluants. Ils étaient auparavant soumis à une taxe CO2,
          dont le montant dépendait de leur puissance fiscale. La taxe annuelle
          sur les véhicules les plus polluants a également été supprimée.
        </p>

        <h4 className="text-lg font-semibold text-primary mb-3">
          4. Prix de la carte grise : la taxe de gestion et d&apos;acheminement
        </h4>

        <p className="mb-4">
          Le prix de la carte grise se compose également de la taxe de gestion -
          dont le montant est de 11 € - qui sert à financer le coût de
          fabrication du certificat d&apos;immatriculation. Vous en êtes
          cependant exonéré si vous n&apos;avez pas à payer la taxe régionale.
        </p>

        <p className="mb-4">
          Enfin, vous devrez ajouter la redevance d&apos;acheminement, dont le
          prix est de 2,76 €, et qui correspond aux frais d&apos;envoi de votre
          carte grise à votre domicile. Vous en êtes toutefois exonéré si vous
          immatriculez un cyclomoteur.
        </p>

        <h3 className="text-xl font-semibold mb-3">
          Prix de la carte grise en 2024 : le récapitulatif
        </h3>

        <p className="mb-4">
          Vous l&apos;aurez compris, le prix de la carte grise par région va
          varier selon de nombreux éléments. Pour vous y retrouver, découvrez
          ci-dessous un récapitulatif des coûts à anticiper pour calculer le
          prix de votre certificat d&apos;immatriculation en 2024.
        </p>

        <h4 className="text-lg font-semibold mb-3">
          Récapitulatif du prix de la carte grise en 2024
        </h4>

        <Table className="py-4 mb-4">
          <TableHeader>
            <TableRow>
              <TableHead>Taxe</TableHead>
              <TableHead>Fonctionnement</TableHead>
              <TableHead>Particularités</TableHead>
              <TableHead>Montant</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>Taxe régionale</TableCell>
              <TableCell>
                S&apos;obtient en multipliant la puissance fiscale du véhicule
                par le prix du cheval fiscal en vigueur dans la région
              </TableCell>
              <TableCell>
                Les véhicules « dits propres » peuvent être exonérés dans
                certaines régions Un barème d&apos;exonération s&apos;applique
                selon la catégorie du véhicule
              </TableCell>
              <TableCell>Entre 0 et plus de 53 000 €</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Majoration véhicule de transport</TableCell>
              <TableCell>Uniquement pour les véhicules utilitaires</TableCell>
              <TableCell>-</TableCell>
              <TableCell>Entre 0 et 285 €</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Malus CO2</TableCell>
              <TableCell>
                Uniquement pour les véhicules neufs polluants
              </TableCell>
              <TableCell>-</TableCell>
              <TableCell>Entre 0 et 60 000 €</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Malus au poids</TableCell>
              <TableCell>
                Uniquement pour les véhicules neufs de plus de 1,6 tonne
              </TableCell>
              <TableCell>-</TableCell>
              <TableCell>Entre 0 et plus de 3 000 €</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Taxe de gestion</TableCell>
              <TableCell>Identique pour tous les véhicules</TableCell>
              <TableCell>
                Exonération si vous n&apos;avez pas à payer la taxe régionale
              </TableCell>
              <TableCell>11 €</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Redevance d&apos;acheminement</TableCell>
              <TableCell>Identique pour tous les véhicules</TableCell>
              <TableCell>Exonération pour les cyclomoteurs</TableCell>
              <TableCell>2,76 €</TableCell>
            </TableRow>
          </TableBody>
        </Table>

        <p className="mb-4">
          Pour calculer le prix de votre carte grise en fonction de votre
          département, vous pouvez vous aider de la formule suivante :
        </p>

        <p className="font-bold mb-4">
          Prix de la carte grise = Taxe régionale* + majoration véhicule de
          transport + malus CO2 + malus au poids + taxe de gestion + redevance
          d&apos;acheminement
        </p>

        <p className="mb-4">
          * Pour rappel, la formule de la taxe régionale est : [(prix du CV x CV
          du véhicule) x (1 - taux exonération véhicule propre)] x taux de la
          taxe régionale.
        </p>
        <h4 className="text-lg font-semibold">
          Prix de l&apos;immatriculation par département : des exemples
        </h4>
        <p>
          Pour vous aider à calculer le prix de la carte grise par département,
          nous vous proposons plusieurs exemples. Ils vous aideront à mieux
          comprendre les règles en matière d&apos;immatriculation.
        </p>
        <h4 className="text-lg font-semibold text-primary">
          1. Le prix de la carte grise pour une voiture neuve
        </h4>
        <p>
          Vous souhaitez immatriculer un véhicule neuf ? Pour bien comprendre le
          coût d&apos;une première immatriculation, prenons l&apos;exemple
          suivant :
        </p>
        <ul className="list-disc list-inside">
          <li>une voiture particulière neuve d'une puissance de 15 CV ;</li>
          <li>rejetant 151 grammes de CO2/km (malus de 2 370 €) ;</li>
          <li>dont la masse est de 1 610 kg ;</li>
          <li>
            dont le propriétaire habite dans le Bas-Rhin (prix du cheval fiscal
            de 48 €).
          </li>
        </ul>
        <h4 className="text-lg font-semibold">
          Exemple du prix de la carte grise dans le Bas-Rhin
        </h4>
        <Table className="py-4">
          <TableHeader>
            <TableRow>
              <TableHead>Taxe</TableHead>
              <TableHead>Calcul</TableHead>
              <TableHead>Montant</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>Taxe régionale</TableCell>
              <TableCell>[(48 € x 15 CV) x (1 - 0 %)] x 1</TableCell>
              <TableCell>720 €</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Majoration véhicule de transport</TableCell>
              <TableCell>Non concerné</TableCell>
              <TableCell>0 €</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Malus CO2</TableCell>
              <TableCell>Pour une émission de 151 grammes de CO2/km</TableCell>
              <TableCell>2 370 €</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Malus au poids</TableCell>
              <TableCell>Pour un poids de 1 610 kg</TableCell>
              <TableCell>110 €</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Taxe de gestion</TableCell>
              <TableCell>Applicable</TableCell>
              <TableCell>11 €</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Redevance d'acheminement</TableCell>
              <TableCell>Applicable</TableCell>
              <TableCell>2,76 €</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-bold">TOTAL</TableCell>
              <TableCell></TableCell>
              <TableCell className="font-bold">3 213,76 €</TableCell>
            </TableRow>
          </TableBody>
        </Table>
        <h4 className="text-lg font-semibold">
          2. Le prix de la carte grise pour une voiture d’occasion
        </h4>
        <p>
          Vous souhaitez immatriculer un véhicule d’occasion ? Prenons l’exemple
          suivant pour comprendre le calcul du prix de la carte grise pour une
          voiture d’occasion :
        </p>
        <ul className="list-disc list-inside">
          <li>une voiture particulière ;</li>
          <li>
            immatriculée pour la première fois en 2018 (véhicule de 2 ans) ;
          </li>
          <li>d’une puissance de 10 CV</li>
          <li>
            dont le propriétaire habite dans le Calvados (prix du cheval fiscal
            de 46 €).
          </li>
        </ul>
        <h4 className="text-lg font-semibold">
          Exemple du prix de la carte grise dans le Calvados
        </h4>
        <Table className="py-4">
          <TableHeader>
            <TableRow>
              <TableHead>Taxe</TableHead>
              <TableHead>Calcul</TableHead>
              <TableHead>Montant</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>Taxe régionale</TableCell>
              <TableCell>[(46 € x 10 CV) x (1 - 0 %)] x 1</TableCell>
              <TableCell>460 €</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Majoration véhicule de transport</TableCell>
              <TableCell>Non concerné</TableCell>
              <TableCell>0 €</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Malus CO2</TableCell>
              <TableCell>Non concerné</TableCell>
              <TableCell>0 €</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Malus au poids</TableCell>
              <TableCell>Non concerné</TableCell>
              <TableCell>0 €</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Taxe de gestion</TableCell>
              <TableCell>Applicable</TableCell>
              <TableCell>11 €</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Redevance d'acheminement</TableCell>
              <TableCell>Applicable</TableCell>
              <TableCell>2,76 €</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-bold">TOTAL</TableCell>
              <TableCell></TableCell>
              <TableCell className="font-bold">462,76 €</TableCell>
            </TableRow>
          </TableBody>
        </Table>
        <h4 className="text-lg font-semibold">
          3. Le prix de la carte grise pour une voiture propre neuve
        </h4>
        <p>
          Vous souhaitez immatriculer un véhicule hydrogène ? Le prix de la
          carte grise étant plus avantageux pour les véhicules « propres »,
          prenons l’exemple suivant pour bien le comprendre :
        </p>
        <ul className="list-disc list-inside">
          <li>une voiture électrique neuve de 5 CV ;</li>
          <li>rejetant 0 gramme de CO2/km ;</li>
          <li>
            dont le propriétaire habite à Paris (cheval fiscal fixé à 54,95 €,
            exonération de 100 %).
          </li>
        </ul>
        <h4 className="text-lg font-semibold">
          Exemple du prix de la carte grise à Paris
        </h4>
        <Table className="py-4">
          <TableHeader>
            <TableRow>
              <TableHead>Taxe</TableHead>
              <TableHead>Calcul</TableHead>
              <TableHead>Montant</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>Taxe régionale</TableCell>
              <TableCell>[(54,95 € x 5 CV) x (1 - 100 %)] x 1</TableCell>
              <TableCell>0 €</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Taxe de formation professionnelle</TableCell>
              <TableCell>Non concerné</TableCell>
              <TableCell>0 €</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Malus écologique</TableCell>
              <TableCell>Non concerné</TableCell>
              <TableCell>0 €</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Taxe CO2</TableCell>
              <TableCell>Non concerné</TableCell>
              <TableCell>0 €</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Taxe de gestion</TableCell>
              <TableCell>
                Non applicable car exonéré de taxe régionale
              </TableCell>
              <TableCell>0 €</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Redevance d'acheminement</TableCell>
              <TableCell>Applicable</TableCell>
              <TableCell>2,76 €</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-bold">TOTAL</TableCell>
              <TableCell></TableCell>
              <TableCell className="font-bold">2,76 €</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default ValorCg;
