import { CancelTokenSource } from "axios";

interface RequestInFlight {
    url: string
    resourceName: string
    cancel: CancelTokenSource
    id: symbol
}

export default RequestInFlight