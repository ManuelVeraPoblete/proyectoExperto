import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Search, Loader2 } from 'lucide-react';
import { Trabajo } from '@/types';
import { JobDetailsModal } from '@/components/experto/JobDetailsModal';
import useJobSearch from '@/hooks/useJobSearch';
import JobCard from '@/components/experto/JobCard';
import LocationSelects from '@/components/shared/LocationSelects';
import { useAuth } from '@/contexts/AuthContext';
import { useMyApplications } from '@/hooks/useMyApplications';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const ITEMS_PER_PAGE = 9;

const BuscarTrabajosExperto = () => {
  const { user } = useAuth();

  const { 
    searchTerm,
    setSearchTerm,
    selectedCategory,
    setSelectedCategory,
    selectedRegion,
    handleRegionChange,
    selectedProvincia,
    handleProvinciaChange,
    selectedComuna,
    setSelectedComuna,
    filteredJobs,
    categories,
    isLoading,
    refreshJobs
  } = useJobSearch({
    initialRegion: user?.region || '',
    initialProvincia: user?.provincia || '',
    initialComuna: user?.comuna || '',
    expertSpecialties: user?.especialidades || [],
  });

  const { appliedJobIds, getApplicationForJob } = useMyApplications();

  const [selectedJob, setSelectedJob] = useState<Trabajo | null>(null);
  const [isJobDetailsModalOpen, setIsJobDetailsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  // Resetear página al cambiar filtros
  useEffect(() => {
    setCurrentPage(1);
  }, [filteredJobs.length, searchTerm, selectedCategory, selectedComuna]);

  // Lógica de Paginación
  const totalPages = Math.ceil(filteredJobs.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedJobs = filteredJobs.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  // Efecto para sincronizar la ubicación cuando el usuario termina de cargar
  useEffect(() => {
    if (user?.userType === 'experto') {
      if (user.region && !selectedRegion) {
        handleRegionChange(user.region);
      }
      if (user.provincia && !selectedProvincia) {
        handleProvinciaChange(user.provincia);
      }
      if (user.comuna && !selectedComuna) {
        setSelectedComuna(user.comuna);
      }
    }
  }, [user?.id]); 

  const handleOpenJobDetails = (job: Trabajo) => {
    setSelectedJob(job);
    setIsJobDetailsModalOpen(true);
  };

  const handleCloseJobDetails = () => {
    setIsJobDetailsModalOpen(false);
    setSelectedJob(null);
  };

  return (
    <>
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Buscar Trabajos</h1>
          <p className="text-muted-foreground">Encuentra nuevas oportunidades de trabajo cerca de ti</p>
        </div>

        {/* Filtros */}
        <div className="bg-card rounded-lg border border-border p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">Buscar</label>
              <Input
                placeholder="Título o descripción..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">Categoría</label>
              <Select value={selectedCategory || 'all'} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Todas las categorías" />
                </SelectTrigger>
                <SelectContent className="shadow-lg">
                  <SelectItem value="all">Todas las categorías</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id.toString()}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="mt-4 p-2">
            <LocationSelects
              selectedRegion={selectedRegion}
              onRegionChange={handleRegionChange}
              selectedProvincia={selectedProvincia}
              onProvinciaChange={handleProvinciaChange}
              selectedComuna={selectedComuna}
              onComunaChange={setSelectedComuna}
              disableRegion={user?.userType === 'experto'}
              disableProvincia={user?.userType === 'experto'}
            />
          </div>
          
          <div className="mt-4 flex justify-end">
            <Button className="btn-primary" onClick={refreshJobs} disabled={isLoading}>
              {isLoading ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Search className="w-4 h-4 mr-2" />
              )}
              Buscar Trabajos
            </Button>
          </div>
        </div>

        {/* Resultados */}
        <div className="mb-6 flex justify-between items-center">
          <p className="text-muted-foreground">
            {isLoading ? 'Buscando...' : `Mostrando ${startIndex + 1}-${Math.min(startIndex + ITEMS_PER_PAGE, filteredJobs.length)} de ${filteredJobs.length} trabajos encontrados`}
          </p>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {paginatedJobs.map((job) => (
                <JobCard
                  key={job.id}
                  job={job}
                  onOpenJobDetails={handleOpenJobDetails}
                  isApplied={appliedJobIds.has(job.id)}
                />
              ))}
            </div>

            {filteredJobs.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground text-lg">No se encontraron trabajos con los criterios seleccionados</p>
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedCategory('all');
                    if (user?.userType !== 'experto') {
                      handleRegionChange('');
                    } else {
                      setSelectedComuna('all'); 
                    }
                  }}
                >
                  Limpiar Filtros
                </Button>
              </div>
            ) : (
              /* Paginación */
              totalPages > 1 && (
                <div className="mt-12 flex justify-center">
                  <Pagination>
                    <PaginationContent className="bg-card border rounded-lg shadow-sm">
                      <PaginationItem>
                        <PaginationPrevious 
                          href="#" 
                          onClick={(e) => { e.preventDefault(); if (currentPage > 1) setCurrentPage(currentPage - 1); }}
                          className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                        />
                      </PaginationItem>
                      
                      {[...Array(totalPages)].map((_, i) => (
                        <PaginationItem key={i + 1}>
                          <PaginationLink 
                            href="#" 
                            onClick={(e) => { e.preventDefault(); setCurrentPage(i + 1); }}
                            isActive={currentPage === i + 1}
                            className="cursor-pointer"
                          >
                            {i + 1}
                          </PaginationLink>
                        </PaginationItem>
                      ))}

                      {totalPages > 5 && <PaginationEllipsis />}
                      
                      <PaginationItem>
                        <PaginationNext 
                          href="#" 
                          onClick={(e) => { e.preventDefault(); if (currentPage < totalPages) setCurrentPage(currentPage + 1); }}
                          className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              )
            )}
          </>
        )}
      </main>

      <JobDetailsModal
        isOpen={isJobDetailsModalOpen}
        onClose={handleCloseJobDetails}
        trabajo={selectedJob}
        existingApplication={selectedJob ? getApplicationForJob(selectedJob.id) : null}
      />
    </>
  );
};

export default BuscarTrabajosExperto;
