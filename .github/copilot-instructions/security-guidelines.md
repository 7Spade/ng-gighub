# Security Guidelines

Security best practices and guidelines for the ng-gighub Angular project.

## Core Security Principles

1. **Never commit secrets** - No API keys, passwords, tokens, or credentials in code
2. **Validate all inputs** - Sanitize and validate user input on both client and server
3. **Principle of least privilege** - Grant minimum necessary permissions
4. **Defense in depth** - Multiple layers of security controls
5. **Keep dependencies updated** - Regularly update packages to patch vulnerabilities

## Secrets Management

### Environment Variables
- Use `.env` files for local development (never commit `.env` files)
- Use `.env.example` as a template (safe to commit)
- Access via `process.env` in Node.js code
- Use GitHub Secrets for CI/CD

```typescript
// Good
const apiKey = process.env['SUPABASE_KEY'];

// Bad - Never do this
const apiKey = 'sk_live_abc123xyz';
```

### Supabase Credentials
- Store Supabase URL and anon key in environment variables
- Use Row Level Security (RLS) policies in Supabase
- Never expose service role key in client-side code
- Rotate keys if compromised

## Input Validation & Sanitization

### Client-Side Validation
```typescript
import { DomSanitizer } from '@angular/platform-browser';

constructor(private sanitizer: DomSanitizer) {}

// Sanitize user input before rendering
safeHtml = this.sanitizer.sanitize(SecurityContext.HTML, userInput);
```

### Form Validation
- Use Angular's built-in validators
- Implement custom validators for business rules
- Validate on both client and server side

```typescript
this.form = this.fb.group({
  email: ['', [Validators.required, Validators.email]],
  password: ['', [Validators.required, Validators.minLength(8)]]
});
```

## Authentication & Authorization

### Supabase Auth
- Use Supabase Auth for user authentication
- Implement proper session management
- Use JWT tokens securely
- Implement token refresh logic

```typescript
// Check authentication status
const session = await this.supabase.auth.getSession();
if (!session) {
  // Redirect to login
}
```

### Route Guards
```typescript
@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(): Observable<boolean> {
    return this.authService.isAuthenticated();
  }
}
```

## XSS Prevention

### Template Security
- Angular sanitizes templates by default
- Avoid `bypassSecurityTrust*` methods unless absolutely necessary
- Never use `innerHTML` with user content
- Use Angular's property binding

```typescript
// Safe - Angular sanitizes automatically
<div>{{ userInput }}</div>

// Unsafe - Avoid
<div [innerHTML]="userInput"></div>

// If you must use innerHTML, sanitize first
<div [innerHTML]="sanitizedContent"></div>
```

## CSRF Protection

### HTTP Security
- Angular's HttpClient includes CSRF protection
- Verify CSRF tokens on server side
- Use appropriate HTTP methods (GET for reads, POST/PUT/DELETE for writes)

```typescript
// HttpClient automatically handles CSRF tokens
this.http.post('/api/data', payload);
```

## Dependency Security

### Package Management
```bash
# Audit dependencies for vulnerabilities
npm audit

# Fix vulnerabilities automatically
npm audit fix

# Update dependencies
npm update
```

### Dependabot
- Enable Dependabot in GitHub settings
- Review and merge security updates promptly
- Configure `.github/dependabot.yml` for automated updates

## Secure Communication

### HTTPS Only
- Always use HTTPS in production
- Redirect HTTP to HTTPS
- Use secure cookies (`Secure` and `HttpOnly` flags)

### API Security
- Use CORS properly
- Implement rate limiting
- Use API keys or OAuth tokens
- Validate API responses

## Data Protection

### Sensitive Data Handling
- Never log sensitive data (passwords, tokens, PII)
- Encrypt sensitive data at rest
- Use secure transmission (TLS/SSL)
- Implement data retention policies

```typescript
// Bad - Don't log sensitive data
console.log('Password:', user.password);

// Good - Log sanitized data
console.log('User authenticated:', user.id);
```

### Supabase Storage
- Set appropriate bucket policies
- Use signed URLs for private files
- Implement file size and type restrictions
- Scan uploaded files for malware if necessary

```typescript
// Check file type before upload
const allowedTypes = ['image/jpeg', 'image/png'];
if (!allowedTypes.includes(file.type)) {
  throw new Error('Invalid file type');
}
```

## Error Handling

### Secure Error Messages
- Don't expose sensitive information in error messages
- Log detailed errors server-side
- Show generic messages to users

```typescript
// Bad
throw new Error('Database connection failed at db.company.internal:5432');

// Good
throw new Error('An error occurred. Please try again.');
// Log detailed error server-side for debugging
```

## Code Review Security Checklist

Before merging code, verify:
- [ ] No hardcoded secrets or credentials
- [ ] Input validation implemented
- [ ] Proper error handling (no sensitive data exposure)
- [ ] Authentication/authorization checks in place
- [ ] Dependencies are up-to-date
- [ ] HTTPS used for all external requests
- [ ] User data is sanitized before rendering
- [ ] SQL injection prevention (if applicable)
- [ ] CSRF protection enabled
- [ ] Security headers configured

## SSR Security Considerations

### Server-Side Rendering
- Validate environment on server side
- Don't expose server-side secrets to client
- Sanitize data before sending to client
- Use platform checks for browser-only APIs

```typescript
import { isPlatformBrowser } from '@angular/common';

if (isPlatformBrowser(this.platformId)) {
  // Browser-only code
  localStorage.setItem('key', 'value');
}
```

## Incident Response

### If Security Issue Discovered
1. **Don't commit the issue** to public repositories
2. **Report via SECURITY.md** procedure
3. **Document the issue** privately
4. **Create a patch** and test thoroughly
5. **Notify affected users** if data was compromised
6. **Rotate credentials** if exposed
7. **Post-mortem analysis** to prevent recurrence

## Security Tools

### Recommended Tools
- `npm audit` - Dependency vulnerability scanning
- ESLint security plugins - Static code analysis
- SonarQube - Code quality and security
- OWASP ZAP - Security testing
- Snyk - Continuous security monitoring

### GitHub Security Features
- Dependabot alerts
- Secret scanning
- Code scanning (CodeQL)
- Security policy (SECURITY.md)

## Compliance

### Data Protection
- Follow GDPR guidelines if handling EU user data
- Implement proper consent mechanisms
- Provide data export/deletion functionality
- Document data processing activities

## Training & Awareness

- Stay updated on OWASP Top 10
- Participate in security training
- Review security advisories regularly
- Share security knowledge with team

## Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Angular Security Guide](https://angular.dev/best-practices/security)
- [Supabase Security Best Practices](https://supabase.com/docs/guides/security)
- [npm Security Best Practices](https://docs.npmjs.com/security-best-practices)
