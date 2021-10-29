import PublicMetrics from "./PublicMetrics";

interface UserData {
    id: string
    profile_image_url?: string
    name: string
    username: string
    verified?: boolean
    public_metrics?: PublicMetrics
}

export default UserData
