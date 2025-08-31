# Deployment Guide

## Pre-Deployment Checklist

### Code Quality Gates
- [ ] All TypeScript compilation passes (`npm run build`)
- [ ] ESLint passes with no errors (`npm run lint`)
- [ ] Unit tests pass (`npm run test`)
- [ ] Integration tests pass (`npm run test:integration`)
- [ ] Performance tests pass (`npm run test:performance`)
- [ ] Security scan passes (`npm run security:scan`)

### Asset Validation
- [ ] All textures optimized (max 512x512 for mobile)
- [ ] Audio files compressed (max 1MB per file)
- [ ] JSON configurations validated
- [ ] All assets loaded successfully in staging
- [ ] CDN URLs configured correctly

### Environment Configuration
- [ ] Environment variables set for production
- [ ] API endpoints configured for production
- [ ] Analytics tracking enabled
- [ ] Error reporting configured
- [ ] Performance monitoring enabled

### Browser Compatibility
- [ ] Chrome (latest 2 versions)
- [ ] Firefox (latest 2 versions)
- [ ] Safari (latest 2 versions)
- [ ] Edge (latest 2 versions)
- [ ] Mobile browsers (iOS Safari, Chrome Android)

## Deployment Environments

### Development Environment
```bash
# Local development
npm run dev
# Access at: http://localhost:3000
```

### Staging Environment
```bash
# Deploy to staging
npm run deploy:staging
# Access at: https://staging.mamba-kick.game
```

### Production Environment
```bash
# Deploy to production
npm run deploy:production
# Access at: https://mamba-kick.game
```

## Build Process

### Build Configuration
```typescript
// webpack.config.js
const config = {
  mode: 'production',
  optimization: {
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
        },
        phaser: {
          test: /[\\/]node_modules[\\/]phaser[\\/]/,
          name: 'phaser',
          chunks: 'all',
        },
      },
    },
  },
  plugins: [
    new CompressionPlugin({
      algorithm: 'gzip',
      test: /\.(js|css|html|svg)$/,
      threshold: 8192,
      minRatio: 0.8,
    }),
  ],
};
```

### Build Commands
```bash
# Clean build directory
npm run clean

# Build for production
npm run build:prod

# Generate source maps
npm run build:sourcemaps

# Build with bundle analyzer
npm run build:analyze
```

## Asset Optimization

### Image Optimization
```bash
# Optimize images
npm run optimize:images

# Generate responsive images
npm run generate:responsive

# Create WebP versions
npm run generate:webp
```

### Audio Optimization
```bash
# Compress audio files
npm run compress:audio

# Generate multiple formats
npm run generate:audio-formats
```

### Bundle Optimization
```typescript
// Lazy loading for large assets
const loadLevel = async (levelId: string) => {
  const level = await import(`./levels/${levelId}`);
  return level.default;
};

// Code splitting for features
const loadParticleSystem = () => 
  import('./systems/ParticleSystem');
```

## CDN Configuration

### CloudFront Configuration
```json
{
  "Origins": [
    {
      "DomainName": "mamba-kick-game.s3.amazonaws.com",
      "Id": "S3-mamba-kick-game",
      "S3OriginConfig": {
        "OriginAccessIdentity": ""
      }
    }
  ],
  "DefaultCacheBehavior": {
    "TargetOriginId": "S3-mamba-kick-game",
    "ViewerProtocolPolicy": "redirect-to-https",
    "AllowedMethods": ["GET", "HEAD"],
    "CachedMethods": ["GET", "HEAD"],
    "Compress": true,
    "ForwardedValues": {
      "QueryString": false,
      "Cookies": { "Forward": "none" }
    }
  }
}
```

### Cache Headers
```nginx
# nginx.conf
location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
  expires 1y;
  add_header Cache-Control "public, immutable";
}

location ~* \.(html)$ {
  expires 1h;
  add_header Cache-Control "public, no-cache";
}
```

## Database Deployment

### Neon Database Migration
```bash
# Deploy database changes
npm run db:migrate:production

# Verify migration
npm run db:verify:production

# Create backup before migration
npm run db:backup:production
```

### Database Configuration
```typescript
// production.config.ts
export const dbConfig = {
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  },
  pool: {
    min: 2,
    max: 10,
    acquireTimeoutMillis: 60000,
    idleTimeoutMillis: 30000
  }
};
```

## Monitoring Setup

### Performance Monitoring
```typescript
// monitoring.ts
import * as Sentry from '@sentry/react';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: 'production',
  tracesSampleRate: 0.1,
  integrations: [
    new Sentry.BrowserTracing({
      tracePropagationTargets: ['mamba-kick.game'],
    }),
  ],
});
```

### Analytics Configuration
```typescript
// analytics.ts
import { Analytics } from '@segment/analytics-next';

export const analytics = new Analytics({
  writeKey: process.env.SEGMENT_WRITE_KEY,
  cdnURL: 'https://cdn.segment.com',
});

// Track game events
analytics.track('Game Started', {
  level: 1,
  device: navigator.userAgent,
});
```

### Health Checks
```typescript
// health-check.ts
export const healthCheck = async (): Promise<boolean> => {
  try {
    const response = await fetch('/api/health');
    const data = await response.json();
    
    return data.status === 'healthy';
  } catch (error) {
    console.error('Health check failed:', error);
    return false;
  }
};
```

## Rollback Procedures

### Automatic Rollback Triggers
- Error rate > 5%
- Performance degradation > 20%
- Database connection failures
- CDN availability < 99%

### Rollback Commands
```bash
# Quick rollback
npm run rollback:production

# Rollback to specific version
npm run rollback:production -- --version=v1.2.3

# Database rollback
npm run db:rollback:production -- --steps=1
```

### Rollback Checklist
- [ ] Notify team via Slack
- [ ] Update status page
- [ ] Monitor error rates
- [ ] Verify rollback success
- [ ] Post-mortem scheduled

## Security Configuration

### HTTPS Configuration
```nginx
# nginx-ssl.conf
server {
  listen 443 ssl http2;
  server_name mamba-kick.game;
  
  ssl_certificate /etc/ssl/certs/mamba-kick.crt;
  ssl_certificate_key /etc/ssl/private/mamba-kick.key;
  ssl_protocols TLSv1.2 TLSv1.3;
  ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512;
  ssl_prefer_server_ciphers off;
  
  add_header Strict-Transport-Security "max-age=63072000" always;
}
```

### Security Headers
```nginx
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-Content-Type-Options "nosniff" always;
add_header X-XSS-Protection "1; mode=block" always;
add_header Referrer-Policy "strict-origin-when-cross-origin" always;
```

### Content Security Policy
```nginx
add_header Content-Security-Policy "
  default-src 'self';
  script-src 'self' 'unsafe-inline' https://cdn.segment.com https://js.sentry-cdn.com;
  style-src 'self' 'unsafe-inline';
  img-src 'self' data: https:;
  font-src 'self';
  connect-src 'self' https://api.segment.io https://sentry.io;
" always;
```

## Environment Variables

### Production Environment Variables
```bash
# .env.production
NODE_ENV=production
DATABASE_URL=postgresql://...
SENTRY_DSN=https://...
SEGMENT_WRITE_KEY=...
CDN_URL=https://cdn.mamba-kick.game
API_URL=https://api.mamba-kick.game
GAME_VERSION=1.0.0
```

### Environment Validation
```typescript
// validate-env.ts
const requiredEnvVars = [
  'DATABASE_URL',
  'SENTRY_DSN',
  'SEGMENT_WRITE_KEY',
  'CDN_URL',
  'API_URL'
];

requiredEnvVars.forEach(envVar => {
  if (!process.env[envVar]) {
    throw new Error(`Missing required environment variable: ${envVar}`);
  }
});
```

## Testing in Production

### Smoke Tests
```typescript
// smoke-tests.ts
describe('Production Smoke Tests', () => {
  it('should load the game', async () => {
    await page.goto('https://mamba-kick.game');
    await expect(page).toHaveSelector('#game-container');
  });

  it('should start the game', async () => {
    await page.click('#start-button');
    await expect(page).toHaveSelector('.game-canvas');
  });

  it('should save progress', async () => {
    await page.evaluate(() => {
      localStorage.setItem('test-save', JSON.stringify({ level: 5 }));
    });
    
    await page.reload();
    const saveData = await page.evaluate(() => 
      localStorage.getItem('test-save')
    );
    
    expect(JSON.parse(saveData).level).toBe(5);
  });
});
```

### Load Testing
```bash
# Run load tests
npm run test:load

# Monitor during load test
npm run monitor:load
```

## Deployment Automation

### GitHub Actions Workflow
```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    tags:
      - 'v*'

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run tests
        run: |
          npm run test
          npm run test:integration
          npm run test:performance
      
      - name: Build application
        run: npm run build:prod
      
      - name: Deploy to S3
        run: |
          aws s3 sync dist/ s3://mamba-kick-game/ --delete
      
      - name: Invalidate CloudFront
        run: |
          aws cloudfront create-invalidation \
            --distribution-id ${{ secrets.CLOUDFRONT_DISTRIBUTION_ID }} \
            --paths "/*"
```

### Deployment Scripts
```json
// package.json
{
  "scripts": {
    "deploy:staging": "npm run build:staging && npm run upload:staging",
    "deploy:production": "npm run build:prod && npm run upload:production",
    "upload:staging": "aws s3 sync dist/ s3://mamba-kick-staging/",
    "upload:production": "aws s3 sync dist/ s3://mamba-kick-game/",
    "invalidate:staging": "aws cloudfront create-invalidation --distribution-id E1234567890 --paths '/*'",
    "invalidate:production": "aws cloudfront create-invalidation --distribution-id E0987654321 --paths '/*'"
  }
}
```

## Post-Deployment

### Verification Steps
1. **Health Check**: `curl https://mamba-kick.game/api/health`
2. **Version Check**: Verify version in footer
3. **Feature Test**: Test core game features
4. **Performance Check**: Verify <100ms API response times
5. **Error Check**: Monitor Sentry for new errors

### Monitoring Dashboard
Access the monitoring dashboard at:
- **Sentry**: https://sentry.io/organizations/mamba-kick/projects/mamba-kick/
- **Datadog**: https://app.datadoghq.com/dashboard/mamba-kick
- **Status Page**: https://status.mamba-kick.game

### Communication
- **Team**: Post in #deployments Slack channel
- **Users**: Update @mambakickgame Twitter
- **Status**: Update status.mamba-kick.game

---

**Deployment Owner**: DevOps Team  
**Last Updated**: [Current Date]  
**Next Review**: [Weekly Review Date]  
**Emergency Contact**: [24/7 On-call Number]