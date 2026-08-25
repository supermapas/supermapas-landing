from pathlib import Path

CSS = Path('public/_next/static/chunks/06-3g1k36rw0y.css')

css = CSS.read_text(encoding='utf-8')
original_size = len(css.encode('utf-8'))

landing_marker = '.sm-sales-shell{'
landing_start = css.find(landing_marker)
if landing_start < 0:
    raise SystemExit('landing CSS marker not found')

font_marker = '.manrope_9e067a5b-module__vT7MWq__variable'
font_start = css.find(font_marker)
if font_start < 0:
    raise SystemExit('Manrope variable marker not found')
font_end = css.find('}', font_start)
if font_end < 0:
    raise SystemExit('Manrope variable rule is malformed')
font_end += 1

foundation = css[:font_end]
reset = (
    '*{box-sizing:border-box}'
    'html{background:#fff}'
    'body{-webkit-font-smoothing:antialiased;margin:0;font-family:var(--font-manrope),Manrope,Arial,sans-serif}'
    'a{color:inherit;text-decoration:none}'
    'button,input,select,textarea{font:inherit}'
    'button,a{-webkit-tap-highlight-color:transparent}'
)
landing = css[landing_start:]
trimmed = foundation + '\n' + reset + '\n' + landing

checks = {
    'landing shell': '.sm-sales-shell{' in trimmed,
    'desktop hero': '.sm-desktop-hero{' in trimmed,
    'mobile hero': '.sm-mobile-hero{' in trimmed,
    'format section': '.sm-format-v2{' in trimmed,
    'section navigation': '.sm-section-nav' in trimmed,
    'creator section': '.sm-creators{' in trimmed,
    'faq section': '.sm-faq-modern{' in trimmed,
    'Manrope font': '@font-face{font-family:Manrope' in trimmed,
    'Manrope variable': font_marker in trimmed,
    'generic auth removed': '.auth-shell{' not in trimmed,
    'generic dashboard removed': '.dashboard-page' not in trimmed,
    'generic editor removed': '.editor-page' not in trimmed,
    'generic billing removed': '.billing-page' not in trimmed,
    'generic library removed': '.library-page' not in trimmed,
}
failed = [name for name, ok in checks.items() if not ok]
if failed:
    raise SystemExit('CSS trim validation failed: ' + ', '.join(failed))

new_size = len(trimmed.encode('utf-8'))
if new_size >= original_size * 0.78:
    raise SystemExit(f'CSS reduction too small: {original_size} -> {new_size}')
if new_size < 20000:
    raise SystemExit(f'CSS unexpectedly small after trim: {new_size}')

CSS.write_text(trimmed, encoding='utf-8')
print(f'Trimmed landing CSS: {original_size} -> {new_size} bytes ({100 - (new_size/original_size*100):.1f}% reduction)')
