import Hyperlink from '@/components/Hyperlink'
import Text from '@/components/Text'

// --- Menu data types ---
interface DropdownLink {
  title: string
  href: string
}

interface DropdownContent {
  intro?: {
    title: string
    description: string
  }
  links: DropdownLink[]
}

interface MenuItem {
  label: string
  href?: string
  type: 'link' | 'dropdown'
  dropdownContent?: DropdownContent
}

// --- Menu data ---
const customMenuItems: MenuItem[] = [
  {
    label: 'Latest',
    type: 'link',
    href: '/contact',
  },
  {
    label: 'Shows',
    type: 'dropdown',
    dropdownContent: {
      intro: {
        title: 'My App',
        description: 'Welcome to my personalized application!',
      },
      links: [
        { title: 'Start', href: '/' },
        {
          title: 'Features',
          href: '/features',
        },
        {
          title: 'About',
          href: '/about',
        },
      ],
    },
  },
  {
    label: 'Profile',
    type: 'dropdown',
    dropdownContent: {
      intro: {
        title: 'Your Area',
        description: 'Manage your favorites and stuff',
      },
      links: [
        {
          title: 'Account',
          href: '/profile',
        },
        {
          title: 'Favorites',
          href: '/profile/favorites',
        },
        {
          title: 'Logout',
          href: '/logout',
        },
      ],
    },
  },
]

export function Nav() {
  return (
    <nav className="relative">
      <ul className="flex items-center space-x-4">
        {customMenuItems.map((item, index) => (
          <li key={index} className="group">
            {item.type === 'link' ? (
              <Hyperlink
                href={item.href}
                className="px-0 py-0 h-auto bg-transparent rounded-none text-foreground hover:text-primary transition-colors duration-200 ease-in-out focus:outline-none"
              >
                {item.label}
              </Hyperlink>
            ) : (
              <>
                <div className="relative cursor-pointer pr-4 bg-transparent rounded-none text-foreground hover:text-primary transition-colors duration-200 ease-in-out focus:outline-none">
                  {item.label}
                  <div className="absolute right-0 top-2 block h-[6px] w-[6px] border-r border-b border-current transform rotate-45 transition duration-300 group-hover:rotate-[225deg] group-hover:top-2.5"></div>
                </div>

                <div className="absolute p-6 right-0 top-full z-50 w-[380px] bg-darkblue opacity-0 invisible transform scale-y-0 origin-top transition-all duration-300 ease-in-out group-hover:opacity-100 group-hover:visible group-hover:scale-y-100">
                  <div className="w-full flex space-x-4">
                    {item.dropdownContent?.intro && (
                      <div className="grow">
                        <Text as="h5" className="text-lg font-bold">
                          {item.dropdownContent.intro.title}
                        </Text>
                        <Text className="mt-4 leading-tight text-muted-foreground">
                          {item.dropdownContent.intro.description}
                        </Text>
                      </div>
                    )}
                    <ul className="flex flex-col space-y-2 text-right">
                      {item.dropdownContent?.links.map((link, linkIndex) => (
                        <li key={linkIndex}>
                          <Hyperlink href={link.href} variant="white">
                            {link.title}
                          </Hyperlink>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>
    </nav>
  )
}
