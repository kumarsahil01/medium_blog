import { Hono } from "hono"
import { PrismaClient } from "@prisma/client/edge"
import { withAccelerate } from "@prisma/extension-accelerate"

//import self created  npm modules 
import { createBlogInput,updateBlogInput } from "@kumar_sahil/zodvalidation"
export const blogRouter= new Hono<{
    Bindings:{
        DATABASE_URL:string,
        JWT_SECRET:string
    },
    Variables:{
        userId:string
    }
}>

blogRouter.get('/bulk',async(c)=>{
    const prisma=new PrismaClient({
        datasourceUrl:c.env.DATABASE_URL
    }).$extends(withAccelerate())
    const posts =await prisma.post.findMany({

    })
    return c.json({posts})
})

blogRouter.get('/:id',async(c)=>{
    const id=c.req.param('id')

    //create connection with prisma client 
    const Client=new PrismaClient({
        datasourceUrl:c.env.DATABASE_URL
    }).$extends(withAccelerate())

    const post= await Client.post.findUnique({
        where:{
            id:id
        }
    })
    console.log(id)
    return c.json(post)
  })
  
  
blogRouter.post('/',async(c)=>{
    const id=c.get('userId');
    const body=await c.req.json();
    const prisma=new PrismaClient({
        datasourceUrl:c.env.DATABASE_URL
    }).$extends(withAccelerate())
     const {success}=createBlogInput.safeParse(body)
     if(!success){
        c.status(411)
        return c.json({
            message:"Inputs not correct "
        })
     }
    const post=await prisma.post.create({
        data:{
            title:body.title,
            content:body.content,
            authorId:id
        }
    })
    return c.json({
        id:post.id
    })
})
  
blogRouter.put('/update',async (c)=>{
  const id=c.get('userId');
  const body=await c.req.json();
  console.log(body)
  const prisma= new PrismaClient({
    datasourceUrl:c.env.DATABASE_URL
  }).$extends(withAccelerate());

//   const {success}=updateBlogInput.safeParse(body)
//   if(!success){
//     c.status(411)
//     return c.json({
//         message:"Inputs are not correct "
//     })
//   }
    prisma.post.update({
    where:{
        id:body.id,
        authorId:id
    },
    data:{
        title:body.title,
        content:body.content,
        
    }
  })
  return c.text('Post Updated Successfully ')

})
  