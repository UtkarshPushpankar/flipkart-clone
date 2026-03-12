export default function ProductSkeleton() {
  return (
    <div className="fk-card min-w-[180px] animate-pulse overflow-hidden rounded-sm bg-white">
      <div className="h-[210px] bg-[#f3f3f3]" />
      <div className="space-y-2 p-3">
        <div className="h-3 w-full rounded bg-[#ececec]" />
        <div className="h-3 w-3/4 rounded bg-[#ececec]" />
        <div className="h-4 w-1/2 rounded bg-[#ececec]" />
      </div>
    </div>
  );
}
