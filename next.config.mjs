import nextra from 'nextra'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

// Set up Nextra with its configuration
const withNextra = nextra({
    // ... Add Nextra-specific options here
})

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const nextConfig = {
    // Keep dev/build artifacts isolated to avoid cache corruption
    // when both commands are run on the same machine.
    ...(process.env.NEXT_DIST_DIR ? { distDir: process.env.NEXT_DIST_DIR } : {}),
    // Force Next.js to treat this repository as the tracing root, even when
    // parent directories contain other lockfiles.
    outputFileTracingRoot: __dirname
}

// Export the final Next.js config with Nextra included
export default withNextra(nextConfig)
