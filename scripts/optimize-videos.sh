#!/bin/bash
# Script utilitário para otimizar vídeos do HeroFlowCarousel para Web
# Garante compressão H.264 (baseline/main), redução de tamanho, 
# fast-start ativado e remoção de áudio (-an) quando necessário.

mkdir -p public/videos/optimized

echo "Iniciando otimização dos vídeos em public/videos/..."

for file in public/videos/*.mp4; do
  if [ -f "$file" ]; then
    filename=$(basename "$file")
    echo "========================================="
    echo "Otimizando: $filename"
    echo "========================================="
    
    # -c:v libx264: codec H.264
    # -profile:v main: profile main para compatibilidade e boa compressão
    # -crf 26: Constant Rate Factor (23 a 28 é recomendado, 26 é bem leve)
    # -movflags +faststart: move o moov atom para o início, permitindo reprodução instantânea na web
    # -vf "scale=-2:720": redimensiona altura para 720p mantendo aspecto
    # -an: remove faixa de áudio (ótimo para vídeos hero mudos)
    
    ffmpeg -i "$file" \
      -c:v libx264 -profile:v main -crf 26 \
      -movflags +faststart \
      -vf "scale=-2:720" \
      -an \
      "public/videos/optimized/$filename"
      
    echo "Concluído: $filename"
  fi
done

echo "========================================="
echo "Otimização concluída! Os vídeos otimizados estão em public/videos/optimized/"
echo "Lembre-se de substituir os arquivos originais pelos otimizados ou atualizar os caminhos no código."
