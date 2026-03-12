export default function ProductSkeleton() {
  return (
    <div className="bg-white p-3 animate-pulse" style={{ border: '1px solid #f0f0f0' }}>
      <div className="h-44 bg-gray-100 rounded mb-3"></div>
      <div className="h-3.5 bg-gray-100 rounded mb-2"></div>
      <div className="h-3 bg-gray-100 rounded w-3/4 mb-2"></div>
      <div className="h-4 bg-gray-100 rounded w-1/2"></div>
    </div>
  );
}
