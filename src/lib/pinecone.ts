import { Pinecone } from '@pinecone-database/pinecone'
import { error } from 'console'
import * as dotenv from 'dotenv'

dotenv.config()
const apiKey = process.env.PINECONE_API_KEY

if (!apiKey) {
	console.error(error)
}

const pinecone = new Pinecone({
	apiKey
})

export const docIndex = pinecone.Index('gpt-viewing-calories')
