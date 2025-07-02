import { render, screen } from '@testing-library/react'
import { DatabaseStatus } from '../components/database-status'

describe('DatabaseStatus', () => {
  it('shows loading state', () => {
    render(<DatabaseStatus loading={true} error={null} memberCount={0} />)
    expect(screen.getByText('Connecting to Database...')).toBeInTheDocument()
  })

  it('shows error state', () => {
    render(<DatabaseStatus loading={false} error="Connection failed" memberCount={0} />)
    expect(screen.getByText('Database Connection Error')).toBeInTheDocument()
  })

  it('shows connected state with member count', () => {
    render(<DatabaseStatus loading={false} error={null} memberCount={4} />)
    expect(screen.getByText('Connected to Supabase Database (4 members)')).toBeInTheDocument()
  })
})
