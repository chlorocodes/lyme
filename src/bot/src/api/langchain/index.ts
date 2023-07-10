import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import dotenv from 'dotenv'
import { OpenAIChat } from 'langchain/llms/openai'
import { MemoryVectorStore } from 'langchain/vectorstores/memory'
import { DirectoryLoader } from 'langchain/document_loaders/fs/directory'
import { TextLoader } from 'langchain/document_loaders/fs/text'
import { OpenAIEmbeddings } from 'langchain/embeddings/openai'
import { ConversationalRetrievalQAChain } from 'langchain/chains'
import { BufferMemory } from 'langchain/memory'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const { OPENAI_TOKEN } = dotenv.config({
  path: join(__dirname, '..', '..', '..', '.env')
}).parsed as Record<string, string>

const loader = new DirectoryLoader(join(__dirname, 'data', 'manga'), {
  '.txt': (path) => new TextLoader(path)
})

const docs = await loader.load()

const vectorStore = await MemoryVectorStore.fromDocuments(
  docs,
  new OpenAIEmbeddings()
)

const model = new OpenAIChat({
  openAIApiKey: OPENAI_TOKEN,
  temperature: 1,
  maxTokens: -1
})

const chain = ConversationalRetrievalQAChain.fromLLM(
  model,
  vectorStore.asRetriever(),
  {
    memory: new BufferMemory({
      memoryKey: 'chat_history'
    })
  }
)

const question = 'How did Boruto get his eye slashed?'

const res = await chain.call({
  question: question + ' Use bullet points'
})

console.log(res)

// console.log(`Question: ${question}\n`)
// console.log(`Answer: ${res.text ?? res}`)
