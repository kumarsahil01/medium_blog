import { Hono } from 'hono'
// import { PrismaClient } from '@prisma/client/extension'
import { PrismaClient } from '@prisma/client/edge';
import { withAccelerate } from '@prisma/extension-accelerate'
import { sign, verify } from 'hono/jwt';
import {blogRouter } from './routes/blog';
import {userRouter } from './routes/user';

//this binding help us to identify the right type of env 
const app = new Hono<{
  Bindings:{
    DATABASE_URL:string,
    JWT_SECRET:string
  },

}>();

app.use('/api/v1/blog/*', async (c, next) => {
	const jwt = c.req.header('Authorization');
	if (!jwt) {
		c.status(401);
		return c.json({ error: "unauthorized" });
	}
	const token = jwt.split(' ')[1];
	const payload = await verify(token, c.env.JWT_SECRET);
	if (!payload) {
		c.status(401);
		return c.json({ error: "unauthorized" });
	}
	c.set('userId', payload.id);
	await next()
})

app.route('/api/v1/user',userRouter)
app.route('/api/v1/blog',blogRouter)


app.get('/', (c) => {
  return c.text('Hello Hono!')
})



export default app;

