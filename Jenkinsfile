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

        // ✅ Limpar relatórios antigos
        stage('Clean Reports') {
            steps {
                bat 'if exist reports rmdir /s /q reports'
                bat 'mkdir reports'
            }
        }

        // ✅ Executar testes em paralelo com relatório individual
        stage('API Tests (Parallel)') {
            parallel {

                stage('Auth Tests') {
                    steps {
                        catchError(buildResult: 'SUCCESS', stageResult: 'FAILURE') {
                            bat 'setlocal && set PLAYWRIGHT_HTML_OUTPUT_DIR=reports\\auth && npx playwright test tests/auth --reporter=html'
                        }
                    }
                }

                stage('Products Tests') {
                    steps {
                        catchError(buildResult: 'SUCCESS', stageResult: 'FAILURE') {
                            bat 'setlocal && set PLAYWRIGHT_HTML_OUTPUT_DIR=reports\\products && npx playwright test tests/products --reporter=html'
                        }
                    }
                }

                stage('Orders Tests') {
                    steps {
                        catchError(buildResult: 'SUCCESS', stageResult: 'FAILURE') {
                            bat 'setlocal && set PLAYWRIGHT_HTML_OUTPUT_DIR=reports\\orders && npx playwright test tests/orders --reporter=html'
                        }
                    }
                }

                stage('Cart Tests') {
                    steps {
                        catchError(buildResult: 'SUCCESS', stageResult: 'FAILURE') {
                            bat 'setlocal && set PLAYWRIGHT_HTML_OUTPUT_DIR=reports\\cart && npx playwright test tests/cart --reporter=html'
                        }
                    }
                }

                stage('Dashboard Tests') {
                    steps {
                        catchError(buildResult: 'SUCCESS', stageResult: 'FAILURE') {
                            bat 'setlocal && set PLAYWRIGHT_HTML_OUTPUT_DIR=reports\\dashboard && npx playwright test tests/dashboard --reporter=html'
                        }
                    }
                }
            }
        }

        // ✅ Debug dos relatórios (IMPORTANTE)
        stage('Debug Reports') {
            steps {
                bat 'echo ===== REPORTS ====='
                bat 'dir reports /s'
            }
        }

        // ✅ Arquivar relatórios (SEM fingerprint para evitar erro no Windows)
        stage('Archive Reports') {
            steps {
                archiveArtifacts artifacts: 'reports/**', fingerprint: false
            }
        }
    }
}