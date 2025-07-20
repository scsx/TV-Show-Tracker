import api from '@/services/api'
import { type TPerson } from '@/types'

/**
 * Fetches the complete details for a specific person by their TMDb ID.
 * Makes a call to the backend, which in turn fetches from the TMDb API.
 *
 * @param id The TMDb ID of the person.
 * @returns A Promise that resolves to the complete person details (TPerson)
 * or throws an error if there's an issue during the request.
 */
export const getPersonDetailsById = async (id: number): Promise<TPerson> => {
  try {
    const response = await api.get<TPerson>(`/api/tmdb/persons/${id}`)
    return response.data
  } catch (error) {
    console.error(`Error fetching person details with TMDb ID ${id}:`, error)
    throw error
  }
}
