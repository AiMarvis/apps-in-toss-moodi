#!/bin/bash
# moodi 프로젝트를 OneDrive 외부로 복사하는 스크립트
# OneDrive Files On-Demand 문제를 우회하기 위함

set -e

SOURCE="/Users/innerbuilder/Library/CloudStorage/OneDrive-개인/antigravityproject/apps-in-toss-project/moodi"
TARGET="$HOME/Projects/moodi-local"

echo "📁 프로젝트를 로컬로 복사합니다..."
echo "   소스: $SOURCE"
echo "   대상: $TARGET"
echo ""

# Projects 디렉토리 생성
mkdir -p "$HOME/Projects"

# 기존 대상 폴더가 있으면 삭제할지 물어봄
if [ -d "$TARGET" ]; then
    echo "⚠️  $TARGET 폴더가 이미 존재합니다."
    read -p "삭제하고 다시 복사할까요? (y/n): " confirm
    if [ "$confirm" = "y" ] || [ "$confirm" = "Y" ]; then
        rm -rf "$TARGET"
    else
        echo "취소됨"
        exit 1
    fi
fi

# node_modules.nosync 제외하고 복사 (나중에 npm install로 새로 설치)
echo "📦 파일 복사 중... (node_modules 제외)"
rsync -av --progress "$SOURCE/" "$TARGET/" \
    --exclude 'node_modules.nosync' \
    --exclude 'node_modules' \
    --exclude 'dist.nosync' \
    --exclude 'dist' \
    --exclude '.granite.nosync' \
    --exclude '.granite'

echo ""
echo "📦 npm install 실행 중..."
cd "$TARGET"
npm install

echo ""
echo "✅ 완료!"
echo ""
echo "다음 명령어로 개발 서버를 실행하세요:"
echo "   cd $TARGET"
echo "   npm run dev:simple"
echo ""
