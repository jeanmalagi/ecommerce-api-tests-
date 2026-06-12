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

        // ✅ Limpa relatórios
        stage('Clean Reports') {
            steps {
                bat 'if exist reports rmdir /s /q reports'
                bat 'mkdir reports'
            }
        }

        // ✅ Execução paralela com relatório individual
        stage('API Tests (Parallel)') {
            parallel {

                stage('Auth Tests') {
                    steps {
                        catchError(buildResult: 'SUCCESS', stageResult: 'FAILURE') {
                            bat '''
                            npx playwright test tests/auth ^
                            --reporter=html ^
                            --output=reports/auth
                            '''
                        }
                    }
                }

                stage('Products Tests') {
                    steps {
                        catchError(buildResult: 'SUCCESS', stageResult: 'FAILURE') {
                            bat '''
                            npx playwright test tests/products ^
                            --reporter=html ^
                            --output=reports/products
                            '''
                        }
                    }
                }

                stage('Orders Tests') {
                    steps {
                        catchError(buildResult: 'SUCCESS', stageResult: 'FAILURE') {
                            bat '''
                            npx playwright test tests/orders ^
                            --reporter=html ^
                            --output=reports/orders
                            '''
                        }
                    }
                }

                stage('Cart Tests') {
                    steps {
                        catchError(buildResult: 'SUCCESS', stageResult: 'FAILURE') {
                            bat '''
                            npx playwright test tests/cart ^
                            --reporter=html ^
                            --output=reports/cart
                            '''
                        }
                    }
                }

                stage('Dashboard Tests') {
                    steps {
                        catchError(buildResult: 'SUCCESS', stageResult: 'FAILURE') {
                            bat '''
                            npx playwright test tests/dashboard ^
                            --reporter=html ^
                            --output=reports/dashboard
                            '''
                        }
                    }
                }
            }
        }

        // ✅ Debug (opcional mas útil)
        stage('Debug Reports') {
            steps {
                bat 'dir reports /s'
            }
        }

        // ✅ Arquivar relatórios
        stage('Archive Reports') {
            steps {
                archiveArtifacts artifacts: 'reports/**', fingerprint: true
            }
        }
    }
}