/**
 * Environment variable validation
 * This ensures all required environment variables are present before the app starts
 */

const requiredEnvVars = [
  'MONGODB_URI',
  'PORT',
] as const;

const optionalEnvVars = [
  'ADMIN_PASSWORD',
  'AUTO_SEED',
  'NODE_ENV',
] as const;

export function validateEnv(): void {
  const missing: string[] = [];
  const warnings: string[] = [];

  // Check required variables
  for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
      missing.push(envVar);
    }
  }

  // Check if using default values for sensitive variables
  if (!process.env.JWT_SECRET) {
    warnings.push('JWT_SECRET is not set. Using default value.');
  } else if (process.env.JWT_SECRET === 'your-secret-key-change-in-production') {
    warnings.push('JWT_SECRET is using the default value. Please change it in production!');
  }

  if (process.env.ADMIN_PASSWORD === 'admin123') {
    warnings.push('ADMIN_PASSWORD is using the default value. Please change it in production!');
  }

  if (process.env.MONGODB_URI?.includes('username:password')) {
    warnings.push('MONGODB_URI appears to be using placeholder values. Please update it!');
  }

  // Report results
  if (missing.length > 0) {
    console.error('\n❌ Missing required environment variables:');
    missing.forEach(v => console.error(`   - ${v}`));
    console.error('\n📝 Please copy .env.example to .env and fill in the values.\n');
    process.exit(1);
  }

  if (warnings.length > 0 && process.env.NODE_ENV === 'production') {
    console.warn('\n⚠️  Environment warnings:');
    warnings.forEach(w => console.warn(`   - ${w}`));
    console.warn('');
  }

  // Display optional variables status
  console.log('✅ Environment variables validated');
  if (process.env.NODE_ENV === 'development') {
    console.log(`   MongoDB: ${process.env.MONGODB_URI ? '✓' : '✗'}`);
    console.log(`   JWT Secret: ${process.env.JWT_SECRET ? '✓' : '✗'}`);
    console.log(`   Port: ${process.env.PORT || '5000'}`);
    console.log(`   Auto-seed: ${process.env.AUTO_SEED === 'true' ? 'enabled' : 'disabled'}\n`);
  }
}
