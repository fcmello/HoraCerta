import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "@/components/common/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";

const MINIMUM_OVERTIME_MIN = 20 * 60; // 20 hours

function getCurrentPeriodKey(now: Date = new Date()) {
  const year = now.getFullYear();
  const month = now.getMonth(); // 0-based
  const day = now.getDate();
  const startMonth = day >= 16 ? month : (month + 11) % 12;
  const startYear = day >= 16 ? year : (month === 0 ? year - 1 : year);
  const mm = String(startMonth + 1).padStart(2, "0");
  return `${startYear}-${mm}-16`;
}

function parseTimeToMinutes(value: string) {
  const [h, m] = value.split(":").map(Number);
  const minutes = (h || 0) * 60 + (m || 0);
  return Number.isFinite(minutes) ? minutes : 0;
}

function formatMinutes(total: number) {
  const h = Math.floor(total / 60);
  const m = total % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

const BancoHoras = () => {
  const navigate = useNavigate();

  const [entry, setEntry] = useState<string>("00:00");
  const [totalMinutes, setTotalMinutes] = useState<number>(() => {
    try {
      const saved = localStorage.getItem("bancoHorasTotalMinutes");
      return saved ? parseInt(saved) || 0 : 0;
    } catch (error) {
      console.error("Error loading saved total:", error);
      return 0;
    }
  });

  // Persist total minutes
  useEffect(() => {
    try {
      localStorage.setItem("bancoHorasTotalMinutes", String(totalMinutes));
    } catch (error) {
      console.error("Error saving total minutes:", error);
    }
  }, [totalMinutes]);

  // Period reset + basic SEO tags
  useEffect(() => {
    const currentKey = getCurrentPeriodKey();
    const lastKey = localStorage.getItem("bancoHorasPeriodKey");
    if (lastKey !== currentKey) {
      setTotalMinutes(0);
      try {
        localStorage.setItem("bancoHorasTotalMinutes", "0");
      } catch {}
    }
    try {
      localStorage.setItem("bancoHorasPeriodKey", currentKey);
    } catch {}

    // SEO
    document.title = "Banco de Horas - Saldo e Acúmulo";
    const desc =
      "Controle seu banco de horas: acompanhe o saldo negativo de 20h e veja o banco real quando exceder.";
    let meta = document.querySelector('meta[name="description"]') as HTMLMetaElement | null;
    if (!meta) {
      meta = document.createElement("meta");
      meta.name = "description";
      document.head.appendChild(meta);
    }
    meta.content = desc;

    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      document.head.appendChild(canonical);
    }
    canonical.href = window.location.href;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const addEntry = () => {
    const minutes = parseTimeToMinutes(entry);
    if (minutes <= 0) {
      toast({ title: "Informe um horário válido", description: "Use o formato HH:MM" });
      return;
    }
    setTotalMinutes((prev) => prev + minutes);
    setEntry("00:00");
    toast({ title: "Horas adicionadas", description: `+${formatMinutes(minutes)} ao período` });
  };

  const negativeRemaining = Math.max(0, MINIMUM_OVERTIME_MIN - totalMinutes);
  const realBank = Math.max(0, totalMinutes - MINIMUM_OVERTIME_MIN);

  return (
    <main className="page-container">
      <header>
        <h1 className="text-2xl font-bold mb-6">Banco de Horas</h1>
      </header>

      <section className="w-full max-w-sm space-y-4" aria-label="Adicionar horas ao período">
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="entry-time">
            Adicionar horas (HH:MM)
          </label>
          <div className="flex items-center gap-2">
            <Input
              id="entry-time"
              type="time"
              step={60}
              value={entry}
              onChange={(e) => setEntry(e.target.value)}
              className="input-time"
            />
            <Button onClick={addEntry} aria-label="Adicionar horas">Adicionar</Button>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t space-y-2">
          <p className="font-medium">
            Acumulado no período: <span className="time-minimum">{formatMinutes(totalMinutes)}</span>
          </p>
          <p className="font-medium">
            Saldo banco negativo (20h): <span className="time-maximum">{formatMinutes(negativeRemaining)}</span>
          </p>
          {realBank > 0 && (
            <p className="font-medium">
              Banco de horas real: <span className="time-normal">{formatMinutes(realBank)}</span>
            </p>
          )}
        </div>
      </section>

      <Button onClick={() => navigate("/")} className="back-button mt-8">
        Voltar
      </Button>
    
      <Footer />
</main>
  );
};

export default BancoHoras;