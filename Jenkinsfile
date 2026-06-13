pipeline {
    agent any

    options {
        timeout(time: 20, unit: 'MINUTES')
    }

    stages {

        stage('Install Dependencies') {
            steps {
                bat 'npm install'
            }
        }

        stage('Install Playwright Browsers') {
            steps {
                bat 'npx playwright install'
            }
        }

        // ✅ Execução rápida paralela (sem gerar HTML aqui)
        stage('API Tests (Parallel)') {
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

                stage('Orders') {
                    steps {
                        catchError(buildResult: 'SUCCESS', stageResult: 'FAILURE') {
                            bat 'npx playwright test tests/orders --reporter=line'
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

                stage('Dashboard') {
                    steps {
                        catchError(buildResult: 'SUCCESS', stageResult: 'FAILURE') {
                            bat 'npx playwright test tests/dashboard --reporter=line'
                        }
                    }
                }
            }
        }

        // ✅ GERA RELATÓRIO CORRETO (UMA VEZ SÓ)
        stage('Generate HTML Report') {
            steps {
                bat 'npx playwright test --reporter=html'
            }
        }

        // ✅ Debug simples
        stage('Debug Report') {
            steps {
                bat 'dir playwright-report'
            }
        }

        // ✅ Arquivar (sem fingerprint → evita bug Windows)
        stage('Archive Report') {
            steps {
                archiveArtifacts artifacts: 'playwright-report/**', fingerprint: false
            }
        }
    }
}