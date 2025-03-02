// app/api/auth/[...nextauth]/route.js
import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account.provider === "google") {
        try {
          await connectToDatabase();
          
          // Check if user exists
          const existingUser = await User.findOne({ email: user.email });
          
          if (!existingUser) {
            // Create new user
            await User.create({
              email: user.email,
              name: user.name,
              image: user.image,
              gameState: {
                currentPath: null,
                progress: 0,
                balance: 0,
              }
            });
          }
          
          return true;
        } catch (error) {
          console.error("Error during sign in:", error);
          return false;
        }
      }
      return false;
    },
    async session({ session, token }) {
      if (session.user) {
        await connectToDatabase();
        const userData = await User.findOne({ email: session.user.email });
        session.user.id = userData._id.toString();
        session.user.gameState = userData.gameState;
      }
      return session;
    },
  },
  pages: {
    signIn: '/auth/signin',
  },
  session: {
    strategy: 'jwt',
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };