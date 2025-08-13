import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { 
  Clock, 
  Phone, 
  User, 
  Users, 
  Calendar, 
  Trophy, 
  Target,
  UserCheck,
  Timer,
  CalendarDays,
  MapPin,
  Medal,
  Zap,
  Link
} from "lucide-react";
import stadiumBg from "@/assets/stadium-bg.jpg";

const formSchema = z.object({
  athleteName: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  athletePhone: z.string().min(10, "Telefone deve ter pelo menos 10 dígitos"),
  guardianName: z.string().min(2, "Nome do responsável deve ter pelo menos 2 caracteres"),
  guardianPhone: z.string().min(10, "Telefone do responsável deve ter pelo menos 10 dígitos"),
  interviewDate: z.enum(["hoje", "amanha"], {
    required_error: "Selecione quando será a entrevista",
  }),
  participants: z.enum(["pai", "mae", "pai-mae", "avos", "outro"], {
    required_error: "Selecione quem irá participar",
  }),
  interviewTime: z.string().min(1, "Selecione o horário da entrevista"),
  
});

type FormData = z.infer<typeof formSchema>;

const timeSlots = [
  "08:00", "08:30", "09:00", "09:30", "10:00", "10:30",
  "11:00", "11:30", "14:00", "14:30", "15:00", "15:30",
  "16:00", "16:30", "17:00", "17:30", "18:00", "18:30",
  "19:00", "19:30", "20:00"
];

const participantOptions = [
  { value: "pai", label: "Pai", icon: UserCheck },
  { value: "mae", label: "Mãe", icon: UserCheck },
  { value: "pai-mae", label: "Pai e Mãe", icon: Users },
  { value: "avos", label: "Avós", icon: Users },
  { value: "outro", label: "Outro", icon: User }
];

// Função para aplicar máscara de telefone
const formatPhoneNumber = (value: string) => {
  const cleanedValue = value.replace(/\D/g, '');
  const match = cleanedValue.match(/^(\d{2})(\d{5})(\d{4})$/);
  if (match) {
    return `(${match[1]}) ${match[2]}-${match[3]}`;
  }
  const partialMatch = cleanedValue.match(/^(\d{2})(\d{0,5})(\d{0,4})$/);
  if (partialMatch) {
    let formatted = `(${partialMatch[1]}`;
    if (partialMatch[2]) formatted += `) ${partialMatch[2]}`;
    if (partialMatch[3]) formatted += `-${partialMatch[3]}`;
    return formatted;
  }
  return value;
};

export function AthleteForm() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const webhookUrl = "https://raulgeremia11.app.n8n.cloud/webhook-test/nll";

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const watchedFields = watch();

  const onSubmit = async (data: FormData) => {
    console.log("=== INÍCIO DO SUBMIT ===");
    console.log("Dados recebidos:", data);
    setIsSubmitting(true);
    
    // Dados para enviar ao webhook
    const webhookData = {
      timestamp: new Date().toISOString(),
      athleteName: data.athleteName,
      athletePhone: data.athletePhone,
      guardianName: data.guardianName,
      guardianPhone: data.guardianPhone,
      interviewDate: data.interviewDate,
      participants: data.participants,
      interviewTime: data.interviewTime,
      source: "NLL Nacional 2025 - Cadastro"
    };
    
    console.log("Dados do atleta:", webhookData);
    
    console.log("Enviando para webhook:", webhookUrl);
    console.log("Dados do webhook:", webhookData);
    
    // Enviar para webhook
    try {
      await fetch(webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(webhookData),
      });
      
      console.log("Webhook enviado com sucesso!");
      
      toast({
        title: "Entrevista Agendada com Sucesso!",
        description: `${data.athleteName} - ${data.interviewDate} às ${data.interviewTime}`,
      });
      
      // Reset apenas após sucesso do webhook
      reset();
      setCurrentStep(1);
    } catch (error) {
      console.error("Erro ao enviar webhook:", error);
      toast({
        title: "Entrevista Agendada!",
        description: `${data.athleteName} - ${data.interviewDate} às ${data.interviewTime}. Erro ao conectar com o sistema.`,
        variant: "destructive",
      });
      
      // Reset mesmo com erro
      reset();
      setCurrentStep(1);
    }
    setIsSubmitting(false);
  };

  const nextStep = () => {
    if (currentStep < 3) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const isStepValid = (step: number) => {
    console.log(`=== VALIDAÇÃO STEP ${step} ===`);
    console.log("watchedFields:", watchedFields);
    
    switch (step) {
      case 1:
        const step1Valid = watchedFields.athleteName && watchedFields.athletePhone;
        console.log("Step 1 válido:", step1Valid);
        return step1Valid;
      case 2:
        const step2Valid = watchedFields.guardianName && watchedFields.guardianPhone;
        console.log("Step 2 válido:", step2Valid);
        return step2Valid;
      case 3:
        const step3Valid = watchedFields.interviewDate && watchedFields.participants && watchedFields.interviewTime;
        console.log("Step 3 válido:", step3Valid);
        console.log("interviewDate:", watchedFields.interviewDate);
        console.log("participants:", watchedFields.participants);
        console.log("interviewTime:", watchedFields.interviewTime);
        return step3Valid;
      default:
        return false;
    }
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
          
          <div className="space-y-2 md:space-y-3">
            <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold text-primary leading-tight font-orbitron">
              NLL NACIONAL 2025
            </h1>
            <p className="text-sm md:text-lg text-muted-foreground max-w-md mx-auto font-medium">
              Cadastro para Entrevista de Seleção
            </p>
            <p className="text-xs md:text-sm text-gold/80 max-w-lg mx-auto font-medium leading-relaxed">
              A maior edição da nossa história. Venha competir pelo título de Campeão Nacional.
            </p>
            <div className="flex justify-center items-center gap-3 text-gold text-sm md:text-base font-medium">
              <Trophy className="w-4 h-4 md:w-5 md:h-5" />
              <span>CAMPEÃO NACIONAL</span>
              <Target className="w-4 h-4 md:w-5 md:h-5" />
            </div>
            <div className="flex justify-center items-center gap-2 text-xs md:text-sm text-muted-foreground">
              <Medal className="w-3 h-3 md:w-4 md:h-4" />
              <span>CT Atlético Sorocaba • Recrutadores USA</span>
            </div>
          </div>
        </div>

        {/* Progress Indicator */}
        <div className="flex justify-center mb-6 md:mb-8">
          <div className="flex items-center space-x-2 md:space-x-4">
            {[
              { number: 1, label: "Atleta" },
              { number: 2, label: "Responsável" },
              { number: 3, label: "Agendamento" }
            ].map((step, index) => (
              <div key={step.number} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div 
                    className={`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center text-sm md:text-base font-bold transition-all duration-300 border-2 ${
                      currentStep >= step.number 
                        ? 'bg-gradient-gold text-navy border-gold shadow-gold-glow' 
                        : 'bg-secondary/20 text-muted-foreground border-border'
                    }`}
                  >
                    {step.number}
                  </div>
                  <span className="text-xs text-muted-foreground mt-1 hidden sm:block">
                    {step.label}
                  </span>
                </div>
                {index < 2 && (
                  <div className={`w-8 md:w-16 h-1 mx-2 md:mx-4 transition-colors duration-300 rounded-full ${
                    currentStep > step.number ? 'bg-gold' : 'bg-secondary/40'
                  }`}></div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Form Container */}
        <div className="flex-1 flex justify-center">
          <div className="w-full max-w-md md:max-w-lg lg:max-w-xl">
            <Card className="bg-gradient-card/95 border-gold/20 shadow-stadium backdrop-blur-md">
              <CardHeader className="text-center pb-4">
                <CardTitle className="text-lg md:text-xl text-primary flex items-center justify-center gap-3 font-orbitron">
                  {currentStep === 1 && <><User className="w-5 h-5 text-gold" /> Dados do Atleta</>}
                  {currentStep === 2 && <><Users className="w-5 h-5 text-gold" /> Dados do Responsável</>}
                  {currentStep === 3 && <><Calendar className="w-5 h-5 text-gold" /> Agendamento da Entrevista</>}
                </CardTitle>
              </CardHeader>

              <CardContent className="px-4 md:px-6">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 md:space-y-6">
                  
                  {/* Step 1: Athlete Data */}
                  {currentStep === 1 && (
                    <div className="space-y-4 animate-slide-in-up">
                      <div className="space-y-2">
                        <Label htmlFor="athleteName" className="text-foreground flex items-center gap-2 font-medium">
                          <User className="w-4 h-4 text-gold" />
                          Nome Completo do Atleta
                        </Label>
                        <p className="text-xs text-muted-foreground mb-2">
                          Digite seu nome completo, conforme o documento oficial.
                        </p>
                        <Input
                          id="athleteName"
                          {...register("athleteName")}
                          className="bg-input/80 border-border focus:border-gold focus:ring-gold transition-all duration-300 text-base h-12"
                          placeholder="Ex: João Silva Santos"
                        />
                        {errors.athleteName && (
                          <p className="text-destructive text-sm flex items-center gap-2">
                            <Zap className="w-3 h-3" />
                            {errors.athleteName.message}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="athletePhone" className="text-foreground flex items-center gap-2 font-medium">
                          <Phone className="w-4 h-4 text-gold" />
                          Telefone do Atleta
                        </Label>
                        <p className="text-xs text-muted-foreground mb-2">
                          Informe um número de telefone com DDD, preferencialmente WhatsApp.
                        </p>
                        <Input
                          id="athletePhone"
                          {...register("athletePhone")}
                          className="bg-input/80 border-border focus:border-gold focus:ring-gold transition-all duration-300 text-base h-12"
                          placeholder="(11) 99999-9999"
                          onChange={(e) => {
                            const formatted = formatPhoneNumber(e.target.value);
                            setValue("athletePhone", formatted);
                          }}
                        />
                        {errors.athletePhone && (
                          <p className="text-destructive text-sm flex items-center gap-2">
                            <Zap className="w-3 h-3" />
                            {errors.athletePhone.message}
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Step 2: Guardian Data */}
                  {currentStep === 2 && (
                    <div className="space-y-4 animate-slide-in-up">
                      <div className="space-y-2">
                        <Label htmlFor="guardianName" className="text-foreground flex items-center gap-2 font-medium">
                          <UserCheck className="w-4 h-4 text-gold" />
                          Nome do Responsável
                        </Label>
                        <p className="text-xs text-muted-foreground mb-2">
                          Nome completo do pai, mãe ou tutor legal.
                        </p>
                        <Input
                          id="guardianName"
                          {...register("guardianName")}
                          className="bg-input/80 border-border focus:border-gold focus:ring-gold transition-all duration-300 text-base h-12"
                          placeholder="Ex: Maria Silva Santos"
                        />
                        {errors.guardianName && (
                          <p className="text-destructive text-sm flex items-center gap-2">
                            <Zap className="w-3 h-3" />
                            {errors.guardianName.message}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="guardianPhone" className="text-foreground flex items-center gap-2 font-medium">
                          <Phone className="w-4 h-4 text-gold" />
                          Telefone do Responsável
                        </Label>
                        <p className="text-xs text-muted-foreground mb-2">
                          Telefone de contato do responsável, com DDD.
                        </p>
                        <Input
                          id="guardianPhone"
                          {...register("guardianPhone")}
                          className="bg-input/80 border-border focus:border-gold focus:ring-gold transition-all duration-300 text-base h-12"
                          placeholder="(11) 99999-9999"
                          onChange={(e) => {
                            const formatted = formatPhoneNumber(e.target.value);
                            setValue("guardianPhone", formatted);
                          }}
                        />
                        {errors.guardianPhone && (
                          <p className="text-destructive text-sm flex items-center gap-2">
                            <Zap className="w-3 h-3" />
                            {errors.guardianPhone.message}
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Step 3: Interview Scheduling */}
                  {currentStep === 3 && (
                    <div className="space-y-4 animate-slide-in-up">
                      <div className="space-y-3">
                        <Label className="text-foreground flex items-center gap-2 font-medium">
                          <CalendarDays className="w-4 h-4 text-gold" />
                          Quando será a entrevista?
                        </Label>
                        <p className="text-xs text-muted-foreground mb-2">
                          Selecione o dia de sua preferência para a entrevista.
                        </p>
                        <RadioGroup
                          onValueChange={(value) => setValue("interviewDate", value as "hoje" | "amanha")}
                          className="grid grid-cols-2 gap-3"
                          value={watchedFields.interviewDate || ""}
                        >
                          <div className="relative">
                            <RadioGroupItem value="hoje" id="hoje" className="sr-only" />
                            <Label 
                              htmlFor="hoje" 
                              className={`flex items-center justify-center p-4 border rounded-lg cursor-pointer transition-all duration-300 text-sm md:text-base font-medium ${
                                watchedFields.interviewDate === "hoje" 
                                  ? "bg-gold/20 border-gold text-gold" 
                                  : "bg-secondary/20 hover:bg-gold/20 border-border hover:border-gold"
                              }`}
                            >
                              <CalendarDays className="w-4 h-4 mr-2" />
                              Hoje
                            </Label>
                          </div>
                          <div className="relative">
                            <RadioGroupItem value="amanha" id="amanha" className="sr-only" />
                            <Label 
                              htmlFor="amanha" 
                              className={`flex items-center justify-center p-4 border rounded-lg cursor-pointer transition-all duration-300 text-sm md:text-base font-medium ${
                                watchedFields.interviewDate === "amanha" 
                                  ? "bg-gold/20 border-gold text-gold" 
                                  : "bg-secondary/20 hover:bg-gold/20 border-border hover:border-gold"
                              }`}
                            >
                              <Calendar className="w-4 h-4 mr-2" />
                              Amanhã
                            </Label>
                          </div>
                        </RadioGroup>
                        {errors.interviewDate && (
                          <p className="text-destructive text-sm flex items-center gap-2">
                            <Zap className="w-3 h-3" />
                            {errors.interviewDate.message}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label className="text-foreground flex items-center gap-2 font-medium">
                          <Users className="w-4 h-4 text-gold" />
                          Quem irá participar da entrevista?
                        </Label>
                        <p className="text-xs text-muted-foreground mb-2">
                          Selecione todos que estarão presentes.
                        </p>
                        <Select onValueChange={(value) => setValue("participants", value as any)}>
                          <SelectTrigger className="bg-input/80 border-border focus:border-gold focus:ring-gold transition-all duration-300 text-base h-12">
                            <SelectValue placeholder="Selecione os participantes" />
                          </SelectTrigger>
                          <SelectContent className="bg-popover border-border">
                            {participantOptions.map((option) => (
                              <SelectItem key={option.value} value={option.value} className="text-base">
                                <span className="flex items-center gap-3">
                                  <option.icon className="w-4 h-4 text-gold" />
                                  <span>{option.label}</span>
                                </span>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {errors.participants && (
                          <p className="text-destructive text-sm flex items-center gap-2">
                            <Zap className="w-3 h-3" />
                            {errors.participants.message}
                          </p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label className="text-foreground flex items-center gap-2 font-medium">
                          <Timer className="w-4 h-4 text-gold" />
                          Horário da Entrevista
                        </Label>
                        <p className="text-xs text-muted-foreground mb-2">
                          Selecione o melhor horário disponível.
                        </p>
                        <Select onValueChange={(value) => setValue("interviewTime", value)}>
                          <SelectTrigger className="bg-input/80 border-border focus:border-gold focus:ring-gold transition-all duration-300 text-base h-12">
                            <SelectValue placeholder="Selecione o horário" />
                          </SelectTrigger>
                          <SelectContent className="bg-popover border-border max-h-48">
                            {timeSlots.map((time) => (
                              <SelectItem key={time} value={time} className="text-base">
                                <span className="flex items-center gap-2">
                                  <Clock className="w-4 h-4 text-gold" />
                                  {time}
                                </span>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {errors.interviewTime && (
                          <p className="text-destructive text-sm flex items-center gap-2">
                            <Zap className="w-3 h-3" />
                            {errors.interviewTime.message}
                          </p>
                        )}
                      </div>

                    </div>
                  )}

                  {/* Navigation Buttons */}
                  <div className="flex gap-3 pt-6">
                    {currentStep > 1 && (
                      <Button
                        type="button"
                        onClick={prevStep}
                        variant="outline"
                        className="flex-1 bg-secondary/20 border-border hover:bg-gold/20 hover:border-gold transition-all duration-300 h-12 font-medium"
                      >
                        <User className="w-4 h-4 mr-2" />
                        Voltar
                      </Button>
                    )}
                    
                    {currentStep < 3 ? (
                      <Button
                        type="button"
                        onClick={nextStep}
                        disabled={!isStepValid(currentStep)}
                        className="flex-1 bg-gradient-gold text-navy hover:animate-gold-glow transition-all duration-300 font-semibold h-12 font-orbitron"
                      >
                        Próximo
                        <Target className="w-4 h-4 ml-2" />
                      </Button>
                    ) : (
                      <Button
                        type="submit"
                        disabled={isSubmitting || !isStepValid(currentStep)}
                        onClick={() => {
                          console.log("=== BOTÃO CLICADO ===");
                          console.log("isSubmitting:", isSubmitting);
                          console.log("isStepValid:", isStepValid(currentStep));
                          console.log("currentStep:", currentStep);
                          console.log("watchedFields:", watchedFields);
                        }}
                        className="flex-1 bg-gradient-gold text-navy hover:animate-gold-glow transition-all duration-300 font-semibold text-base h-14 font-orbitron"
                      >
                        {isSubmitting ? (
                          <span className="flex items-center gap-2">
                            <Timer className="w-4 h-4 animate-spin" />
                            Processando...
                          </span>
                        ) : (
                          <span className="flex items-center gap-2">
                            <Trophy className="w-5 h-5" />
                            Finalizar Cadastro e Confirmar Entrevista
                          </span>
                        )}
                      </Button>
                    )}
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
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