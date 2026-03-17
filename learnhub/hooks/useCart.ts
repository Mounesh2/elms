'use client'
import { useState, useEffect, useCallback } from 'react'
import type { CartItem, Course, Coupon } from '@/types'

const CART_KEY = 'learnhub_cart'

function loadCart(): CartItem[] {
  if (typeof window === 'undefined') return []
  try { return JSON.parse(localStorage.getItem(CART_KEY) ?? '[]') } catch { return [] }
}

function saveCart(items: CartItem[]) {
  if (typeof window === 'undefined') return
  localStorage.setItem(CART_KEY, JSON.stringify(items))
}

export function useCart() {
  const [items, setItems] = useState<CartItem[]>([])
  const [coupon, setCoupon] = useState<Coupon | null>(null)
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    setItems(loadCart())
    setHydrated(true)
  }, [])

  const addItem = useCallback((course: Course) => {
    setItems((prev) => {
      if (prev.some((i) => i.course_id === course.id)) return prev
      const next = [...prev, { course_id: course.id, course, added_at: new Date().toISOString() }]
      saveCart(next)
      return next
    })
  }, [])

  const removeItem = useCallback((courseId: string) => {
    setItems((prev) => {
      const next = prev.filter((i) => i.course_id !== courseId)
      saveCart(next)
      return next
    })
  }, [])

  const clearCart = useCallback(() => {
    setItems([])
    setCoupon(null)
    saveCart([])
  }, [])

  const isInCart = useCallback((courseId: string) => {
    return items.some((i) => i.course_id === courseId)
  }, [items])

  const applyCoupon = useCallback((c: Coupon) => setCoupon(c), [])
  const removeCoupon = useCallback(() => setCoupon(null), [])

  const subtotal = items.reduce((sum, i) => sum + i.course.price, 0)

  let discount = 0
  if (coupon) {
    discount = coupon.discount_type === 'percent'
      ? subtotal * (coupon.discount_value / 100)
      : Math.min(coupon.discount_value, subtotal)
  }

  const total = Math.max(0, subtotal - discount)

  return {
    items,
    coupon,
    subtotal,
    discount,
    total,
    itemCount: items.length,
    hydrated,
    addItem,
    removeItem,
    clearCart,
    isInCart,
    applyCoupon,
    removeCoupon,
  }
}
