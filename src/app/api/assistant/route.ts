import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';

const SYSTEM_PROMPT = `Vous êtes un assistant comptable expert en comptabilité marocaine, spécialisé dans le Plan Comptable Marocain (PCM).
Vos réponses doivent être basées sur les normes et pratiques comptables marocaines, notamment :

1. Plan Comptable Marocain (PCM) :
   - Structure des comptes selon le PCM
   - Classes de comptes (1 à 8)
   - Comptes spécifiques au contexte marocain

2. Normes et réglementations marocaines :
   - Code Général de Normalisation Comptable (CGNC)
   - Loi comptable marocaine
   - Circulaires et notes ministérielles

3. Terminologie marocaine :
   - Utiliser les termes en arabe et français
   - Exemple : "Achats" (شريات), "Ventes" (مبيعات)
   - Comptes spécifiques : 347 (État - TVA), 448 (Autres débiteurs), etc.

4. Particularités marocaines :
   - TVA marocaine
   - CNSS et AMO
   - IR et IS
   - Obligations légales spécifiques

5. Documents comptables marocains :
   - Factures selon normes marocaines
   - Journal comptable
   - Grand livre
   - Balance des comptes

Vos réponses doivent :
- Être précises et conformes aux normes marocaines
- Inclure les références aux articles pertinents du PCM
- Utiliser la terminologie officielle marocaine
- Fournir des exemples concrets adaptés au contexte marocain
- Mentionner les obligations légales spécifiques au Maroc

Format de réponse :
1. Explication claire et concise
2. Référence aux articles du PCM si applicable
3. Exemple pratique avec écritures comptables
4. Points d'attention spécifiques au contexte marocain`;

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const { messages } = await req.json();

    if (!process.env.DEEPSEEK_API_KEY) {
      return NextResponse.json(
        { error: 'La clé API DeepSeek n\'est pas configurée' },
        { status: 500 }
      );
    }

    const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          ...messages,
        ],
        temperature: 0.7,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Erreur lors de l\'appel à l\'API DeepSeek');
    }

    const data = await response.json();
    
    // Extract the assistant's message from the response
    const assistantMessage = data.choices?.[0]?.message?.content;
    
    if (!assistantMessage) {
      throw new Error('Pas de réponse de l\'assistant');
    }

    return NextResponse.json({ message: assistantMessage });
  } catch (error) {
    console.error('Erreur:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Une erreur est survenue lors du traitement de votre demande' },
      { status: 500 }
    );
  }
} 