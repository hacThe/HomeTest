"use client"

import { Button } from "@/components/ui/button"
import { useRouter, useSearchParams } from "next/navigation"

const categories = ["Upper Body", "Lower Body", "Hat", "Shoes", "Accessory", "Legendary", "Mythic", "Epic", "Rare"]

export function CategoryFilter() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const selectedCategory = searchParams.get("category")

  const updateCategory = (category: string) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('_page', '1')
    
    if (category === selectedCategory) {
      params.delete("category")
    } else {
      params.set("category", category)
    }
    router.push(`/products?${params.toString()}`)
  }

  return (
    <div className="flex flex-wrap gap-2">
      {categories.map((category) => (
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