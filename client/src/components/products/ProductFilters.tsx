"use client"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useRouter, useSearchParams } from "next/navigation"
import { useState, useEffect, useCallback } from "react"
import { useDebounce } from "@/hooks/useDebounce"
import { PRODUCT_THEMES, PRODUCT_TIERS, QUERY_PARAMS, SORT_OPTIONS } from "@/constants"

export function ProductFilters() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [searchValue, setSearchValue] = useState(searchParams.get(QUERY_PARAMS.SEARCH) || "")
    const debouncedSearchValue = useDebounce(searchValue, 500)

    const updateFilters = useCallback((key: string, value: string) => {
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
    }, [searchParams, router])

    // Effect to handle debounced search
    useEffect(() => {
        updateFilters(QUERY_PARAMS.SEARCH, debouncedSearchValue)
    }, [debouncedSearchValue, updateFilters])

    return (
        <div className="w-64 space-y-4 sticky top-[180px] z-[90] bg-background">
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
                <select
                    value={searchParams.get(QUERY_PARAMS.TIER) || ""}
                    onChange={(e) => updateFilters(QUERY_PARAMS.TIER, e.target.value)}
                    className="w-full h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2216%22%20height%3D%2216%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22currentColor%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpath%20d%3D%22m6%209%206%206%206-6%22%2F%3E%3C%2Fsvg%3E')] bg-[length:16px_12px] bg-[right_12px_center] bg-no-repeat pr-10"
                >
                    <option value="">Select tier</option>
                    {PRODUCT_TIERS.map((tier) => (
                        <option key={tier} value={tier}>{tier}</option>
                    ))}
                </select>
            </div>
            <div>
                <label className="text-sm font-semibold">Theme</label>
                <select
                    value={searchParams.get(QUERY_PARAMS.THEME) || ""}
                    onChange={(e) => updateFilters(QUERY_PARAMS.THEME, e.target.value)}
                    className="w-full h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2216%22%20height%3D%2216%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22currentColor%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpath%20d%3D%22m6%209%206%206%206-6%22%2F%3E%3C%2Fsvg%3E')] bg-[length:16px_12px] bg-[right_12px_center] bg-no-repeat pr-10"
                >
                    <option value="">Select theme</option>
                    {PRODUCT_THEMES.map((theme) => (
                        <option key={theme} value={theme}>{theme}</option>
                    ))}
                </select>
            </div>
            <div>
                <label className="text-sm font-semibold">Price</label>
                <select
                    value={searchParams.get(QUERY_PARAMS.ORDER) || ""}
                    onChange={(e) => {
                        if (e.target.value) {
                            updateFilters(QUERY_PARAMS.SORT, 'price')
                            updateFilters(QUERY_PARAMS.ORDER, e.target.value)
                        } else {
                            updateFilters(QUERY_PARAMS.SORT, '')
                            updateFilters(QUERY_PARAMS.ORDER, '')
                        }
                    }}
                    className="w-full h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2216%22%20height%3D%2216%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22currentColor%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpath%20d%3D%22m6%209%206%206%206-6%22%2F%3E%3C%2Fsvg%3E')] bg-[length:16px_12px] bg-[right_12px_center] bg-no-repeat pr-10"
                >
                    <option value="">Select price</option>
                    <option value={SORT_OPTIONS.PRICE_ASC}>Low to High</option>
                    <option value={SORT_OPTIONS.PRICE_DESC}>High to Low</option>
                </select>
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