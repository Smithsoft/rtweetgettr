/** 
 * Information for a Twitter response where the API call fails and the
 * request results in http errors.
 */
interface ErrorResponse {
    title: string,
    detail: string,
    type: string,
    status: number
}

export default ErrorResponse