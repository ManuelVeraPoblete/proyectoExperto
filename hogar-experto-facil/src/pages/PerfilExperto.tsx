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
import { PortfolioEntry } from '@/types/experto';
import { useAuth } from '@/contexts/AuthContext';

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

  const handleAdd = (data: Omit<PortfolioEntry, 'id' | 'reactions' | 'reviews'>) => {
    addPortfolioItem(data);
    setIsAddPortfolioOpen(false);
  };

  const totalReactions = portfolio.reduce(
    (acc, item) =>
      acc +
      item.reactions.heart +
      item.reactions.like +
      item.reactions.clap +
      item.reactions.dislike,
    0,
  );

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
                  <span className="font-semibold text-foreground">{expertoPerfil.calificacion}</span>
                  <span>({expertoPerfil.reviewCount} reseñas)</span>
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
        {[
          { label: 'Trabajos', value: portfolio.length, icon: <Briefcase className="w-5 h-5 text-primary" /> },
          { label: 'Reacciones', value: totalReactions, icon: <span className="text-lg">❤️</span> },
          { label: 'Reseñas', value: portfolio.reduce((a, p) => a + p.reviews.length, 0), icon: <Star className="w-5 h-5 text-yellow-400" /> },
          { label: 'Calificación', value: expertoPerfil.calificacion, icon: <BadgeCheck className="w-5 h-5 text-green-600" /> },
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
