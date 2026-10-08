import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  showInfo?: boolean;
  showQuickJump?: boolean;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
  showInfo = true,
  showQuickJump = true
}) => {
  if (totalPages <= 1) return null;

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  // Générer les numéros de pages à afficher
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      const startPage = Math.max(1, currentPage - 2);
      const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
      
      if (startPage > 1) {
        pages.push(1);
        if (startPage > 2) pages.push('...');
      }
      
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
      
      if (endPage < totalPages) {
        if (endPage < totalPages - 1) pages.push('...');
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  return (
    <div className="mt-8">
      {/* Informations de pagination */}
      {showInfo && (
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <div className="text-sm text-gray-700">
            Affichage de {startIndex + 1} à {endIndex} sur {totalItems} résultats
          </div>
          <div className="text-sm text-gray-500">
            Page {currentPage} sur {totalPages}
          </div>
        </div>
      )}

      {/* Contrôles de pagination */}
      <div className="flex max-w-full justify-center">
        <nav aria-label="Pagination des résultats" className="flex max-w-full flex-wrap items-center justify-center gap-1">
          {/* Bouton Précédent */}
          <button
            onClick={goToPreviousPage}
            disabled={currentPage === 1}
            aria-label="Page précédente"
            className={`flex h-10 shrink-0 items-center justify-center gap-1 rounded-md px-2 sm:px-3 text-sm font-medium transition-colors ${
              currentPage === 1
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            <ChevronLeft aria-hidden="true" className="h-4 w-4" />
            <span className="hidden sm:inline">Précédent</span>
          </button>

          {/* Numéros de pages */}
          {getPageNumbers().map((page, index) => (
            <React.Fragment key={index}>
              {page === '...' ? (
                <span aria-hidden="true" className="px-2 py-2 text-gray-500">...</span>
              ) : (
                <button
                  onClick={() => onPageChange(page as number)}
                  aria-label={`Page ${page}`}
                  aria-current={currentPage === page ? 'page' : undefined}
                  className={`inline-flex h-10 min-w-10 shrink-0 items-center justify-center rounded-md border px-2 sm:px-3 text-sm font-medium transition-colors ${
                    currentPage === page
                      ? 'border-[#174c3a] bg-[#174c3a] text-white'
                      : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {page}
                </button>
              )}
            </React.Fragment>
          ))}

          {/* Bouton Suivant */}
          <button
            onClick={goToNextPage}
            disabled={currentPage === totalPages}
            aria-label="Page suivante"
            className={`flex h-10 shrink-0 items-center justify-center gap-1 rounded-md px-2 sm:px-3 text-sm font-medium transition-colors ${
              currentPage === totalPages
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            <span className="hidden sm:inline">Suivant</span>
            <ChevronRight aria-hidden="true" className="h-4 w-4" />
          </button>
        </nav>
      </div>

      {/* Navigation rapide */}
      {showQuickJump && totalPages > 10 && (
        <div className="flex justify-center mt-4">
          <div className="flex items-center space-x-2 text-sm">
            <span className="text-gray-500">Aller à la page :</span>
            <input
              type="number"
              min="1"
              max={totalPages}
              value={currentPage}
              onChange={(e) => {
                const page = parseInt(e.target.value);
                if (page >= 1 && page <= totalPages) {
                  onPageChange(page);
                }
              }}
              className="w-16 px-2 py-1 border border-gray-300 rounded text-center focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <span className="text-gray-500">sur {totalPages}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Pagination;