import axios from "axios";

const apiURL = `${process.env.NEXT_APP_PUBLIC_API}/categories`

export default async function getCategories() {
    try {
        const res = await axios.get(apiURL)
        return res.data.data
    } catch (error) {
        return error
    }
}