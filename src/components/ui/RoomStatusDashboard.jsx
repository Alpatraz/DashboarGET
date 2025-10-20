import { useEffect, useState } from "react";
import { db } from "../firebase"; // ✅ Assure-toi que ce chemin est correct
import { collection, query, onSnapshot } from "firebase/firestore";

const statusColors = {
  ouvert: "bg-green-100 text-green-700 border-green-400",
  fermé: "bg-red-100 text-red-700 border-red-400",
  bris: "bg-yellow-100 text-yellow-700 border-yellow-400",
  inconnu: "bg-gray-100 text-gray-700 border-gray-400",
};

const RoomStatusDashboard = () => {
  const [centres, setCentres] = useState({});

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "centres"), (centreSnapshot) => {
      const newCentres = {};
      centreSnapshot.forEach((centreDoc) => {
        const centreId = centreDoc.id;
        const salleQuery = collection(db, `centres/${centreId}/salles`);
        onSnapshot(salleQuery, (salleSnapshot) => {
          const salles = salleSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
          newCentres[centreId] = {
            nom: centreDoc.data().nom,
            salles,
          };
          setCentres({ ...newCentres });
        });
      });
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="p-6 bg-slate-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-center">État des salles</h1>
      <div className="space-y-12">
        {Object.entries(centres).map(([centreId, centre]) => (
          <div key={centreId}>
            <h2 className="text-2xl font-semibold mb-4 text-slate-800">
              🏢 {centre.nom || centreId}
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {centre.salles.map((salle) => {
                const statusKey = (salle.statut || "inconnu").toLowerCase();
                const colorClass = statusColors[statusKey] || statusColors["inconnu"];
                return (
                  <div
                    key={salle.id}
                    className={`border p-4 rounded shadow ${colorClass}`}
                  >
                    <h3 className="text-lg font-bold mb-2">{salle.nom}</h3>
                    <p className="mb-1">
                      <strong>Statut :</strong> {salle.statut || "Inconnu"}
                    </p>
                    {salle.commentaire && (
                      <p className="mb-1 text-sm">
                        💬 {salle.commentaire}
                      </p>
                    )}
                    {salle.reouverture && (
                      <p className="text-sm">
                        📆 Réouverture prévue :{" "}
                        <span className="font-medium">{salle.reouverture}</span>
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RoomStatusDashboard;
