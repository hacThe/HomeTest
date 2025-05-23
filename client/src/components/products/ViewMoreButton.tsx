'use client'

import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

interface ViewMoreButtonProps {
  currentPage: number
}

export function ViewMoreButton({ currentPage }: ViewMoreButtonProps) {
  const router = useRouter()

  const handleViewMore = () => {
    const nextPage = currentPage + 1
    const searchParams = new URLSearchParams(window.location.search)
    searchParams.set('_page', nextPage.toString())
    router.replace(`/products?${searchParams.toString()}`, { scroll: false })
  }

  return (
    <div className="flex justify-center">
      <Button onClick={handleViewMore}>View More</Button>
    </div>
  )
} 