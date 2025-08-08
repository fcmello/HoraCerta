import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "@/components/common/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const Folgas = () => {
  const navigate = useNavigate();
  const [daysOff, setDaysOff] = useState(() => {
    const saved = localStorage.getItem("daysOff");
    return saved ? Number(saved) : 0;
  });
  const [notes, setNotes] = useState(() => {
    const saved = localStorage.getItem("daysOffNotes");
    return saved || "";
  });

  useEffect(() => {
    localStorage.setItem("daysOff", daysOff.toString());
    localStorage.setItem("daysOffNotes", notes);
  }, [daysOff, notes]);

  return (
    <div className="page-container">
      <h1 className="text-2xl font-bold mb-6">Folgas</h1>
      
      <div className="w-full max-w-sm space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Saldo de folgas</label>
          <Input
            type="number"
            value={daysOff}
            onChange={(e) => setDaysOff(Number(e.target.value))}
            className="input-time"
            min="0"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Observações</label>
          <Textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="min-h-[100px]"
            placeholder="Adicione suas observações aqui..."
          />
        </div>
      </div>

      <Button 
        onClick={() => navigate("/")}
        className="back-button mt-8"
      >
        Voltar
      </Button>
      <Footer />
    </div>
  );
};

export default Folgas;