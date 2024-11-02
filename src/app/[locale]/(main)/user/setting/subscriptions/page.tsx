"use client";
import { auth } from "@/lib/auth";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";

const mockSubscriptions = [
  {
    id: 1,
    plan: {
      name: "Pack Premium",
      price: 29.99,
    },
    status: "active",
    currentPeriodEnd: "2024-12-31",
  },
  {
    id: 2,
    plan: {
      name: "Pack Pro",
      price: 49.99,
    },
    status: "inactive",
    currentPeriodEnd: "2024-06-30",
  },
];

export default function Page() {
  const subscriptions = mockSubscriptions;

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Mes Abonnements</h1>

      {subscriptions.length === 0 ? (
        <p className="text-gray-500">Vous n'avez aucun abonnement actif.</p>
      ) : (
        <div className="grid gap-4">
          {subscriptions.map((sub) => (
            <div key={sub.id} className="border rounded-lg p-4 shadow-sm">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="font-semibold">{sub.plan.name}</h2>
                  <p className="text-gray-600">
                    Statut: {sub.status === "active" ? "Actif" : "Inactif"}
                  </p>
                  <p className="text-sm text-gray-500">
                    Expire le:{" "}
                    {new Date(sub.currentPeriodEnd).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold">{sub.plan.price}€/mois</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
