import React, { Component, ErrorInfo, ReactNode } from 'react';
import { logger } from '@/lib/logger';
import { Button } from '@/components/ui/button';

// ─── Tipos ────────────────────────────────────────────────────────────────────
interface Props {
  children: ReactNode;
  /** Componente de reemplazo personalizado. Si se omite usa el fallback por defecto. */
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

// ─── Fallback por defecto ─────────────────────────────────────────────────────
interface DefaultFallbackProps {
  error: Error | null;
  onReset: () => void;
}

const DefaultFallback: React.FC<DefaultFallbackProps> = ({ error, onReset }) => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <div className="text-center space-y-4 p-8 max-w-md">
      <h2 className="text-2xl font-bold text-foreground">Algo salió mal</h2>
      <p className="text-muted-foreground">
        Ocurrió un error inesperado. Por favor intenta de nuevo.
      </p>
      {error && (
        <pre className="text-xs text-left bg-muted p-4 rounded overflow-auto max-h-32">
          {error.message}
        </pre>
      )}
      <Button onClick={onReset}>Intentar de nuevo</Button>
    </div>
  </div>
);

// ─── ErrorBoundary ────────────────────────────────────────────────────────────

/**
 * Captura errores no manejados en el árbol de componentes hijos.
 * Registra el error con el logger y muestra un fallback amigable.
 *
 * @example
 * <ErrorBoundary>
 *   <App />
 * </ErrorBoundary>
 */
export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    logger.error('[ErrorBoundary]', error.message, info.componentStack);
  }

  private handleReset = (): void => {
    this.setState({ hasError: false, error: null });
  };

  render(): ReactNode {
    if (!this.state.hasError) return this.props.children;

    if (this.props.fallback) return this.props.fallback;

    return (
      <DefaultFallback
        error={this.state.error}
        onReset={this.handleReset}
      />
    );
  }
}
