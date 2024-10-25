import axios from "axios";

const apiURL = `${process.env.NEXT_PUBLIC_APP_API}/categories`

export default async function getCategories() {
    try {
        const res = await axios.get(apiURL)
        let data: Category[] = [];
        if (res?.data?.data) {
            data = res.data.data
            const sortedData = data.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
            return sortedData
        }
        
    } catch (error) {
        return error
    }
}