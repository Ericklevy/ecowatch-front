## 2026-10-26 - CSV Formula Injection in Report Downloads
**Vulnerability:** User-controlled content (alert messages) exported to CSV files could begin with formula characters (`=`, `+`, `-`, `@`, `\t`, `\r`), triggering arbitrary command/formula execution when opened in Excel.
**Learning:** CSV export features that construct CSV strings manually using unescaped string fields are vulnerable to CSV Formula Injection.
**Prevention:** Always sanitize CSV fields by prepending a single quote `'` if the field starts with `=, +, -, @, \t, \r`, and wrap fields in quotes with inner quotes doubled.
