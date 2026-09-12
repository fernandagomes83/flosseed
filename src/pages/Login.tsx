import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, UserX, ArrowLeft, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLanguage } from "@/hooks/useLanguage";
import LanguageSelector from "@/components/LanguageSelector";
import * as z from "zod";

const Login = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [isGmailLoading, setIsGmailLoading] = useState(false);
  const [isAnonymousLoading, setIsAnonymousLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const formSchema = z.object({
    institution: z.string().min(1, t('login.form.institution.error')),
    name: z.string().min(1, t('login.form.name.error')),
    course: z.string().min(1, t('login.form.course.error')),
    state: z.string().optional(),
    city: z.string().optional(),
    phone: z.string().optional(),
    email: z.string().email(t('login.form.email.error')).or(z.literal("")).optional(),
  });

  type FormData = z.infer<typeof formSchema>;
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const handleGmailLogin = () => {
    setShowForm(true);
  };

  const onSubmit = async (data: FormData) => {
    console.log("Form data:", data);
    
    // Remover flag de anônimo e salvar dados do usuário no localStorage para personalização
    localStorage.removeItem('isAnonymous');
    localStorage.setItem('userData', JSON.stringify({
      name: data.name,
      institution: data.institution,
      course: data.course,
      state: data.state,
      city: data.city,
      phone: data.phone,
      email: data.email,
    }));
    
    // Navegar para avaliação
    setTimeout(() => {
      navigate("/avaliacao");
    }, 1000);
  };

  const handleAnonymousLogin = () => {
    setIsAnonymousLoading(true);
    
    // Limpar todos os dados anteriores e definir modo anônimo
    localStorage.removeItem('userData');
    localStorage.removeItem('assessmentAnswers');
    localStorage.removeItem('classifiedProfile');
    localStorage.removeItem('projectConfigData');
    localStorage.setItem('isAnonymous', 'true');
    
    // Navegar para auto-avaliação após carregamento
    setTimeout(() => {
      setIsAnonymousLoading(false);
      navigate("/avaliacao");
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center px-4 relative overflow-hidden">
      {/* Elementos decorativos de fundo */}
      <div className="absolute top-20 left-20 w-32 h-32 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 right-20 w-40 h-40 bg-secondary/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      <div className="absolute top-1/2 left-10 w-24 h-24 bg-accent/10 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '2s' }}></div>

      {/* Seletor de Idioma */}
      <div className="absolute top-6 right-6 animate-fade-in">
        <LanguageSelector />
      </div>

      {/* Botão de voltar */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => navigate("/")}
        className="absolute top-6 left-6 text-muted-foreground hover:text-foreground transition-colors animate-fade-in"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        {t('login.back')}
      </Button>

      <div className="w-full max-w-2xl space-y-8 animate-fade-in">
        {/* Seção do Logo */}
        <div className="text-center space-y-4 animate-scale-in" style={{ animationDelay: '0.2s' }}>
          <div className="flex justify-center">
            <div className="relative">
              <img 
                src="/lovable-uploads/50efaa77-26f1-450c-a19d-fd2b8fbb713b.png" 
                alt="FLOSSeed" 
                className="h-20 w-20 hover-scale transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
            </div>
          </div>
          <div>
            <h1 className="text-3xl font-bold gradient-text hover-scale">{t('login.title')}</h1>
            <p className="text-muted-foreground mt-2 animate-fade-in" style={{ animationDelay: '0.4s' }}>
              {t('login.subtitle')}
            </p>
          </div>
        </div>

        {/* Card de Formulário ou Card de Opções de Login */}
        {showForm ? (
          <Card className="shadow-elegant border-border/50 backdrop-blur-sm bg-background/95 hover:shadow-2xl transition-all duration-300 animate-scale-in">
            <CardHeader className="text-center space-y-2">
              <CardTitle className="text-2xl bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                <User className="inline-block mr-2 h-6 w-6" />
                {t('login.profile.title')}
              </CardTitle>
              <CardDescription className="text-base">
                {t('login.profile.description')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <Label htmlFor="institution" className="text-sm font-medium">
                      {t('login.form.institution')} *
                    </Label>
                    <Input
                      id="institution"
                      type="text"
                      placeholder={t('login.form.institution.placeholder')}
                      {...register("institution")}
                      className={errors.institution ? "border-destructive" : ""}
                    />
                    {errors.institution && (
                      <p className="text-xs text-destructive mt-1">{errors.institution.message}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="name" className="text-sm font-medium">
                      {t('login.form.name')} *
                    </Label>
                    <Input
                      id="name"
                      type="text"
                      placeholder={t('login.form.name.placeholder')}
                      {...register("name")}
                      className={errors.name ? "border-destructive" : ""}
                    />
                    {errors.name && (
                      <p className="text-xs text-destructive mt-1">{errors.name.message}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="course" className="text-sm font-medium">
                      {t('login.form.course')} *
                    </Label>
                    <Input
                      id="course"
                      type="text"
                      placeholder={t('login.form.course.placeholder')}
                      {...register("course")}
                      className={errors.course ? "border-destructive" : ""}
                    />
                    {errors.course && (
                      <p className="text-xs text-destructive mt-1">{errors.course.message}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label htmlFor="state" className="text-sm font-medium">
                        {t('login.form.state')}
                      </Label>
                      <Input
                        id="state"
                        type="text"
                        placeholder={t('login.form.state.placeholder')}
                        {...register("state")}
                        className={errors.state ? "border-destructive" : ""}
                      />
                      {errors.state && (
                        <p className="text-xs text-destructive mt-1">{errors.state.message}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="city" className="text-sm font-medium">
                        {t('login.form.city')}
                      </Label>
                      <Input
                        id="city"
                        type="text"
                        placeholder={t('login.form.city.placeholder')}
                        {...register("city")}
                        className={errors.city ? "border-destructive" : ""}
                      />
                      {errors.city && (
                        <p className="text-xs text-destructive mt-1">{errors.city.message}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="phone" className="text-sm font-medium">
                      {t('login.form.phone')}
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder={t('login.form.phone.placeholder')}
                      {...register("phone")}
                      className={errors.phone ? "border-destructive" : ""}
                    />
                    {errors.phone && (
                      <p className="text-xs text-destructive mt-1">{errors.phone.message}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="email" className="text-sm font-medium">
                      {t('login.form.email')}
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder={t('login.form.email.placeholder')}
                      {...register("email")}
                      className={errors.email ? "border-destructive" : ""}
                    />
                    {errors.email && (
                      <p className="text-xs text-destructive mt-1">{errors.email.message}</p>
                    )}
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowForm(false)}
                    className="flex-1"
                  >
                    {t('login.form.back')}
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 bg-primary hover:bg-primary/90"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        {t('login.form.saving')}
                      </>
                    ) : (
                      t('login.form.continue')
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        ) : (
          <Card className="shadow-elegant border-border/50 backdrop-blur-sm bg-background/95 hover:shadow-2xl transition-all duration-300 animate-scale-in" style={{ animationDelay: '0.6s' }}>
            <CardHeader className="text-center space-y-2">
              <CardTitle className="text-2xl bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                {t('login.welcome')}
              </CardTitle>
              <CardDescription className="text-base">
                {t('login.welcome.description')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              {/* Botão de Login com Gmail */}
              <Button 
                className="w-full h-14 text-lg font-medium bg-white text-gray-700 border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 hover:shadow-lg transition-all duration-300 group relative overflow-hidden"
                onClick={handleGmailLogin}
                disabled={isGmailLoading || isAnonymousLoading}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-red-50 to-blue-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative flex items-center justify-center">
                  {isGmailLoading ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-red-500 mr-3"></div>
                  ) : (
                    <Mail className="mr-3 h-5 w-5 text-red-500 group-hover:scale-110 transition-transform duration-200" />
                  )}
                  {isGmailLoading ? t('login.connecting') : t('login.start')}
                </div>
              </Button>

              {/* Divisor */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-3 text-muted-foreground font-medium">{t('login.or')}</span>
                </div>
              </div>

              {/* Botão de Login Anônimo */}
              <Button 
                variant="outline"
                className="w-full h-14 text-lg font-medium border-2 border-primary/20 hover:border-primary/40 hover:bg-primary/5 hover:shadow-lg transition-all duration-300 group relative overflow-hidden"
                onClick={handleAnonymousLogin}
                disabled={isGmailLoading || isAnonymousLoading}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative flex items-center justify-center">
                  {isAnonymousLoading ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary mr-3"></div>
                  ) : (
                    <UserX className="mr-3 h-5 w-5 group-hover:scale-110 transition-transform duration-200" />
                  )}
                  {isAnonymousLoading ? t('login.starting') : t('login.anonymous')}
                </div>
              </Button>

              {/* Caixa de Informação */}
              <div className="mt-6 p-4 bg-primary/5 border border-primary/10 rounded-lg">
                <p className="text-sm text-muted-foreground text-center">
                  {t('login.tip')}
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Emblemas de segurança */}
        <div className="flex items-center justify-center space-x-4 text-xs text-muted-foreground animate-fade-in" style={{ animationDelay: '0.8s' }}>
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>{t('login.secure')}</span>
          </div>
          <div className="w-1 h-1 bg-muted-foreground rounded-full"></div>
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <span>{t('login.free')}</span>
          </div>
          <div className="w-1 h-1 bg-muted-foreground rounded-full"></div>
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
            <span>{t('login.no.spam')}</span>
          </div>
        </div>

        {/* Informações do Rodapé */}
        <div className="text-center text-sm text-muted-foreground animate-fade-in" style={{ animationDelay: '1s' }}>
          <p>
            {t('login.terms.accept')}{" "}
            <button className="underline hover:text-foreground transition-colors story-link">
              {t('login.terms.link')}
            </button>{" "}
            {t('login.terms.and')}{" "}
            <button className="underline hover:text-foreground transition-colors story-link">
              {t('login.privacy.link')}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;