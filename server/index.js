
import { createGenerator } from 'ts-json-schema-generator';
import temp from 'fs-temp/promises';

import Fastify from 'fastify'
import cors from '@fastify/cors'

const fastify = Fastify({
  logger: true
})

const start = async () => {
    try {
      await fastify.register(cors, { 
        // put your options here
      })
      fastify.post('/', async (request, reply) => {
        const { log, body } = request 
        const { code } = body || {}
        
        if(!code) {
          return reply.status(400).send()
        }
        
        const tempFilePath = await temp.template('%s.ts').writeFile(code, { encoding: 'utf-8' });
    
        try {
          
          const generator = createGenerator({
            path: tempFilePath,
            type: "*"
          });

          const schema = generator.createSchema('*');

          return schema;
        } catch(error) {
          log.error({msg: error.message}, 'received error from schema generation')
          reply.status(500).send(error.message)
        }
        
    })
      await fastify.listen({ port: 3000 })
    } catch (err) {
      fastify.log.error(err)
      process.exit(1)
    }
} 
start()