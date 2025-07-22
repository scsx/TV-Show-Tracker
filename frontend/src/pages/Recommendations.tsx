import { useAuth } from '@/context/AuthContext'

import PageLayout from '@/components/PageLayout'

const Recommendations = () => {
  const { favoriteShowids } = useAuth()
  console.log(favoriteShowids)

  return (
    <PageLayout title="Recommendations" subtitle="Based on our favorites">
      stuff
    </PageLayout>
  )
}

export default Recommendations
