import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Trophy, 
  Target,
  Medal,
  MapPin,
  Play,
  Settings,
  CheckCircle2,
  Calendar,
  Clock
} from "lucide-react";
import stadiumBg from "@/assets/stadium-bg.jpg";

export default function ThankYou() {
  const [videoUrl, setVideoUrl] = useState("https://www.youtube.com/embed/dQw4w9WgXcQ");
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Função para extrair o ID do vídeo do YouTube de diferentes formatos de URL
  const getYouTubeEmbedUrl = (url: string) => {
    let videoId = "";
    
    // Para URLs do tipo: https://youtu.be/VIDEO_ID
    if (url.includes("youtu.be/")) {
      videoId = url.split("youtu.be/")[1].split("?")[0];
    }
    // Para URLs do tipo: https://www.youtube.com/watch?v=VIDEO_ID
    else if (url.includes("youtube.com/watch")) {
      const urlParams = new URLSearchParams(url.split("?")[1]);
      videoId = urlParams.get("v") || "";
    }
    // Para URLs já no formato embed
    else if (url.includes("youtube.com/embed/")) {
      return url;
    }
    
    return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
  };

  const handleVideoUrlChange = (url: string) => {
    const embedUrl = getYouTubeEmbedUrl(url);
    setVideoUrl(embedUrl);
  };

  return (
    <div 
      className="min-h-screen relative overflow-hidden font-rajdhani"
      style={{
        backgroundImage: `linear-gradient(rgba(34, 34, 82, 0.92), rgba(15, 23, 42, 0.95)), url(${stadiumBg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      {/* Background logo da Next Academy esfumaçada */}
      <div 
        className="fixed inset-0 z-0 opacity-5"
        style={{
          backgroundImage: `url('/lovable-uploads/4982df4d-7c71-45c5-80ca-9800e2e593a0.png')`,
          backgroundSize: '500px auto',
          backgroundPosition: 'center center',
          backgroundRepeat: 'no-repeat',
          filter: 'blur(3px) brightness(0.2)'
        }}
      ></div>

      {/* Event Info Banner */}
      <div className="fixed top-4 left-4 md:top-6 md:left-6 bg-gradient-gold/20 backdrop-blur-sm border border-gold/30 rounded-lg p-2 md:p-3 z-10">
        <div className="flex items-center gap-2 text-xs md:text-sm text-gold font-medium">
          <MapPin className="w-3 h-3 md:w-4 md:h-4" />
          <span className="hidden sm:inline">5-7 Dezembro</span>
          <span>Sorocaba-SP</span>
        </div>
      </div>

      {/* Settings Button */}
      <div className="fixed top-4 right-4 md:top-6 md:right-6 z-10">
        <Button
          onClick={() => setIsSettingsOpen(!isSettingsOpen)}
          variant="outline"
          size="sm"
          className="bg-secondary/20 border-border hover:bg-gold/20 hover:border-gold transition-all duration-300"
        >
          <Settings className="w-4 h-4" />
        </Button>
      </div>

      {/* Settings Panel */}
      {isSettingsOpen && (
        <div className="fixed top-16 right-4 md:top-20 md:right-6 z-20 w-80 max-w-[calc(100vw-2rem)]">
          <Card className="bg-gradient-card/95 border-gold/20 shadow-stadium backdrop-blur-md">
            <CardContent className="p-4 space-y-3">
              <Label className="text-foreground font-medium">URL do Vídeo do YouTube</Label>
              <Input
                placeholder="Cole a URL do YouTube aqui..."
                onChange={(e) => handleVideoUrlChange(e.target.value)}
                className="bg-input/80 border-border focus:border-gold focus:ring-gold transition-all duration-300"
              />
              <p className="text-xs text-muted-foreground">
                Aceita URLs no formato: youtube.com/watch?v=... ou youtu.be/...
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="relative z-20 min-h-screen flex flex-col px-4 py-6 md:py-8">
        {/* Header Section */}
        <div className="text-center mb-6 md:mb-8 animate-slide-in-up">
          {/* Logo da NLL Central */}
          <div className="flex justify-center items-center mb-4 md:mb-6">
            <div className="relative group">
              <div className="w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 bg-gradient-gold rounded-full flex items-center justify-center animate-float-gentle drop-shadow-2xl transition-transform group-hover:scale-105">
                <span className="text-navy font-black text-xl md:text-2xl lg:text-3xl font-orbitron">NLL</span>
              </div>
              <div className="absolute -inset-2 bg-gradient-gold rounded-full opacity-20 blur-lg animate-pulse-field"></div>
            </div>
          </div>
          
          {/* Success Icon */}
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center border-2 border-green-500/40">
              <CheckCircle2 className="w-8 h-8 text-green-500" />
            </div>
          </div>
          
          <div className="space-y-2 md:space-y-3">
            <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold text-primary leading-tight font-orbitron">
              Obrigado por se juntar à NLL Nacional 2025!
            </h1>
            <p className="text-sm md:text-lg text-gold max-w-md mx-auto font-medium">
              Seu agendamento para a entrevista de seleção foi confirmado.
            </p>
            <p className="text-xs md:text-base text-muted-foreground max-w-lg mx-auto font-medium leading-relaxed">
              Você deu o primeiro passo para elevar seu jogo ao próximo nível. Agora, prepare-se para a experiência que o espera no evento.
            </p>
          </div>
        </div>

        {/* Confirmation Details */}
        <div className="flex justify-center mb-6">
          <Card className="bg-gradient-card/80 border-gold/20 shadow-stadium backdrop-blur-md max-w-md w-full">
            <CardContent className="p-4 space-y-3">
              <div className="flex items-center gap-3 text-gold">
                <Calendar className="w-5 h-5" />
                <span className="font-medium">Entrevista agendada</span>
              </div>
              <div className="flex items-center gap-3 text-muted-foreground">
                <Clock className="w-4 h-4" />
                <span className="text-sm">Em breve você receberá mais detalhes</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Video Section */}
        <div className="flex-1 flex justify-center">
          <div className="w-full max-w-4xl">
            <Card className="bg-gradient-card/95 border-gold/20 shadow-stadium backdrop-blur-md">
              <CardContent className="p-4 md:p-6">
                <div className="text-center mb-4 md:mb-6">
                  <h2 className="text-xl md:text-2xl font-bold text-primary mb-2 font-orbitron flex items-center justify-center gap-3">
                    <Play className="w-6 h-6 text-gold" />
                    Assista ao vídeo abaixo e veja o que te espera no maior torneio da Next Academy!
                  </h2>
                  <p className="text-sm md:text-base text-gold/80">
                    Olhe o que te espera no evento da NLL
                  </p>
                </div>
                
                <div className="aspect-video w-full rounded-lg overflow-hidden bg-secondary/20 border border-border">
                  <iframe
                    src={videoUrl}
                    title="NLL Nacional 2025 - O que te espera"
                    className="w-full h-full"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-6 space-y-4">
          <div className="flex justify-center items-center gap-3 text-gold text-sm md:text-base font-medium">
            <Trophy className="w-4 h-4 md:w-5 md:h-5" />
            <span>Prepare-se para a experiência da sua vida</span>
            <Target className="w-4 h-4 md:w-5 md:h-5" />
          </div>
          
          <Button
            onClick={() => window.location.href = '/'}
            className="bg-gradient-gold text-navy hover:animate-gold-glow transition-all duration-300 font-semibold h-12 px-8 font-orbitron"
          >
            <Trophy className="w-5 h-5 mr-2" />
            Voltar ao Início
          </Button>
        </div>

        {/* Footer */}
        <div className="text-center mt-6 space-y-2">
          <div className="text-xs md:text-sm text-muted-foreground opacity-80 font-medium">
            <p>Rumo ao Profissional • NLL Nacional 2025</p>
          </div>
          <div className="flex justify-center items-center gap-2 text-xs text-gold/60">
            <Medal className="w-3 h-3" />
            <span>Elite Football Championship</span>
            <Medal className="w-3 h-3" />
          </div>
        </div>
      </div>
    </div>
  );
}