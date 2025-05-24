"use client"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useRouter, useSearchParams } from "next/navigation"
import { useState, useEffect } from "react"
import { useDebounce } from "@/hooks/useDebounce"

const themes = ["Dark", "Light", "Colorful", "Halloween"]
const tiers = ["Basic", "Premium", "Deluxe"]

export function ProductFilters() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [searchValue, setSearchValue] = useState(searchParams.get("q") || "")
    const debouncedSearchValue = useDebounce(searchValue, 500)

    const updateFilters = (key: string, value: string) => {
        const params = new URLSearchParams(searchParams.toString())
        // Reset page to 1 when any filter changes
        if (key !== "search" || value) {
            params.set('_page', '1')
        }
        if (value) {
            // Map frontend parameters to backend API parameters
            switch (key) {
                case "search":
                    params.set("q", value)
                    break
                case "price":
                    params.set("price_lte", value)
                    break
                case "tier":
                    params.set("tier", value)
                    break
                case "theme":
                    params.set("theme", value)
                    break
                case "sort":
                    params.set("_sort", "price")
                    params.set("_order", value)
                    break
                default:
                    params.set(key, value)
            }
        } else {
            // Remove the corresponding backend parameters
            switch (key) {
                case "search":
                    params.delete("q")
                    break
                case "price":
                    params.delete("price_lte")
                    break
                case "tier":
                    params.delete("tier")
                    break
                case "theme":
                    params.delete("theme")
                    break
                case "sort":
                    params.delete("_sort")
                    params.delete("_order")
                    break
                default:
                    params.delete(key)
            }
        }
        router.push(`/products?${params.toString()}`)
    }

    // Effect to handle debounced search
    useEffect(() => {
        updateFilters("search", debouncedSearchValue)
    }, [debouncedSearchValue])

    return (
        <div className="w-64 space-y-4 sticky top-[180px] z-40">
            <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold">Search</label>
                <Input
                    placeholder="Search"
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                />
            </div>
            {/* Price Range is under construction, waiting for backend to be ready */}
            <div>
                <TooltipProvider delayDuration={200}>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <div>
                                <label className="text-gray-500 text-sm font-semibold">Price Range</label>
                                <Slider
                                    defaultValue={[Number(searchParams.get("price")) || 0]}
                                    max={100}
                                    step={1}
                                    disabled
                                    className="opacity-50"
                                />
                            </div>
                        </TooltipTrigger>
                        <TooltipContent side="bottom">
                            <p>Price range filter is under construction</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
                <div className="text-sm text-muted-foreground mt-1">
                    ${searchParams.get("price") || 0}
                </div>
            </div>
            <div>
                <label className="text-sm font-semibold">Tier</label>
                <Select
                    value={searchParams.get("tier") || ""}
                    onValueChange={(value) => updateFilters("tier", value)}
                >
                    <SelectTrigger><SelectValue placeholder="Select tier" /></SelectTrigger>
                    <SelectContent>
                        {tiers.map((tier) => (
                            <SelectItem key={tier} value={tier}>{tier}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
            <div>
                <label className="text-sm font-semibold">Theme</label>
                <Select
                    value={searchParams.get("theme") || ""}
                    onValueChange={(value) => updateFilters("theme", value)}
                >
                    <SelectTrigger><SelectValue placeholder="Select theme" /></SelectTrigger>
                    <SelectContent>
                        {themes.map((theme) => (
                            <SelectItem key={theme} value={theme}>{theme}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
            <div>
                <label className="text-sm font-semibold">Price</label>
                <Select
                    value={searchParams.get("sort") || ""}
                    onValueChange={(value) => updateFilters("sort", value)}
                >
                    <SelectTrigger><SelectValue placeholder="Select price" /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="asc">Low to High</SelectItem>
                        <SelectItem value="desc">High to Low</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                    router.push("/products")
                    // Clear all filter parameters
                    const params = new URLSearchParams()
                    router.push(`/products?${params.toString()}`)
                }}
            >
                Reset Filter
            </Button>
        </div>
    )
} 