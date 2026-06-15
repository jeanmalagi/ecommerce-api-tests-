pipeline {
    agent any

    options {
        timeout(time: 30, unit: 'MINUTES')
    }

    stages {

        // ✅ Instalar dependências
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

        // ✅ Checkout Backend
        stage('Checkout Backend') {
            steps {
                dir('ecommerce-fullstack') {
                    git url: 'https://github.com/jeanmalagi/ecommerce-fullstack.git', branch: 'main'
                }
            }
        }

        // ✅ Subir Docker
        stage('Start Docker Environment') {
            steps {
                bat '''
                cd ecommerce-fullstack
                docker compose down || exit 0
                docker compose up -d --build
                '''
            }
        }

        // ✅ 🔥 NOVO: Ver logs do backend
        stage('Check Backend Logs') {
            steps {
                bat '''
                cd ecommerce-fullstack
                docker logs ecommerce-fullstack-backend-1
                '''
            }
        }

        // ✅ Esperar API subir
        stage('Wait for API') {
            steps {
                bat '''
                echo Aguardando API...
                timeout /t 10

                curl http://localhost:3000/api/products

                if %ERRORLEVEL% neq 0 (
                    echo API nao respondeu
                    exit /b 1
                )

                echo API pronta ✅
                '''
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

        // ✅ Debug relatório
        stage('Debug Report') {
            steps {
                bat 'dir playwright-report'
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

    // ✅ Cleanup garantido
    post {
        always {
            bat '''
            cd ecommerce-fullstack
            docker compose down || exit 0
            '''
        }
    }
}