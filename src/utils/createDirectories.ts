import fs from 'fs';
import path from 'path';

export function createDirectories() {
    const directories = [path.join(process.cwd(), 'uploads', 'appeals')];

    for (const dir of directories) {
        fs.mkdirSync(dir, { recursive: true });
    }
}
