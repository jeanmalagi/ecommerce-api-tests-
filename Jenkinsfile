pipeline {
    agent any

    options {
        timeout(time: 30, unit: 'MINUTES')
    }

    stages {

        // ✅ Instalar dependências do projeto de testes
        stage('Install Dependencies') {
            steps {
                bat 'npm install'
            }
        }

        // ✅ Instalar navegadores do Playwright
        stage('Install Playwright Browsers') {
            steps {
                bat 'npx playwright install'
            }
        }

        // ✅ Clonar o backend (repo externo)
        stage('Checkout Backend') {
            steps {
                dir('ecommerce-fullstack') {
                    git url: 'https://github.com/jeanmalagi/ecommerce-fullstack.git', branch: 'main'
                }
            }
        }

        // ✅ Subir ambiente Docker (backend + banco)
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

        // ✅ Executar testes em paralelo
        stage('Run Tests (Parallel)') {
            parallel {

                stage('Auth Tests') {
                    steps {
                        catchError(buildResult: 'SUCCESS', stageResult: 'FAILURE') {
                            bat 'npx playwright test tests/auth --reporter=line'
                        }
                    }
                }

                stage('Products Tests') {
                    steps {
                        catchError(buildResult: 'SUCCESS', stageResult: 'FAILURE') {
                            bat 'npx playwright test tests/products --reporter=line'
                        }
                    }
                }

                stage('Cart Tests') {
                    steps {
                        catchError(buildResult: 'SUCCESS', stageResult: 'FAILURE') {
                            bat 'npx playwright test tests/cart --reporter=line'
                        }
                    }
                }

                stage('Orders Tests') {
                    steps {
                        catchError(buildResult: 'SUCCESS', stageResult: 'FAILURE') {
                            bat 'npx playwright test tests/orders --reporter=line'
                        }
                    }
                }

                stage('Dashboard Tests') {
                    steps {
                        catchError(buildResult: 'SUCCESS', stageResult: 'FAILURE') {
                            bat 'npx playwright test tests/dashboard --reporter=line'
                        }
                    }
                }
            }
        }

        // ✅ Gerar relatório consolidado
        stage('Generate HTML Report') {
            steps {
                catchError(buildResult: 'UNSTABLE', stageResult: 'FAILURE') {
                    bat 'npx playwright test --reporter=html'
                }
            }
        }

        // ✅ Debug (opcional)
        stage('Debug Report') {
            steps {
                bat 'dir playwright-report'
            }
        }

        // ✅ Arquivar relatório
        stage('Archive Report') {
            steps {
                archiveArtifacts artifacts: 'playwright-report/**', fingerprint: false
            }
        }

        // ✅ Derrubar ambiente Docker
        stage('Shutdown Environment') {
            steps {
                bat '''
                cd ecommerce-fullstack
                docker compose down
                '''
            }
        }
    }

    // ✅ Garantir limpeza mesmo em falha
    post {
        always {
            bat '''
            cd ecommerce-fullstack
            docker compose down || exit 0
            '''
        }
    }
}