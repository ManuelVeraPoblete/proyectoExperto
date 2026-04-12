import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { Trash2, Star, ChevronDown, ChevronUp, MessageSquare, Send } from 'lucide-react';
import { PortfolioEntry, PortfolioReactions } from '@/types/experto';

type ReactionKey = keyof PortfolioReactions;

interface ReactionConfig {
  key: ReactionKey;
  emoji: string;
  label: string;
}

const REACTIONS: ReactionConfig[] = [
  { key: 'heart',   emoji: '❤️',  label: 'Me encanta'  },
  { key: 'like',    emoji: '👍',  label: 'Me gusta'    },
  { key: 'clap',    emoji: '👏',  label: 'Aplausos'    },
  { key: 'dislike', emoji: '👎',  label: 'No me gusta' },
];

interface PortfolioItemCardProps {
  item: PortfolioEntry;
  myReaction: ReactionKey | null;
  onToggleReaction: (itemId: string, reaction: ReactionKey) => void;
  onDelete?: (itemId: string) => void;
  /** Si se provee, se muestra formulario para agregar comentario (solo para no-dueños) */
  onAddReview?: (itemId: string, comment: string, rating: number) => void;
  isOwner?: boolean;
  /** ID del usuario actual — se usa para ocultar el formulario si ya comentó */
  currentUserId?: string | null;
}

const StarRating: React.FC<{ value: number; onChange: (v: number) => void }> = ({
  value,
  onChange,
}) => (
  <div className="flex gap-0.5">
    {[1, 2, 3, 4, 5].map((star) => (
      <button
        key={star}
        type="button"
        onClick={() => onChange(star)}
        className="focus:outline-none"
        title={`${star} estrellas`}
      >
        <Star
          className={`w-5 h-5 transition-colors ${
            star <= value ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300 hover:text-yellow-300'
          }`}
        />
      </button>
    ))}
  </div>
);

const PortfolioItemCard: React.FC<PortfolioItemCardProps> = ({
  item,
  myReaction,
  onToggleReaction,
  onDelete,
  onAddReview,
  isOwner = false,
  currentUserId,
}) => {
  const [showReviews, setShowReviews] = useState(false);
  const [showCommentForm, setShowCommentForm] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [commentRating, setCommentRating] = useState(5);

  const alreadyCommented =
    !!currentUserId && item.reviews.some((r) => r.userId === currentUserId);

  const handleSubmitComment = () => {
    if (!commentText.trim() || !onAddReview) return;
    onAddReview(item.id, commentText.trim(), commentRating);
    setCommentText('');
    setCommentRating(5);
    setShowCommentForm(false);
    setShowReviews(true);
  };

  return (
    <Card className="overflow-hidden">
      {item.image && (
        <div className="relative h-48 overflow-hidden">
          <img
            src={item.image}
            alt={item.title}
            className="w-full h-full object-cover"
          />
          <Badge className="absolute top-3 left-3 bg-primary/90 text-white">
            {item.category}
          </Badge>
          {isOwner && onDelete && (
            <button
              onClick={() => onDelete(item.id)}
              className="absolute top-3 right-3 bg-red-500/80 hover:bg-red-600 text-white rounded-full p-1.5 transition-colors"
              title="Eliminar trabajo"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      )}

      <CardContent className="p-4">
        {/* Cabecera */}
        <div className="flex items-start justify-between mb-1">
          <h3 className="font-semibold text-foreground leading-tight">{item.title}</h3>
          {!item.image && isOwner && onDelete && (
            <button
              onClick={() => onDelete(item.id)}
              className="text-muted-foreground hover:text-red-500 transition-colors p-1"
              title="Eliminar trabajo"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
        <p className="text-xs text-muted-foreground mb-2">{item.date}</p>
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{item.description}</p>

        {/* Reacciones */}
        <div className="flex flex-wrap gap-2 mb-3">
          {REACTIONS.map(({ key, emoji, label }) => {
            const count = item.reactions[key];
            const isActive = myReaction === key;
            return (
              <button
                key={key}
                onClick={() => onToggleReaction(item.id, key)}
                title={label}
                className={`
                  flex items-center gap-1 px-2.5 py-1 rounded-full text-sm border transition-all
                  ${isActive
                    ? 'bg-primary/10 border-primary/50 font-semibold'
                    : 'bg-muted/40 border-border hover:bg-muted'
                  }
                `}
              >
                <span>{emoji}</span>
                <span className="text-xs tabular-nums">{count}</span>
              </button>
            );
          })}
        </div>

        <Separator className="mb-3" />

        {/* Botones reseñas / comentar */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => setShowReviews((v) => !v)}
            className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <MessageSquare className="w-4 h-4" />
            <span>
              {item.reviews.length} reseña{item.reviews.length !== 1 ? 's' : ''}
            </span>
            {showReviews ? (
              <ChevronUp className="w-3.5 h-3.5 ml-1" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5 ml-1" />
            )}
          </button>

          {/* Botón comentar — solo visible para no-dueños que no hayan comentado */}
          {!isOwner && onAddReview && !alreadyCommented && (
            <button
              onClick={() => setShowCommentForm((v) => !v)}
              className="flex items-center gap-1 text-sm text-primary hover:text-primary/80 transition-colors"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Comentar</span>
            </button>
          )}
          {!isOwner && alreadyCommented && (
            <span className="text-xs text-muted-foreground italic">Ya comentaste</span>
          )}
        </div>

        {/* Formulario de comentario */}
        {showCommentForm && !isOwner && onAddReview && (
          <div className="mt-3 p-3 bg-muted/30 rounded-lg border border-border space-y-3">
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-1">Tu calificación</p>
              <StarRating value={commentRating} onChange={setCommentRating} />
            </div>
            <Textarea
              placeholder="Escribe tu comentario..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              rows={3}
              className="text-sm resize-none"
            />
            <div className="flex gap-2 justify-end">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setShowCommentForm(false);
                  setCommentText('');
                  setCommentRating(5);
                }}
              >
                Cancelar
              </Button>
              <Button
                size="sm"
                onClick={handleSubmitComment}
                disabled={!commentText.trim()}
              >
                Publicar
              </Button>
            </div>
          </div>
        )}

        {/* Lista de reseñas */}
        {showReviews && item.reviews.length > 0 && (
          <div className="mt-3 space-y-3">
            {item.reviews.map((review) => (
              <div key={review.id} className="bg-muted/40 rounded-lg p-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium">{review.user}</span>
                  <div className="flex items-center gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3 h-3 ${
                          i < review.rating
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-xs text-muted-foreground italic">"{review.comment}"</p>
                <p className="text-xs text-muted-foreground mt-1">{review.date}</p>
              </div>
            ))}
          </div>
        )}

        {showReviews && item.reviews.length === 0 && (
          <p className="mt-3 text-xs text-muted-foreground text-center">
            Aún no hay reseñas. ¡Sé el primero en comentar!
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default PortfolioItemCard;
