import { render, screen } from '@testing-library/react'
import { MemberCard } from '../components/member-card'
import { Member } from '../lib/supabase'

const mockMember: Member = {
  id: '1',
  name: 'Test User',
  role: 'AI Engineer',
  interest: 'Machine Learning',
  github: 'testuser',
  twitter: 'testuser',
  linkedin: 'testuser',
  discord: 'TestUser#1234'
}

describe('MemberCard', () => {
  it('renders member information correctly', () => {
    render(<MemberCard member={mockMember} index={0} />)
    
    expect(screen.getByText('Test User')).toBeInTheDocument()
    expect(screen.getByText('AI Engineer')).toBeInTheDocument()
    expect(screen.getByText('Machine Learning')).toBeInTheDocument()
    expect(screen.getByText('TestUser#1234')).toBeInTheDocument()
  })

  it('renders social links when provided', () => {
    render(<MemberCard member={mockMember} index={0} />)
    
    expect(screen.getByTitle('GitHub: testuser')).toBeInTheDocument()
  })

  it('applies animation class when provided', () => {
    const { container } = render(
      <MemberCard member={mockMember} index={0} animationClass="animate-card-enter" />
    )
    
    const card = container.querySelector('.animate-card-enter')
    expect(card).toBeInTheDocument()
  })
})
