import { CiCircleInfo } from 'react-icons/ci'

import LoginForm from '@/components/AuthForms/LoginForm'
import Hyperlink from '@/components/Hyperlink'
import PageLayout from '@/components/PageLayout'
import Text from '@/components/Text'
import { Alert } from '@/components/ui/alert'

const Login = () => {
  return (
    <PageLayout title="Login" wide={false}>
      <div className="w-full flex space-x-8">
        <div className="w-1/2">
          <LoginForm />
        </div>
        <div className="w-1/2">
          <Alert variant="default">
            <CiCircleInfo className="text-3xl" />
            <div className="!pl-12 pt-1">
              <Text variant="h5" as="h5" className="mb-2">
                Not registered yet?
              </Text>
              <Text>
                <Hyperlink href="/register">Register here</Hyperlink> to create
                a new account.
              </Text>
            </div>
          </Alert>
        </div>
      </div>
    </PageLayout>
  )
}

export default Login
