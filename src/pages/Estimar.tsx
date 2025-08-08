import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "@/components/common/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { addMinutes, subHours, subMinutes, format, parse } from "date-fns";

const Estimar = () => {
  const navigate = useNavigate();
  const [workHours, setWorkHours] = useState(() => {
    const saved = localStorage.getItem("workHours");
    return saved || "08:00";
  });
  const [exitTime, setExitTime] = useState("");

  useEffect(() => {
    if (workHours) {
      localStorage.setItem("workHours", workHours);
    }
  }, [workHours]);

  const calculateEntryTime = () => {
    if (!exitTime) return null;

    try {
      const exit = parse(exitTime, "HH:mm", new Date());
      const [hours, minutes] = workHours.split(":").map(Number);
      
      // First subtract the work hours and minutes
      let entry = subHours(subMinutes(exit, minutes), hours);
      // Then add 10 minutes for the allowed tolerance
      entry = addMinutes(entry, 10);
      
      return format(entry, "HH:mm");
    } catch (error) {
      console.error("Error calculating entry time:", error);
      return null;
    }
  };

  const entryTime = calculateEntryTime();

  return (
    <div className="page-container">
      <h1 className="text-2xl font-bold mb-6">Estimar hora de saída</h1>
      
      <div className="w-full max-w-sm space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Carga horária</label>
          <Input
            type="time"
            value={workHours}
            onChange={(e) => setWorkHours(e.target.value)}
            className="input-time"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Que horas deseja sair?</label>
          <Input
            type="time"
            value={exitTime}
            onChange={(e) => setExitTime(e.target.value)}
            className="input-time"
          />
        </div>

        {entryTime && (
          <div className="mt-6">
            <p className="font-medium">
              Horário de entrada necessário: <span className="time-normal">{entryTime}</span>
            </p>
          </div>
        )}
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

export default Estimar;