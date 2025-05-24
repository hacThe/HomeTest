"use client"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useRouter, useSearchParams } from "next/navigation"
import { useState, useEffect } from "react"
import { useDebounce } from "@/hooks/useDebounce"
import { PRODUCT_THEMES, PRODUCT_TIERS, QUERY_PARAMS, SORT_OPTIONS } from "@/constants"

export function ProductFilters() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [searchValue, setSearchValue] = useState(searchParams.get(QUERY_PARAMS.SEARCH) || "")
    const debouncedSearchValue = useDebounce(searchValue, 500)

    const updateFilters = (key: string, value: string) => {
        const params = new URLSearchParams(searchParams.toString())
        
        // Reset page to 1 when any filter changes
        if (key !== QUERY_PARAMS.SEARCH || value) {
            params.set(QUERY_PARAMS.PAGE, '1')
        }

        if (value) {
            params.set(key, value)
        } else {
            params.delete(key)
        }

        router.push(`/products?${params.toString()}`)
    }

    // Effect to handle debounced search
    useEffect(() => {
        updateFilters(QUERY_PARAMS.SEARCH, debouncedSearchValue)
    }, [debouncedSearchValue])

    return (
        <div className="w-64 space-y-4 sticky top-[180px] z-40">
            <div className="flex flex-col gap-2 relative">
                <label className="text-sm font-semibold">Search</label>
                <Input
                    placeholder="Search"
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                />
            </div>
            <div>
                <TooltipProvider delayDuration={200}>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <div>
                                <label className="text-gray-500 text-sm font-semibold">Price Range</label>
                                <Slider
                                    defaultValue={[Number(searchParams.get(QUERY_PARAMS.PRICE)) || 0]}
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
                    ${searchParams.get(QUERY_PARAMS.PRICE) || 0}
                </div>
            </div>
            <div>
                <label className="text-sm font-semibold">Tier</label>
                <Select
                    value={searchParams.get(QUERY_PARAMS.TIER) || ""}
                    onValueChange={(value) => updateFilters(QUERY_PARAMS.TIER, value)}
                >
                    <SelectTrigger><SelectValue placeholder="Select tier" /></SelectTrigger>
                    <SelectContent>
                        {PRODUCT_TIERS.map((tier) => (
                            <SelectItem key={tier} value={tier}>{tier}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
            <div>
                <label className="text-sm font-semibold">Theme</label>
                <Select
                    value={searchParams.get(QUERY_PARAMS.THEME) || ""}
                    onValueChange={(value) => updateFilters(QUERY_PARAMS.THEME, value)}
                >
                    <SelectTrigger><SelectValue placeholder="Select theme" /></SelectTrigger>
                    <SelectContent>
                        {PRODUCT_THEMES.map((theme) => (
                            <SelectItem key={theme} value={theme}>{theme}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
            <div>
                <label className="text-sm font-semibold">Price</label>
                <Select
                    value={searchParams.get(QUERY_PARAMS.ORDER) || ""}
                    onValueChange={(value) => {
                        if (value) {
                            updateFilters(QUERY_PARAMS.SORT, 'price')
                            updateFilters(QUERY_PARAMS.ORDER, value)
                        } else {
                            updateFilters(QUERY_PARAMS.SORT, '')
                            updateFilters(QUERY_PARAMS.ORDER, '')
                        }
                    }}
                >
                    <SelectTrigger><SelectValue placeholder="Select price" /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value={SORT_OPTIONS.PRICE_ASC}>Low to High</SelectItem>
                        <SelectItem value={SORT_OPTIONS.PRICE_DESC}>High to Low</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                    router.push("/products")
                }}
            >
                Reset Filter
            </Button>
        </div>
    )
} 