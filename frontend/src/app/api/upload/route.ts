import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'dcifssy9u',
  api_key: process.env.CLOUDINARY_API_KEY || '957371226612686',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'ZR0cWl1BNVq50ksPx1p7qxeTuNM',
});

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = (formData.get('image') || formData.get('file')) as File | null;
    const files = formData.getAll('images') as File[];

    // 1. Multiple Files Upload
    if (files && files.length > 0) {
      const uploadPromises = files.map(async (f) => {
        const bytes = await f.arrayBuffer();
        const buffer = Buffer.from(bytes);
        return new Promise<string>((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            {
              folder: 'kounoz_products',
              resource_type: 'image',
            },
            (error, result) => {
              if (error || !result) {
                reject(error || new Error('Cloudinary upload error'));
              } else {
                resolve(result.secure_url);
              }
            }
          );
          uploadStream.end(buffer);
        });
      });

      const urls = await Promise.all(uploadPromises);
      return NextResponse.json({
        success: true,
        urls,
        provider: 'cloudinary',
      });
    }

    // 2. Single File Upload
    if (!file) {
      return NextResponse.json({ success: false, message: 'No file provided' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadResult = await new Promise<{ secure_url: string; public_id: string }>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'kounoz_products',
          resource_type: 'image',
        },
        (error, result) => {
          if (error || !result) {
            reject(error || new Error('Cloudinary upload error'));
          } else {
            resolve({
              secure_url: result.secure_url,
              public_id: result.public_id,
            });
          }
        }
      );
      uploadStream.end(buffer);
    });

    return NextResponse.json({
      success: true,
      url: uploadResult.secure_url,
      public_id: uploadResult.public_id,
      provider: 'cloudinary',
    });
  } catch (err: any) {
    console.error('Cloudinary API route upload error:', err);
    return NextResponse.json(
      {
        success: false,
        message: err?.message || 'Error uploading to Cloudinary',
      },
      { status: 500 }
    );
  }
}
