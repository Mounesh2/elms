"use client"

import React, { createContext, useContext, useEffect, useState } from "react"
import { toast } from "react-hot-toast"

interface CartItem {
  id: string
  title: string
  thumbnailUrl: string
  price: string
  instructorName: string
}

interface CartContextType {
  items: CartItem[]
  addItem: (item: CartItem) => void
  removeItem: (id: string) => void
  clearCart: () => void
  totalPrice: number
  isInCart: (id: string) => boolean
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([])

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem("learnhub_cart")
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart))
      } catch (e) {
        console.error("Failed to load cart", e)
      }
    }
  }, [])

  // Save cart to localStorage on change
  useEffect(() => {
    localStorage.setItem("learnhub_cart", JSON.stringify(items))
  }, [items])

  const addItem = (item: CartItem) => {
    if (items.some((i) => i.id === item.id)) {
      toast.error("Course already in cart")
      return
    }
    setItems((prev) => [...prev, item])
    toast.success("Added to cart")
  }

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id))
    toast.success("Removed from cart")
  }

  const clearCart = () => {
    setItems([])
    localStorage.removeItem("learnhub_cart")
  }

  const totalPrice = items.reduce((acc, item) => acc + parseFloat(item.price), 0)

  const isInCart = (id: string) => items.some((i) => i.id === id)

  return (
    <CartContext.Provider
      value={{ items, addItem, removeItem, clearCart, totalPrice, isInCart }}
    >
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
