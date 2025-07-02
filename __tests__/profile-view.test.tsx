import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import { ProfileView } from '@/components/profile-view'

const mockMember = {
  id: '1',
  name: 'John Doe',
  role: 'Software Engineer',
  interest: 'Machine Learning',
  twitter: 'johndoe',
  linkedin: 'johndoe',
  discord: 'johndoe#1234',
  github: 'johndoe'
}

describe('ProfileView', () => {
  const mockOnUpdate = jest.fn()
  const mockOnLogout = jest.fn()

  beforeEach(() => {
    mockOnUpdate.mockClear()
    mockOnLogout.mockClear()
  })

  it('renders profile form with member data', () => {
    render(
      <ProfileView 
        member={mockMember} 
        onUpdate={mockOnUpdate} 
        onLogout={mockOnLogout} 
      />
    )

    expect(screen.getByDisplayValue('John Doe')).toBeInTheDocument()
    expect(screen.getByDisplayValue('Software Engineer')).toBeInTheDocument()
    expect(screen.getByDisplayValue('Machine Learning')).toBeInTheDocument()
    expect(screen.getByDisplayValue('johndoe#1234')).toBeInTheDocument() // Discord field
  })

  it('renders all form fields with correct labels', () => {
    render(
      <ProfileView 
        member={mockMember} 
        onUpdate={mockOnUpdate} 
        onLogout={mockOnLogout} 
      />
    )

    expect(screen.getByLabelText('Name')).toBeInTheDocument()
    expect(screen.getByLabelText('Role / Title')).toBeInTheDocument()
    expect(screen.getByLabelText('Area of AI Interest')).toBeInTheDocument()
    expect(screen.getByLabelText('Twitter Username (Optional)')).toBeInTheDocument()
    expect(screen.getByLabelText('LinkedIn Username (Optional)')).toBeInTheDocument()
    expect(screen.getByLabelText('Discord Handle (Optional)')).toBeInTheDocument()
    expect(screen.getByLabelText('GitHub Username (Optional)')).toBeInTheDocument()
  })

  it('allows editing form fields', () => {
    render(
      <ProfileView 
        member={mockMember} 
        onUpdate={mockOnUpdate} 
        onLogout={mockOnLogout} 
      />
    )

    const nameInput = screen.getByLabelText('Name')
    fireEvent.change(nameInput, { target: { value: 'Jane Doe' } })
    expect(nameInput).toHaveValue('Jane Doe')

    const roleInput = screen.getByLabelText('Role / Title')
    fireEvent.change(roleInput, { target: { value: 'Data Scientist' } })
    expect(roleInput).toHaveValue('Data Scientist')
  })

  it('calls onUpdate when form is submitted', async () => {
    render(
      <ProfileView 
        member={mockMember} 
        onUpdate={mockOnUpdate} 
        onLogout={mockOnLogout} 
      />
    )

    const nameInput = screen.getByLabelText('Name')
    fireEvent.change(nameInput, { target: { value: 'Jane Doe' } })

    const saveButton = screen.getByText('Update Profile')
    fireEvent.click(saveButton)

    await waitFor(() => {
      expect(mockOnUpdate).toHaveBeenCalledWith({
        ...mockMember,
        name: 'Jane Doe'
      })
    })
  })

  it('calls onLogout when logout button is clicked', () => {
    render(
      <ProfileView 
        member={mockMember} 
        onUpdate={mockOnUpdate} 
        onLogout={mockOnLogout} 
      />
    )

    const logoutButton = screen.getByText('Logout')
    fireEvent.click(logoutButton)

    expect(mockOnLogout).toHaveBeenCalled()
  })

  it('has required fields marked as required', () => {
    render(
      <ProfileView 
        member={mockMember} 
        onUpdate={mockOnUpdate} 
        onLogout={mockOnLogout} 
      />
    )

    const nameInput = screen.getByLabelText('Name')
    const roleInput = screen.getByLabelText('Role / Title') 
    const interestInput = screen.getByLabelText('Area of AI Interest')

    expect(nameInput).toBeRequired()
    expect(roleInput).toBeRequired()
    expect(interestInput).toBeRequired()
  })

  it('shows correct placeholders for social fields', () => {
    render(
      <ProfileView 
        member={{ ...mockMember, twitter: '', linkedin: '', discord: '', github: '' }} 
        onUpdate={mockOnUpdate} 
        onLogout={mockOnLogout} 
      />
    )

    expect(screen.getByPlaceholderText('e.g. ada_lovelace')).toBeInTheDocument() // Twitter
    expect(screen.getByPlaceholderText('e.g. ada_lovelace#1234')).toBeInTheDocument() // Discord
    expect(screen.getAllByPlaceholderText('e.g. adalovelace')).toHaveLength(2) // LinkedIn and GitHub (same placeholder)
  })
})
