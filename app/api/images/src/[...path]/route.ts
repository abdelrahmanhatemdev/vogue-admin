import fs from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';

export async function GET(req: Request, { params }: { params: { path: string[] } }) {
  const { path: pathSegments } = await params;

  const filePath = path.join(process.cwd(), ...pathSegments);
  
  if (!fs.existsSync(filePath)) {
    return NextResponse.json({ error: 'File not found' }, { status: 404 });
  }

  const file = fs.readFileSync(filePath);

  const contentType = path.extname(filePath).toLowerCase() === '.png' ? 'image/png' : 'image/jpeg';

  return new Response(file, {
    headers: {
      'Content-Type': contentType,
    },
  });
}