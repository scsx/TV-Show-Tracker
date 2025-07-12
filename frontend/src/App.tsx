import Text from '@/components/Text'
import Header from '@/components/Header/Header'
import Footer from '@/components/Footer'
const App = () => {
  return (
    <>
      <div className='flex flex-col min-h-screen'>
        <Header />
        <main className='flex flex-1 py-40 content-stretch'>
          <div className='bg-background text-foreground'>
            <Text variant='h1'>Hello</Text>
            <Text>Esta é a sua nova aplicação React com backend e Tailwind.</Text>{' '}
            <button className='bg-primary text-primary-foreground px-4 py-2 rounded-md mt-6'>
              Começar
            </button>
          </div>
        </main>
        <Footer />
      </div>
    </>
  )
}

export default App
