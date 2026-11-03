export const selectedContact = {
  label: '(919) 426-1801',
  phone: '(919) 426-1801',
}

export const caller = {
  name: 'Matthew Rodriguez',
  phone: '(415) 123-4567',
  contactCenter: 'Credit Card Help Center',
}

// Delay before the incoming call appears, and how long Decline counts down.
export const RING_DELAY_MS = 1000
export const RING_TIMEOUT_MS = 10000

export const sidebarSections = [
  {
    title: 'Favorites',
    defaultOpen: true,
    items: [
      { label: 'Ben Parker', subtitle: 'In a meeting · Working from SF', avatar: 'BP', avatarColor: '#7C52FF', status: 'busy' },
      { label: 'Alicia Kurniawan', avatar: 'AK', avatarColor: '#7C52FF', badge: 2 },
      { label: 'design', icon: 'channel' },
      { label: 'Claire Reynolds, Lori Smith...', icon: 'group' },
      { label: 'Veronica Smith', subtitle: '⚡ TCB!', avatar: 'VS', avatarColor: '#9E9E9E' },
    ],
  },
  {
    title: 'Coaching teams',
    defaultOpen: true,
    items: [
      { label: 'Sales SMB', icon: 'square', iconColor: '#4CAF50' },
    ],
  },
  {
    title: 'Recents',
    defaultOpen: true,
    items: [
      { label: '(919) 426-1801', icon: 'user' },
      { label: '(805) 684-7000', icon: 'user' },
      { label: '(913) 221-3070', icon: 'user' },
      { label: '(684) 555-0102', icon: 'user' },
      { label: '(629) 555-0129', icon: 'user' },
      { label: '(201) 555-0124', icon: 'user' },
      { label: '(302) 555-0107', icon: 'user' },
      { label: '(808) 555-0111', icon: 'user' },
      { label: '(209) 555-0104', icon: 'user' },
      { label: '(319) 555-0115', icon: 'user' },
    ],
  },
]
