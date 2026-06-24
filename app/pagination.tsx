'use client'

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    isLoading?: boolean;
}

export default function Pagination({ currentPage, totalPages, onPageChange, isLoading = false }: PaginationProps) {
    const getPageNumbers = () => {
        const pages = [];
        const maxVisible = 5;

        if (totalPages <= maxVisible) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            if (currentPage <= 3) {
                for (let i = 1; i <= maxVisible; i++) {
                    pages.push(i);
                }
                pages.push('...');
                pages.push(totalPages);
            } else if (currentPage >= totalPages - 2) {
                pages.push(1);
                pages.push('...');
                for (let i = totalPages - maxVisible + 1; i <= totalPages; i++) {
                    pages.push(i);
                }
            } else {
                pages.push(1);
                pages.push('...');
                for (let i = currentPage - 1; i <= currentPage + 1; i++) {
                    pages.push(i);
                }
                pages.push('...');
                pages.push(totalPages);
            }
        }

        return pages;
    };

    const handlePrevious = () => {
        if (currentPage > 1 && !isLoading) {
            onPageChange(currentPage - 1);
        }
    };

    const handleNext = () => {
        if (currentPage < totalPages && !isLoading) {
            onPageChange(currentPage + 1);
        }
    };

    return (
        <div className="pagination_container" style={{ opacity: isLoading ? 0.6 : 1 }}>
            <button
                onClick={handlePrevious}
                disabled={currentPage === 1 || isLoading}
                className="pagination_button pagination_prev"
            >
                Anterior
            </button>

            <div className="pagination_pages">
                {getPageNumbers().map((page, index) => (
                    page === '...' ? (
                        <span key={`dots_${index}`} className="pagination_dots">...</span>
                    ) : (
                        <button
                            key={page}
                            onClick={() => !isLoading && onPageChange(page as number)}
                            disabled={isLoading}
                            className={`pagination_page_button ${currentPage === page ? 'pagination_active' : ''}`}
                        >
                            {page}
                        </button>
                    )
                ))}
            </div>

            <button
                onClick={handleNext}
                disabled={currentPage === totalPages || isLoading}
                className="pagination_button pagination_next"
            >
                Siguiente
            </button>
        </div>
    );
}