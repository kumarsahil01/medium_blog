import z from 'zod'

export const signupInput =z.object({
    username:z.string().email(),
    password:z.string().min(6),
    name:z.string().optional()
})

//type infrance in zod 
export type SignupInput =z.infer<typeof signupInput>

export const signinInput =z.object({
    username:z.string().email(),
    password:z.string().min(6),
    name:z.string().optional()
})

//create type infrance for the signin input infrance 

export type SigninInput = z.infer<typeof signinInput>


//create blog type infrence 
export const  createBlogInput=z.object({
    title:z.string(),
    content:z.string(),
})
export type CreateBlogInput =z.infer<typeof createBlogInput>


export const  updateBlogInput=z.object({
    title:z.string(),
    content:z.string(),
})
export type UpdateBlogInput =z.infer<typeof updateBlogInput>