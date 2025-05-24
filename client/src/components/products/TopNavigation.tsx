'use client'

import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"

interface TopNavigationProps {
  currentPage: number
  totalPages: number
}

export function TopNavigation({ currentPage, totalPages }: TopNavigationProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  return (
    <div className="flex justify-between items-center mb-8">
      <Button
        variant="outline"
        onClick={() => {
          const params = new URLSearchParams(searchParams.toString())
          params.set('_page', (currentPage - 1).toString())
          router.push(`/products?${params.toString()}`)
        }}
        disabled={currentPage === 1}
        className="hover:bg-primary hover:text-primary-foreground"
      >
        <ChevronLeft className="h-4 w-4 mr-2" />
        Previous
      </Button>
      <div className="text-sm text-gray-600">
        Page {currentPage} of {totalPages}
      </div>
      <Button
        variant="outline"
        onClick={() => {
          const params = new URLSearchParams(searchParams.toString())
          params.set('_page', (currentPage + 1).toString())
          router.push(`/products?${params.toString()}`)
        }}
        disabled={currentPage === totalPages}
        className="hover:bg-primary hover:text-primary-foreground"
      >
        Next
        <ChevronRight className="h-4 w-4 ml-2" />
      </Button>
    </div>
  )
} 