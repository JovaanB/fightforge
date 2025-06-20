import React from "react";
import ProgramAdmin from "@/components/admin/ProgramAdmin";

const AdminProgramsPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <h1 className="text-xl font-bold text-gray-900">
            Admin - Programmes
          </h1>
          <p className="text-sm text-gray-500">
            Ajouter un nouveau programme d'entraînement
          </p>
        </div>
      </header>
      <main className="max-w-4xl mx-auto px-4 py-6">
        <ProgramAdmin />
      </main>
    </div>
  );
};

export default AdminProgramsPage;
