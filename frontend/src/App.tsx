import Footer from '@/components/Footer'
import Header from '@/components/Header/Header'
import Text from '@/components/Text'

const App = () => {
  return (
    <>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex flex-1">
          <div className="container">
            <Text variant="h1">Hello</Text>
            <Text>
              Esta é a sua nova aplicação React com backend e Tailwind CSS.
            </Text>{' '}
            <button className="bg-primary text-primary-foreground px-4 py-2 rounded-md mt-6">
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
