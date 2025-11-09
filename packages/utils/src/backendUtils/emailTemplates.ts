export function escapeHTML(s: string): string {
  return s.replace(/[&<>"']/g, (c) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  }[c]!));
}

export function otpEmailHTML(otp: string, email: string, validitySeconds = 90): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>DevArena Login Code</title>
</head>
<body style="margin:0; padding:0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; background:#f9fafb;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f9fafb; padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:500px; background:white; border-radius:8px; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
          <tr>
            <td style="padding:40px 30px;">
              <h2 style="margin:0 0 20px 0; color:#111827; font-size:24px; font-weight:600;">Your DevArena Login Code</h2>
              <p style="margin:0 0 15px 0; color:#374151; font-size:16px; line-height:24px;">Hello,</p>
              <p style="margin:0 0 20px 0; color:#374151; font-size:16px; line-height:24px;">
                Use the code below to sign in as <strong>${escapeHTML(email)}</strong>:
              </p>
              <div style="background:#f3f4f6; border-radius:8px; padding:20px; text-align:center; margin:0 0 20px 0;">
                <div style="font-size:32px; font-weight:700; letter-spacing:8px; color:#111827; font-family: 'Courier New', monospace;">
                  ${escapeHTML(otp)}
                </div>
              </div>
              <p style="margin:0 0 10px 0; color:#6b7280; font-size:14px; line-height:20px;">
                ⏱️ This code expires in <strong>${validitySeconds} seconds</strong>
              </p>
              <p style="margin:0 0 20px 0; color:#6b7280; font-size:14px; line-height:20px;">
                🔒 For security reasons, this code can only be used once
              </p>
              <div style="border-top:1px solid #e5e7eb; padding-top:20px; margin-top:30px;">
                <p style="margin:0 0 10px 0; color:#9ca3af; font-size:13px; line-height:18px;">
                  If you didn't request this code, you can safely ignore this email. Someone may have typed your email address by mistake.
                </p>
                <p style="margin:0; color:#9ca3af; font-size:12px; text-align:center;">
                  © ${new Date().getFullYear()} DevArena. All rights reserved.
                </p>
              </div>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}