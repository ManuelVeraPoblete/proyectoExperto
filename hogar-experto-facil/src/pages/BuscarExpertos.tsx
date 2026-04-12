import React from 'react';
import { useBuscarExpertos } from '@/hooks/useBuscarExpertos';
import ExpertosFilters from '@/components/buscar-expertos/ExpertosFilters';
import ExpertosGrid from '@/components/buscar-expertos/ExpertosGrid';
import ExpertosPagination from '@/components/buscar-expertos/ExpertosPagination';
import { ChatDialog } from '@/components/ChatDialog';

/**
 * Página de búsqueda de expertos.
 * Coordinador puro: delega toda la lógica a useBuscarExpertos
 * y la UI a subcomponentes especializados.
 */
const BuscarExpertos: React.FC = () => {
  const state = useBuscarExpertos();

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8">

        <header className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Buscar Expertos</h1>
          <p className="text-muted-foreground">Encuentra el profesional perfecto para tu proyecto</p>
        </header>

        <ExpertosFilters
          searchTerm={state.searchTerm}
          selectedCategory={state.selectedCategory}
          selectedRating={state.selectedRating}
          categories={state.categories}
          onSearchTermChange={state.setSearchTerm}
          onCategoryChange={state.setSelectedCategory}
          onRatingChange={state.setSelectedRating}
          onSearch={state.handleSearch}
        />

        <ExpertosGrid
          expertos={state.paginatedExpertos}
          isLoading={state.isLoading}
          total={state.expertos.length}
          onContactExperto={state.handleContactExperto}
          onClearFilters={state.clearFilters}
        />

        <ExpertosPagination
          currentPage={state.currentPage}
          totalPages={state.totalPages}
          onPageChange={state.handlePageChange}
        />

        <ChatDialog
          isOpen={state.isChatOpen}
          onClose={state.handleCloseChat}
          participantName={state.chatParticipantName}
          messages={state.chatMessages}
          onSendMessage={state.handleSendMessage}
        />


      </main>
    </div>
  );
};

export default BuscarExpertos;
