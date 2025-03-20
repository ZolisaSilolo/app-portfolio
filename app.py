import streamlit as st
import boto3
import os
import base64
from typing import Dict, List, Optional
import logging
import json
import sys
from aws_secrets import get_secret_from_aws

# Set up logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.StreamHandler(sys.stdout)
    ]
)

logger = logging.getLogger(__name__)

# Debug information
logger.info(f"Python version: {sys.version}")
logger.info(f"Current working directory: {os.getcwd()}")
logger.info(f"Directory contents: {os.listdir('.')}")

# Debug environment variables
logger.info("Environment variables:")
for key, value in os.environ.items():
    if "COHERE" in key:
        logger.info(f"{key}: [REDACTED]")
    elif "STREAMLIT" in key:
        logger.info(f"{key}: {value}")
    else:
        logger.info(f"{key}: {value}")

# Health check endpoint for AWS App Runner
def health_check():
    logger.info("Health check called")
    if st.query_params and st.query_params.get("_stcore_health_check"):
        st.success("Health check: OK")
        st.stop()

# Force server settings
os.environ['STREAMLIT_SERVER_PORT'] = '8080'
os.environ['STREAMLIT_SERVER_ADDRESS'] = '0.0.0.0'
os.environ['STREAMLIT_SERVER_HEADLESS'] = 'true'
os.environ['STREAMLIT_SERVER_ENABLE_CORS'] = 'true'
os.environ['STREAMLIT_SERVER_ENABLE_XSRF_PROTECTION'] = 'false'

# App configuration
APP_TITLE = "LUNDI ZOLISA SILOLO'S PORTFOLIO"
GITHUB_URL = "https://github.com/ZolisaSilolo"

# Define portfolio projects as a constant
PORTFOLIO_PROJECTS = [
    {
        "title": "Simple AWS Fraud Detection Pipeline", 
        "description": "This is an MLOps project that showcases my skills in building and deploying scalable real-world solutions using AWS services.",
        "technologies": ["AWS Lambda", "Amazon Kinesis", "Amazon SageMaker", "SNS Topic", "DynamoDB", "API Gateway", "S3"],
        "repo_url": "https://github.com/ZolisaSilolo/Simple-AWS-Fraud-Detection-Pipeline",
    },
    {
        "title": "Awesome Environment With Backup & Disaster Recovery", 
        "description": "Architecting a custom VPC with public and private subnets, Internet & NAT Gateways for controlled access, an EC2 Auto Scaling Group with ELB for scalability, Multi-AZRDS and DynamoDB for databases, S3 with CloudFront for storage and delivery, Route 53 for DNS, WAF & NACLs for security, VPC Peering for cross-region traffic, and AWS Backup for automation and resilience.",
        "technologies": ["VPC", "RDS", "Cloudfront", "Cloudformation", "S3", "Route 53", "WAF", "NACLs", "VPC Peering", "AWS Backup"],
        "repo_url":"https://github.com/ZolisaSilolo/awesome-environment",
    },
    {
        "title": "Just Serveless Efficiency (JSE)", 
        "description": "A web application with a cloud-native vector store that leverages Cohere's API to generate and analyze content for Document Processing, Text summarisation, and more.",
        "technologies": ["Python", "Cohere API", "FastAPI", "Streamlit", "AWS Lambda", "S3, API Gateway, OpenSearchServerless"],
        "repo_url": "https://github.com/ZolisaSilolo/JustServelessEfficiency-JSE",
    },
    {
        "title": "Alexa Smart Home Skill",
        "description": "An Alexa Smart Home Skill that allows users to control smart devices using voice commands.",
        "technologies": ["AWS Lambda", "Alexa Skills Kit", "DynamoDB", "API Gateway"],
        "repo_url": "https://github.com/ZolisaSilolo/alexa-smart-home",
    },
    {
        "title": "Industrial Predictive Maintenance",
        "description": "A predictive maintenance solution for industrial equipment using machine learning and IoT sensors.",
        "technologies": ["Python", "AWS IoT", "Amazon SageMaker", "AWS Lambda"],
        "repo_url": "https://github.com/ZolisaSilolo/Industrial-Predictive-Maintenance",
    },
]

# Try to import optional dependencies
try:
    import cohere
    COHERE_AVAILABLE = True
except ImportError:
    logger.warning("Cohere module not available. Chatbot functionality will be limited.")
    COHERE_AVAILABLE = False

try:
    import boto3
    BOTO3_AVAILABLE = True
except ImportError:
    logger.warning("Boto3 module not available. AWS functionality will be limited.")
    BOTO3_AVAILABLE = False

# Cohere configuration
COHERE_MODEL = "command"  # Using Command model for better responses
MAX_TOKENS = 250
TEMPERATURE = 0.7

def get_image_as_base64(image_path):
    """Convert an image to base64 string for embedding in HTML with robust path handling."""
    try:
        # Try multiple path resolution methods
        paths_to_try = [
            image_path,  # Try direct path first
            os.path.join(os.getcwd(), image_path),  # Try with current working directory
            os.path.abspath(image_path),  # Try absolute path
            os.path.join(os.path.dirname(os.path.abspath(__file__)), image_path)  # Try relative to script location
        ]
        
        # Log the paths we're trying
        logger.info(f"Attempting to load image from paths: {paths_to_try}")
        
        # Try each path until one works
        for path in paths_to_try:
            if os.path.exists(path):
                logger.info(f"Found image at path: {path}")
                with open(path, "rb") as img_file:
                    return base64.b64encode(img_file.read()).decode('utf-8')
            else:
                logger.info(f"Image not found at path: {path}")
        
        # If we get here, none of the paths worked
        logger.error(f"Could not find image at any of the attempted paths")
        return ""
    except Exception as e:
        logger.error(f"Error loading image {image_path}: {str(e)}")
        # Return empty string on error
        return "# 👨‍💻"

def initialize_session_state():
    """Initialize session state variables if they don't exist."""
    if 'messages' not in st.session_state:
        st.session_state['messages'] = []
    
    if 'cohere_client' not in st.session_state and COHERE_AVAILABLE:
        try:
            # Try to get API key from environment variable first (for production)
            cohere_api_key = os.environ.get("COHERE_API_KEY")
            
            # Log the API key status (not the actual key)
            if cohere_api_key:
                logger.info("Found Cohere API key in environment variables")
            else:
                logger.info("No Cohere API key in environment variables, checking AWS Secrets Manager")
                
                # Try to get the API key from AWS Secrets Manager
                try:
                    # The secret name should be the name of your secret in AWS Secrets Manager
                    secret_name = "cohere-api-key"
                    secret_data = get_secret_from_aws(secret_name)
                    
                    if secret_data and "COHERE_API_KEY" in secret_data:
                        cohere_api_key = secret_data["COHERE_API_KEY"]
                        logger.info("Successfully retrieved Cohere API key from AWS Secrets Manager")
                    else:
                        logger.error("Could not find COHERE_API_KEY in the retrieved secret")
                except Exception as e:
                    logger.error(f"Error retrieving secret from AWS Secrets Manager: {e}")
                
            if not cohere_api_key:
                logger.error("No Cohere API key found in environment or AWS Secrets Manager")
                st.session_state['cohere_error'] = True
                return
                
            st.session_state['cohere_client'] = cohere.Client(cohere_api_key)
            st.session_state['cohere_error'] = False
            logger.info("Successfully initialized Cohere client")
        except Exception as e:
            logger.error(f"Failed to initialize Cohere client: {e}")
            st.session_state['cohere_error'] = True

def get_portfolio_context() -> str:
    """Generate a context string about the portfolio projects."""
    context = ["Portfolio Projects:\n"]
    for proj in PORTFOLIO_PROJECTS:
        tech_stack = ", ".join(proj["technologies"])
        context.append(f"- {proj['title']}: {proj['description']} (Tech stack: {tech_stack})\n")
    context.append(f"\nGitHub: {GITHUB_URL}\n")
    return "".join(context)

def get_cohere_response(prompt: str) -> str:
    """Get a response from Cohere's API."""
    if not COHERE_AVAILABLE:
        return "I'm sorry, the Cohere API integration is not available in this environment."
        
    if st.session_state.get('cohere_error', False):
        return "I'm having trouble connecting to the Cohere service. Please check the API key configuration."
    
    try:
        co = st.session_state['cohere_client']
        system_prompt = "You are a helpful assistant for Lundi Zolisa Silolo's portfolio website. You can talk about their projects and skills in a humoruos yet professonal way."
        
        # Using the newer chat endpoint for better conversation context handling
        response = co.chat(
            message=prompt,
            model=COHERE_MODEL,
            temperature=TEMPERATURE,
            preamble=system_prompt,
            chat_history=format_chat_history(),
            max_tokens=MAX_TOKENS
        )
        return response.text
    except Exception as e:
        logger.error(f"Cohere API error: {e}")
        return f"I'm having trouble generating a response. Please try again later."

def format_chat_history():
    """Format recent chat history for the Cohere chat API."""
    # Only use the last 10 messages to stay within context limits
    recent_messages = st.session_state['messages'][-10:]
    formatted_history = []
    
    for msg in recent_messages:
        if msg["role"] == "user":
            formatted_history.append({"role": "USER", "message": msg["content"]})
        else:
            formatted_history.append({"role": "CHATBOT", "message": msg["content"]})
    
    return formatted_history

def display_portfolio_project(project: Dict):
    """Display a portfolio project with enhanced styling."""
    col1, col2 = st.columns([1, 2])
    
    with col1:
        # Use project title to determine which emoji to display
        if "fraud detection" in project["title"].lower():
            st.markdown("<h1 style='font-size:80px; text-align:center;'>🔍💳🛠️🚫🏴‍☠️</h1>", unsafe_allow_html=True)
        elif "awesome environment" in project["title"].lower():
            st.markdown("<h1 style='font-size:80px; text-align:center;'>☁️🔄🌐</h1>", unsafe_allow_html=True)
        elif "just serveless efficiency" in project["title"].lower():
            st.markdown("<h1 style='font-size:80px; text-align:center;'>⚡🤖📊</h1>", unsafe_allow_html=True)            
        elif "alexa" in project["title"].lower():
            st.markdown("<h1 style='font-size:80px; text-align:center;'>🏡🤖</h1>", unsafe_allow_html=True)
        elif "industrial predictive maintenance" in project["title"].lower():
            st.markdown("<h1 style='font-size:80px; text-align:center;'>🚨💻🚧🔨🚜</h1>", unsafe_allow_html=True)    
    
    with col2:
        st.subheader(project["title"])
        st.write(project["description"])
        
        # Display technologies as pills/tags
        tech_html = ""
        for tech in project["technologies"]:
            aws_docs = {
                "Lambda": "https://aws.amazon.com/lambda/",
                "S3": "https://aws.amazon.com/s3/",
                "API Gateway": "https://aws.amazon.com/api-gateway/",
                "DynamoDB": "https://aws.amazon.com/dynamodb/",
                "SageMaker": "https://aws.amazon.com/sagemaker/",
                "SNS Topic": "https://aws.amazon.com/sns/",
                "Kinesis": "https://aws.amazon.com/kinesis/",
                "VPC": "https://aws.amazon.com/vpc/",
                "RDS": "https://aws.amazon.com/rds/",
                "Cloudfront": "https://aws.amazon.com/cloudfront/",
                "Cloudformation": "https://aws.amazon.com/cloudformation/",
                "Route 53": "https://aws.amazon.com/route53/",
                "WAF": "https://aws.amazon.com/waf/",
                "AWS Backup": "https://aws.amazon.com/backup/",
                "OpenSearchServerless": "https://aws.amazon.com/opensearch-service/serverless/",
                "IoT": "https://aws.amazon.com/iot/",
                "Alexa Skills Kit": "https://developer.amazon.com/alexa/alexa-skills-kit"
            }
            
            doc_url = aws_docs.get(tech, "#")
            tech_html += f"""<a href="{doc_url}" target="_blank" style="text-decoration: none;"><span style="
                background-color: #8B0000;
                color: #000000;
                transition: all 0.3s ease;
                border-radius: 10px;
                padding: 4px 12px;
                margin-right: 8px;
                margin-bottom: 5px;
                display: inline-block;
                cursor: pointer;
                font-weight: 500;
                box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                hover: {{
                    background-color: #A52A2A;
                    transform: translateY(-2px);
                    box-shadow: 0 4px 8px rgba(0,0,0,0.2);
                }}">{tech}</span></a>"""
        st.markdown(tech_html, unsafe_allow_html=True)
        
        # Add a link to the repository
        if "repo_url" in project:
            st.markdown(f"[View on GitHub]({project['repo_url']})")
    
    st.markdown("---")

def portfolio_page():
    """Render the portfolio page."""
    st.title("My Professional Portfolio")
    st.write("Welcome to my portfolio! Here you'll find my featured projects and technical expertise.")
    
    # Display featured projects
    st.header("Featured Projects")
    for project in PORTFOLIO_PROJECTS:
        display_portfolio_project(project)
    
    # Call to action
    st.markdown(f"### Explore More")
    st.markdown(f"View all my projects through my [GitHub]({GITHUB_URL}).")

def chatbot_page():
    """Render the chatbot page."""
    st.title("Portfolio Assistant")
    
    if not COHERE_AVAILABLE:
        st.warning("The chatbot functionality is currently unavailable because the Cohere API integration is not available in this environment.")
        return
        
    st.write("Ask me anything about my projects, skills, or experience!")
    
    # Chat input area with send button inline
    col1, col2 = st.columns([4, 1])
    with col1:
        user_input = st.text_input("Your message:", key="user_input", label_visibility="collapsed")
    with col2:
        send_button = st.button("Send", use_container_width=True)
    
    # Process message when send button is clicked or Enter is pressed
    if send_button and user_input:
        # Add user message to chat history
        st.session_state.messages.append({"role": "user", "content": user_input})
        
        # Prepare prompt with portfolio context if relevant
        if any(keyword in user_input.lower() for keyword in ["project", "portfolio", "work", "experience"]):
            context = get_portfolio_context()
            # Using this context but not including it in the actual prompt for more natural responses
            response = get_cohere_response(user_input)
        else:
            response = get_cohere_response(user_input)
        
        # Add assistant response to chat history
        st.session_state.messages.append({"role": "assistant", "content": response})
        
        # Clear the input box by forcing a rerun
        st.rerun()
    
    # Display conversation history in a chat-like interface
    if st.session_state.messages:
        st.markdown("### Conversation")
        chat_container = st.container()
        
        with chat_container:
            for msg in st.session_state.messages:
                if msg["role"] == "user":
                    message_alignment = "flex-end"
                    background_color = "#D1F2EB"
                    st.markdown(f"""
                        <div style="display:flex;justify-content:{message_alignment};margin-bottom:10px;">
                            <div style="background-color:{background_color};padding:10px;border-radius:10px;max-width:80%;">
                                <b>You:</b><br>{msg["content"]}
                            </div>
                        </div>
                    """, unsafe_allow_html=True)
                else:
                    message_alignment = "flex-start"
                    background_color = "#F8F9F9"
                    st.markdown(f"""
                        <div style="display:flex;justify-content:{message_alignment};margin-bottom:10px;">
                            <div style="background-color:{background_color};padding:10px;border-radius:10px;max-width:80%;">
                                <b>Assistant:</b><br>{msg["content"]}
                            </div>
                        </div>
                    """, unsafe_allow_html=True)

# amazonq-ignore-next-line
def about_page():
    """Render the about page."""
    st.title("About Me")
    
    # Two-column layout
    col1, col2 = st.columns([1, 2])
    
    # Profile picture with improved styling
    with col1:
        # Add custom CSS for the profile image
        st.markdown("""
            <style>
            .profile-img {
                border-radius: 50%;
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
                margin: 0 auto;
                display: block;
                max-width: 90%;
                object-fit: cover;
                aspect-ratio: 1;
            }
            </style>
        """, unsafe_allow_html=True)
        
        # Display the profile picture using multiple fallback methods
        try:
            # Try to use the base64 method first
            base64_img = get_image_as_base64("profile-picture.jpg")
            if base64_img:
                st.markdown(
                    f'<img src="data:image/jpeg;base64,{base64_img}" class="profile-img" alt="Lundi Zolisa Silolo">',
                    unsafe_allow_html=True
                )
            
                logger.info("Successfully displayed profile picture using base64 encoding")
            else:
                # Fall back to standard method if base64 encoding fails
                logger.info("Falling back to standard Streamlit image display method")
                try:
                    # Try multiple paths for the image
                    image_paths = [
                        "profile-picture.jpg",
                        os.path.join(os.getcwd(), "profile-picture.jpg"),
                        os.path.join(os.path.dirname(os.path.abspath(__file__)), "profile-picture.jpg"),
                        "static/images/profile-picture.jpg"  # Try the one in static folder as last resort
                    ]
                    
                    image_loaded = False
                    for img_path in image_paths:
                        if os.path.exists(img_path):
                            st.image(img_path, use_column_width=True)
                            logger.info(f"Successfully displayed profile picture from path: {img_path}")
                            image_loaded = True
                            break
                    
                    if not image_loaded:
                        # If all attempts fail, show placeholder
                        logger.warning("Could not find profile picture at any path, showing placeholder")
                        st.markdown("# 👨‍💻")
                except Exception as img_e:
                    logger.error(f"Error displaying profile image with st.image: {img_e}")
                    st.markdown("# 👨‍💻")
        except Exception as e:
            logger.error(f"Error in profile image display process: {e}")
            # Show a placeholder if image can't be displayed
            st.markdown("# 👨‍💻")
            
        st.markdown("---")
        
    with col2:
        st.subheader("Hi, I'm Lundi Zolisa Silolo")
        st.write("""
            I'm a passionate developer specializing in AWS cloud-native Data Science solutions and Serveless Architecture.
            
            This portfolio website showcases my projects and features a Cohere-powered
            assistant that can tell you more about my work.
        """)
        
        st.markdown("### Professional Experience")
        st.write("""
            I'm a dual AWS-certified (Cloud Practitioner & AI Practitioner) technical professional with hands-on experience in:
        """)
        
        # Use columns for better alignment of skills
        col_a, col_b = st.columns(2)
        
        with col_a:
            st.markdown("• Designing secure, scalable cloud architectures ☁️")
            st.markdown("• Building and implementing big data solutions 📊")
        
        with col_b:
            st.markdown("• Building MLOps pipelines with Amazon SageMaker 🤖")
            st.markdown("• Developing cloud-native data science solutions 📈")
        
        st.write("""
            I bridge the gap between complex business challenges and technological solutions through
            a combination of creativity, technical expertise, and a passion for learning.
        """)
        
        st.markdown("### Personal Skills")
        
        # Use columns for better alignment of personal skills
        col_c, col_d = st.columns(2)
        
        with col_c:
            st.markdown("• Strong communication skills 📣")
            st.markdown("• Analytical problem-solving abilities 🧩")
        
        with col_d:
            st.markdown("• Team collaboration and leadership 👥")
            st.markdown("• Continuous learning mindset 🌱")
            
        st.info("I'm always looking for new opportunities to learn and grow, so feel free to reach out!")
        
        # Skills section
        st.subheader("🔧 Technical Expertise")
        
        # Create tabs for different skill categories
        tabs = st.tabs(["Languages", "Core Skills", "Cloud", "AI/ML", "DevOps", "CI/CD", "Databases"])
        
        with tabs[0]:
            st.markdown("• **Python** - Primary programming language")
            st.markdown("• **AWS CLI** - Infrastructure automation")
            st.markdown("• **BASH** - Scripting and automation")
            st.markdown("• **SERVERLESS ARCHITECTURE** - Modern application design")
            
        with tabs[1]:
            st.markdown("• **HIGH AVAILABILITY** - Designing resilient systems")
            st.markdown("• **SECURITY** - Implementing best practices")
            st.markdown("• **LOGGING** - Comprehensive monitoring")
            st.markdown("• **INFRASTRUCTURE-AS-CODE** - Automated deployments with CloudFormation")
            st.markdown("• **AUTOMATION** - Streamlining operations")
            
        with tabs[2]:
            st.markdown("• **AWS Lambda** - Serverless compute")
            st.markdown("• **S3** - Object storage")
            st.markdown("• **DynamoDB** - NoSQL database")
            st.markdown("• **API Gateway** - API management")
            st.markdown("• **App Runner** - Container applications")
            
        with tabs[3]:
            st.markdown("• **MACHINE LEARNING OPERATIONS** - ML lifecycle management")
            st.markdown("• **SAGEMAKER** - ML model development")
            st.markdown("• **COMPREHEND** - Natural language processing")
            st.markdown("• **REKOGNITION** - Image and video analysis with sentiment analysis")
            st.markdown("• **DATA ANALYTICS WITH QUICKSIGHT** - Business intelligence")
            
        with tabs[4]:
            st.markdown("• **CLOUDFORMATION** - Infrastructure as code")
            st.markdown("• **CLOUDWATCH** - Monitoring and observability")
            st.markdown("• **CLOUDTRAIL** - API activity tracking")
            st.markdown("• **CLOUDFRONT** - Content delivery network")
            
        with tabs[5]:
            st.markdown("• **GITHUB ACTIONS** - Workflow automation")
            st.markdown("• **AWS CODEPIPELINE** - Continuous delivery")
            
        with tabs[6]:
            st.markdown("• **MySQL** - Relational database")
            st.markdown("• **DynamoDB** - NoSQL database")
            st.markdown("• **RDS** - Managed relational databases")
            st.markdown("• **Redshift** - Data warehousing")
        
        # Certifications section with badges
        st.subheader("🏆 AWS Certifications")
        cert_col1, cert_col2, cert_col3 = st.columns(3)
        
        with cert_col1:
            st.markdown("""
                <div style="border:1px solid #ddd; border-radius:10px; padding:10px; text-align:center;">
                    <h4>AWS Certified Cloud Practitioner</h4>
                    <a href="https://www.credly.com/badges/ddfa4ef8-bf17-46ea-9b78-db0a695f579a/public_url" target="_blank">
                        <div style="font-size:40px; margin:10px;">☁️</div>
                        <div>View Badge</div>
                    </a>
                </div>
            """, unsafe_allow_html=True)
            
        with cert_col2:
            st.markdown("""
                <div style="border:1px solid #ddd; border-radius:10px; padding:10px; text-align:center;">
                    <h4>AWS Certified AI Practitioner</h4>
                    <a href="https://www.credly.com/badges/ccd38d39-9b62-42ac-aa6d-7cbe86d1b013/public_url" target="_blank">
                        <div style="font-size:40px; margin:10px;">🤖</div>
                        <div>View Badge</div>
                    </a>
                </div>
            """, unsafe_allow_html=True)
            
        with cert_col3:
            st.markdown("""
                <div style="border:1px solid #ddd; border-radius:10px; padding:10px; text-align:center;">
                    <h4>AWS Well-Architected Proficient</h4>
                    <a href="https://www.credly.com/badges/83f3ee22-5f6c-4446-914b-0cb5ccb38b61/public_url" target="_blank">
                        <div style="font-size:40px; margin:10px;">🏗️</div>
                        <div>View Badge</div>
                    </a>
                </div>
            """, unsafe_allow_html=True)
        
        # Contact information
        st.subheader("Contact")
        st.markdown(f"[GitHub]({GITHUB_URL}) | [LinkedIn](http://linkedin.com/in/lundi-zolisa-s-144922163) | [Email](mailto:zolisasilolo@gmail.com)")

def main():
    """Main application entry point."""
    try:
        # Run health check first
        health_check()
        
        # Set page configuration
        st.set_page_config(
            page_title=APP_TITLE,
            page_icon="🚀",
            layout="wide",
            initial_sidebar_state="expanded"
        )
        
        # Initialize session state
        initialize_session_state()
        
        # Load custom CSS
        try:
            with open("static/styles.css") as f:
                st.markdown(f"<style>{f.read()}</style>", unsafe_allow_html=True)
                logger.info("Successfully loaded custom CSS")
        except Exception as e:
            logger.error(f"Error loading custom CSS: {e}")
            # Fallback inline CSS
            st.markdown("""
                <style>
                .stApp {
                    max-width: 1200px;
                    margin: 0 auto;
                }
                .stSidebar .sidebar-content {
                    background-color: #f8f9fa;
                }
                h1, h2, h3 {
                    color: #2C3E50;
                }
                </style>
            """, unsafe_allow_html=True)
        
        # Simple test to see if the app is running
        st.sidebar.title("Navigation")
        
        # Basic page selection
        page = st.sidebar.radio("Choose a page:", ["Portfolio", "Chatbot", "About"])
        
        # Display selected page
        if page == "Portfolio":
            portfolio_page()
        elif page == "Chatbot":
            chatbot_page()
        elif page == "About":
            about_page()
        
        # Footer
        st.sidebar.markdown("---")
        st.sidebar.markdown(f"© {2025} Lundi Zolisa Silolo | [GitHub]({GITHUB_URL})")
    
    except Exception as e:
        st.error(f"An error occurred: {str(e)}")
        logger.error(f"Application error: {str(e)}", exc_info=True)

if __name__ == "__main__":
    main()
