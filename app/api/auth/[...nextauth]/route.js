import NextAuth from "next-auth/next";
import GoogleProvider from "next-auth/providers/google";
import { connectToDB } from "@/utils/database";
import User from "@/models/user";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async session({ session }) {
      const sessionUser = await User.findOne({
        email: session.user.email,
      });
      if (sessionUser) {
        session.user.id = sessionUser._id.toString();
      }
      return session;
    },
    async signIn({ profile }) {
      try {
        await connectToDB();

        // Check if user already exists
        let user = await User.findOne({ email: profile.email });

        // If not, create new user
        if (!user) {
          let baseUsername = profile.name.replace(/\s+/g, "").toLowerCase();
          let username = baseUsername;
          let counter = 1;

          // Keep modifying the username until it is unique
          while (await User.findOne({ username })) {
            username = `${baseUsername}${counter}`;
            counter++;
          }

          user = await User.create({
            email: profile.email,
            username,
            image: profile.picture,
          });
        }

        return true;
      } catch (err) {
        console.log("Error during signIn:", err);
        return false;
      }
    }
  },
});

export { handler as GET, handler as POST };
