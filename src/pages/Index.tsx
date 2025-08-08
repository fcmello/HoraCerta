
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import Footer from "@/components/common/Footer";
import { Instagram } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="page-container bg-white">
      <h1 className="text-3xl font-bold mb-8 text-[#266e42]">Horas de Trabalho</h1>
      <div className="flex flex-col w-full max-w-sm space-y-4">
        <Button 
          className="nav-button bg-[#266e42] hover:bg-[#266e42]"
          onClick={() => navigate("/ponto")}
        >
          Ponto
        </Button>
        <Button 
          className="nav-button bg-[#266e42] hover:bg-[#266e42]"
          onClick={() => navigate("/estimar")}
        >
          Estimar hora de saída
        </Button>
        <Button 
          className="nav-button bg-[#266e42] hover:bg-[#266e42]"
          onClick={() => navigate("/banco-horas")}
        >
          Banco de Horas
        </Button>
        <Button 
          className="nav-button bg-[#266e42] hover:bg-[#266e42]"
          onClick={() => navigate("/folgas")}
        >
          Folgas
        </Button>
      <Footer />
      </div>
      <footer className="fixed bottom-0 left-0 right-0 p-4 bg-white/80 backdrop-blur-sm border-t mt-auto z-10">
        <a 
          href="https://www.instagram.com/fcmello.design/" 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 text-[#266e42] hover:text-[#266e42] transition-colors"
          style={{ marginBottom: 'env(safe-area-inset-bottom)' }}
        >
          <Instagram size={20} />
          <span>@fcmello.design</span>
        </a>
      </footer>
      <Footer />
    </div>
  );
};

export default Index;
