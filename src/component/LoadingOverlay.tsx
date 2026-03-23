export default function LoadingOverlay({ message = 'Loading...' }: { message?: string }) {
  return (
    <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm z-[100] flex items-center justify-center transition-all">
      <div className="bg-white rounded-xl p-8 flex flex-col items-center shadow-2xl animate-fade-in min-w-[200px]">
        {/* Using a neutral gray track to avoid color overlapping/clashing with the brand red */}
        <div className="w-12 h-12 border-4 border-gray-100 border-t-red-600 rounded-full animate-spin mb-4"></div>
        <p className="text-gray-800 font-medium text-lg">{message}</p>
      </div>
    </div>
  );
}
