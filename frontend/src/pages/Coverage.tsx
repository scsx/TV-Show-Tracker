import { MdOutlineContentCopy } from 'react-icons/md'

import PageLayout from '@/components/PageLayout'
import Text from '@/components/Text'

import { usePushNotification } from '@/hooks/usePushNotification'

const Coverage = () => {
  const { showSuccessToast } = usePushNotification()
  const coverageReportPath = '/coverage/lcov-report/index.html'
  const commandToCopy = 'npm test --workspace=frontend -- --coverage'

  const handleCopyCommand = async () => {
    try {
      await navigator.clipboard.writeText(commandToCopy)
      showSuccessToast({
        title: 'Command copied',
        description: 'You can paste it in the terminal',
      })
    } catch (err) {
      console.error('Falha ao copiar:', err)
    }
  }

  return (
    <PageLayout title="Coverage" subtitle="Coverage results for /frontend">
      <div className="mb-8 -mt-8 max-w-[600px]">
        <Text className="mb-4">
          If you can't see the iframe at root level run the command:
        </Text>
        <div
          className="border px-4 py-2 rounded-md flex items-center cursor-pointer hover:bg-slate-700"
          onClick={handleCopyCommand}
        >
          <pre className="flex-1 text-primary">{commandToCopy}</pre>
          <MdOutlineContentCopy />
        </div>
      </div>
      <div className="bg-white">
        <iframe
          src={coverageReportPath}
          style={{ width: '100%', height: '800px', border: 'none' }}
          title="Relatório de Cobertura"
        />
      </div>
    </PageLayout>
  )
}

export default Coverage
