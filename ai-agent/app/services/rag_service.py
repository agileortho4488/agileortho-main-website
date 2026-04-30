import os
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_community.document_loaders import PyPDFLoader, WebBaseLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_community.vectorstores import Chroma
from langchain.chains import create_retrieval_chain
from langchain.chains.combine_documents import create_stuff_documents_chain
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_core.chat_history import InMemoryChatMessageHistory
from dotenv import load_dotenv

load_dotenv()

class RAGService:
    def __init__(self):
        self.embeddings = None
        self.llm = None
        self.vector_store = None
        self.memory = {}
        self.db_dir = "./chroma_db"
        self.text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
        
    def initialize(self):
        print("Initializing RAG Service...")
        
        api_key = os.getenv("GOOGLE_API_KEY")
        if not api_key:
            print("WARNING: GOOGLE_API_KEY is not set.")

        self.embeddings = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")
        self.llm = ChatGoogleGenerativeAI(model="gemini-pro", temperature=0)
        
        self.vector_store = Chroma(
            collection_name="agile_healthcare",
            embedding_function=self.embeddings,
            persist_directory=self.db_dir
        )
        print("RAG Service Initialized.")

    def index_url(self, url: str):
        print(f"Indexing URL: {url}")
        try:
            loader = WebBaseLoader(url)
            docs = loader.load()
            splits = self.text_splitter.split_documents(docs)
            self.vector_store.add_documents(splits)
            print(f"Successfully indexed {url}")
        except Exception as e:
            print(f"Error indexing URL {url}: {e}")

    def index_pdf(self, file_path: str):
        print(f"Indexing PDF: {file_path}")
        try:
            loader = PyPDFLoader(file_path)
            docs = loader.load_and_split(self.text_splitter)
            self.vector_store.add_documents(docs)
            if os.path.exists(file_path):
                os.remove(file_path)
            print(f"Successfully indexed {file_path}")
        except Exception as e:
            print(f"Error indexing PDF {file_path}: {e}")

    def chat(self, user_message: str, session_id: str) -> str:
        if self.vector_store is None or self.llm is None:
            return "Please configure my AI brain and insert some data first!"

        retriever = self.vector_store.as_retriever(search_kwargs={"k": 5})

        if session_id not in self.memory:
            self.memory[session_id] = InMemoryChatMessageHistory()
            
        chat_history = self.memory[session_id]

        system_prompt = (
            "You are an intelligent AI assistant for Agile Ortho, a Meril Authorized Distributor focused on orthopedic mobility solutions. "
            "Use the retrieved context to answer the question. Focus on clarity and professionalism."
            "If you don't know the answer based on the context, state it nicely but provide relevant general advice if possible. "
            "\n\n"
            "{context}"
        )
        
        qa_prompt = ChatPromptTemplate.from_messages([
            ("system", system_prompt),
            MessagesPlaceholder("chat_history"),
            ("human", "{input}"),
        ])

        question_answer_chain = create_stuff_documents_chain(self.llm, qa_prompt)
        rag_chain = create_retrieval_chain(retriever, question_answer_chain)

        response = rag_chain.invoke({
            "input": user_message,
            "chat_history": chat_history.messages
        })
        
        ans = response["answer"]
        chat_history.add_user_message(user_message)
        chat_history.add_ai_message(ans)

        return ans

rag_service = RAGService()
