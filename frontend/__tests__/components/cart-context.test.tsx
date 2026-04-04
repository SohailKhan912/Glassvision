/**
 * Cart Context Component Tests
 * Tests shopping cart state management
 */

import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import { CartProvider, useCart } from '@/components/cart-context'

// Mock component that uses cart
const TestCartComponent = () => {
  const { items, total, itemCount, addItem } = useCart()

  return (
    <div>
      <div data-testid="item-count">{itemCount}</div>
      <div data-testid="total">{total}</div>
      <button
        data-testid="add-item"
        onClick={() =>
          addItem({
            id: 'test-1',
            width: 900,
            height: 2100,
            material: 'tempered-glass',
            frame: 'aluminum',
            finish: 'matte',
            features: [],
            price: 15000,
            quantity: 1,
            modelName: 'Test Door',
          })
        }
      >
        Add Item
      </button>
    </div>
  )
}

describe('CartProvider', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('should render children without crashing', () => {
    render(
      <CartProvider>
        <div>Test Content</div>
      </CartProvider>
    )

    expect(screen.getByText('Test Content')).toBeInTheDocument()
  })

  it('should initialize with empty cart', () => {
    render(
      <CartProvider>
        <TestCartComponent />
      </CartProvider>
    )

    expect(screen.getByTestId('item-count')).toHaveTextContent('0')
    expect(screen.getByTestId('total')).toHaveTextContent('0')
  })

  it('should add item to cart', async () => {
    render(
      <CartProvider>
        <TestCartComponent />
      </CartProvider>
    )

    const addButton = screen.getByTestId('add-item')
    addButton.click()

    await waitFor(() => {
      expect(screen.getByTestId('item-count')).toHaveTextContent('1')
    }, { timeout: 3000 })
    
    expect(screen.getByTestId('total')).toHaveTextContent('15000')
  })

  it('should persist cart to localStorage', async () => {
    render(
      <CartProvider>
        <TestCartComponent />
      </CartProvider>
    )

    const addButton = screen.getByTestId('add-item')
    addButton.click()

    await waitFor(() => {
      const saved = localStorage.getItem('glassdoor_cart')
      expect(saved).toBeTruthy()
      if (saved) {
        const cart = JSON.parse(saved)
        expect(cart.length).toBe(1)
      }
    }, { timeout: 3000 })
  })
})

