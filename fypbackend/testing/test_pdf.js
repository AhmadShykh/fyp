const { generatePDFAndUpload } = require('../middleware/pdfGenerator'); // Replace with the actual file name

const testContent = "1. **Strict-Transport-Security Header Not Set**: This issue means that the website does not have a Strict-Transport-Security (HSTS) header set in its response. HSTS is a security mechanism that tells the browser to always use HTTPS for a given domain, which helps prevent man-in-the-middle attacks and SSL stripping. To fix this issue, the website should include the `Strict-Transport-Security` directive in its server configuration.\n    2. **Content Security Policy (CSP) Header Not Set**: Content Security Policy is a security feature that helps prevent cross-site scripting (XSS) and other code injection attacks by specifying allowed sources for various web content types like scripts, images, etc. In this case, the website does not have a CSP header set in its response. To fix this issue, the website should include a properly configured Content Security Policy directive in its server configuration.\n    3. **Permissions Policy Header Not Set**: The Permissions Policy is a security policy that helps protect user data by restricting access to various web APIs based on the source of the request. In this case, the website does not have a Permissions Policy header set in its response. To fix this issue, the website should include the `Permissions-Policy` directive in its server configuration.\n    4. **Misssing Anti-clickjacking Header**: Clickjacking is a technique that tricks users into clicking on hidden or overlapped elements. The Anti-Clickjacking (X-Frame-Options) header helps prevent clickjacking by specifying whether the page can be embedded in a frame, object, or iframe. In this case, the website does not have an appropriate anti-clickjacking header set in its response. To fix this issue, the website should include the `X-Frame-Options` directive in its server configuration with a value of `DENY`, `SAMEORIGIN`, or use Content Security Policy (CSP) to allow framing only for specific origins.\n    5. **X-Content-Type-Options Header Missing**: The X-Content-Type-Options header helps prevent MIME-type sniffing and cross-site scripting (XSS) attacks by specifying that the Content-Type header in the response should not be changed. In this case, the website does not have an `X-Content-Type-Options` header set in its response. To fix this issue, the website should include the `X-Content-Type-Options` directive in its server configuration with a value of `nosniff`.\n    6. **Re-examine Cache-control Directives**: The Cache-Control headers determine how web resources are cached by intermediaries (like proxies and browsers). In this case, the tool suggests re-examining the cache control directives used in the website's response to ensure that they are appropriate. Common issues include allowing public caching of sensitive resources or using inappropriate expiration times for various resources. To fix this issue, review the Cache-Control headers used by the website and make necessary adjustments as needed.\n    7. **Insufficient Site Isolation Against Spectre Vulnerability**: This issue is related to a class of side-channel attacks called Spectre, which can leak sensitive data from a user's browser even if proper isolation mechanisms (like Same-Origin Policy) are in place. In this case, the website does not seem to have implemented sufficient site isolation against these vulnerabilities. To fix this issue, consider using features like Site Isolation for Chrome or enabling the `isolateOrigins` directive in Content Security Policy (CSP).\n    8. **Non-Storable Content**: The tool suggests that certain resources on the website are marked as non-storable content in their Cache-Control headers but are still being served from a cache. This can lead to issues with data consistency and security. To fix this issue, review the Cache-Control headers used by the website for each resource and ensure that they are correctly set to `must-revalidate` or `public, max-age=0` if the content should not be stored in caches.\n    9. **Private IP Disclosure**: This issue suggests that the website may have accidentally revealed a private IP address in its response, which can potentially expose internal network structures and increase attack surface. To fix this issue, review the website's server configuration and response headers to ensure that no sensitive information is being inadvertently disclosed.\n    10. **Absence of Anti-CSRF Tokens**: Cross-Site Request Forgery (CSRF) is a type of attack where an attacker tricks a user into making unintended requests to a website. In this case, the website does not seem to have implemented any anti-CSRF protection mechanisms, such as tokens or tokens with hidden fields. To fix this issue, consider implementing anti-CSRF tokens or other protection mechanisms to help prevent CSRF attacks.\n    11. **Session Fixation**: Session fixation is a type of attack where an attacker is able to obtain a valid session ID and reuse it for further attacks. In this case, the website does not seem to have implemented any measures to protect against session fixation, such as regenerating session IDs upon login or using secure cookies. To fix this issue, consider implementing session management best practices, including regenerating session IDs upon login and using secure cookies with HttpOnly flag and proper expiration times.\n    12. **Leak of Sensitive Data in Log Files**: Log files can potentially contain sensitive information that could be used by attackers to compromise the website or user data. In this case, the tool suggests reviewing log files for any evidence of sensitive data being logged. To fix this issue, consider implementing data masking and anonymization techniques for log files, as well as limiting log retention times and access to log files to only necessary personnel.\n    13. **Leak of Sensitive Data in HTTP Response**: The tool suggests that the website may be leaking sensitive data in its response to clients, potentially exposing user information or internal details. To fix this issue, review the website's server configuration and response headers to ensure that no sensitive information is being unintentionally disclosed.\n    14. **Sensitive Data Exposure via Web Console**: The tool suggests that the website may have exposed sensitive data through its web console or developer tools, potentially exposing user information or internal details. To fix this issue, review the website's server configuration and response headers to ensure that no sensitive information is being unintentionally disclosed.\n    15. **Insecure Direct Object References (IDOR)**: Insecure direct object references occur when an application exposes a URL or API endpoint that allows users to access another user's data directly, bypassing access controls. In this case, the tool suggests reviewing the website for any potential IDOR vulnerabilities. To fix this issue, implement proper access control mechanisms and ensure that objects are not accessible directly through their identifiers.\n    16. **Broken Access Control**: Broken access control occurs when an application allows unauthorized access to sensitive data or functionality. In this case, the tool suggests reviewing the website for any potential broken access control vulnerabilities. To fix this issue, implement proper access control mechanisms and ensure that users can only access resources and perform actions they are authorized to do.\n    17. **Leak of Sensitive Data via Server Error Pages**: Server error pages can potentially contain sensitive information about the application or user data if not properly configured. In this case, the tool suggests reviewing server error pages for any evidence of sensitive data being exposed. To fix this issue, implement proper error handling and ensure that sensitive data is not disclosed in error messages.\n    18. **Weak Passwords**: The tool suggests checking for weak or easily guessable passwords on the website. To fix this issue, enforce strong password policies and consider implementing measures to force users to change their passwords regularly.\n    19. **Insufficient Login Protection**: Insufficient login protection can allow attackers to brute-force or otherwise gain unauthorized access to user accounts. In this case, the tool suggests reviewing the website for any potential insufficient login protection vulnerabilities. To fix this issue, implement measures such as rate limiting, captcha challenges, and account lockouts after a certain number of failed attempts.\n    20. **Leak of Sensitive Data via Server Headers**: The tool suggests that the website may be leaking sensitive data through its server headers, potentially exposing internal details or user information. To fix this issue, review the website's server configuration and response headers to ensure that no sensitive information is being unintentionally disclosed.";


(async () => {
  try {
    console.log("Generating and uploading PDF...");
    const pdfUrl = await generatePDFAndUpload(testContent);
    console.log("PDF uploaded successfully:", pdfUrl);
  } catch (error) {
    console.error("Error:", error);
  }
})();
