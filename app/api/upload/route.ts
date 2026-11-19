import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';

export const runtime = 'nodejs';

// Initialize Supabase Storage client if non-placeholder credentials exist
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const isSupabaseConfigured =
  supabaseUrl &&
  supabaseKey &&
  !supabaseUrl.includes('placeholder') &&
  !supabaseKey.includes('placeholder');

const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl!, supabaseKey!)
  : null;

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const files = formData.getAll('files') as File[];
    const singleFile = formData.get('file') as File | null;

    const allFiles: File[] = [];
    if (files && files.length > 0) {
      allFiles.push(...files);
    } else if (singleFile) {
      allFiles.push(singleFile);
    }

    if (allFiles.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No files provided for upload.' },
        { status: 400 }
      );
    }

    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    const uploadedUrls: string[] = [];

    for (const file of allFiles) {
      if (!file.type.startsWith('image/')) {
        continue;
      }

      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // Sanitize extension and create clean filename
      const ext = path.extname(file.name) || '.jpg';
      const cleanBase = file.name
        .replace(ext, '')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-');
      const uniqueName = `hori_${cleanBase}_${Date.now()}_${Math.random()
        .toString(36)
        .slice(2, 7)}${ext}`;
      const filePath = path.join(uploadsDir, uniqueName);

      // 1. Permanent Local File Storage Fallback (Always guaranteed to work)
      fs.writeFileSync(filePath, buffer);
      let resolvedUrl = `/uploads/${uniqueName}`;

      // 2. Supabase Storage Integration (if configured)
      if (supabase) {
        try {
          const bucketName = 'products';
          const { data: uploadData, error: uploadErr } = await supabase.storage
            .from(bucketName)
            .upload(uniqueName, buffer, {
              contentType: file.type || 'image/jpeg',
              upsert: true,
            });

          if (!uploadErr && uploadData) {
            const { data: publicData } = supabase.storage
              .from(bucketName)
              .getPublicUrl(uniqueName);
            if (publicData?.publicUrl) {
              resolvedUrl = publicData.publicUrl;
            }
          } else if (uploadErr) {
            console.warn('Supabase storage upload returned error, using local storage fallback:', uploadErr.message);
          }
        } catch (supabaseErr) {
          console.warn('Supabase storage connection failed, using local storage fallback:', supabaseErr);
        }
      }

      uploadedUrls.push(resolvedUrl);
    }

    if (uploadedUrls.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No valid image files processed.' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      url: uploadedUrls[0],
      urls: uploadedUrls,
      count: uploadedUrls.length,
      storageType: isSupabaseConfigured ? 'supabase' : 'local',
    });
  } catch (err: unknown) {
    console.error('File upload error:', err);
    return NextResponse.json(
      { success: false, error: err instanceof Error ? err.message : 'Upload failed' },
      { status: 500 }
    );
  }
}
