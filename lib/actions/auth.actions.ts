'use server';

import { cookies } from 'next/headers';
import { eq } from 'drizzle-orm';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { hashPassword, verifyPassword, createToken, verifyToken } from '@/lib/auth';
import { parseStringify } from '@/lib/utils';

export const signUp = async (userData: SignUpParams) => {
  try {
    const existingUser = await db.select().from(users).where(eq(users.email, userData.email)).limit(1);
    if (existingUser.length > 0) throw new Error('User already exists');

    const hashedPassword = await hashPassword(userData.password);

    const [newUser] = await db.insert(users).values({
      email: userData.email,
      password: hashedPassword,
      firstName: userData.firstName,
      lastName: userData.lastName,
      address: userData.address,
      city: userData.city,
      postalCode: userData.postalCode,
      dateOfBirth: userData.dateOfBirth,
      ssn: userData.ssn,
    }).returning();

    const token = await createToken({ userId: newUser.id, email: newUser.email });

    const cookieStore = await cookies();
    cookieStore.set('session', token, {
      path: '/',
      httpOnly: true,
      sameSite: 'strict',
      secure: true,
      maxAge: 60 * 60 * 24 * 7,
    });

    return parseStringify(getUserResponse(newUser));
  } catch (error) {
    console.error('Error signing up:', error);
    return null;
  }
};

export const signIn = async ({ email, password }: signInProps) => {
  try {
    const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1);
    if (!user) throw new Error('User not found');

    const isValid = await verifyPassword(password, user.password);
    if (!isValid) throw new Error('Invalid password');

    const token = await createToken({ userId: user.id, email: user.email });

    const cookieStore = await cookies();
    cookieStore.set('session', token, {
      path: '/',
      httpOnly: true,
      sameSite: 'strict',
      secure: true,
      maxAge: 60 * 60 * 24 * 7,
    });

    return parseStringify(getUserResponse(user));
  } catch (error) {
    console.error('Error signing in:', error);
    return null;
  }
};

export const getLoggedInUser = async () => {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('session');
    if (!sessionCookie) return null;

    const payload = await verifyToken(sessionCookie.value);
    if (!payload) return null;

    const [user] = await db.select().from(users).where(eq(users.id, payload.userId)).limit(1);
    if (!user) return null;

    return parseStringify(getUserResponse(user));
  } catch (error) {
    console.error('Error getting logged in user:', error);
    return null;
  }
};

export const logout = async () => {
  const cookieStore = await cookies();
  cookieStore.delete('session');
};

function getUserResponse(user: typeof users.$inferSelect) {
  return {
    $id: user.id,
    id: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    address: user.address,
    city: user.city,
    postalCode: user.postalCode,
    dateOfBirth: user.dateOfBirth,
    ssn: user.ssn,
  };
}
