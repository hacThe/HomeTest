import { Card, CardContent } from "@/components/ui/card"
import { Mail, User, Circle } from "lucide-react"
import { IProduct } from "@/types/product"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { FavoriteButton } from "./FavoriteButton"
import { STATUS_COLORS } from "@/constants"

interface ProductCardProps {
  product: IProduct
}

const getStatusColor = (status: string) => {
  return STATUS_COLORS[status.toLowerCase() as keyof typeof STATUS_COLORS] || STATUS_COLORS.offline
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <Card className="relative overflow-hidden rounded-none shadow-none">
      <div className="w-full h-32 bg-muted">
        <img
          src={`/images/mario-${product.imageId}.avif`}
          alt={product.title}
          className={`object-cover w-full h-full grayscale-[1] transition-all duration-300 hover:grayscale-0 cursor-pointer`}
        />
      </div>
      <CardContent className="pt-4 space-y-1 text-sm p-4">
        <div className="hover:underline cursor-pointer font-bold">{product.title}</div>
        <div className="flex flex-col gap-1">
          <span className="font-medium px-2.5 py-1 text-xs rounded-full bg-gray-100 text-gray-700">
            Category: {product.category}
          </span>
          <span className="font-medium px-2.5 py-1 text-xs rounded-full bg-primary/10 text-primary">
            Theme: {product.theme}
          </span>
          <span className="font-medium px-2.5 py-1 text-xs rounded-full bg-black/5 text-gray-900">
            Tier: {product.tier}
          </span>
        </div>
        <div className="text-sm font-semibold">{product.price} ETH</div>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center gap-2 text-xs text-muted-foreground cursor-help hover:text-foreground transition-colors">
                <img
                  src={product.author.avatar}
                  alt={`${product.author.firstName} ${product.author.lastName}`}
                  className="w-4 h-4 rounded-full ring-1 ring-border"
                />
                <span>{`${product.author.firstName} ${product.author.lastName}`}</span>
              </div>
            </TooltipTrigger>
            <TooltipContent className="w-64 p-0 bg-white border shadow-lg">
              <div className="p-3 border-b bg-gray-50/50">
                <div className="flex items-center gap-3">
                  <img
                    src={product.author.avatar}
                    alt={`${product.author.firstName} ${product.author.lastName}`}
                    className="w-10 h-10 rounded-full ring-2 ring-primary/20"
                  />
                  <div>
                    <p className="font-medium text-gray-900">{`${product.author.firstName} ${product.author.lastName}`}</p>
                    <div className="flex items-center gap-1.5 text-xs">
                      <Circle size={8} className={`fill-current ${getStatusColor(product.author.onlineStatus)}`} />
                      <span className="text-gray-600 capitalize">{product.author.onlineStatus}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-3 space-y-2 bg-white">
                <div className="flex items-center gap-2 text-xs">
                  <Mail size={14} className="text-gray-400" />
                  <span className="text-gray-600">{product.author.email}</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <User size={14} className="text-gray-400" />
                  <span className="text-gray-600 capitalize">{product.author.gender}</span>
                </div>
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <div className="absolute bottom-2 right-2">
          <FavoriteButton productId={product.id} initialIsFavorite={product.isFavorite} />
        </div>
      </CardContent>
    </Card>
  )
} 