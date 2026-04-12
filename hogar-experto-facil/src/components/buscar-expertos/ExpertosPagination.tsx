import React from 'react';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';

// ─── Tipos ────────────────────────────────────────────────────────────────────
interface ExpertosPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
const shouldShowPage = (page: number, currentPage: number, totalPages: number): boolean =>
  totalPages <= 5 ||
  page === 1 ||
  page === totalPages ||
  (page >= currentPage - 1 && page <= currentPage + 1);

const isEllipsisPosition = (page: number, currentPage: number, totalPages: number): boolean =>
  (page === currentPage - 2 && page > 1) ||
  (page === currentPage + 2 && page < totalPages);

// ─── Componente ───────────────────────────────────────────────────────────────
const ExpertosPagination: React.FC<ExpertosPaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="mt-8 flex justify-center">
      <Pagination>
        <PaginationContent>

          {/* Anterior */}
          <PaginationItem>
            <PaginationPrevious
              href="#"
              onClick={e => {
                e.preventDefault();
                if (currentPage > 1) onPageChange(currentPage - 1);
              }}
              className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
            />
          </PaginationItem>

          {/* Páginas */}
          {pages.map(page => {
            if (shouldShowPage(page, currentPage, totalPages)) {
              return (
                <PaginationItem key={page}>
                  <PaginationLink
                    href="#"
                    isActive={currentPage === page}
                    onClick={e => {
                      e.preventDefault();
                      onPageChange(page);
                    }}
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              );
            }
            if (isEllipsisPosition(page, currentPage, totalPages)) {
              return (
                <PaginationItem key={`ellipsis-${page}`}>
                  <PaginationEllipsis />
                </PaginationItem>
              );
            }
            return null;
          })}

          {/* Siguiente */}
          <PaginationItem>
            <PaginationNext
              href="#"
              onClick={e => {
                e.preventDefault();
                if (currentPage < totalPages) onPageChange(currentPage + 1);
              }}
              className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
            />
          </PaginationItem>

        </PaginationContent>
      </Pagination>
    </div>
  );
};

export default ExpertosPagination;
