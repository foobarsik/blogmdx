import nextra from 'nextra'

// Set up Nextra with its configuration
const withNextra = nextra({
    // ... Add Nextra-specific options here
})

const nextConfig = {
    // Keep dev/build artifacts isolated to avoid cache corruption
    // when both commands are run on the same machine.
    ...(process.env.NEXT_DIST_DIR ? { distDir: process.env.NEXT_DIST_DIR } : {})
}

// Export the final Next.js config with Nextra included
export default withNextra(nextConfig)
