pipeline {
    agent any

    options {
        timeout(time: 30, unit: 'MINUTES')
    }

    stages {

        // ✅ Instala dependências
        stage('Install Dependencies') {
            steps {
                bat 'npm install'
            }
        }

        // ✅ Playwright
        stage('Install Playwright Browsers') {
            steps {
                bat 'npx playwright install'
            }
        }

        // ✅ Clonar backend (repo externo)
        stage('Checkout Backend') {
            steps {
                dir('backend') {
                    git url: 'https://github.com/jeanmalagi/ecommerce-fullstack.git', branch: 'main'
                }
            }
        }

        // ✅ Subir Docker (usa docker-compose da raiz)
        stage('Start Docker Environment') {
            steps {
                bat '''
                cd ecommerce-fullstack
                docker compose down || exit 0
                docker compose up -d --build
                '''
            }
        }

        // ✅ Esperar API subir
        stage('Wait for API') {
            steps {
                bat 'node wait-for-api.js'
            }
        }

        // ✅ Testes paralelos
        stage('Run Tests (Parallel)') {
            parallel {

                stage('Auth') {
                    steps {
                        catchError(buildResult: 'SUCCESS', stageResult: 'FAILURE') {
                            bat 'npx playwright test tests/auth --reporter=line'
                        }
                    }
                }

                stage('Products') {
                    steps {
                        catchError(buildResult: 'SUCCESS', stageResult: 'FAILURE') {
                            bat 'npx playwright test tests/products --reporter=line'
                        }
                    }
                }

                stage('Cart') {
                    steps {
                        catchError(buildResult: 'SUCCESS', stageResult: 'FAILURE') {
                            bat 'npx playwright test tests/cart --reporter=line'
                        }
                    }
                }

                stage('Orders') {
                    steps {
                        catchError(buildResult: 'SUCCESS', stageResult: 'FAILURE') {
                            bat 'npx playwright test tests/orders --reporter=line'
                        }
                    }
                }

                stage('Dashboard') {
                    steps {
                        catchError(buildResult: 'SUCCESS', stageResult: 'FAILURE') {
                            bat 'npx playwright test tests/dashboard --reporter=line'
                        }
                    }
                }
            }
        }

        // ✅ Relatório HTML
        stage('Generate HTML Report') {
            steps {
                catchError(buildResult: 'UNSTABLE', stageResult: 'FAILURE') {
                    bat 'npx playwright test --reporter=html'
                }
            }
        }

        // ✅ Arquivar
        stage('Archive Report') {
            steps {
                archiveArtifacts artifacts: 'playwright-report/**', fingerprint: false
            }
        }

        // ✅ Derrubar Docker
        stage('Shutdown Environment') {
            steps {
                bat '''
                cd ecommerce-fullstack
                docker compose down
                '''
            }
        }
    }

    // ✅ Garantir limpeza sempre
    post {
        always {
            bat '''
            cd ecommerce-fullstack
            docker compose down || exit 0
            '''
        }
    }
}