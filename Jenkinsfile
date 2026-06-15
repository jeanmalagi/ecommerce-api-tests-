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

        stage('Start Docker Environment') {
            steps {
                bat '''
                cd ecommerce-fullstack

                docker compose down -v || exit 0   // 🔥 remove volumes (zera o banco)

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

        stage('Seed Database') {
            steps {
                bat '''
                echo Criando usuario admin...

                curl -X POST http://localhost:3000/api/users/login ^
                -H "Content-Type: application/json" ^
                -d "{\\"name\\":\\"Admin\\",\\"email\\":\\"admin@email.com\\",\\"password\\":\\"123456\\",\\"isAdmin\\":true}"

                echo Criando usuario normal...

                curl -X POST http://localhost:3000/api/users/login ^
                -H "Content-Type: application/json" ^
                -d "{\\"name\\":\\"User\\",\\"email\\":\\"cliente@email.com\\",\\"password\\":\\"123456\\"}"
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

/*                stage('Products') {
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
        }*/

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