/** 
 * Information for a Twitter response where the API call succeeds but the
 * request results in data errors.
 */
interface ErrorData {
    value?: string
    detail: string
    title: string
    resource_type?: string
    parameter?: string
    resource_id?: string
    type?: string
}

export default ErrorData