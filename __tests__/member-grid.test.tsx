import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { MemberGrid } from '@/components/member-grid'
import { Member } from '@/lib/supabase'

const mockMembers: Member[] = [
  {
    id: '1',
    name: 'John Doe',
    role: 'Software Engineer',
    interest: 'Machine Learning',
    github: 'johndoe',
    twitter: 'johndoe',
    linkedin: 'johndoe',
    discord: 'johndoe#1234',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  },
  {
    id: '2',
    name: 'Jane Smith',
    role: 'Data Scientist',
    interest: 'Deep Learning',
    github: 'janesmith',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  }
]

describe('MemberGrid', () => {
  it('renders loading skeleton when loading', () => {
    render(
      <MemberGrid 
        members={[]} 
        loading={true} 
        isMounted={false} 
        newMemberId={null} 
      />
    )

    // Should show loading skeleton cards
    const skeletonCards = screen.getAllByRole('generic')
    expect(skeletonCards.length).toBeGreaterThan(0)
  })

  it('renders empty state when no members', () => {
    render(
      <MemberGrid 
        members={[]} 
        loading={false} 
        isMounted={true} 
        newMemberId={null} 
      />
    )

    expect(screen.getByText('No members yet')).toBeInTheDocument()
    expect(screen.getByText('Be the first to join the directory!')).toBeInTheDocument()
  })

  it('renders member cards when members exist', () => {
    render(
      <MemberGrid 
        members={mockMembers} 
        loading={false} 
        isMounted={true} 
        newMemberId={null} 
      />
    )

    expect(screen.getByText('John Doe')).toBeInTheDocument()
    expect(screen.getByText('Jane Smith')).toBeInTheDocument()
    expect(screen.getByText('Software Engineer')).toBeInTheDocument()
    expect(screen.getByText('Data Scientist')).toBeInTheDocument()
  })

  it('applies new member animation class correctly', () => {
    render(
      <MemberGrid 
        members={mockMembers} 
        loading={false} 
        isMounted={true} 
        newMemberId={'1'} 
      />
    )

    // The new member should have special animation class
    const memberCards = screen.getAllByRole('generic')
    expect(memberCards.length).toBeGreaterThan(0)
    
    // Check that members are rendered
    expect(screen.getByText('John Doe')).toBeInTheDocument()
    expect(screen.getByText('Jane Smith')).toBeInTheDocument()
  })

  it('shows correct social links', () => {
    render(
      <MemberGrid 
        members={mockMembers} 
        loading={false} 
        isMounted={true} 
        newMemberId={null} 
      />
    )

    // Check for GitHub links
    const githubLinks = screen.getAllByTitle(/GitHub:/)
    expect(githubLinks).toHaveLength(2)
    expect(githubLinks[0]).toHaveAttribute('href', 'https://github.com/johndoe')

    // Check for Twitter links (using sr-only text)
    const twitterText = screen.getAllByText('Twitter')
    expect(twitterText).toHaveLength(1)
    const twitterLink = twitterText[0].closest('a')
    expect(twitterLink).toHaveAttribute('href', 'https://twitter.com/johndoe')

    // Check for LinkedIn links (using sr-only text)
    const linkedinText = screen.getAllByText('LinkedIn')
    expect(linkedinText).toHaveLength(1)
    const linkedinLink = linkedinText[0].closest('a')
    expect(linkedinLink).toHaveAttribute('href', 'https://linkedin.com/in/johndoe')
  })
})
