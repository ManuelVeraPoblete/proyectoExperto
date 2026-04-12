import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
  Star,
  MapPin,
  Phone,
  Clock,
  BadgeCheck,
  User,
  Briefcase,
  DollarSign,
  ArrowLeft,
  MessageCircle,
} from 'lucide-react';
import { usePerfilPublicoExperto } from '@/hooks/usePerfilPublicoExperto';
import PortfolioItemCard from '@/components/experto/PortfolioItemCard';
import { useAuth } from '@/contexts/AuthContext';
import { ROUTES } from '@/constants';

const PerfilPublicoExperto = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { openAuthDialog } = useAuth();

  const {
    experto,
    portfolio,
    myReactions,
    toggleReaction,
    addReview,
    currentUserId,
    isLoggedIn,
  } = usePerfilPublicoExperto(id ?? '');

  if (!experto) {
    return (
      <main className="container mx-auto px-4 py-16 text-center">
        <p className="text-muted-foreground">No se encontró el perfil del experto.</p>
        <Button variant="outline" className="mt-4" onClick={() => navigate(ROUTES.BUSCAR)}>
          <ArrowLeft className="w-4 h-4 mr-2" /> Volver a buscar
        </Button>
      </main>
    );
  }

  const totalReactions = portfolio.reduce(
    (acc, item) =>
      acc +
      item.reactions.heart +
      item.reactions.like +
      item.reactions.clap +
      item.reactions.dislike,
    0,
  );

  const handleContact = () => {
    if (!isLoggedIn) {
      openAuthDialog('login');
      return;
    }
    navigate(ROUTES.MENSAJES);
  };

  return (
    <main className="container mx-auto px-4 py-8 max-w-5xl">
      {/* Breadcrumb / volver */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" /> Volver
      </button>

      {/* ── Cabecera del perfil ──────────────────────────────────────── */}
      <Card className="mb-8">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-6">
            {/* Avatar */}
            <div className="flex flex-col items-center sm:items-start shrink-0">
              <Avatar className="w-28 h-28">
                <AvatarImage src={experto.avatar} />
                <AvatarFallback className="bg-primary text-white text-4xl">
                  <User className="w-14 h-14" />
                </AvatarFallback>
              </Avatar>
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-start gap-2 mb-1">
                <h1 className="text-2xl font-bold text-foreground">
                  {experto.nombres} {experto.apellidos}
                </h1>
                {experto.isVerified && (
                  <Badge className="bg-green-100 text-green-800 flex items-center gap-1">
                    <BadgeCheck className="w-3.5 h-3.5" /> Verificado
                  </Badge>
                )}
              </div>

              {/* Especialidades */}
              <div className="flex flex-wrap gap-1.5 mb-3">
                {experto.especialidades.map((esp) => (
                  <Badge key={esp} variant="secondary">{esp}</Badge>
                ))}
              </div>

              {/* Métricas */}
              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-4">
                <span className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-semibold text-foreground">{experto.calificacion}</span>
                  <span>({experto.reviewCount} reseñas)</span>
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {experto.comuna}, {experto.region}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {experto.experience}
                </span>
                {experto.hourlyRate && (
                  <span className="flex items-center gap-1">
                    <DollarSign className="w-4 h-4" />
                    ${experto.hourlyRate.toLocaleString()}/hora
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <Phone className="w-4 h-4" />
                  {experto.telefono}
                </span>
              </div>

              {/* Descripción */}
              {experto.descripcion && (
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {experto.descripcion}
                </p>
              )}
            </div>

            {/* Botón contactar */}
            <div className="flex sm:flex-col items-start">
              <Button onClick={handleContact} className="gap-2">
                <MessageCircle className="w-4 h-4" /> Contactar
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ── Stats rápidas ───────────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {[
          {
            label: 'Trabajos',
            value: portfolio.length,
            icon: <Briefcase className="w-5 h-5 text-primary" />,
          },
          {
            label: 'Reacciones',
            value: totalReactions,
            icon: <span className="text-lg">❤️</span>,
          },
          {
            label: 'Reseñas',
            value: portfolio.reduce((a, p) => a + p.reviews.length, 0),
            icon: <Star className="w-5 h-5 text-yellow-400" />,
          },
          {
            label: 'Calificación',
            value: experto.calificacion,
            icon: <BadgeCheck className="w-5 h-5 text-green-600" />,
          },
        ].map(({ label, value, icon }) => (
          <Card key={label}>
            <CardContent className="p-4 flex items-center gap-3">
              {icon}
              <div>
                <p className="text-xl font-bold">{value}</p>
                <p className="text-xs text-muted-foreground">{label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* ── Portafolio ──────────────────────────────────────────────── */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Portafolio de trabajos</CardTitle>
          {!isLoggedIn && (
            <p className="text-sm text-muted-foreground">
              <button
                onClick={() => openAuthDialog('login')}
                className="text-primary underline-offset-2 hover:underline"
              >
                Inicia sesión
              </button>{' '}
              para reaccionar y comentar los trabajos.
            </p>
          )}
        </CardHeader>

        <Separator />

        <CardContent className="pt-6">
          {portfolio.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Briefcase className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p className="font-medium">Este experto aún no tiene trabajos en su portafolio.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {portfolio.map((item) => (
                <PortfolioItemCard
                  key={item.id}
                  item={item}
                  myReaction={myReactions[item.id] ?? null}
                  onToggleReaction={isLoggedIn ? toggleReaction : () => openAuthDialog('login')}
                  onAddReview={isLoggedIn ? addReview : undefined}
                  isOwner={false}
                  currentUserId={currentUserId}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </main>
  );
};

export default PerfilPublicoExperto;
