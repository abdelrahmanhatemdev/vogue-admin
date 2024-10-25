import axios from "axios";

const apiURL = `${process.env.NEXT_PUBLIC_APP_API}/categories`

export default async function getCategories() {
    try {
        const res = await axios.get(apiURL)
        let data: Category[] = [];
        if (res?.data?.data) {
            data = res.data.data
            data = data.sort((a, b) => b.updatedAt.localeCompare(b.updatedAt))
            return data
        }
        
    } catch (error) {
        return error
    }
}