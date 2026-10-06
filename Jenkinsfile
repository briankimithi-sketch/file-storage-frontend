pipeline {
    agent {
        node {
            label 'built-in'
            customWorkspace '/home/brian.kimithi/jenkins-workspace/file-storage-frontend'
        }
    }

    environment {
        // ==========================================
        // Frontend Docker / Runtime Configuration
        // ==========================================
        FRONTEND_IMAGE     = 'file-storage-frontend'
        FRONTEND_CONTAINER = 'file-storage-frontend-runtime'
        FRONTEND_PORT      = '8083'
        FRONTEND_INTERNAL_PORT = '80'
    }

    stages {

        // =========================================================
        // CHECKOUT
        // =========================================================
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        // =========================================================
        // INSTALL DEPENDENCIES
        // =========================================================
        stage('Install Dependencies') {
            steps {
                sh '''
                    set -e

                    echo "=========================================="
                    echo "Installing frontend dependencies"
                    echo "=========================================="

                    docker run --rm \
                        --user "$(id -u):$(id -g)" \
                        -e HOME=/tmp \
                        -v "$WORKSPACE:/app" \
                        -w /app \
                        node:20-alpine \
                        npm ci

                    echo "Dependencies installed successfully."
                '''
            }
        }

        // =========================================================
        // LINT
        // =========================================================
        stage('Lint') {
            steps {
                sh '''
                    set -e

                    echo "=========================================="
                    echo "Running ESLint"
                    echo "=========================================="

                    docker run --rm \
                        --user "$(id -u):$(id -g)" \
                        -e HOME=/tmp \
                        -v "$WORKSPACE:/app" \
                        -w /app \
                        node:20-alpine \
                        npm run lint

                    echo "Lint completed successfully."
                '''
            }
        }

        // =========================================================
        // BUILD
        // =========================================================
        stage('Build') {
            steps {
                sh '''
                    set -e

                    echo "=========================================="
                    echo "Building React frontend"
                    echo "=========================================="

                    docker run --rm \
                        --user "$(id -u):$(id -g)" \
                        -e HOME=/tmp \
                        -v "$WORKSPACE:/app" \
                        -w /app \
                        node:20-alpine \
                        npm run build

                    echo "Frontend build completed successfully."
                '''
            }
        }

        // =========================================================
        // DOCKER BUILD
        // =========================================================
        stage('Docker Build') {
            steps {
                sh '''
                    set -e

                    echo "=========================================="
                    echo "Building frontend Docker image"
                    echo "=========================================="

                    docker build \
                        -t "$FRONTEND_IMAGE:${BUILD_NUMBER}" \
                        -t "$FRONTEND_IMAGE:latest" \
                        .

                    echo "Docker image built successfully."

                    docker image ls "$FRONTEND_IMAGE"
                '''
            }
        }

        // =========================================================
        // DEPLOY RUNTIME
        // =========================================================
        stage('Deploy Runtime') {
            steps {
                sh '''
                    set -e

                    echo "=========================================="
                    echo "Deploying frontend runtime"
                    echo "=========================================="

                    echo "=== Removing previous frontend container ==="

                    docker rm -f "$FRONTEND_CONTAINER" \
                        >/dev/null 2>&1 || true

                    echo "=== Starting frontend container ==="

                    docker run -d \
                        --name "$FRONTEND_CONTAINER" \
                        -p "$FRONTEND_PORT:$FRONTEND_INTERNAL_PORT" \
                        --add-host host.docker.internal:host-gateway \
                        "$FRONTEND_IMAGE:${BUILD_NUMBER}"

                    echo "=== Waiting for frontend ==="

                    for i in $(seq 1 30); do

                        if docker run --rm \
                            --add-host host.docker.internal:host-gateway \
                            curlimages/curl:8.10.1 \
                            -fsS \
                            "http://host.docker.internal:$FRONTEND_PORT" \
                            >/dev/null 2>&1; then

                            echo "Frontend is ready."
                            break
                        fi

                        if [ "$i" -eq 30 ]; then
                            echo "ERROR: Frontend did not become ready."

                            echo "=== Frontend container status ==="
                            docker ps -a \
                                --filter "name=$FRONTEND_CONTAINER"

                            echo "=== Frontend logs ==="
                            docker logs "$FRONTEND_CONTAINER" || true

                            exit 1
                        fi

                        echo "Waiting for frontend... ($i/30)"
                        sleep 2
                    done

                    echo "=== Frontend HTTP health check ==="

                    curl -fsS \
                        "http://localhost:$FRONTEND_PORT" \
                        >/dev/null

                    echo "Frontend HTTP health check passed."

                    echo "=== Backend proxy health check ==="

                    HTTP_STATUS=$(curl -s -o /dev/null \
                        -w "%{http_code}" \
                        "http://localhost:$FRONTEND_PORT/files")

                    if [ "$HTTP_STATUS" = "401" ]; then
                        echo "Backend proxy is working."
                        echo "Unauthenticated request correctly returned HTTP 401."
                    else
                        echo "WARNING: Expected HTTP 401 from protected backend endpoint."
                        echo "Received HTTP $HTTP_STATUS."
                    fi

                    echo "=========================================="
                    echo "Frontend deployment completed successfully."
                    echo "Frontend: http://localhost:$FRONTEND_PORT"
                    echo "=========================================="
                '''
            }
        }

        // =========================================================
        // ARCHIVE
        // =========================================================
        stage('Archive') {
            steps {
                archiveArtifacts artifacts: 'dist/**', fingerprint: true
            }
        }
    }

    // =========================================================
    // CLEANUP
    // =========================================================
    post {
        always {
            sh '''
                echo "=========================================="
                echo "Cleaning frontend build workspace"
                echo "=========================================="

                rm -rf node_modules

                echo "Workspace cleanup completed."
            '''
        }
    }
}
