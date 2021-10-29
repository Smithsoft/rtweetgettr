import ErrorData from "./ErrorData";
import ParamError from "./ParamError";

/** 
 * Top level structure for Twitter API error report
 */
interface ErrorResponse {
    errors?: ParamError[] | ErrorData[]
    title?: string,
    detail?: string,
    type?: string,
    status?: number
}

export default ErrorResponse