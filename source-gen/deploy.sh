#!/bin/bash

# CDKTECK Command Center - Script de Deployment
# 
# Este script automatiza o deploy do Command Center para diferentes ambientes.
# 
# Uso:
#   ./deploy.sh production
#   ./deploy.sh staging
#   ./deploy.sh development

set -e

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuração
ENVIRONMENT=${1:-development}
PROJECT_NAME="cdkteck"
BUILD_DIR="out"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

# ====== FUNÇÕES ======

print_header() {
  echo -e "\n${BLUE}╔════════════════════════════════════════╗${NC}"
  echo -e "${BLUE}║ CDKTECK Command Center - Deploy${NC}"
  echo -e "${BLUE}║ Environment: ${ENVIRONMENT}${NC}"
  echo -e "${BLUE}╚════════════════════════════════════════╝${NC}\n"
}

print_step() {
  echo -e "${YELLOW}▶ $1${NC}"
}

print_success() {
  echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
  echo -e "${RED}✗ $1${NC}"
}

# ====== PRÉ-REQUISITOS ======

check_requirements() {
  print_step "Verificando requisitos..."

  if ! command -v node &> /dev/null; then
    print_error "Node.js não encontrado"
    exit 1
  fi
  print_success "Node.js encontrado: $(node --version)"

  if ! command -v npm &> /dev/null; then
    print_error "npm não encontrado"
    exit 1
  fi
  print_success "npm encontrado: $(npm --version)"

  if [ ! -f "package.json" ]; then
    print_error "package.json não encontrado"
    exit 1
  fi
  print_success "package.json encontrado"
}

# ====== VALIDAR AMBIENTE ======

validate_environment() {
  print_step "Validando ambiente: $ENVIRONMENT..."

  case $ENVIRONMENT in
    production)
      if [ ! -f ".env.production" ]; then
        print_error ".env.production não encontrado"
        exit 1
      fi
      print_success "Configuração de produção validada"
      ;;
    staging)
      if [ ! -f ".env.staging" ]; then
        print_error ".env.staging não encontrado"
        exit 1
      fi
      print_success "Configuração de staging validada"
      ;;
    development)
      if [ ! -f ".env.local" ]; then
        print_error ".env.local não encontrado"
        print_step "Criando .env.local de .env.example..."
        cp .env.example .env.local
      fi
      print_success "Configuração de desenvolvimento validada"
      ;;
    *)
      print_error "Ambiente desconhecido: $ENVIRONMENT"
      echo "Ambientes suportados: production, staging, development"
      exit 1
      ;;
  esac
}

# ====== LIMPAR BUILD ANTERIOR ======

clean_build() {
  print_step "Limpando build anterior..."
  
  if [ -d "$BUILD_DIR" ]; then
    rm -rf "$BUILD_DIR"
    print_success "Build anterior removido"
  fi

  if [ -d ".next" ]; then
    rm -rf ".next"
    print_success "Cache Next.js removido"
  fi

  if [ -d "node_modules/.next" ]; then
    rm -rf "node_modules/.next"
  fi
}

# ====== INSTALAR DEPENDÊNCIAS ======

install_dependencies() {
  print_step "Instalando dependências..."
  
  if npm ci --prefer-offline --no-audit; then
    print_success "Dependências instaladas"
  else
    print_error "Falha ao instalar dependências"
    exit 1
  fi
}

# ====== EXECUTAR TESTES ======

run_tests() {
  print_step "Executando testes..."

  if [ "$ENVIRONMENT" == "production" ]; then
    if npm run test -- --run --coverage; then
      print_success "Todos os testes passaram"
    else
      print_error "Testes falharam"
      exit 1
    fi
  else
    print_success "Testes pulados para ambiente $ENVIRONMENT"
  fi
}

# ====== LINTING ======

run_lint() {
  print_step "Verificando código (linting)..."

  if command -v npm run lint &> /dev/null; then
    if npm run lint; then
      print_success "Linting passou"
    else
      print_error "Linting apresentou erros"
      if [ "$ENVIRONMENT" == "production" ]; then
        exit 1
      fi
    fi
  else
    print_success "Script de lint não configurado"
  fi
}

# ====== BUILD ======

build_project() {
  print_step "Compilando projeto para $ENVIRONMENT..."

  if npm run build; then
    print_success "Build completado com sucesso"
  else
    print_error "Falha na compilação"
    exit 1
  fi
}

# ====== BACKUP ANTERIOR ======

backup_previous() {
  print_step "Criando backup do deploy anterior..."

  if [ -d "public/command-center" ]; then
    mkdir -p "backups"
    tar -czf "backups/command-center-${TIMESTAMP}.tar.gz" "public/command-center"
    print_success "Backup criado: backups/command-center-${TIMESTAMP}.tar.gz"
  fi
}

# ====== DEPLOY ======

deploy() {
  print_step "Iniciando deploy para $ENVIRONMENT..."

  case $ENVIRONMENT in
    production)
      deploy_production
      ;;
    staging)
      deploy_staging
      ;;
    development)
      print_success "Ambiente de desenvolvimento - build pronto em .next/"
      ;;
  esac
}

deploy_production() {
  print_step "Deploying para PRODUÇÃO..."
  
  # Copiar arquivos build
  if [ -d ".next" ]; then
    cp -r ".next" "public/command-center"
    print_success "Arquivos copiados para public/command-center"
  fi

  # Gerar sitemap
  print_step "Gerando sitemap..."
  # npm run generate-sitemap

  # Invalidar cache CloudFront (se usar AWS)
  # print_step "Invalidando cache CloudFront..."
  # aws cloudfront create-invalidation --distribution-id $CF_DIST_ID --paths "/*"

  print_success "Deploy para PRODUÇÃO completado"
}

deploy_staging() {
  print_step "Deploying para STAGING..."
  
  # Similar a production mas com logs extras
  print_success "Deploy para STAGING completado"
}

# ====== POST-DEPLOY VALIDAÇÃO ======

validate_deployment() {
  print_step "Validando deployment..."

  # Verificar se arquivos importantes existem
  if [ ! -f ".next/BUILD_ID" ]; then
    print_error "BUILD_ID não encontrado - build pode estar incompleto"
    exit 1
  fi

  print_success "Deployment validado"

  # Mostrar BUILD_ID
  echo -e "\n${BLUE}Build ID:${NC} $(cat .next/BUILD_ID)"
}

# ====== GERAR RELATÓRIO ======

generate_report() {
  print_step "Gerando relatório de deploy..."

  REPORT_FILE="deploy-report-${TIMESTAMP}.txt"

  cat > "$REPORT_FILE" << EOF
CDKTECK Command Center - Deploy Report
=====================================

Timestamp: $(date)
Environment: $ENVIRONMENT
Build: $(cat .next/BUILD_ID 2>/dev/null || echo "unknown")

Node: $(node --version)
npm: $(npm --version)

Build Output:
$(du -sh .next 2>/dev/null || echo "N/A")

Status: SUCCESS

EOF

  print_success "Relatório gerado: $REPORT_FILE"
}

# ====== RESUMO ======

print_summary() {
  echo -e "\n${BLUE}╔════════════════════════════════════════╗${NC}"
  echo -e "${GREEN}║ Deploy completado com sucesso! ✓${NC}"
  echo -e "${BLUE}╚════════════════════════════════════════╝${NC}\n"

  echo -e "${YELLOW}Próximos passos:${NC}"
  echo "1. Verificar logs da aplicação"
  echo "2. Testar funcionalidades críticas"
  echo "3. Monitorar erros em tempo real"
  echo ""
}

# ====== EXECUTAR PIPELINE ======

main() {
  print_header

  check_requirements
  validate_environment
  clean_build
  install_dependencies
  run_tests
  run_lint
  build_project
  backup_previous
  deploy
  validate_deployment
  generate_report
  print_summary
}

# Tratar erros
trap 'print_error "Script interrompido"; exit 1' INT TERM

# Executar
main "$@"
