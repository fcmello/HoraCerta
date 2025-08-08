
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "@/components/common/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { addMinutes, subMinutes, addHours, format, parse, differenceInMinutes } from "date-fns";
import useSound from 'use-sound';
import { toast } from "sonner";

const Ponto = () => {
  const navigate = useNavigate();
  const [workHours, setWorkHours] = useState(() => {
    const saved = localStorage.getItem("workHours");
    return saved || "08:00";
  });
  const [entryTime, setEntryTime] = useState(() => {
    const saved = localStorage.getItem("entryTime");
    return saved || "";
  });
  const [progress, setProgress] = useState(0);
  const [playAlarm] = useSound('/alarm.mp3', { volume: 0.5 });
  const [snoozeTimeout, setSnoozeTimeout] = useState<NodeJS.Timeout | null>(null);
  const [isAlarmActive, setIsAlarmActive] = useState(false);

  useEffect(() => {
    localStorage.setItem("entryTime", entryTime);
  }, [entryTime]);

  useEffect(() => {
    localStorage.setItem("workHours", workHours);
  }, [workHours]);

  const handleSnooze = () => {
    setIsAlarmActive(false);
    if (snoozeTimeout) {
      clearTimeout(snoozeTimeout);
    }
    
    const timeout = setTimeout(() => {
      playAlarm();
      setIsAlarmActive(true);
      toast("Alarme soneca!", {
        description: "5 minutos se passaram. Clique em soneca para mais 5 minutos.",
        action: {
          label: "Soneca",
          onClick: handleSnooze
        }
      });
    }, 5 * 60 * 1000); // 5 minutos
    
    setSnoozeTimeout(timeout);
    
    toast.success("Soneca ativada!", {
      description: "O alarme tocará novamente em 5 minutos"
    });
  };

  useEffect(() => {
    if (!entryTime) return;

    const updateProgress = () => {
      try {
        const entry = parse(entryTime, "HH:mm", new Date());
        const [hours, minutes] = workHours.split(":").map(Number);
        const minimumTime = addMinutes(addHours(entry, hours), minutes - 10);
        const now = new Date();
        now.setFullYear(entry.getFullYear(), entry.getMonth(), entry.getDate());
        
        const totalMinutes = hours * 60 + minutes - 10;
        const elapsedMinutes = differenceInMinutes(now, entry);
        const currentProgress = Math.min(100, (elapsedMinutes / totalMinutes) * 100);
        
        setProgress(Math.max(0, currentProgress));

        // Play alarm when minimum time is reached
        if (elapsedMinutes >= totalMinutes && elapsedMinutes <= totalMinutes + 1 && !isAlarmActive) {
          playAlarm();
          setIsAlarmActive(true);
          toast("Hora de registrar o ponto!", {
            description: "Clique em soneca para adiar por 5 minutos.",
            action: {
              label: "Soneca",
              onClick: handleSnooze
            }
          });
        }
      } catch (error) {
        console.error("Error updating progress:", error);
      }
    };

    const interval = setInterval(updateProgress, 1000);
    return () => {
      clearInterval(interval);
      if (snoozeTimeout) {
        clearTimeout(snoozeTimeout);
      }
    };
  }, [entryTime, workHours, playAlarm, snoozeTimeout, isAlarmActive]);

  const calculateTimes = () => {
    if (!entryTime) return null;

    try {
      const entry = parse(entryTime, "HH:mm", new Date());
      const [hours, minutes] = workHours.split(":").map(Number);
      const normal = addHours(addMinutes(entry, minutes), hours);
      
      return {
        minimum: format(subMinutes(normal, 10), "HH:mm"),
        normal: format(normal, "HH:mm"),
        maximum: format(addMinutes(normal, 10), "HH:mm"),
        extra: format(addMinutes(normal, 115), "HH:mm"),
      };
    } catch (error) {
      console.error("Error calculating times:", error);
      return null;
    }
  };

  const times = calculateTimes();
  // Format the progress value to 2 decimal places for the Progress component
  const formattedProgress = parseFloat(progress.toFixed(2));

  return (
    <div className="page-container">
      <h1 className="text-2xl font-bold mb-6">Ponto</h1>
      
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
          <label className="block text-sm font-medium mb-1">Horário de entrada</label>
          <Input
            type="time"
            value={entryTime}
            onChange={(e) => setEntryTime(e.target.value)}
            className="input-time"
          />
        </div>

        {progress > 0 && (
          <div className="space-y-2">
            <label className="block text-sm font-medium">Progresso da jornada</label>
            <Progress value={formattedProgress} className="w-full" />
            <p className="text-sm text-gray-600">{formattedProgress}% completo</p>
          </div>
        )}

        {times && (
          <div className="space-y-3 mt-6">
            <p>
              <span className="text-sm">Horário mínimo: </span>
              <span className="time-minimum">{times.minimum}</span>
            </p>
            <p>
              <span className="text-sm">Horário normal: </span>
              <span className="time-normal">{times.normal}</span>
            </p>
            <p>
              <span className="text-sm">Horário máximo: </span>
              <span className="time-maximum">{times.maximum}</span>
            </p>
            <p>
              <span className="text-sm">Hora extra máxima: </span>
              <span className="time-extra">{times.extra}</span>
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

export default Ponto;
