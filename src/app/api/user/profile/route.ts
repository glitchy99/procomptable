import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcrypt';

export async function PUT(request: Request) {
  try {
    // Get current session
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json(
        { message: 'Non autorisé' },
        { status: 401 }
      );
    }

    // Get request data
    const data = await request.json();
    const { name, email, currentPassword, newPassword } = data;

    // Get current user
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: {
        id: true,
        password: true,
        email: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { message: 'Utilisateur non trouvé' },
        { status: 404 }
      );
    }

    // Prepare update data
    const updateData: any = {};

    // Update name if provided
    if (name && name !== session.user.name) {
      updateData.name = name;
    }

    // Update email if provided and different
    if (email && email !== user.email) {
      // Check if email is already taken
      const existingUser = await prisma.user.findUnique({
        where: { email },
      });

      if (existingUser) {
        return NextResponse.json(
          { message: 'Cette adresse email est déjà utilisée' },
          { status: 400 }
        );
      }

      updateData.email = email;
    }

    // Handle password update if provided
    if (newPassword) {
      if (!currentPassword) {
        return NextResponse.json(
          { message: 'Le mot de passe actuel est requis' },
          { status: 400 }
        );
      }

      // Verify current password
      const isValid = await bcrypt.compare(currentPassword, user.password!);
      if (!isValid) {
        return NextResponse.json(
          { message: 'Mot de passe actuel incorrect' },
          { status: 400 }
        );
      }

      // Hash new password
      updateData.password = await bcrypt.hash(newPassword, 10);
    }

    // Only update if there are changes
    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { message: 'Aucune modification détectée' },
        { status: 400 }
      );
    }

    // Update user
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
      },
    });

    return NextResponse.json({
      message: 'Profil mis à jour avec succès',
      user: updatedUser,
    });
  } catch (error: any) {
    console.error('Profile update error:', error);
    return NextResponse.json(
      { message: 'Une erreur est survenue lors de la mise à jour du profil' },
      { status: 500 }
    );
  }
} 