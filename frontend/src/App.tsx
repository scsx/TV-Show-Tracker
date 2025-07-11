const App = () => {
  return (
    <>
      <div className='min-h-screen flex flex-col items-center justify-center bg-background text-foreground'>
        <h1 className='text-5xl font-playfair font-bold mb-4'>Bem-vindo!</h1>{' '}
        <p className='text-lg font-tiktok'>
          Esta é a sua nova aplicação React com backend e Tailwind.
        </p>{' '}
        <button className='bg-primary text-primary-foreground px-4 py-2 rounded-md mt-6'>
          Começar
        </button>
      </div>
    </>
  )
}

export default App
