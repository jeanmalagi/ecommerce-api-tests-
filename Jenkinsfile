pipeline {
    agent any

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

        stage('Clean Reports') {
            steps {
                bat 'if exist reports rmdir /s /q reports'
                bat 'mkdir reports'
            }
        }

        stage('API Tests (Parallel)') {
            parallel {

                stage('Auth Tests') {
                    steps {
                        catchError(buildResult: 'SUCCESS', stageResult: 'FAILURE') {
                            bat '''
                            npx playwright test tests/auth ^
                            --reporter=html ^
                            --reporter=html=reports/auth
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
                            --reporter=html=reports/products
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
                            --reporter=html=reports/orders
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
                            --reporter=html=reports/cart
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
                            --reporter=html=reports/dashboard
                            '''
                        }
                    }
                }
            }
        }

        stage('Debug Reports') {
            steps {
                bat 'echo ===== LISTANDO REPORTS ====='
                bat 'dir reports /s'
            }
        }

        stage('Archive Reports') {
            steps {
                archiveArtifacts artifacts: 'reports/**', fingerprint: true
            }
        }
    }
}