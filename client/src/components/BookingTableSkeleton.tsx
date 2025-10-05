import { Skeleton } from "./ui/skeleton"

function BookingTableSkeleton() {
  return (
    <div className="space-y-2 mt-10">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="flex items-center w-190 space-x-4 p-2 border rounded-md">
          <Skeleton className="h-6 w-[250px]" />   {/* Car */}
          <Skeleton className="h-6 w-[140px]" />   {/* Date Range */}
          <Skeleton className="h-6 w-[100px]" />    {/* Total */}
          <Skeleton className="h-6 w-[120px]" />   {/* Payment */}
          <Skeleton className="h-6 w-[80px]" />    {/* Actions */}
        </div>
      ))}
    </div>
  )
}

export default BookingTableSkeleton