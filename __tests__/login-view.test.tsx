import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import { LoginView } from '@/components/login-view'

describe('LoginView', () => {
  const mockOnLogin = jest.fn()

  beforeEach(() => {
    mockOnLogin.mockClear()
  })

  it('renders login card with title and description', () => {
    render(<LoginView onLogin={mockOnLogin} />)

    expect(screen.getByText('Join the Directory')).toBeInTheDocument()
    expect(screen.getByText('Connect with your favorite social account.')).toBeInTheDocument()
  })

  it('renders all social login buttons', () => {
    render(<LoginView onLogin={mockOnLogin} />)

    expect(screen.getByText('Continue with GitHub')).toBeInTheDocument()
    expect(screen.getByText('Continue with LinkedIn')).toBeInTheDocument()
    expect(screen.getByText('Continue with X')).toBeInTheDocument()
  })

  it('calls onLogin with github when GitHub button is clicked', () => {
    render(<LoginView onLogin={mockOnLogin} />)

    const githubButton = screen.getByText('Continue with GitHub')
    fireEvent.click(githubButton)

    expect(mockOnLogin).toHaveBeenCalledWith('github')
  })

  it('calls onLogin with linkedin when LinkedIn button is clicked', () => {
    render(<LoginView onLogin={mockOnLogin} />)

    const linkedinButton = screen.getByText('Continue with LinkedIn')
    fireEvent.click(linkedinButton)

    expect(mockOnLogin).toHaveBeenCalledWith('linkedin')
  })

  it('calls onLogin with twitter when X button is clicked', () => {
    render(<LoginView onLogin={mockOnLogin} />)

    const twitterButton = screen.getByText('Continue with X')
    fireEvent.click(twitterButton)

    expect(mockOnLogin).toHaveBeenCalledWith('twitter')
  })

  it('has proper button styling and icons', () => {
    render(<LoginView onLogin={mockOnLogin} />)

    const githubButton = screen.getByText('Continue with GitHub').closest('button')
    const linkedinButton = screen.getByText('Continue with LinkedIn').closest('button')
    const twitterButton = screen.getByText('Continue with X').closest('button')

    expect(githubButton).toHaveClass('w-full')
    expect(linkedinButton).toHaveClass('w-full')
    expect(twitterButton).toHaveClass('w-full')

    // Check that each button has an icon (we can check by looking for svg elements)
    expect(githubButton?.querySelector('svg')).toBeInTheDocument()
    expect(linkedinButton?.querySelector('svg')).toBeInTheDocument()
    expect(twitterButton?.querySelector('svg')).toBeInTheDocument()
  })

  it('has animated background effects', () => {
    render(<LoginView onLogin={mockOnLogin} />)

    // The component should have divs with background effects
    const container = screen.getByText('Join the Directory').closest('.relative')
    expect(container).toBeInTheDocument()
    
    // Should have multiple divs for the glow effects
    const glowElements = container?.querySelectorAll('div')
    expect(glowElements?.length).toBeGreaterThan(1)
  })
})
