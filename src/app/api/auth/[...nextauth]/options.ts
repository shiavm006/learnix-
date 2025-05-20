import { NextAuthOptions } from "next-auth";
import  CredentialsProvider  from "next-auth/providers/credentials";
import bcrypt from "bcryptjs"
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/userModel";

export const authOptions: NextAuthOptions = {
    providers:[
        CredentialsProvider({
            id: "credentials",
            name: "Credentials",
            credentials: {
                email: { label: "Username", type: "text "},
                password: { label: "Password", type:"password" },
              },
              async authorize(credentials:any): Promise<any>{
                console.log(credentials)
                if(!credentials.identifier){
                    throw new Error("Fields cannot be empty")
                }
                await dbConnect()
                try {
                  const user =  await UserModel.findOne({
                        $or:[
                            {email: credentials.identifier},
                            {username:credentials.identifier}
                        ]
                    })
                    if(!user?.isVerified){
                        throw new Error("Please verify your account first, Sign Up to get the verification code!")
                    }
                    const isPasswordCorrect = await bcrypt.compare(credentials.password, user.password)
                    if(isPasswordCorrect){
                        return user
                    }else{
                        throw new Error("Incorrect password")
                    }
                    
                } catch (error: unknown) {
                    if (error instanceof Error) {             
                    throw new Error(error?.message)
                    }
                }
              }
        })
    ],
    callbacks:{
       async jwt({token, user}){
        if(user){
            token._id = user._id?.toString();
            token.isVerified = user.isVerified;
            token.isAcceptingMessages = user.isAcceptingMessages;
            token.username = user.username;
            token.isAdmin = user.isAdmin;
        }
        return token
       },
       async session({session, token}){
        if(token){
            session.user._id = token._id
            session.user.isVerified = token.isVerified
            session.user.isAcceptingMessages = token.isAcceptingMessages
            session.user.username = token.username
            session.user.isAdmin = token.isAdmin
        }
        return session
       },
    },
    pages:{
        signIn: "/signin"
    },
    session: {
        strategy: "jwt"
    },
    secret: process.env.NEXTAUTH_SECRET
}