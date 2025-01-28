/**
 * Standardized API response type for consistent API communication across the application.
 * This type should be used as the return type for all API routes to maintain consistency
 * in error handling and response structure.
 *
 * @template T - Type of the data payload (defaults to any)
 *
 * @example
 * // Successful response
 * const successResponse: ApiResponse<User> = {
 *   success: true,
 *   message: 'User data retrieved successfully',
 *   data: { id: 1, name: 'John Doe' }
 * };
 *
 * // Error response
 * const errorResponse: ApiResponse = {
 *   success: false,
 *   message: 'Failed to fetch user data',
 *   error: 'User not found'
 * };
 */
export type ApiResponse<T = any> = {
  /**
   * Indicates whether the API request was successful
   * - true: The operation completed successfully
   * - false: The operation failed
   */
  success: boolean;

  /**
   * Human-readable message describing the result of the operation.
   * Should be clear and concise for end-user display.
   */
  message: string;

  /**
   * Optional payload containing the requested data.
   * Type should be specified using the generic parameter T.
   * Only present when success is true.
   */
  data?: T;

  /**
   * Optional error details for debugging purposes.
   * Should contain technical information about what went wrong.
   * Only present when success is false.
   */
  error?: string;
};
