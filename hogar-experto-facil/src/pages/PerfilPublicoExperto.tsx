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

  const totalReactions = {
    heart:   portfolio.reduce((s, i) => s + i.reactions.heart,   0),
    like:    portfolio.reduce((s, i) => s + i.reactions.like,    0),
    clap:    portfolio.reduce((s, i) => s + i.reactions.clap,    0),
    dislike: portfolio.reduce((s, i) => s + i.reactions.dislike, 0),
  };

  const allReviews = portfolio.flatMap((item) => item.reviews);
  const totalReviews = allReviews.length;
  const ratingsSum = allReviews.reduce((sum, r) => sum + parseFloat(String(r.rating)), 0);
  const avgRating = totalReviews > 0 ? ratingsSum / totalReviews : null;
  const avgRatingDisplay = avgRating !== null ? avgRating.toFixed(1) : '—';

  const handleContact = () => {
    if (!isLoggedIn) {
      openAuthDialog('login');
      return;
    }
    const name = `${experto.nombres} ${experto.apellidos}`.trim();
    navigate(`${ROUTES.MENSAJES}?contactId=${experto.id}&contactName=${encodeURIComponent(name)}`);
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
                  <span className="font-semibold text-foreground">{avgRatingDisplay}</span>
                  <span>({totalReviews} reseña{totalReviews !== 1 ? 's' : ''})</span>
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
        {/* Trabajos */}
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <Briefcase className="w-5 h-5 text-primary shrink-0" />
            <div>
              <p className="text-xl font-bold">{portfolio.length}</p>
              <p className="text-xs text-muted-foreground">Trabajos</p>
            </div>
          </CardContent>
        </Card>

        {/* Reacciones desglosadas */}
        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-muted-foreground mb-2">Reacciones</p>
            <div className="grid grid-cols-2 gap-x-3 gap-y-1">
              {([
                { emoji: '❤️', count: totalReactions.heart   },
                { emoji: '👍', count: totalReactions.like    },
                { emoji: '👏', count: totalReactions.clap    },
                { emoji: '👎', count: totalReactions.dislike },
              ] as const).map(({ emoji, count }) => (
                <span key={emoji} className="flex items-center gap-1 text-sm font-semibold">
                  <span>{emoji}</span>
                  <span>{count}</span>
                </span>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Reseñas */}
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <Star className="w-5 h-5 text-yellow-400 shrink-0" />
            <div>
              <p className="text-xl font-bold">{totalReviews}</p>
              <p className="text-xs text-muted-foreground">Reseñas</p>
            </div>
          </CardContent>
        </Card>

        {/* Calificación */}
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <BadgeCheck className="w-5 h-5 text-green-600 shrink-0" />
            <div>
              <p className="text-xl font-bold">{avgRatingDisplay}</p>
              <p className="text-xs text-muted-foreground">Calificación</p>
            </div>
          </CardContent>
        </Card>
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
