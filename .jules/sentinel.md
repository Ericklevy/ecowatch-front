## 2026-10-29 - Client-Side CSV Formula Injection Prevention
**Vulnerability:** Unsanitized dynamic alert strings exported to CSV files could trigger spreadsheet formula execution (`=`, `+`, `-`, `@`, `\t`, `\r`) in Excel / Calc.
**Learning:** Client-side CSV generation directly stringifying API or user-controlled objects without escaping formula prefixes and using `encodeURI` data URIs can expose users to remote formula execution or malformed download links.
**Prevention:** Always sanitize every CSV cell by doubling internal quotes and prefixing potential formula execution characters with a single quote (`'`), and use `Blob` with `URL.createObjectURL` for downloading CSV files.
