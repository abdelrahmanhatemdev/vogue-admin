import { NextResponse } from "next/server";


export async function POST (request:Request){
    const data = await request.json();

    console.log("request", request);

    return NextResponse.json({messege: "Uploaded"}, {status: 200})
    

}