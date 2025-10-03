import React, { createContext, useContext, useReducer, ReactNode } from 'react';

// Types
export interface CartItem {
  id: string;
  hotelId: string;
  hotelName: string;
  roomId: string;
  roomName: string;
  price: number;
  quantity: number;
  checkIn: string;
  checkOut: string;
  nights: number;
  image: string;
  maxCapacity: number;
}

interface CartState {
  items: CartItem[];
  total: number;
  itemCount: number;
}

type CartAction =
  | { type: 'ADD_ITEM'; payload: Omit<CartItem, 'id'> }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { id: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'UPDATE_DATES'; payload: { id: string; checkIn: string; checkOut: string; nights: number } };

interface CartContextType {
  state: CartState;
  addItem: (item: Omit<CartItem, 'id'>) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  updateDates: (id: string, checkIn: string, checkOut: string, nights: number) => void;
  clearCart: () => void;
  getItemById: (id: string) => CartItem | undefined;
  isInCart: (hotelId: string, roomId: string) => boolean;
}

// Reducer
const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existingItemIndex = state.items.findIndex(
        item => item.hotelId === action.payload.hotelId && item.roomId === action.payload.roomId
      );

      let newItems: CartItem[];
      
      if (existingItemIndex >= 0) {
        // Mettre à jour la quantité si l'item existe déjà
        newItems = state.items.map((item, index) =>
          index === existingItemIndex
            ? { ...item, quantity: item.quantity + action.payload.quantity }
            : item
        );
      } else {
        // Ajouter un nouvel item
        const newItem: CartItem = {
          ...action.payload,
          id: `${action.payload.hotelId}-${action.payload.roomId}-${Date.now()}`
        };
        newItems = [...state.items, newItem];
      }

      const total = newItems.reduce((sum, item) => sum + (item.price * item.quantity * item.nights), 0);
      const itemCount = newItems.reduce((sum, item) => sum + item.quantity, 0);

      return {
        items: newItems,
        total,
        itemCount
      };
    }

    case 'REMOVE_ITEM': {
      const newItems = state.items.filter(item => item.id !== action.payload);
      const total = newItems.reduce((sum, item) => sum + (item.price * item.quantity * item.nights), 0);
      const itemCount = newItems.reduce((sum, item) => sum + item.quantity, 0);

      return {
        items: newItems,
        total,
        itemCount
      };
    }

    case 'UPDATE_QUANTITY': {
      const newItems = state.items.map(item =>
        item.id === action.payload.id
          ? { ...item, quantity: Math.max(0, action.payload.quantity) }
          : item
      ).filter(item => item.quantity > 0);

      const total = newItems.reduce((sum, item) => sum + (item.price * item.quantity * item.nights), 0);
      const itemCount = newItems.reduce((sum, item) => sum + item.quantity, 0);

      return {
        items: newItems,
        total,
        itemCount
      };
    }

    case 'UPDATE_DATES': {
      const newItems = state.items.map(item =>
        item.id === action.payload.id
          ? { 
              ...item, 
              checkIn: action.payload.checkIn,
              checkOut: action.payload.checkOut,
              nights: action.payload.nights
            }
          : item
      );

      const total = newItems.reduce((sum, item) => sum + (item.price * item.quantity * item.nights), 0);
      const itemCount = newItems.reduce((sum, item) => sum + item.quantity, 0);

      return {
        items: newItems,
        total,
        itemCount
      };
    }

    case 'CLEAR_CART':
      return {
        items: [],
        total: 0,
        itemCount: 0
      };

    default:
      return state;
  }
};

// Context
const CartContext = createContext<CartContextType | undefined>(undefined);

// Provider
interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, {
    items: [],
    total: 0,
    itemCount: 0
  });

  const addItem = (item: Omit<CartItem, 'id'>) => {
    dispatch({ type: 'ADD_ITEM', payload: item });
  };

  const removeItem = (id: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: id });
  };

  const updateQuantity = (id: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } });
  };

  const updateDates = (id: string, checkIn: string, checkOut: string, nights: number) => {
    dispatch({ type: 'UPDATE_DATES', payload: { id, checkIn, checkOut, nights } });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  const getItemById = (id: string) => {
    return state.items.find(item => item.id === id);
  };

  const isInCart = (hotelId: string, roomId: string) => {
    return state.items.some(item => item.hotelId === hotelId && item.roomId === roomId);
  };

  const value: CartContextType = {
    state,
    addItem,
    removeItem,
    updateQuantity,
    updateDates,
    clearCart,
    getItemById,
    isInCart
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

// Hook
export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};