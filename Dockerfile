FROM python:3.12-slim

WORKDIR /app

# Copy requirements file
COPY requirements.txt .

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application
COPY . .

# Create necessary directories if they don't exist
RUN mkdir -p /app/static/images

# Make sure the profile picture is available in both locations
RUN if [ -f /app/static/images/profile-picture.jpg ] && [ ! -f /app/profile-picture.jpg ]; then \
        cp /app/static/images/profile-picture.jpg /app/; \
    elif [ -f /app/profile-picture.jpg ] && [ ! -f /app/static/images/profile-picture.jpg ]; then \
        cp /app/profile-picture.jpg /app/static/images/; \
    fi

# Set environment variables
ENV STREAMLIT_SERVER_PORT=8080
ENV STREAMLIT_SERVER_ADDRESS=0.0.0.0
ENV STREAMLIT_SERVER_HEADLESS=true
ENV STREAMLIT_SERVER_ENABLE_CORS=true
ENV STREAMLIT_SERVER_ENABLE_XSRF_PROTECTION=false

# Expose the port Streamlit will run on
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:8080/_stcore/health || exit 1

# Command to run the application
CMD ["streamlit", "run", "app.py"]
