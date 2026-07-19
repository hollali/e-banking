'use server';

import { cookies } from 'next/headers';
import { eq } from 'drizzle-orm';
import { getDb } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { hashPassword, verifyPassword, createToken, verifyToken } from '@/lib/auth';
import { parseStringify } from '@/lib/utils';
import { checkRateLimit } from '@/lib/rateLimit';

export const signUp = async (userData: SignUpParams) => {
  try {
    const existingUser = await getDb().select().from(users).where(eq(users.email, userData.email)).limit(1);
    if (existingUser.length > 0) {
      return { error: 'An account with this email already exists.' };
    }

    const hashedPassword = await hashPassword(userData.password);

    const [newUser] = await getDb().insert(users).values({
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
    return { error: 'Failed to create account. Please try again.' };
  }
};

export const signIn = async ({ email, password }: signInProps) => {
  try {
    const rateLimitKey = `signin:${email}`;
    if (!checkRateLimit(rateLimitKey, 5, 15 * 60 * 1000)) {
      return { error: 'Too many sign-in attempts. Please try again in 15 minutes.' };
    }

    const [user] = await getDb().select().from(users).where(eq(users.email, email)).limit(1);
    if (!user) {
      return { error: 'No account found with this email address.' };
    }

    const isValid = await verifyPassword(password, user.password);
    if (!isValid) {
      return { error: 'Incorrect password. Please try again.' };
    }

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
    return { error: 'Failed to sign in. Please try again.' };
  }
};

export const getLoggedInUser = async () => {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('session');
    if (!sessionCookie) return null;

    const payload = await verifyToken(sessionCookie.value);
    if (!payload) return null;

    const [user] = await getDb().select().from(users).where(eq(users.id, payload.userId)).limit(1);
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
