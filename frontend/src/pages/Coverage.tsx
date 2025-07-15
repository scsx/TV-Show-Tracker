import PageLayout from '@/components/PageLayout'

const Coverage = () => {
  const coverageReportPath = '/coverage/lcov-report/index.html'
  return (
    <PageLayout title="Coverage" subtitle="Coverage results for /frontend">
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
