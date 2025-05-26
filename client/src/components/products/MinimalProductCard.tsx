'use client'

import { Card } from "@/components/ui/card"
import { IProduct } from "@/types/product"
import { useRouter } from "next/navigation"

interface MinimalProductCardProps {
  product: IProduct
}

export function MinimalProductCard({ product }: MinimalProductCardProps) {
  const router = useRouter()

  const handleClick = () => {
    router.push(`/products/${product.id}`)
  }

  return (
    <Card 
      className="relative overflow-hidden rounded-none shadow-none hover:shadow-md transition-shadow focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 cursor-pointer"
      tabIndex={0}
      role="button"
      aria-label={`New arrival: ${product.title}, Price: ${product.price} ETH`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          // Handle product selection/navigation here
          console.log('New arrival selected:', product.title)
        }
      }}
    >
      <div className="flex gap-3 p-2">
        <div className="w-16 h-16 shrink-0 bg-muted">
          <img
            src={`/images/mario-${product.imageId}.avif`}
            alt={product.title}
            className="object-cover w-full h-full grayscale-[1] transition-all duration-300 hover:grayscale-0 cursor-pointer"
          />
        </div>
        <div className="flex flex-col justify-center min-w-0">
          <div className="hover:underline cursor-pointer font-medium text-sm truncate">{product.title}</div>
          <div className="text-sm font-semibold text-primary">{product.price} ETH</div>
        </div>
      </div>
    </Card>
  )
} 