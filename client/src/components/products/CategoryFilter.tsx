"use client"

import { Button } from "@/components/ui/button"
import { useRouter, useSearchParams } from "next/navigation"
import { PRODUCT_CATEGORIES, QUERY_PARAMS } from "@/constants"

export function CategoryFilter() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const selectedCategory = searchParams.get(QUERY_PARAMS.CATEGORY)

  const updateCategory = (category: string) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set(QUERY_PARAMS.PAGE, '1')
    
    if (category === selectedCategory) {
      params.delete(QUERY_PARAMS.CATEGORY)
    } else {
      params.set(QUERY_PARAMS.CATEGORY, category)
    }
    router.push(`/products?${params.toString()}`)
  }

  return (
    <div className="flex flex-wrap gap-2">
      {PRODUCT_CATEGORIES.map((category) => (
        <Button 
          key={category} 
          variant={selectedCategory === category ? "default" : "outline"} 
          size="sm"
          onClick={() => updateCategory(category)}
        >
          {category}
        </Button>
      ))}
    </div>
  )
} 