#!/bin/bash

for file in docs/*.md
do
  name=$(basename "$file" .md)

  pandoc "$file" \
    --template=c3field_template.tex \
    -o "pdf/$name.pdf"

done