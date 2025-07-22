import { useNavigate } from 'react-router-dom'

import { useAuth } from '@/context/AuthContext'

import { getMenuItems } from '@/components/Header/navigation'
import Hyperlink from '@/components/Hyperlink'
import Text from '@/components/Text'

export function Nav() {
  const { logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const menuItems = getMenuItems(handleLogout)

  return (
    <nav className="relative">
      <ul className="flex items-center space-x-8">
        {menuItems.map((item, index) => (
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
                {item.href ? (
                  <Hyperlink
                    href={item.href}
                    className="px-0 py-0 h-auto bg-transparent rounded-none text-foreground hover:text-primary transition-colors duration-200 ease-in-out focus:outline-none relative pr-4"
                  >
                    {item.label}
                    <div className="absolute right-0 top-2 block h-[6px] w-[6px] border-r border-b border-current transform rotate-45 transition duration-300 group-hover:rotate-[225deg] group-hover:top-2.5"></div>
                  </Hyperlink>
                ) : (
                  <div className="relative cursor-pointer pr-4 bg-transparent rounded-none text-foreground hover:text-primary transition-colors duration-200 ease-in-out focus:outline-none">
                    {item.label}
                    <div className="absolute right-0 top-2 block h-[6px] w-[6px] border-r border-b border-current transform rotate-45 transition duration-300 group-hover:rotate-[225deg] group-hover:top-2.5"></div>
                  </div>
                )}

                <div className="absolute p-6 right-0 top-[calc(100%+8px)] pt-6 z-50 w-[480px] bg-darkblue opacity-0 invisible transform scale-y-0 origin-top transition-all duration-300 ease-in-out group-hover:opacity-100 group-hover:visible group-hover:scale-y-100">
                  <div className="w-full flex space-x-16">
                    {item.dropdownContent?.intro && (
                      <div className="grow">
                        <Text as="h5" className="text-lg font-bold">
                          {item.dropdownContent.intro.title}
                        </Text>
                        <Text className="mt-2 leading-tight text-muted-foreground">
                          {item.dropdownContent.intro.description}
                        </Text>
                      </div>
                    )}
                    <ul className="flex flex-col space-y-2 text-right">
                      {item.dropdownContent?.links.map((link, linkIndex) => (
                        <li key={linkIndex}>
                          {link.href ? (
                            <Hyperlink href={link.href} variant="white">
                              {link.title}
                            </Hyperlink>
                          ) : (
                            <button
                              onClick={link.onClick}
                              className="text-white hover:text-primary transition-colors duration-200 ease-in-out focus:outline-none bg-transparent border-none cursor-pointer p-0"
                            >
                              {link.title}
                            </button>
                          )}
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
