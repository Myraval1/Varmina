
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Helper to read .env.local manually since we don't have dotenv
const loadEnv = () => {
    try {
        const envPath = path.resolve(process.cwd(), '.env.local');
        const content = fs.readFileSync(envPath, 'utf-8');
        const env = {};
        content.split('\n').forEach(line => {
            const [key, ...rest] = line.split('=');
            if (key && rest) {
                env[key.trim()] = rest.join('=').trim();
            }
        });
        return env;
    } catch (e) {
        console.error('Error reading .env.local', e);
        return {};
    }
};

const env = loadEnv();
const supabaseUrl = env.VITE_SUPABASE_URL;
const supabaseKey = env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials in .env.local');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const BUCKET_NAME = 'product-images';

async function getAllFiles(bucket) {
    let allFiles = [];
    let page = 0;
    let pageSize = 100;
    let hasMore = true;

    while (hasMore) {
        const { data, error } = await supabase.storage
            .from(bucket)
            .list('', { limit: pageSize, offset: page * pageSize });

        if (error) {
            console.error('Error listing files:', error);
            throw error;
        }

        if (data.length < pageSize) {
            hasMore = false;
        } else {
            page++;
        }
        allFiles = [...allFiles, ...data];
    }
    return allFiles;
}

async function getUsedImageFilenames() {
    const usedFilenames = new Set();

    // 1. Products (images + variants)
    const { data: products, error: prodError } = await supabase
        .from('products')
        .select('images, variants');

    if (prodError) throw prodError;

    if (products) {
        products.forEach(p => {
            // Main images
            if (Array.isArray(p.images)) {
                p.images.forEach(url => extractFilename(url, usedFilenames));
            }
            // Variant images
            if (Array.isArray(p.variants)) {
                p.variants.forEach(v => {
                    if (Array.isArray(v.images)) {
                        v.images.forEach(url => extractFilename(url, usedFilenames));
                    }
                });
            }
        });
    }

    // 2. Internal Assets
    const { data: assets, error: assetError } = await supabase
        .from('internal_assets')
        .select('images');

    if (assetError) {
        // Table might not exist or permission error, just log warning if so
        console.warn('Could not fetch internal_assets (might be empty or permission issue):', assetError.message);
    } else if (assets) {
        assets.forEach(a => {
            if (Array.isArray(a.images)) {
                a.images.forEach(url => extractFilename(url, usedFilenames));
            }
        });
    }

    // 3. Brand Settings
    const { data: brand, error: brandError } = await supabase
        .from('brand_settings')
        .select('logo_url, hero_image_url, hero_image_mobile_url') // checking columns loosely
        .single();

    if (brand && !brandError) {
        if (brand.logo_url) extractFilename(brand.logo_url, usedFilenames);
        if (brand.hero_image_url) extractFilename(brand.hero_image_url, usedFilenames);
        // ignore errors if column doesn't exist
        if (brand.hero_image_mobile_url) extractFilename(brand.hero_image_mobile_url, usedFilenames);
    }

    return usedFilenames;
}

function extractFilename(url, set) {
    if (!url || typeof url !== 'string') return;
    // URL format: .../storage/v1/object/public/product-images/filename.ext
    // or sometimes just filename if stored relatively (though service stores absolute)

    // We try to match the part after the bucket name
    const parts = url.split(`${BUCKET_NAME}/`);
    if (parts.length > 1) {
        // The part after bucket name is the path/filename
        // It might be URL encoded, but storage.list returns non-encoded names usually?
        // Actually storage names can be anything.
        // Let's decodeURI just in case
        const filename = decodeURIComponent(parts[1]);
        set.add(filename);
    } else {
        // Maybe it's stored as just the filename?
        // Or maybe it's from another bucket?
        // If it doesn't contain bucket name, safe to assume it's not in THIS bucket or handled elsewhere?
        // But for safety, if the user manually put a filename string:
        if (!url.startsWith('http')) {
            set.add(url);
        }
    }
}

async function main() {
    console.log('Starting cleanup...');
    console.log(`Target Bucket: ${BUCKET_NAME}`);

    try {
        const usedFilenames = await getUsedImageFilenames();
        console.log(`Found ${usedFilenames.size} unique used images.`);

        if (usedFilenames.size === 0) {
            console.warn('WARNING: No used images found. This seems suspicious. Aborting to prevent total data loss.');
            // Allow override? No, safety first.
            // But if the store is empty, user might want to clean up.
            // Let's assume if there are products, there should be images.
            // We can check product count.
            const { count } = await supabase.from('products').select('*', { count: 'exact', head: true });
            if (count > 0) {
                process.exit(1);
            } else {
                console.log('Store is empty, proceeding to delete all images.');
            }
        }

        const allFiles = await getAllFiles(BUCKET_NAME);
        console.log(`Found ${allFiles.length} total files in bucket.`);

        const filesToDelete = allFiles.filter(f => !usedFilenames.has(f.name));

        if (filesToDelete.length === 0) {
            console.log('No orphan files found. Cleanup complete.');
            return;
        }

        console.log(`Found ${filesToDelete.length} orphan files to delete.`);
        // console.log('Samples:', filesToDelete.slice(0, 5).map(f => f.name));

        // Delete in chunks of 10 to avoid timeouts
        const CHUNK_SIZE = 10;
        let deletedCount = 0;

        for (let i = 0; i < filesToDelete.length; i += CHUNK_SIZE) {
            const chunk = filesToDelete.slice(i, i + CHUNK_SIZE).map(f => f.name);
            const { error } = await supabase.storage
                .from(BUCKET_NAME)
                .remove(chunk);

            if (error) {
                console.error('Error deleting chunk:', error);
            } else {
                deletedCount += chunk.length;
                process.stdout.write(`\rDeleted ${deletedCount}/${filesToDelete.length} files...`);
            }
        }

        console.log('\nCleanup complete!');

    } catch (err) {
        console.error('Fatal error:', err);
    }
}

main();
