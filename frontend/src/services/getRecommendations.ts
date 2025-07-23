import api from '@/services/api'
import { type TRecommendation } from '@/types'

/**
 * Fetches personalized TV show recommendations for a specific user from the backend.
 *
 * @param {string} userId - The ID of the user for whom to fetch recommendations.
 * @param {string} token - The authentication token for the user.
 * @returns {Promise<TRecommendation[]>} - A promise that resolves to an array of TRecommendation objects.
 * Returns an empty array if the request fails or no recommendations are found.
 */
export const getRecommendations = async (
  userId: string,
  token: string,
): Promise<TRecommendation[]> => {
  try {
    const response = await api.get(`/api/users/${userId}/recommendations`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    return response.data
  } catch (error: any) {
    console.error(
      `Failed to fetch personalized recommendations for user ${userId}:`,
      error.message,
    )
    return []
  }
}
