import { CiCircleInfo } from 'react-icons/ci'

import RegisterForm from '@/components/AuthForms/RegisterForm/RegisterForm'
import Hyperlink from '@/components/Hyperlink'
import PageLayout from '@/components/PageLayout'
import Text from '@/components/Text'
import { Alert } from '@/components/ui/alert'

const Register = () => {
  return (
    <PageLayout title="Register" wide={false}>
      <div className="w-full flex space-x-8">
        <div className="w-1/2">
          <RegisterForm />
        </div>
        <div className="w-1/2">
          <Alert variant="default">
            <CiCircleInfo className="text-3xl" />
            <div className="!pl-12 pt-1">
              <Text variant="h5" as="h5" className="mb-2">
                Already registered?
              </Text>
              <Text>
                You can <Hyperlink href="/login">login here.</Hyperlink>
              </Text>
            </div>
          </Alert>
        </div>
      </div>
    </PageLayout>
  )
}

export default Register
