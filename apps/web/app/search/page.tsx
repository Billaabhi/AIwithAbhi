import { Suspense } from "react"
import { Loader2 } from "lucide-react"
import { SearchClient } from "./SearchClient"

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center py-20">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </div>
      }
    >
      <SearchClient />
    </Suspense>
  )
}
