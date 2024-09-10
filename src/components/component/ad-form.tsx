import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";

const AdForm = () => {
  return (
    <form className="space-y-4">
      <div>
        <Label htmlFor="title">{"Titre de l'annonce"}</Label>
        <Input id="title" type="text" placeholder="Titre de l'annonce" />
      </div>
      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          rows={4}
          placeholder="Description de l'annonce"
        />
      </div>
      <div>
        <Label htmlFor="details">Détails</Label>
        <Textarea
          id="details"
          rows={4}
          placeholder="Détails du produit ou du service"
        />
      </div>
      <div>
        <Label htmlFor="images">Images</Label>
        <Input id="images" type="file" multiple />
      </div>
      <Button type="submit" className="w-full">
        {" Publier l'annonce"}
      </Button>
    </form>
  );
};
export default AdForm;
