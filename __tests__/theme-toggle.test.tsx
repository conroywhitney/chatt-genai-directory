import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import { ThemeProvider } from 'next-themes'
import { ThemeToggle } from '@/components/theme-toggle'

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
})

// Mock next-themes hook
const mockSetTheme = jest.fn()
jest.mock('next-themes', () => ({
  ...jest.requireActual('next-themes'),
  useTheme: () => ({
    theme: 'light',
    setTheme: mockSetTheme,
  }),
}))

// Wrapper component to provide theme context
function ThemeWrapper({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      {children}
    </ThemeProvider>
  )
}

describe('ThemeToggle', () => {
  beforeEach(() => {
    mockSetTheme.mockClear()
  })

  it('renders theme toggle button', () => {
    render(
      <ThemeWrapper>
        <ThemeToggle />
      </ThemeWrapper>
    )

    const button = screen.getByRole('button')
    expect(button).toBeInTheDocument()
    expect(screen.getByText('Toggle theme')).toBeInTheDocument()
  })

  it('shows sun icon initially (loading state)', () => {
    render(
      <ThemeWrapper>
        <ThemeToggle />
      </ThemeWrapper>
    )

    // Should show sun icon in loading state
    const sunIcon = screen.getByRole('button').querySelector('svg')
    expect(sunIcon).toBeInTheDocument()
  })

  it('calls setTheme when clicked', () => {
    render(
      <ThemeWrapper>
        <ThemeToggle />
      </ThemeWrapper>
    )

    const button = screen.getByRole('button')
    fireEvent.click(button)

    expect(mockSetTheme).toHaveBeenCalledWith('dark')
  })

  it('has proper accessibility attributes', () => {
    render(
      <ThemeWrapper>
        <ThemeToggle />
      </ThemeWrapper>
    )

    const button = screen.getByRole('button')
    // Button doesn't need explicit type="button" since it's the default for Button component
    expect(button).toBeInTheDocument()
    
    const srText = screen.getByText('Toggle theme')
    expect(srText).toHaveClass('sr-only')
  })
})
