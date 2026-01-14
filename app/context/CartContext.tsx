'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import { Award } from '@/app/types';

interface CartItem extends Award {
  quantity: number;
}

interface CustomerData {
  fullName: string;
  email: string;
  phone: string;
  cedula: string;
  cedulaType: 'CC' | 'PA' | 'CE';
  city: string;
  address: string;
}

interface CartContextType {
  items: CartItem[];
  customer: Partial<CustomerData>;
  addItem: (award: Award) => void;
  removeItem: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  clearCart: () => void;
  setCustomer: (data: Partial<CustomerData>) => void;
  totalItems: number;
  totalAmount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [customer, setCustomer] = useState<Partial<CustomerData>>({});

  const addItem = (award: Award) => {
    setItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === award.id);
      if (existingItem) {
        return prevItems.map((item) =>
          item.id === award.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevItems, { ...award, quantity: 1 }];
    });
  };

  const removeItem = (id: number) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  const updateQuantity = (id: number, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id);
      return;
    }
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        customer,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        setCustomer,
        totalItems,
        totalAmount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
}
