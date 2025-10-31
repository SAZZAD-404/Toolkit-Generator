// Script to sync all files from GitHub repository to Supabase database
import { createClient } from '@supabase/supabase-js';
import fetch from 'node-fetch';

// Configuration
const GITHUB_TOKEN = process.env.GITHUB_TOKEN || 'YOUR_GITHUB_TOKEN_HERE';
const GITHUB_USERNAME = 'SAZZAD-404';
const GITHUB_REPO = 'Toolkit-Generator';
const GITHUB_BRANCH = 'main';

// Supabase configuration
const SUPABASE_URL = 'https://ajapwfzkhjukfokwxpks.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFqYXB3ZnpraGp1a2Zva3d4cGtzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE5MzE1OTYsImV4cCI6MjA3NzUwNzU5Nn0.BAuilK_6KaFb2Pk9JkUDOHx7Co5c_sgQ2KfgPn_uQEg';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// File extensions to include (add more as needed)
const ALLOWED_EXTENSIONS = [
    '.js', '.jsx', '.ts', '.tsx',
    '.css', '.scss', '.sass', '.less',
    '.html', '.htm',
    '.json', '.jsonc',
    '.md', '.mdx',
    '.yml', '.yaml',
    '.xml', '.svg',
    '.txt', '.env.example',
    '.sql', '.graphql',
    '.sh', '.bat', '.ps1'
];

// Folders to exclude
const EXCLUDED_FOLDERS = ['node_modules', '.git', 'dist', 'build', '.next', 'coverage', '.vscode', '.idea'];

async function getGitHubTree() {
    const url = `https://api.github.com/repos/${GITHUB_USERNAME}/${GITHUB_REPO}/git/trees/${GITHUB_BRANCH}?recursive=1`;

    const response = await fetch(url, {
        headers: {
            'Authorization': `Bearer ${GITHUB_TOKEN}`,
            'Accept': 'application/vnd.github.v3+json',
        }
    });

    if (!response.ok) {
        throw new Error(`GitHub API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.tree;
}

async function getFileContent(filePath) {
    const url = `https://raw.githubusercontent.com/${GITHUB_USERNAME}/${GITHUB_REPO}/${GITHUB_BRANCH}/${filePath}`;

    const response = await fetch(url, {
        headers: {
            'Authorization': `Bearer ${GITHUB_TOKEN}`,
        }
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch file: ${filePath}`);
    }

    return await response.text();
}

function getFileType(fileName) {
    const ext = fileName.split('.').pop().toLowerCase();
    const typeMap = {
        'js': 'javascript',
        'jsx': 'javascript',
        'ts': 'typescript',
        'tsx': 'typescript',
        'css': 'css',
        'scss': 'scss',
        'sass': 'sass',
        'less': 'less',
        'html': 'html',
        'htm': 'html',
        'json': 'json',
        'jsonc': 'json',
        'md': 'markdown',
        'mdx': 'markdown',
        'yml': 'yaml',
        'yaml': 'yaml',
        'xml': 'xml',
        'svg': 'xml',
        'sql': 'sql',
        'graphql': 'graphql',
        'sh': 'shell',
        'bat': 'bat',
        'ps1': 'powershell',
    };
    return typeMap[ext] || 'plaintext';
}

function shouldIncludeFile(filePath) {
    // Check if file has allowed extension
    const hasAllowedExt = ALLOWED_EXTENSIONS.some(ext => filePath.endsWith(ext));
    if (!hasAllowedExt) return false;

    // Check if file is in excluded folder
    const isExcluded = EXCLUDED_FOLDERS.some(folder =>
        filePath.includes(`${folder}/`) || filePath.startsWith(`${folder}/`)
    );

    return !isExcluded;
}

async function syncFiles() {
    console.log('🚀 Starting GitHub to Supabase sync...\n');

    try {
        // Get all files from GitHub
        console.log('📥 Fetching file tree from GitHub...');
        const tree = await getGitHubTree();

        // Filter files
        const files = tree.filter(item =>
            item.type === 'blob' && shouldIncludeFile(item.path)
        );

        console.log(`✅ Found ${files.length} files to sync\n`);

        let successCount = 0;
        let errorCount = 0;

        // Process each file
        for (const file of files) {
            try {
                console.log(`📄 Processing: ${file.path}`);

                // Get file content
                const content = await getFileContent(file.path);

                // Extract file name
                const fileName = file.path.split('/').pop();
                const fileType = getFileType(fileName);

                // Check if file already exists in database
                const { data: existing } = await supabase
                    .from('code_files')
                    .select('id')
                    .eq('file_path', file.path)
                    .single();

                if (existing) {
                    // Update existing file
                    const { error } = await supabase
                        .from('code_files')
                        .update({
                            file_content: content,
                            file_type: fileType,
                            updated_by: 'sync-script',
                        })
                        .eq('id', existing.id);

                    if (error) throw error;
                    console.log(`   ✅ Updated\n`);
                } else {
                    // Insert new file
                    const { error } = await supabase
                        .from('code_files')
                        .insert({
                            file_name: fileName,
                            file_path: file.path,
                            file_type: fileType,
                            file_content: content,
                            updated_by: 'sync-script',
                        });

                    if (error) throw error;
                    console.log(`   ✅ Added\n`);
                }

                successCount++;

                // Small delay to avoid rate limiting
                await new Promise(resolve => setTimeout(resolve, 100));

            } catch (error) {
                console.error(`   ❌ Error: ${error.message}\n`);
                errorCount++;
            }
        }

        console.log('\n' + '='.repeat(50));
        console.log('📊 Sync Summary:');
        console.log(`   ✅ Success: ${successCount}`);
        console.log(`   ❌ Errors: ${errorCount}`);
        console.log(`   📁 Total: ${files.length}`);
        console.log('='.repeat(50));
        console.log('\n✨ Sync completed!');

    } catch (error) {
        console.error('\n❌ Fatal error:', error.message);
        process.exit(1);
    }
}

// Run the sync
syncFiles();
