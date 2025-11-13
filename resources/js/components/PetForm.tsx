import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "@inertiajs/react";
import { route } from 'ziggy-js';

interface PetFormProps {
  onSuccess?: (newPet: any) => void;
  onClose?: () => void;
}

export default function PetForm({ onSuccess, onClose }: PetFormProps) {
  const petForm = useForm({
    name: "",
    species: "",
    breed: "",
    gender: "male",
    age: "",
    weight: "",
    medical_history: "",
    allergies: "",
    vaccinated: false,
    grooming_notes: "",
    last_groomed_at: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();

  petForm.post(route("pets.modalStore"), {
    preserveScroll: true,
    preserveState: true, 
    onSuccess: (res: any) => {

      const newPet = res.props.flash.newPet;
      
      if (newPet?.id && onSuccess) {
        onSuccess(newPet);
      }
      
      petForm.reset();
      if (onClose) onClose();
    },
  });
};

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mt-2 w-full max-w-5xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            value={petForm.data.name}
            onChange={(e) => petForm.setData("name", e.target.value)}
          />
        </div>

        <div>
          <Label htmlFor="species">Species</Label>
          <Input
            id="species"
            value={petForm.data.species}
            onChange={(e) => petForm.setData("species", e.target.value)}
            placeholder="Dog / Cat / Rabbit"
          />
        </div>

        <div>
          <Label htmlFor="breed">Breed</Label>
          <Input
            id="breed"
            value={petForm.data.breed}
            onChange={(e) => petForm.setData("breed", e.target.value)}
          />
        </div>

        <div>
          <Label htmlFor="gender">Gender</Label>
          <select
            id="gender"
            value={petForm.data.gender}
            onChange={(e) => petForm.setData("gender", e.target.value)}
            className="w-full border rounded-lg p-2"
          >
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>

        <div>
          <Label htmlFor="age">Age (years)</Label>
          <Input
            id="age"
            type="number"
            value={petForm.data.age}
            onChange={(e) => petForm.setData("age", e.target.value)}
          />
        </div>

        <div>
          <Label htmlFor="weight">Weight (kg)</Label>
          <Input
            id="weight"
            type="number"
            step="0.1"
            value={petForm.data.weight}
            onChange={(e) => petForm.setData("weight", e.target.value)}
          />
        </div>

        <div className="flex items-center space-x-2 mt-6">
          <input
            type="checkbox"
            id="vaccinated"
            checked={petForm.data.vaccinated}
            onChange={(e) => petForm.setData("vaccinated", e.target.checked)}
            className="rounded"
          />
          <Label htmlFor="vaccinated">Vaccinated</Label>
        </div>
      </div>

      <div>
        <Label htmlFor="medical_history">Medical History</Label>
        <textarea
          id="medical_history"
          value={petForm.data.medical_history}
          onChange={(e) => petForm.setData("medical_history", e.target.value)}
          className="w-full border rounded-lg p-2"
          rows={2}
        />
      </div>

      <div>
        <Label htmlFor="allergies">Allergies</Label>
        <Input
          id="allergies"
          value={petForm.data.allergies}
          onChange={(e) => petForm.setData("allergies", e.target.value)}
        />
      </div>

      <div>
        <Label htmlFor="grooming_notes">Grooming Notes</Label>
        <textarea
          id="grooming_notes"
          value={petForm.data.grooming_notes}
          onChange={(e) => petForm.setData("grooming_notes", e.target.value)}
          className="w-full border rounded-lg p-2"
          rows={2}
        />
      </div>

      <div>
        <Label htmlFor="last_groomed_at">Last Groomed At</Label>
        <Input
          id="last_groomed_at"
          type="date"
          value={petForm.data.last_groomed_at}
          onChange={(e) => petForm.setData("last_groomed_at", e.target.value)}
        />
      </div>

      <div className="pt-4">
        <Button type="submit" className="w-full px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl disabled:opacity-50">
          Save Pet
        </Button>
      </div>
    </form>
  );
}
