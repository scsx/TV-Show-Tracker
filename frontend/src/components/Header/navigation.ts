export type TDropdownLink = {
  title: string
  href?: string
  onClick?: () => void
}

export type TDropdownContent = {
  intro?: {
    title: string
    description: string
  }
  links: TDropdownLink[]
}

export type MenuItem = {
  label: string
  href?: string
  type: 'link' | 'dropdown'
  dropdownContent?: TDropdownContent
}

export const getMenuItems = (handleLogout: () => void): MenuItem[] => [
  {
    label: 'Trending',
    type: 'link',
    href: '/trending',
  },
  {
    label: 'Persons',
    type: 'link',
    href: '/persons',
  },
  {
    label: 'Shows',
    type: 'link',
    href: '/shows',
  },
  {
    label: 'Profile',
    type: 'dropdown',
    href: '/profile',
    dropdownContent: {
      intro: {
        title: 'Your Area',
        description: 'Manage your account, favorites and get recommendations',
      },
      links: [
        {
          title: 'Favorites',
          href: '/profile/favorites',
        },
        {
          title: 'Recommendations',
          href: '/profile/recommendations',
        },
        {
          title: 'Logout',
          onClick: handleLogout,
        },
      ],
    },
  },
]
