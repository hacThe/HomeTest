'use client'

import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { useRef, useEffect } from "react"

interface ViewMoreButtonProps {
  currentPage: number
}

export function ViewMoreButton({ currentPage }: ViewMoreButtonProps) {
  const router = useRouter()
  const lastScrollPosition = useRef(0)

  useEffect(() => {
    // Store the current scroll position before the update
    lastScrollPosition.current = window.scrollY
  }, [currentPage])

  const handleViewMore = () => {
    const nextPage = currentPage + 1
    const searchParams = new URLSearchParams(window.location.search)
    searchParams.set('_page', nextPage.toString())
    
    // Store current scroll position before navigation
    lastScrollPosition.current = window.scrollY
    
    router.replace(`/products?${searchParams.toString()}`, { scroll: false })
  }

  // Restore scroll position after the component updates
  useEffect(() => {
    window.scrollTo(0, lastScrollPosition.current)
  })

  return (
    <div className="flex justify-center">
      <Button onClick={handleViewMore}>View More</Button>
    </div>
  )
} 