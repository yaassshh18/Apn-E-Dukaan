const SkeletonCard = () => {
    return (
        <div className="glass-card overflow-hidden animate-pulse">
            <div className="w-full h-48 bg-slate-200/50"></div>
            <div className="p-4">
                <div className="h-6 bg-slate-200/50 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-slate-200/50 rounded w-1/2 mb-4"></div>
                <div className="flex justify-between items-center">
                    <div className="h-8 bg-slate-200/50 rounded w-1/3"></div>
                    <div className="h-8 bg-slate-200/50 rounded w-1/4"></div>
                </div>
            </div>
        </div>
    );
};

export default SkeletonCard;
