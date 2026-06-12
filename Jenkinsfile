pipeline {
    agent any

    options {
        timeout(time: 20, unit: 'MINUTES')
    }

    stages {

        // ✅ Instalar dependências
        stage('Install Dependencies') {
            steps {
                bat 'npm install'
            }
        }

        // ✅ Instalar browsers do Playwright
        stage('Install Playwright Browsers') {
            steps {
                bat 'npx playwright install'
            }
        }

        // ✅ Limpar relatórios antigos (ESSENCIAL)
        stage('Clean Reports') {
            steps {
                bat 'if exist blob-report rmdir /s /q blob-report'
                bat 'if exist playwright-report rmdir /s /q playwright-report'
            }
        }

        // ✅ Testes em paralelo com blob separado
        stage('API Tests (Parallel)') {
            parallel {

                stage('Auth Tests') {
                    steps {
                        catchError(buildResult: 'SUCCESS', stageResult: 'FAILURE') {
                            bat 'npx playwright test tests/auth --reporter=blob --output=blob-report/auth'
                        }
                    }
                }

                stage('Products Tests') {
                    steps {
                        catchError(buildResult: 'SUCCESS', stageResult: 'FAILURE') {
                            bat 'npx playwright test tests/products --reporter=blob --output=blob-report/products'
                        }
                    }
                }

                stage('Orders Tests') {
                    steps {
                        catchError(buildResult: 'SUCCESS', stageResult: 'FAILURE') {
                            bat 'npx playwright test tests/orders --reporter=blob --output=blob-report/orders'
                        }
                    }
                }

                stage('Cart Tests') {
                    steps {
                        catchError(buildResult: 'SUCCESS', stageResult: 'FAILURE') {
                            bat 'npx playwright test tests/cart --reporter=blob --output=blob-report/cart'
                        }
                    }
                }

                stage('Dashboard Tests') {
                    steps {
                        catchError(buildResult: 'SUCCESS', stageResult: 'FAILURE') {
                            bat 'npx playwright test tests/dashboard --reporter=blob --output=blob-report/dashboard'
                        }
                    }
                }
            }
        }

        // ✅ Merge dos relatórios (AGORA FUNCIONA CORRETAMENTE)
        stage('Generate Playwright Report') {
            steps {
                bat 'npx playwright merge-reports --reporter html blob-report'

                // ✅ Debug (importante para validar)
                bat 'echo ===== PLAYWRIGHT REPORT FILES ====='
                bat 'dir playwright-report'
            }
        }

        // ✅ Arquivar relatório completo (funciona melhor que HTML Publisher)
        stage('Archive Report') {
            steps {
                archiveArtifacts artifacts: 'playwright-report/**', fingerprint: true
            }
        }
    }
}