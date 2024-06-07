import * as dotenv from 'dotenv'
import OpenAI from 'openai'

dotenv.config()
const apiKey = process.env.PROXY_API_KEY
const baseURL = 'https://api.proxyapi.ru/openai/v1'

if (!apiKey) {
	throw Error('PROXY_API_KEY is not set')
}

const openai = new OpenAI({ apiKey, baseURL })

export default openai

export async function getEmbedding(text: string) {
	const response = await openai.embeddings.create({
		model: 'text-embedding-ada-002',
		input: text
	})

	const embedding = response.data[0].embedding

	if (!embedding) throw Error('Error generating embedding.')

	console.log(embedding)

	return embedding
}
