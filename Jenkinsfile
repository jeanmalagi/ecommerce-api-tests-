pipeline {
    agent any

    options {
        timeout(time: 20, unit: 'MINUTES')
    }

    stages {

        // ✅ Instala dependências
        stage('Install Dependencies') {
            steps {
                bat 'npm install'
            }
        }

        // ✅ Instala browsers Playwright
        stage('Install Playwright Browsers') {
            steps {
                bat 'npx playwright install'
            }
        }

        // ✅ Limpa execuções anteriores
        stage('Clean Reports') {
            steps {
                bat 'if exist blob-report rmdir /s /q blob-report'
                bat 'if exist playwright-report rmdir /s /q playwright-report'
            }
        }

        // ✅ Executa testes em paralelo (SEM reporter CLI)
        stage('API Tests (Parallel)') {
            parallel {

                stage('Auth Tests') {
                    steps {
                        catchError(buildResult: 'SUCCESS', stageResult: 'FAILURE') {
                            bat 'npx playwright test tests/auth'
                        }
                    }
                }

                stage('Products Tests') {
                    steps {
                        catchError(buildResult: 'SUCCESS', stageResult: 'FAILURE') {
                            bat 'npx playwright test tests/products'
                        }
                    }
                }

                stage('Orders Tests') {
                    steps {
                        catchError(buildResult: 'SUCCESS', stageResult: 'FAILURE') {
                            bat 'npx playwright test tests/orders'
                        }
                    }
                }

                stage('Cart Tests') {
                    steps {
                        catchError(buildResult: 'SUCCESS', stageResult: 'FAILURE') {
                            bat 'npx playwright test tests/cart'
                        }
                    }
                }

                stage('Dashboard Tests') {
                    steps {
                        catchError(buildResult: 'SUCCESS', stageResult: 'FAILURE') {
                            bat 'npx playwright test tests/dashboard'
                        }
                    }
                }
            }
        }

        // ✅ DEBUG — verificar se blob foi gerado
        stage('Debug Blob Report') {
            steps {
                bat 'echo ===== BLOB REPORT ====='
                bat 'dir blob-report /s'
            }
        }

        // ✅ GERAR relatório consolidado
        stage('Generate Playwright Report') {
            steps {
                bat 'npx playwright merge-reports blob-report'

                // ✅ Verificar se relatório foi criado
                bat 'echo ===== PLAYWRIGHT REPORT ====='
                bat 'dir playwright-report'
            }
        }

        // ✅ Arquivar artefatos (melhor que HTML Publisher)
        stage('Archive Report') {
            steps {
                archiveArtifacts artifacts: 'playwright-report/**', fingerprint: true
            }
        }
    }
}