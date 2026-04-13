import React, { useState } from 'react';
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
  Pencil,
  Plus,
  User,
  Briefcase,
  DollarSign,
} from 'lucide-react';
import { useExpertoPerfil } from '@/hooks/useExpertoPerfil';
import PortfolioItemCard from '@/components/experto/PortfolioItemCard';
import AddPortfolioModal from '@/components/experto/AddPortfolioModal';
import EditPerfilModal from '@/components/experto/EditPerfilModal';
import { useAuth } from '@/contexts/AuthContext';
import { CreatePortfolioData } from '@/services/api/portfolioService';

const PerfilExperto = () => {
  const { user } = useAuth();
  const {
    expertoPerfil,
    portfolio,
    myReactions,
    toggleReaction,
    addPortfolioItem,
    removePortfolioItem,
    savePerfilChanges,
  } = useExpertoPerfil();

  const [isAddPortfolioOpen, setIsAddPortfolioOpen] = useState(false);
  const [isEditPerfilOpen, setIsEditPerfilOpen] = useState(false);

  if (!expertoPerfil) {
    return (
      <main className="container mx-auto px-4 py-16 text-center">
        <p className="text-muted-foreground">Debes iniciar sesión como experto para ver tu perfil.</p>
      </main>
    );
  }

  const handleAdd = (data: CreatePortfolioData) => {
    addPortfolioItem(data);
    setIsAddPortfolioOpen(false);
  };

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

  return (
    <main className="container mx-auto px-4 py-8 max-w-5xl">
      {/* ── Cabecera del perfil ──────────────────────────────────────── */}
      <Card className="mb-8">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-6">
            {/* Avatar */}
            <div className="flex flex-col items-center sm:items-start shrink-0">
              <Avatar className="w-28 h-28">
                <AvatarImage src={expertoPerfil.avatar} />
                <AvatarFallback className="bg-primary text-white text-4xl">
                  <User className="w-14 h-14" />
                </AvatarFallback>
              </Avatar>
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-start gap-2 mb-1">
                <h1 className="text-2xl font-bold text-foreground">
                  {expertoPerfil.nombres} {expertoPerfil.apellidos}
                </h1>
                {expertoPerfil.isVerified && (
                  <Badge className="bg-green-100 text-green-800 flex items-center gap-1">
                    <BadgeCheck className="w-3.5 h-3.5" /> Verificado
                  </Badge>
                )}
              </div>

              {/* Especialidades */}
              <div className="flex flex-wrap gap-1.5 mb-3">
                {expertoPerfil.especialidades.map((esp) => (
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
                  {expertoPerfil.comuna}, {expertoPerfil.region}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {expertoPerfil.experience}
                </span>
                {expertoPerfil.hourlyRate && (
                  <span className="flex items-center gap-1">
                    <DollarSign className="w-4 h-4" />
                    ${expertoPerfil.hourlyRate.toLocaleString()}/hora
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <Phone className="w-4 h-4" />
                  {expertoPerfil.telefono}
                </span>
              </div>

              {/* Descripción */}
              {expertoPerfil.descripcion && (
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {expertoPerfil.descripcion}
                </p>
              )}
            </div>

            {/* Botón editar */}
            <div className="flex sm:flex-col items-start">
              <Button variant="outline" size="sm" onClick={() => setIsEditPerfilOpen(true)}>
                <Pencil className="w-4 h-4 mr-1" /> Editar perfil
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
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-lg">Portafolio de trabajos</CardTitle>
          <Button size="sm" onClick={() => setIsAddPortfolioOpen(true)}>
            <Plus className="w-4 h-4 mr-1" /> Agregar trabajo
          </Button>
        </CardHeader>

        <Separator />

        <CardContent className="pt-6">
          {portfolio.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Briefcase className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p className="font-medium">Aún no tienes trabajos en tu portafolio</p>
              <p className="text-sm mt-1">Agrega tus trabajos para que los clientes puedan ver tu experiencia.</p>
              <Button className="mt-4" onClick={() => setIsAddPortfolioOpen(true)}>
                <Plus className="w-4 h-4 mr-1" /> Agregar primer trabajo
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {portfolio.map((item) => (
                <PortfolioItemCard
                  key={item.id}
                  item={item}
                  myReaction={myReactions[item.id] ?? null}
                  onToggleReaction={toggleReaction}
                  onDelete={removePortfolioItem}
                  isOwner
                  currentUserId={user?.id}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* ── Modales ─────────────────────────────────────────────────── */}
      <AddPortfolioModal
        isOpen={isAddPortfolioOpen}
        onClose={() => setIsAddPortfolioOpen(false)}
        onAdd={handleAdd}
      />

      <EditPerfilModal
        isOpen={isEditPerfilOpen}
        onClose={() => setIsEditPerfilOpen(false)}
        perfil={{
          nombres: expertoPerfil.nombres,
          apellidos: expertoPerfil.apellidos,
          telefono: expertoPerfil.telefono ?? '',
          direccion: expertoPerfil.direccion ?? '',
          region: expertoPerfil.region ?? '',
          comuna: expertoPerfil.comuna ?? '',
          descripcion: expertoPerfil.descripcion ?? '',
          especialidades: expertoPerfil.especialidades,
          experience: expertoPerfil.experience,
          hourlyRate: expertoPerfil.hourlyRate,
        }}
        onSave={savePerfilChanges}
      />
    </main>
  );
};

export default PerfilExperto;
