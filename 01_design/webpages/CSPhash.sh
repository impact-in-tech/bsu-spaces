#

# content security policy hash computation
APP_HASH=$(echo -n "$(cat app.js)" | openssl sha256 -binary | openssl base64)
echo "app: sha256-$APP_HASH"
url=http://127.0.0.1:8088/gdrive/blocksmith/Spaces/01_design/webpages/app.js
APP_HASH=$(curl -s "$url" | openssl sha256 -binary | openssl base64)
echo "app: sha256-$APP_HASH"

# display SRI script tag
url=https://cdn.jsdelivr.net/npm/dompurify@3.0.5/dist/purify.min.js
PURIFY_HASH=$(curl -s "$url" | openssl sha256 -binary | openssl base64)
echo "purify: sha256-$PURIFY_HASH"

cat <<EOT
<!-- CSP -->
<meta http-equiv="Content-Security-Policy" content="
  script-src 'self' 'sha256-${APP_HASH}' 'sha256-${PURIFY_HASH}';
  ...">

<!-- SRI -->
<script src="$url"
  integrity="sha256-${PURIFY_HASH}"
  crossorigin="anonymous"></script>

<script src="app.js"
  integrity="sha256-${APP_HASH}"
  crossorigin="anonymous"></script>

EOT





