// TODO: CLEAN, COMPLETE
import React from 'react'

import { useAuth } from '@/context/AuthContext'

import PageLayout from '@/components/PageLayout'

// Importe o hook de autenticação

const Favorites: React.FC = () => {
  const { favoriteShowTmdbIds } = useAuth() // Acessa o array de IDs favoritos

  // Você pode adicionar um console.log aqui também para ver no console do navegador
  console.log(
    'Favorites Component: favoriteShowTmdbIds received:',
    favoriteShowTmdbIds,
  )

  return (
    <PageLayout title="Favorites">
      {/* Exibe o array favoriteShowTmdbIds diretamente como uma string */}
      <p>Favorite TMDB IDs: {JSON.stringify(favoriteShowTmdbIds)}</p>
    </PageLayout>
  )
}

export default Favorites
