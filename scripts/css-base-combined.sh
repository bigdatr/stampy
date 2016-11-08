#!/usr/bin/env sh
mkdir -p lib &&                                                 \
find src -name '*-base.scss' |                                  \
xargs cat > lib/base.scss &&                                    \
node-sass --output-style compact lib/base.scss lib/base.css
