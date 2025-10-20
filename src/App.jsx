import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// Données initiales pour les centres et scénarios
const initialCenters = [
  {
    name: "Vortex Plateau",
    tag: "VP",
    description: "Centre Vortex situé au Plateau. Plusieurs scénarios immersifs disponibles.",
    address: "4481 Rue Saint-Denis, Montréal",
    manager: "Jean Dupuis",
    scenarios: [
      {
        name: "Le Pacte",
        status: "Ouvert",
        reason: "",
        start: "",
        expectedReopen: "",
        difficulty: "Intermédiaire",
        capacity: "3-6",
        dateouverture: "10/02/2023",
        versions: ["v1.0", "v1.2"]
      },
      {
        name: "Les oubliés",
        status: "Fermé",
        reason: "Problème technique",
        start: "2025-10-01T10:00",
        expectedReopen: "2025-10-05T14:00",
        difficulty: "Avancé",
        capacity: "4-8",
        versions: ["v2.0"]
      },
    ],
  },
  {
    name: "Find The Key",
    tag: "FTK",
    description: "Centre Find The Key situé à Québec. Jeux d'énigmes pour tous les âges.",
    address: "32 Rue des Secrets, Québec",
    manager: "Lucie Tremblay",
    scenarios: [
      {
        name: "Le Trésor",
        status: "Maintenance",
        reason: "Révision annuelle",
        start: "2025-10-02T09:00",
        expectedReopen: "2025-10-04T16:00",
        difficulty: "Facile",
        capacity: "2-5",
        versions: ["v1.1", "v1.3"]
      },
      {
        name: "Les disparus",
        status: "Ouvert",
        reason: "",
        start: "",
        expectedReopen: "",
        difficulty: "Intermédiaire",
        capacity: "3-6",
        versions: ["v2.1"]
      },
    ],
  },
];

export default function App() {
  const [centers, setCenters] = useState(initialCenters);
  const [selectedScenario, setSelectedScenario] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const getBadgeColor = (status) => {
    switch (status) {
      case "Ouvert":
        return "bg-green-500";
      case "Fermé":
        return "bg-red-500";
      case "Maintenance":
        return "bg-yellow-500";
      default:
        return "bg-gray-500";
    }
  };

  const updateScenarioStatus = (centerIndex, scenarioIndex, newStatus) => {
    const updatedCenters = [...centers];
    updatedCenters[centerIndex].scenarios[scenarioIndex].status = newStatus;
    setCenters(updatedCenters);
  };

  const handleFieldChange = (centerIndex, scenarioIndex, field, value) => {
    const updatedCenters = [...centers];
    updatedCenters[centerIndex].scenarios[scenarioIndex][field] = value;
    setCenters(updatedCenters);
  };

  const nonOpenScenarios = centers.flatMap((center, centerIndex) =>
    center.scenarios
      .map((s, scenarioIndex) => ({ ...s, center, centerIndex, scenarioIndex }))
      .filter((s) => s.status !== "Ouvert")
  );

  return (
    <div className="p-6 bg-white min-h-screen">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-3xl font-bold">Centre de contrôle du GET</h1>
          <p className="text-sm text-gray-500">{currentTime.toLocaleDateString()}</p>
        </div>
        <div className="text-sm text-gray-400">{currentTime.toLocaleTimeString()}</div>
      </div>

      {nonOpenScenarios.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2 flex items-center gap-2">
            <span className="text-red-600 text-xl">🔴</span> Salles à surveiller
          </h2>
          <div className="flex flex-wrap gap-2">
            {nonOpenScenarios.map((scenario, index) => (
              <Dialog key={index}>
                <DialogTrigger asChild>
                  <div
                    onClick={() => setSelectedScenario(scenario)}
                    className={`cursor-pointer px-3 py-2 rounded-lg shadow text-white text-sm ${getBadgeColor(scenario.status)}`}
                  >
                    <strong>{scenario.name}</strong>
                    <div className="text-xs opacity-80 mt-1">
                      <Badge variant="secondary" className="mr-1 bg-white text-black border border-gray-300">
                        {scenario.center.tag}
                      </Badge>
                      <Badge variant="secondary" className="bg-white text-black border border-gray-300">
                        {scenario.status}
                      </Badge>
                    </div>
                  </div>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>{scenario.name}</DialogTitle>
                    <DialogDescription className="space-y-2">
                      <p><strong>Centre :</strong> {scenario.center.name}</p>
                      <p><strong>Statut :</strong> {scenario.status}</p>
                      <Label>Motif</Label>
                      <Textarea
                        value={scenario.reason || ""}
                        onChange={(e) => handleFieldChange(scenario.centerIndex, scenario.scenarioIndex, "reason", e.target.value)}
                      />
                      <Label>Début</Label>
                      <Input
                        type="datetime-local"
                        value={scenario.start || ""}
                        onChange={(e) => handleFieldChange(scenario.centerIndex, scenario.scenarioIndex, "start", e.target.value)}
                      />
                      <Label>Réouverture prévue</Label>
                      <Input
                        type="datetime-local"
                        value={scenario.expectedReopen || ""}
                        onChange={(e) => handleFieldChange(scenario.centerIndex, scenario.scenarioIndex, "expectedReopen", e.target.value)}
                      />
                      <p><strong>Difficulté :</strong> {scenario.difficulty}</p>
                      <p><strong>Capacité :</strong> {scenario.capacity}</p>
                      <p><strong>Versions :</strong> {scenario.versions?.join(", ")}</p>
                      <div className="flex gap-2 mt-2">
                        <Button onClick={() => updateScenarioStatus(scenario.centerIndex, scenario.scenarioIndex, "Ouvert")}>
                          Réouverture
                        </Button>
                        <Button onClick={() => updateScenarioStatus(scenario.centerIndex, scenario.scenarioIndex, "Fermé")}>
                          Fermeture
                        </Button>
                        <Button onClick={() => updateScenarioStatus(scenario.centerIndex, scenario.scenarioIndex, "Maintenance")}>
                          Maintenance
                        </Button>
                      </div>
                    </DialogDescription>
                  </DialogHeader>
                </DialogContent>
              </Dialog>
            ))}
          </div>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-4">
        {centers.map((center, centerIndex) => (
          <Card key={centerIndex} className="border rounded-xl p-4 shadow-sm bg-gray-50">
            <h2 className="text-lg font-bold text-blue-700 mb-2">{center.name}</h2>
            <div className="flex flex-wrap gap-2">
              {center.scenarios
                .map((scenario, scenarioIndex) => ({ scenario, scenarioIndex }))
                .filter(({ scenario }) => scenario.status === "Ouvert")
                .map(({ scenario, scenarioIndex }) => (
                  <Dialog key={scenarioIndex}>
                    <DialogTrigger asChild>
                      <div
                        onClick={() => setSelectedScenario({ ...scenario, center, centerIndex, scenarioIndex })}
                        className={`cursor-pointer px-3 py-2 rounded-lg shadow text-white text-sm ${getBadgeColor(scenario.status)}`}
                      >
                        <strong>{scenario.name}</strong>
                        <div className="text-xs opacity-80 mt-1">
                          <Badge variant="secondary" className="mr-1 bg-white text-black border border-gray-300">
                            {center.tag}
                          </Badge>
                          <Badge variant="secondary" className="bg-white text-black border border-gray-300">
                            {scenario.status}
                          </Badge>
                        </div>
                      </div>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Détails de la salle</DialogTitle>
                        <DialogDescription className="space-y-2">
                          <p><strong>Scénario :</strong> {scenario.name}</p>
                          <p><strong>Centre :</strong> {center.name}</p>
                          <p><strong>Statut :</strong> {scenario.status}</p>
                          <Label>Motif</Label>
                          <Textarea
                            value={scenario.reason || ""}
                            onChange={(e) => handleFieldChange(centerIndex, scenarioIndex, "reason", e.target.value)}
                          />
                          <Label>Début</Label>
                          <Input
                            type="datetime-local"
                            value={scenario.start || ""}
                            onChange={(e) => handleFieldChange(centerIndex, scenarioIndex, "start", e.target.value)}
                          />
                          <Label>Réouverture prévue</Label>
                          <Input
                            type="datetime-local"
                            value={scenario.expectedReopen || ""}
                            onChange={(e) => handleFieldChange(centerIndex, scenarioIndex, "expectedReopen", e.target.value)}
                          />
                          <p><strong>Difficulté :</strong> {scenario.difficulty}</p>
                          <p><strong>Capacité :</strong> {scenario.capacity}</p>
                          <p><strong>Versions :</strong> {scenario.versions?.join(", ")}</p>
                          <div className="flex gap-2 mt-2">
                            <Button onClick={() => updateScenarioStatus(centerIndex, scenarioIndex, "Fermé")}>
                              Incident
                            </Button>
                            <Button onClick={() => updateScenarioStatus(centerIndex, scenarioIndex, "Maintenance")}>
                              Maintenance
                            </Button>
                          </div>
                        </DialogDescription>
                      </DialogHeader>
                    </DialogContent>
                  </Dialog>
                ))}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
