/**
 * Re-exports common types from the shared module for convenient access within the frontend.
 * This centralizes type imports and enhances development experience by improving autocompletion.
 *
 * For a larger monorepo, a more robust solution might involve TypeScript project references
 * and build processes in the shared package.
 */

export type { TUser } from '@shared/types/user'
export type { TAccessToken } from '@shared/types/access-token'
