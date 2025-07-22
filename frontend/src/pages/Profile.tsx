import { IoCloseOutline } from 'react-icons/io5'
import { LiaUser } from 'react-icons/lia'

import { useAuth } from '@/context/AuthContext'

import Hyperlink from '@/components/Hyperlink'
import PageLayout from '@/components/PageLayout'
import Text from '@/components/Text'

import { countSinceDate } from '@/lib/date'

const Profile = () => {
  const { user, loginTime, favoriteShowids } = useAuth()
  const numberOfFavorites = favoriteShowids.length

  if (!user) {
    return (
      <PageLayout title="Perfil">
        <Text>You need to be logged in.</Text>
      </PageLayout>
    )
  }

  return (
    <PageLayout title="Profile" className="pb-32">
      <div className="flex pt-16">
        <div className="w-1/4">
          <div className="w-4/5 flex items-center justify-center bg-black/10 aspect-square">
            <LiaUser className="text-[100px] text-white/10" />
          </div>
        </div>
        <div className="w-1/2 space-y-8">
          <Text variant="h3" as="h2" className="mb-8">
            Details
          </Text>
          <div>
            <Text variant="paragraphL" as="h2" color="muted">
              Username
            </Text>
            <Text variant="h3" as="p">
              {user.username}
            </Text>
          </div>
          <div>
            <Text variant="paragraphL" as="h2" color="muted">
              Email
            </Text>
            <Text variant="h3" as="p">
              {user.email}
            </Text>
          </div>
          <div>
            <Text variant="paragraphL" as="h2" color="muted">
              Password
            </Text>
            <Text variant="h3" as="p" className="flex items-center mt-1">
              <IoCloseOutline className="text-normal -ml-2" />
              <IoCloseOutline className="text-normal -ml-2" />
              <IoCloseOutline className="text-normal -ml-2" />
              <IoCloseOutline className="text-normal -ml-2" />
              <IoCloseOutline className="text-normal -ml-2" />
              <IoCloseOutline className="text-normal -ml-2" />
              <IoCloseOutline className="text-normal -ml-2" />
              <Text as="span" className="font-normal ml-2" color="muted">
                Change password (soon)
              </Text>
            </Text>
          </div>
          {loginTime && (
            <div>
              <Text variant="paragraphL" as="h2" color="muted">
                Logged in
              </Text>
              <Text variant="h3" as="p">
                {countSinceDate(loginTime)}
              </Text>
            </div>
          )}
        </div>
        <div className="w-1/4 space-y-2">
          <Text variant="h3" as="h2" className="mb-8">
            Links
          </Text>
          <Text>
            <Hyperlink href="/favorites">Favorites ({numberOfFavorites})</Hyperlink>
          </Text>
          <Text>
            <Hyperlink href="/profile/recommendations">
              Recommendations
            </Hyperlink>
          </Text>
          <Text>
            <Hyperlink href="/logout">Logout</Hyperlink>
          </Text>
        </div>
      </div>
    </PageLayout>
  )
}

export default Profile
